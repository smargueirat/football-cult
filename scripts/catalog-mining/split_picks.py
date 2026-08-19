import sys, re, json, os
from collections import defaultdict
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from refresh import split_blocks

PRODUCTS_TS = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'src', 'data', 'products.ts')

def existing_products():
    """team|type -> the set of every season already on file for that key.

    Real bug found 2026-08-18: a team+type key isn't unique to one product
    id -- color/season/style variant splits (e.g. "liverpool-prematch-
    202526" vs "liverpool-prematch-red-202526", both season "2025/26"; or
    "manutd-prematch-202627" vs "manutd-prematch-202526", genuinely
    different seasons) mean MULTIPLE blocks can share one team|type key.
    The old version of this function kept a single `existing[key] =
    season` (whichever block happened to be LAST in iteration order),
    which silently overwrote earlier blocks -- a fresh pick could get
    misclassified as `season_conflict` against the wrong existing season
    (or vice versa: misclassified as `add_offers` when it actually should
    conflict), purely depending on block order in the file. Confirmed
    real-world impact: manutd|prematch and realmadrid|prematch both
    already had a `-202627` product on file, but a fresh PlanetFoot
    2026/27 pick was still being flagged `season_conflict` against
    whichever OTHER (older-season) block happened to be seen last for
    that key. Now returns every season seen for the key, and callers
    should check membership (`seasons_equivalent` against any of them)
    instead of equality against a single value. This matters even more
    now that season_conflict auto-generates new products (see split()
    below) -- misclassifying an already-covered season as a fresh
    conflict would create a real duplicate product, not just a stale log
    line.
    """
    content = open(PRODUCTS_TS, encoding='utf-8').read()
    head, blocks, tail = split_blocks(content)
    existing = defaultdict(set)
    for b in blocks:
        teamm = re.search(r'teamKey: "([a-z0-9]+)"', b)
        typem = re.search(r'typeKey: "([a-z]+)"', b)
        seasonm = re.search(r'season: "([^"]+)"', b)
        if not teamm or not typem:
            continue
        if 'ageGroup: "kids"' in b:
            continue
        key = f"{teamm.group(1)}|{typem.group(1)}"
        existing[key].add(seasonm.group(1))
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

    # Real bug found 2026-08-19 (eBay full mine): a player squad number
    # written "#27" was matching the bare-2-digit season fallback below
    # (\b(2[4-7])\b) -- "27" in "#27" satisfies \b on both sides since "#"
    # is a non-word char -- misreading a genuine 2008/09 retro Reading FC
    # listing as "season 2027" and letting it slip past
    # ebay_mine_full.py's is_current_season() current-only filter. Strip
    # any "#<digits>" squad-number marker before season detection runs.
    stripped = re.sub(r'#\d+', '', stripped)

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
            if any(seasons_equivalent(s, detected) for s in existing[k]):
                add_offers[k] = d
            else:
                # every season already on file for this key, for the log line
                # below and for CONFLICT.json's audit trail
                season_conflict[k] = ("|".join(sorted(existing[k])), detected, d["title"])
        else:
            new_products[k] = d
    return new_products, add_offers, season_conflict

if __name__ == "__main__":
    new_products, add_offers, season_conflict = split(sys.argv[1])
    print(f"new_products: {len(new_products)}")
    print(f"add_offers: {len(add_offers)}")
    print(f"season_conflict (auto-resolve candidates -- still needs photo verification, see README): {len(season_conflict)}")
    for k, (old, new, title) in season_conflict.items():
        print(f"  {k}: existing={old} vs pick={new} | {title}")
    json.dump(new_products, open(sys.argv[1].replace('.json', '_NEW.json'), 'w'), ensure_ascii=False, indent=1)
    json.dump(add_offers, open(sys.argv[1].replace('.json', '_ADD.json'), 'w'), ensure_ascii=False, indent=1)
    # CONFLICT.json carries the SAME shape as NEW.json (full pick dict, not
    # just the (old, new, title) summary tuple) so it can be run through
    # gen_new_teams.py exactly like a genuinely-new pick, once each entry
    # has been through the same photo-verification pass any other new
    # product gets. See README.md "season_conflict is now auto-resolved-
    # when-clean" for the full workflow -- this is NOT a green light to
    # skip verification, it's what removes the old "stop and ask a human"
    # step for the clean cases while still requiring a real check.
    picks_raw = json.load(open(sys.argv[1], encoding='utf-8'))
    conflict_full = {k: picks_raw[k] for k in season_conflict}
    json.dump(conflict_full, open(sys.argv[1].replace('.json', '_CONFLICT.json'), 'w'), ensure_ascii=False, indent=1)
