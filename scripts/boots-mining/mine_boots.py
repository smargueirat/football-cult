#!/usr/bin/env python3
"""Mina botas de fútbol adulto reales de los feeds Awin ya aprobados
(adidas ES, Sport is Good ES, Foot-Store ES, Decathlon Irlanda) desde el
cache de feeds del scan diario (/tmp/feeds/*.csv). Escribe
scripts/boots-mining/mined_boots.json -- entrada de refresh_boots.py, que
lo fusiona con src/data/boots.ts.

Los 71 modelos "legacy" (cruzados por nombre entre FutbolEmotion y Forum
Sport) NO se re-minan acá -- viven como bloque fijo en
legacyBootProducts dentro de boots.ts, nunca tocado por este pipeline.

Reglas de exclusión (dos pasadas reales, ver el header de boots.ts para
la historia completa): rugby/Kakari, fútbol americano, fútbol
sala/futsal/indoor (incluyendo "IC" como código de suela al final del
nombre, ej. "Nike Street Gato IC" -- no es la palabra completa "indoor").
"""
import csv, re, json, unicodedata, os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
FEEDS = "/tmp/feeds"
OUT_PATH = os.path.join(SCRIPT_DIR, "mined_boots.json")

GROUND_PATTERNS = [
    (r'césped natural seco', 'FG'),
    (r'césped natural h[uú]medo', 'SG'),
    (r'césped artificial', 'AG'),
    (r'multitaco|multisuperficie|multi-ground|multi\s+surface', 'MG'),
    # "moqueta" (real horma española de tapón corto para 7-a-side) va en
    # TF/Turf según la propia guía del usuario ("TF/TT | Turf / Moqueta"),
    # NO en indoor. "\bindoor\b" no entra acá porque esas filas se
    # excluyen del todo antes de llegar a esta función (ver
    # EXCLUDE_KEYWORDS).
    (r'moqueta', 'TF'),
    (r'natural dry grass|firm ground', 'FG'),
    (r'natural wet grass|soft ground', 'SG'),
    (r'artificial turf|synthetic grass|artificial ground', 'AG'),
    (r'\bFG/AG\b', 'FG/AG'),
    (r'\bFG\b', 'FG'),
    (r'\bAG\b', 'AG'),
    (r'\bSG\b', 'SG'),
    (r'\bTF\b', 'TF'),
    (r'\bMG\b', 'MG'),
]

def infer_ground(*texts):
    blob = " ".join(t for t in texts if t)
    for pat, code in GROUND_PATTERNS:
        if re.search(pat, blob, re.I):
            return code
    return ""

def slugify(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode('ascii')
    s = re.sub(r'[^a-zA-Z0-9]+', '-', s).strip('-').lower()
    return s

def parse_price(s):
    if not s:
        return None
    s = s.replace(' EUR', '').replace(',', '.').strip()
    try:
        return round(float(s), 2)
    except ValueError:
        return None

def norm_title(t):
    return re.split(r'\s+-\s+', t.strip(), maxsplit=1)[0].strip()

def eu_size_from_fashion_size(v):
    # adidas ES 'Fashion:size' ya viene en EU bruto ("42", "40 2/3")
    return v.strip()

def eu_size_from_uk_eu(v):
    # decathlon 'UK 8.5 - EU 43' -> '43'
    m = re.search(r'EU\s*([\d./ ]+)', v)
    return m.group(1).strip() if m else v.strip()

def dot_size(v):
    return v.replace(',', '.').strip()

def size_sort_key(s):
    # tallas adidas vienen en "tercios" reales (ej. "36 2/3", "37 1/3"),
    # no en .5 como las de otras tiendas -- hay que sumar la fraccion para
    # que ordenen bien.
    m = re.match(r'(\d+(?:\.\d+)?)(?:\s+(\d)/(\d))?', s.strip())
    if not m:
        return 0
    base = float(m.group(1))
    if m.group(2):
        base += float(m.group(2)) / float(m.group(3))
    return base

EXCLUDE_KEYWORDS = re.compile(
    r'\brugby\b|\bhockey\b|\bb[ée]isbol\b|\bkakari\b'
    r'|f[uú]tbol\s+american[oa]\b|\bamerican\s+football\b'
    r'|\bsala\b|f[uú]tbol\s+sala\b|\bfutsal\b|\bindoor\b'
    # "IC" (Indoor Court) como código de suela al final del nombre --
    # mismo motivo que "indoor": calzado plano de calle/cancha dura, sin
    # tacos, no es una bota de fútbol de pasto (ej. "Nike Street Gato
    # IC", "Predator Pro IC"). Encontrado al armar el filtro de tapón
    # (2026-09-11): se había colado porque el exclude solo miraba la
    # palabra "indoor" completa, no esta abreviatura.
    r'|\bIC\b',
    re.I,
)

results = []

def mine_adidas_es():
    if not os.path.exists(f"{FEEDS}/ADIDAS_ES.csv"):
        print('AdidasES: feed not found, skipped')
        return
    style_groups = {}
    with open(f"{FEEDS}/ADIDAS_ES.csv", newline='', encoding='utf-8', errors='replace') as f:
        for row in csv.DictReader(f):
            if 'tbol' not in (row.get('merchant_category') or ''):
                continue
            if row.get('custom_1') != 'Adult':
                continue
            if EXCLUDE_KEYWORDS.search(row.get('product_name') or ''):
                continue
            price = parse_price(row.get('search_price'))
            if not price:
                continue
            style = (row.get('merchant_product_id') or '').rsplit('-', 1)[0]
            if not style:
                continue
            style_groups.setdefault(style, []).append(row)
    # adidas' own product_name no trae color, así que varios colorways
    # (estilos JS-code distintos) comparten el mismo texto -- se juntan
    # por (marca, nombre), quedándose con la variante más barata como
    # representante real.
    by_model = {}
    for style, rows in style_groups.items():
        rep = rows[0]
        brand = (rep.get('brand_name') or 'adidas').strip()
        model = rep.get('product_name', '').strip()
        mk = (brand.lower(), model.lower())
        by_model.setdefault(mk, []).extend(rows)
    n = 0
    for (brand_lc, model_lc), rows in by_model.items():
        rep = min(rows, key=lambda r: parse_price(r.get('search_price')) or 1e9)
        sizes = sorted({dot_size(eu_size_from_fashion_size(r.get('Fashion:size', ''))) for r in rows if r.get('Fashion:size')},
                        key=size_sort_key)
        brand = (rep.get('brand_name') or 'adidas').strip()
        model = rep.get('product_name', '').strip()
        ground = infer_ground(model, rep.get('description', ''))
        results.append({
            'store': 'AdidasES', 'brand': brand, 'model': model, 'groundType': ground,
            'price': parse_price(rep.get('search_price')), 'shipping': parse_price(rep.get('delivery_cost')) or 0,
            'url': rep.get('aw_deep_link'), 'imageUrl': rep.get('aw_image_url'), 'sizes': sizes,
        })
        n += 1
    print('AdidasES:', n)

def mine_blaz_awin(fname, store_label):
    if not os.path.exists(f"{FEEDS}/{fname}"):
        print(f'{store_label}: feed not found, skipped')
        return
    groups = {}
    with open(f"{FEEDS}/{fname}", newline='', encoding='utf-8', errors='replace') as f:
        for row in csv.DictReader(f):
            mc = row.get('merchant_category') or ''
            if 'Chaussures de football' not in mc or '> Adulte' not in mc:
                continue
            if EXCLUDE_KEYWORDS.search(row.get('product_name') or ''):
                continue
            price = parse_price(row.get('search_price'))
            if not price:
                continue
            key = row.get('parent_product_id') or row.get('merchant_product_id')
            if not key:
                continue
            groups.setdefault(key, []).append(row)
    by_model = {}
    for key, rows in groups.items():
        rep = rows[0]
        brand = (rep.get('brand_name') or '').strip()
        title = norm_title(rep.get('product_name') or '')
        mk = (brand.lower(), title.lower())
        by_model.setdefault(mk, {'brand': brand, 'model': title, 'rows': []})
        by_model[mk]['rows'].extend(rows)
    n = 0
    for mk, g in by_model.items():
        rows = g['rows']
        rep = min(rows, key=lambda r: parse_price(r.get('search_price')) or 1e9)
        sizes = sorted({dot_size(r.get('custom_1', '').strip()) for r in rows if re.match(r'^\d', r.get('custom_1', '').strip())},
                        key=size_sort_key)
        ground = infer_ground(g['model'], rep.get('description', ''))
        results.append({
            'store': store_label, 'brand': g['brand'] or 'N/D', 'model': g['model'], 'groundType': ground,
            'price': parse_price(rep.get('search_price')), 'shipping': parse_price(rep.get('delivery_cost')) or 0,
            'url': rep.get('aw_deep_link'), 'imageUrl': rep.get('aw_image_url'), 'sizes': sizes,
        })
        n += 1
    print(f'{store_label}:', n)

def mine_decathlon():
    if not os.path.exists(f"{FEEDS}/DECATHLONIE.csv"):
        print('DecathlonIE: feed not found, skipped')
        return
    groups = {}
    with open(f"{FEEDS}/DECATHLONIE.csv", newline='', encoding='utf-8', errors='replace') as f:
        for row in csv.DictReader(f):
            mc = row.get('merchant_category') or ''
            if not mc.startswith("Adult") or 'Football Boots' not in mc or 'Accessories' in mc:
                continue
            if EXCLUDE_KEYWORDS.search(row.get('product_name') or ''):
                continue
            price = parse_price(row.get('search_price'))
            if not price:
                continue
            key = (row.get('brand_name', ''), row.get('product_name', ''))
            groups.setdefault(key, []).append(row)
    n = 0
    for (brand, model), rows in groups.items():
        rep = min(rows, key=lambda r: parse_price(r.get('search_price')) or 1e9)
        sizes = sorted({dot_size(eu_size_from_uk_eu(r.get('Fashion:size', ''))) for r in rows if 'EU' in (r.get('Fashion:size') or '')},
                        key=size_sort_key)
        ground = infer_ground(rep.get('merchant_category', ''), model)
        results.append({
            'store': 'DecathlonIE', 'brand': brand or 'Kipsta', 'model': model, 'groundType': ground,
            # el feed no trae costo de envio por item -- Decathlon IE aplica
            # envio gratis a partir de un monto minimo real, 0 es la mejor
            # aproximacion disponible sin inventar un numero que el feed no da
            'price': parse_price(rep.get('search_price')), 'shipping': 0,
            'url': rep.get('aw_deep_link'), 'imageUrl': rep.get('aw_image_url') or rep.get('merchant_image_url'), 'sizes': sizes,
        })
        n += 1
    print('DecathlonIE:', n)

if __name__ == '__main__':
    mine_adidas_es()
    mine_blaz_awin('SPORTISGOOD_ES.csv', 'SportIsGoodES')
    mine_blaz_awin('FOOTSTORE_ES.csv', 'FootStoreES')
    mine_decathlon()

    print('TOTAL:', len(results))
    with open(OUT_PATH, 'w') as out:
        json.dump(results, out, ensure_ascii=False, indent=1)
