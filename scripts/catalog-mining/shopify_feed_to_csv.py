"""Turns a public Shopify storefront's /products.json into a CSV shaped
like an Awin datafeed export, so it can run through extract.py/pick.py
unchanged. Use this for an approved Awin advertiser that has no
AWIN_FEED_URL_* datafeed but does run a public Shopify store (see
README.md, "Stores without an Awin datafeed CSV").

Usage:
    python3 shopify_feed_to_csv.py <domain> <awinmid> <out_csv>
    # e.g. python3 shopify_feed_to_csv.py mysteryshirtclub.com 124324 /tmp/msc.csv
"""
import csv, re, sys, urllib.parse, urllib.request, json

AWINAFFID = "3013769"


def parse_size(opt):
    o = (opt or "").upper()
    if re.search(r"\b(XXXXL|4XL)\b", o): return "4XL"
    if re.search(r"\b(XXXL|3XL)\b", o): return "3XL"
    if re.search(r"\b(XXL|2XL)\b", o): return "XXL"
    if re.search(r"\bXL\b", o): return "XL"
    if re.search(r"\bXS\b", o): return "XS"
    if re.search(r"\bS\b", o) or "SMALL" in o: return "S"
    if re.search(r"\bM\b", o) or "MEDIUM" in o: return "M"
    if re.search(r"\bL\b", o) or "LARGE" in o: return "L"
    return ""


def fetch_page(domain, page):
    url = f"https://{domain}/products.json?limit=250&page={page}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)["products"]


def build(domain, awinmid, out_csv):
    rows = []
    for page in range(1, 41):
        products = fetch_page(domain, page)
        if not products:
            break
        for p in products:
            title = p["title"]
            product_url = f"https://{domain}/products/{p['handle']}"
            image = p["images"][0]["src"] if p.get("images") else ""
            deep_link = (
                f"https://www.awin1.com/cread.php?awinmid={awinmid}"
                f"&awinaffid={AWINAFFID}&ued={urllib.parse.quote(product_url, safe='')}"
            )
            for v in p["variants"]:
                if not v.get("available"):
                    continue
                rows.append({
                    "product_name": title,
                    "price": v.get("price"),
                    "custom_1": parse_size(v.get("option1")),
                    "aw_deep_link": deep_link,
                    "aw_image_url": image,
                    "product_url": product_url,
                })
    with open(out_csv, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=[
            "product_name", "price", "custom_1", "aw_deep_link", "aw_image_url", "product_url",
        ])
        w.writeheader()
        w.writerows(rows)
    print(f"products seen across pages, in-stock variant rows written: {len(rows)}")


if __name__ == "__main__":
    domain, awinmid, out_csv = sys.argv[1], sys.argv[2], sys.argv[3]
    build(domain, awinmid, out_csv)
