import json, re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from new_teams_batch1 import BATCH1 as _B1
from new_teams_batch2 import BATCH2 as _B2
from new_teams_batch3 import BATCH3 as _B3
from new_teams_batch4 import BATCH4 as _B4
from new_teams_batch5 import BATCH5 as _B5
BATCH1 = {**_B1, **_B2, **_B3, **_B4, **_B5}

def colors_from_existing_products(team):
    """Fallback for teams already in products.ts (original 24 + earlier
    batches already applied as real product blocks) whose metadata isn't
    in the BATCH dicts: read colorHex/colorHexSecondary off any existing
    block for that team instead of erroring out."""
    content = open('/home/piojo/football-cult/src/data/products.ts', encoding='utf-8').read()
    m = re.search(
        r'teamKey: "' + re.escape(team) + r'",\s*\n\s*season: "[^"]*",\s*\n\s*typeKey: "[^"]*",\s*\n\s*colorHex: "([^"]*)",\s*\n\s*colorHexSecondary: "([^"]*)"',
        content,
    )
    if m:
        return m.group(1), m.group(2)
    return None

def detect_season(title):
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
