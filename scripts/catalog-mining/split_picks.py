import sys, re, json, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from refresh import split_blocks

def existing_products():
    content = open('/home/piojo/football-cult/src/data/products.ts', encoding='utf-8').read()
    head, blocks, tail = split_blocks(content)
    existing = {}
    for b in blocks:
        teamm = re.search(r'teamKey: "([a-z]+)"', b)
        typem = re.search(r'typeKey: "([a-z]+)"', b)
        seasonm = re.search(r'season: "([^"]+)"', b)
        if not teamm or not typem:
            continue
        if 'ageGroup: "kids"' in b:
            continue
        key = f"{teamm.group(1)}|{typem.group(1)}"
        existing[key] = seasonm.group(1)
    return existing

def detect_season(title):
    m = re.search(r'\b(202[4-9])-(20\d{2})\b', title)
    if m:
        return f"{m.group(1)}/{m.group(2)[-2:]}"
    m = re.search(r'\b(202[4-9])[/-](\d{2})\b', title)
    if m:
        return f"{m.group(1)}/{m.group(2)}"
    m = re.search(r'\b(\d{2})[/-](\d{2})\b', title)
    if m:
        return f"20{m.group(1)}/{m.group(2)}"
    m = re.search(r'\b(202[4-9])\b', title)
    if m:
        return m.group(1)
    # títulos de selección estilo "Italy 26 Away Jersey" (año de mundial
    # suelto, sin barra) -> temporada "2026", no el default de clubes.
    m = re.search(r'\b(2[4-7])\b', title)
    if m:
        return f"20{m.group(1)}"
    return "2025/26"

def split(picks_path):
    picks = json.load(open(picks_path, encoding='utf-8'))
    existing = existing_products()
    new_products = {}
    add_offers = {}
    season_conflict = {}
    for k, d in picks.items():
        detected = detect_season(d["title"])
        if k in existing:
            if existing[k] == detected:
                add_offers[k] = d
            else:
                season_conflict[k] = (existing[k], detected, d["title"])
        else:
            new_products[k] = d
    return new_products, add_offers, season_conflict

if __name__ == "__main__":
    new_products, add_offers, season_conflict = split(sys.argv[1])
    print(f"new_products: {len(new_products)}")
    print(f"add_offers: {len(add_offers)}")
    print(f"season_conflict (skipped): {len(season_conflict)}")
    for k, (old, new, title) in season_conflict.items():
        print(f"  {k}: existing={old} vs pick={new} | {title}")
    json.dump(new_products, open(sys.argv[1].replace('.json', '_NEW.json'), 'w'), ensure_ascii=False, indent=1)
    json.dump(add_offers, open(sys.argv[1].replace('.json', '_ADD.json'), 'w'), ensure_ascii=False, indent=1)
