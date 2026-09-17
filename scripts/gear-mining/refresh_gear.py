#!/usr/bin/env python3
"""Refresca precios/tallas de guantes de arquero y pelotas minados
(mine_gear.py) contra src/data/gloves.ts y src/data/balls.ts -- mismo
patrón que refresh_boots.py (ids deterministas, reconstruye entera la
sección auto-generada cada corrida, sin estado entre días más que el id).

A diferencia de boots.ts: sin clasificación Tier/Horma (no aplica a
guantes/pelotas) y sin extracción de color dominante de fotos (nice-to-
have no hecho en esta primera carga, mismo criterio que "ship lo pedido,
sumar lo decorativo si hace falta después").

Uso: python3 scripts/gear-mining/refresh_gear.py
"""
import json, re, os, subprocess, sys, unicodedata

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))

TARGETS = [
    {
        "name": "guantes",
        "ts_path": os.path.join(REPO_ROOT, "src", "data", "gloves.ts"),
        "mined_path": os.path.join(SCRIPT_DIR, "mined_gloves.json"),
        "sentinel": "// ===AUTO-GENERATED-GLOVES-BELOW===",
        "export_name": "gloveProducts",
        "type_name": "GloveProduct",
        "chunk_var": "minedGloveProductsChunk",
    },
    {
        "name": "pelotas",
        "ts_path": os.path.join(REPO_ROOT, "src", "data", "balls.ts"),
        "mined_path": os.path.join(SCRIPT_DIR, "mined_balls.json"),
        "sentinel": "// ===AUTO-GENERATED-BALLS-BELOW===",
        "export_name": "ballProducts",
        "type_name": "BallProduct",
        "chunk_var": "minedBallProductsChunk",
    },
]
CHUNK_SIZE = 180


def slugify(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode('ascii')
    s = re.sub(r'[^a-zA-Z0-9]+', '-', s).strip('-').lower()
    return s


def ts_string(s):
    return json.dumps(s, ensure_ascii=False)


def ts_entry(e, indent=2):
    pad = " " * indent
    lines = [pad + "{"]
    lines.append(f"{pad}  id: {ts_string(e['id'])},")
    lines.append(f"{pad}  brand: {ts_string(e['brand'])},")
    lines.append(f"{pad}  model: {ts_string(e['model'])},")
    lines.append(f"{pad}  offers: [")
    o = e['offers'][0]
    lines.append(f"{pad}    {{")
    lines.append(f"{pad}      store: {ts_string(o['store'])},")
    lines.append(f"{pad}      price: {o['price']},")
    if o.get('priceMax'):
        lines.append(f"{pad}      priceMax: {o['priceMax']},")
    lines.append(f"{pad}      shipping: {o['shipping']},")
    lines.append(f"{pad}      currency: {ts_string(o['currency'])},")
    lines.append(f"{pad}      url: {ts_string(o['url'])},")
    lines.append(f"{pad}      imageUrl: {ts_string(o['imageUrl'])},")
    sizes_str = ", ".join(ts_string(s) for s in o['sizes'])
    lines.append(f"{pad}      sizes: [{sizes_str}],")
    if o.get('sizePrices'):
        lines.append(f"{pad}      sizePrices: [")
        for sp in o['sizePrices']:
            lines.append(
                f"{pad}        {{ size: {ts_string(sp['size'])}, price: {sp['price']}, url: {ts_string(sp['url'])} }},"
            )
        lines.append(f"{pad}      ],")
    lines.append(f"{pad}    }},")
    lines.append(f"{pad}  ],")
    lines.append(pad + "},")
    return "\n".join(lines)


def run_mine_gear():
    print("--- running mine_gear.py ---")
    subprocess.run([sys.executable, os.path.join(SCRIPT_DIR, "mine_gear.py")], check=True, cwd=SCRIPT_DIR)


def split_ts(ts_path, sentinel):
    src = open(ts_path, encoding="utf-8").read()
    idx = src.find(sentinel)
    if idx == -1:
        raise SystemExit(f"No se encontró el marcador {sentinel!r} en {ts_path} -- revisar a mano.")
    marker_end = src.find("\n\n", idx)
    prefix = src[: marker_end + 2] if marker_end != -1 else src[:idx] + sentinel + "\n\n"
    return prefix


def build_entries(mined, used_ids):
    entries = []
    seen_ids = set(used_ids)
    for d in mined:
        base = slugify(f"{d['store']}-{d['brand']}-{d['model']}")
        sid = base
        i = 2
        while sid in seen_ids:
            sid = f"{base}-{i}"
            i += 1
        seen_ids.add(sid)
        entries.append({
            "id": sid,
            "brand": d["brand"],
            "model": d["model"],
            "offers": [{
                "store": d["store"],
                "price": d["price"],
                **({"priceMax": d["priceMax"]} if d.get("priceMax") else {}),
                "shipping": d["shipping"],
                "currency": d["currency"],
                "url": d["url"],
                "imageUrl": d["imageUrl"],
                "sizes": d["sizes"],
                **({"sizePrices": d["sizePrices"]} if d.get("sizePrices") else {}),
            }],
        })
    return entries


def old_prices_by_id(auto_section_src):
    prices = {}
    for m in re.finditer(r'id: "([^"]+)".*?price: ([\d.]+),', auto_section_src, re.S):
        pid, price = m.group(1), m.group(2)
        if pid not in prices:
            prices[pid] = float(price)
    return prices


def write_ts(ts_path, prefix, entries, export_name, type_name, chunk_var):
    chunks = [entries[i:i + CHUNK_SIZE] for i in range(0, len(entries), CHUNK_SIZE)]
    out = [prefix]
    chunk_names = []
    for idx, chunk in enumerate(chunks, start=1):
        name = f"{chunk_var}{idx}"
        chunk_names.append(name)
        out.append(f"const {name}: {type_name}[] = [\n")
        for e in chunk:
            out.append(ts_entry(e) + "\n")
        out.append("];\n\n")

    out.append(f"export const {export_name}: {type_name}[] = [\n")
    for name in chunk_names:
        out.append(f"  ...{name},\n")
    out.append("];\n")

    with open(ts_path, "w", encoding="utf-8") as f:
        f.write("".join(out))


def refresh_one(target, mined):
    prefix = split_ts(target["ts_path"], target["sentinel"])
    full_old_src = open(target["ts_path"], encoding="utf-8").read()
    old_auto_section = full_old_src[full_old_src.find(target["sentinel"]):]
    old_prices = old_prices_by_id(old_auto_section)
    old_ids = set(old_prices.keys())

    entries = build_entries(mined, set())
    write_ts(target["ts_path"], prefix, entries, target["export_name"], target["type_name"], target["chunk_var"])

    new_ids = {e["id"] for e in entries}
    added = new_ids - old_ids
    removed = old_ids - new_ids
    price_changed = sum(
        1 for e in entries
        if (op := old_prices.get(e["id"])) is not None and op != e["offers"][0]["price"]
    )

    print(f"\n=== refresh_gear.py -- {target['name']} ===")
    print(f"total mined offers today: {len(entries)}")
    print(f"new products (not seen before): {len(added)}")
    print(f"products missing from today's feed (dropped): {len(removed)}")
    print(f"existing products with a price change: {price_changed}")


def main():
    run_mine_gear()
    for target in TARGETS:
        mined = json.load(open(target["mined_path"], encoding="utf-8"))
        refresh_one(target, mined)


if __name__ == "__main__":
    main()
