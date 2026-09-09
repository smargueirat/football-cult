"""Resolve refresh.py's "ambiguous" skips (multiple products share a
team+type key, usually because of season variants) by matching the
pick's detected season against each candidate block's real `season`
field. Only applies where exactly one candidate matches -- anything
still ambiguous after season-matching is left alone, same
skip-rather-than-guess philosophy as refresh.py itself.

Usage: python3 resolve_ambiguous.py <products.ts> <picks.json> <store_name> [currency] [--apply]
"""
import re, json, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from refresh import split_blocks, ID_RE, TEAM_RE, TYPE_RE
from split_picks import detect_season, season_end_year, seasons_equivalent
from manual_exclusions import is_manually_excluded

def block_key(block):
    team_m = TEAM_RE.search(block)
    type_m = TYPE_RE.search(block)
    if not team_m or not type_m:
        return None
    if 'ageGroup: "kids"' in block:
        return None
    return f"{team_m.group(1)}|{type_m.group(1)}"

def block_season(block):
    m = re.search(r'    season: "([^"]+)",', block)
    return m.group(1) if m else None

def resolve(products_ts_path, picks_json_path, store_name, currency="EUR", dry_run=True):
    content = open(products_ts_path, encoding="utf-8").read()
    picks = json.load(open(picks_json_path, encoding="utf-8"))
    head, blocks, tail = split_blocks(content)

    key_to_indices = {}
    for i, block in enumerate(blocks):
        key = block_key(block)
        if key is None:
            continue
        key_to_indices.setdefault(key, []).append(i)

    store_offer_re = re.compile(r'      \{ store: "' + re.escape(store_name) + r'", .*?\},\n')

    target_index = {}
    still_ambiguous = []
    no_season_match = []
    for key, indices in key_to_indices.items():
        if key not in picks or len(indices) < 2:
            continue
        if is_manually_excluded(picks[key].get("link")):
            continue
        pick_season = detect_season(picks[key]["title"])
        pick_end = season_end_year(pick_season)
        matches = []
        for i in indices:
            bs = block_season(blocks[i])
            if bs and seasons_equivalent(bs, pick_season):
                matches.append(i)
        if len(matches) == 1:
            target_index[key] = matches[0]
        elif len(matches) == 0:
            no_season_match.append((key, pick_season, [(ID_RE.search(blocks[i]).group(1), block_season(blocks[i])) for i in indices]))
        else:
            still_ambiguous.append((key, pick_season, [(ID_RE.search(blocks[i]).group(1), block_season(blocks[i])) for i in indices]))

    new_blocks = list(blocks)
    inserted = 0
    replaced = 0
    for key, i in target_index.items():
        block = new_blocks[i]
        d = picks[key]
        sizes_ts = ", ".join(f'"{s}"' for s in d["sizes"])
        price = d["price"]
        shipping = d["shipping"]
        link = d["link"].replace('"', '\\"')
        image = (d["image"] or "").replace('"', '\\"')
        title_esc = (d.get("title") or "").replace('"', '\\"')
        title_part = f'title: "{title_esc}", ' if title_esc else ""
        offer_line = (
            f'      {{ store: "{store_name}", price: {price}, shipping: {shipping}, '
            f'currency: "{currency}", url: "{link}", {title_part}inStock: true, '
            f'sizes: [{sizes_ts}], imageUrl: "{image}" }},\n'
        )
        if store_offer_re.search(block):
            block = store_offer_re.sub(offer_line, block, count=1)
            replaced += 1
        else:
            block = re.sub(r'(    \],\n  \},\n?)$', offer_line + r'\1', block)
            inserted += 1
        new_blocks[i] = block

    print(f"Resolved by season match -- Inserted: {inserted}, Replaced: {replaced}")
    if no_season_match:
        print(f"\nNo candidate block's season matched the pick's detected season ({len(no_season_match)}):")
        for key, pick_season, cands in no_season_match:
            print(f"   {key}: pick_season={pick_season} candidates={cands}")
    if still_ambiguous:
        print(f"\nStill ambiguous after season match ({len(still_ambiguous)}):")
        for key, pick_season, cands in still_ambiguous:
            print(f"   {key}: pick_season={pick_season} candidates={cands}")

    new_content = head + "".join(new_blocks) + tail
    if not dry_run:
        open(products_ts_path, "w", encoding="utf-8").write(new_content)
    return new_content

if __name__ == "__main__":
    products_path = sys.argv[1]
    picks_path = sys.argv[2]
    store_name = sys.argv[3]
    currency = sys.argv[4] if len(sys.argv) > 4 and not sys.argv[4].startswith("--") else "EUR"
    dry_run = "--apply" not in sys.argv
    resolve(products_path, picks_path, store_name, currency, dry_run)
