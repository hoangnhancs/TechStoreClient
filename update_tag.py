import json
import re

camera_tags = ["phân giải"]
laptop_tags = ["ổ cứng", "ram", "cpu", "kích thước", "độ phân giải", "card"]
micro_tags = ["loại micro"]
monitor_tags = ["độ phân giải", "kích thước", "tần số quét", "tấm nền", "kiểu màn hình"]
pc_tags = ["cpu", "ram", "card", "ổ cứng"]
phone_tags = ["chip", "ram", "bộ nhớ", "tần số quét", "kích thước"]
printer_tags = ["chức năng"]
tablet_tags = ["bộ nhớ", "ram", "kích thước", "chip"]
tv_tags = ["kích cỡ", "loại tivi", "phân giải", "tần số quét"]
watch_tags = ["kích thước", "chất liệu viền"]

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
    # Tìm trong attributes
    if "attributes" in item and item["attributes"]:
        for attr in item["attributes"]:
            if isinstance(attr, dict):
                for k, v in attr.items():
                    if tag.lower() in k.lower():
                        return v
            elif isinstance(attr, str):
                if tag.lower() in attr.lower():
                    return attr
    # Tìm trong descriptions
    if "descriptions" in item and item["descriptions"]:
        for desc in item["descriptions"]:
            if tag.lower() in desc.lower():
                # Lấy cụm từ sau tag
                match = re.search(rf"{tag}[:\- ]*([^\.,;]*)", desc, re.I)
                if match:
                    return match.group(1).strip()
    # Tìm trong name
    if "name" in item and tag.lower() in item["name"].lower():
        match = re.search(rf"{tag}[:\- ]*([^\.,;]*)", item["name"], re.I)
        if match:
            return match.group(1).strip()
    # Tìm trong metakeywords
    if "metakeywords" in item and tag.lower() in item["metakeywords"].lower():
        return tag
    return None

def update_tags_for_item(item, tags_template):
    tags = []
    for tag in tags_template:
        value = extract_tag_value(tag, item)
        if value:
            tags.append(f"{tag}: {value}")
    item["tags"] = tags
    return item

# Ví dụ cho 1 sản phẩm
item = {
    "name": "Laptop HP 250 G9 AG2K7AT",
    "attributes": [],
    "descriptions": ["Màn hình 15.6 inch Full HD cho hình ảnh sắc nét và rõ ràng, rất phù hợp cho việc xem phim và làm việc."],
    "metakeywords": "laptop, hp, 250, g9, ag2k7at"
}
tags_template = ["ổ cứng", "ram", "cpu", "kích thước", "độ phân giải", "card"]
item = update_tags_for_item(item, tags_template)
print(item["tags"])