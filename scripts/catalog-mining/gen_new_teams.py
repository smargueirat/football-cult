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
from new_teams_batch9 import BATCH9 as _B9
from new_teams_batch10 import BATCH10 as _B10
from new_teams_batch11 import BATCH11 as _B11
from new_teams_batch12 import BATCH12 as _B12
from new_teams_batch13 import BATCH13 as _B13
from new_teams_batch14 import BATCH14 as _B14
from new_teams_batch15 import BATCH15 as _B15
BATCH1 = {**_B1, **_B2, **_B3, **_B4, **_B5, **_B6, **_B7, **_B8, **_B9, **_B10, **_B11, **_B12, **_B13, **_B14, **_B15}

def colors_from_existing_products(team):
    """Fallback for teams already in products.ts (original 24 + earlier
    batches already applied as real product blocks) whose metadata isn't
    in the BATCH dicts: read colorHex/colorHexSecondary off any existing
    block for that team instead of erroring out."""
    products_ts = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'src', 'data', 'products.ts')
    content = open(products_ts, encoding='utf-8').read()
    m = re.search(
        r'teamKey: "' + re.escape(team) + r'",\s*\n\s*season: "[^"]*",\s*\n\s*typeKey: "[^"]*",\s*\n\s*colorHex: "([^"]*)",\s*\n\s*colorHexSecondary: "([^"]*)"',
        content,
    )
    if m:
        return m.group(1), m.group(2)
    return None

# detect_season() used to be duplicated here with a narrower/buggier
# implementation than split_picks.py's (no support for full "YYYY/YYYY"
# titles, no guard against a kids age-suffix like "13-14 YEARS" being
# misread as a season) -- real bug found: that drift caused new products
# generated here to sometimes get a different season string than
# split_picks.py would compute for the exact same title, so a later
# re-mine of the same team+type would file a spurious season_conflict
# against itself. Now imports the single shared implementation instead.
from split_picks import detect_season

def gen(picks_path, store_name, currency, out_path):
    picks = json.load(open(picks_path, encoding='utf-8'))
    blocks = []
    for key, d in sorted(picks.items()):
        team, typ = key.split("|")
        if team in BATCH1:
            es, en, pt, c1, c2, _ = BATCH1[team]
        else:
            fallback = colors_from_existing_products(team)
            if not fallback:
                print("SKIP (no metadata found):", key)
                continue
            c1, c2 = fallback
        season = detect_season(d["title"])
        sizes_ts = ", ".join(f'"{s}"' for s in d["sizes"])
        pid = f"{team}-{typ}-{season.replace('/', '')}"
        link = d["link"].replace('"', '\\"')
        image = (d["image"] or "").replace('"', '\\"')
        title_escaped = d["title"].replace('"', '\\"')
        block = f'''  {{
    id: "{pid}",
    teamKey: "{team}",
    season: "{season}",
    typeKey: "{typ}",
    colorHex: "{c1}",
    colorHexSecondary: "{c2}",
    jerseyPattern: "solid",
    offers: [
      {{ store: "{store_name}", price: {d["price"]}, shipping: {d["shipping"]}, currency: "{currency}", url: "{link}", title: "{title_escaped}", inStock: true, sizes: [{sizes_ts}], imageUrl: "{image}" }},
    ],
  }},
'''
        blocks.append(block)
    open(out_path, 'w', encoding='utf-8').write("".join(blocks))
    print(f"Generated {len(blocks)} new products -> {out_path}")

if __name__ == "__main__":
    gen(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
