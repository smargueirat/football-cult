import re, json, sys

ID_RE = re.compile(r'^    id: "([^"]+)",$', re.M)
TEAM_RE = re.compile(r'^    teamKey: "([a-z]+)",$', re.M)
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

    inserted = 0
    replaced = 0
    found_keys = set()
    new_blocks = []
    for block in blocks:
        team_m = TEAM_RE.search(block)
        type_m = TYPE_RE.search(block)
        if not team_m or not type_m:
            new_blocks.append(block)
            continue
        if 'ageGroup: "kids"' in block:
            new_blocks.append(block)
            continue
        team, typ = team_m.group(1), type_m.group(1)
        key = f"{team}|{typ}"
        found_keys.add(key)
        if key in picks and key not in exclude_keys:
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
            existing_offer_re = re.compile(
                r'      \{ store: "' + re.escape(store_name) + r'", .*?\},\n'
            )
            if existing_offer_re.search(block):
                block = existing_offer_re.sub(offer_line, block, count=1)
                replaced += 1
            else:
                block = re.sub(r'(    \],\n  \},\n?)$', offer_line + r'\1', block)
                inserted += 1
        new_blocks.append(block)

    missing_product = [k for k in picks if k not in found_keys and k not in exclude_keys]
    print(f"Inserted: {inserted}, Replaced: {replaced}, blocks found: {len(blocks)}, No matching product: {missing_product}")

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
