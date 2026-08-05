import csv, re, sys
import os
from collections import defaultdict
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract import analyze, SIZE_MAP

PENALTY_RE = [
    (re.compile(r"auténtic|authentic", re.I), 5),
    (re.compile(r"manga larga|mangas largas|long.?sleeve", re.I), 4),
    (re.compile(r"academy|dri-?fit|stadium|strike", re.I), 3),
    (re.compile(r"ronaldo|messi|jordan|mbapp|neymar", re.I), 3),
    (re.compile(r"protección|hex|mcdavid", re.I), 6),
    (re.compile(r"\bpro\b|match\b", re.I), 1),
    # sufijos numéricos de 2 dígitos sueltos (ej. "Manchester United 90",
    # "Liverpool FC 95") suelen ser ediciones especiales/heritage, no la
    # camiseta estándar de la temporada actual (24/25/26 sí son válidos:
    # año de mundial/euro para selecciones).
    (re.compile(r"\b(?!24\b|25\b|26\b)\d{2}\b\s*$"), 4),
]

def score(title):
    s = len(title)  # prefer shorter, simpler titles as tiebreak
    for pat, pen in PENALTY_RE:
        if pat.search(title):
            s += pen * 20
    return s

def pick_best(csv_path, price_col="search_price", size_col="custom_1", link_col="aw_deep_link", image_col="aw_image_url", shipping_col=None, title_col="product_name", encoding="utf-8-sig", only=None, sport_category_col=None):
    candidates, rows = analyze(csv_path, price_col, encoding=encoding, link_col=link_col, image_col=image_col, title_col=title_col)
    results = {}
    for (team, typ), items in candidates.items():
        if only and team not in only:
            continue
        # group by (base) title, with the size sourced either from a size
        # column or, if that's empty, from a "- SIZE" suffix stripped off
        # the raw title (some feeds do one row per size with no size column).
        # Algunos feeds (adidas) traen una columna de categoría deportiva
        # real (custom_2: "Fútbol"/"Rugby"/"Voleibol"/"Balonmano"/etc.) que
        # es mucho más confiable que el título para descartar prendas de
        # OTRO deporte con el mismo nombre de selección/país (ver bug real:
        # "Francia" de adidas traía rugby/balonmano/voleibol mezclado con
        # fútbol porque adidas patrocina a varias federaciones francesas).
        by_title = defaultdict(list)
        for title, r, old, title_size in items:
            if old:
                continue
            if sport_category_col:
                cat = (r.get(sport_category_col) or "").lower()
                if cat and not any(k in cat for k in ("tbol", "utebol", "soccer")):
                    continue
            by_title[title].append((r, title_size))
        if not by_title:
            continue
        best_title = min(by_title.keys(), key=score)
        variant_rows = by_title[best_title]
        sizes = set()
        prices = []
        shippings = []
        rep_row = None
        for r, title_size in variant_rows:
            sz = (r.get(size_col) or "").strip().upper() or (title_size or "")
            if sz in SIZE_MAP:
                sizes.add(SIZE_MAP[sz])
                if rep_row is None or SIZE_MAP[sz] == "M":
                    rep_row = r
            raw_price = r.get("sale_price") or r.get(price_col) or ""
            pm = re.search(r"([\d.,]+)", raw_price)
            if pm:
                try:
                    prices.append(float(pm.group(1).replace(",", ".")))
                except ValueError:
                    pass
            if shipping_col:
                raw = r.get(shipping_col) or ""
                m = re.search(r"([\d.,]+)\s*[A-Z]{3}", raw) or re.match(r"^\s*([\d.,]+)\s*$", raw)
                if m:
                    try:
                        shippings.append(float(m.group(1).replace(",", ".")))
                    except ValueError:
                        pass
        if rep_row is None:
            rep_row = variant_rows[0][0]
        if not sizes:
            continue
        price = prices[0] if prices else None
        shipping = shippings[0] if shippings else 0.0
        results[(team, typ)] = {
            "title": best_title,
            "price": price,
            "shipping": shipping,
            "sizes": sorted(sizes, key=lambda s: ["XS","S","M","L","XL","XXL","3XL","4XL"].index(s)),
            "link": rep_row.get(link_col),
            "image": rep_row.get(image_col),
            "n_variants": len(variant_rows),
        }
    return results

if __name__ == "__main__":
    import json
    path = sys.argv[1]
    price_col = sys.argv[2] if len(sys.argv) > 2 else "search_price"
    shipping_col = sys.argv[3] if len(sys.argv) > 3 else None
    out_json = sys.argv[4] if len(sys.argv) > 4 else None
    title_col = sys.argv[5] if len(sys.argv) > 5 else "product_name"
    size_col = sys.argv[6] if len(sys.argv) > 6 else "custom_1"
    link_col = sys.argv[7] if len(sys.argv) > 7 else "aw_deep_link"
    image_col = sys.argv[8] if len(sys.argv) > 8 else "aw_image_url"
    sport_category_col = sys.argv[9] if len(sys.argv) > 9 else None
    res = pick_best(path, price_col, size_col=size_col, link_col=link_col, image_col=image_col, shipping_col=shipping_col, title_col=title_col, sport_category_col=sport_category_col)
    for (team, typ), d in sorted(res.items()):
        print(f"{team:15s} {typ:12s} price={d['price']:<8} ship={d['shipping']:<6} sizes={d['sizes']} n={d['n_variants']:3d}  {d['title']}")
        print(f"                 link: {d['link']}")
        print(f"                 img:  {d['image']}")
    if out_json:
        j = {f"{team}|{typ}": d for (team, typ), d in res.items()}
        json.dump(j, open(out_json, "w"), ensure_ascii=False, indent=1)
