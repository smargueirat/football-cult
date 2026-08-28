"""Daily hygiene pass: eBay listings get sold/delisted after we mine
them, but nothing re-checks an offer once it's in products.ts -- a dead
listing just sits there `inStock: true` forever, sending real visitors
to a 404 on eBay's side (found 2026-08-28 investigating two persistent
502s from /api/ebay-shipping: both were genuine "item not found" from
eBay's own API, not a bug in our shipping-fetch code).

eBay's Browse API has a real daily call quota (mining a full team pass
is ~4600+ calls and reliably exhausts it, see README's eBay section) --
5,114 eBay offers currently in the catalog is too many to re-check in
one run without competing with that day's actual mining pass for quota.
Same fix as ebay_mine_cycle.py: check a small batch per day, persist
position in a state file, cycle back to the start once the whole list's
been covered.

Usage:
    python3 ebay_check_stale.py [batch_size]   (default 200/day --> full
    catalog cycles roughly every 4 weeks, plenty for offers that don't
    go stale on their own within days)
"""
import json, os, re, sys, time, urllib.error

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ebay_mine import EbayClient

_REPO_ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
PRODUCTS_TS = os.path.join(_REPO_ROOT, "src", "data", "products.ts")
STATE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ebay_stale_check_state.json")

ITEM_URL = "https://api.ebay.com/buy/browse/v1/item/"
OFFER_RE = re.compile(
    r'\{ store: "eBay", .*?url: "(https://www\.ebay\.com/itm/(\d+)[^"]*)".*?inStock: (true|false).*? \},'
)


def load_state():
    if os.path.exists(STATE_PATH):
        return json.load(open(STATE_PATH, encoding="utf-8"))
    return {"cursor": 0}


def save_state(state):
    json.dump(state, open(STATE_PATH, "w", encoding="utf-8"), indent=1)


def is_dead(client, item_id, retries=2):
    for attempt in range(retries):
        try:
            req_headers = {
                "Authorization": f"Bearer {client.token}",
                "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
            }
            import urllib.request
            req = urllib.request.Request(f"{ITEM_URL}v1|{item_id}|0", headers=req_headers)
            urllib.request.urlopen(req, timeout=20)
            return False
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return True
            if e.code == 429:
                return None  # quota hit -- stop the whole run, don't mark anything dead on a guess
            time.sleep(1)
        except Exception:
            time.sleep(1)
    return None  # network flaky after retries -- don't deactivate on uncertainty


def main():
    batch_size = int(sys.argv[1]) if len(sys.argv) > 1 else 200
    content = open(PRODUCTS_TS, encoding="utf-8").read()

    offers = [
        (m.group(1), m.group(2))
        for m in OFFER_RE.finditer(content)
        if m.group(3) == "true"
    ]
    print(f"{len(offers)} live eBay offers in catalog")

    state = load_state()
    cursor = state.get("cursor", 0) % max(len(offers), 1)
    batch = offers[cursor : cursor + batch_size]
    if len(batch) < batch_size:
        batch += offers[: batch_size - len(batch)]  # wrap around

    client = EbayClient()
    client._ensure_token()

    dead_urls = []
    for url, item_id in batch:
        result = is_dead(client, item_id)
        if result is None:
            print("Stopping early: quota hit or network trouble.")
            break
        if result:
            dead_urls.append(url)
            print(f"  DEAD: {url}")

    new_content = content
    for url in dead_urls:
        escaped = re.escape(url)
        new_content = re.sub(
            rf'(url: "{escaped}".*?)inStock: true',
            r"\1inStock: false",
            new_content,
            count=1,
        )
    if dead_urls:
        open(PRODUCTS_TS, "w", encoding="utf-8").write(new_content)

    state["cursor"] = (cursor + len(batch)) % len(offers) if offers else 0
    save_state(state)

    print(f"Checked {len(batch)} offers, {len(dead_urls)} deactivated.")


if __name__ == "__main__":
    main()
