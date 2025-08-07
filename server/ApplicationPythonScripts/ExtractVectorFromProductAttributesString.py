from fastapi import FastAPI
from sentence_transformers import SentenceTransformer
import sys

app = FastAPI()

# Load model (nhúng văn bản thành vector)
model = SentenceTransformer('all-MiniLM-L6-v2')  # hoặc bge-m3 nếu bạn dùng local GPU

if __name__ == "__main__":
    # embeddings = embed_all_products()
    # print(json.dumps(embeddings))  # In ra stdout để .NET đọc
    test_string = sys.argv[1]
    # test_string  = "Name: Smart Tivi LG LED 4K 43 inch 2024 (43UT8050), Description: Bộ xử lý thông minh AI nâng cao chất lượng hình ảnh và âm thanh, cho trải nghiệm xem phim và chơi game tuyệt vời hơn.Công nghệ AI Picture Pro: Nâng cao chất lượng hình ảnh bằng cách phân tích và tối ưu hóa nội dung theo từng khung hình.Hỗ trợ G-Sync và FreeSync: Giảm hiện tượng xé hình và giật hình cho trải nghiệm chơi game mượt mà hơn.Âm thanh vòm 360 độ, loa tích hợp công suất lớn, cho trải nghiệm âm thanh chân thực và sống động., Price: 11990000, Discount: 31%, Category: Tivi, Brand: LG, Tags: kích cỡ: 43 inch, loại tivi: Smart tivi, độ phân giải: 4K, tần số quét: 60Hz,"
    encode_result = model.encode(test_string).tolist()
    print(encode_result)
