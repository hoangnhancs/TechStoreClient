from fastapi import FastAPI
import psycopg2
from sentence_transformers import SentenceTransformer
import os
import re
import json
import sys

app = FastAPI()

# Load model (nhúng văn bản thành vector)
model = SentenceTransformer('all-MiniLM-L6-v2')  # hoặc bge-m3 nếu bạn dùng local GPU

# Neon DB info (sửa lại cho đúng)
DB_URL = os.getenv("NEON_DB_URL", "postgresql://neondb_owner:npg_rz73ZBsCciSG@ep-blue-waterfall-a1ue71zr-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require")

def get_connection():
    return psycopg2.connect(DB_URL)

def clean_description(raw: str) -> str:
    if not raw:
        return ""
    cleaned = raw.strip("{}")
    items = re.findall(r'"(.*?)"', cleaned)
    return ". ".join(item.strip() for item in items if item).strip()

def converttotext(product: dict) -> str:
    tags = product['tags']
    tags_norm = []
    for tag in tags:
        if (tag['name'] != None):
            tags_norm.append(tag['name'] + ": " + tag['value'])
    parts = [
        f"Name: {product['name']}",
        f"Description: {(' '.join(product['description']))}",
        f"Price: {product['old_price']} VND",
        f"Discount: {product['discount_percentage']}%",
        f"Category: {product['category_name']}",
        f"Brand: {product['brand_name']}",
        f"Tags: {', '.join(tags_norm) if len(tags_norm) > 0 else ''}"
    ]
    return ". ".join(parts)

def fetch_products():
    conn = get_connection()
    cur = conn.cursor()
    print("Fetching products...")
    cur.execute(
        """
            select 
                p.id, 
                p.name, 
                p.description, 
                p.old_price, 
                p.discount_percentage, 
                c.name as category_name, 
                b.name as brand_name, 
                ft.name as filter_tag_name, 
                ftv.value
            from "products" p
            left join "categories" c on p.category_id = c.id
            left join "brands" b on p.brand_id = b.id
            left join "product_tag_filters" ptf on p.id = ptf.product_id
            left join "filter_tag_values" ftv on ftv.id = ptf.filter_tag_value_id
            left join "filter_tags" ft on ft.id = ftv.filter_tag_id
        """
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()
    print("Fetched", len(rows), "products")
    products = {}
    for row in rows:
        pid = row[0]
        if pid not in products:
            products[pid] = {
                "id": pid,
                "name": row[1],
                "description": row[2],
                "old_price": row[3],
                "discount_percentage": row[4],
                "category_name": row[5],
                "brand_name": row[6],
                "tags":[],            
            }
        products[pid]["tags"].append({
            "name": row[7],
            "value": row[8]
        })
    return [{"id": p["id"], "text": converttotext(p)} for p in products.values()]
    # return products

def embed_all_products():
    products = fetch_products()
    result = []
    for p in products:
        result.append({
            "id": p["id"],
            "embedding": model.encode(p["text"]).tolist()
        })
    return result

def main():
    data = {
        "product_id": sys.argv[1],
        "vector": [0.12, 0.45, 0.67]
    }
    print(json.dumps(data))
    sys.exit(0)

if __name__ == "__main__":
    main()