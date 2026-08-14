"""Mines current-season football jerseys from eBay via the Browse API
(read-only app-level OAuth — no eBay user login involved) and builds an
"eBay" store offer per (team, type), same shape as the Awin pipeline's
picks so it can go through the existing gen_new_teams.py/refresh.py flow.

Unlike the Awin stores (one bulk feed to filter), eBay has no bulk feed:
we run one search per (team, type), then a second "get item" call only
for the single best candidate that survives filtering (to read its real
size list — Browse API search results don't include sizes).

Usage:
    python3 ebay_mine.py <team_keys.txt or "all"> <out_picks.json>

Where team_keys.txt has one TeamKey per line (or pass "all" to cover
every team in extract.py's TEAM_PATTERNS — expensive: ~3 API calls per
team+type, budget accordingly against eBay's daily call limit).
"""
import base64, json, re, sys, os, time, urllib.request, urllib.parse, urllib.error

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract import JERSEY_RE, EXCLUDE_RE, TEAM_PATTERNS, TYPE_PATTERNS, team_re_all, type_re_all
from manual_exclusions import is_manually_excluded

_REPO_ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
ENV_PATH = os.path.join(_REPO_ROOT, ".env.local")
TEAM_EN_PATH = os.path.join(_REPO_ROOT, "src", "data", "products.ts")

TYPE_QUERY_WORD = {
    "home": "home",
    "away": "away",
    "third": "third",
}
SEASON_OK_RE = re.compile(r"\b(2025[/-]26|2025-2026|2026[/-]27|2026-2027|\b2026\b)\b")
# eBay has a lot of "jersey" in the title for SEO on listings that are
# actually just a sponsor patch/decal/badge, not a garment — real
# jerseys don't sell for single-digit dollars. Also catch the "patch"
# wording directly as a second signal (real bug found: a $11.75 Chelsea
# "Home Jersey Sleeve Sponsor ... Patch Print" listing was just a decal).
MIN_JERSEY_PRICE = 15.0
# Real bug found: with no cheaper alternative in the search results, an
# outlier/scalper-priced listing (e.g. a $699.99 "best price" for a
# jersey that normally retails $80-150) can end up picked as THE price —
# defeats the point of a price-comparison site. Authentic/player-issue
# tier jerseys legitimately run up to ~$300-400, so this only catches
# genuine outliers, not just "expensive".
MAX_JERSEY_PRICE = 500.0
ACCESSORY_RE = re.compile(r"\bpatch(es)?\b|\bdecal\b|iron.?on|\bsticker\b|\bbadge\b", re.I)
CONDITION_OK = {"NEW", "NEW_WITH_TAGS", "NEW_WITHOUT_TAGS"}
SIZE_MAP = {
    "XS": "XS", "S": "S", "SMALL": "S", "M": "M", "MEDIUM": "M", "L": "L", "LARGE": "L",
    "XL": "XL", "X-LARGE": "XL", "XLARGE": "XL",
    "XXL": "XXL", "2XL": "XXL", "XX-LARGE": "XXL",
    "3XL": "3XL", "XXXL": "3XL", "4XL": "4XL", "XXXXL": "4XL",
}


def get_env(key):
    env = open(ENV_PATH, encoding="utf-8").read()
    m = re.search(rf"^{key}=(.+)$", env, re.M)
    return m.group(1).strip() if m else None


def get_team_en_names():
    """Pulls the English team name for every TeamKey straight out of
    products.ts's teamNames table (avoids hand-duplicating ~170 names)."""
    content = open(TEAM_EN_PATH, encoding="utf-8").read()
    m = re.search(r"export const teamNames.*?=\s*\{(.*?)\n\};", content, re.S)
    body = m.group(1)
    out = {}
    for entry in re.finditer(r'(\w+):\s*\{\s*es:\s*"[^"]*",\s*en:\s*"([^"]*)"', body):
        out[entry.group(1)] = entry.group(2)
    return out


class EbayClient:
    def __init__(self):
        self.client_id = get_env("EBAY_CLIENT_ID")
        self.client_secret = get_env("EBAY_CLIENT_SECRET")
        self.campaign_id = get_env("EBAY_CAMPAIGN_ID")
        self.token = None
        self.token_expiry = 0

    def _ensure_token(self):
        if self.token and time.time() < self.token_expiry:
            return
        creds = base64.b64encode(f"{self.client_id}:{self.client_secret}".encode()).decode()
        req = urllib.request.Request(
            "https://api.ebay.com/identity/v1/oauth2/token",
            data=urllib.parse.urlencode({
                "grant_type": "client_credentials",
                "scope": "https://api.ebay.com/oauth/api_scope",
            }).encode(),
            headers={
                "Authorization": f"Basic {creds}",
                "Content-Type": "application/x-www-form-urlencoded",
            },
        )
        resp = urllib.request.urlopen(req, timeout=20)
        data = json.loads(resp.read())
        self.token = data["access_token"]
        self.token_expiry = time.time() + int(data.get("expires_in", 7200)) - 60

    def search(self, query, limit=20):
        self._ensure_token()
        params = urllib.parse.urlencode({
            "q": query,
            "limit": str(limit),
            "filter": "conditionIds:{1000|1500|1750}",  # New / New with tags / New without tags
        })
        req = urllib.request.Request(
            f"https://api.ebay.com/buy/browse/v1/item_summary/search?{params}",
            headers={
                "Authorization": f"Bearer {self.token}",
                "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
                "X-EBAY-C-ENDUSERCTX": f"affiliateCampaignId={self.campaign_id}",
            },
        )
        for attempt in range(3):
            try:
                resp = urllib.request.urlopen(req, timeout=25)
                return json.loads(resp.read()).get("itemSummaries", [])
            except urllib.error.HTTPError as e:
                print(f"  search error ({query!r}): {e.code} {e.read()[:200]}")
                return []
            except Exception as e:
                # network hiccups (timeouts, reset connections) shouldn't
                # kill an hours-long, hundreds-of-calls mining run — retry
                # a couple times, then give up on just this one query.
                print(f"  search retry {attempt + 1}/3 ({query!r}): {e}")
                time.sleep(2 * (attempt + 1))
        return []

    def get_item_details(self, item_id):
        """Same /item/{id} call as before (was get_item_sizes) — now also
        reads shippingOptions, which was always present in this response
        but discarded (shipping was hardcoded to 0.0). Returns
        (sizes, shipping_cost) where shipping_cost is None if eBay didn't
        report one (calculated at checkout, or item has local pickup
        only) — caller decides the fallback, this function never guesses.

        Marketplace/destination note: X-EBAY-C-MARKETPLACE-ID controls
        which of eBay's ~20 site marketplaces answers the call (no
        Argentina-specific one exists) and shippingOptions here reflects
        shipping to that marketplace's default region (US for EBAY_US) —
        NOT the actual buyer's country. Real per-buyer-country shipping
        needs the X-EBAY-C-ENDUSERCTX header with a contextualLocation
        override per destination, which means one extra API call *per
        destination country* per item — a real quota cost, intentionally
        not done here. See the note in refresh.py / products.ts about
        this limitation.
        """
        self._ensure_token()
        req = urllib.request.Request(
            f"https://api.ebay.com/buy/browse/v1/item/{urllib.parse.quote(item_id, safe='')}",
            headers={
                "Authorization": f"Bearer {self.token}",
                "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
            },
        )
        data = None
        for attempt in range(3):
            try:
                resp = urllib.request.urlopen(req, timeout=25)
                data = json.loads(resp.read())
                break
            except urllib.error.HTTPError:
                return [], None
            except Exception as e:
                print(f"  get_item retry {attempt + 1}/3 ({item_id!r}): {e}")
                time.sleep(2 * (attempt + 1))
        if data is None:
            return [], None
        sizes = set()
        for v in data.get("localizedAspects", []):
            if v.get("name", "").lower() == "size":
                raw = v.get("value", "").strip().upper()
                if raw in SIZE_MAP:
                    sizes.add(SIZE_MAP[raw])
        for sel in data.get("variesBy", {}).get("aspectsImageVariesBy", []):
            pass  # sizes for multi-variation listings need /item/{id}?fieldgroups — skipped, single-size fallback below
        sorted_sizes = sorted(sizes, key=lambda s: ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"].index(s))
        shipping_cost = None
        for opt in data.get("shippingOptions", []):
            cost = (opt.get("shippingCost") or {}).get("value")
            if cost is not None:
                try:
                    shipping_cost = float(cost)
                    break  # first option is eBay's primary/cheapest shipping choice
                except (TypeError, ValueError):
                    continue
        return sorted_sizes, shipping_cost


def pick_for_team_type(client, team_key, team_en, type_key, teams_re, types_re):
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
        link = item.get("itemAffiliateWebUrl") or item.get("itemWebUrl")
        if is_manually_excluded(link):
            continue
        candidates.append({
            "title": title,
            "price": amount,
            "currency": price.get("currency", "USD"),
            "link": link,
            "image": (item.get("image") or {}).get("imageUrl"),
            "item_id": item.get("itemId"),
        })
    if not candidates:
        return None
    best = min(candidates, key=lambda c: c["price"])
    sizes, shipping = (
        client.get_item_details(best["item_id"]) if best.get("item_id") else ([], None)
    )
    if not sizes:
        sizes = ["M", "L"]  # conservative fallback when eBay doesn't expose size aspects
    best["sizes"] = sizes
    # Real cost when eBay reports one (shipping to the EBAY_US marketplace
    # default region -- see get_item_details' docstring); 0.0 only as a
    # last-resort fallback when eBay genuinely didn't return an option
    # (e.g. local-pickup-only listings), not as a stand-in for "unknown".
    best["shipping"] = shipping if shipping is not None else 0.0
    return best


def mine(team_keys, out_path):
    client = EbayClient()
    team_en = get_team_en_names()
    teams_re = team_re_all()
    types_re = type_re_all()

    # Resume support: if out_path already has partial results from a
    # previous (crashed) run, keep them and skip the teams already done.
    picks = {}
    done_teams = set()
    if os.path.exists(out_path):
        try:
            picks = json.load(open(out_path, encoding="utf-8"))
            done_teams = {k.split("|")[0] for k in picks}
            print(f"Resuming: {len(picks)} picks / {len(done_teams)} teams already in {out_path}")
        except (json.JSONDecodeError, OSError):
            pass

    for i, team_key in enumerate(team_keys):
        if team_key in done_teams:
            continue
        if team_key not in team_en:
            print(f"SKIP {team_key}: no English name found in products.ts")
            continue
        for type_key in ("home", "away", "third"):
            key = f"{team_key}|{type_key}"
            result = pick_for_team_type(client, team_key, team_en[team_key], type_key, teams_re, types_re)
            if result:
                picks[key] = result
                print(f"{key}: {result['title'][:70]} ${result['price']}")
            time.sleep(0.15)  # be polite, stay well under rate limits
        if i % 10 == 0:
            json.dump(picks, open(out_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    json.dump(picks, open(out_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"\n{len(picks)} picks -> {out_path}")


if __name__ == "__main__":
    team_arg, out_path = sys.argv[1], sys.argv[2]
    if team_arg == "all":
        keys = list(TEAM_PATTERNS.keys())
    else:
        keys = [l.strip() for l in open(team_arg) if l.strip()]
    mine(keys, out_path)
