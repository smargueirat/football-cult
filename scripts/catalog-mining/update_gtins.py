#!/usr/bin/env python3
"""Mapa URL de oferta -> EAN/GTIN real, leido de los feeds cacheados.

Por que un archivo aparte y no un campo en la oferta: products.ts esta al
borde del limite de complejidad de tipos de TypeScript, y sumarle un campo
opcional mas a las ofertas lo revienta con "Expression produces a union type
that is too complex to represent" (probado el 2026-09-28). Mismo motivo y
mismo patron que las bajadas de precio en src/lib/priceDrops.ts.

Para que sirve el GTIN: Google Merchant Center prioriza los articulos que lo
traen -- es como empareja el mismo producto entre comercios -- y a nosotros nos
da la unica forma FIABLE de saber que dos tiendas venden exactamente la misma
camiseta, sin depender del titulo ni de la foto.

Se apoya en que la URL guardada en products.ts es el mismo aw_deep_link que
publica el feed, asi que el cruce es exacto y no hay heuristica ninguna.

Uso: python3 update_gtins.py [dir_de_feeds]     (por defecto /tmp/feeds)
"""
import csv, json, os, re, sys

csv.field_size_limit(10**9)
HERE = os.path.dirname(os.path.abspath(__file__))
PRODUCTS_TS = os.path.join(HERE, "..", "..", "src", "data", "products.ts")
OUT = os.path.join(HERE, "..", "..", "src", "data", "offerGtins.json")

# Nombre de la columna del GTIN por feed: NO se llama igual en todos.
# Verificado leyendo la cabecera real de cada CSV el 2026-09-28.
GTIN_COL = {
    "FANSJERSEYHUB": "gtin", "FOOTSTORE_ES": "ean", "FOOTSTORE_FR": "gtin",
    "SPORTISGOOD_ES": "ean", "SPORTISGOOD_FR": "gtin", "ADIDAS_ES": "ean",
    "ADIDAS_PT": "ean", "PLANETFOOT": "gtin", "FORUMSPORT_jerseys": "product_GTIN",
    "FORUMSPORT": "product_GTIN", "DECATHLONIE": "ean", "COMOFC": "gtin",
    "BSTN_IT": "ean", "BSTN_UK": "ean", "DEPORTEOUTLET": "ean",
    "GIGASPORT_DE": "ean", "GIGASPORT_CH": "ean", "GIGASPORT_FR": "ean",
    "CLOVIS_BR": "gtin", "PROSOCCER": "gtin",
}
LINK_COLS = ["aw_deep_link", "aw_product_link", "link"]
# Un EAN/GTIN valido es numerico de 8, 12, 13 o 14 digitos. Los feeds meten de
# todo en esa columna (SKUs internos, cadenas vacias, "0"), y mandarle a Google
# un identificador invalido es peor que no mandar ninguno.
VALID = re.compile(r"^\d{8}$|^\d{12,14}$")


def main(feed_dir="/tmp/feeds"):
    src = open(PRODUCTS_TS, encoding="utf-8").read()
    wanted = set(re.findall(r'url: "([^"]+)"', src))
    print(f"URLs de oferta en el catalogo: {len(wanted)}")

    out, rejected = {}, 0
    for name, col in sorted(GTIN_COL.items()):
        path = os.path.join(feed_dir, f"{name}.csv")
        if not os.path.exists(path):
            continue
        hit = 0
        with open(path, encoding="utf-8-sig", errors="replace") as fh:
            rd = csv.DictReader(fh)
            if not rd.fieldnames or col not in rd.fieldnames:
                print(f"{name:20} sin columna {col!r}, se saltea")
                continue
            link_col = next((c for c in LINK_COLS if c in rd.fieldnames), None)
            if not link_col:
                print(f"{name:20} sin columna de enlace, se saltea")
                continue
            for r in rd:
                url = (r.get(link_col) or "").strip()
                if url not in wanted:
                    continue
                g = (r.get(col) or "").strip().lstrip("'")
                if not g:
                    continue
                if not VALID.match(g):
                    rejected += 1
                    continue
                out[url] = g
                hit += 1
        print(f"{name:20} {hit:6} ofertas del catalogo con GTIN")

    prev = {}
    if os.path.exists(OUT):
        prev = json.load(open(OUT, encoding="utf-8"))
    # Se conserva lo anterior: un producto que hoy no esta en el feed (agotado,
    # delistado) no deberia perder su identificador, es del fabricante y no
    # cambia. Solo desaparece si la oferta se borra del catalogo.
    merged = {k: v for k, v in {**prev, **out}.items() if k in wanted}
    json.dump(dict(sorted(merged.items())), open(OUT, "w", encoding="utf-8"),
              ensure_ascii=False, indent=0)
    print(f"\nofertas con GTIN: {len(merged)} de {len(wanted)} "
          f"({100*len(merged)/max(1,len(wanted)):.1f}%)  descartados por formato: {rejected}")
    print(f"-> {OUT}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "/tmp/feeds")
