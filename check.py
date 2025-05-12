import json 
cats = ['camera', 'laptop', 'phone', 'tablet', 'microphone', 'monitor', 'printer', 'tv', 'watch', 'pc']
for cat in cats:
    with open('D:\E-Commerce Store\ProductData\Json_data\{}_attributes_data_full.json'.format(cat), 'r', encoding='utf-8') as f:
        product_attributes = json.load(f)
    check = []
    for _ in product_attributes:
        imgs = _['imgs']
        check.extend(imgs)
    set_check = set(check)
    print(cat, ": ",len(set_check), len(check))
    

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


for key, value in tags_dict.items():
    with open('D:/E-Commerce Store/ProductData/Json_data/{}_attributes_data_full.json'.format(key), 'r', encoding='utf-8') as f:
        product_attributes = json.load(f)
    missing_tags = {}

    def check_tags_in_attributes(attributes, url):
        """
        Kiểm tra từng tag trong {cat}_tags có xuất hiện trong thuộc tính sản phẩm không.
        """
        # print("Check sản phẩm: ", url)
        # print([attr['name'] for attr in attributes])  
        tags_lower = [attr['name'].lower() for attr in attributes]

        for required_tag in value:
            if any(required_tag in tag for tag in tags_lower):
                # print(f"✅ Có tag: {laptop_tag}")
                continue
            else:
                # print(f"❌ Không có tag: {laptop_tag}")
                if (url not in missing_tags):
                    missing_tags[url] = [required_tag]
                else:
                    missing_tags[url].append(required_tag)

    for item in product_attributes:
        tags = []
        attributes = item['attributes']
        check_tags_in_attributes(attributes, item['url'])  
    print(len(missing_tags))
    with open('D:\E-Commerce Store\ProductData\Json_data\{}_missing_tags.json'.format(key), 'w', encoding='utf-8') as f:
        json.dump(missing_tags, f, ensure_ascii=False, indent=4)

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

camera_resolution = ["1MP", "2MP", "3MP", "4MP", "Trên 5MP"]
def convert_camera_attribute_to_tag(camera_attributes, tags):
    tags = {}
    url = camera_attributes['url']
    attributes = camera_attributes['attributes']
    attributes_name_lower = [attr['name'].lower() for attr in attributes]
    for tag_type in camera_tags:
        for attribute in attributes_name_lower:
            if tag_type in attribute:
                if (tag_type == "phân giải"):

                    
                


# for key, value in tags_dict.items():
#     with open('D:/E-Commerce Store/ProductData/Json_data/{}_attributes_data_full.json'.format(key), 'r', encoding='utf-8') as f:
#         product_attributes = json.load(f)
#     missing_tags = {}

#     def check_tags_in_attributes(attributes, url):
#         """
#         Kiểm tra từng tag trong {cat}_tags có xuất hiện trong thuộc tính sản phẩm không.
#         """
#         # print("Check sản phẩm: ", url)
#         # print([attr['name'] for attr in attributes])  
#         tags_lower = [attr['name'].lower() for attr in attributes]

#         for required_tag in value:
#             if any(required_tag in tag for tag in tags_lower):
#                 # print(f"✅ Có tag: {laptop_tag}")
#                 continue
#             else:
#                 # print(f"❌ Không có tag: {laptop_tag}")
#                 if (url not in missing_tags):
#                     missing_tags[url] = [required_tag]
#                 else:
#                     missing_tags[url].append(required_tag)

#     for item in product_attributes:
#         tags = []
#         attributes = item['attributes']
#         check_tags_in_attributes(attributes, item['url'])  
#     print(len(missing_tags))
#     with open('D:\E-Commerce Store\ProductData\Json_data\{}_missing_tags.json'.format(key), 'w', encoding='utf-8') as f:
#         json.dump(missing_tags, f, ensure_ascii=False, indent=4)



for key, value in tags_dict.items():
    with open('D:/E-Commerce Store/ProductData/Json_data/{}_attributes_data_full.json'.format(key), 'r', encoding='utf-8') as f:
        product_attributes = json.load(f)
    missing_tags = {}

    def check_tags_in_attributes(attributes, url):
        """
        Kiểm tra từng tag trong {cat}_tags có xuất hiện trong thuộc tính sản phẩm không.
        """
        # print("Check sản phẩm: ", url)
        # print([attr['name'] for attr in attributes])  
        tags_lower = [attr['name'].lower() for attr in attributes]

        for required_tag in value:
            if required_tag == "phân giải" or required_tag == "độ phân giải":
                for tag in tags_lower:
                    if required_tag in tag:



