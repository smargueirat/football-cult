#!/usr/bin/env python3
"""Botas de Pro:Direct España (prodirectsport.es) -> JSON para mine_boots.py.

Por qué (2026-09-30): Pro:Direct es de las tiendas de botas más grandes de
Europa, envía a la UE por 3,62 EUR (medido con el estimador de Shopify) y el
enlace directo lo monetiza Skimlinks. No tiene feed de afiliados, pero es un
Shopify abierto, igual que para camisetas (ver
scripts/catalog-mining/prodirect_es_feed.py, mismas trampas: el sitemap es la
única lista completa y solo /products/<handle>.js dice qué talle hay).

Lo valioso: cada talle trae su EAN (`barcode`) y las etiquetas traen el
código del fabricante (ej. "IG0776"). Con el EAN, refresh_boots.py funde en
UNA ficha la misma bota que vende Foot-Store / Sport is Good / adidas, que
también traen EAN: comparación real, no por nombre ni por foto.

Dos modos, porque bajar ~7.000 productos tarda ~5 h:
  --all   recorre todo el sitemap (sábado a la noche, crontab)
  (nada)  solo vuelve a pedir los que la última corrida encontró con stock
          (cada noche, ~1 h) para que precio y talles no queden viejos.

Uso: python3 -u prodirect_es_boots_feed.py [--all] [/tmp/feeds/PRODIRECT_ES_BOOTS.json]
"""
import json, os, re, shutil, sys, time, urllib.error, urllib.request

DOM = "www.prodirectsport.es"
UA = {"User-Agent": "Mozilla/5.0"}
# Accesorios, niños y sala: se descartan por el handle antes de pedir nada.
BAD = re.compile(r"kids|junior|youth|infant|baby|\bjr\b|-j-|bag|sock|insole|lace|tacos|stud|spray|cleaner|"
                 r"box|keyring|mini|indoor|futsal|-ic-|-in-|sala|trainer|slide|sandal|rugby")


STATE_DIR = os.path.expanduser("~/.local/state/fc-feeds")  # fuera de /tmp (tmpfs, se vacía al reiniciar)
# Pedidos que agotaron los reintentos (429/5xx/red). Un fallo NO es "sin
# stock": en oct-2026 la tienda nos limitó y la pasada diaria guardó 334 y
# luego 68 botas de 1.046, que ya no se volvían a pedir hasta el sábado.
FAILS = 0


def get(url, tries=3):
    global FAILS
    for i in range(tries):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40).read()
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            ra = e.headers.get("Retry-After", "")  # 429/5xx: respeta Retry-After (hasta 2 min)
            time.sleep(min(int(ra), 120) if ra.isdigit() else 15 * (i + 1) if e.code == 429 else 3 * (i + 1))
        except Exception:
            time.sleep(3 * (i + 1))
    FAILS += 1
    return None


def all_handles():
    index = (get(f"https://{DOM}/sitemap.xml") or b"").decode()
    out = []
    for sm in re.findall(r"<loc>([^<]*sitemap_products_[^<]*)</loc>", index):
        xml = (get(sm.replace("&amp;", "&")) or b"").decode()
        out += re.findall(rf"<loc>https://{re.escape(DOM)}/products/([^<]+)</loc>", xml)
        time.sleep(0.5)
    if len(out) < 10000:
        sys.exit(f"el sitemap devolvió solo {len(out)} productos: algo cambió en la tienda, no sigo")
    return [h for h in out if re.search(r"boot|bota", h) and not BAD.search(h)]


def fetch(handle):
    raw = get(f"https://{DOM}/products/{handle}.js", tries=2)
    if not raw:
        return None
    p = json.loads(raw)
    tags = [t.lower() for t in p.get("tags") or []]
    if p.get("type") != "Football Boots" or "age_adults" not in tags:
        return None
    variants = [{"size": v.get("option1") or v.get("title"), "price": v["price"] / 100,
                 "ean": (v.get("barcode") or "").strip()}
                for v in p.get("variants", []) if v.get("available")]
    if not variants:
        return None
    img = (p.get("images") or [""])[0]
    return {
        "handle": handle, "title": p["title"], "brand": p.get("vendor", ""),
        # El código del fabricante viene como una etiqueta más, en mayúsculas
        # y con dígitos, sin prefijo ("IG0776", "IO1496-001").
        "style": next((t for t in p.get("tags") or [] if re.fullmatch(r"[A-Z]{1,3}\d{3,5}(-\d{3})?", t)), ""),
        "ground": next((t.split("_", 1)[1] for t in tags if t.startswith("groundtype_")), ""),
        "url": f"https://{DOM}/products/{handle}",
        "image": "https:" + img if img.startswith("//") else img,
        "variants": variants,
    }


def main(out_path, full):
    if full or not os.path.exists(out_path):
        handles = all_handles()
    else:
        handles = [p["handle"] for p in json.load(open(out_path))]
    print(f"{'todo el sitemap' if full else 'refresco'}: {len(handles)} handles", flush=True)
    res = []
    for i, h in enumerate(handles, 1):
        p = fetch(h)
        if p:
            res.append(p)
        if i % 250 == 0:
            print(f"  {i}/{len(handles)}, {len(res)} botas de adulto con stock", flush=True)
        time.sleep(0.5)
    if len(res) < 50:
        sys.exit(f"solo {len(res)} botas con stock: algo falló, no piso el archivo anterior")
    if FAILS > len(handles) * 0.05:
        sys.exit(f"{FAILS} de {len(handles)} pedidos fallaron (¿nos limitan?): no piso el archivo anterior")
    tmp = out_path + ".tmp"
    json.dump(res, open(tmp, "w"), ensure_ascii=False)
    os.replace(tmp, out_path)
    os.makedirs(STATE_DIR, exist_ok=True)
    shutil.copy2(out_path, STATE_DIR)  # download_feeds.py lo restaura si /tmp se vacía
    print(f"listo: {len(res)} botas con stock -> {out_path}", flush=True)


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if a != "--all"]
    main(args[0] if args else "/tmp/feeds/PRODIRECT_ES_BOOTS.json", "--all" in sys.argv)
