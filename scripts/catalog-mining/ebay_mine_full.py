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

CURRENT_TYPES = ("home", "away", "third", "goalkeeper", "training")
KIDS_TYPES = ("home", "away", "third")
RETRO_TYPES = ("home", "away", "third")

TYPE_QUERY_WORD = {
    "home": "home",
    "away": "away",
    "third": "third",
    "goalkeeper": "goalkeeper",
    "training": "training",
}
SEASON_OK_RE = re.compile(r"\b(2025[/-]26|2025-2026|2026[/-]27|2026-2027|\b2026\b)\b")


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
        query = f"{team_en} {TYPE_QUERY_WORD[type_key]} soccer jersey 2025 2026"
        results = client.search(query, limit=25)
        candidates = []
        for item in results:
            title = item.get("title") or ""
            if not JERSEY_RE.search(title):
                continue
            if EXCLUDE_RE.search(title):
                continue
            if ACCESSORY_RE.search(title):
                continue
            if not SEASON_OK_RE.search(title):
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
            candidates.append({
                "title": title, "price": amount, "shipping": 0.0,
                "currency": price.get("currency", "USD"),
                "link": item.get("itemAffiliateWebUrl") or item.get("itemWebUrl"),
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
            candidates.append({
                "title": title, "price": amount, "shipping": 0.0,
                "currency": price.get("currency", "USD"),
                "link": item.get("itemAffiliateWebUrl") or item.get("itemWebUrl"),
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
        query = f"{team_en} {TYPE_QUERY_WORD[type_key]} soccer jersey retro vintage"
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
            cand = {
                "title": title, "price": amount, "shipping": 0.0,
                "currency": price.get("currency", "USD"),
                "link": item.get("itemAffiliateWebUrl") or item.get("itemWebUrl"),
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
