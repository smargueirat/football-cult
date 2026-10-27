#!/usr/bin/env python3
"""Botas de Pro:Direct España (prodirectsport.es) -> JSON para mine_boots.py.

Por qué (2026-09-30): Pro:Direct es de las tiendas de botas más grandes de
Europa, envía a la UE por 3,62 EUR (medido con el estimador de Shopify) y el
enlace directo lo monetiza Skimlinks. No tiene feed de afiliados, pero es un
Shopify abierto, igual que para camisetas.

Lo valioso: cada talle trae su EAN (`barcode`) y las etiquetas traen el
código del fabricante (ej. "IG0776"). Con el EAN, refresh_boots.py funde en
UNA ficha la misma bota que vende Foot-Store / Sport is Good / adidas, que
también traen EAN: comparación real, no por nombre ni por foto.

Cómo (2026-10-27): antes se pedía un /products/<handle>.js por bota (~8.500
el sábado, ~1.000 cada noche) y Pro:Direct empezó a limitarnos (429 tras 3-4
pedidos), así que no se refrescaba nunca. Ahora la colección football-boots
entera sale de /products.json en ~35 pedidos de 250 productos (precio, talle,
stock, etiquetas), por curl (ver shopify_feed_to_csv.curl_get). Lo único que
products.json no trae es el EAN: se guarda por (handle, talle) en
STATE_DIR/prodirect_es_boot_eans.json y solo se pide el .js de las botas que
tienen algún talle en stock sin EAN conocido, unas pocas por noche
(JS_CAP); las demás salen sin EAN hasta que una corrida siguiente lo llene.
  --all   misma pasada, pero llena hasta JS_CAP_ALL EAN pendientes (sábado)
  (nada)  hasta JS_CAP (cada noche)

Uso: python3 -u prodirect_es_boots_feed.py [--all] [/tmp/feeds/PRODIRECT_ES_BOOTS.json]
Prueba sin red: python3 check_prodirect_bulk.py
"""
import json, os, re, shutil, sys, time

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "catalog-mining"))
import shopify_feed_to_csv as shop

DOM = "www.prodirectsport.es"
COLLECTION = "football-boots"
JS_CAP, JS_CAP_ALL = 60, 600
# Accesorios, niños y sala: se descartan por el handle.
BAD = re.compile(r"kids|junior|youth|infant|baby|\bjr\b|-j-|bag|sock|insole|lace|tacos|stud|spray|cleaner|"
                 r"box|keyring|mini|indoor|futsal|-ic-|-in-|sala|trainer|slide|sandal|rugby")
STATE_DIR = os.path.expanduser("~/.local/state/fc-feeds")  # fuera de /tmp (tmpfs, se vacía al reiniciar)
# No empieza por PRODIRECT_: download_feeds.restore_prodirect() no lo copia a /tmp/feeds.
EAN_CACHE = os.path.join(STATE_DIR, "prodirect_es_boot_eans.json")


def size_of(v):
    return v.get("option1") or v.get("title")


def boot(p):
    """Producto de products.json -> entrada del JSON (sin EAN), o None si no es bota de adulto con stock."""
    tags = [t.lower() for t in p.get("tags") or []]
    h = p["handle"]
    if not re.search(r"boot|bota", h) or BAD.search(h):
        return None
    if p.get("product_type") != "Football Boots" or "age_adults" not in tags:
        return None
    variants = [{"size": size_of(v), "price": float(v["price"]), "ean": ""}
                for v in p.get("variants", []) if v.get("available")]
    if not variants:
        return None
    img = (p.get("images") or [{}])[0].get("src", "")
    return {
        "handle": h, "title": p["title"], "brand": p.get("vendor", ""),
        # El código del fabricante viene como una etiqueta más, en mayúsculas
        # y con dígitos, sin prefijo ("IG0776", "IO1496-001").
        "style": next((t for t in p.get("tags") or [] if re.fullmatch(r"[A-Z]{1,3}\d{3,5}(-\d{3})?", t)), ""),
        "ground": next((t.split("_", 1)[1] for t in tags if t.startswith("groundtype_")), ""),
        "url": f"https://{DOM}/products/{h}",
        "image": "https:" + img if img.startswith("//") else img,
        "variants": variants,
    }


def fill_eans(res, cache, cap):
    """Pone el EAN conocido en cada talle; pide el .js (hasta `cap`) de las botas
    con algún talle sin EAN en el caché. Devuelve cuántos .js pidió."""
    asked = 0
    for b in res:
        known = cache.get(b["handle"], {})
        if any(v["size"] not in known for v in b["variants"]) and asked < cap:
            asked += 1
            code, raw = shop.curl_get(f"{b['url']}.js", tries=2)
            if raw:
                # Todos los talles, también los agotados: si vuelven, ya se sabe su EAN
                # ("" si la tienda no lo trae: no se vuelve a pedir).
                known = cache[b["handle"]] = {**known, **{size_of(v): (v.get("barcode") or "").strip()
                                                           for v in json.loads(raw).get("variants", [])}}
            elif code == 429:
                print("  .js: nos limitan (429), el resto de EAN queda para otra noche", flush=True)
                cap = 0
            time.sleep(2)
        for v in b["variants"]:
            v["ean"] = known.get(v["size"], "")
    return asked


def load_cache(out_path):
    try:
        cache = json.load(open(EAN_CACHE))
    except (OSError, ValueError):
        cache = {}
    # Siembra con las salidas anteriores (las de antes de que existiera el caché).
    for path in (out_path, os.path.join(STATE_DIR, os.path.basename(out_path))):
        try:
            for b in json.load(open(path)):
                for v in b["variants"]:
                    if v.get("ean"):
                        cache.setdefault(b["handle"], {}).setdefault(v["size"], v["ean"])
        except (OSError, ValueError):
            pass
    return cache


def main(out_path, full):
    products = shop.catalog(DOM, COLLECTION)
    if products is None:
        sys.exit("products.json no respondió entero: no piso el archivo anterior")
    res = [b for b in map(boot, products) if b]
    print(f"{COLLECTION}: {len(products)} productos, {len(res)} botas de adulto con stock", flush=True)
    # Medido el 2026-10-27: 11.060 productos (45 páginas), 1.079 botas de adulto con stock.
    if len(products) < 5000 or len(res) < 50:
        sys.exit(f"solo {len(products)} productos / {len(res)} botas: algo falló, no piso el archivo anterior")
    cache = load_cache(out_path)
    asked = fill_eans(res, cache, JS_CAP_ALL if full else JS_CAP)
    os.makedirs(STATE_DIR, exist_ok=True)
    json.dump(cache, open(EAN_CACHE + ".tmp", "w"))
    os.replace(EAN_CACHE + ".tmp", EAN_CACHE)
    tmp = out_path + ".tmp"
    json.dump(res, open(tmp, "w"), ensure_ascii=False)
    os.replace(tmp, out_path)
    shutil.copy2(out_path, STATE_DIR)  # download_feeds.py lo restaura si /tmp se vacía
    vs = [v for b in res for v in b["variants"]]
    print(f"listo: {len(res)} botas con stock -> {out_path}; {asked} .js pedidos; "
          f"talles con EAN {sum(1 for v in vs if v['ean'])}/{len(vs)}; "
          f"botas sin ningún EAN {sum(1 for b in res if not any(v['ean'] for v in b['variants']))}", flush=True)


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if a != "--all"]
    main(args[0] if args else "/tmp/feeds/PRODIRECT_ES_BOOTS.json", "--all" in sys.argv)
