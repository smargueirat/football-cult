"""Mines RETRO/vintage jerseys (any season before 2025) for teams already
in our catalog, across every approved store. Separate from extract.py's
pick_best pipeline because retro is fundamentally different: instead of
"one best current offer per (team, type)", we want to keep EVERY distinct
historic season we can find per (team, type), deduped only across stores
selling the exact same (team, type, season) design (cheapest wins there).

Usage (one store at a time, to keep memory/disk bounded — these CSVs run
200-360MB):
    python3 retro_extract.py <csv_path> <format: google|awin> <store_name> <out_json>

Then merge_all.py combines every store's <out_json> into one picks file.
"""
import csv, json, re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract import (
    TEAM_PATTERNS,
    TYPE_PATTERNS,
    JERSEY_RE,
    TITLE_KIDS_AGE_SUFFIX_RE,
    team_re_all,
    type_re_all,
)
from manual_exclusions import is_manually_excluded

# Same junk/other-sport/wrong-audience exclusions as extract.py's EXCLUDE_RE,
# MINUS the retro/vintage/classic/historic terms (those are exactly what we
# want here) and MINUS the bare "años \d0" old-decade filter (same reason).
RETRO_EXCLUDE_RE = re.compile(
    r"protecci[oó]n|mcdavid|\bhex\b|new england|nouvelle-angleterre|nouvelle angleterre|"
    r"infantil|niñ|nino|bebé|bebe|baby|kids?|\bjunior\b|\bjuvenil\b|mujer|women|dama|f[ée]minin|femenin|\bfemme\b|crian[çc]a|"
    # "youth" only, NOT "young" -- BSC Young Boys is a real club here and a
    # bare "young" would exclude every one of its own retro listings.
    r"\byouth\b|"
    # Real bug found (2026-08-10): unlike extract.py's KIDS_SIGNAL_RE, this
    # exclusion only caught the literal word "kids"/"niño"/etc, not eBay's
    # very common "- 9/10 - (5-6 Years)" condition-and-age-range template
    # (rating first, kid age second, no "kids" keyword anywhere) -- two
    # Sunderland retro shirts with real kids sizing slipped through as
    # regular adult products. Requiring the units word (years/años/ans/Y)
    # keeps this safe against retro titles' own season ranges ("18/19"),
    # which never carry a units word -- same reasoning as KIDS_SIGNAL_RE.
    # "Y" added after finding "...Adidas Young L 13-14Y" (Union Berlin)
    # slip through the same way with the abbreviated form.
    r"\b\d{1,2}-\d{1,2}\s*(ans|years|anos|años|y)\b|"
    r"\benfant\b|bambin[oa]|ragazz[oi]|neonato|\bmini\b|"
    r"ciclismo|chandal|chándal|sudadera|hoodie|pantal|short|medias|calcetin|"
    r"marvel|avengers|disney|maradona|"
    r"fan\b|aficionado|réplica infantil|"
    r"poster|toalla|bufanda|gorra|llavero|taza|funda|mochila|balón|balon|"
    r"\bconcept\b|\bairo\b|"
    r"\brugby\b|dkali|ruckfield|eden park|canterbury|\bkooga\b|xv de france|xv du coq",
    re.I,
)

TITLE_SIZE_SUFFIX_RE = re.compile(r"^(.*?)\s*-\s*(XXS|XS|S|M|L|XL|2XL|XXL|3XL|4XL)\s*$", re.I)


def parse_retro_season(title):
    """Returns a normalized season string with a REAL 4-digit start year
    (e.g. "1991/92", "1998"), or None if no clear historic season is
    found in the title. Handles 2-digit pairs by century-guessing
    (>=50 -> 19xx, <50 -> 20xx), unlike split_picks.py's detect_season
    (which assumes 20xx always and is only meant for modern seasons)."""
    m = re.search(r"\b(19\d\d|20\d\d)[/-](19\d\d|20\d\d)\b", title)
    if m:
        return f"{m.group(1)}/{m.group(2)[-2:]}"
    m = re.search(r"\b(19\d\d|20\d\d)[/](\d{2})\b", title)
    if m:
        return f"{m.group(1)}/{m.group(2)}"
    m = re.search(r"\b(\d{2})[/-](\d{2})\b", title)
    if m:
        a, b = int(m.group(1)), int(m.group(2))
        if b == (a + 1) % 100:
            century = 1900 if a >= 50 else 2000
            return f"{century + a}/{m.group(2)}"
    m = re.search(r"\b(19\d\d|200\d|201\d|202[0-4])\b", title)
    if m:
        return m.group(1)
    return None


def season_start_year(season):
    return int(season[:4])


def split_title_size(title):
    m = TITLE_SIZE_SUFFIX_RE.match(title)
    if m:
        return m.group(1).strip(), m.group(2).upper()
    return title, None


def strip_age_suffix_for_season_search(base_title):
    """Removes a trailing "- 11/12" style kids-age-range suffix (with or
    without a unit word) before season detection runs, so a size/age
    suffix is never misread as a season — belt-and-suspenders on top of
    the RETRO_EXCLUDE_RE kids-keyword exclusion, for feeds that encode
    kids sizing purely numerically with no kids keyword in the title."""
    m = TITLE_KIDS_AGE_SUFFIX_RE.match(base_title)
    if m:
        return m.group(1).strip()
    return base_title


SIZE_MAP = {
    "XS": "XS", "S": "S", "M": "M", "L": "L", "XL": "XL",
    "2XL": "XXL", "XXL": "XXL", "3XL": "3XL", "XXXL": "3XL",
    "4XL": "4XL", "XXXXL": "4XL",
}


def mine(csv_path, fmt, store_name):
    if fmt == "google":
        title_col, price_col, sale_col, link_col, image_col = "title", "price", "sale_price", "aw_deep_link", "image_link"
        size_col = None
        sport_col = None
    elif fmt == "awin":
        title_col, price_col, sale_col, link_col, image_col = "product_name", "search_price", None, "aw_deep_link", "aw_image_url"
        size_col = "custom_1"
        sport_col = "custom_2" if store_name.startswith("Adidas") else None
    elif fmt == "msc":
        # shopify_feed_to_csv.py output (Mystery Shirt Club): same column
        # names as "awin" but the price column is just "price".
        title_col, price_col, sale_col, link_col, image_col = "product_name", "price", None, "aw_deep_link", "aw_image_url"
        size_col = "custom_1"
        sport_col = None
    else:
        raise ValueError(fmt)

    teams = team_re_all()
    types = type_re_all()

    # (team, type, season) -> {title, price, link, image, sizes:set, store}
    candidates = {}
    seen_rows = 0
    matched_rows = 0

    with open(csv_path, encoding="utf-8-sig", errors="replace") as f:
        reader = csv.DictReader(f)
        for r in reader:
            seen_rows += 1
            title = r.get(title_col) or ""
            if not title:
                continue
            if not JERSEY_RE.search(title):
                continue
            if RETRO_EXCLUDE_RE.search(title):
                continue
            if is_manually_excluded(r.get(link_col)):
                continue
            if sport_col:
                cat = (r.get(sport_col) or "").lower()
                if cat and not any(k in cat for k in ("tbol", "utebol", "soccer")):
                    continue

            team_match = None
            team_pat = None
            for tk, pat in teams.items():
                if pat.search(title):
                    team_match = tk
                    team_pat = pat
                    break
            if not team_match:
                continue
            type_match = None
            for tyk, pat in types.items():
                if pat.search(title):
                    type_match = tyk
                    break
            if not type_match:
                continue

            base_title, title_size = split_title_size(title)
            # El título puede traer una temporada/edad como sufijo "- 11/12"
            # (feeds que ponen un talle-de-niño o rango de edad por fila,
            # ver TITLE_KIDS_AGE_SUFFIX_RE en extract.py); eso NO es una
            # temporada, así que se busca la temporada en base_title (ya sin
            # ese sufijo), no en el título crudo.
            #
            # Y el propio nombre del equipo puede traer un año incluido
            # ("Como 1907"): se lo enmascara para que ese año nunca se lea
            # como si fuera la temporada (bug real: "Como 1907 Coach
            # Training Jersey", una prenda ACTUAL, se leía como temporada
            # "1907").
            season_search_base = strip_age_suffix_for_season_search(base_title)
            team_m2 = team_pat.search(season_search_base)
            season_search_text = (
                season_search_base[: team_m2.start()] + " " + season_search_base[team_m2.end() :]
                if team_m2
                else season_search_base
            )
            season = parse_retro_season(season_search_text)
            if not season or season_start_year(season) >= 2025:
                continue  # not identifiably historic -> not retro

            key = f"{team_match}|{type_match}|{season}"

            raw_price = (r.get(sale_col) if sale_col else None) or r.get(price_col) or ""
            pm = re.search(r"([\d.,]+)", raw_price)
            if not pm:
                continue
            try:
                price = float(pm.group(1).replace(",", "."))
            except ValueError:
                continue

            sz = None
            if size_col:
                sz = (r.get(size_col) or "").strip().upper()
            if not sz or sz not in SIZE_MAP:
                sz = title_size
            size_norm = SIZE_MAP.get((sz or "").upper())

            matched_rows += 1
            existing = candidates.get(key)
            if existing is None or price < existing["price"]:
                candidates[key] = {
                    "title": base_title,
                    "price": price,
                    "link": r.get(link_col),
                    "image": r.get(image_col),
                    "sizes": set(existing["sizes"]) if existing else set(),
                    "store": store_name,
                }
            if size_norm:
                candidates[key]["sizes"].add(size_norm)

    for v in candidates.values():
        v["sizes"] = sorted(
            v["sizes"], key=lambda s: ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"].index(s)
        ) if v["sizes"] else []

    print(f"{store_name}: {seen_rows} rows scanned, {matched_rows} retro jersey rows matched, "
          f"{len(candidates)} distinct (team,type,season) combos")
    return candidates


if __name__ == "__main__":
    csv_path, fmt, store_name, out_json = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
    result = mine(csv_path, fmt, store_name)
    json.dump(result, open(out_json, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
