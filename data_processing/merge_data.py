import json

def convert_array_to_dict(data):
    """
    Convert an array  to a dictionary with the url element as the key.
    """
    result = {}
    if not data:
        return {}
    for item in data:
        tmp = {}
        for key, value in item.items():
            if key != 'url':
                tmp[key] = value
        result[item['url']] = tmp
    return result
        

def merge_and_normalize_data(product_props, product_attributes):
    """
    Merge and normalize the product properties and attributes data.
    """
    product_props_dict = convert_array_to_dict(product_props)
    merged_data = []
    for item in product_attributes:
        tmp = {}
        tmp = product_props_dict[item['url']]
        for key, value in item.items():
            tmp[key] = value
        merged_data.append(tmp)
    return merged_data

cats = ['camera', 'laptop', 'phone', 'tablet', 'microphone', 'monitor', 'printer', 'tv', 'watch', 'pc']
for cat in cats:
    with open('D:\E-Commerce Store\ProductData\Json_data\{}_data_full.json'.format(cat), 'r', encoding='utf-8') as f:
        product_props = json.load(f)
    with open('D:\E-Commerce Store\ProductData\Json_data\{}_attributes_data_full.json'.format(cat), 'r', encoding='utf-8') as f:
        product_attributes = json.load(f)

    merged_data = merge_and_normalize_data(product_props, product_attributes)

    with open('D:\E-Commerce Store\ProductData\Json_data\{}_merge_data_full.json'.format(cat), 'w', encoding='utf-8') as f:
        json.dump(merged_data, f, ensure_ascii=False, indent=4)

# with open('D:\E-Commerce Store\ProductData\camera_data_full.json', 'r', encoding='utf-8') as f:
#     product_props = json.load(f)

# product_props_dict = convert_array_to_dict(product_props)

# with open('D:\E-Commerce Store\ProductData\camera_attributes_data_full.json', 'r', encoding='utf-8') as f:
#     product_attributes = json.load(f)


# merge_data = []

# for item in product_attributes:
#     tmp = {}
#     tmp = product_props_dict[item['url']]
#     for key, value in item.items():
#         tmp[key] = value
#     merge_data.append(tmp)

    

# with open('D:\E-Commerce Store\ProductData\camera_merge_data_full.json', 'w', encoding='utf-8') as f:
#     json.dump(merge_data, f, ensure_ascii=False, indent=4)



# size = len(product_attributes)

# print((product_props))



