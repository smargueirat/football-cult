#!/usr/bin/env python3
"""Refresca precios/tallas/fotos de las botas minadas de los feeds Awin
(adidas ES, Sport is Good ES, Foot-Store ES, Decathlon Irlanda) -- pensado
para correr todas las noches junto al scan diario de camisetas, la misma
razón por la que products.ts nunca queda con precios viejos.

Uso: python3 scripts/boots-mining/refresh_boots.py
(asume que /tmp/feeds/*.csv ya está poblado por el paso de descarga de
feeds del scan diario -- mismo cache que usa el resto del pipeline de
camisetas, no hace su propia descarga).

Qué hace, en orden:
1. Corre mine_boots.py contra el feed cache fresco de hoy.
2. Lee src/data/boots.ts, separa en el marcador
   "===AUTO-GENERATED-BOOTS-BELOW===": todo lo de ARRIBA (header, tipos,
   legacyBootProducts -- los 71 originales) se deja intacto tal cual está
   HOY en el archivo (nunca desde una copia vieja en disco -- ese fue un
   bug real de la versión manual de este pipeline, ver el commit
   original). Todo lo de ABAJO se tira y se reconstruye entero con el mine
   de hoy.
3. Ids deterministas (slugify(tienda-marca-modelo-terreno)) -- un mismo
   producto real conserva el mismo id de un día al otro mientras la
   tienda lo siga vendiendo, así que "reconstruir todo de cero" termina
   siendo, en la práctica, un update in-place: mismo id -> precio/talles/
   foto de hoy. Un producto nuevo en el feed de hoy que no coincide con
   ningún id existente entra como alta nueva.
4. Reclasifica Tier/Horma (src/data/bootTierData.json) sobre el archivo
   YA reconstruido -- barato, es texto, no imágenes, se re-hace entero
   sin problema.
5. Llama a extract_boot_colors.mjs (incremental -- sólo pide la foto real
   de un id si no está ya en bootDominantColors.json de una corrida
   anterior, para no re-descargar/analizar miles de fotos sin cambios
   cada noche).

Nota real, a propósito no resuelta acá: si un producto desaparece del
feed de una tienda (agotado, discontinuado, error de feed puntual), sale
del catálogo ese día -- BootOffer no tiene un campo inStock como sí tiene
Offer (camisetas), así que no hay manera de "marcarlo agotado" en vez de
quitarlo. Si vuelve a aparecer en el feed al día siguiente, vuelve solo
(mismo id determinista). Aceptado como limitación conocida en vez de
sumar un campo/UI nuevo sólo para esto.
"""
import json, re, os, subprocess, sys, unicodedata

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))
BOOTS_PATH = os.path.join(REPO_ROOT, "src", "data", "boots.ts")
TIER_OUT_PATH = os.path.join(REPO_ROOT, "src", "data", "bootTierData.json")
MINED_JSON_PATH = os.path.join(SCRIPT_DIR, "mined_boots.json")
PAIRS_JSON_PATH = os.path.join(SCRIPT_DIR, "boot_image_pairs.json")
SENTINEL = "// ===AUTO-GENERATED-BOOTS-BELOW==="
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
    lines.append(f"{pad}  groundType: {ts_string(e['groundType'])},")
    lines.append(f"{pad}  offers: [")
    o = e['offers'][0]
    lines.append(f"{pad}    {{")
    lines.append(f"{pad}      store: {ts_string(o['store'])},")
    lines.append(f"{pad}      price: {o['price']},")
    lines.append(f"{pad}      shipping: {o['shipping']},")
    lines.append(f"{pad}      url: {ts_string(o['url'])},")
    lines.append(f"{pad}      imageUrl: {ts_string(o['imageUrl'])},")
    sizes_str = ", ".join(ts_string(s) for s in o['sizes'])
    lines.append(f"{pad}      sizes: [{sizes_str}],")
    lines.append(f"{pad}    }},")
    lines.append(f"{pad}  ],")
    lines.append(pad + "},")
    return "\n".join(lines)


def run_mine_boots():
    print("--- running mine_boots.py ---")
    subprocess.run([sys.executable, os.path.join(SCRIPT_DIR, "mine_boots.py")], check=True, cwd=SCRIPT_DIR)


def split_boots_ts():
    src = open(BOOTS_PATH, encoding="utf-8").read()
    idx = src.find(SENTINEL)
    if idx == -1:
        raise SystemExit(
            f"No se encontró el marcador {SENTINEL!r} en {BOOTS_PATH} -- "
            "no se puede regenerar sin riesgo de pisar el bloque legacy. Revisar a mano."
        )
    # el prefijo incluye la línea del marcador y su comentario explicativo
    marker_end = src.find("\n\n", idx)
    prefix = src[: marker_end + 2] if marker_end != -1 else src[:idx] + SENTINEL + "\n\n"
    return prefix


def existing_legacy_ids(prefix):
    return set(re.findall(r'id: "([^"]+)"', prefix))


def build_entries(mined, used_ids):
    entries = []
    seen_ids = set(used_ids)
    for d in mined:
        base = slugify(f"{d['store']}-{d['brand']}-{d['model']}-{d['groundType']}")
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
            "groundType": d["groundType"],
            "offers": [{
                "store": d["store"],
                "price": d["price"],
                "shipping": d["shipping"],
                "url": d["url"],
                "imageUrl": d["imageUrl"],
                "sizes": d["sizes"],
            }],
        })
    return entries


def old_prices_by_id(auto_section_src):
    """Precio actual por id en la sección auto-generada VIEJA (antes de
    este refresh), para poder reportar cuántos precios cambiaron de
    verdad -- sólo para el log, no se guarda en ningún lado."""
    prices = {}
    for m in re.finditer(
        r'id: "([^"]+)".*?price: ([\d.]+),',
        auto_section_src,
        re.S,
    ):
        boot_id, price = m.group(1), m.group(2)
        if boot_id not in prices:
            prices[boot_id] = float(price)
    return prices


def write_boots_ts(prefix, entries):
    chunks = [entries[i:i + CHUNK_SIZE] for i in range(0, len(entries), CHUNK_SIZE)]
    out = [prefix]
    chunk_names = []
    for idx, chunk in enumerate(chunks, start=1):
        name = f"minedBootProductsChunk{idx}"
        chunk_names.append(name)
        out.append(f"const {name}: BootProduct[] = [\n")
        for e in chunk:
            out.append(ts_entry(e) + "\n")
        out.append("];\n\n")

    out.append("export const bootProducts: BootProduct[] = [\n")
    out.append("  ...legacyBootProducts,\n")
    for name in chunk_names:
        out.append(f"  ...{name},\n")
    out.append("];\n")

    with open(BOOTS_PATH, "w", encoding="utf-8") as f:
        f.write("".join(out))


def run_tier_classification():
    """Misma lógica que classify_boot_tier.py (real, transcripta de la
    hoja de referencia del usuario) -- se re-corre entera sobre el
    boots.ts ya reconstruido, legacy incluido. Es sólo texto (sin red),
    así que no hace falta hacerla incremental."""
    print("--- classifying Tier/Horma ---")
    src = open(BOOTS_PATH, encoding="utf-8").read()
    entry_re = re.compile(
        r'\{\s*\n\s*id: "([^"]+)",\s*\n\s*brand: "([^"]+)",\s*\n\s*model: "([^"]+)",'
    )
    img_re = re.compile(r'imageUrl: "([^"]+)"')

    entries = []
    for m in entry_re.finditer(src):
        boot_id, brand, model = m.group(1), m.group(2), m.group(3)
        rest = src[m.end():m.end() + 4000]
        img_m = img_re.search(rest)
        image_url = img_m.group(1) if img_m else None
        entries.append({"id": boot_id, "brand": brand, "model": model, "imageUrl": image_url})

    print(f"entries found: {len(entries)}")

    BRAND_RULES = {
        "adidas": [
            ("1+", ["elite+", "elite ft", "elite plus"]),
            ("1", ["elite"]),
            ("2", ["pro"]),
            ("3", ["league"]),
            ("4", ["club"]),
        ],
        "nike": [
            ("1+", ["elite se", "blueprint"]),
            ("1", ["elite"]),
            ("2", ["pro"]),
            ("3", ["academy"]),
            ("4", ["club"]),
        ],
        "puma": [
            ("1+", ["ultimate se", "ultimate carbon"]),
            ("1", ["ultimate"]),
            ("2", ["pro"]),
            ("3", ["match"]),
            ("4", ["play"]),
        ],
        "mizuno": [
            ("1+", ["japan", "mij", "beta japan"]),
            ("1", ["elite"]),
            ("2", ["pro"]),
            ("3", ["select"]),
            ("4", ["club"]),
        ],
        "new balance": [
            ("1", ["elite", "pro"]),
            ("2", ["team"]),
            ("3", ["magique"]),
            ("4", ["academy"]),
        ],
        "skechers": [
            ("1", ["elite"]),
            ("2", ["pro"]),
            ("3", ["academy"]),
            ("4", ["club"]),
        ],
        "joma": [
            ("1+", ["aguila pro"]),
            ("2", ["propulsion", "top flex"]),
            ("3", ["aguila col", "prop lite", "prop.lite"]),
            ("4", ["toledo", "dribling"]),
        ],
        "kipsta": [
            ("1+", ["viralto iv", "traxium"]),
            ("1", ["viralto iv"]),
            ("2", ["viralto iii"]),
            ("3", ["viralto ii"]),
            ("4", ["viralto i", "agility"]),
        ],
    }
    BRAND_HORMA = {
        "adidas": "Media/Estandar",
        "nike": "Estrecha/Media",
        "puma": "Media (bimodal: Ultra estrecha, Future ancha)",
        "mizuno": "Media/Ancha (anatomica de precision)",
        "new balance": "Media/Ancha (ofrece Wide)",
        "skechers": "Media/Ancha",
        "joma": "Media/Estandar",
        "kipsta": "Ancha/Comoda",
    }
    BRAND_ALIASES = {
        "kipsta": "kipsta",
        "decathlon": "kipsta",
        "new balance": "new balance",
        "newbalance": "new balance",
    }
    ADIDAS_NUMBERED_RE = re.compile(r'\.([1-4])\b')

    def normalize(s):
        s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode("ascii")
        return s.lower()

    def classify(brand, model):
        b = normalize(brand)
        b = BRAND_ALIASES.get(b, b)
        rules = BRAND_RULES.get(b)
        if not rules:
            return None, None
        m = normalize(model)
        for tier, keywords in rules:
            for kw in keywords:
                if re.search(r'(?<![a-z])' + re.escape(kw) + r'(?![a-z])', m):
                    return tier, BRAND_HORMA.get(b)
        if b == "adidas":
            num_m = ADIDAS_NUMBERED_RE.search(m)
            if num_m:
                return num_m.group(1), BRAND_HORMA.get(b)
        return None, BRAND_HORMA.get(b)

    tier_data = {}
    matched = 0
    by_brand_unmatched = {}
    for e in entries:
        tier, horma = classify(e["brand"], e["model"])
        if tier:
            matched += 1
            tier_data[e["id"]] = {"tier": tier, "horma": horma}
        else:
            b = normalize(e["brand"])
            by_brand_unmatched[b] = by_brand_unmatched.get(b, 0) + 1

    print(f"matched: {matched}/{len(entries)}")
    print("unmatched by brand:", by_brand_unmatched)

    with open(TIER_OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(tier_data, f, ensure_ascii=False, separators=(",", ":"))

    with open(PAIRS_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump([{"id": e["id"], "imageUrl": e["imageUrl"]} for e in entries if e["imageUrl"]], f)


def run_color_extraction():
    print("--- extracting dominant colors (incremental) ---")
    subprocess.run(["node", os.path.join(SCRIPT_DIR, "extract_boot_colors.mjs")], check=True)


def main():
    run_mine_boots()
    mined = json.load(open(MINED_JSON_PATH, encoding="utf-8"))

    prefix = split_boots_ts()
    legacy_ids = existing_legacy_ids(prefix)

    # Precios viejos de la sección auto-generada (para el reporte de abajo),
    # leídos ANTES de sobreescribir el archivo.
    full_old_src = open(BOOTS_PATH, encoding="utf-8").read()
    old_auto_section = full_old_src[full_old_src.find(SENTINEL):]
    old_prices = old_prices_by_id(old_auto_section)
    old_auto_ids = set(old_prices.keys())

    entries = build_entries(mined, legacy_ids)
    write_boots_ts(prefix, entries)

    new_ids = {e["id"] for e in entries}
    added = new_ids - old_auto_ids
    removed = old_auto_ids - new_ids
    price_changed = 0
    for e in entries:
        old_p = old_prices.get(e["id"])
        new_p = e["offers"][0]["price"]
        if old_p is not None and old_p != new_p:
            price_changed += 1

    run_tier_classification()
    run_color_extraction()

    print("\n=== refresh_boots.py summary ===")
    print(f"total mined offers today: {len(entries)}")
    print(f"new products (not seen before): {len(added)}")
    print(f"products missing from today's feed (dropped, see docstring): {len(removed)}")
    print(f"existing products with a price change: {price_changed}")


if __name__ == "__main__":
    main()
