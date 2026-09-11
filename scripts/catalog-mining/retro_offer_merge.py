"""Merge eBay retro picks into retro products that already exist.

`refresh.py` can't do this: it keys offers by teamKey+typeKey, and every
retro product carries `typeKey: "retro"` literally -- home/away/third only
survives in the id suffix, so a retro pick's real identity is its full
generated id `{team}-retro-{seasonSlug}-{type}` (README, 2026-08-21).

Usage: python3 retro_offer_merge.py <products.ts> <picks.json> [--apply]
where picks.json is the {key: [offer]} shape retro_gen.py takes.
"""
import json, re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from refresh import split_blocks


def merge(products_path, picks_path, apply=False):
    content = open(products_path, encoding="utf-8").read()
    head, blocks, tail = split_blocks(content)
    picks = json.load(open(picks_path, encoding="utf-8"))

    by_id = {}
    for i, b in enumerate(blocks):
        m = re.search(r'id: "([^"]+)"', b)
        if m:
            by_id[m.group(1)] = i

    inserted = replaced = same = missing = 0
    for key, offers in picks.items():
        team, typ, season = key.split("|")
        pid = f'{team}-retro-{season.replace("/", "").replace("-", "")}-{typ}'
        idx = by_id.get(pid)
        if idx is None:
            missing += 1
            continue
        o = offers[0]
        block = blocks[idx]
        if o["link"] in block:
            same += 1
            continue
        sizes = ", ".join(f'"{s}"' for s in o.get("sizes") or ["M", "L"])
        title = o["title"].replace("\\", "\\\\").replace('"', '\\"')
        line = (
            f'      {{ store: "eBay", price: {o["price"]}, '
            f'shipping: {o.get("shipping", 0.0)}, currency: "{o.get("currency", "USD")}", '
            f'url: "{o["link"]}", title: "{title}", inStock: true, '
            f'sizes: [{sizes}], imageUrl: "{o["image"]}" }},\n'
        )
        ebay_re = re.compile(r'^      \{ store: "eBay",.*\n', re.M)
        if ebay_re.search(block):
            blocks[idx] = ebay_re.sub(line, block, count=1)
            replaced += 1
        else:
            blocks[idx] = re.sub(r"(    \],\n  \},\n?)$", line + r"\1", block)
            inserted += 1

    print(f"Inserted: {inserted}, Replaced: {replaced}, "
          f"already on file (same url): {same}, no such product: {missing}")
    if apply:
        open(products_path, "w", encoding="utf-8").write(head + "".join(blocks) + tail)


if __name__ == "__main__":
    merge(sys.argv[1], sys.argv[2], "--apply" in sys.argv)
