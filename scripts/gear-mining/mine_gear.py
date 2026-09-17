#!/usr/bin/env python3
"""Mina pelotas y guantes de arquero de fútbol adulto reales de los mismos
feeds Awin ya usados para camisetas/botas (cache /tmp/feeds/*.csv del scan
diario -- no hace su propia descarga). Escribe mined_balls.json y
mined_gloves.json, entrada de refresh_gear.py.

Cobertura real (2026-09-17, ver src/data/README de contexto en el
commit): Foot-Store ES/FR, Sport is Good ES/FR (backend "Blaz Awin",
mismo esquema/parent_product_id ya usado para botas), Deporte Outlet
(sin categoría confiable, filtro por título como ya hace mine_boots.py),
Gigasport AT/DE, CH, FR (merchant_product_category_path). adidas ES/PT,
Forum Sport, Decathlon Irlanda y Pro Soccer chequeados y descartados por
volumen real bajo o nulo -- no vale la pena el mantenimiento de una
función dedicada por tan poco.
"""
import csv, re, json, os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys_path_boots = os.path.join(SCRIPT_DIR, "..", "boots-mining")
import sys
sys.path.insert(0, os.path.abspath(sys_path_boots))
from mine_boots import parse_price, dot_size, size_sort_key, norm_title, EXCLUDE_KEYWORDS  # noqa: E402

FEEDS = "/tmp/feeds"

BALLS_OUT = os.path.join(SCRIPT_DIR, "mined_balls.json")
GLOVES_OUT = os.path.join(SCRIPT_DIR, "mined_gloves.json")

balls_results = []
gloves_results = []

# Mismo motivo que mine_boots.py: "fútbol americano" comparte la palabra
# "balón"/"ball" en varios idiomas con el fútbol real.
AMERICAN_FOOTBALL_RE = re.compile(r"americano|american football|football am[ée]ricain", re.I)
KIDS_RE = re.compile(r"\bjunior\b|\bni[ñn]os?\b|\benfants?\b|\bkinder\b", re.I)

# custom_1 en Foot-Store/Sport is Good ES viene inconsistente entre filas
# del MISMO feed: a veces "9" pelado, a veces "Taille 9" -- confirmado
# real con Joma Area 19 (3 tallas, las 3 con el prefijo), rompía el
# orden porque size_sort_key espera el número al principio.
def clean_size(v):
    v = (v or '').strip()
    v = re.sub(r'^taille\s+', '', v, flags=re.I)
    return dot_size(v)

# ---------- ESQUEMA "BLAZ AWIN" (Foot-Store ES, Sport is Good ES) ----------
# Mismo backend/esquema ya usado por mine_blaz_awin() en mine_boots.py:
# merchant_category confiable ("Football > Ballon de football > Adulte >
# ..." / "Football > Gants de gardien > Adulte > ..."), parent_product_id
# agrupa colorway real (una fila por talla).
def mine_blaz_category(fname, store_label, category_kw, out_list, exclude_extra=None):
    if not os.path.exists(f"{FEEDS}/{fname}"):
        print(f'{store_label}: feed not found, skipped')
        return
    groups = {}
    with open(f"{FEEDS}/{fname}", newline='', encoding='utf-8', errors='replace') as f:
        for row in csv.DictReader(f):
            mc = row.get('merchant_category') or ''
            if category_kw not in mc or '> Adulte' not in mc:
                continue
            title = row.get('product_name') or ''
            if EXCLUDE_KEYWORDS.search(title) or AMERICAN_FOOTBALL_RE.search(title):
                continue
            if exclude_extra and exclude_extra.search(title):
                continue
            price = parse_price(row.get('search_price'))
            if not price:
                continue
            key = row.get('parent_product_id') or row.get('merchant_product_id') or title
            groups.setdefault(key, []).append(row)
    n = 0
    for key, rows in groups.items():
        rep = min(rows, key=lambda r: parse_price(r.get('search_price')) or 1e9)
        brand = (rep.get('brand_name') or '').strip()
        title = norm_title(rep.get('product_name') or '')
        colour = (rep.get('colour') or '').strip()
        model = f"{title} - {colour}" if colour and colour.lower() not in title.lower() else title
        sizes = sorted({clean_size(r.get('custom_1')) for r in rows if r.get('custom_1', '').strip() and r.get('custom_1', '').strip() != 'TU'},
                        key=size_sort_key)
        price = parse_price(rep.get('search_price'))
        price_max = max((parse_price(r.get('search_price')) or 0) for r in rows)
        size_prices = sorted(
            (
                {'size': clean_size(r.get('custom_1')), 'price': parse_price(r.get('search_price')), 'url': r.get('aw_deep_link')}
                for r in rows
                if r.get('custom_1', '').strip() and r.get('custom_1', '').strip() != 'TU' and parse_price(r.get('search_price')) is not None
            ),
            key=lambda sp: size_sort_key(sp['size']),
        )
        entry = {
            'store': store_label, 'brand': brand or 'N/D', 'model': model,
            'price': price, 'shipping': parse_price(rep.get('delivery_cost')) or 0,
            'currency': 'EUR',
            'url': rep.get('aw_deep_link'), 'imageUrl': rep.get('aw_image_url'), 'sizes': sizes,
        }
        if price_max > price:
            entry['priceMax'] = price_max
            entry['sizePrices'] = size_prices
        out_list.append(entry)
        n += 1
    print(f'{store_label}:', n)

# ---------- ESQUEMA GOOGLE SHOPPING (Foot-Store FR, Sport is Good FR) ----------
def mine_google_shopping_category(fname, store_label, category_kw, out_list, exclude_extra=None):
    if not os.path.exists(f"{FEEDS}/{fname}"):
        print(f'{store_label}: feed not found, skipped')
        return
    groups = {}
    with open(f"{FEEDS}/{fname}", newline='', encoding='utf-8', errors='replace') as f:
        for row in csv.DictReader(f):
            pt = row.get('product_type') or ''
            if category_kw not in pt or 'Adulte' not in pt:
                continue
            title = row.get('title') or ''
            if EXCLUDE_KEYWORDS.search(title) or AMERICAN_FOOTBALL_RE.search(title):
                continue
            if exclude_extra and exclude_extra.search(title):
                continue
            price = parse_price((row.get('sale_price') or row.get('price') or '').replace(' EUR', ''))
            if not price:
                continue
            key = row.get('item_group_id') or row.get('id')
            if not key:
                continue
            groups.setdefault(key, []).append(row)
    n = 0
    for key, rows in groups.items():
        def rp(r):
            return parse_price((r.get('sale_price') or r.get('price') or '').replace(' EUR', ''))
        rep = min(rows, key=lambda r: rp(r) or 1e9)
        brand = (rep.get('brand') or '').strip()
        title = norm_title(rep.get('title') or '')
        colour = (rep.get('color') or '').strip()
        model = f"{title} - {colour}" if colour and colour.lower() not in title.lower() else title
        sizes = sorted({clean_size(r.get('size')) for r in rows if (r.get('size') or '').strip()},
                        key=size_sort_key)
        price = rp(rep)
        price_max = max((rp(r) or 0) for r in rows)
        ship_m = re.search(r':::\s*([\d.]+)\s*EUR', rep.get('shipping', '') or '')
        shipping = float(ship_m.group(1)) if ship_m else 0
        size_prices = sorted(
            (
                {'size': clean_size(r.get('size')), 'price': rp(r), 'url': r.get('aw_deep_link')}
                for r in rows
                if (r.get('size') or '').strip() and rp(r) is not None
            ),
            key=lambda sp: size_sort_key(sp['size']),
        )
        entry = {
            'store': store_label, 'brand': brand or 'N/D', 'model': model,
            'price': price, 'shipping': shipping,
            'currency': 'EUR',
            'url': rep.get('aw_deep_link'), 'imageUrl': rep.get('image_link'), 'sizes': sizes,
        }
        if price_max > price:
            entry['priceMax'] = price_max
            entry['sizePrices'] = size_prices
        out_list.append(entry)
        n += 1
    print(f'{store_label}:', n)

# ---------- DEPORTE OUTLET (sin categoría confiable) ----------
# check_kids_gender=False para pelotas: TODO el catálogo de pelotas de
# esta tienda viene etiquetado "Ninos" en su propio custom_2 (confirmado
# real, 71/71 filas -- incluye pelotas talla 5 estándar de partido,
# "Zeus Beach Soccer Balón de fútbol..."), a diferencia de los guantes
# donde sí hay una distinción real adulto/junior que vale la pena
# respetar. Sin este flag, DeporteOutlet nunca aporta ninguna pelota.
def mine_deporte_outlet_category(title_keywords, store_label, out_list, check_kids_gender=True):
    if not os.path.exists(f"{FEEDS}/DEPORTEOUTLET.csv"):
        print(f'{store_label}: feed not found, skipped')
        return
    groups = {}
    with open(f"{FEEDS}/DEPORTEOUTLET.csv", newline='', encoding='utf-8', errors='replace') as f:
        for row in csv.DictReader(f):
            title = row.get('product_name') or ''
            tl = title.lower()
            if not all(k in tl for k in title_keywords):
                continue
            if EXCLUDE_KEYWORDS.search(title) or AMERICAN_FOOTBALL_RE.search(title) or KIDS_RE.search(title):
                continue
            if check_kids_gender:
                gender = (row.get('custom_2') or '').strip().lower()
                if 'nino' in gender or 'niño' in gender:
                    continue
            price = parse_price(row.get('search_price'))
            if not price:
                continue
            key = (row.get('merchant_product_id') or '').split('-')[0]
            if not key:
                continue
            groups.setdefault(key, []).append(row)
    n = 0
    for key, rows in groups.items():
        rep = min(rows, key=lambda r: parse_price(r.get('search_price')) or 1e9)
        brand = (rep.get('brand_name') or '').strip()
        colour = (rep.get('colour') or '').strip()
        title = norm_title(rep.get('product_name') or '')
        model = f"{title} - {colour}" if colour and colour.lower() not in title.lower() else title
        sizes = sorted({dot_size(r.get('size_stock_status', '').strip()) for r in rows if re.match(r'^\d', r.get('size_stock_status', '').strip())},
                        key=size_sort_key)
        out_list.append({
            'store': 'DeporteOutlet', 'brand': brand or 'N/D', 'model': model,
            'price': parse_price(rep.get('search_price')), 'shipping': parse_price(rep.get('delivery_cost')) or 0,
            'currency': 'EUR',
            'url': rep.get('aw_deep_link'), 'imageUrl': rep.get('aw_image_url'), 'sizes': sizes,
        })
        n += 1
    print(f'{store_label}:', n)

# ---------- GIGASPORT (AT/DE, CH, FR) ----------
def mine_gigasport_category(fname, store_label, cats, out_list):
    if not os.path.exists(f"{FEEDS}/{fname}"):
        print(f'{store_label}: feed not found, skipped')
        return
    groups = {}
    with open(f"{FEEDS}/{fname}", newline='', encoding='utf-8', errors='replace') as f:
        for row in csv.DictReader(f):
            cat = row.get('merchant_product_category_path') or ''
            if not any(c in cat for c in cats):
                continue
            title = row.get('product_name') or ''
            if EXCLUDE_KEYWORDS.search(title) or AMERICAN_FOOTBALL_RE.search(title) or KIDS_RE.search(title):
                continue
            m = re.match(r'^(.*)\s\|\s([^|]+)$', title)
            if not m:
                continue
            base_title, size_raw = m.group(1).strip(), m.group(2).strip()
            price = parse_price(row.get('search_price'))
            if not price:
                continue
            brand = (row.get('brand_name') or '').strip()
            groups.setdefault((brand, base_title), []).append((row, size_raw, price))
    n = 0
    for (brand, base_title), items in groups.items():
        rep_row = min(items, key=lambda t: t[2])[0]
        sizes = sorted({dot_size(sz) for _, sz, _ in items}, key=size_sort_key)
        model = norm_title(base_title)
        if brand:
            model = re.sub(r'^' + re.escape(brand) + r'\s+', '', model, flags=re.I)
        model = re.sub(r'^(herren|damen)\s+', '', model, flags=re.I)
        price = min(p for _, _, p in items)
        price_max = max(p for _, _, p in items)
        entry = {
            'store': store_label, 'brand': brand or 'N/D', 'model': model,
            'price': price, 'shipping': parse_price(rep_row.get('delivery_cost')) or 0,
            'currency': 'EUR',
            'url': rep_row.get('aw_deep_link'), 'imageUrl': rep_row.get('aw_image_url'), 'sizes': sizes,
        }
        if price_max > price:
            entry['priceMax'] = price_max
            entry['sizePrices'] = sorted(
                ({'size': dot_size(sz), 'price': p, 'url': r.get('aw_deep_link')} for r, sz, p in items),
                key=lambda sp: size_sort_key(sp['size']),
            )
        out_list.append(entry)
        n += 1
    print(f'{store_label}:', n)


if __name__ == '__main__':
    print('=== GUANTES DE ARQUERO ===')
    mine_blaz_category('FOOTSTORE_ES.csv', 'FootStoreES', 'Gants de gardien', gloves_results)
    mine_blaz_category('SPORTISGOOD_ES.csv', 'SportIsGoodES', 'Gants de gardien', gloves_results)
    mine_google_shopping_category('FOOTSTORE_FR.csv', 'FootStoreFR', 'Gants de gardien', gloves_results)
    mine_google_shopping_category('SPORTISGOOD_FR.csv', 'SportIsGoodFR', 'Gants de gardien', gloves_results)
    mine_deporte_outlet_category(['guantes', 'portero'], 'DeporteOutlet', gloves_results)
    mine_gigasport_category('GIGASPORT_DE.csv', 'GigasportDE', ('Torwarthandschuhe',), gloves_results)
    mine_gigasport_category('GIGASPORT_CH.csv', 'GigasportCH', ('Torwarthandschuhe',), gloves_results)
    mine_gigasport_category('GIGASPORT_FR.csv', 'GigasportFR', ('Gants de gardien',), gloves_results)

    print('=== PELOTAS ===')
    mine_blaz_category('FOOTSTORE_ES.csv', 'FootStoreES', 'Ballon de football', balls_results)
    mine_blaz_category('SPORTISGOOD_ES.csv', 'SportIsGoodES', 'Ballon de football', balls_results)
    mine_google_shopping_category('FOOTSTORE_FR.csv', 'FootStoreFR', 'Ballon de football', balls_results)
    mine_google_shopping_category('SPORTISGOOD_FR.csv', 'SportIsGoodFR', 'Ballon de football', balls_results)
    mine_deporte_outlet_category(['balón', 'fútbol'], 'DeporteOutlet', balls_results, check_kids_gender=False)
    mine_gigasport_category('GIGASPORT_DE.csv', 'GigasportDE', ('Fußbälle > Matchbälle', 'Fußbälle > Trainingsbälle'), balls_results)
    mine_gigasport_category('GIGASPORT_CH.csv', 'GigasportCH', ('Fußbälle > Matchbälle', 'Fußbälle > Trainingsbälle'), balls_results)
    mine_gigasport_category('GIGASPORT_FR.csv', 'GigasportFR', ('Ballons de football > Ballons de match', 'Ballons de football > Ballons d\'entraînement'), balls_results)

    print('TOTAL guantes:', len(gloves_results))
    print('TOTAL pelotas:', len(balls_results))
    with open(GLOVES_OUT, 'w') as f:
        json.dump(gloves_results, f, ensure_ascii=False, indent=1)
    with open(BALLS_OUT, 'w') as f:
        json.dump(balls_results, f, ensure_ascii=False, indent=1)
