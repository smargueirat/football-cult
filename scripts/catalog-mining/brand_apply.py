"""Applies brand->product assignment across every products.ts block,
using the per-store link->brand maps from brand_backfill.py (merged) plus
Mystery Shirt Club's vendor field (fetched separately, see msc_brand_map
below). Majority vote across a product's offers decides its brand;
ties/no-data leave `brand` unset (filtered out of the Brand chips, still
shows under "all").
"""
import json, re, sys, os, glob
from collections import Counter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from refresh import split_blocks

PRODUCTS_TS = "/home/piojo/football-cult/src/data/products.ts"


def load_maps(maps_dir):
    combined = {}  # store -> {url: brand}
    for path in glob.glob(os.path.join(maps_dir, "brandmap_*.json")):
        store = os.path.basename(path)[len("brandmap_"):-len(".json")]
        combined[store] = json.load(open(path, encoding="utf-8"))
    return combined


OFFER_RE = re.compile(r'\{ store: "([^"]+)", .*?url: "([^"]+)"', re.S)


def apply_brands(maps_dir, dry_run=True):
    maps = load_maps(maps_dir)
    content = open(PRODUCTS_TS, encoding="utf-8").read()
    head, blocks, tail = split_blocks(content)

    assigned = Counter()
    new_blocks = []
    for block in blocks:
        if '  brand:' in block or '\n    brand:' in block:
            new_blocks.append(block)
            continue
        votes = Counter()
        for m in OFFER_RE.finditer(block):
            store_key, url = m.group(1), m.group(2)
            store_map = maps.get(store_key.lower())
            if not store_map:
                continue
            # url has escaped quotes undone already by regex; feeds keyed
            # by the exact same aw_deep_link string we stored verbatim.
            brand = store_map.get(url)
            if brand:
                votes[brand] += 1
        if votes:
            top_brand, _ = votes.most_common(1)[0]
            assigned[top_brand] += 1
            block = re.sub(
                r'(\n\s*jerseyPattern: "[^"]*",\n)',
                r'\1    brand: "' + top_brand + '",\n',
                block,
                count=1,
            )
        new_blocks.append(block)

    print("Assigned brands:", dict(assigned))
    print("Blocks without a brand:", len(blocks) - sum(assigned.values()))

    if not dry_run:
        new_content = head + "".join(new_blocks) + tail
        open(PRODUCTS_TS, "w", encoding="utf-8").write(new_content)


if __name__ == "__main__":
    maps_dir = sys.argv[1]
    dry_run = "--apply" not in sys.argv
    apply_brands(maps_dir, dry_run)
