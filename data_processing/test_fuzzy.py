from fuzzywuzzy import fuzz
from fuzzywuzzy import process

# Danh sách tag chuẩn của bạn (ví dụ nhóm RAM)
standard_tags = [
    "4GB", "8GB", "12GB", "16GB", "24GB", "32GB",
    "36GB", "48GB", "64GB"
]

# Tag người dùng nhập vào
input_tag = "ram 16 gb"

# Tìm tag phù hợp nhất
match, score = process.extractOne(input_tag, standard_tags)

print(f"Matched: {match}, Score: {score}")
