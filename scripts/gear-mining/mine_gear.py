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
import unicodedata
import urllib.parse

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys_path_boots = os.path.join(SCRIPT_DIR, "..", "boots-mining")
import sys
sys.path.insert(0, os.path.abspath(sys_path_boots))
from mine_boots import parse_price, dot_size, size_sort_key, norm_title, EXCLUDE_KEYWORDS  # noqa: E402

FEEDS = "/tmp/feeds"

BALLS_OUT = os.path.join(SCRIPT_DIR, "mined_balls.json")
GLOVES_OUT = os.path.join(SCRIPT_DIR, "mined_gloves.json")
APPAREL_OUT = os.path.join(SCRIPT_DIR, "mined_apparel.json")
TRAINING_OUT = os.path.join(SCRIPT_DIR, "mined_training.json")

balls_results = []
gloves_results = []
apparel_results = []
training_results = []

# Mismo motivo que mine_boots.py: "fútbol americano" comparte la palabra
# "balón"/"ball" en varios idiomas con el fútbol real.
AMERICAN_FOOTBALL_RE = re.compile(r"americano|american football|football am[ée]ricain", re.I)
KIDS_RE = re.compile(r"\bjunior\b|\bni[ñn]os?\b|\benfants?\b|\bkinder\b", re.I)

# Encontrado 2026-09-18 (reporte real del usuario, "las pelotas no son
# balones de fútbol de verdad"): Deporte Outlet no tiene categoría
# confiable para pelotas (ver mine_deporte_outlet_category), así que el
# filtro por título ['balón','fútbol'] también dejaba pasar memorabilia
# de coleccionista de la marca SIGNABLES ("Inter Miami Lionel Messi #10
# Balón de fútbol Artículo de coleccionista 14 cm..." -- una réplica
# firmada de exhibición, no una pelota para jugar). 32 productos reales
# confirmados contaminados, todos de esta marca/categoría.
COLLECTIBLE_RE = re.compile(r"coleccionista|collector'?s?\b|signable|mystery box|\bfunko\b", re.I)

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
def mine_blaz_category(fname, store_label, category_kw, out_list, exclude_extra=None, cat_ok=None, type_of=None):
    if not os.path.exists(f"{FEEDS}/{fname}"):
        print(f'{store_label}: feed not found, skipped')
        return
    groups = {}
    cat_by_key = {}
    with open(f"{FEEDS}/{fname}", newline='', encoding='utf-8', errors='replace') as f:
        for row in csv.DictReader(f):
            mc = row.get('merchant_category') or ''
            # cat_ok: filtro alternativo para equipamiento de entrenamiento,
            # que NO vive solo bajo "Football > " (hay conos/vallas/aros
            # reales bajo "Training > " y "Multisports > ") y no siempre
            # trae "> Adulte" porque un cono no tiene talla. Ver
            # TRAINING_LEAVES.
            #
            # Rama normal (ropa/guantes/pelotas), encontrada 2026-09-18
            # armando ropa: categorías genéricas de una palabra ("Short",
            # "Chaussettes") también existen como hoja bajo OTROS
            # departamentos del mismo feed ("Training > Short", "Running >
            # Chaussettes" -- ej. Puma Hyrox, Lenz running), así que un
            # simple "in mc" dejaba pasar ropa de fitness/running sin nada
            # de fútbol. Guantes/pelotas no tenían este problema porque su
            # category_kw ya era una frase larga sin ambigüedad ("Gants de
            # gardien", "Ballon de football") -- acá hace falta exigir el
            # departamento real.
            if cat_ok is not None:
                if not cat_ok(mc):
                    continue
            elif not mc.startswith('Football > ') or category_kw not in mc or '> Adulte' not in mc:
                continue
            _key_pre = row.get('parent_product_id') or row.get('merchant_product_id') or (row.get('product_name') or '')
            cat_by_key.setdefault(_key_pre, mc)
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
            'colour': colour or 'N/D',
            'price': price, 'shipping': parse_price(rep.get('delivery_cost')) or 0,
            'currency': 'EUR',
            'url': rep.get('aw_deep_link'), 'imageUrl': rep.get('aw_image_url'), 'sizes': sizes,
        }
        if price_max > price:
            entry['priceMax'] = price_max
            entry['sizePrices'] = size_prices
        if type_of is not None:
            entry['type'] = type_of(cat_by_key.get(key, ''))
        out_list.append(entry)
        n += 1
    print(f'{store_label}:', n)

# ---------- ESQUEMA GOOGLE SHOPPING (Foot-Store FR, Sport is Good FR) ----------
def mine_google_shopping_category(fname, store_label, category_kw, out_list, exclude_extra=None, cat_ok=None, type_of=None):
    if not os.path.exists(f"{FEEDS}/{fname}"):
        print(f'{store_label}: feed not found, skipped')
        return
    groups = {}
    cat_by_key = {}
    with open(f"{FEEDS}/{fname}", newline='', encoding='utf-8', errors='replace') as f:
        for row in csv.DictReader(f):
            pt = row.get('product_type') or ''
            # cat_ok: ver el comentario en mine_blaz_category (equipamiento
            # de entrenamiento vive también bajo Training/Multisports).
            #
            # Rama normal: mismo motivo que mine_blaz_category -- exigir el
            # departamento real "Football" (no solo que el texto de la
            # categoría contenga la palabra suelta) para no dejar pasar
            # ropa de Running/Training sin nada de fútbol.
            if cat_ok is not None:
                if not cat_ok(pt):
                    continue
            elif not pt.startswith('Football > ') or category_kw not in pt or 'Adulte' not in pt:
                continue
            title = row.get('title') or ''
            if EXCLUDE_KEYWORDS.search(title) or AMERICAN_FOOTBALL_RE.search(title):
                continue
            if exclude_extra and exclude_extra.search(title):
                continue
            price = parse_price((row.get('sale_price') or row.get('price') or '').replace(' EUR', ''))
            if not price:
                continue
            # item_group_id viene vacío en TODAS las filas de este feed
            # (confirmado real 2026-09-18, ej. Softee América) -- caer a
            # `id` (el SKU por talla) agrupaba cada talla como su propio
            # "producto" en vez de una sola oferta con varias tallas
            # (bug real, reportado por el usuario como guantes
            # repetidos). brand+title+color es estable entre tallas del
            # mismo producto en este esquema, así que sirve de key real.
            key = row.get('item_group_id') or f"{row.get('brand', '')}|{row.get('title', '')}|{row.get('color', '')}"
            if not key:
                continue
            cat_by_key.setdefault(key, pt)
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
            'colour': colour or 'N/D',
            'price': price, 'shipping': shipping,
            'currency': 'EUR',
            'url': rep.get('aw_deep_link'), 'imageUrl': rep.get('image_link'), 'sizes': sizes,
        }
        if price_max > price:
            entry['priceMax'] = price_max
            entry['sizePrices'] = size_prices
        if type_of is not None:
            entry['type'] = type_of(cat_by_key.get(key, ''))
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
            if EXCLUDE_KEYWORDS.search(title) or AMERICAN_FOOTBALL_RE.search(title) or KIDS_RE.search(title) or COLLECTIBLE_RE.search(title):
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
            'colour': colour or 'N/D',
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
        colour = (rep_row.get('colour') or '').strip()
        entry = {
            'store': store_label, 'brand': brand or 'N/D', 'model': model,
            'colour': colour or 'N/D',
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


# Encontrado 2026-09-18 (reporte real del usuario, capturas de pantalla
# de guantes repetidos): Foot-Store y Sport is Good (ES y FR) son
# storefronts espejo del mismo backend -- mismo product_name/title,
# mismo product_deep_link con solo el dominio distinto -- así que el
# mismo guante/pelota real salía como HASTA 4 "productos" separados (uno
# por tienda), cada uno con una sola oferta, en vez de UN producto
# comparando las 4 ofertas reales. Cada mine_* de arriba seguía
# agregando filas sueltas a gloves_results/balls_results (una por
# tienda); acá se agrupan por (marca, modelo) normalizado ANTES de
# escribir el JSON -- key de texto exacto, no fuzzy: alcanza para fundir
# los pares que comparten esquema/idioma (Blaz ES+ES, Google Shopping
# FR+FR) sin arriesgar fundir dos productos reales distintos que por
# casualidad compartan texto.
# Encontrado 2026-09-18 (reporte real del usuario, captura de chips de
# marca repetidos en pelotas): la MISMA marca real sale con distinta
# mayúscula/minúscula según qué feed la trajo -- ej. "adidas" (Blaz
# ES) vs "Adidas" (Google Shopping FR), "erima" vs "Erima" -- así que
# terminaba como dos chips de marca separados en vez de uno. Sin lista
# fija de "estas marcas van en minúscula" (sería inventar datos): se
# elige como forma canónica la variante que más veces aparece en el
# propio feed para cada marca (case-insensitive), no una regla a mano.
def canonicalize_brands(results):
    counts = {}
    for d in results:
        counts[d['brand']] = counts.get(d['brand'], 0) + 1
    canonical = {}
    for spelling, n in counts.items():
        key = spelling.strip().lower()
        if key not in canonical or n > counts[canonical[key]]:
            canonical[key] = spelling
    for d in results:
        d['brand'] = canonical[d['brand'].strip().lower()]


def drop_no_image(results, label):
    """Sin foto real la card sale como caja beige vacía (pedido explícito
    del usuario, 2026-09-22) -- un solo punto para las 8 tiendas de
    arriba, antes de fundir por modelo (mismo espíritu que
    EXCLUDE_KEYWORDS en mine_boots.py/extract.py)."""
    before = len(results)
    results[:] = [r for r in results if (r.get('imageUrl') or '').strip()]
    if before != len(results):
        print(f'{label}: sin foto (descartadas) {before - len(results)}')


def merge_by_model(results):
    order = []
    groups = {}
    for d in results:
        # `type` entra en la key para ropa (shorts/chaqueta/pantalón/
        # medias no deberían fundirse entre sí aunque compartan texto de
        # marca+modelo por casualidad); ausente en guantes/pelotas, no
        # cambia nada ahí (siempre la misma tupla vacía-equivalente).
        key = (d['brand'].strip().lower(), re.sub(r'\s+', ' ', d['model'].strip().lower()), d.get('type'))
        if key not in groups:
            groups[key] = []
            order.append(key)
        groups[key].append(d)
    merged = []
    for key in order:
        rows = groups[key]
        rep = rows[0]
        offer_fields = ('store', 'price', 'priceMax', 'shipping', 'currency', 'url', 'imageUrl', 'sizes', 'sizePrices')
        merged_entry = {
            'brand': rep['brand'],
            'model': rep['model'],
            # El color ya está implícito en la key de fusión (viene
            # pegado al final de `model`, ej. "- Blanc"), así que vive a
            # nivel producto (no por oferta) -- pedido explícito del
            # usuario para poder filtrar por color sin parsear texto
            # libre.
            'colour': rep.get('colour') or 'N/D',
            'offers': [{k: r[k] for k in offer_fields if k in r} for r in rows],
        }
        if 'type' in rep:
            merged_entry['type'] = rep['type']
        merged.append(merged_entry)
    return merged


ES_STORES = ('FootStoreES', 'SportIsGoodES')

def _img_key(u):
    m = re.search(r'url=([^&"]+)', u or '')
    raw = urllib.parse.unquote(m.group(1)) if m else (u or '')
    return re.sub(r'^(ssl:|https?://)', '', raw).split('?')[0].lower()

def _norm(s):
    s = unicodedata.normalize('NFKD', (s or '').lower())
    s = ''.join(c for c in s if not unicodedata.combining(c))
    return re.sub(r'\s+', ' ', s).strip()

def _digits(model):
    # "7,32 x 2,44 ... 2 mm" y "7.32 x 2.44 ... 2mm" son la misma red
    t = _norm(model).replace(',', '.')
    t = re.sub(r'(\d)\s+(mm|cm|m|kg|g|l)\b', r'\1\2', t)
    return tuple(re.findall(r'\d+(?:\.\d+)?(?:mm|cm|m|kg|g|l)?', t))

def _tail(model, brand):
    """Todo desde la marca en adelante: el prefijo es el sustantivo
    traducido ('Cono de accionamiento' / "Cone d'entrainement"), la cola
    es marca+modelo+color, que el feed no traduce."""
    t, b = _norm(model), _norm(brand)
    if not b:
        return None
    i = t.find(b)
    return t[i:] if i >= 0 else None

def mirror_key(entry):
    tail = _tail(entry['model'], entry.get('brand'))
    if tail is None:
        return None
    imgs = tuple(sorted({_img_key(o.get('imageUrl')) for o in entry['offers']}))
    if not imgs or not imgs[0]:
        return None
    return (entry.get('type'), _norm(entry.get('colour')), imgs,
            _digits(entry['model']), tail)

def merge_mirror_locales(merged):
    """Foot-Store / Sport is Good publican el MISMO producto en su tienda
    ES y su tienda FR con el titulo traducido, asi que merge_by_model (que
    agrupa por texto) los deja como dos fichas de una sola tienda. Se
    funden solo cuando coinciden tipo, color, foto del CDN, numeros del
    titulo y la cola desde la marca -- la foto sola NO alcanza: los conos
    Megaform comparten una misma imagen entre Bleu/Jaune/Rouge/Vert y las
    redes Powershot entre medidas distintas (mismo riesgo que el bug de
    colorways de botas, 2026-09-14). Se queda el titulo en castellano."""
    order, groups, out = [], {}, []
    for e in merged:
        k = mirror_key(e)
        if k is None:
            out.append(e)
            continue
        if k not in groups:
            groups[k] = []
            order.append(k)
        groups[k].append(e)
    for k in order:
        rows = groups[k]
        # Si dos filas aportan la MISMA tienda no son espejos: son dos
        # productos que el prefijo traducido distinguia y la clave no
        # ("Filet football club" vs "Filet football match", ambos
        # "powershot - blanc"). Se dejan como estaban.
        seen_stores = set()
        collides = False
        for r in rows:
            st = {o['store'] for o in r['offers']}
            if st & seen_stores:
                collides = True
                break
            seen_stores |= st
        if collides:
            out.extend(rows)
            continue
        rep = next((r for r in rows
                    if any(o['store'] in ES_STORES for o in r['offers'])), rows[0])
        if len(rows) > 1:
            rep = dict(rep)
            seen, offers = set(), []
            for r in rows:
                for o in r['offers']:
                    if o['url'] in seen:
                        continue
                    seen.add(o['url'])
                    offers.append(o)
            rep['offers'] = offers
        out.append(rep)
    return out

# ---------- ROPA DE FÚTBOL (shorts, chaquetas, pantalones, medias) ----------
# Agregado 2026-09-18 (pedido explícito del usuario: "no hay nada de
# pantalones, chaquetas, shorts o medias... en caso de que lo tengamos en
# el catálogo hay que agregarlo"). Confirmado real: el mismo esquema
# "Blaz Awin" (Foot-Store/Sport is Good ES+FR) ya usado para guantes/
# pelotas tiene una taxonomía real de ropa de fútbol adulta bajo
# "Football > {Short,Veste de survêtement,Pantalon de survêtement,
# Chaussettes} > Adulte > ..." con volumen real grande (5580 shorts solo
# en Foot-Store ES). Reusa mine_blaz_category/mine_google_shopping_category
# tal cual (mismo filtro EXCLUDE_KEYWORDS/American-football/Adulte ya
# aplicado), solo se etiqueta el `type` después. Deporte Outlet/Gigasport
# quedan afuera de esta primera carga (sin categoría de ropa confiable
# verificada todavía) -- mismo criterio que "ship lo pedido, no de más".
# ---------- ENTRENAMIENTO (equipamiento real, sección propia 2026-09-24) ----------
# Hoja de categoría real del feed -> tipo nuestro. Se filtra por HOJA, no
# por departamento, porque el mismo cono existe bajo "Training > ",
# "Multisports > " y "Football > " según la tienda, y un cono no trae
# "> Adulte" (no tiene talla) -- por eso esto no puede usar el filtro
# normal de mine_blaz_category/mine_google_shopping_category.
#
# Deliberadamente AFUERA:
#  - Ballon / Ballon d'entraînement / Mini ballon -> ya son su propia
#    sección (balls.ts / "Pelotas"), meterlos acá los duplicaría.
#  - Haltère, Barre/Disque de musculation, Tapis -> gimnasio genérico,
#    no fútbol (mismo criterio que dejó Running/Training fuera de ropa).
#  - Sac à ballon, Protège-tibias -> siguen en ropa (types bag/shinguards).
TRAINING_LEAVES = {
    "Cône d'entraînement": 'conos',
    'Chasuble': 'petos',
    'Filet': 'redes',
    'Filet football': 'redes',
    'Bande de résistance': 'elasticos',
    'Bandes élastique': 'elasticos',
    'Élastique de résistance': 'elasticos',
    "Matériel d'entraînement": 'material',
    'Tableau tactique': 'tactica',
    'Sifflet': 'silbatos',
    'Cerceau': 'aros',
    'Haie': 'vallas',
    'Échelle': 'escaleras',
    'Échelle de rythme': 'escaleras',
    'Marquage': 'marcadores',
    'Disque de marquage': 'marcadores',
    'Accessoire de marquage': 'marcadores',
    'Accessoire but de football': 'porterias',
    'Pompe': 'infladores',
    'Poignée de pompe': 'infladores',
}
TRAINING_DEPARTMENTS = ('Football', 'Training', 'Multisports')


def _training_leaf(category_path):
    """Hoja real (2do segmento) si la categoría es equipamiento nuestro."""
    parts = [p.strip() for p in (category_path or '').split('>')]
    if len(parts) < 2 or parts[0] not in TRAINING_DEPARTMENTS:
        return None
    # "Football > Boutique du supporter > Marquage > Adulte" es el
    # marcado/serigrafía de camisetas de la tienda del hincha, NO
    # marcadores de entrenamiento -- misma palabra, otra cosa.
    if 'Boutique du supporter' in category_path:
        return None
    # Junior: el equipamiento de entrenamiento no se cataloga por edad,
    # así que un "> Junior" acá es ropa mal ubicada (ej. chasuble junior).
    if '> Junior' in category_path:
        return None
    return TRAINING_LEAVES.get(parts[1])


def training_cat_ok(category_path):
    return _training_leaf(category_path) is not None


def training_type_of(category_path):
    return _training_leaf(category_path) or 'material'


def mine_training(out_list):
    mine_blaz_category('FOOTSTORE_ES.csv', 'FootStoreES', None, out_list,
                       cat_ok=training_cat_ok, type_of=training_type_of)
    mine_blaz_category('SPORTISGOOD_ES.csv', 'SportIsGoodES', None, out_list,
                       cat_ok=training_cat_ok, type_of=training_type_of)
    mine_google_shopping_category('FOOTSTORE_FR.csv', 'FootStoreFR', None, out_list,
                                  cat_ok=training_cat_ok, type_of=training_type_of)
    mine_google_shopping_category('SPORTISGOOD_FR.csv', 'SportIsGoodFR', None, out_list,
                                  cat_ok=training_cat_ok, type_of=training_type_of)


def mine_apparel_type(type_key, category_kw, out_list):
    tmp = []
    mine_blaz_category('FOOTSTORE_ES.csv', 'FootStoreES', category_kw, tmp)
    mine_blaz_category('SPORTISGOOD_ES.csv', 'SportIsGoodES', category_kw, tmp)
    mine_google_shopping_category('FOOTSTORE_FR.csv', 'FootStoreFR', category_kw, tmp)
    mine_google_shopping_category('SPORTISGOOD_FR.csv', 'SportIsGoodFR', category_kw, tmp)
    for d in tmp:
        d['type'] = type_key
    out_list.extend(tmp)
    print(f'{type_key}:', len(tmp))


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

    print('=== ROPA ===')
    mine_apparel_type('shorts', 'Short', apparel_results)
    mine_apparel_type('jacket', 'Veste', apparel_results)  # incluye 'Veste de survêtement'
    mine_apparel_type('pants', 'Pantalon de survêtement', apparel_results)
    mine_apparel_type('socks', 'Chaussettes', apparel_results)
    mine_apparel_type('sweatshirt', 'Sweatshirt', apparel_results)
    mine_apparel_type('polo', 'Polo', apparel_results)
    mine_apparel_type('set', 'Ensemble', apparel_results)
    mine_apparel_type('tshirt', 'T-shirt', apparel_results)
    # Accesorios (2026-09-21, pedido de ampliar catálogo): misma sección
    # "Ropa" (no hay una sección nueva), tipos extra. jacket suma las
    # chaquetas de abrigo que no se llaman "Veste".
    for kw in ('Doudoune', 'Coupe-vent', 'Parka'):
        mine_apparel_type('jacket', kw, apparel_results)
    mine_apparel_type('shinguards', 'Protège-tibias', apparel_results)
    for kw in ('Sac de sport', 'Sac à dos', 'Sac à ballon'):
        mine_apparel_type('bag', kw, apparel_results)
    mine_apparel_type('armband', 'Brassard', apparel_results)
    # 'Chasuble' (petos) salió de ropa el 2026-09-24 por pedido explícito
    # del usuario -- es equipamiento de entrenamiento, ahora se mina en la
    # sección Entrenamiento de abajo (type 'petos').
    for kw in ('Sous maillot', 'Legging', 'Cuissard', 'Manchon jambe'):
        mine_apparel_type('baselayer', kw, apparel_results)

    print('=== ENTRENAMIENTO ===')
    mine_training(training_results)

    drop_no_image(gloves_results, 'guantes')
    drop_no_image(balls_results, 'pelotas')
    drop_no_image(apparel_results, 'ropa')
    drop_no_image(training_results, 'entrenamiento')
    canonicalize_brands(gloves_results)
    canonicalize_brands(balls_results)
    canonicalize_brands(apparel_results)
    canonicalize_brands(training_results)
    gloves_merged = merge_mirror_locales(merge_by_model(gloves_results))
    balls_merged = merge_mirror_locales(merge_by_model(balls_results))
    apparel_merged = merge_mirror_locales(merge_by_model(apparel_results))
    training_merged = merge_mirror_locales(merge_by_model(training_results))
    print('TOTAL guantes:', len(gloves_results), '->', len(gloves_merged), 'productos tras fundir por tienda')
    print('TOTAL pelotas:', len(balls_results), '->', len(balls_merged), 'productos tras fundir por tienda')
    print('TOTAL ropa:', len(apparel_results), '->', len(apparel_merged), 'productos tras fundir por tienda')
    print('TOTAL entrenamiento:', len(training_results), '->', len(training_merged), 'productos tras fundir por tienda')
    with open(GLOVES_OUT, 'w') as f:
        json.dump(gloves_merged, f, ensure_ascii=False, indent=1)
    with open(BALLS_OUT, 'w') as f:
        json.dump(balls_merged, f, ensure_ascii=False, indent=1)
    with open(APPAREL_OUT, 'w') as f:
        json.dump(apparel_merged, f, ensure_ascii=False, indent=1)
    with open(TRAINING_OUT, 'w') as f:
        json.dump(training_merged, f, ensure_ascii=False, indent=1)
