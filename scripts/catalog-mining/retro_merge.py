"""Merges every store's picks_<store>.json (from retro_extract.py) into
one dict keyed by "team|type|season", each value holding the list of
per-store offers for that exact historic design. Run after all stores
have been mined.
"""
import json, glob, os, sys

STORE_META = {
    "FootStoreES": (7.99, "EUR"),
    "FootStoreFR": (6.99, "EUR"),
    "SportIsGoodES": (7.99, "EUR"),
    "SportIsGoodFR": (6.99, "EUR"),
    "AdidasES": (0.0, "EUR"),
    "AdidasPT": (4.99, "EUR"),
    "PlanetFoot": (0.0, "EUR"),
    "FansJerseyHub": (0.0, "USD"),
    "ComoFCShop": (0.0, "EUR"),
    "DeporteOutletES": (8.0, "EUR"),
    "BSTNIT": (0.0, "EUR"),
    "MysteryShirtClub": (0.0, "GBP"),
}

def merge(retro_dir):
    merged = {}
    for path in glob.glob(os.path.join(retro_dir, "picks_*.json")):
        data = json.load(open(path, encoding="utf-8"))
        for key, d in data.items():
            store = d["store"]
            shipping, currency = STORE_META.get(store, (0.0, "EUR"))
            offer = {
                "store": store,
                "price": d["price"],
                "shipping": shipping,
                "currency": currency,
                "link": d["link"],
                "image": d["image"],
                "title": d["title"],
                "sizes": d["sizes"],
            }
            merged.setdefault(key, []).append(offer)
    return merged

if __name__ == "__main__":
    retro_dir = sys.argv[1]
    out_path = sys.argv[2]
    merged = merge(retro_dir)
    json.dump(merged, open(out_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"{len(merged)} distinct (team,type,season) products, "
          f"{sum(len(v) for v in merged.values())} total offers")
    from collections import Counter
    teams = Counter(k.split("|")[0] for k in merged)
    print(f"{len(teams)} distinct teams represented")
    seasons = Counter(k.split("|")[2] for k in merged)
    print("season range sample:", sorted(seasons.keys())[:5], "...", sorted(seasons.keys())[-5:])
