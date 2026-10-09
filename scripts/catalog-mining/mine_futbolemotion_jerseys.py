#!/usr/bin/env python3
"""Camisetas de Futbol Emotion (TradeTracker 2066871) -> products.ts, sin LLM.

Por qué (2026-10-09): el feed trae ~1.200 camisetas oficiales (≈990 de
temporada) y solo 233 estaban en el catálogo, puestas a mano. La minería de
camisetas nunca lo leía: no es un AWIN_FEED_URL_* (CSV con ";" y columnas
propias), daily_scan.sh lo daba por "solo botas", y aunque se le pasara a
extract.py/pick.py sus títulos no dicen "camiseta" ("Puma Palermo Segunda
Equipación 2026-2027": falla JERSEY_RE) y pick.py se queda con UNA oferta por
equipo+equipación, sin niño/mujer ni versión jugador. Alavés y Cremonese, con 0
fichas de temporada, estaban ahí.

Qué hace, por colorway (prefijo de "product ID", una fila por talla):
  - solo "Fans > Camisetas oficiales"; equipo con TEAM_PATTERNS (solo claves
    que ya existen en TeamKey), equipación con TYPE_PATTERNS, temporada
    escrita en el título y vigente (fin >= 2026), público por el título
    (Niño/JR -> kids, Mujer -> women) y las mismas exclusiones que el resto
    de la minería (+ sin mangas, ediciones especiales, colaboraciones "x ...",
    camisetas con jugador/parche: no son la misma prenda que la lisa).
  - versión jugador (Authentic) y manga larga NO se separan aquí: van en la
    misma ficha y la web las separa por título (jerseyVersion.ts).
  - ficha destino: la que tenga el mismo código de fabricante (offerMpns.json);
    si no, la única del mismo equipo, equipación, temporada y público. Si esa
    ficha ya tiene una oferta de Futbol Emotion de la misma variante, o hay
    varias candidatas, no se adivina (se cuenta como "dudosa").
  - sin ficha: se crea (id {equipo}-{equipación}-{temporada}[-kids|-women]),
    una oferta por variante (la de título más simple).
Precio, tallas y stock los mantiene luego refresh_offers.py (clave: la URL u=).
Guarda: la misma de refresh_offers.py (feed de hoy y >= 80 % de filas).

Uso: python3 scripts/catalog-mining/mine_futbolemotion_jerseys.py [--apply] [-v]
"""
import csv, json, os, re, sys
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from extract import (EXCLUDE_RE, KIDS_EXCLUDE_RE, KIDS_SIGNAL_RE, WOMEN_EXCLUDE_RE, WOMEN_SIGNAL_RE,
                     club_listing_for_national, match_team, team_re_all, type_re_all)
from pick import score
from refresh import split_blocks
from refresh_offers import FEED_DIR, PRODUCTS_TS, ROWS_STATE, js_ok, load_json, read_feed, size_of, sort_sizes, tt_key
from split_picks import explicit_season, season_end_year, seasons_equivalent

STORE = "Futbol Emotion"
FEED = "futbolemotion_feed"
MPNS = os.path.join(HERE, "..", "..", "src", "data", "offerMpns.json")
META = os.path.join(HERE, "..", "..", "src", "lib", "productMeta.ts")
EXTRA_EXCLUDE = re.compile(
    r"sin manga|tirantes|sleeveless|kombat|edici[oó]n (especial|limitada)|special edition|aniversario|"
    r"fanswear|\btravel\b|warm ?up|\bcuarta\b|\bfourth\b|\bretro\b|\d0[´'’]?s\b|\+|\s[xX]\s+\w", re.I)
# Lo que puede ir después de la temporada sin que sea otra prenda (dorsal, parche).
TAIL_OK = re.compile(r"^(?:\s|ni[ñn][oa]s?|jr|junior|juvenil|kids?|mujer|women|m/l|authentic|portero)*$", re.I)
PRE_OK = re.compile(r"^(?:\s|authentic|porteros?|pre-?match|training|fc|cf|club|sd|cd|ud|ac|as|ca|rcd|vfl|sl|slb|uc|us|olympique|glasgow|borussia|stade|sociedad|deportiva)*$", re.I)
BRANDS = {"adidas": "adidas", "nike": "nike", "puma": "puma", "jako": "jako", "joma": "joma", "errea": "errea",
          "kappa": "kappa", "hummel": "hummel", "macron": "macron", "umbro": "umbro", "new balance": "newbalance",
          "under armour": "underarmour", "kelme": "kelme", "legea": "legea", "uhlsport": "uhlsport", "lotto": "lotto",
          "mizuno": "mizuno", "reebok": "reebok"}
SEASON_TOKEN = re.compile(r"\b(?:19|20)\d\d(?:\s*[-/]\s*(?:19|20)?\d\d)?\b|\b\d\d-\d\d\b")


def fld(block, key):
    m = re.search(rf'\n    {key}: "([^"]*)"', block)
    return m.group(1) if m else None


def team_keys(src):
    head = src[src.index("export type TeamKey ="):]
    return set(re.findall(r'\|\s*"([a-z0-9]+)"', head[: head.index(";")]))


def sync_team_keys(src):
    """TeamKey (en products.ts, que es dato) con todos los equipos de teamNames
    (productMeta.ts, que es código): un equipo nuevo en el código sin su clave
    en la unión rompe tsc y con él el commit del refresco nocturno."""
    meta = open(META, encoding="utf-8").read()
    meta = meta[meta.index("export const teamNames"):]
    names = re.findall(r"^  (\w+): \{ es:", meta[: meta.index("\n};")], re.M)
    missing = [k for k in names if k not in team_keys(src)]
    if not missing:
        return src, []
    i = src.index("export type TeamKey =")
    end = src.index(";", i)
    return src[:end] + "".join(f'\n  | "{k}"' for k in missing) + src[end:], missing


def team_colors():
    s = open(META, encoding="utf-8").read()
    s = s[s.index("export const teamColors"):]
    return {k: (a, b) for k, a, b in re.findall(r'^  (\w+): \["(#[0-9A-Fa-f]{6})", "(#[0-9A-Fa-f]{6})"\]', s[: s.index("\n};")], re.M)}


def variant(title):
    """Misma clave que variantKey() de jerseyVersion.ts (jugador/hincha + manga)."""
    t = title.lower()
    player = bool(re.search(r"\b(authentic|aut[eé]ntic[ao]|player version|match version|heat[ .-]*rdy|dri[ .-]*fit[ .-]*adv)\b", t))
    long_ = bool(re.search(r"\b(manga larga|long sleeves?|ml)\b|m/l", t))
    return ("player" if player else "fan", "long" if long_ else "short")


def feed_groups():
    groups = defaultdict(list)
    with open(os.path.join(FEED_DIR, f"{FEED}.csv"), newline="", encoding="utf-8-sig", errors="replace") as f:
        for r in csv.DictReader(f, delimiter=";"):
            if (r.get("categoryPath") or "").startswith("Fans > Camisetas oficiales"):
                groups[(r.get("product ID") or "").split("_")[0]].append(r)
    return groups


def classify(rows, teams, types, known_teams):
    """(dict de la oferta, motivo de descarte)."""
    r0 = rows[0]
    # "Training2026-2027", "2026-2027Niño": sin el espacio no se lee ni la temporada ni el público.
    name = re.sub(r"(\d{4})([a-záéíóúñ])", r"\1 \2", re.sub(r"([a-záéíóú])(\d{4})", r"\1 \2", (r0.get("name") or "").strip()), flags=re.I)
    slug = tt_key(r0.get("productURL")).rsplit("/", 1)[-1].replace("-", " ")
    sizes = sort_sizes(s for s in (size_of(r.get("size")) for r in rows) if s)
    kids = bool(KIDS_SIGNAL_RE.search(name)) or bool(sizes) and all("-" in s for s in sizes)
    women = not kids and (bool(WOMEN_SIGNAL_RE.search(name)) or (r0.get("gender") or "") == "female")
    age = "kids" if kids else "women" if women else None
    if (KIDS_EXCLUDE_RE if kids else WOMEN_EXCLUDE_RE if women else EXCLUDE_RE).search(name) or EXTRA_EXCLUDE.search(name) \
            or re.search(r"sin mangas|sleeveless", slug):
        return None, "excluida"
    hit = match_team(name, teams)
    if not hit:
        return None, "sin equipo"
    team = hit[0]
    # Entre la marca y el equipo solo puede ir la gama: "adidas Mbappé Real
    # Madrid", "Nike Lamine Yamal FC Barcelona" llevan el dorsal estampado.
    pre = name[len((r0.get("brand") or "").strip()):hit[1].start()]
    if not PRE_OK.match(pre):
        return None, "personalizada"
    if team not in known_teams:
        return None, "equipo sin TeamKey"
    if club_listing_for_national(name, team, teams):
        return None, "club en selección"
    typ = next((k for k, p in types.items() if p.search(name)), None)
    if typ == "goalkeeper" and re.search(r"\btraining\b|\bentreno\b", name, re.I):
        typ = "training"  # "Training Porteros": camiseta de entrenamiento de portero, no la equipación
    if not typ:
        return None, "sin equipación"
    season = explicit_season(name)
    if not season or (season_end_year(season) or 0) < 2026:
        return None, "temporada vieja o sin temporada"
    tail = name[list(SEASON_TOKEN.finditer(name))[-1].end():]
    if not TAIL_OK.match(tail):
        return None, "personalizada"
    live = [r for r in rows if (r.get("availability") or "in stock") == "in stock" and str(r.get("stock") or "1").lstrip("-").isdigit()
            and int(r.get("stock") or 1) > 0]
    live_sizes = sort_sizes(s for s in (size_of(r.get("size")) for r in live) if s)
    if not live or not live_sizes:
        return None, "agotada o sin tallas"
    price = min(float(r["price"]) for r in live if r.get("price"))
    url = r0["productURL"].strip()
    return dict(team=team, type=typ, season=season, age=age, name=name, url=url, key=tt_key(url),
                mpn=(r0.get("MPN") or "").strip().upper(), brand=BRANDS.get((r0.get("brand") or "").strip().lower()),
                price=round(price, 2), sizes=live_sizes, image=(r0.get("imageURL_large") or r0.get("imageURL") or "").strip(),
                title=f"Camiseta {name}", variant=variant(name)), None


def offer_line(o):
    esc = lambda s: s.replace("\\", "\\\\").replace('"', '\\"')
    sizes = ", ".join(f'"{s}"' for s in o["sizes"])
    return (f'      {{ store: "{STORE}", price: {o["price"]}, shipping: 0.0, currency: "EUR", url: "{esc(o["url"])}", '
            f'title: "{esc(o["title"])}", inStock: true, sizes: [{sizes}], imageUrl: "{esc(o["image"])}" }},\n')


def main(argv):
    apply, verbose = "--apply" in argv, "-v" in argv
    idx, why = read_feed(STORE, FEED, "tt", dict(load_json(ROWS_STATE, {})))
    if idx is None:
        print(f"mine_futbolemotion_jerseys: SALTADA ({why}), no se toca nada")
        return 0
    src, synced = sync_team_keys(open(PRODUCTS_TS, encoding="utf-8").read())
    if synced:
        print(f"TeamKey: {len(synced)} equipos nuevos del código añadidos a la unión: {', '.join(synced)}")
    head, blocks, tail = split_blocks(src)
    known_teams, colors = team_keys(src), team_colors()
    teams, types = team_re_all(), type_re_all()
    have = {tt_key(u) for u in re.findall(r'url: "(https://tc\.tradetracker\.net/[^"]+)"', src)}
    ids = {fld(b, "id") for b in blocks}
    mpn_of = load_json(MPNS, {})
    url_ficha = {u: i for i, b in enumerate(blocks) for u in re.findall(r'url: "([^"]+)"', b)}
    ficha_of_mpn = defaultdict(set)
    for u, m in mpn_of.items():
        if u in url_ficha:
            ficha_of_mpn[m.strip().upper()].add(url_ficha[u])
    by_key = defaultdict(list)
    for i, b in enumerate(blocks):
        if fld(b, "typeKey") != "retro":
            by_key[(fld(b, "teamKey"), fld(b, "typeKey"), fld(b, "ageGroup"))].append(i)

    stats = defaultdict(int)
    picks, added, new = [], defaultdict(list), defaultdict(list)
    for rows in feed_groups().values():
        o, why = classify(rows, teams, types, known_teams)
        stats["camisetas en el feed"] += 1
        if not o:
            stats[why] += 1
            continue
        if o["key"] in have:
            stats["ya en el catálogo"] += 1
            continue
        picks.append(o)

    for o in picks:
        same = [i for i in ficha_of_mpn.get(o["mpn"], ()) if fld(blocks[i], "teamKey") == o["team"]
                and fld(blocks[i], "ageGroup") == o["age"]] if o["mpn"] else []
        if len(same) != 1:
            same = [i for i in by_key[(o["team"], o["type"], o["age"])] if seasons_equivalent(fld(blocks[i], "season"), o["season"])]
        if len(same) > 1:
            stats["dudosa (varias fichas candidatas)"] += 1
            continue
        if same:
            i = same[0]
            fe = [variant(t) for t in re.findall(rf'store: "{STORE}", [^\n]*?title: "((?:[^"\\]|\\.)*)"', blocks[i])]
            if o["variant"] in fe + [x["variant"] for x in added[i]]:
                stats["dudosa (la ficha ya tiene esa variante)"] += 1
                if verbose:
                    print("  dudosa:", fld(blocks[i], "id"), "<-", o["name"])
                continue
            added[i].append(o)
        else:
            new[(o["team"], o["type"], o["season"], o["age"])].append(o)

    for i, offers in added.items():
        cut = blocks[i].rindex("    ],\n")
        blocks[i] = blocks[i][:cut] + "".join(offer_line(o) for o in offers) + blocks[i][cut:]
        stats["ofertas añadidas a fichas existentes"] += len(offers)
        if verbose:
            for o in offers:
                print(f"  + {fld(blocks[i], 'id'):34} {o['price']:>7} {o['name']}")
    fresh = []
    for (team, typ, season, age), offers in sorted(new.items(), key=lambda kv: tuple(str(x) for x in kv[0])):
        by_var = {}
        for o in sorted(offers, key=lambda o: (score(o["name"]), o["price"])):
            by_var.setdefault(o["variant"], o)
        stats["dudosa (misma variante, otro colorway)"] += len(offers) - len(by_var)
        slug = season.replace("/", "")
        pid = f"{team}-{typ}-{age}" if age else f"{team}-{typ}-{slug}"
        if pid in ids:
            pid = f"{team}-{typ}-{slug}-{age}" if age else f"{pid}-fe"
        if pid in ids or team not in colors:
            stats["ficha nueva sin id libre o sin colores"] += 1
            continue
        ids.add(pid)
        c1, c2 = colors[team]
        brand = next((o["brand"] for o in by_var.values() if o["brand"]), None)
        fresh.append(
            "  {\n"
            f'    id: "{pid}",\n    teamKey: "{team}",\n    season: "{season}",\n    typeKey: "{typ}",\n'
            f'    colorHex: "{c1}",\n    colorHexSecondary: "{c2}",\n    jerseyPattern: "solid",\n'
            + (f'    ageGroup: "{age}",\n' if age else "") + (f'    brand: "{brand}",\n' if brand else "")
            + "    offers: [\n" + "".join(offer_line(o) for o in by_var.values()) + "    ],\n  },\n")
        stats["fichas nuevas"] += 1
        stats["ofertas en fichas nuevas"] += len(by_var)
        if verbose:
            print(f"  NUEVA {pid:34} " + " | ".join(o["name"] for o in by_var.values()))
    print("mine_futbolemotion_jerseys:", json.dumps(stats, ensure_ascii=False))
    if not apply:
        print("(ensayo: --apply para escribir)")
        return 0
    if not added and not fresh and not synced:
        return 0
    out = head + "".join(blocks) + "".join(fresh) + tail
    ok, msg = js_ok(out)
    if not ok:
        print(f"ERROR: products.ts quedaría roto, no se escribe: {msg}")
        return 1
    open(PRODUCTS_TS + ".tmp", "w", encoding="utf-8").write(out)
    os.replace(PRODUCTS_TS + ".tmp", PRODUCTS_TS)
    print(f"products.ts escrito ({msg} fichas)")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
