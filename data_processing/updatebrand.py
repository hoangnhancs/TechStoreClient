import json
import os

def update_brands(category):
    file_path = f"d:/E-Commerce Store/ProductData/{category}_data_full.json"
    
    if not os.path.exists(file_path):
        print(f"File {file_path} không tồn tại!")
        return
        
    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)
    
    unknown_count = sum(1 for item in data if item["brand"] == "Unknown")
    if unknown_count == 0:
        print(f"Không có brand Unknown trong {category}_data_full.json")
        return
        
    print(f"Đang xử lý {unknown_count} sản phẩm Unknown trong {category}_data_full.json")
    
    for item in data:
        if item["brand"] != "Unknown":
            continue
            
        name = item["name"].lower()
        
        # Xác định brand dựa vào danh mục sản phẩm
        if category == "laptop":
            if any(x in name for x in ["macbook", "imac", "mac mini", "mac studio"]):
                item["brand"] = "Apple"
            elif "asus" in name:
                item["brand"] = "ASUS"
            elif "acer" in name:
                item["brand"] = "Acer"
            elif "dell" in name:
                item["brand"] = "Dell"
            elif "hp" in name:
                item["brand"] = "HP"
            elif "msi" in name:
                item["brand"] = "MSI"
            elif "lenovo" in name:
                item["brand"] = "Lenovo"
            elif "gigabyte" in name:
                item["brand"] = "Gigabyte"
            elif "lg" in name:
                item["brand"] = "LG"
            elif "vaio" in name:
                item["brand"] = "Vaio"
            elif "masstel" in name:
                item["brand"] = "Masstel"
            elif "huawei" in name:
                item["brand"] = "Huawei"
                
        elif category == "monitor":
            if "samsung" in name:
                item["brand"] = "Samsung"
            elif "lg" in name:
                item["brand"] = "LG"
            elif "dell" in name:
                item["brand"] = "Dell"
            elif "asus" in name:
                item["brand"] = "ASUS"
            elif "aoc" in name:
                item["brand"] = "AOC"
            elif "benq" in name:
                item["brand"] = "BenQ"
            elif "viewsonic" in name:
                item["brand"] = "ViewSonic"
            elif "msi" in name:
                item["brand"] = "MSI"
            elif "philips" in name:
                item["brand"] = "Philips"
            elif "xiaomi" in name:
                item["brand"] = "Xiaomi"
            elif "gigabyte" in name:
                item["brand"] = "Gigabyte"
            elif "acer" in name:
                item["brand"] = "Acer"
            elif "lenovo" in name:
                item["brand"] = "Lenovo"    
            elif "e-dra" in name or "edra" in name:
                item["brand"] = "E-Dra"
            elif "dahua" in name:
                item["brand"] = "Dahua"
                
        elif category == "pc":
            if "apple" in name:
                item["brand"] = "Apple"
            elif "asus" in name:
                item["brand"] = "ASUS"
            elif "acer" in name:
                item["brand"] = "Acer"
            elif "dell" in name:
                item["brand"] = "Dell"
            elif "hp" in name:
                item["brand"] = "HP"
            elif "lenovo" in name:
                item["brand"] = "Lenovo"
            elif "msi" in name:
                item["brand"] = "MSI"
            elif "amd" in name:
                item["brand"] = "AMD"
            elif "intel" in name:
                item["brand"] = "Intel"
            elif "g01" in name:
                item["brand"] = "G01"
            elif "g03" in name:
                item["brand"] = "G03"
                
        elif category == "phone":
            if "iphone" in name:
                item["brand"] = "Apple"
            elif "samsung" in name:
                item["brand"] = "Samsung"
            elif "xiaomi" in name or "redmi" in name:
                item["brand"] = "Xiaomi"
            elif "oppo" in name:
                item["brand"] = "OPPO"
            elif "vivo" in name:
                item["brand"] = "Vivo"
            elif "nokia" in name:
                item["brand"] = "Nokia"
            elif "realme" in name:
                item["brand"] = "Realme"
            elif "nothing" in name:
                item["brand"] = "Nothing"
            elif "oneplus" in name:
                item["brand"] = "OnePlus"
            elif "google pixel" in name:
                item["brand"] = "Google"
            elif "infinix" in name:
                item["brand"] = "Infinix"
            elif "meizu" in name:
                item["brand"] = "Meizu"
            elif "tecno" in name:
                item["brand"] = "Tecno"
            elif "sony" in name:
                item["brand"] = "Sony"
            elif "itel" in name:
                item["brand"] = "Itel"
            elif "zte" in name or "nubia" in name:
                item["brand"] = "ZTE|Nubia"
            elif "masstel" in name:
                item["brand"] = "Masstel"
            elif "tcl" in name:
                item["brand"] = "TCL"
            elif "inoi" in name:
                item["brand"] = "Inoi"
            elif "benco" in name:
                item["brand"] = "Benco"
            elif "asus" in name:
                item["brand"] = "Asus"   
            elif "poco" in name:
                item["brand"] = "POCO"
        elif category == "printer":
            if "canon" in name:
                item["brand"] = "Canon"
            elif "hp" in name:
                item["brand"] = "HP"
            elif "epson" in name:
                item["brand"] = "Epson"
            elif "brother" in name:
                item["brand"] = "Brother"
            elif "xerox" in name:
                item["brand"] = "Xerox"
            elif "viettel" in name:
                item["brand"] = "Viettel"
                
        elif category == "tablet":
            if "ipad" in name:
                item["brand"] = "Apple"
            elif "samsung" in name or "galaxy tab" in name:
                item["brand"] = "Samsung"
            elif "xiaomi" in name:
                item["brand"] = "Xiaomi"
            elif "oppo" in name:
                item["brand"] = "OPPO"
            elif "huawei" in name:
                item["brand"] = "Huawei"
            elif "lenovo" in name:
                item["brand"] = "Lenovo"
            elif "nokia" in name:
                item["brand"] = "Nokia"
            elif "teclast" in name:
                item["brand"] = "Teclast"
            elif "tcl" in name:
                item["brand"] = "TCL"
            elif "kindle" in name:
                item["brand"] = "Kindle"
            elif "boox" in name:
                item["brand"] = "Boox"
            elif "masstel" in name:
                item["brand"] = "Masstel"
 
                
        elif category == "tv":
            if "samsung" in name:
                item["brand"] = "Samsung"
            elif "lg" in name:
                item["brand"] = "LG"
            elif "sony" in name:
                item["brand"] = "Sony"
            elif "xiaomi" in name:
                item["brand"] = "Xiaomi"
            elif "tcl" in name:
                item["brand"] = "TCL"
            elif "coocaa" in name:
                item["brand"] = "Coocaa"
            elif "aqua" in name:
                item["brand"] = "Aqua"
            elif "bayou" in name:
                item["brand"] = "Bayou"
            elif "camel" in name:
                item["brand"] = "Camel"
            elif "hisense" in name:
                item["brand"] = "Hisense"
            
                
        elif category == "watch":
            if "apple" in name:
                item["brand"] = "Apple"
            elif "samsung" in name or "galaxy watch" in name:
                item["brand"] = "Samsung" 
            elif "xiaomi" in name:
                item["brand"] = "Xiaomi"
            elif "huawei" in name:
                item["brand"] = "Huawei"
            elif "garmin" in name:
                item["brand"] = "Garmin"
            elif "amazfit" in name:
                item["brand"] = "Amazfit"
            elif "viettel" in name:
                item["brand"] = "Viettel"
            elif "masstel" in name:
                item["brand"] = "Masstel"
            elif "kavvo" in name:
                item["brand"] = "Kavvo"
            elif "riversong" in name:
                item["brand"] = "Riversong"
            elif "kieslect" in name:
                item["brand"] = "Kieslect"
            elif "coros" in name:
                item["brand"] = "Coros"
            elif "black shark" in name:
                item["brand"] = "Black Shark"
                
        elif category == "microphone":
            if "boya" in name:
                item["brand"] = "BOYA"
            elif "shure" in name:
                item["brand"] = "Shure"
            elif "saramonic" in name:
                item["brand"] = "Saramonic"
            elif "dji" in name:
                item["brand"] = "DJI"
            elif "rode" in name:
                item["brand"] = "RODE"
            elif "shure" in name:
                item["brand"] = "SHURE"
            elif "maono" in name:
                item["brand"] = "Maono"
            elif "akg" in name:
                item["brand"] = "AKG"
            elif "jbl" in name:
                item["brand"] = "JBL"
            elif "technica" in name:
                item["brand"] = "Audio Technica"
    
    # Đếm số lượng sản phẩm vẫn còn Unknown sau khi xử lý
    still_unknown = sum(1 for item in data if item["brand"] == "Unknown")
    
    # Ghi lại file JSON
    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)
    
    print(f"Đã cập nhật: {unknown_count - still_unknown} sản phẩm")
    print(f"Còn lại Unknown: {still_unknown} sản phẩm")
    # Thay dòng lỗi bằng:
    unknown_items = [item["name"] for item in data if item["brand"] == "Unknown"]
    if unknown_items:
        print("Các sản phẩm vẫn còn Unknown:", unknown_items[:5], "..." if len(unknown_items) > 5 else "")

# Danh sách các loại sản phẩm cần cập nhật
categories = ["camera", "laptop", "microphone", "monitor", "pc", "phone", "printer", "tablet", "tv", "watch"]

# Xử lý từng loại sản phẩm
for category in categories:
    print(f"\nĐang cập nhật brand cho {category}...")
    update_brands(category)

print("\nHoàn thành cập nhật brand cho tất cả các loại sản phẩm!")