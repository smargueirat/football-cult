"""Expanded eBay mining pass: unlike ebay_mine.py (current season only,
home/away/third only, adults only, one cheapest pick per team+type), this
covers everything explicitly requested for a "don't leave anything out"
pass:

- Adds goalkeeper and training to the current-season query types (already
  recognized by TYPE_PATTERNS, just never queried before).
- Adds a kids pass (home/away/third), reusing extract.py's kids
  exclusion/signal regexes.
- Adds a retro pass (home/away/third), collecting EVERY distinct historic
  season found per (team, type) instead of just the cheapest overall —
  same "keep every season" philosophy as retro_extract.py, adapted for
  eBay's per-query search instead of a bulk CSV feed.

Always still condition-filtered to New/New with tags/New without tags
(the eBay API's `conditionIds` filter) — same as ebay_mine.py.

Usage:
    python3 ebay_mine_full.py <team_keys.txt or "all"> <out_dir>

Writes <out_dir>/current_picks.json, kids_picks.json, retro_picks.json.
Resume support per file (same pattern as ebay_mine.py): re-run with the
same out_dir and it skips teams already present in each file.
"""
import json, os, re, sys, time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract import (
    JERSEY_RE,
    EXCLUDE_RE,
    KIDS_EXCLUDE_RE,
    KIDS_SIGNAL_RE,
    TEAM_PATTERNS,
    team_re_all,
    type_re_all,
    is_old_season,
)
from retro_extract import parse_retro_season, RETRO_EXCLUDE_RE
from ebay_mine import EbayClient, get_team_en_names, ACCESSORY_RE, MIN_JERSEY_PRICE, MAX_JERSEY_PRICE
from manual_exclusions import is_manually_excluded
from split_picks import detect_season, season_end_year

CURRENT_TYPES = ("home", "away", "third", "goalkeeper", "training", "prematch")
KIDS_TYPES = ("home", "away", "third")
RETRO_TYPES = ("home", "away", "third")

TYPE_QUERY_WORD = {
    "home": "home",
    "away": "away",
    "third": "third",
    "goalkeeper": "goalkeeper",
    "training": "training",
    "prematch": "pre-match",
}
# Real bug found: the old hand-rolled regex here only matched a full
# 4-digit-prefixed season ("2025/26") or a bare "2026" -- but the
# overwhelming majority of real eBay titles use the short 2-digit form
# ("25/26", see "Adidas Boca Juniors 25/26 Home..."), so almost every
# current-season listing using that (extremely common) notation was
# silently rejected. Confirmed by hand: Boca Juniors and Valencia CF
# came back with zero picks despite real 25/26 stock being all over the
# raw search results. Reuses split_picks.py's detect_season() (already
# handles every notation width) instead of maintaining a second,
# less-robust parser -- "current" means the season ends in 2026 or 2027,
# both already treated as current elsewhere in products.ts.
CURRENT_SEASON_END_YEARS = {2026, 2027}


def is_current_season(title):
    # detect_season() defaults to "2025/26" when it finds no season
    # pattern at all (a reasonable default when comparing against an
    # existing catalog entry, split_picks.py's use case) -- but here
    # we're deciding whether to trust an eBay listing we've never seen
    # before, so a title with NO season indicator at all must not
    # silently pass as "current". Require an explicit match.
    detected = detect_season(title)
    if detected == "2025/26" and not re.search(r"25[/-]26", title):
        return False
    return season_end_year(detected) in CURRENT_SEASON_END_YEARS


def load(path):
    if os.path.exists(path):
        try:
            return json.load(open(path, encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            pass
    return {}


def save(picks, path):
    json.dump(picks, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)


def mine_current(client, team_key, team_en, teams_re, types_re):
    out = {}
    for type_key in CURRENT_TYPES:
        # Bug found: baking "2025 2026" into the query text made eBay's
        # relevance ranking treat it as near-required, so real current-stock
        # listings titled "2024-25"-style (still in season right now) or with
        # no year at all dropped out of the top results. Season filtering
        # already happens via is_current_season() below -- the query itself
        # should stay broad.
        query = f"{team_en} {TYPE_QUERY_WORD[type_key]} soccer jersey"
        results = client.search(query, limit=30)
        candidates = []
        for item in results:
            title = item.get("title") or ""
            if not JERSEY_RE.search(title):
                continue
            if EXCLUDE_RE.search(title):
                continue
            if ACCESSORY_RE.search(title):
                continue
            if not is_current_season(title):
                continue
            if not teams_re[team_key].search(title):
                continue
            type_match = None
            for tyk, pat in types_re.items():
                if pat.search(title):
                    type_match = tyk
                    break
            if type_match != type_key:
                continue
            price = item.get("price", {})
            try:
                amount = float(price.get("value"))
            except (TypeError, ValueError):
                continue
            if amount < MIN_JERSEY_PRICE or amount > MAX_JERSEY_PRICE:
                continue
            link = item.get("itemAffiliateWebUrl") or item.get("itemWebUrl")
            if is_manually_excluded(link):
                continue
            candidates.append({
                "title": title, "price": amount, "shipping": 0.0,
                "currency": price.get("currency", "USD"),
                "link": link,
                "image": (item.get("image") or {}).get("imageUrl"),
                "item_id": item.get("itemId"),
            })
        if not candidates:
            time.sleep(0.15)
            continue
        best = min(candidates, key=lambda c: c["price"])
        sizes = client.get_item_sizes(best["item_id"]) if best.get("item_id") else []
        best["sizes"] = sizes or ["M", "L"]
        out[f"{team_key}|{type_key}"] = best
        time.sleep(0.15)
    return out


def mine_kids(client, team_key, team_en, teams_re, types_re):
    out = {}
    for type_key in KIDS_TYPES:
        query = f"{team_en} {TYPE_QUERY_WORD[type_key]} soccer jersey kids youth"
        results = client.search(query, limit=25)
        candidates = []
        for item in results:
            title = item.get("title") or ""
            if not JERSEY_RE.search(title):
                continue
            if KIDS_EXCLUDE_RE.search(title):
                continue
            if not KIDS_SIGNAL_RE.search(title):
                continue
            if ACCESSORY_RE.search(title):
                continue
            if is_old_season(title):
                continue
            if not teams_re[team_key].search(title):
                continue
            type_match = None
            for tyk, pat in types_re.items():
                if pat.search(title):
                    type_match = tyk
                    break
            if type_match != type_key:
                continue
            price = item.get("price", {})
            try:
                amount = float(price.get("value"))
            except (TypeError, ValueError):
                continue
            if amount < 10.0 or amount > 150.0:  # kids jerseys run cheaper; own outlier bounds
                continue
            link = item.get("itemAffiliateWebUrl") or item.get("itemWebUrl")
            if is_manually_excluded(link):
                continue
            candidates.append({
                "title": title, "price": amount, "shipping": 0.0,
                "currency": price.get("currency", "USD"),
                "link": link,
                "image": (item.get("image") or {}).get("imageUrl"),
                "item_id": item.get("itemId"),
            })
        if not candidates:
            time.sleep(0.15)
            continue
        best = min(candidates, key=lambda c: c["price"])
        sizes = client.get_item_sizes(best["item_id"]) if best.get("item_id") else []
        best["sizes"] = sizes or ["9-10", "11-12"]
        out[f"{team_key}|{type_key}"] = best
        time.sleep(0.15)
    return out


def mine_retro(client, team_key, team_en, teams_re, types_re):
    """Keeps EVERY distinct historic season found, not just the cheapest
    overall — one output entry per (team, type, season)."""
    out = {}
    for type_key in RETRO_TYPES:
        # Same bug class as mine_current: many genuinely old listings (a
        # reseller's "TEAM 2013/2014 SHIRT" with no "retro"/"vintage"
        # wording at all) dropped out of results when those words were
        # baked into the query. parse_retro_season() below already does
        # the real classification -- broad query, then filter.
        query = f"{team_en} {TYPE_QUERY_WORD[type_key]} soccer jersey"
        results = client.search(query, limit=50)
        by_season = {}
        for item in results:
            title = item.get("title") or ""
            if not JERSEY_RE.search(title):
                continue
            if RETRO_EXCLUDE_RE.search(title):
                continue
            if ACCESSORY_RE.search(title):
                continue
            if not teams_re[team_key].search(title):
                continue
            type_match = None
            for tyk, pat in types_re.items():
                if pat.search(title):
                    type_match = tyk
                    break
            if type_match != type_key:
                continue
            season = parse_retro_season(title)
            if not season or int(season[:4]) >= 2025:
                continue  # no clear historic season, or not actually old
            price = item.get("price", {})
            try:
                amount = float(price.get("value"))
            except (TypeError, ValueError):
                continue
            if amount < MIN_JERSEY_PRICE or amount > MAX_JERSEY_PRICE:
                continue
            link = item.get("itemAffiliateWebUrl") or item.get("itemWebUrl")
            if is_manually_excluded(link):
                continue
            cand = {
                "title": title, "price": amount, "shipping": 0.0,
                "currency": price.get("currency", "USD"),
                "link": link,
                "image": (item.get("image") or {}).get("imageUrl"),
                "item_id": item.get("itemId"),
            }
            if season not in by_season or amount < by_season[season]["price"]:
                by_season[season] = cand
        for season, best in by_season.items():
            sizes = client.get_item_sizes(best["item_id"]) if best.get("item_id") else []
            best["sizes"] = sizes or ["M", "L"]
            best["season"] = season
            out[f"{team_key}|{type_key}|{season}"] = best
        time.sleep(0.15)
    return out


def mine(team_keys, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    client = EbayClient()
    team_en = get_team_en_names()
    teams_re = team_re_all()
    types_re = type_re_all()

    paths = {
        "current": os.path.join(out_dir, "current_picks.json"),
        "kids": os.path.join(out_dir, "kids_picks.json"),
        "retro": os.path.join(out_dir, "retro_picks.json"),
    }
    picks = {k: load(p) for k, p in paths.items()}
    done_teams = {
        k: {key.split("|")[0] for key in picks[k]} for k in picks
    }

    for i, team_key in enumerate(team_keys):
        if team_key not in team_en:
            print(f"SKIP {team_key}: no English name found in products.ts")
            continue
        en = team_en[team_key]

        if team_key not in done_teams["current"]:
            found = mine_current(client, team_key, en, teams_re, types_re)
            picks["current"].update(found)
            for k, v in found.items():
                print(f"[current] {k}: {v['title'][:65]} ${v['price']}")

        if team_key not in done_teams["kids"]:
            found = mine_kids(client, team_key, en, teams_re, types_re)
            picks["kids"].update(found)
            for k, v in found.items():
                print(f"[kids] {k}: {v['title'][:65]} ${v['price']}")

        if team_key not in done_teams["retro"]:
            found = mine_retro(client, team_key, en, teams_re, types_re)
            picks["retro"].update(found)
            for k, v in found.items():
                print(f"[retro] {k}: {v['title'][:65]} ${v['price']}")

        if i % 5 == 0:
            for k, p in paths.items():
                save(picks[k], p)
            print(f"--- progress: {i + 1}/{len(team_keys)} teams ---")

    for k, p in paths.items():
        save(picks[k], p)
    print(f"\nDone. current={len(picks['current'])} kids={len(picks['kids'])} retro={len(picks['retro'])}")


if __name__ == "__main__":
    team_arg, out_dir = sys.argv[1], sys.argv[2]
    if team_arg == "all":
        keys = list(TEAM_PATTERNS.keys())
    else:
        keys = [l.strip() for l in open(team_arg) if l.strip()]
    mine(keys, out_dir)
