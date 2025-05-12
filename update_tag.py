import json

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


def check_tags_in_attributes(attributes_data, key_tag, value_tag):
    """
    Kiểm tra từng tag trong {cat}_tags có xuất hiện trong thuộc tính sản phẩm không.
    """
    # print("Check sản phẩm: ", url)
    # print([attr['name'] for attr in attributes])  
    attributes = attributes_data['attributes']
    url = attributes_data['url']
    tags_lower = [attr['name'].lower() for attr in attributes] 

    for required_tag in value_tag:
        if any(required_tag in tag for tag in tags_lower):
            # print(f"✅ Có tag: {laptop_tag}")
            continue
        else:
            # print(f"❌ Không có tag: {laptop_tag}")
            if (url not in missing_tags):
                missing_tags[url] = [required_tag]
            else:
                missing_tags[url].append(required_tag)






