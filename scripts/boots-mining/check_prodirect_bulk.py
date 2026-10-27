#!/usr/bin/env python3
"""Pro:Direct por products.json, sin red: paginación, EAN heredado, .js solo para lo nuevo y con tope."""
import json, os, sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "catalog-mining"))
import prodirect_es_boots_feed as feed
import refresh_offers
import shopify_feed_to_csv as shop

feed.time.sleep = shop.time.sleep = lambda s: None
calls = []


def fake(pages, js):
    def get(url, tries=3):
        calls.append(url)
        if url.endswith(".js"):
            h = url.rsplit("/", 1)[1][:-3]
            return (200, json.dumps(js[h]).encode()) if h in js else (429, None)
        n = int(url.rsplit("page=", 1)[1])
        p = pages.get(n, [])
        return (500, None) if p is None else (200, json.dumps({"products": p}).encode())
    shop.curl_get = get


def prod(h, sizes, avail=True, kind="Football Boots", age="age_adults"):
    return {"handle": h, "title": h, "vendor": "Nike", "product_type": kind,
            "tags": [age, "groundtype_firmground", "FJ2586-002"], "images": [{"src": "https://x/1.jpg"}],
            "variants": [{"option1": s, "price": "90.00", "available": avail} for s in sizes]}


# Paginación: sigue hasta la página vacía; una página fallida = None (nunca medio catálogo).
fake({1: [prod("a-boot", ["42"])], 2: [prod("b-boot", ["43"])]}, {})
assert [p["handle"] for p in shop.catalog("d", "c")] == ["a-boot", "b-boot"]
fake({1: [prod("a-boot", ["42"])], 2: None}, {})
assert shop.catalog("d", "c") is None

# Filtro: solo bota de adulto con stock, ni niño ni accesorio ni agotada.
assert feed.boot(prod("kids-boot", ["32"], age="age_kids")) is None
assert feed.boot(prod("x-boot", ["42"], avail=False)) is None
assert feed.boot(prod("a-boot", ["42"], kind="Accessories")) is None
b = feed.boot(prod("a-boot", ["42", "43"]))
assert b["style"] == "FJ2586-002" and b["ground"] == "firmground" and b["variants"][0]["price"] == 90.0

# EAN: "old-boot" lo tiene en caché -> sin .js; "new-boot" y "new2-boot" no -> .js, con tope 1.
res = [feed.boot(prod(h, ["42"])) for h in ("old-boot", "new-boot", "new2-boot")]
cache = {"old-boot": {"42": "111"}}
calls.clear()
fake({}, {"new-boot": {"variants": [{"option1": "42", "barcode": "222"}, {"option1": "44", "barcode": "444"}]}})
assert feed.fill_eans(res, cache, cap=1) == 1 and calls == ["https://www.prodirectsport.es/products/new-boot.js"]
assert [v["ean"] for b in res for v in b["variants"]] == ["111", "222", ""]
assert cache["new-boot"] == {"42": "222", "44": "444"}  # también el talle agotado
# 429 en un .js: no se piden más esa noche, la corrida sigue.
calls.clear()
assert feed.fill_eans(res, cache, cap=10) == 1 and len(calls) == 1

# Camisetas: products.json trae euros en texto, .js céntimos; sin stock -> inStock false.
assert refresh_offers.prodirect_new({"variants": [{"option1": "M", "price": "85.00", "available": True},
                                                  {"option1": "L", "price": "34.00", "available": False}]}) == \
    {"stock": "true", "price": 85.0, "sizes": ["M"]}
assert refresh_offers.prodirect_new({"variants": [{"option1": "S", "price": 8500, "available": True}]})["price"] == 85.0
assert refresh_offers.prodirect_new({"variants": [{"option1": "S", "price": "1", "available": False}]}) == {"stock": "false"}
print("ok")
