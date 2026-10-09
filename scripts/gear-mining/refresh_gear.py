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
import json, re, os, subprocess, sys, time, unicodedata, urllib.parse

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
    {
        "name": "ropa",
        "ts_path": os.path.join(REPO_ROOT, "src", "data", "apparel.ts"),
        "mined_path": os.path.join(SCRIPT_DIR, "mined_apparel.json"),
        "sentinel": "// ===AUTO-GENERATED-APPAREL-BELOW===",
        "export_name": "apparelProducts",
        "type_name": "ApparelProduct",
        "chunk_var": "minedApparelProductsChunk",
    },
    {
        "name": "entrenamiento",
        "ts_path": os.path.join(REPO_ROOT, "src", "data", "training.ts"),
        "mined_path": os.path.join(SCRIPT_DIR, "mined_training.json"),
        "sentinel": "// ===AUTO-GENERATED-TRAINING-BELOW===",
        "export_name": "trainingProducts",
        "type_name": "TrainingProduct",
        "chunk_var": "minedTrainingProductsChunk",
    },
]
CHUNK_SIZE = 180

# Registro permanente "foto -> id". Es lo unico que evita que una URL se
# mueva cuando un proveedor cambia como escribe sus titulos.
#
# El 2026-09-27 Foot-Store hizo dos cosas a la vez sin avisar: mudo sus
# fotos de cdn.blazimg.com a b2c.spacefoot.com y empezo a mandar los
# colores en castellano en vez de frances. Como el id se derivaba del
# texto del titulo, 5.912 URLs de equipamiento (el 37% de la seccion)
# murieron en 48 horas y nacieron otras 9.275 en su lugar. Para Google eso
# es un sitio donde la mitad de las direcciones no llega a la semana, y el
# presupuesto de rastreo es justo nuestro cuello de botella.
#
# La foto SI es estable: al mudarse de CDN el nombre del archivo no cambio
# (es el SKU del fabricante). Se comprobo sobre el churn real -- el 93% de
# las URLs muertas tenian una sucesora que compartia nombre de foto.
IDS_PATH = os.path.join(SCRIPT_DIR, "gear_ids.json")


def photo_keys(entry):
    """Nombre del archivo de cada foto, sin servidor, carpeta ni extension.
    Mismo criterio que mine_gear._img_key -- ver alli el porque."""
    out = set()
    for o in entry.get("offers", []):
        u = o.get("imageUrl") or ""
        m = re.search(r"url=([^&\"]+)", u)
        raw = urllib.parse.unquote(m.group(1)) if m else u
        base = os.path.splitext(os.path.basename(raw.split("?")[0]))[0].lower()
        # Un nombre corto ("1", "img") no identifica nada.
        if len(base) >= 6:
            out.add(base)
    return out


def load_ids():
    if not os.path.exists(IDS_PATH):
        return {}
    return json.load(open(IDS_PATH, encoding="utf-8"))


def save_ids(registry):
    # Ordenado para que el diff de git sea legible y estable.
    out = {sec: dict(sorted(m.items())) for sec, m in sorted(registry.items())}
    with open(IDS_PATH, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=0, sort_keys=True)
        f.write("\n")


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
    lines.append(f"{pad}  colour: {ts_string(e['colour'])},")
    if 'type' in e:
        lines.append(f"{pad}  type: {ts_string(e['type'])},")
    lines.append(f"{pad}  offers: [")
    for o in e['offers']:
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


def build_entries(mined, used_ids, known=None):
    # mine_gear.py ya funde las tiendas espejo (Foot-Store/Sport is Good
    # ES+FR) por (marca, modelo) antes de escribir el JSON -- acá cada
    # `d` es un producto con 1+ ofertas reales, no una fila por tienda.
    # El slug ya NO lleva la tienda adelante (antes "footstorees-...",
    # ahora solo marca+modelo): un producto fundido puede tener 3-4
    # tiendas reales, ninguna más "dueña" del id que las otras.
    entries = []
    seen_ids = set(used_ids)
    # Mismo motivo que refresh_boots.py: el orden del feed no es estable
    # entre dias, asi que sin esto el .ts se reescribe entero cada scan y
    # el sufijo "-2" de desempate se reparte distinto cada vez.
    mined = sorted(mined, key=lambda d: (slugify(f"{d['brand']}-{d['model']}"), d['offers'][0]['url']))
    known = {} if known is None else known
    for d in mined:
        keys = photo_keys(d)
        # Si alguna de sus fotos ya tuvo id, se reusa: la URL no se mueve
        # aunque el proveedor haya reescrito el titulo entero. Ordenado
        # para que la eleccion no dependa del orden de un set.
        sid = next((known[k] for k in sorted(keys)
                    if k in known and known[k] not in seen_ids), None)
        if sid is None:
            base = slugify(f"{d['brand']}-{d['model']}")
            sid = base
            i = 2
            while sid in seen_ids:
                sid = f"{base}-{i}"
                i += 1
        seen_ids.add(sid)
        # Se registran TODAS sus fotos, no solo la que acerto: manana el
        # feed puede traer otra de las mismas y tiene que reconocerla.
        for k in keys:
            known.setdefault(k, sid)
        entry = {
            "id": sid,
            "brand": d["brand"],
            "model": d["model"],
            "colour": d["colour"],
            "offers": d["offers"],
        }
        if "type" in d:
            entry["type"] = d["type"]
        entries.append(entry)
    return entries


def _merge_offers(a, b):
    """Dos ofertas de la MISMA tienda para el mismo artículo (la tienda lo
    lista en dos grupos, p. ej. tallas de niño y de adulto a precios
    distintos): una sola, con el precio por talla y su enlace."""
    sys.path.insert(0, os.path.join(SCRIPT_DIR, "..", "boots-mining"))
    from mine_boots import size_sort_key
    lo, hi = sorted((a, b), key=lambda o: (o["price"], o["url"]))
    per_size = {}
    for o in (hi, lo):  # la más barata pisa
        for sp in o.get("sizePrices") or [{"size": s, "price": o["price"], "url": o["url"]} for s in o["sizes"]]:
            if sp["size"] not in per_size or sp["price"] <= per_size[sp["size"]]["price"]:
                per_size[sp["size"]] = sp
    top = max(o.get("priceMax") or o["price"] for o in (a, b))
    out = {k: v for k, v in lo.items() if k not in ("priceMax", "sizePrices")}
    out["sizes"] = sorted(per_size, key=size_sort_key)
    if top > lo["price"]:
        out["priceMax"] = top
        out["sizePrices"] = [per_size[s] for s in out["sizes"]]
    return out


def merge_same_product(entries):
    """Fichas que son el MISMO artículo y quedaron separadas (2026-10-09): mismo
    modelo y color y al menos una foto en común (el nombre de la foto es el SKU
    del fabricante, la clave de gear_ids.json). Hasta hoy solo se distinguían
    poniendo la tienda en el <title>. Se queda el id con más tiendas (a
    igualdad, el más corto) y el otro pasa a alias (308). Devuelve
    (entries, {id_fundido: id_que_queda})."""
    key = lambda e: (e["brand"].lower(), e["model"].lower(), e["colour"].lower(), e.get("type"))
    parent = {}

    def find(i):
        while parent.get(i, i) != i:
            i = parent[i]
        return i

    by_photo = {}
    for i, e in enumerate(entries):
        for p in photo_keys(e):
            j = by_photo.setdefault((key(e), p), i)
            if find(j) != find(i):
                parent[find(i)] = find(j)
    groups = {}
    for i in range(len(entries)):
        groups.setdefault(find(i), []).append(entries[i])
    out, merged = [], {}
    for g in groups.values():
        if len(g) == 1:
            out.append(g[0])
            continue
        g.sort(key=lambda e: (-len({o["store"] for o in e["offers"]}), len(e["id"]), e["id"]))
        keep = dict(g[0], offers=[])
        by_store = {}
        for e in g:
            for o in e["offers"]:
                by_store[o["store"]] = _merge_offers(by_store[o["store"]], o) if o["store"] in by_store else o
        keep["offers"] = sorted(by_store.values(), key=lambda o: (o["price"], o["store"]))
        out.append(keep)
        for e in g[1:]:
            merged[e["id"]] = keep["id"]
    order = {e["id"]: n for n, e in enumerate(entries)}
    return sorted(out, key=lambda e: order[e["id"]]), merged


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


ALIASES_PATH = os.path.join(REPO_ROOT, "src", "data", "gearAliases.json")


def update_aliases(section, old_auto_section, entries, merged=None):
    """Id que desaparece -> id del producto que hoy tiene alguna de sus mismas
    URLs de oferta (merge_by_ean lo fundió con otro). Mismo criterio que
    refresh_boots.update_aliases: acumulativo, nunca un id vivo, cadenas
    resueltas al destino final. La página /<sección>/[id] redirige con 308."""
    all_aliases = json.load(open(ALIASES_PATH)) if os.path.exists(ALIASES_PATH) else {}
    aliases = all_aliases.setdefault(section, {})
    live = {e["id"] for e in entries}
    url_to_id = {o["url"]: e["id"] for e in entries for o in e["offers"]}
    added = 0
    for m in re.finditer(r'\n  \{\n    id: "([^"]+)"(.*?)(?=\n  \{\n    id: "|\Z)', old_auto_section, re.S):
        old_id = m.group(1)
        if old_id in live:
            continue
        target = (merged or {}).get(old_id) or \
            next((url_to_id[u] for u in re.findall(r'url: "([^"]+)"', m.group(2)) if u in url_to_id), None)
        if target and aliases.get(old_id) != target:
            aliases[old_id] = target
            added += 1
    for k in list(aliases):
        seen = {k}
        while aliases.get(k) in aliases and aliases[k] not in seen:
            seen.add(aliases[k])
            aliases[k] = aliases[aliases[k]]
        if k in live:
            del aliases[k]
    all_aliases[section] = dict(sorted(aliases.items()))
    with open(ALIASES_PATH, "w", encoding="utf-8") as f:
        json.dump(dict(sorted(all_aliases.items())), f, ensure_ascii=False, indent=0)
    return added


def refresh_one(target, mined, registry, bad=None):
    prefix = split_ts(target["ts_path"], target["sentinel"])
    full_old_src = open(target["ts_path"], encoding="utf-8").read()
    old_auto_section = full_old_src[full_old_src.find(target["sentinel"]):]
    old_prices = old_prices_by_id(old_auto_section)
    old_ids = set(old_prices.keys())

    entries = build_entries(mined, set(), registry)
    if bad:
        kept = keep_old_offers(entries, parse_entries(old_auto_section), bad)
        print(f"{target['name']}: {kept} ofertas de ayer conservadas ({', '.join(sorted(bad))})")
    entries, merged = merge_same_product(entries)
    write_ts(target["ts_path"], prefix, entries, target["export_name"], target["type_name"], target["chunk_var"])

    new_ids = {e["id"] for e in entries}
    n_alias = update_aliases(target["name"], old_auto_section, entries, merged)
    print(f"{target['name']}: mismo artículo en dos fichas, fundidas: {len(merged)}")
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
    print(f"fundidos con otro (URL vieja -> redirección 308): {n_alias}")


# GUARDA por tienda (2026-10-09), misma regla que catalog-mining/refresh_offers.py:
# la sección se reconstruye entera con lo minado hoy, así que un feed que no se
# bajó (o vino cortado) borraba todas las fichas de esa tienda y sus URLs. Si el
# feed no tiene <20 h y >= 80 % de las líneas de la última vez que pasó la
# guarda, sus ofertas de hoy se descartan y se conservan las de ayer tal cual.
FEED_DIR = os.environ.get("FEED_DIR", "/tmp/feeds")
MAX_AGE_H = float(os.environ.get("FEED_MAX_AGE_H", "20"))
MIN_RATIO = 0.8
ROWS_STATE = os.path.join(SCRIPT_DIR, "gear_feed_rows.json")  # no versionado
STORE_FEED = {
    "FootStoreES": "FOOTSTORE_ES.csv", "FootStoreFR": "FOOTSTORE_FR.csv",
    "SportIsGoodES": "SPORTISGOOD_ES.csv", "SportIsGoodFR": "SPORTISGOOD_FR.csv",
    "DeporteOutlet": "DEPORTEOUTLET.csv", "GigasportDE": "GIGASPORT_DE.csv",
    "GigasportCH": "GIGASPORT_CH.csv", "GigasportFR": "GIGASPORT_FR.csv",
    "Reebok DE": "REEBOK_DE.csv", "AdidasCL": "ADIDAS_CL.csv",
}


def feed_problem(fname, last_rows):
    """None si el feed vale; si no, el motivo. Cuenta líneas (rápido): la
    proporción solo se compara consigo misma."""
    path = os.path.join(FEED_DIR, fname)
    if not os.path.exists(path):
        return "feed ausente"
    age_h = (time.time() - os.path.getmtime(path)) / 3600
    if age_h > MAX_AGE_H:
        return f"feed de hace {age_h:.0f} h (no se descargó hoy)"
    with open(path, "rb") as f:
        n = sum(chunk.count(b"\n") for chunk in iter(lambda: f.read(1 << 24), b""))
    prev = last_rows.get(fname)
    if n < 50:
        return f"feed casi vacío ({n} líneas)"
    if prev and n < MIN_RATIO * prev:
        return f"feed truncado ({n} líneas, la última vez {prev})"
    last_rows[fname] = n
    return None


def parse_entries(auto_src):
    """Entradas de la sección auto-generada (formato de ts_entry) como dicts."""
    body = re.sub(r"^const \w+: \w+\[\] = \[$|^\];$|^export const[\s\S]*", "", auto_src, flags=re.M)
    body = body[body.find("\n  {"):] if "\n  {" in body else ""
    body = re.sub(r'^(\s*)(\w+): ', r'\1"\2": ', body, flags=re.M)
    body = re.sub(r'\{ size: (.*?), price: (.*?), url: ', r'{ "size": \1, "price": \2, "url": ', body)
    body = re.sub(r",(\s*[\]}])", r"\1", body)
    return json.loads("[" + body.strip().rstrip(",") + "]") if body.strip() else []


def keep_old_offers(entries, old_entries, bad):
    """Devuelve a `entries` las ofertas de ayer de las tiendas `bad`."""
    by_id = {e["id"]: e for e in entries}
    kept = 0
    for old in old_entries:
        offers = [o for o in old["offers"] if o["store"] in bad]
        if not offers:
            continue
        kept += len(offers)
        if old["id"] in by_id:
            have = {o["url"] for o in by_id[old["id"]]["offers"]}
            by_id[old["id"]]["offers"].extend(o for o in offers if o["url"] not in have)
        else:
            e = dict(old, offers=offers)
            entries.append(e)
            by_id[e["id"]] = e
    return kept


def main():
    run_mine_gear()
    last_rows = json.load(open(ROWS_STATE)) if os.path.exists(ROWS_STATE) else {}
    bad = {}
    for store, fname in STORE_FEED.items():
        why = feed_problem(fname, last_rows)
        if why:
            bad[store] = why
            print(f"{store:14} SALTADA: {why} -- se conservan sus ofertas de ayer")
    registry = load_ids()
    for target in TARGETS:
        mined = json.load(open(target["mined_path"], encoding="utf-8"))
        if bad:
            mined = [dict(d, offers=[o for o in d["offers"] if o["store"] not in bad]) for d in mined]
            mined = [d for d in mined if d["offers"]]
        known = registry.setdefault(target["name"], {})
        before = len(known)
        refresh_one(target, mined, known, bad)
        print(f"ids conocidos: {before} -> {len(known)}")
    save_ids(registry)
    json.dump(last_rows, open(ROWS_STATE, "w"), indent=1, sort_keys=True)


if __name__ == "__main__":
    main()
