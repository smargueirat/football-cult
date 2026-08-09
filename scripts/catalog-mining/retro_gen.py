"""Generates products.ts TS blocks for retro products from merged.json
(retro_merge.py output). Reuses colorHex/colorHexSecondary from any
existing (current-season) product of the same team — retro items only
ever cover teams already in our catalog, so this always finds a match.
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
BATCH_META = {**_B1, **_B2, **_B3, **_B4, **_B5, **_B6, **_B7}

PRODUCTS_TS = "/home/piojo/football-cult/src/data/products.ts"

# retro_extract.py's RETRO_EXCLUDE_RE doesn't filter out women's-cut
# items the way the main pipeline's EXCLUDE_RE does (that's on purpose --
# these are real, in-catalog products, not junk), so retro mining
# regularly picks up "(Ladies)"-style FansJerseyHub titles. Tag them
# ageGroup:"women" here so they show the WOMEN badge and the ageGroup
# filter, instead of silently defaulting to "men".
WOMEN_SIGNAL_RE = re.compile(r"\bwomen\b|\bwomens\b|\bdama\b|f[ée]minin|femenin|\bfemme\b|\bladies\b|\bwoman\b", re.I)


def colors_for_team(content, team):
    # BATCH1..5 (new_teams_batch*.py) store (es, en, pt, colorHex,
    # colorHexSecondary, regex) for every team added beyond the original
    # 24 — same metadata source gen_new_teams.py uses, checked first
    # since it covers teams that have NO current-season product yet
    # (only retro stock), so nothing to find in products.ts for them.
    if team in BATCH_META:
        _, _, _, c1, c2, _ = BATCH_META[team]
        return c1, c2, "solid"
    m = re.search(
        r'teamKey: "' + re.escape(team) + r'",\s*\n\s*season: "[^"]*",\s*\n\s*typeKey: "[^"]*",\s*\n'
        r'\s*colorHex: "([^"]*)",\s*\n\s*colorHexSecondary: "([^"]*)",\s*\n\s*jerseyPattern: "([^"]*)"',
        content,
    )
    if m:
        return m.group(1), m.group(2), m.group(3)
    return None


def season_slug(season):
    return season.replace("/", "").replace(" ", "")


def gen(merged_path, out_path):
    merged = json.load(open(merged_path, encoding="utf-8"))
    content = open(PRODUCTS_TS, encoding="utf-8").read()

    color_cache = {}
    blocks = []
    skipped_no_team = []

    for key in sorted(merged.keys()):
        team, typ, season = key.split("|")
        if team not in color_cache:
            color_cache[team] = colors_for_team(content, team)
        colors = color_cache[team]
        if not colors:
            skipped_no_team.append(key)
            continue
        c1, c2, pattern = colors

        offers = sorted(merged[key], key=lambda o: o["price"])
        pid = f"{team}-retro-{season_slug(season)}-{typ}"

        offer_lines = []
        for o in offers:
            sizes_ts = ", ".join(f'"{s}"' for s in o["sizes"])
            if not sizes_ts:
                continue  # no usable sizes -> skip this specific offer
            link = (o["link"] or "").replace('"', '\\"')
            image = (o["image"] or "").replace('"', '\\"')
            title_escaped = (o["title"] or "").replace('"', '\\"')
            offer_lines.append(
                f'      {{ store: "{o["store"]}", price: {o["price"]}, shipping: {o["shipping"]}, '
                f'currency: "{o["currency"]}", url: "{link}", title: "{title_escaped}", '
                f'inStock: true, sizes: [{sizes_ts}], imageUrl: "{image}" }},'
            )
        if not offer_lines:
            continue

        age_group_line = ""
        if any(WOMEN_SIGNAL_RE.search(o.get("title") or "") for o in offers):
            age_group_line = f'    ageGroup: "women",\n'

        block = (
            f'{{\n'
            f'    id: "{pid}",\n'
            f'    teamKey: "{team}",\n'
            f'    season: "{season}",\n'
            f'    typeKey: "retro",\n'
            f'    colorHex: "{c1}",\n'
            f'    colorHexSecondary: "{c2}",\n'
            f'    jerseyPattern: "{pattern}",\n'
            + age_group_line +
            f'    offers: [\n' + "\n".join(offer_lines) + "\n"
            f'    ],\n'
            f'  }},\n'
        )
        blocks.append(block)

    open(out_path, "w", encoding="utf-8").write("".join(blocks))
    print(f"Generated {len(blocks)} retro products -> {out_path}")
    if skipped_no_team:
        print(f"Skipped (no color metadata found — team key mismatch?): {skipped_no_team}")


if __name__ == "__main__":
    gen(sys.argv[1], sys.argv[2])
