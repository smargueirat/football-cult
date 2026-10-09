"""Daily hygiene pass: eBay listings get sold/delisted after we mine
them, and a dead listing just sits there `inStock: true` forever, sending
real visitors to a 404 on eBay's side (found 2026-08-28).

Covers ALL eBay marketplaces in products.ts (eBay, eBay ES, eBay IT,
eBay GB) since 2026-10-09 -- until then only `store: "eBay"` (ebay.com)
was ever re-checked and the ~5.600 ES/IT/GB offers never were.

How it works:
  1. The unit is the eBay item id (`/itm/<id>`), not the offer: the same
     listing shows up as eBay / eBay ES / eBay IT / eBay GB copies. Browse
     `getItem` 404 errorId 11001 is global (verified 2026-10-09: a dead id
     gives the same 404 under EBAY_US and EBAY_ES), so a dead id is dead
     in every marketplace.
  2. Propagation, no API calls: any id with a copy already `inStock:
     false` gets all its other copies flipped too.
  3. Rotation: live ids sorted numerically, walk from the id after
     `last_id` (state file) and wrap around, so new ids slot in without
     shifting a positional cursor. One getItem call per id, with the
     marketplace header of its first live copy.
  4. Budget: buy.browse is 5000 calls/day shared with mining, ebay_gb_retro
     and the site's /api/ebay-shipping. The run reads the real remaining
     quota from the Analytics rate_limit API and spends `remaining -
     reserve` at most (capped by max_calls). Stops on the first 429.
  5. Dead = 404 errorId 11001 or estimatedAvailabilityStatus
     OUT_OF_STOCK. Anything else (network, 5xx, other 4xx) changes
     nothing. products.ts is re-read right before writing, so edits made
     while the checks ran are kept.

Usage:
    python3 ebay_check_stale.py [max_calls] [--reserve N] [--no-api]
    (defaults: max_calls 4000, reserve 600; --no-api = propagation only)
"""
import datetime, json, os, re, sys, time, urllib.error, urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ebay_mine import EbayClient

_REPO_ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
PRODUCTS_TS = os.path.join(_REPO_ROOT, "src", "data", "products.ts")
STATE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ebay_stale_check_state.json")

ITEM_URL = "https://api.ebay.com/buy/browse/v1/item/"
RATE_URL = "https://api.ebay.com/developer/analytics/v1_beta/rate_limit/?api_name=browse&api_context=buy"
LINE_RE = re.compile(r'\{ store: "(eBay(?: [A-Z]{2})?)", [^\n]*?url: "https://www\.ebay\.[a-z.]+/itm/(\d+)[^\n]*?inStock: (true|false)')
MARKETPLACE = {"eBay": "EBAY_US", "eBay ES": "EBAY_ES", "eBay IT": "EBAY_IT", "eBay GB": "EBAY_GB"}


def scan(content):
    """{id: {"live": [store, ...], "dead": bool}} for every eBay offer line."""
    ids = {}
    for m in LINE_RE.finditer(content):
        d = ids.setdefault(m[2], {"live": [], "dead": False})
        if m[3] == "true":
            d["live"].append(m[1])
        else:
            d["dead"] = True
    return ids


def flip(content, dead):
    """Every `inStock: true` eBay line whose id is in `dead` -> false."""
    n = 0
    out = []
    for line in content.split("\n"):
        m = LINE_RE.search(line)
        if m and m[3] == "true" and m[2] in dead:
            line = line.replace("inStock: true", "inStock: false", 1)
            n += 1
        out.append(line)
    return "\n".join(out), n


def remaining_quota(client):
    req = urllib.request.Request(RATE_URL, headers={"Authorization": f"Bearer {client.token}"})
    data = json.loads(urllib.request.urlopen(req, timeout=20).read())
    for rl in data.get("rateLimits", []):
        for r in rl.get("resources", []):
            if r.get("name") == "buy.browse":
                return r["rates"][0]["remaining"]
    return None


def check(client, item_id, marketplace):
    """True = dead, False = alive, None = unknown, "quota" = 429."""
    url = f"{ITEM_URL}v1|{item_id}|0?fieldgroups=COMPACT"
    headers = {"Authorization": f"Bearer {client.token}", "X-EBAY-C-MARKETPLACE-ID": marketplace}
    for _ in range(2):
        try:
            data = json.loads(urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=20).read())
            status = {a.get("estimatedAvailabilityStatus") for a in data.get("estimatedAvailabilities", [])}
            return status == {"OUT_OF_STOCK"}
        except urllib.error.HTTPError as e:
            if e.code == 429:
                return "quota"
            if e.code == 404:
                return True if b"11001" in e.read() else None
            if e.code < 500:
                return None
        except Exception:
            pass
        time.sleep(1)
    return None


def load_state():
    try:
        return json.load(open(STATE_PATH, encoding="utf-8"))
    except (OSError, ValueError):
        return {}


def main():
    argv = sys.argv[1:]
    reserve = 600
    if "--reserve" in argv:
        i = argv.index("--reserve")
        reserve = int(argv[i + 1])
        del argv[i:i + 2]
    no_api = "--no-api" in argv
    argv = [a for a in argv if a != "--no-api"]
    max_calls = int(argv[0]) if argv else 4000

    ids = scan(open(PRODUCTS_TS, encoding="utf-8").read())
    zombies = {i for i, d in ids.items() if d["dead"] and d["live"]}
    live = sorted((i for i, d in ids.items() if d["live"] and not d["dead"]), key=int)
    print(f"{len(ids)} eBay item ids, {len(live)} live, {len(zombies)} zombies (dead copy elsewhere)")

    dead, checked, state = set(zombies), 0, load_state()
    state.pop("cursor", None)  # pre-2026-10-09 positional cursor, meaningless now
    if not no_api and live:
        client = EbayClient()
        client._ensure_token()
        try:
            rem = remaining_quota(client)
        except Exception as e:
            rem = None
            print(f"rate_limit API failed ({e}), using a conservative 500-call budget")
        budget = max(0, min(max_calls, (rem if rem is not None else 500 + reserve) - reserve))
        print(f"buy.browse remaining: {rem}, reserve {reserve} -> budget {budget} calls")

        last = int(state.get("last_id", 0))
        start = next((k for k, i in enumerate(live) if int(i) > last), 0)
        order = live[start:] + live[:start]
        deadline, unknown = time.time() + 45 * 60, 0
        for item_id in order[:budget]:
            if time.time() > deadline:
                print("Stopping: 45 min wall-clock cap.")
                break
            r = check(client, item_id, MARKETPLACE[ids[item_id]["live"][0]])
            if r == "quota":
                print("Stopping: 429 quota hit.")
                break
            if r is None:
                unknown += 1
                print(f"  unknown (left as is): {item_id}")
                if unknown >= 20:
                    print("Stopping: 20 unknown answers, network or API trouble.")
                    break
                continue
            unknown = 0
            checked += 1
            if r:
                dead.add(item_id)
            if int(item_id) < int(state.get("last_id", 0)):  # wrapped: new cycle
                state["cycle"] = state.get("cycle", 1) + 1
                state["cycle_started"] = str(datetime.date.today())
            state["last_id"] = item_id
        state.setdefault("cycle", 1)
        state.setdefault("cycle_started", str(datetime.date.today()))
        state["last_run"] = {"date": str(datetime.date.today()), "checked": checked,
                             "dead": len(dead - zombies), "live_ids": len(live)}
        open(STATE_PATH, "w", encoding="utf-8").write(json.dumps(state, indent=1) + "\n")

    # re-read: anything written to products.ts during the checks survives
    content = open(PRODUCTS_TS, encoding="utf-8").read()
    new, n = flip(content, dead)
    if n:
        open(PRODUCTS_TS, "w", encoding="utf-8").write(new)
    days = f"~{-(-len(live) // checked)} days" if checked else "n/a"
    print(f"Checked {checked} ids, {len(dead - zombies)} dead, {len(zombies)} zombies propagated, "
          f"{n} offers -> inStock: false. Full rotation at this rate: {days}.")


if __name__ == "__main__":
    main()
