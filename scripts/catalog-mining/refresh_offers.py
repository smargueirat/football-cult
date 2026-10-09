#!/usr/bin/env python3
"""Refresco POR OFERTA de las camisetas de tiendas con feed (sin LLM).

Por qué existe (2026-10-09, revisión de calidad F1/F6): refresh.py recibe UNA
oferta elegida por clave equipo|equipación y solo escribe `inStock: true`, así
que nada miraba las demás ofertas de la misma tienda ni retiraba lo que el
proveedor ya no vende. Medido el 10-08 contra los feeds de ese día: 542 de 3.172
ofertas minoristas ya no estaban en su feed y seguían "en stock" (120 fichas con
un "mejor precio" que no se vende) y 605 tenían otro precio. Las botas, que se
refrescan por identidad de oferta (refresh_boots.py / legacy_stock.py), daban 0.

Mismo criterio que legacy_stock.py: cada oferta se busca en el feed de HOY de su
tienda por su propio identificador (aw_product_id del enlace pclick, el
aw_deep_link exacto, la URL de producto `ued=` / `u=`), y se le reescriben
precio, envío (si el feed lo trae), tallas y stock:
  - la encuentra con filas en stock -> inStock: true, precio/tallas de hoy. Si
    la fila exacta del enlace (una talla) se vendió pero el producto sigue, el
    enlace pasa a otra talla en stock del mismo producto.
  - la encuentra pero todas sus filas están agotadas, o no aparece -> inStock:
    false. Vuelve a true sola si reaparece otro día.
  - no se le puede sacar identificador al enlace -> no se toca.
GUARDA: una tienda solo se toca si su feed se descargó hoy (archivo de <20 h) y
vino completo (>= 80 % de las filas de la última vez que pasó la guarda, cabecera
con las columnas esperadas). Si no, esa tienda queda exactamente como estaba.

Fuentes sin feed descargable:
  - Pro:Direct ES / Soccer (Shopify): se mira cada oferta en <url>.js (precio y
    tallas disponibles, ~1 s por oferta). Si fallan más del 20 % de las
    consultas no se toca ninguna oferta de esa tienda.
  - Amazon: sin PA-API no hay forma masiva de leer precio. Cada oferta guarda la
    fecha de su última verificación en offer_seen.json (la primera vez que el
    script la ve se toma hoy); a los AMAZON_MAX_DAYS días sin verificar pasa a
    inStock: false (no se borra). Avisa con "AVISO amazon:" 3 días antes. Tras
    comprobar a mano una oferta (y corregir su precio si hace falta):
        python3 refresh_offers.py --apply --no-net --verified <url> [<url> ...]

Uso:
  python3 scripts/catalog-mining/refresh_offers.py            # ensayo, no escribe
  python3 scripts/catalog-mining/refresh_offers.py --apply
  opciones: --no-net (sin consultas a Pro:Direct), --only Tienda[,Tienda]
Estado (no versionado, ver .gitignore): feed_rows.json, offer_seen.json.
"""
import csv, datetime, json, os, re, subprocess, sys, time, urllib.error, urllib.request
from urllib.parse import parse_qs, unquote, urlparse

csv.field_size_limit(10**9)
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
PRODUCTS_TS = os.path.join(REPO, "src", "data", "products.ts")
FEED_DIR = os.environ.get("FEED_DIR", "/tmp/feeds")
ROWS_STATE = os.path.join(HERE, "feed_rows.json")
SEEN_STATE = os.path.join(HERE, "offer_seen.json")
MAX_AGE_H = float(os.environ.get("FEED_MAX_AGE_H", "20"))
MIN_RATIO = 0.8
AMAZON_MAX_DAYS = int(os.environ.get("AMAZON_MAX_DAYS", "14"))
TODAY = datetime.date.today().isoformat()

# Etiqueta de tienda en products.ts -> (archivo en FEED_DIR sin .csv, formato)
FEEDS = {
    "FootStoreES": ("FOOTSTORE_ES", "awin"),
    "SportIsGoodES": ("SPORTISGOOD_ES", "awin"),
    "AdidasES": ("ADIDAS_ES", "awin"),
    "AdidasPT": ("ADIDAS_PT", "awin"),
    "AdidasCL": ("ADIDAS_CL", "awin"),
    "ForumSport": ("FORUMSPORT", "awin"),
    "DeporteOutlet": ("DEPORTEOUTLET", "awin"),
    "BSTNIT": ("BSTN_IT", "awin"),
    "BSTNUK": ("BSTN_UK", "awin"),
    "Reebok DE": ("REEBOK_DE", "awin"),
    "DecathlonIE": ("DECATHLONIE", "awin"),
    "FootStoreFR": ("FOOTSTORE_FR", "google"),
    "SportIsGoodFR": ("SPORTISGOOD_FR", "google"),
    "PlanetFoot": ("PLANETFOOT", "google"),
    "ComoFCShop": ("COMOFC", "google"),
    "FansJerseyHub": ("FANSJERSEYHUB", "google"),
    "Futbol Emotion": ("futbolemotion_feed", "tt"),
    "Futbol Factory": ("FUTBOLFACTORY", "tt"),
    "Shop Real Betis": ("SHOPREALBETIS", "tt"),
}
# Columnas mínimas para dar el feed por bueno (cabecera rota = feed roto).
NEEDS = {"awin": {"aw_product_id", "aw_deep_link", "search_price"},
         "google": {"aw_deep_link", "link", "price"},
         "tt": {"productURL", "price"}}
SIZE_COL = {"FOOTSTORE_ES": "custom_1", "SPORTISGOOD_ES": "custom_1", "DEPORTEOUTLET": "size_stock_status"}
# FansJerseyHub: su campo availability está siempre mal (memoria del proyecto),
# la presencia en el feed es lo único que vale.
IGNORE_AVAILABILITY = {"FansJerseyHub"}
# Futbol Factory no trae columna de tallas (rango fijo validado a mano).
KEEP_SIZES = {"Futbol Factory"}
PRODIRECT = {"Pro:Direct ES", "Pro:Direct Soccer"}

LINE_RE = re.compile(
    r'^(      \{ store: "(?P<store>[^"]+)", price: )(?P<price>[\d.]+)(, shipping: )(?P<ship>[\d.]+)'
    r'(, currency: "[A-Z]+", url: ")(?P<url>[^"]+)(", (?:title: "(?P<title>(?:[^"\\]|\\.)*)", )?inStock: )'
    r'(?P<stock>true|false)(, sizes: \[)(?P<sizes>[^\]]*)(\], imageUrl: "[^"]*" \},)$')
ADULT = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"]
ADULT_MAP = {"XS": "XS", "S": "S", "M": "M", "L": "L", "XL": "XL", "2XL": "XXL", "XXL": "XXL",
             "3XL": "3XL", "XXXL": "3XL", "4XL": "4XL", "XXXXL": "4XL"}
KIDS_RE = re.compile(r"\b(\d{1,2})\s*[-/]\s*(\d{1,2})\b")
TITLE_SIZE_RE = re.compile(r"\s-\s*(XXS|XS|S|M|L|XL|2XL|XXL|3XL|4XL)\s*$", re.I)


def norm(u):
    return (u or "").split("#")[0].split("?")[0].rstrip("/").lower()


def num(s):
    m = re.search(r"(\d+(?:[.,]\d+)?)", s or "")
    return float(m.group(1).replace(",", ".")) if m else None


def size_of(raw, title=""):
    """Talla de letra de adulto, "a-b" de niño, o "" si no se reconoce."""
    s = (raw or "").strip().upper()
    if s.startswith("TALLA:"):
        s = s[6:].strip()
    s = re.sub(r"[.\s]+$", "", s)
    if not s:
        m = TITLE_SIZE_RE.search(title or "")
        s = m.group(1).upper() if m else ""
    first = s.split()[0] if s else ""
    if first in ADULT_MAP:
        return ADULT_MAP[first]
    # Niño en Futbol Emotion: altura ("140 cm") o "T 10" (años), a la escala de
    # edades del catálogo (tabla estándar de adidas/Nike: 140 cm = 9-10 años).
    m = re.match(r"^(\d{3})\s*CM$", s) or re.match(r"^T\s*(\d{1,2})$", s)
    if m:
        n = int(m.group(1))
        n = n if n < 100 else {116: 6, 128: 8, 140: 10, 152: 12, 164: 14, 176: 16}.get(n, 0)
        return f"{n - 1}-{n}" if n in (6, 8, 10, 12, 14, 16) else ""
    k = KIDS_RE.search(s)
    return f"{int(k.group(1))}-{int(k.group(2))}" if k else ""


def sort_sizes(sizes):
    def key(s):
        if s in ADULT:
            return (0, ADULT.index(s))
        a = re.match(r"(\d+)", s)
        return (1, int(a.group(1)) if a else 99)
    return sorted(set(sizes), key=key)


def tt_key(url):
    u = parse_qs(urlparse(url or "").query).get("u", [""])[0]
    return norm(unquote(u)) if u else ""


def ued_key(url):
    u = parse_qs(urlparse(url or "").query).get("ued", [""])[0]
    return norm(unquote(u)) if u else ""


def load_json(path, default):
    try:
        return json.load(open(path, encoding="utf-8"))
    except (OSError, ValueError):
        return default


# ---------------------------------------------------------------- feeds

def read_feed(store, fname, fmt, last_rows):
    """Devuelve (index, motivo). index=None si el feed no pasa la guarda."""
    path = os.path.join(FEED_DIR, f"{fname}.csv")
    if not os.path.exists(path):
        return None, "feed ausente"
    age_h = (time.time() - os.path.getmtime(path)) / 3600
    if age_h > MAX_AGE_H:
        return None, f"feed de hace {age_h:.0f} h (no se descargó hoy)"
    rows = []
    with open(path, newline="", encoding="utf-8-sig", errors="replace") as f:
        rd = csv.DictReader(f, delimiter=";" if fmt == "tt" else ",")
        cols = {c.lstrip("﻿").strip('"') for c in (rd.fieldnames or [])}
        if not NEEDS[fmt] <= cols:
            return None, f"cabecera sin {sorted(NEEDS[fmt] - cols)}"
        size_col = SIZE_COL.get(fname, "Fashion:size")
        for r in rd:
            if fmt == "awin":
                stock = (r.get("in_stock") or "").strip().lower()
                status = (r.get("stock_status") or "").strip().lower()
                ok = (stock in ("", "1", "yes", "true", "y")) and (status in ("", "in_stock", "in stock"))
                group = (r.get("parent_product_id") or "").strip() or norm(r.get("merchant_deep_link"))
                if store == "DecathlonIE":  # sin padre y con una URL por talla
                    group = (r.get("product_name") or "").strip().lower()
                rows.append(dict(id=(r.get("aw_product_id") or "").strip(), link=(r.get("aw_deep_link") or "").strip(),
                                 group=group, title=(r.get("product_name") or "").strip().lower(),
                                 price=num(r.get("search_price")), ship=num(r.get("delivery_cost")),
                                 size=size_of(r.get(size_col)), ok=ok))
            elif fmt == "google":
                ok = store in IGNORE_AVAILABILITY or (r.get("availability") or "").strip().lower() in ("in_stock", "in stock")
                ship = r.get("shipping") or ""
                m = re.search(r"([\d.]+)\s*[A-Z]{3}", ship)
                rows.append(dict(id="", link=(r.get("aw_deep_link") or "").strip(), group=norm(r.get("link")),
                                 title="", price=num(r.get("sale_price")) or num(r.get("price")),
                                 ship=float(m.group(1)) if m else None,
                                 size=size_of(r.get("size"), r.get("title")), ok=ok))
            else:  # TradeTracker
                st = (r.get("stock") or "").strip()
                ok = (r.get("availability") or "in stock").strip().lower() == "in stock" and \
                    not (st.lstrip("-").isdigit() and int(st) <= 0)
                link = (r.get("productURL") or "").strip()
                # Futbol Factory trae price 0.00 en parte de sus filas y el
                # precio real en fromPrice.
                rows.append(dict(id="", link=link, group=tt_key(link), title="",
                                 price=num(r.get("price")) or num(r.get("fromPrice")),
                                 ship=None, size=size_of(r.get("size")), ok=ok))
    n, prev = len(rows), last_rows.get(fname)
    if n < 50:
        return None, f"feed casi vacío ({n} filas)"
    if prev and n < MIN_RATIO * prev:
        return None, f"feed truncado ({n} filas, la última vez {prev})"
    last_rows[fname] = n
    by_id, by_link, by_group, by_title = {}, {}, {}, {}
    for r in rows:
        if r["id"]:
            by_id[r["id"]] = r
        by_link.setdefault(r["link"], []).append(r)
        by_group.setdefault(r["group"], []).append(r)
        if r["title"]:
            by_title.setdefault(r["title"], set()).add(r["group"])
    return dict(id=by_id, link=by_link, group=by_group, title=by_title, n=n), None


def locate(fmt, idx, url, title):
    """(fila exacta o None, filas del producto) o (None, None) si no está."""
    if fmt == "awin":
        p = re.search(r"pclick\.php\?p=(\d+)", url)
        row = idx["id"].get(p.group(1)) if p else None
        row = row or (idx["link"].get(url) or [None])[0]
        if row:
            return row, idx["group"][row["group"]]
        k = ued_key(url)
        if k and k in idx["group"]:
            return None, idx["group"][k]
        # La talla del enlace se vendió y su id desapareció: el mismo producto
        # por título exacto, solo si hay uno.
        groups = idx["title"].get((title or "").replace('\\"', '"').strip().lower(), set())
        if len(groups) == 1:
            return None, idx["group"][next(iter(groups))]
        if not p and not k:
            return "unkeyed", None
        return None, None
    if fmt == "google":
        rows = idx["link"].get(url)
        if rows:
            return rows[0], idx["group"][rows[0]["group"]]
        k = ued_key(url)
        if not k:
            return "unkeyed", None
        return None, idx["group"].get(k)
    k = tt_key(url)
    if not k:
        return "unkeyed", None
    return None, idx["group"].get(k)


def refreshed(store, fmt, row, group, old):
    """Valores nuevos de la oferta (dict) a partir de sus filas de hoy."""
    live = [r for r in group if r["ok"]]
    if not live:
        return dict(stock="false")
    if row and row["ok"]:
        link = old["url"]
    else:
        rep = next((r for r in live if r["size"] == "M"), live[0])
        link = rep["link"] if fmt != "tt" else old["url"]
    same_link = [r for r in live if r["link"] == link] or live
    prices = [r["price"] for r in same_link if r["price"] and r["price"] > 0]
    out = dict(stock="true", url=link)
    if prices:
        out["price"] = min(prices)
    ships = [r["ship"] for r in same_link if r["ship"] is not None]
    if ships:
        out["ship"] = ships[0]
    if store not in KEEP_SIZES:
        old_sizes = re.findall(r'"([^"]+)"', old["sizes"])
        kids = any(KIDS_RE.search(s) for s in old_sizes)
        sizes = [r["size"] for r in live if r["size"] and (KIDS_RE.search(r["size"]) is not None) == kids]
        if sizes:
            out["sizes"] = sort_sizes(sizes)
    return out


# ---------------------------------------------------------------- Pro:Direct

def prodirect_check(url):
    """dict como refreshed(), o None si la consulta falló (no se sabe)."""
    sys.path.insert(0, HERE)
    from shopify_feed_to_csv import parse_size
    req = urllib.request.Request(url.split("?")[0] + ".js", headers={"User-Agent": "Mozilla/5.0"})
    data = None
    for wait in (10, 30, 60, None):  # Shopify corta con 429 tras ~80 seguidas
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                data = json.loads(r.read())
            break
        except urllib.error.HTTPError as e:
            if e.code in (404, 410):
                return dict(stock="false")
        except Exception:  # noqa: BLE001 -- red caída / JSON raro: se reintenta
            pass
        if wait is None:
            return None
        time.sleep(wait)
    live = [v for v in data.get("variants", []) if v.get("available")]
    if not live:
        return dict(stock="false")
    out = dict(stock="true", price=min(v["price"] for v in live) / 100)
    sizes = [s for s in (parse_size(v.get("option1")) for v in live) if s]
    if sizes:
        out["sizes"] = sort_sizes(sizes)
    return out


# ---------------------------------------------------------------- main

def fmt_num(x):
    return repr(round(float(x), 2))


def apply_new(m, new):
    """Reescribe la línea de oferta con los campos de `new` que cambian."""
    g = m.groupdict()
    price = fmt_num(new["price"]) if "price" in new and abs(new["price"] - float(g["price"])) > 0.004 else g["price"]
    ship = fmt_num(new["ship"]) if "ship" in new and abs(new["ship"] - float(g["ship"])) > 0.004 else g["ship"]
    url = new.get("url", g["url"]).replace('"', '\\"')
    sizes = ", ".join(f'"{s}"' for s in new["sizes"]) if new.get("sizes") else g["sizes"]
    return (m.group(1) + price + m.group(4) + ship + m.group(6) + url + m.group(8) + new["stock"] +
            m.group(11) + sizes + m.group(13))


def js_ok(src):
    """El array sigue siendo JavaScript válido (misma prueba que load.mjs)."""
    js = ("const t=require('fs').readFileSync(0,'utf8');const i=t.indexOf('const productsData = [')+21;"
          "const e=t.indexOf('\\n];',i);const a=new Function('return '+t.slice(i,e+2))();"
          "process.stdout.write(String(a.length))")
    r = subprocess.run(["node", "-e", js], input=src, capture_output=True, text=True)
    return r.returncode == 0, (r.stdout or r.stderr)[-300:]


def main(argv):
    apply = "--apply" in argv
    no_net = "--no-net" in argv
    only = None
    if "--only" in argv:
        only = set(argv[argv.index("--only") + 1].split(","))
    seen = load_json(SEEN_STATE, {})
    if "--verified" in argv:
        urls = [a for a in argv[argv.index("--verified") + 1:] if not a.startswith("--")]
        for u in urls:
            seen[u] = TODAY
        json.dump(seen, open(SEEN_STATE, "w"), indent=0, sort_keys=True)
        print(f"{len(urls)} ofertas marcadas como verificadas hoy ({TODAY})")
        # y se reactivan si estaban caducadas: sigue abajo con el refresco normal

    src = open(PRODUCTS_TS, encoding="utf-8").read()
    lines = src.split("\n")
    by_store = {}
    for i, ln in enumerate(lines):
        if ln.startswith('      { store: "'):
            m = LINE_RE.match(ln)
            if m and (only is None or m["store"] in only):
                by_store.setdefault(m["store"], []).append(i)

    last_rows = load_json(ROWS_STATE, {})
    stats, changed = {}, 0
    verified_today = set(a for a in argv if a.startswith("http"))

    def put(i, m, new, st):
        nonlocal changed
        new_ln = apply_new(m, new)
        if new.get("stock") == "true":
            seen[new.get("url", m["url"])] = TODAY
        if new_ln != lines[i]:
            lines[i] = new_ln
            changed += 1
            if new["stock"] == "false" and m["stock"] == "true":
                st["agotadas"] += 1
            elif new["stock"] == "true" and m["stock"] == "false":
                st["reactivadas"] += 1
            if "price" in new and abs(new["price"] - float(m["price"])) > 0.004:
                st["precio"] += 1
            if new.get("url", m["url"]) != m["url"]:
                st["enlace"] += 1

    for store, (fname, fmt) in FEEDS.items():
        if store not in by_store:
            continue
        idx, why = read_feed(store, fname, fmt, last_rows)
        st = dict(ofertas=len(by_store[store]), vistas=0, agotadas=0, reactivadas=0, precio=0, enlace=0, sin_clave=0)
        stats[store] = st
        if idx is None:
            st["SALTADA"] = why
            print(f"{store:16} SALTADA: {why} -- no se toca ninguna oferta de esta tienda")
            continue
        for i in by_store[store]:
            m = LINE_RE.match(lines[i])
            row, group = locate(fmt, idx, m["url"], m["title"])
            if row == "unkeyed":
                st["sin_clave"] += 1
                continue
            new = refreshed(store, fmt, row, group, m.groupdict()) if group else dict(stock="false")
            if new["stock"] == "true":
                st["vistas"] += 1
            put(i, m, new, st)
        print(f"{store:16} {json.dumps(st, ensure_ascii=False)}")

    for store in sorted(PRODIRECT & set(by_store)):
        st = dict(ofertas=len(by_store[store]), vistas=0, agotadas=0, reactivadas=0, precio=0, enlace=0, fallidas=0)
        stats[store] = st
        if no_net:
            st["SALTADA"] = "--no-net"
            continue
        results = {}
        for i in by_store[store]:
            url = LINE_RE.match(lines[i])["url"]
            if url not in results:
                results[url] = prodirect_check(url)
                time.sleep(1)
        fails = sum(1 for r in results.values() if r is None)
        st["fallidas"] = fails
        if results and fails > 0.2 * len(results):
            st["SALTADA"] = f"{fails}/{len(results)} consultas fallidas"
            print(f"{store:16} SALTADA: {st['SALTADA']} -- no se toca nada")
            continue
        for i in by_store[store]:
            m = LINE_RE.match(lines[i])
            new = results.get(m["url"])
            if new is None:
                continue
            if new["stock"] == "true":
                st["vistas"] += 1
            put(i, m, new, st)
        print(f"{store:16} {json.dumps(st, ensure_ascii=False)}")

    if "Amazon" in by_store:
        st = dict(ofertas=len(by_store["Amazon"]), caducadas=0, reactivadas=0, por_caducar=0)
        stats["Amazon"] = st
        soon = []
        today = datetime.date.fromisoformat(TODAY)
        for i in by_store["Amazon"]:
            m = LINE_RE.match(lines[i])
            seen.setdefault(m["url"], TODAY)
            age = (today - datetime.date.fromisoformat(seen[m["url"]])).days
            if age > AMAZON_MAX_DAYS and m["stock"] == "true":
                lines[i] = apply_new(m, dict(stock="false"))
                st["caducadas"] += 1
                changed += 1
            elif age <= AMAZON_MAX_DAYS and m["stock"] == "false" and m["url"] in verified_today:
                lines[i] = apply_new(m, dict(stock="true"))
                st["reactivadas"] += 1
                changed += 1
            elif m["stock"] == "true" and age > AMAZON_MAX_DAYS - 3:
                soon.append(m["url"])
        st["por_caducar"] = len(soon)
        print(f"{'Amazon':16} {json.dumps(st, ensure_ascii=False)}")
        if soon:
            print(f"AVISO amazon: {len(soon)} ofertas sin verificar caducan en <=3 dias "
                  f"(comprobar precio y: python3 scripts/catalog-mining/refresh_offers.py --apply --no-net --verified <url>):")
            for u in soon:
                print("   ", u)

    tot = {k: sum(s.get(k, 0) for s in stats.values() if isinstance(s.get(k, 0), int))
           for k in ("ofertas", "vistas", "agotadas", "reactivadas", "precio", "enlace", "caducadas")}
    print(f"\n=== refresh_offers: {changed} líneas cambiadas; {json.dumps(tot, ensure_ascii=False)} ===")

    if not apply:
        print("(ensayo: no se escribió nada; --apply para escribir)")
        return 0
    if only is None:  # sin --only se ve el catálogo entero: se podan las URLs que ya no existen
        live_urls = set(re.findall(r'url: "([^"]+)"', "\n".join(lines)))
        seen = {u: d for u, d in seen.items() if u in live_urls}
    json.dump(last_rows, open(ROWS_STATE, "w"), indent=1, sort_keys=True)
    json.dump(seen, open(SEEN_STATE, "w"), indent=0, sort_keys=True)
    if changed:
        new_src = "\n".join(lines)
        ok, out = js_ok(new_src)
        if not ok:
            print(f"ERROR: products.ts quedaría roto, no se escribe: {out}")
            return 1
        open(PRODUCTS_TS + ".tmp", "w", encoding="utf-8").write(new_src)
        os.replace(PRODUCTS_TS + ".tmp", PRODUCTS_TS)
        print(f"products.ts escrito ({out} fichas)")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
