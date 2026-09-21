"""Refresca precio/tallas de las ofertas de los 71 modelos "legacy" de
boots.ts (FutbolEmotion + ForumSport) contra los feeds de HOY.

Esas ofertas viven en el bloque fijo de boots.ts (el prefijo antes del
marcador AUTO-GENERATED) que refresh_boots.py nunca reconstruye, así que
sus tallas y precios quedaban congelados (tallas "40, 42, 44, 46" de
relleno, precios de hace semanas) y las agotadas seguían apareciendo.

Regla: la oferta sigue sólo si el feed de hoy la trae con filas en stock.
  - FutbolEmotion: filas del feed con el mismo productURL (parámetro `u`
    del link de TradeTracker) -> tallas EU + precio de hoy.
  - ForumSport: `p=<aw_product_id>` del link Awin -> `parent_product_id`
    (una fila por talla, todas comparten padre) -> tallas + precio. Si ese
    id ya no está (esa talla se vendió), se busca UN único padre con
    mismo nombre y mismo precio; si no hay, la oferta se da por agotada.
Si una oferta queda sin filas, se saca; si un modelo se queda sin ofertas,
se saca el modelo entero (agotado en todas las tiendas).
"""
import csv, re, os, collections, unicodedata
from urllib.parse import urlparse, parse_qs, unquote
import mine_boots as mb

csv.field_size_limit(10**9)
FEEDS = mb.FEEDS
ROW_RE = re.compile(r'  \{\n    id: "[^"]+",.*?\n  \},\n', re.S)
OFFER_RE = re.compile(
    r'      \{\n        store: "(FutbolEmotion|ForumSport)",\n        price: ([\d.]+),\n'
    r'(?:        priceMax: [\d.]+,\n)?'
    r'        shipping: [^\n]+\n        currency: "[^"]+",\n        url: "([^"]+)",\n'
    r'        imageUrl: "[^"]+",\n        sizes: \[[^\]]*\],\n      \},\n')


def _norm_name(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    s = re.sub(r'botas de futbol.*$', '', s)
    return ' '.join(re.sub(r'[/\-.]', ' ', s).split())


def _fe_rows_by_url():
    path = mb.FUTBOLEMOTION_SNAPSHOT
    out = collections.defaultdict(list)
    if not os.path.exists(path):
        return out
    for row in csv.DictReader(open(path, newline='', encoding='utf-8', errors='replace'), delimiter=';'):
        if (row.get('availability') or 'in stock') != 'in stock':
            continue
        try:
            if int(row.get('stock') or 1) <= 0:
                continue
        except ValueError:
            pass
        u = parse_qs(urlparse(row.get('productURL') or '').query).get('u', [None])[0]
        if u:
            out[u].append(row)
    return out


def _forum_index():
    by_parent, by_pid, by_name = collections.defaultdict(list), {}, collections.defaultdict(set)
    path = f"{FEEDS}/FORUMSPORT.csv"
    if not os.path.exists(path):
        return None
    for row in csv.DictReader(open(path, newline='', encoding='utf-8', errors='replace')):
        if 'botas de f' not in (row.get('product_name') or '').lower():
            continue
        if (row.get('stock_status') or 'in_stock') != 'in_stock':
            continue
        by_parent[row['parent_product_id']].append(row)
        by_pid[row['aw_product_id']] = row
    for parent, rows in by_parent.items():
        by_name[_norm_name(rows[0]['product_name'])].add(parent)
    return by_parent, by_pid, by_name


def _eu_forum(v):
    return mb.dot_size((v or '').strip())


def _fmt_offer(o_text, price, url, sizes):
    o_text = re.sub(r'price: [\d.]+,', f'price: {price},', o_text, count=1)
    o_text = re.sub(r'(?<=\n        )url: "[^"]+",', 'url: ' + mb_json(url) + ',', o_text, count=1)
    return re.sub(r'sizes: \[[^\]]*\],', 'sizes: [' + ", ".join(mb_json(s) for s in sizes) + '],', o_text, count=1)


def mb_json(s):
    import json
    return json.dumps(s, ensure_ascii=False)


def refresh_legacy(prefix):
    start = prefix.find('const legacyBootProducts')
    end = prefix.find('const browserMinedBootProducts')
    if start == -1 or end == -1:
        print('legacy_stock: bloques legacy no encontrados, se omite')
        return prefix, {}
    forum = _forum_index()
    fe = _fe_rows_by_url()
    if forum is None or not fe:
        print('legacy_stock: falta el feed de ForumSport o FutbolEmotion, se omite (no se toca nada)')
        return prefix, {}
    by_parent, by_pid, by_name = forum
    stats = collections.Counter()

    def fix_offer(m):
        text, store, old_price, url = m.group(0), m.group(1), float(m.group(2)), m.group(3)
        if store == 'FutbolEmotion':
            rows = fe.get(unquote(parse_qs(urlparse(url).query).get('u', [''])[0]))
            if not rows:
                stats['fe_dropped'] += 1
                return ''
            sizes = sorted({s for s in (mb.eu_size_from_futbolemotion(r.get('size', '')) for r in rows) if s}, key=mb.size_sort_key)
            if not sizes:
                stats['fe_dropped'] += 1
                return ''
            price = min(mb.parse_price(r.get('price')) or 1e9 for r in rows)
            stats['fe_kept'] += 1
            return _fmt_offer(text, price, url, sizes)
        # ForumSport
        pid = (re.search(r'[?&]p=(\d+)', url) or [None, None])[1]
        row = by_pid.get(pid)
        parent = row['parent_product_id'] if row else None
        if parent is None:
            # id ya vendido: único padre con el mismo precio (nombre lo da el modelo, en el bloque)
            cands = [p for p, rs in by_parent.items()
                     if any(abs(float(r['search_price'] or 0) - old_price) < 0.005 for r in rs)
                     and _norm_name(rs[0]['product_name']) in current_names]
            if len(cands) == 1:
                parent = cands[0]
        if parent is None:
            stats['forum_dropped'] += 1
            return ''
        rows = by_parent[parent]
        sizes = sorted({s for s in (_eu_forum(r.get('Fashion:size')) for r in rows) if s}, key=mb.size_sort_key)
        if not sizes:
            stats['forum_dropped'] += 1
            return ''
        price = min(mb.parse_price(r['search_price']) or 1e9 for r in rows)
        new_url = url if row else min(rows, key=lambda r: mb.parse_price(r['search_price']) or 1e9)['aw_deep_link']
        stats['forum_kept'] += 1
        return _fmt_offer(text, price, new_url, sizes)

    current_names = set()

    def fix_product(pm):
        block = pm.group(0)
        model = re.search(r'model: "([^"]+)"', block).group(1)
        current_names.clear()
        current_names.add(_norm_name(model))
        new_block = OFFER_RE.sub(fix_offer, block)
        if not OFFER_RE.search(new_block):
            stats['products_removed'] += 1
            return ''
        return new_block

    region = prefix[start:end]
    new_region = ROW_RE.sub(fix_product, region)
    return prefix[:start] + new_region + prefix[end:], dict(stats)
