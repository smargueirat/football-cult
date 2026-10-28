#!/usr/bin/env python3
"""adidas México (Awin 79918, MXN) y adidas Colombia (Awin 79924, COP): feed estándar -> esquema de adidas Chile.

Aprobados el 2026-10-28. Toda la minería (refresh_offers, mine_boots, mine_gear, refresh_gear, mine_women,
update_gtins, pick/retro_extract) ya sabe leer el feed de adidas CL; en vez de enseñarle a cada una el
esquema de MX y CO, `download_feeds.py` los traduce aquí al bajarlos (mismo patrón que `to_google` para
Foot-Store FR). Lo que difiere, medido el 28-10 sobre los dos feeds:

- Precio: `search_price` y `product_price_old` traen SIEMPRE el precio de lista; el precio de venta (rebajas
  de 20/30/40/50 %) viene en `custom_1` (MX 21 % de las filas, CO 36 %). Se usa el menor de los dos como
  `search_price`. adidas.mx / adidas.co responden con un desafío anti-bot, así que no se pudo contrastar con
  la tienda: la evidencia es que los descuentos son redondos (439/549, 1799/2999, 119970/199950) y que
  `custom_1` nunca supera a `search_price` salvo 3 filas de CO.
- `Fashion:suitable_for` es el DEPORTE (no el sexo); `Fashion:size` y `mpn` traen el mismo código; `colour`
  es la categoría. El sexo/edad va en el sufijo de `merchant_category` ("Jerseys/Mujer"), la talla en el
  sufijo de `merchant_product_id` ("JZ2492-0002_XS") y el color (familia: Blanco, Negro...) en la descripción
  ("<modelo> - Negro en adidas.mx").
- Títulos: MX "adidas Jersey X Negro - Hombre" (color pegado, sin talla); CO "adidas Camiseta X Hombre M".
  Se reescriben al formato doblado de CL ("adidas T T Hombre M - Hombre Fútbol M") sin el color, que pasa a `colour`.
- Categorías con otro nombre (Jerseys, Calzado de Fútbol, Balones...) se llevan al de CL para que las
  tablas de categoría de la minería sirvan igual.
- Tallas de bota MX: "MX 5". Medido contra los EAN que MX comparte con adidas CL/CO/ES (720 de 2.035 filas):
  MX + 2 = talla US de hombre/unisex y MX + 3 = talla US de mujer, sin una sola excepción. Se escribe "US 7" y
  la tabla US -> EU de CL hace el resto.

Uso: python3 adidas_latam_feed.py ENTRADA.csv SALIDA.csv
"""
import csv, re, sys, unicodedata

csv.field_size_limit(10**9)

CATEGORY = {  # nombre de categoría MX/CO -> nombre de adidas CL (solo las que la minería usa)
    "Calzado de Fútbol": "Zapatos de Fútbol", "Guayos": "Zapatos de Fútbol",
    "Jerseys": "Camisetas de equipos",
    "Balones": "Pelotas", "Espinilleras": "Canilleras",
    "Playeras": "Poleras", "Camisetas": "Poleras",
    "Sudaderas": "Polerones", "Buzos y Súeteres": "Polerones",
    "Chamarras": "Chaquetas",
    "Medias": "Calcetines",
    "Bolsas y mochilas": "Bolsos y mochilas", "Bolsos y morrales": "Bolsos y mochilas",
}
SEX = {"Hombre": "Male", "Mujer": "Female"}
COLOUR_RE = re.compile(r"^(.*?)\s*-\s*([^-]+?)\s+en adidas\.(?:mx|co)\b", re.S)


def _norm(s):
    return unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().casefold()


def price_of(r):
    """Precio de venta: el menor entre `search_price` (lista) y `custom_1` (venta, si hay)."""
    p = float(r["search_price"] or 0)
    try:
        c = float(r["custom_1"])
    except ValueError:
        return p
    return c if 0 < c < p else p


def clean_name(r, gender, label, head):
    """Título sin 'adidas ', sin sexo/talla/color finales."""
    t = re.sub(r"^adidas\s+", "", r["product_name"].strip(), flags=re.I)
    t = re.sub(r"\s+-\s*\w*\s*$", "", t)  # "... Blanco - Hombre" / "... Blanco -"
    t = re.sub(rf"\s+{gender}\s+{re.escape(label)}$", "", t)  # CO: "... Hombre M"
    # El color real va pegado al final del título MX; la descripción trae el nombre sin color.
    if head and _norm(t).startswith(_norm(head)):
        rest = t[len(head):].split()
        if 0 < len(rest) <= 4:
            t = t[:len(head)].rstrip()
    return t


def boot_us(label, gender):
    """"MX 5" -> "US 7" (mujer +3, el resto +2); cualquier otra etiqueta queda igual."""
    m = re.fullmatch(r"MX (\d+(?:\.\d+)?)", label)
    if not m or gender == "Niño":
        return label
    n = float(m.group(1)) + (3 if gender == "Mujer" else 2)
    return "US " + (str(int(n)) if n == int(n) else str(n))


def translate_row(r):
    cat, _, gender = r["merchant_category"].partition("/")
    gender = gender or "Unisex"
    label = r["merchant_product_id"].partition("_")[2]
    sport = r["Fashion:suitable_for"]
    m = COLOUR_RE.match(r["description"].strip())
    head, colour = (re.sub(r"^adidas\s*-\s*", "", m.group(1)).strip(), m.group(2).strip()) if m else ("", "")
    cl_cat = CATEGORY.get(cat, cat)
    if cl_cat == "Zapatos de Fútbol":
        label = boot_us(label, gender)
    name = clean_name(r, gender, label, head)
    price = price_of(r)
    old = r["search_price"]
    r["merchant_category"] = f"{cl_cat}/{gender}"
    r["custom_1"] = "Kids" if gender == "Niño" else "Adult"
    r["Fashion:suitable_for"] = SEX.get(gender, "Unisex")
    r["Fashion:size"] = label
    r["colour"] = colour
    r["search_price"] = f"{price:.2f}"
    r["product_price_old"] = old
    # "Fútbol Americano" no es fútbol: la minería busca "fútbol" al final del título.
    sport = "Americano" if "Americano" in sport else sport
    r["product_name"] = f"adidas {name} {name} {gender} {label} - {gender} {sport} {label}"
    return r


def translate(src, dst):
    with open(src, newline="", encoding="utf-8-sig") as f, open(dst, "w", newline="", encoding="utf-8-sig") as g:
        rd = csv.DictReader(f)
        w = csv.DictWriter(g, rd.fieldnames)
        w.writeheader()
        n = 0
        for r in rd:
            w.writerow(translate_row(r))
            n += 1
    return n


if __name__ == "__main__":
    print(f"{translate(sys.argv[1], sys.argv[2])} filas -> {sys.argv[2]}")
