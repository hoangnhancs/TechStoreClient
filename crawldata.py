import html
import json
import re
import time, tempfile
from bs4 import BeautifulSoup
import bs4
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium_stealth import stealth

def scroll_to_bottom(driver, scroll_attempts=10, scroll_step=1000, delay=0.2):
    current_height = 0
    for i in range(scroll_attempts):
        # Cuộn xuống một đoạn
        driver.execute_script(f"window.scrollBy(0, {scroll_step});")
        
        # Chờ để trang load nội dung và hiệu ứng hoàn tất
        time.sleep(delay)
        
        # Kiểm tra xem đã đến cuối trang chưa
        new_height = driver.execute_script("return document.documentElement.scrollTop")
        
        
        # Nếu đã đến cuối trang (vị trí cuộn không thay đổi)
        if new_height == current_height:
            break
            
        current_height = new_height

def setup_webdriver():
    chrome_options = Options()
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--headless")
    # Dùng thư mục profile tạm để tránh xung đột
    user_data_dir = tempfile.mkdtemp()
    chrome_options.add_argument(f"--user-data-dir={user_data_dir}")

    driver = webdriver.Chrome(options=chrome_options)

    stealth(driver,
        languages=["vi-VN", "vi"],
        vendor="Google Inc.",
        platform="Win32",
        webgl_vendor="Intel Inc.",
        renderer="Intel Iris OpenGL Engine",
        fix_hairline=True,
    )

    return driver

def generate_seo_fields(name: str):
    # Meta title = name
    meta_title = name.strip()

    # Meta description
    meta_description = f"Mua {name.strip()} giá tốt, chính hãng, bảo hành đầy đủ tại cửa hàng của chúng tôi."

    # Meta keywords: lọc từ name, bỏ các từ thường gặp
    common_words = {"chính", "hãng", "vn/a", "|"}
    words = [w.lower() for w in re.split(r"\W+", name) if w.lower() not in common_words and len(w) > 1]
    meta_keywords = ", ".join(dict.fromkeys(words))  # bỏ trùng

    # UrlSlug: chuyển name thành dạng slug
    slug = name.lower()
    slug = re.sub(r"[^\w\s-]", "", slug)  # bỏ ký tự đặc biệt
    slug = re.sub(r"\s+", "-", slug)  # khoảng trắng thành dấu gạch ngang
    slug = slug.strip("-")

    return {
        "UrlSlug": slug,
        "MetaTitle": meta_title,
        "MetaDescription": meta_description,
        "MetaKeywords": meta_keywords
    }

def crawl_menu_links (url):
    driver = setup_webdriver()
    menu_link = {}
    try:
        driver.get(url)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".label-menu-tree"))
        )
        soup = bs4.BeautifulSoup(driver.page_source, "html.parser")
        menu_tree_elems = soup.select('.label-menu-tree')
        print(len(menu_tree_elems))
        for menu_elem in menu_tree_elems:

            if (menu_elem.select("div.label-item.multiple")):
                link_elems = menu_elem.select("a.multiple-link")
                for link_elem in link_elems:
                    link = link_elem.get("href")
                    cat = link_elem.find("span").text.strip()
                    if cat not in menu_link:
                        menu_link[cat]= link

            else:
                link_elem = menu_elem.select_one("a.label-item")
                link = link_elem.get("href")
                cat = link_elem.find("span").text.strip()
                if cat not in menu_link:
                    menu_link[cat]= link

        print(len(menu_link))
    except Exception as e:
        print(f"Error during crawling: {e}")
    finally:
        # Đóng trình duyệt
        driver.quit()
    return menu_link

def crawl_product_attribute(url):
    driver = setup_webdriver()
    attributes = []

    try:
        print("Đang mở trang web...")
        driver.get(url)

        # Đợi 3 giây để trang tải sơ bộ
        time.sleep(3)

        # Sau khi đợi 3 giây, bắt đầu cuộn
        print("Đang cuộn trang...")
        scroll_to_bottom(driver)

        # Sau khi cuộn, tìm nút "Xem cấu hình chi tiết"
        selector = ".button__show-modal-technical"
        try:
            print("Đang tìm nút 'Xem cấu hình chi tiết'...")
            load_more_button = driver.find_element(By.CSS_SELECTOR, selector)
            print("Tìm thấy nút, đang scroll...")

            # Cuộn đến nút và chụp màn hình
            driver.execute_script("arguments[0].scrollIntoView(true);", load_more_button)
            time.sleep(3)
            driver.save_screenshot("before_click.png")
            print("Đã chụp màn hình 'before_click.png'")

            # Click nút
            driver.execute_script("arguments[0].click();", load_more_button)
            print("Đã click nút 'Xem cấu hình chi tiết'")

        except Exception as e:
            print("Không tìm thấy hoặc không click được nút:", e)
            driver.save_screenshot("error_click_button.png")
            return attributes

        # Đợi nội dung modal load xong
        time.sleep(3)

        soup = BeautifulSoup(driver.page_source, "html.parser")
        technical_content_modal = soup.select_one("ul.technical-content-modal")
        if not technical_content_modal:
            print("Không tìm thấy modal thông tin kỹ thuật.")
            return attributes

        technical_content_modal_items = technical_content_modal.select("li.technical-content-modal-item")
        for item in technical_content_modal_items:
            content_modal_group_name = item.select_one("p.title").text.strip()
            attr_items = item.select("div.modal-item-description > div")
            for i, attr in enumerate(attr_items):
                try:
                    name = attr.select_one("p").text.strip()
                    value = attr.select_one("div").text.strip()
                    attributes.append({
                        "name": name,
                        "value": value,
                        "displayorder": i,
                        "type": content_modal_group_name
                    })
                except Exception as e:
                    print(f"Lỗi khi xử lý thuộc tính: {e}")

    except Exception as e:
        print(f"Lỗi khi tải trang hoặc xử lý nút: {e}")
        driver.save_screenshot("error_general.png")
    finally:
        driver.quit()

    return attributes

def extract_products(soup, cat):
    """Trích xuất thông tin sản phẩm từ HTML"""
    products = []
    product_items = soup.select('div.product-item')

    if not product_items:
        print("Không tìm thấy sản phẩm. Kiểm tra lại selector.")
        return products

    for item in product_items:
        try:
            # Lấy thông tin sản phẩm
            name_elem = item.select_one('.product__name')

            name = name_elem.text.strip() if name_elem else "Unknown"


            url_elem = item.select_one('a.product__link')
            url = url_elem['href'] if url_elem and 'href' in url_elem.attrs else ""

            # Lấy giá mới
            price_elem = item.select_one('.product__price--show')
            price = price_elem.text.strip() if price_elem else "0"
            price = price.replace('đ', '').replace('.', '').strip()

            # Lấy giá cũ
            old_price_elem = item.select_one('.product__price--through')
            old_price = old_price_elem.text.strip() if old_price_elem else "0"
            old_price = old_price.replace('đ', '').replace('.', '').strip() if old_price else "0"
            # if "giá" in price or "Giá" in price:
            #     continue

            # Lấy discount
            discount_elem = item.select_one('.product__price--percent-detail')
            text = html.unescape(discount_elem.text) if discount_elem else "0"
            discount = re.search(r'\d+', text).group()

            # Lấy tags
            tags = []
            tags_elem = item.select('.product__more-info__item')
            for tag_elem in tags_elem:
                if ("hàng" not in tag_elem.text ):
                    tags.append(tag_elem.text)


            # Lấy ảnh
            img_elem = item.select_one('.product__img')
            img_url = ""
            if img_elem:
                if 'src' in img_elem.attrs and img_elem['src'] and 'data:image' not in img_elem['src']:
                    img_url = img_elem['src']
                elif 'data-src' in img_elem.attrs:
                    img_url = img_elem['data-src']

            # Brand từ tên sản phẩm
            brand = "Unknown"
            common_brands = ["Samsung", "Apple", "iPad", "Xiaomi", "Lenovo", "Huawei", "Nokia", "Teclast", "TCL"]
            for b in common_brands:
                if b.lower() in name.lower():
                    brand = b
                    if b == "iPad": brand = "Apple"
                    break
            seo_fields = generate_seo_fields(name)
            product = {
                'name': name,
                'url': url,
                'price': int(price) if price.isdigit() else 0,
                'old_price': int(old_price) if (old_price.isdigit() and int(old_price)>0) else int(price),
                'discount': int(discount) if discount.isdigit() else 0,
                'image_url': img_url,
                'brand': brand,
                'category': cat,
                'tags': tags,
                'quantityinstock': 200,
                'urlslug': seo_fields['UrlSlug'],
                'metatitle': seo_fields['MetaTitle'],
                'metadescription': seo_fields['MetaDescription'],
                'metakeywords': seo_fields['MetaKeywords'],
            }
            if (product['price'] > 0):
                products.append(product)

        except Exception as e:
            print(f"Error extracting product: {e}")
    return products

def crawl_with_selenium(url, cat, max_load_more=5):
    """Crawl trang web với nút 'Load More'"""
    print(f"Starting Selenium to crawl: {url}")
    driver = setup_webdriver()
    all_products = []

    try:
        driver.get(url)

        # Đợi trang tải xong
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "div.product-item"))
        )

        # Click nút "Xem thêm sản phẩm" nhiều lần
        load_more_count = 0

        while load_more_count < max_load_more:
            # Extract products from current page
            print("Analyzing current page...")
            soup = bs4.BeautifulSoup(driver.page_source, "html.parser")
            new_products = extract_products(soup, cat)

            # In ra số sản phẩm đã tìm thấy
            print(f"Found {len(new_products)} products. Total so far: {len(all_products) + len(new_products)}")

            # Thêm sản phẩm mới vào danh sách
            for product in new_products:
                if product not in all_products:  # Tránh trùng lặp
                    all_products.append(product)

            try:
                # THAY ĐỔI: Sử dụng selector đúng cho nút "Xem thêm"
                print("Looking for 'Xem thêm' button...")

                # Tìm nút bằng các selector khác nhau (vì website có thể thay đổi)
                selectors = [
                    "a.button__show-more-product",
                    ".cps-block-content_btn-showmore a",
                    ".btn-show-more"
                ]

                load_more_button = None
                for selector in selectors:
                    try:
                        load_more_button = WebDriverWait(driver, 3).until(
                            EC.element_to_be_clickable((By.CSS_SELECTOR, selector))
                        )
                        print(f"Found button with selector: {selector}")
                        break
                    except:
                        continue

                if not load_more_button:
                    print("Button not found with any selector")
                    break

                # In nội dung của button để debug
                print(f"Button text: {load_more_button.text}")

                # Cuộn đến nút và click
                driver.execute_script("arguments[0].scrollIntoView(true);", load_more_button)
                time.sleep(2)  # Đợi một chút để tránh lỗi

                # # Chụp ảnh màn hình để debug (tuỳ chọn)
                # driver.save_screenshot(f"before_click_{load_more_count}.png")

                # Click bằng JavaScript để đảm bảo
                driver.execute_script("arguments[0].click();", load_more_button)
                print("Clicked button using JavaScript")

                # Đợi sản phẩm mới tải
                time.sleep(5)

                load_more_count += 1
                print(f"Clicked 'Load More' button ({load_more_count}/{max_load_more})")

            except Exception as e:
                print(f"Không thể click nút 'Xem thêm': {e}")
                break

    except Exception as e:
        print(f"Error during crawling: {e}")
    finally:
        # Đóng trình duyệt
        driver.quit()

    # Lọc trùng lặp một lần nữa để đảm bảo
    unique_products = []
    unique_urls = set()
    for product in all_products:
        if product['url'] not in unique_urls:
            unique_urls.add(product['url'])
            unique_products.append(product)

    # Lưu dữ liệu vào file JSON
    with open('{}_data_full.json'.format(cat), 'w', encoding='utf-8') as f:
        json.dump(unique_products, f, ensure_ascii=False, indent=4)

    print(f"Done! Crawled {len(unique_products)} unique products in total")
    return unique_products


# menu_links = crawl_menu_links("https://cellphones.com.vn/")
tags = {
    "Âm thanh" : "audio",
    "Camera" : "camera",
    "Điện thoại" : "phone",
    "Đồ gia dụng" : "appliances",
    "Đồng hồ" : "watch",
    "Laptop" : "laptop",
    "Màn hình" : "monitor",
    "Máy inh" : "printer",
    "Mic thu âm": "microphone",
    "PC" : "pc",
    "Phụ kiện" : "accessory",
    "Tablet" : "tablet",
    "Tivi" : "tv",
}

# for tag in tags:
#     crawl_with_selenium(menu_links[tag], tags[tag], max_load_more=15)
# crawl_with_selenium('https://cellphones.com.vn/thiet-bi-am-thanh.html', "audio", max_load_more=15)

#them imgs

import json

with open('camera_data_full.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(type(data))  # <class 'list'>
print(data)



