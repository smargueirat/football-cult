import sys, re, json, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from refresh import split_blocks

PRODUCTS_TS = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'src', 'data', 'products.ts')

def existing_products():
    content = open(PRODUCTS_TS, encoding='utf-8').read()
    head, blocks, tail = split_blocks(content)
    existing = {}
    for b in blocks:
        teamm = re.search(r'teamKey: "([a-z0-9]+)"', b)
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
    # Real bug found: a kids age-range suffix like "13-14 YEARS" was
    # matching the generic 2-digit "NN-NN" pattern below and getting read
    # as season "2013/14" -- on an Italy jersey whose real season ("2026 -
    # 2027") was right there in the same title. Strip a trailing age
    # suffix (same regex the retro pipeline already uses for this) before
    # any season pattern runs.
    from extract import TITLE_KIDS_AGE_SUFFIX_RE
    stripped = TITLE_KIDS_AGE_SUFFIX_RE.sub(r'\1', title)

    m = re.search(r'\b(202[4-9])[/-](20\d{2})\b', stripped)
    if m:
        return f"{m.group(1)}/{m.group(2)[-2:]}"
    m = re.search(r'\b(202[4-9])[/-](\d{2})\b', stripped)
    if m:
        return f"{m.group(1)}/{m.group(2)}"
    # Only treat a bare "NN-NN" pair as a season when NN is in the
    # plausible season-start range (24-30) -- otherwise it's very likely
    # an age range (e.g. "9-10", "13-14") that happens to also be
    # consecutive digits, same false-positive class as above.
    m = re.search(r'\b(2[4-9]|30)[/-](\d{2})\b', stripped)
    if m:
        return f"20{m.group(1)}/{m.group(2)}"
    m = re.search(r'\b(202[4-9])\b', stripped)
    if m:
        return m.group(1)
    # títulos de selección estilo "Italy 26 Away Jersey" (año de mundial
    # suelto, sin barra) -> temporada "2026", no el default de clubes.
    m = re.search(r'\b(2[4-7])\b', stripped)
    if m:
        return f"20{m.group(1)}"
    return "2025/26"

def season_end_year(season):
    """Canonical ending year of a season string, so "2026" (our bare-year
    convention for national-team World Cup kits) and "2025/26" compare
    equal -- they're the same season, just written differently. "2026/27"
    stays genuinely different from both (real next-season conflict)."""
    m = re.match(r'^(\d{4})/(\d{2})$', season)
    if m:
        return int(m.group(1)[:2] + m.group(2))
    m = re.match(r'^(\d{4})$', season)
    if m:
        return int(m.group(1))
    return None

def seasons_equivalent(a, b):
    if a == b:
        return True
    ea, eb = season_end_year(a), season_end_year(b)
    return ea is not None and ea == eb

def split(picks_path):
    picks = json.load(open(picks_path, encoding='utf-8'))
    existing = existing_products()
    new_products = {}
    add_offers = {}
    season_conflict = {}
    for k, d in picks.items():
        detected = detect_season(d["title"])
        if k in existing:
            if seasons_equivalent(existing[k], detected):
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
