import requests
import json
import os
import re
from tqdm import tqdm

def sanitize_filename(name: str) -> str:
    return re.sub(r'[<>:"/\\|?*]', '_', name)

cats = ['camera', 'laptop', 'phone', 'tablet', 'microphone', 'monitor', 'printer', 'tv', 'watch', 'pc']
error_imgs = []
success_imgs = []

base_folder = 'D:\E-Commerce Store\ProductData\Image_data'  
os.makedirs(base_folder, exist_ok=True) 

for cat in cats:
    with open(f'D:\\E-Commerce Store\\ProductData\\Json_data\\{cat}_merge_data_full.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    for item in tqdm(data, desc=f"Đang tải ảnh {cat}"):
        name = sanitize_filename(item['url'])
        imgs_url = item['imgs']
        
        folder_path = os.path.join(base_folder, cat, name)
        os.makedirs(folder_path, exist_ok=True)  

        for img_url in imgs_url:
            try:
                response = requests.get(img_url, timeout=10)
                if response.status_code == 200:
                    filename = os.path.basename(img_url)
                    filepath = os.path.join(folder_path, filename)

                    with open(filepath, 'wb') as img_file:
                        img_file.write(response.content)
                    print(f'✅ Đã tải ảnh: {img_url}')
                    success_imgs.append(img_url)
                else:
                    print(f'❌ Không thể tải ảnh: {img_url} (Lỗi {response.status_code})')
                    error_imgs.append(img_url)
            except Exception as e:
                print(f'⚠️ Lỗi khi tải ảnh {img_url}: {e}')
                error_imgs.append(img_url)

with open('error_imgs.txt', 'w', encoding='utf-8') as f:
    json.dump(error_imgs, f, ensure_ascii=False, indent=4)

with open('success_imgs.txt', 'w', encoding='utf-8') as f:
    json.dump(success_imgs, f, ensure_ascii=False, indent=4)
