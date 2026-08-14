import re, json, sys

ID_RE = re.compile(r'^    id: "([^"]+)",$', re.M)
TEAM_RE = re.compile(r'^    teamKey: "([a-z0-9]+)",$', re.M)
TYPE_RE = re.compile(r'^    typeKey: "([a-z]+)",$', re.M)

def split_blocks(content):
    """Split the products array into individual '  {...},\n' block strings
    by tracking brace depth, instead of one fragile regex over the whole
    file (which silently failed to match some blocks)."""
    start_marker = "const productsData = [\n"
    start = content.index(start_marker) + len(start_marker)
    end = content.index("\n];", start) + 1
    body = content[start:end]

    blocks = []
    depth = 0
    cur_start = None
    i = 0
    while i < len(body):
        ch = body[i]
        if ch == "{":
            if depth == 0:
                cur_start = i
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0 and cur_start is not None:
                # incluir la coma y salto de línea final "},\n"
                j = i + 1
                while j < len(body) and body[j] in ",\n":
                    j += 1
                blocks.append(body[cur_start:j])
                cur_start = None
        i += 1
    return content[:start], blocks, content[end:]

def refresh(products_ts_path, picks_json_path, store_name, currency="EUR", dry_run=True, exclude_keys=None):
    content = open(products_ts_path, encoding="utf-8").read()
    picks = json.load(open(picks_json_path, encoding="utf-8"))
    exclude_keys = exclude_keys or set()

    head, blocks, tail = split_blocks(content)

    # A (team, type) key isn't unique to one product id -- color/season/style
    # variant splits (e.g. "bay-goalkeeper-202526" vs "bay-goalkeeper-green-202526")
    # both carry the same teamKey+typeKey. Blindly applying a store's single
    # picked offer to every block matching the key duplicates it across all
    # variants (real bug hit 2026-08-14: 91 offers inserted into 2-5 products
    # apiece). Only ever touch a block unambiguously: a plain replace when
    # exactly one matching block already carries this store, or an insert when
    # exactly one block matches at all. Anything more ambiguous than that is
    # skipped and reported rather than guessed at.
    store_offer_re = re.compile(r'      \{ store: "' + re.escape(store_name) + r'", .*?\},\n')

    def block_key(block):
        team_m = TEAM_RE.search(block)
        type_m = TYPE_RE.search(block)
        if not team_m or not type_m:
            return None
        if 'ageGroup: "kids"' in block:
            return None
        return f"{team_m.group(1)}|{type_m.group(1)}"

    key_to_indices = {}
    for i, block in enumerate(blocks):
        key = block_key(block)
        if key is None:
            continue
        key_to_indices.setdefault(key, []).append(i)

    inserted = 0
    replaced = 0
    skipped_ambiguous = []
    found_keys = set(key_to_indices.keys())
    target_index = {}  # key -> block index to touch, or None to skip
    for key, indices in key_to_indices.items():
        if key not in picks or key in exclude_keys:
            continue
        with_store = [i for i in indices if store_offer_re.search(blocks[i])]
        if len(with_store) == 1:
            target_index[key] = with_store[0]
        elif len(with_store) == 0 and len(indices) == 1:
            target_index[key] = indices[0]
        else:
            target_index[key] = None
            skipped_ambiguous.append((key, [ID_RE.search(blocks[i]).group(1) if ID_RE.search(blocks[i]) else "?" for i in indices]))

    new_blocks = []
    for i, block in enumerate(blocks):
        key = block_key(block)
        if key is None or key not in picks or key in exclude_keys or target_index.get(key) != i:
            new_blocks.append(block)
            continue
        d = picks[key]
        sizes_ts = ", ".join(f'"{s}"' for s in d["sizes"])
        price = d["price"]
        shipping = d["shipping"]
        link = d["link"].replace('"', '\\"')
        image = (d["image"] or "").replace('"', '\\"')
        title_esc = (d.get("title") or "").replace('"', '\\"')
        title_part = f'title: "{title_esc}", ' if title_esc else ""
        offer_line = (
            f'      {{ store: "{store_name}", price: {price}, shipping: {shipping}, '
            f'currency: "{currency}", url: "{link}", {title_part}inStock: true, '
            f'sizes: [{sizes_ts}], imageUrl: "{image}" }},\n'
        )
        if store_offer_re.search(block):
            block = store_offer_re.sub(offer_line, block, count=1)
            replaced += 1
        else:
            block = re.sub(r'(    \],\n  \},\n?)$', offer_line + r'\1', block)
            inserted += 1
        new_blocks.append(block)

    missing_product = [k for k in picks if k not in found_keys and k not in exclude_keys]
    print(f"Inserted: {inserted}, Replaced: {replaced}, blocks found: {len(blocks)}, No matching product: {missing_product}")
    if skipped_ambiguous:
        print(f"Skipped (ambiguous -- multiple products share this team+type, none or several already carry {store_name}):")
        for key, ids in skipped_ambiguous:
            print(f"   {key}: {ids}")

    new_content = head + "".join(new_blocks) + tail
    if not dry_run:
        open(products_ts_path, "w", encoding="utf-8").write(new_content)
    return new_content

if __name__ == "__main__":
    products_path = sys.argv[1]
    picks_path = sys.argv[2]
    store_name = sys.argv[3]
    currency = sys.argv[4] if len(sys.argv) > 4 else "EUR"
    exclude = set(sys.argv[5].split(",")) if len(sys.argv) > 5 and sys.argv[5] else set()
    dry_run = "--apply" not in sys.argv
    refresh(products_path, picks_path, store_name, currency, dry_run, exclude)
