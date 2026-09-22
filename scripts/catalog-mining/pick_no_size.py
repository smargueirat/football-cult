"""Variant of pick.py for feeds with NO size column/data at all (Futbol
Factory: one row per player-edition/gender variant, never per size).
Spot-checked 2 real product pages (Atletico Madrid home, Espana home,
different brands Nike/adidas) on 2026-09-09 -- both showed the exact
same real in-stock range: XS-3XL, only 2XS out of stock. Uses a fixed
S-XXL range (the reliable middle of that confirmed range) instead of
deriving sizes per-product, since the feed itself carries none.

Usage: python3 pick_no_size.py <csv> <price_col> <title_col> <link_col> <image_col> <out_json>
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract import analyze
from pick import score
from collections import defaultdict

FIXED_SIZES = ["S", "M", "L", "XL", "XXL"]

def pick_best_no_size(csv_path, price_col, title_col, link_col, image_col):
    candidates, rows = analyze(csv_path, price_col, encoding="utf-8", link_col=link_col, image_col=image_col, title_col=title_col)
    results = {}
    for (team, typ), items in candidates.items():
        by_title = defaultdict(list)
        for title, r, old, title_size in items:
            if old:
                continue
            by_title[title].append(r)
        if not by_title:
            continue
        best_title = min(by_title.keys(), key=score)
        variant_rows = by_title[best_title]
        # Bug real (2026-09-22, feed de Futbol Factory): algunas filas
        # traen price=0.00 -- no faltante, el feed literalmente pone 0 en
        # variantes sin stock/pendientes de publicar (confirmado: 54 de
        # 75 picks de una corrida real salian a "0.0" antes de este
        # fix). min(prices) sobre TODAS las filas del titulo dejaba que
        # esa fila invalida le gane a las que si tienen precio real.
        # Se descartan del todo antes de elegir precio (y de elegir la
        # fila representante para el link/imagen, para no linkear una
        # variante sin stock).
        priced_rows = []
        for r in variant_rows:
            raw_price = r.get(price_col) or ""
            import re
            pm = re.search(r"([\d.,]+)", raw_price)
            if not pm:
                continue
            try:
                price = float(pm.group(1).replace(",", "."))
            except ValueError:
                continue
            if price > 0:
                priced_rows.append((price, r))
        if not priced_rows:
            continue
        best_price, rep_row = min(priced_rows, key=lambda pr: pr[0])
        results[(team, typ)] = {
            "title": best_title,
            "price": best_price,
            "shipping": 0.0,
            "sizes": FIXED_SIZES,
            "link": rep_row.get(link_col),
            "image": rep_row.get(image_col),
            "n_variants": len(variant_rows),
        }
    return results

if __name__ == "__main__":
    import json
    csv_path, price_col, title_col, link_col, image_col, out_json = sys.argv[1:7]
    res = pick_best_no_size(csv_path, price_col, title_col, link_col, image_col)
    for (team, typ), d in sorted(res.items()):
        print(f"{team:15s} {typ:12s} price={d['price']:<8} {d['title']}")
    j = {f"{team}|{typ}": d for (team, typ), d in res.items()}
    json.dump(j, open(out_json, "w"), ensure_ascii=False, indent=1)
    print(f"\nWrote {len(j)} picks -> {out_json}")
