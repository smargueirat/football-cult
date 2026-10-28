#!/usr/bin/env python3
"""Pasada de camisetas de NIÑO sobre un feed Awin con el esquema de adidas CL (CL, MX, CO).

pick_best() no sirve para niños: sus tallas son de letra (SIZE_MAP) y las de niño son edades ("9-10").
Esto usa analyze_kids() (misma señal que el resto de la minería de niños) y agrupa igual que pick_best:
un pick por (equipo, tipo) con el título más simple, el precio de la primera fila y todas las edades.
La inserción es la de siempre: gen_kids_teams.py para las fichas nuevas, refresh.py --kids para sumar
ofertas a las que ya existen.

Uso: python3 mine_kids_awin.py <feed.csv> <salida.json>
"""
import json, os, re, sys
from collections import defaultdict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract import analyze_kids, normalize_kids_size
from pick import score


def main(feed, out):
    cands, _ = analyze_kids(feed, "search_price", size_col="Fashion:size")
    res = {}
    for (team, typ), items in cands.items():
        by_title = defaultdict(list)
        for title, r, old, _ in items:
            if not old:
                by_title[title].append(r)
        if not by_title:
            continue
        title = min(by_title, key=score)
        rows = by_title[title]
        ages = {a for r in rows if (a := normalize_kids_size(r.get("Fashion:size")))}
        if not ages:
            continue
        rep = rows[0]
        res[f"{team}|{typ}"] = {
            "title": title, "price": float(re.search(r"[\d.]+", rep["search_price"]).group()), "shipping": 0.0,
            "sizes": sorted(ages, key=lambda a: int(a.split("-")[0])), "link": rep["aw_deep_link"],
            "image": rep["aw_image_url"], "n_variants": len(rows),
        }
    json.dump(res, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"{len(res)} picks de niño -> {out}")


if __name__ == "__main__":
    main(*sys.argv[1:3])
