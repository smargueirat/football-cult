"""Generates products.ts TS blocks for KIDS products from a picks file
(same {team|type: {...}} shape as gen_new_teams.py's input). Separate
script because gen_new_teams.py doesn't emit ageGroup, and the id
convention for kids products drops the season (id: "{team}-{type}-kids",
matching the existing hand-authored kids blocks) instead of embedding it.
"""
import json, re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from new_teams_batch1 import BATCH1 as _B1
from new_teams_batch2 import BATCH2 as _B2
from new_teams_batch3 import BATCH3 as _B3
from new_teams_batch4 import BATCH4 as _B4
from new_teams_batch5 import BATCH5 as _B5
from new_teams_batch6 import BATCH6 as _B6
from new_teams_batch7 import BATCH7 as _B7
from new_teams_batch8 import BATCH8 as _B8
BATCH_META = {**_B1, **_B2, **_B3, **_B4, **_B5, **_B6, **_B7, **_B8}

PRODUCTS_TS = "/home/piojo/football-cult/src/data/products.ts"


def colors_for_team(content, team):
    if team in BATCH_META:
        _, _, _, c1, c2, _ = BATCH_META[team]
        return c1, c2
    m = re.search(
        r'teamKey: "' + re.escape(team) + r'",\s*\n\s*season: "[^"]*",\s*\n\s*typeKey: "[^"]*",\s*\n'
        r'\s*colorHex: "([^"]*)",\s*\n\s*colorHexSecondary: "([^"]*)"',
        content,
    )
    if m:
        return m.group(1), m.group(2)
    return None


def existing_kids(content):
    """(team, type) pairs that already have a kids block, so a re-run
    doesn't duplicate -- same purpose as split_picks.py's existing()
    check, but scoped to ageGroup:"kids" blocks specifically (those are
    the ones split_picks.py's own check explicitly skips)."""
    from refresh import split_blocks
    _, blocks, _ = split_blocks(content)
    out = set()
    for b in blocks:
        if 'ageGroup: "kids"' not in b:
            continue
        teamm = re.search(r'teamKey: "([a-z]+)"', b)
        typem = re.search(r'typeKey: "([a-z]+)"', b)
        if teamm and typem:
            out.add((teamm.group(1), typem.group(1)))
    return out


def gen(picks_path, store_name, currency, out_path):
    picks = json.load(open(picks_path, encoding="utf-8"))
    content = open(PRODUCTS_TS, encoding="utf-8").read()
    already = existing_kids(content)

    blocks = []
    for key, d in sorted(picks.items()):
        team, typ = key.split("|")
        if (team, typ) in already:
            print(f"SKIP (kids block already exists): {key}")
            continue
        colors = colors_for_team(content, team)
        if not colors:
            print(f"SKIP (no color metadata found): {key}")
            continue
        c1, c2 = colors
        sizes_ts = ", ".join(f'"{s}"' for s in d["sizes"])
        pid = f"{team}-{typ}-kids"
        link = d["link"].replace('"', '\\"')
        image = (d["image"] or "").replace('"', '\\"')
        title_escaped = d["title"].replace('"', '\\"')
        block = f'''  {{
    id: "{pid}",
    teamKey: "{team}",
    season: "2026",
    typeKey: "{typ}",
    colorHex: "{c1}",
    colorHexSecondary: "{c2}",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      {{ store: "{store_name}", price: {d["price"]}, shipping: {d["shipping"]}, currency: "{currency}", url: "{link}", title: "{title_escaped}", inStock: true, sizes: [{sizes_ts}], imageUrl: "{image}" }},
    ],
  }},
'''
        blocks.append(block)
    open(out_path, "w", encoding="utf-8").write("".join(blocks))
    print(f"Generated {len(blocks)} kids products -> {out_path}")


if __name__ == "__main__":
    gen(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
