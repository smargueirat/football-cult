#!/usr/bin/env python3
"""Pro:Direct España (prodirectsport.es) -> CSV con la forma de un feed de Awin.

Por qué existe (2026-09-29): Pro:Direct no tiene feed de afiliados que podamos
bajar, pero es una tienda Shopify abierta, y el enlace directo lo monetiza
Skimlinks al clic. Se integró a mano el 29-09 (142 ofertas, la opción oficial
más barata en 34 fichas); esto lo deja semanal para que no se quede viejo.

Tres trampas de Shopify, todas medidas ese día:
- /products.json corta en page*limit <= 25.000 y ordena por título con las
  mayúsculas primero: todo lo que empieza con "adidas" queda FUERA. Por eso se
  parte del sitemap (sitemap_products_N.xml), que lista los 31.500 productos.
- /products/<handle>.json no dice qué talle hay en stock; .js sí (precio en
  céntimos).
- Algunas "Segunda equipación" son de calentamiento según la DESCRIPCIÓN
  (Argelia): se descartan si la descripción dice prepartido y el título no.

Envío: 3,62 EUR estándar a ES/IT/FR/DE, medido con el estimador de Shopify.
Tarda ~30 min (~2,4 s por producto, con pausa para no molestar a la tienda).

Uso: python3 -u prodirect_es_feed.py /tmp/feeds/PRODIRECT_ES.csv
Después va por el camino de siempre: pick.py -> split_picks.py -> refresh.py /
gen_new_teams.py con tienda "Pro:Direct ES" y moneda EUR.
"""
import csv, json, re, sys, time, urllib.request

sys.path.insert(0, __import__("os").path.dirname(__import__("os").path.abspath(__file__)))
import extract
from shopify_feed_to_csv import parse_size

DOM = "www.prodirectsport.es"
UA = {"User-Agent": "Mozilla/5.0"}
KIT = re.compile(r"\b(shirt|jersey|camiseta)\b")
BAD = re.compile(r"\b(t shirt|tee|training|pre match|prematch|warm up|gk|goalkeeper|polo|base layer|baselayer|"
                 r"rugby|cricket|tennis|running|baby|infant|kids|junior|youth|womens|women|ls)\b")
# Temporada actual y la que viene, en las formas que usan los handles.
CURRENT = re.compile(r"2025-26|2026-27|25-26|26-27|-2026-|-26-")
PREMATCH = re.compile(r"pre.?partido|pre.?match")


def get(url, tries=3):
    for i in range(tries):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40).read()
        except Exception:
            time.sleep(3 * (i + 1))
    return None


def handles():
    index = (get(f"https://{DOM}/sitemap.xml") or b"").decode()
    out = []
    for sm in re.findall(r"<loc>([^<]*sitemap_products_[^<]*)</loc>", index):
        xml = (get(sm.replace("&amp;", "&")) or b"").decode()
        out += re.findall(rf"<loc>https://{re.escape(DOM)}/products/([^<]+)</loc>", xml)
        time.sleep(0.5)
    return out


def main(out_path):
    teams = extract.team_re_all()
    hs = handles()
    keep = [h for h in hs
            if KIT.search(h.replace("-", " ")) and not BAD.search(h.replace("-", " "))
            and CURRENT.search(h) and extract.match_team(h.replace("-", " "), teams)]
    print(f"sitemap: {len(hs)} productos, {len(keep)} camisetas de adulto de temporada actual de equipos nuestros", flush=True)
    if len(hs) < 10000:
        sys.exit(f"el sitemap devolvió solo {len(hs)} productos: algo cambió en la tienda, no sigo")

    with open(out_path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["product_name", "price", "delivery_cost", "custom_1",
                                          "aw_deep_link", "aw_image_url", "brand"])
        w.writeheader()
        ok = rows = 0
        for i, h in enumerate(keep, 1):
            url = f"https://{DOM}/products/{h}"
            raw = get(url + ".js", tries=2)
            time.sleep(0.5)
            if not raw:
                continue
            p = json.loads(raw)
            desc = re.sub(r"<[^>]+>", " ", p.get("description") or "").lower()
            if PREMATCH.search(desc) and not PREMATCH.search(p["title"].lower()):
                continue
            img = (p.get("images") or [""])[0]
            if img.startswith("//"):
                img = "https:" + img
            for v in p.get("variants", []):
                if v.get("available"):
                    w.writerow({"product_name": p["title"], "price": f"{v['price'] / 100:.2f}",
                                "delivery_cost": "3.62", "custom_1": parse_size(v.get("option1")),
                                "aw_deep_link": url, "aw_image_url": img, "brand": p.get("vendor", "")})
                    rows += 1
            ok += 1
            if i % 100 == 0:
                print(f"  {i}/{len(keep)} productos, {rows} filas", flush=True)
    print(f"listo: {ok}/{len(keep)} productos, {rows} filas en stock -> {out_path}", flush=True)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "/tmp/feeds/PRODIRECT_ES.csv")
