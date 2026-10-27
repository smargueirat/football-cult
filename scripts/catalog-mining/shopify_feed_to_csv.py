"""Turns a public Shopify storefront's /products.json into a CSV shaped
like an Awin datafeed export, so it can run through extract.py/pick.py
unchanged. Use this for an approved Awin advertiser that has no
AWIN_FEED_URL_* datafeed but does run a public Shopify store (see
README.md, "Stores without an Awin datafeed CSV").

Usage:
    python3 shopify_feed_to_csv.py <domain> <awinmid> <out_csv>
    # e.g. python3 shopify_feed_to_csv.py mysteryshirtclub.com 124324 /tmp/msc.csv
"""
import csv, re, subprocess, sys, time, urllib.parse, urllib.request, json

AWINAFFID = "3013769"
def curl_get(url, tries=3):
    """(código HTTP, cuerpo o None). Va por curl y no por urllib: medido el
    2026-10-27, el Cloudflare de Pro:Direct da 429 (Retry-After: 60) a urllib
    desde la primera consulta mientras deja pasar a curl en el mismo minuto.
    Sin --compressed: con Accept-Encoding la tienda UK responde 403 (desafío).
    404/410 = el producto ya no existe; 429/5xx/403 se reintentan respetando
    Retry-After (hasta 2 min)."""
    code = 0
    for i in range(tries):
        r = subprocess.run(["curl", "-sS", "-m", "90", "-A", "Mozilla/5.0",
                            "-w", "\n%{http_code} %header{retry-after}", url], capture_output=True)
        body, _, tail = r.stdout.rpartition(b"\n")
        code_s, _, ra = tail.decode(errors="replace").partition(" ")
        code = int(code_s) if code_s.isdigit() else 0
        if code in (200, 404, 410):
            return code, body if code == 200 else None
        if i < tries - 1:
            ra = ra.strip()
            time.sleep(min(int(ra), 120) if ra.isdigit() else 15 * (i + 1))
    return code, None


def catalog(domain, collection, pause=1.5):
    """Toda una colección por /collections/<c>/products.json, 250 productos por
    pedido (un .js por producto ya no pasa: Pro:Direct limita, oct-2026). None si
    alguna página falló o se llegó al tope de Shopify (página 100 = 25.000): un
    catálogo a medias haría pasar por agotado lo que no se llegó a leer."""
    out = []
    for page in range(1, 101):
        code, body = curl_get(f"https://{domain}/collections/{collection}/products.json?limit=250&page={page}")
        try:
            ps = json.loads(body)["products"] if code == 200 else None
        except (ValueError, KeyError, TypeError):
            ps = None
        if ps is None:
            print(f"  {domain}/{collection}: página {page} falló (HTTP {code})", flush=True)
            return None
        if not ps:
            return out
        out += ps
        time.sleep(pause)
    return None


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


def fetch_page(domain, page, collection=None):
    # Con colección se baja solo esa parte del catálogo: Pro:Direct tiene
    # decenas de miles de productos (running, rugby, tenis) y el catálogo
    # entero no entra en las 40 páginas de abajo.
    base = f"https://{domain}/collections/{collection}" if collection else f"https://{domain}"
    url = f"{base}/products.json?limit=250&page={page}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)["products"]


def build(domain, awinmid, out_csv, collections=None):
    rows = []
    seen = set()
    for collection in (collections or [None]):
      for page in range(1, 41):
        products = fetch_page(domain, page, collection)
        if not products:
            break
        for p in products:
            # Un mismo producto aparece en varias colecciones (club, liga,
            # "home kits"...): se escribe una sola vez.
            if p["id"] in seen:
                continue
            seen.add(p["id"])
            title = p["title"]
            product_url = f"https://{domain}/products/{p['handle']}"
            image = p["images"][0]["src"] if p.get("images") else ""
            # awinmid "raw": enlace directo a la tienda, sin Awin. Para tiendas
            # que monetiza el script de Skimlinks que ya carga el sitio (p. ej.
            # Pro:Direct), que convierte el enlace al hacer clic.
            deep_link = product_url if awinmid == "raw" else (
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
    # 4to argumento opcional: colecciones separadas por coma.
    cols = sys.argv[4].split(",") if len(sys.argv) > 4 and sys.argv[4] else None
    build(domain, awinmid, out_csv, cols)
