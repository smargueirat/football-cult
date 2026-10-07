#!/usr/bin/env python3
"""Pasada de camisetas de MUJER sobre todos los feeds de camisetas.

Por que existe: hasta el 2026-09-28 "mujer|women|dama|feminin" estaba en
EXCLUDE_RE y en KIDS_EXCLUDE_RE, asi que NINGUNA pasada de mineria de
NINGUNA tienda podia traer una camiseta de mujer -- las 64 que habia en el
catalogo eran todas retro sembradas a mano, mientras el sitio publicaba
/mujer como seccion propia. Ver extract.WOMEN_EXCLUDE_RE.

No reimplementa nada: llama al mismo pick_best de siempre con women=True,
que solo cambia las dos reglas de texto. La insercion es la de los ninos
(gen_kids_teams.py con age_group="women" para los nuevos, refresh.py
--women para sumar ofertas a los que ya existen).

Uso:  python3 mine_women.py <out_dir> [STORE ...]
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pick import pick_best

FEED_DIR = "/tmp/feeds"

# (archivo, etiqueta de tienda, moneda, precio, envio, titulo, talla, link,
#  foto, columna de categoria deportiva)
#
# Las etiquetas de tienda son EXACTAMENTE las que ya usa products.ts: un
# "FootStore ES" en vez de "FootStoreES" crearia una tienda fantasma que no
# tendria tasa de comision ni se fusionaria con las ofertas existentes.
STORES = [
    ("FANSJERSEYHUB",      "FansJerseyHub", "USD", "price",        "shipping",      "title",        "size",         "aw_deep_link", "image_link",   None),
    ("FOOTSTORE_ES",       "FootStoreES",   "EUR", "search_price", "delivery_cost", "product_name", "custom_1",     "aw_deep_link", "aw_image_url", None),
    ("FOOTSTORE_FR",       "FootStoreFR",   "EUR", "price",        "shipping",      "title",        "size",         "aw_deep_link", "image_link",   None),
    ("SPORTISGOOD_ES",     "SportIsGoodES", "EUR", "search_price", "delivery_cost", "product_name", "custom_1",     "aw_deep_link", "aw_image_url", None),
    ("SPORTISGOOD_FR",     "SportIsGoodFR", "EUR", "price",        "shipping",      "title",        "size",         "aw_deep_link", "image_link",   None),
    # adidas patrocina varias federaciones francesas: sin custom_2 entran
    # camisetas de rugby/balonmano/voleibol como si fueran de futbol.
    ("ADIDAS_ES",          "AdidasES",      "EUR", "search_price", "delivery_cost", "product_name", "Fashion:size", "aw_deep_link", "aw_image_url", "custom_2"),
    ("ADIDAS_PT",          "AdidasPT",      "EUR", "search_price", "delivery_cost", "product_name", "Fashion:size", "aw_deep_link", "aw_image_url", "custom_2"),
    # adidas Chile (CLP): sin custom_2 ni delivery_cost; el feed mezcla calzado/ropa, pero el filtro de titulo ya deja solo camisetas.
    ("ADIDAS_CL",          "AdidasCL",      "CLP", "search_price", "delivery_cost", "product_name", "Fashion:size", "aw_deep_link", "aw_image_url", None),
    ("PLANETFOOT",         "PlanetFoot",    "EUR", "price",        "shipping",      "title",        "size",         "aw_deep_link", "image_link",   None),
    # ForumSport NO lleva columna de categoria deportiva: su custom_2 es una
    # FECHA ("20260902"), no un deporte -- pasarla dejaba la tienda en cero
    # picks porque ninguna fecha contiene "futbol". El feed ya viene
    # prefiltrado por product_type (FORUMSPORT_jerseys.csv).
    ("FORUMSPORT_jerseys", "ForumSport",    "EUR", "search_price", "delivery_cost", "product_name", "Fashion:size", "aw_deep_link", "aw_image_url", None),
    ("DECATHLONIE",        "DecathlonIE",   "EUR", "search_price", "delivery_cost", "product_name", "Fashion:size", "aw_deep_link", "aw_image_url", None),
    ("COMOFC",             "ComoFCShop",    "EUR", "price",        "shipping",      "title",        "size",         "aw_deep_link", "image_link",   None),
    ("BSTN_IT",            "BSTNIT",        "EUR", "search_price", "delivery_cost", "product_name", "Fashion:size", "aw_deep_link", "aw_image_url", None),
    ("BSTN_UK",            "BSTNUK",        "GBP", "search_price", "delivery_cost", "product_name", "Fashion:size", "aw_deep_link", "aw_image_url", None),
]


def main(out_dir, only=None):
    os.makedirs(out_dir, exist_ok=True)
    manifest = []
    for feed, store, cur, price, ship, title, size, link, img, sport in STORES:
        if only and store not in only:
            continue
        path = os.path.join(FEED_DIR, f"{feed}.csv")
        if not os.path.exists(path):
            print(f"{store:16} feed ausente, se saltea ({path})")
            continue
        try:
            res = pick_best(path, price, size_col=size, link_col=link, image_col=img,
                            shipping_col=ship, title_col=title,
                            sport_category_col=sport, women=True)
        except Exception as e:
            print(f"{store:16} ERROR: {type(e).__name__}: {e}")
            continue
        out = os.path.join(out_dir, f"{store}_women.json")
        json.dump({f"{t}|{y}": d for (t, y), d in res.items()},
                  open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        print(f"{store:16} {len(res):4} picks -> {out}")
        manifest.append({"store": store, "currency": cur, "picks": len(res), "path": out})
    json.dump(manifest, open(os.path.join(out_dir, "manifest.json"), "w"), indent=1)
    print(f"\nTotal: {sum(m['picks'] for m in manifest)} picks en {len(manifest)} tiendas")
    print("manifest.json lista tienda/moneda/archivo para los pasos de insercion")


if __name__ == "__main__":
    main(sys.argv[1], set(sys.argv[2:]) or None)
