#!/usr/bin/env python3
"""Mina botas de fútbol adulto reales de los feeds Awin ya aprobados
(adidas ES, Sport is Good ES/FR, Foot-Store ES/FR, Decathlon Irlanda,
Deporte Outlet, Pro Soccer) desde el cache de feeds del scan diario
(/tmp/feeds/*.csv), más FutbolEmotion (TradeTracker) desde un snapshot
manual -- ver la nota en mine_futbolemotion() sobre por qué esa no se
refresca sola todavía. Escribe scripts/boots-mining/mined_boots.json --
entrada de refresh_boots.py, que lo fusiona con src/data/boots.ts.

Los 71 modelos "legacy" (cruzados por nombre entre FutbolEmotion y Forum
Sport) NO se re-minan acá -- viven como bloque fijo en
legacyBootProducts dentro de boots.ts, nunca tocado por este pipeline.
mine_futbolemotion() de más abajo SÍ mina FutbolEmotion, pero como
tienda propia (sin cruzar por nombre con nadie) y descartando cualquier
modelo que ya esté en esos 71 legacy, para no mostrar la misma bota dos
veces.

Reglas de exclusión (dos pasadas reales, ver el header de boots.ts para
la historia completa): rugby/Kakari, fútbol americano, fútbol
sala/futsal/indoor (incluyendo "IC" como código de suela al final del
nombre, ej. "Nike Street Gato IC" -- no es la palabra completa "indoor").
Ampliadas 2026-09-12 (nuevas tiendas) con el equivalente en francés
("salle") -- Foot-Store FR/Sport is Good FR categorizan mal algunos
productos de futsal bajo "Chaussures de football > Adulte", igual que
ya pasaba en las tiendas ES.
"""
import csv, re, json, unicodedata, os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
FEEDS = "/tmp/feeds"
OUT_PATH = os.path.join(SCRIPT_DIR, "mined_boots.json")

# Snapshot manual del feed TradeTracker de FutbolEmotion (semicolon-CSV,
# esquema propio, no Awin) -- ver mine_futbolemotion() para por qué esto
# no vive en /tmp/feeds junto con los demás.
FUTBOLEMOTION_SNAPSHOT = os.environ.get(
    "FUTBOLEMOTION_FEED_PATH",
    "/tmp/claude-1000/-home-piojo/e15a9575-3f30-4342-a219-97302322bb2d/scratchpad/futbolemotion_feed.csv",
)

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
    # "FxG" (Flexible Ground, designación real de adidas para superficies
    # híbridas) -- mismo espíritu que Multi-Ground, se agrupa bajo MG en
    # vez de sumar un sexto código al filtro que no está en la planilla
    # de referencia del usuario.
    (r'\bFxG\b', 'MG'),
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
    s = s.replace(' EUR', '').replace(' USD', '').replace(',', '.').strip()
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

# Tabla estándar de conversión de calzado UK -> EU (hombre/unisex), la
# misma clase de tabla ya usada para los 71 legacy (ver comentario del
# header de boots.ts) -- dato de referencia real de la industria, no
# inventado por producto: distintas marcas redondean con hasta ±0.5 EU
# de diferencia entre sí, así que esto es una aproximación estándar
# aceptada, no una medida exacta por modelo.
UK_TO_EU = {
    4: 36.5, 4.5: 37.5, 5: 38, 5.5: 38.5, 6: 39, 6.5: 40, 7: 40.5, 7.5: 41,
    8: 42, 8.5: 42.5, 9: 43, 9.5: 44, 10: 44.5, 10.5: 45, 11: 46,
    11.5: 46.5, 12: 47, 12.5: 47.5, 13: 48,
}

# Misma clase de tabla estándar, para US -- FutbolEmotion también da
# algunas tallas en "USA" en vez de "UK".
US_TO_EU = {
    4: 36, 4.5: 36.5, 5: 37.5, 5.5: 38, 6: 38.5, 6.5: 39, 7: 40, 7.5: 40.5,
    8: 41, 8.5: 42, 9: 42.5, 9.5: 43, 10: 44, 10.5: 44.5, 11: 45,
    11.5: 45.5, 12: 46, 12.5: 47, 13: 47.5, 13.5: 48, 14: 48.5,
}

def _fmt_eu(eu):
    return str(int(eu)) if eu == int(eu) else str(eu)

def eu_size_from_futbolemotion(v):
    # FutbolEmotion (TradeTracker) mezcla varios sistemas en el mismo
    # feed: "9 UK", "7.5 USA", "42,5 EUR", y también "... Y"/"... C"
    # (tallas de niño/juvenil, ni siquiera con número adulto real -- se
    # descartan directo). Se usa el valor EUR real cuando el feed ya lo
    # da (sin convertir nada), y sólo se convierte con una tabla
    # estándar de la industria cuando el feed únicamente da UK o USA.
    v = v.strip()
    m = re.match(r'([\d,.]+)\s*(UK|USA|EUR)\b', v, re.I)
    if not m:
        return None
    num = float(m.group(1).replace(',', '.'))
    unit = m.group(2).upper()
    if unit == 'EUR':
        return _fmt_eu(num)
    table = UK_TO_EU if unit == 'UK' else US_TO_EU
    eu = table.get(num)
    return _fmt_eu(eu) if eu is not None else None

EXCLUDE_KEYWORDS = re.compile(
    r'\brugby\b|\bhockey\b|\bb[ée]isbol\b|\bkakari\b'
    r'|f[uú]tbol\s+american[oa]\b|\bamerican\s+football\b'
    r'|\bsala\b|f[uú]tbol\s+sala\b|\bfutsal\b|\bindoor\b|\bsalle\b|int[ée]rieur'
    # "IC" (Indoor Court) como código de suela al final del nombre --
    # mismo motivo que "indoor": calzado plano de calle/cancha dura, sin
    # tacos, no es una bota de fútbol de pasto (ej. "Nike Street Gato
    # IC", "Predator Pro IC"). Encontrado al armar el filtro de tapón
    # (2026-09-11): se había colado porque el exclude solo miraba la
    # palabra "indoor" completa, no esta abreviatura.
    r'|\bIC\b'
    # "IN" (Indoor) como código de suela al final del nombre -- mismo
    # motivo que "IC", encontrado en Foot-Store FR/Sport is Good FR
    # (2026-09-12, ej. "adidas Predator Freak.3 IN", "Mizuno MRL Sala
    # Club In"). Confirmado real antes de excluir: 166 filas, todas
    # calzado de sala/indoor genuino, cero falsos positivos revisados.
    r'|\bIN\b'
    # exclusiones de junior/niño -- algunas tiendas nuevas (2026-09-12)
    # no tienen un campo de edad confiable, así que el título es la
    # única señal real disponible.
    r'|\bjr\b|\bjunior\b|\bni[ñn]o\b|\bkids?\b',
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
            'currency': 'EUR',
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
            'currency': 'EUR',
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
            'currency': 'EUR',
            'url': rep.get('aw_deep_link'), 'imageUrl': rep.get('aw_image_url') or rep.get('merchant_image_url'), 'sizes': sizes,
        })
        n += 1
    print('DecathlonIE:', n)

# ---------- FOOTSTORE_FR / SPORTISGOOD_FR (esquema Google Shopping) ----------
# Mismo grupo de tiendas (Blaz) que las ES, pero acá el feed usa el
# esquema estándar de Google Merchant (product_type/item_group_id/
# age_group) en vez del esquema Awin clásico de las ES -- confirmado
# revisando el feed real antes de escribir el filtro, no asumido igual
# a las ES. La categoría SOLA no alcanza: hay filas de futsal
# etiquetadas "Chaussures de football > Adulte" igual que en ES
# (confirmado con un caso real, "Chaussures de Futsal Joma Top Flex"),
# así que además del category-match se aplica el mismo EXCLUDE_KEYWORDS
# de siempre sobre el título real.
def mine_google_shopping_fr(fname, store_label):
    if not os.path.exists(f"{FEEDS}/{fname}"):
        print(f'{store_label}: feed not found, skipped')
        return
    groups = {}
    with open(f"{FEEDS}/{fname}", newline='', encoding='utf-8', errors='replace') as f:
        for row in csv.DictReader(f):
            pt = row.get('product_type') or ''
            if 'Chaussures de football' not in pt or 'Adulte' not in pt:
                continue
            title = row.get('title') or ''
            if EXCLUDE_KEYWORDS.search(title):
                continue
            price = parse_price(row.get('price'))
            if not price:
                continue
            key = row.get('item_group_id') or row.get('id')
            if not key:
                continue
            groups.setdefault(key, []).append(row)
    n = 0
    for key, rows in groups.items():
        rep = min(rows, key=lambda r: parse_price(r.get('price')) or 1e9)
        sizes = sorted({dot_size(r.get('size', '').strip()) for r in rows if r.get('size', '').strip()},
                        key=size_sort_key)
        brand = (rep.get('brand') or '').strip()
        model = norm_title(rep.get('title') or '')
        ground = infer_ground(model, rep.get('description', ''))
        # "shipping" viene como "FR:::6.99 EUR:5:5:1:5" -- el precio real
        # está en el segundo campo separado por ":::".
        ship_m = re.search(r':::\s*([\d.]+)\s*EUR', rep.get('shipping', ''))
        shipping = float(ship_m.group(1)) if ship_m else 0
        results.append({
            'store': store_label, 'brand': brand or 'N/D', 'model': model, 'groundType': ground,
            'price': parse_price(rep.get('price')), 'shipping': shipping,
            'currency': 'EUR',
            'url': rep.get('aw_deep_link'), 'imageUrl': rep.get('image_link'), 'sizes': sizes,
        })
        n += 1
    print(f'{store_label}:', n)

# ---------- DEPORTE OUTLET (sin categoría confiable) ----------
# category_name/merchant_product_category_path vienen vacíos en TODAS
# las filas (confirmado, no es un caso aislado) -- la única señal real
# de "es una bota de fútbol" es el propio título del producto, y la
# única señal real de adulto/niño es custom_2 ("Hombres"/"Mujeres"/
# "Unisex"/"Ninos" -- confirmado con un conteo real del feed, no
# adivinado).
def mine_deporte_outlet():
    if not os.path.exists(f"{FEEDS}/DEPORTEOUTLET.csv"):
        print('DeporteOutlet: feed not found, skipped')
        return
    groups = {}
    with open(f"{FEEDS}/DEPORTEOUTLET.csv", newline='', encoding='utf-8', errors='replace') as f:
        for row in csv.DictReader(f):
            title = row.get('product_name') or ''
            tl = title.lower()
            if 'bota' not in tl or 'fútbol' not in tl:
                continue
            if EXCLUDE_KEYWORDS.search(title):
                continue
            gender = (row.get('custom_2') or '').strip().lower()
            if 'nino' in gender or 'niño' in gender:
                continue
            price = parse_price(row.get('search_price'))
            if not price:
                continue
            brand = (row.get('brand_name') or '').strip()
            model = norm_title(title)
            key = (brand.lower(), model.lower())
            groups.setdefault(key, []).append(row)
    n = 0
    for (brand_lc, model_lc), rows in groups.items():
        rep = min(rows, key=lambda r: parse_price(r.get('search_price')) or 1e9)
        # size_stock_status trae la talla EU real, con coma decimal
        # ("40,5") -- una fila por talla/color.
        sizes = sorted({dot_size(r.get('size_stock_status', '').strip()) for r in rows if re.match(r'^\d', r.get('size_stock_status', '').strip())},
                        key=size_sort_key)
        brand = (rep.get('brand_name') or '').strip()
        model = norm_title(rep.get('product_name') or '')
        ground = infer_ground(model, rep.get('description', ''))
        results.append({
            'store': 'DeporteOutlet', 'brand': brand or 'N/D', 'model': model, 'groundType': ground,
            'price': parse_price(rep.get('search_price')), 'shipping': parse_price(rep.get('delivery_cost')) or 0,
            'currency': 'EUR',
            'url': rep.get('aw_deep_link'), 'imageUrl': rep.get('aw_image_url'), 'sizes': sizes,
        })
        n += 1
    print('DeporteOutlet:', n)

# ---------- PRO SOCCER (EE.UU., USD) ----------
# category_name/merchant_category vienen NULL/vacíos en TODAS las filas
# -- la única señal real de "es una bota de fútbol" es el propio nombre
# del modelo, que en esta tienda SIEMPRE termina en un código de terreno
# real (FG/AG/SG/TF/MG), ej. "adidas Copa Mundial FG", "Nike MercurialX
# Victory VI DF TF" -- confirmado que este patrón cubre ~88% de las
# filas del feed (o sea, la tienda es casi enteramente botas). Envían a
# Europa/mundial (confirmado en su propia página de envíos, "we ship
# worldwide") pero el feed no da costo de envío internacional real ni
# talles -- se deja shipping en 0 con nota explícita en la UI (no
# "gratis": su propia política dice que el envío internacional queda
# afuera del envío gratis) y sizes vacío en vez de inventar cualquiera
# de los dos.
def mine_prosoccer():
    if not os.path.exists(f"{FEEDS}/PROSOCCER.csv"):
        print('ProSoccer: feed not found, skipped')
        return
    GROUND_SUFFIX = re.compile(r'\b(FG|AG|SG|TF|MG)\b')
    groups = {}
    with open(f"{FEEDS}/PROSOCCER.csv", newline='', encoding='utf-8', errors='replace') as f:
        for row in csv.DictReader(f):
            title = row.get('product_name') or ''
            if not GROUND_SUFFIX.search(title):
                continue
            if EXCLUDE_KEYWORDS.search(title):
                continue
            price = parse_price(row.get('search_price'))
            if not price:
                continue
            brand = (row.get('brand_name') or '').strip()
            if brand == 'NULL':
                brand = ''
            model = norm_title(title)
            key = (brand.lower(), model.lower())
            groups.setdefault(key, []).append(row)
    n = 0
    for (brand_lc, model_lc), rows in groups.items():
        rep = min(rows, key=lambda r: parse_price(r.get('search_price')) or 1e9)
        brand = (rep.get('brand_name') or '').strip()
        if brand == 'NULL' or not brand:
            # el nombre siempre empieza con la marca real (adidas/Nike/
            # Puma/Joma/...) -- se usa esa parte del propio título como
            # fallback en vez de un "N/D" genérico. "New Balance" es la
            # única marca real de dos palabras vista en este feed.
            title = rep.get('product_name') or ''
            brand = 'New Balance' if title.startswith('New Balance') else title.split(' ')[0]
        model = norm_title(rep.get('product_name') or '')
        ground = infer_ground(model)
        results.append({
            'store': 'ProSoccer', 'brand': brand, 'model': model, 'groundType': ground,
            'price': parse_price(rep.get('search_price')), 'shipping': 0,
            'currency': 'USD',
            'url': rep.get('aw_deep_link'), 'imageUrl': rep.get('aw_image_url'), 'sizes': [],
        })
        n += 1
    print('ProSoccer:', n)

# ---------- FUTBOLEMOTION (TradeTracker, no Awin) ----------
# A diferencia de todo lo de arriba, este feed NO vive en el cache
# /tmp/feeds del scan diario -- es un export TradeTracker con su propio
# esquema (CSV separado por ";", categoryPath/gender/size propios) y,
# a la fecha de este pipeline, no hay credenciales/URL de TradeTracker
# configuradas en .env.local para poder re-descargarlo solo. Esta
# función lee un snapshot puntual (FUTBOLEMOTION_FEED_PATH, default un
# archivo del scratchpad de la sesión que armó esto) SI existe, y se
# salta entera si no -- para que una corrida automática (sin ese
# archivo a mano) no rompa nada, simplemente no aporta nada nuevo de
# FutbolEmotion esa noche. Ver scripts/boots-mining/README.md.
#
# Deduplicado contra legacyBootProducts por nombre normalizado: los 71
# legacy YA tienen FutbolEmotion cruzado con Forum Sport para esos
# modelos puntuales -- minarlos de nuevo acá los mostraría dos veces
# como productos separados.
def mine_futbolemotion(legacy_model_names):
    if not os.path.exists(FUTBOLEMOTION_SNAPSHOT):
        print('FutbolEmotion: snapshot not found, skipped (ver nota en mine_futbolemotion)')
        return
    groups = {}
    with open(FUTBOLEMOTION_SNAPSHOT, newline='', encoding='utf-8', errors='replace') as f:
        for row in csv.DictReader(f, delimiter=';'):
            cat = row.get('categoryPath') or ''
            if not cat.startswith('Botas de fútbol'):
                continue
            name = (row.get('name') or '').strip()
            if not name or name.lower() in legacy_model_names:
                continue
            if EXCLUDE_KEYWORDS.search(name):
                continue
            price = parse_price(row.get('price'))
            if not price:
                continue
            groups.setdefault(name.lower(), []).append(row)
    n = 0
    for name_lc, rows in groups.items():
        rep = min(rows, key=lambda r: parse_price(r.get('price')) or 1e9)
        name = (rep.get('name') or '').strip()
        brand = (rep.get('brand') or name.split(' ')[0]).strip()
        sizes = sorted(
            {s for s in (eu_size_from_futbolemotion(r.get('size', '')) for r in rows) if s},
            key=size_sort_key,
        )
        ground = infer_ground(name, rep.get('categories', ''))
        results.append({
            'store': 'FutbolEmotion', 'brand': brand, 'model': name, 'groundType': ground,
            'price': parse_price(rep.get('price')), 'shipping': 0,
            'currency': 'EUR',
            'url': rep.get('productURL'), 'imageUrl': rep.get('imageURL_large') or rep.get('imageURL'), 'sizes': sizes,
        })
        n += 1
    print('FutbolEmotion:', n)

def legacy_model_names_from_boots_ts():
    """Nombres (en minúscula) de los 71 legacy, para que
    mine_futbolemotion() no los duplique. Lee boots.ts directo en vez de
    mantener una lista aparte que se puede desincronizar."""
    boots_ts = os.path.join(SCRIPT_DIR, "..", "..", "src", "data", "boots.ts")
    if not os.path.exists(boots_ts):
        return set()
    src = open(boots_ts, encoding='utf-8').read()
    end = src.find('// ===AUTO-GENERATED-BOOTS-BELOW===')
    legacy_src = src[:end] if end != -1 else src
    return {m.lower() for m in re.findall(r'model: "([^"]+)"', legacy_src)}

if __name__ == '__main__':
    mine_adidas_es()
    mine_blaz_awin('SPORTISGOOD_ES.csv', 'SportIsGoodES')
    mine_blaz_awin('FOOTSTORE_ES.csv', 'FootStoreES')
    mine_decathlon()
    mine_google_shopping_fr('FOOTSTORE_FR.csv', 'FootStoreFR')
    mine_google_shopping_fr('SPORTISGOOD_FR.csv', 'SportIsGoodFR')
    mine_deporte_outlet()
    mine_prosoccer()
    mine_futbolemotion(legacy_model_names_from_boots_ts())

    print('TOTAL:', len(results))
    with open(OUT_PATH, 'w') as out:
        json.dump(results, out, ensure_ascii=False, indent=1)
