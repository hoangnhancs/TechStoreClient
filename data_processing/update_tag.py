import json
import re
from rapidfuzz import process, fuzz
import unicodedata

def get_storage_size(text):
    """
    Trích xuất dung lượng lưu trữ (GB hoặc TB) từ chuỗi text.
    Trả về chuỗi như '128GB', '1TB', '512GB', v.v.
    """
    if not text:
        return None
    match = re.search(r"(\d+(?:\.\d+)?)\s*(GB|TB)", text.upper())
    if match:
        return f"{int(float(match.group(1)))}{match.group(2)}"
    return None

def extract_resolution_pc(text):
    """
    Trích xuất độ phân giải màn hình từ text, ví dụ: 1920x1080, 2560 x 1440
    """
    if not text:
        return None
    match = re.search(r"(\d{3,4})\s*[x×]\s*(\d{3,4})", text)
    if match:
        return f"{match.group(1)}x{match.group(2)}"
    return None

def extract_resolution_tv(text):
    """
    Trích xuất độ phân giải TV từ text, ví dụ: 3840x2160, 1920x1080, 2K, 4K, 8K, v.v.
    """
    if not text:
        return None
    # Ưu tiên match dạng số trước
    match = re.search(r"(\d{3,4})\s*[x×]\s*(\d{3,4})", text)
    if match:
        return f"{match.group(1)}x{match.group(2)}"
    # Match các từ 2K, 3K, 4K, 8K, FullHD, UltraHD, v.v.
    match = re.search(r"\b([23468]K|FULL\s?HD|ULTRA\s?HD|QHD|FHD|HD)\b", text.upper())
    if match:
        return match.group(1).replace(" ", "")
    return None

def extract_camera_resolution(text):
    """
    Trích xuất độ phân giải camera, ví dụ: 48MP, 12 MP, 108mp
    """
    if not text:
        return None
    match = re.search(r"(\d+(\.\d+)?)\s*mp", text.lower())
    if match:
        return f"{match.group(1)}MP"
    return None

def extract_refresh_rate(text):
    """
    Trích xuất tần số quét, ví dụ: 60Hz, 144 Hz, 165hz
    """
    if not text:
        return None
    match = re.search(r"(\d{2,3})\s*hz", text.lower())
    if match:
        return f"{match.group(1)}Hz"
    return None

def normalize(text):
    if not text:
        return ""
    text = unicodedata.normalize("NFKD", text).encode("ASCII", "ignore").decode("utf-8")
    text = re.sub(r"[^a-zA-Z0-9\s]", "", text.lower())
    text = re.sub(r"\s+", " ", text).strip()
    return text

def extract_cpu(text):
    """
    Trích xuất tên CPU từ text, ví dụ: Intel Core i5-1240P, AMD Ryzen 7 5800H, Apple M2, Snapdragon 8cx Gen 3
    """
    if not text:
        return None
    text = text.strip()
    # Intel Core iX, iX-xxxx, iX xxxx, Intel Core Ultra, AMD Ryzen, Apple M, Snapdragon
    patterns = [
        r"(intel\s+core\s+i\d{1,2}(?:[\s\-][\w\d\-]+)?)",
        r"(intel\s+core\s+ultra\s+\d+[\w\-]*)",
        r"(amd\s+ryzen\s+\d{1,2}(?:[\s\-][\w\d\-]+)?)",
        r"(snapdragon\s+[\w\d\s\-]+)",
        r"(apple\s+m\d+(?:\s+(?:pro|max|ultra))?)",   # Apple M2 Max, Apple M3 Ultra
        r"\b(m\d+(?:\s+(?:pro|max|ultra))?)\b"        # M2, M3 Max, M4 Ultra
    ]
    for pat in patterns:
        match = re.search(pat, text, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    return None

def extract_number_attribute(tag, value):
    extract_value = None
    if (tag == "ổ cứng"):
        extract_value = get_storage_size(value)   
    elif (tag == "độ phân giải"):
        # extract_value = extract_resolution_pc(value)
        extract_value = extract_resolution_tv(value)
    elif (tag == "phân giải"):
        extract_value = extract_camera_resolution(value)
    elif (tag == "tần số quét"):
        extract_value = extract_refresh_rate(value)
    elif (tag == "cpu"):
        extract_value = extract_cpu(value)
    else:
        extract_value = value
    return extract_value

storage_size_map = {
    128: "128GB SSD",
    256: "256GB SSD",
    512: "512GB SSD NVMe PCIe",
    1: "1TB SSD NVMe PCIe",
    2: "2TB SSD NVMe PCIe",
}
camera_resolution = ['4MP', '50MP', '8MP', '20MP', '5MP', '2MP', '6MP', '72MP', '3MP', '27MP', '10MP']
laptop_harddisk = ["128GB SSD", "256GB SSD", "512GB SSD NVMe PCIe", "1TB SSD NVMe PCIe", "2TB SSD NVMe PCIe"]
laptop_ram = ["4GB", "8GB", "12GB", "16GB", "24GB", "32GB", "36GB", "48GB", "64GB"]
laptop_cpu = ["Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9", "Intel Core Ultra 5 125H", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9", "Apple M2", "Apple M3", "Apple M4", "Snapdragon"]
laptop_size = ["13.6 inches", "14 inches", "14.2 inches", "15.6 inches", "16 inches", "16.2 inches", "24 inches"]
laptop_resolution= ["FullHD (1920x1080)", "FullHD+ (1920x1200)", "2K (2560x1600)", "3K (2880x1800)", "4K (3840x2160)", "4.5K (4480x2520)"]
laptop_card = ["Intel Iris Xe Graphics", "Intel UHD Graphics", "Intel Arc Graphics", "NVIDIA GeForce RTX 2050", "NVIDIA GeForce RTX 3050", "NVIDIA GeForce RTX 4050", "NVIDIA GeForce RTX 4060", "AMD Radeon Graphics", "Apple GPU", "Qualcomm Adreno GPU"]
microphone_type = ['iOS, Type-C', 'Type-C, Lightning', 'Type-C', 'Lightning', 'iOS']
monitor_resolution = ["1920x1080", "1920x1200", "2560x1080", "2560x1440", "3440x1440",
    "3840x2160", "5120x1440", "5120x2880"]
monitor_size = ["23.7 inches", "23.8 inches", "24 inches", "24.1 inches", "24.5 inches", 
    "25 inches", "27 inches", "29 inches", "32 inches", "34 inches", 
    "49 inches", "15.6 inches", "16 inches", "21.5 inches", "22 inches"]
monitor_hz = ["60Hz", "75Hz", "100Hz", "120Hz", "144Hz", "165Hz", "175Hz", 
    "180Hz", "185Hz", "200Hz", "240Hz"]
monitor_panel = ["IPS", "Tấm nền IPS", "VA", "WVA", "OLED"]
monitor_type = ["Màn hình phẳng", "Màn hình cong", "Giá treo"]
pc_cpu = ["Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9", "Intel Core Ultra 5 125H", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9", "Apple M2", "Apple M3", "Apple M4", "Snapdragon"]
pc_ram = ["4GB", "8GB", "12GB", "16GB", "24GB", "32GB", "36GB", "48GB", "64GB"]
pc_card = ["Intel Iris Xe Graphics", "Intel UHD Graphics", "Intel Arc Graphics", "NVIDIA GeForce RTX 2050", "NVIDIA GeForce RTX 3050", "NVIDIA GeForce RTX 4050", "NVIDIA GeForce RTX 4060", "Radeon RX 6500", "Apple GPU", "Qualcomm Adreno GPU"]
pc_harddisk = ["128GB SSD", "256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD", "4TB SSD"]
phone_chip = ["Snapdragon", "Apple A", "Mediatek Dimensity", "Mediatek Helio", "Exyos", "Unisoc"]
phone_ram = ['6 GB', '12 GB', '4 GB', '8 GB', '16 GB']
phone_harddisk = ['1 TB', '128 GB', '512 GB', '64 GB', '256 GB']
phone_hz = ['144Hz', '60Hz', '120Hz', '90Hz']
phone_size = ['6.5 inches', '6.8 inches', '7.6 inches', '6.7 inches', '6.6 inches', '6.3 inches', '6.2 inches', '6.9 inches',  '8.1 inches', '6.1 inches']
printer_task = ['Scan', 'In 2 mặt', 'In 1 mặt', 'In Wifi', 'Copy']
tablet_chip = ['Apple A', 'Apple M1', 'Apple M2', 'Apple M3', 'Apple M4', 'Snapdragon', 'Mediatek Helio']
tablet_harddisk = ['64 GB', '512 GB', '16 GB', '256 GB', '32 GB', '2 TB', '128 GB', '1 TB']
tablet_ram = ['4 GB', '16 GB', '3 GB', '2 GB', '12 GB', '6 GB', '8 GB']
tablet_size = ['13.1 inches', '8.7 inches', '6.1 inches', '12.4 inches', '7.0 inches', '8.3 inches', '7.8 inches', '11.2 inches', '10.9 inches', '10.4 inches', '10.1 inches', '10.8 inches', '13 inches', '6.0 inches', '10.3 inches', '11 inches', '12.9 inches', '12.2 inches', '12.1 inches', '14.6 inches', '11.5 inches']
tv_size = ['32 - 55 inch', '85 inch', '75 inch', '50 inch', '43 inch', '32 - 75 inch', '85 inch', '88 inch', '40 - 80 inch', '27 inch', '65 inch', '55 - 90 inch', '55 inch', '32 inch']
tv_resolution = ['8K', '4K', 'FULLHD', 'HD']
tv_type = ['Tivi OLED', 'Smart tivi', 'Tivi LED', 'Google tivi', 'Tivi NanoCell']
tv_hz = ['60Hz', '144Hz', '120Hz', '100Hz', '50Hz']
watch_size = ['0.9 inch', '1.00 inch', '1.2 inch', '1.5 inch', '2.0 inch', '46mm', '41mm']
watch_material = ['Hợp kim', 'Gốm', 'Thép', 'Polymer', 'Titanium', 'Nhôm', 'Nhựa']

camera_tags = {"phân giải": camera_resolution}
laptop_tags = {
    "ổ cứng": laptop_harddisk, 
    "ram": laptop_ram, 
    "cpu": laptop_cpu, 
    "kích thước": laptop_size, 
    "độ phân giải": laptop_resolution, 
    "card": laptop_card
}
micro_tags = {"loại micro": microphone_type}
monitor_tags = {
    "độ phân giải": monitor_resolution, 
    "kích thước": monitor_size, 
    "tần số quét": monitor_hz, 
    "tấm nền": monitor_panel, 
    "kiểu màn hình": monitor_type
}
pc_tags = {"cpu": pc_cpu, "ram": pc_ram, "card": pc_card, "ổ cứng": pc_harddisk}
phone_tags = {
    "chip": phone_chip, 
    "ram": phone_ram, 
    "bộ nhớ": phone_harddisk, 
    "tần số quét": phone_hz, 
    "kích thước": phone_size
}
printer_tags = {"chức năng": printer_task}
tablet_tags = {"bộ nhớ": tablet_harddisk, "ram": tablet_ram, "kích thước": tablet_size, "chip": tablet_chip}
tv_tags = {"kích cỡ": tv_size, "loại tivi": tv_type, "độ phân giải": tv_resolution, "tần số quét": tv_hz}
watch_tags = {"kích thước": watch_size, "chất liệu viền": watch_material}



tags_dict = {
    "camera": camera_tags,
    "laptop": laptop_tags,
    "microphone": micro_tags,
    "monitor": monitor_tags,
    "pc": pc_tags,
    "phone": phone_tags,
    "printer": printer_tags,
    "tablet": tablet_tags,
    "tv": tv_tags,
    "watch": watch_tags
}

def extract_tag_value(tag, item):
    if tag.lower() == "kiểu màn hình" and "giá treo" in item["name"].lower():
        return "giá treo"
    if tag.lower() == "chip" and "iphone" in item["name"].lower():
        return "Apple A"
    # Tìm trong attributes
    if "attributes" in item and item["attributes"]:
        for attr in item["attributes"]:
            if isinstance(attr, dict):
                if tag.lower() in attr["name"].lower():           
                    extract_tag_value = extract_number_attribute(tag, attr["value"])
                    if extract_tag_value:
                        return extract_tag_value
                    else:
                        continue 
            elif isinstance(attr, str):
                if tag.lower() in attr.lower():
                    extract_tag_value = extract_number_attribute(tag, attr)
                    if extract_tag_value:
                        return extract_tag_value
                else:
                    continue
    # Tìm trong descriptions
    if "descriptions" in item and item["descriptions"]:
        for desc in item["descriptions"]:
            if tag.lower() in desc.lower():
                extract_tag_value = extract_number_attribute(tag, desc.lower()) 
                if extract_tag_value:
                    return extract_tag_value
    # Tìm trong name
    if "name" in item and tag.lower() in item["name"].lower():
        extract_tag_value = extract_number_attribute(tag, item["name"].lower()) 
        if extract_tag_value:
            return extract_tag_value
    # Tìm trong metakeywords
    if "metakeywords" in item and tag.lower() in item["metakeywords"].lower():
        return tag
    return None
warnings = []
notes = []
def update_tags_for_item(item, tags_template):
    print(f'Processing item: {item["url"]}')
    notes.append(f'Processing item: {item["url"]}')
    tags = {}
    match = None
    score = 0
    for tag in tags_template:
        value = extract_tag_value(tag, item)   
        if value:
            match, score, _ = process.extractOne(value, watch_tags[tag])
            tags[tag] = match
        else:
            warnings.append(f"Warning: No value extracted for tag '{tag}' in item {item['url']}")
            notes.append(f"Warning: No value extracted for tag '{tag}' in item {item['url']}")
            continue
        print(f"Tag: {tag}, Value: {value}, Matched: {match} Score: {score}")
        notes.append(f"Tag: {tag}, Value: {value}, Matched: {match} Score: {score}")
    item["filter_tags"] = tags
    return item, tags



with open('D:/E-Commerce Store/ProductData/Json_data/watch_merge_data_full.json', 'r', encoding='utf-8') as f:
    items = json.load(f)
check_tags_dict = {
    # "ổ cứng" : set(), 
    # "ram": set(), 
    # "cpu": set(), 
    "kích thước": set(), 
    # "kích cỡ": set(),
    # "độ phân giải": set(), 
    # "tần số quét": set(),
    # "loại tivi": set(),
    # "tấm nền": set(),
    # "kiểu màn hình": set(),
    # "card": set()
    # "loại micro": set(),
    # "bộ nhớ": set(),
    # "chip": set(),
    # "chức năng": set()
    "chất liệu viền": set()
}

# print(get_storage_size("1TB có thể nâng cấp lên tới 512TB SSD NVMe PCIe"))
# text = "Màn hình 15.6 inch, độ phân giải 1920 x 1080, tần số quét 144Hz, camera 48MP, Tag: cpu, Value: AMD Ryzen 5 7235HS (4 lõi / 8 luồng, 3.2 / 4.2GHz, 2MB L2 / 8MB L3),  Score: 85.5"
# print(get_storage_size(text))
# print(extract_resolution_pc(text))
# print(extract_camera_resolution(text))
# print(extract_refresh_rate(text))
# print(extract_cpu(text))
# count = 0
# new_items = []
# for item in items:
#     for tag in check_tags_dict:
#         value = extract_tag_value(tag, item)        
#         if value:
#             check_tags_dict[tag].add(value)
#             count += 1

# print(count)
# print(check_tags_dict)  

# for item in items:
#     updated_item, tags = update_tags_for_item(item, watch_tags)

# with open('D:/E-Commerce Store/ProductData/Json_data/watch_final_data.json', 'w', encoding='utf-8') as f:
#     json.dump(items, f, ensure_ascii=False, indent=2)
# with open('D:/E-Commerce Store/ProductData/Json_data/watch_note_data.txt', 'w', encoding='utf-8') as f:
#     json.dump(notes, f, ensure_ascii=False, indent=2)

 
# with open('D:/E-Commerce Store/ProductData/Text_data/check_laptop_tags.txt', 'w', encoding='utf-8') as f:
#     json.dump(check_tags_dict, f, ensure_ascii=False, indent=4)

# item = {
#         "name": "MacBook Air M4 13 inch 2025 10CPU 8GPU 16GB 256GB | Chính hãng Apple Việt Nam",
#         "price": 26490000,
#         "old_price": 26990000,
#         "discount": 2,
#         "image_url": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/macbook_11_1.png",
#         "brand": "Apple",
#         "category": "laptop",
#         "tags": [],
#         "quantityinstock": 200,
#         "urlslug": "macbook-air-m4-13-inch-2025-10cpu-8gpu-16gb-256gb-chính-hãng-apple-việt-nam",
#         "metatitle": "MacBook Air M4 13 inch 2025 10CPU 8GPU 16GB 256GB | Chính hãng Apple Việt Nam",
#         "metadescription": "Mua MacBook Air M4 13 inch 2025 10CPU 8GPU 16GB 256GB | Chính hãng Apple Việt Nam giá tốt, chính hãng, bảo hành đầy đủ tại cửa hàng của chúng tôi.",
#         "metakeywords": "macbook, air, m4, 13, inch, 2025, 10cpu, 8gpu, 16gb, 256gb, apple, việt, nam",
#         "url": "https://cellphones.com.vn/apple-macbook-air-13-m4-10cpu-8gpu-16gb-256gb-2025.html",
#         "attributes": [
#             {
#                 "name": "Loại card đồ họa",
#                 "value": "GPU 8 lõi \nNeural Engine 16 lõi \nCông nghệ dò tia tốc độ cao bằng phần cứng\nBăng thông bộ nhớ 120GB/s",
#                 "displayorder": 0,
#                 "type": "Bộ xử lý & Đồ họa"
#             },
#             {
#                 "name": "Loại CPU",
#                 "value": "CPU 10 lõi với 4 lõi hiệu năng và 6 lõi tiết kiệm điện",
#                 "displayorder": 1,
#                 "type": "Bộ xử lý & Đồ họa"
#             },
#             {
#                 "name": "Dung lượng RAM",
#                 "value": "16GB",
#                 "displayorder": 2,
#                 "type": "Bộ nhớ RAM, Ổ cứng"
#             },
#             {
#                 "name": "Ổ cứng",
#                 "value": "256GB",
#                 "displayorder": 3,
#                 "type": "Bộ nhớ RAM, Ổ cứng"
#             },
#             {
#                 "name": "Chất liệu tấm nền",
#                 "value": "Tấm nền IPS",
#                 "displayorder": 4,
#                 "type": "Màn hình"
#             },
#             {
#                 "name": "Kích thước màn hình",
#                 "value": "13.6 inches",
#                 "displayorder": 5,
#                 "type": "Màn hình"
#             },
#             {
#                 "name": "Công nghệ màn hình",
#                 "value": "Màn hình Liquid Retina \nCó đèn nền LED\nMật độ 224 pixel mỗi inch\nĐộ sáng 500 nit\nHỗ trợ một tỷ màu\nDải màu rộng (P3)\nCông nghệ True Tone",
#                 "displayorder": 6,
#                 "type": "Màn hình"
#             },
#             {
#                 "name": "Độ phân giải màn hình",
#                 "value": "2560 x 1664 pixels",
#                 "displayorder": 7,
#                 "type": "Màn hình"
#             },
#             {
#                 "name": "Công nghệ âm thanh",
#                 "value": "Hệ thống âm thanh bốn loa\n Hỗ trợ Âm Thanh Không Gian khi phát nhạc hoặc video với Dolby Atmos trên loa tích hợp\n Âm Thanh Không Gian với khả năng theo dõi chuyển động đầu chủ động khi sử dụng AirPods, AirPods Pro, và AirPods Max",
#                 "displayorder": 8,
#                 "type": "Âm thanh"
#             },
#             {
#                 "name": "Khe đọc thẻ nhớ",
#                 "value": "Không",
#                 "displayorder": 9,
#                 "type": "Cổng kết nối"
#             },
#             {
#                 "name": "Wi-Fi",
#                 "value": "Wi-Fi 6E (802.11ax)",
#                 "displayorder": 10,
#                 "type": "Cổng kết nối"
#             },
#             {
#                 "name": "Bluetooth",
#                 "value": "Bluetooth 5.3",
#                 "displayorder": 11,
#                 "type": "Cổng kết nối"
#             },
#             {
#                 "name": "Cổng giao tiếp",
#                 "value": "Cổng sạc MagSafe 3\n Jack cắm tai nghe 3.5 mm\n Hai cổng Thunderbolt 4 (USB-C) hỗ trợ: Sạc  / DisplayPort / Thunderbolt 4 (lên đến 40Gb/s) / USB 4 (lên đến 40Gb/s)",
#                 "displayorder": 12,
#                 "type": "Cổng kết nối"
#             },
#             {
#                 "name": "Chất liệu",
#                 "value": "Vỏ kim loại",
#                 "displayorder": 13,
#                 "type": "Kích thước & Trọng lượng"
#             },
#             {
#                 "name": "Chất liệu vỏ trên",
#                 "value": "Nhôm",
#                 "displayorder": 14,
#                 "type": "Kích thước & Trọng lượng"
#             },
#             {
#                 "name": "Chất liệu vỏ dưới",
#                 "value": "Nhôm",
#                 "displayorder": 15,
#                 "type": "Kích thước & Trọng lượng"
#             },
#             {
#                 "name": "Kích thước",
#                 "value": "Cao: 1.13 cm x  Rộng: 30.41 cm x Dài: 21.5 cm",
#                 "displayorder": 16,
#                 "type": "Kích thước & Trọng lượng"
#             },
#             {
#                 "name": "Trọng lượng",
#                 "value": "1.24 kg",
#                 "displayorder": 17,
#                 "type": "Kích thước & Trọng lượng"
#             },
#             {
#                 "name": "Tính năng đặc biệt",
#                 "value": "Wi-Fi 6, Bảo mật vân tay",
#                 "displayorder": 18,
#                 "type": "Tiện ích khác"
#             },
#             {
#                 "name": "Loại đèn bàn phím",
#                 "value": "Bàn phím Magic Keyboard có đèn nền \nBàn di chuột Force Touch để điều khiển con trỏ chính xác và cảm ứng lực; hỗ trợ Bấm Mạnh, bộ tăng tốc, vẽ cảm ứng lực, và các thao tác Multi‑Touch",
#                 "displayorder": 19,
#                 "type": "Tính năng khác"
#             },
#             {
#                 "name": "Bảo mật",
#                 "value": "Touch ID",
#                 "displayorder": 20,
#                 "type": "Tính năng khác"
#             },
#             {
#                 "name": "Webcam",
#                 "value": "Camera 12MP Center Stage có hỗ trợ chế độ Desk View\n Quay video HD 1080p\n Bộ xử lý tín hiệu hình ảnh tiên tiến với video điện toán",
#                 "displayorder": 21,
#                 "type": "Tính năng khác"
#             },
#             {
#                 "name": "Hệ điều hành",
#                 "value": "macOS",
#                 "displayorder": 22,
#                 "type": "Tính năng khác"
#             },
#             {
#                 "name": "Pin",
#                 "value": "Thời gian xem video trực tuyến lên đến 18 giờ\nThời gian duyệt web trên mạng không dây lên đến 15 giờ\nPin Li-Po 53.8 watt‑giờ tích hợp",
#                 "displayorder": 23,
#                 "type": "Pin & công nghệ sạc"
#             }
#         ],
#         "descriptions": [
#             "MacBook Air 13 M4 2025 sở hữu thiết kế siêu mỏng nhẹ với màu sắc sang trọng, độ dày chỉ 1.13 cm và trọng lượng 1.24 kg.",
#             "Máy được trang bị chip M4 thế hệ mới nhất của Apple với 10 CPU và 8 GPU, mang lại hiệu năng xử lý mạnh mẽ và khả năng đồ họa ấn tượng.",
#             "RAM 16GB và ổ cứng SSD 256GB giúp đa nhiệm mượt mà, khởi động nhanh chóng và lưu trữ đủ dùng cho công việc hàng ngày.",
#             "Màn hình Liquid Retina 13.6 inch với độ phân giải 2560x1664 pixels cho hình ảnh sắc nét, màu sắc chân thực và độ sáng cao lên đến 500 nits."
#         ],
#         "imgs": [
#             "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/macbook_11_1.png",
#             "https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_2__9_14.png",
#             "https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_3__7_25.png",
#             "https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_4__7_82.png",
#             "https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_5__8_83.png",
#             "https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_6__3_12.png"
#         ]
#     }

# update_tags_for_item(item, laptop_tags)
# for warn in warnings:
#     print(warn)
print(tags_dict)
with open('D:/E-Commerce Store/ProductData/Json_data/tags_dict.json', 'w', encoding='utf-8') as f:
    json.dump(tags_dict, f, ensure_ascii=False, indent=4)

