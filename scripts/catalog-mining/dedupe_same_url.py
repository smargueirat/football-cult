#!/usr/bin/env python3
"""El mismo anuncio en varias filas -> una sola fila, en una sola ficha.

Clave del anuncio: en eBay el número de `/itm/<id>` (las copias eBay / eBay ES
/ eBay IT / eBay GB y las URLs que solo cambian en parámetros de tracking
`_skw=`, `hash=`, `amdata=` son el MISMO anuncio); en el resto de tiendas la
URL entera, como siempre.

1. Entre fichas: se queda solo en la ficha cuya temporada coincide con la que
   ESCRIBE su título. Si el título no decide y es eBay, en la de mejor
   coincidencia (equipación y año del título, luego la que más ofertas tiene)
   y se imprime como "DUDOSO" para revisarlo. Si no es eBay y el título no
   decide, no se toca (comportamiento de siempre).
2. Dentro de una ficha: una fila por anuncio eBay, con preferencia
   ES > IT > GB > US. El mercado principal es España/UE y el precio de la
   copia europea ya lleva IVA, que es lo que paga de verdad el visitante; el
   de eBay US sale sin IVA y más barato de lo real. La copia europea va con
   su envío propio (el envío en vivo por país de /api/ebay-shipping es solo
   para store "eBay"). Si alguna copia estaba `inStock: false`, la que queda
   también (un id muerto en eBay está muerto en todos los sitios).
3. Ficha de año suelto de un club de liga de temporada partida ("2024") con
   gemela de temporada ("2023/24" o "2024/25", mismo equipo, equipación,
   variante y público) -> sus anuncios pasan a la gemela: a la que nombra el
   título, o a la única gemela si el título no dice nada. Si hay dos gemelas
   y el título no decide, o el título nombra otra temporada, el anuncio se
   queda. 2026-10-08: 459 fichas gemelas ("celtic-retro-2024-away" junto a
   "celtic-retro-202425-away"); los parsers leían "2024 / 2025" como 2024
   suelto (arreglado en extract.normalize_season_text).
Fichas que quedan vacías: borradas + alias en productAliases.ts (la URL vieja
hace 301 a la buena, ver camiseta/[id]/page.tsx).

Por qué: 2026-09-30, 182 anuncios en la ficha de año suelto y en la de
temporada; 2026-10-09, 3.548 filas eBay redundantes en 2.493 fichas y 111
anuncios en dos fichas que la URL entera escondía. Corre cada noche al final
del escaneo (daily_scan.sh): la minería de ES/IT vuelve a meter sus copias.

Uso: python3 dedupe_same_url.py [--apply]"""
import collections, datetime, os, re, sys
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.insert(0, ROOT + "/scripts/catalog-mining")
from refresh import split_blocks
from retro_extract import parse_retro_season
from split_picks import explicit_season

APPLY = "--apply" in sys.argv
P = ROOT + "/src/data/products.ts"
head, blocks, tail = split_blocks(open(P, encoding="utf-8").read())
OFFER_RE = re.compile(r'      \{ store: [^\n]*\},\n')
ITM = re.compile(r'url: "https://www\.ebay\.[a-z.]+/itm/(\d+)')
STORE_RANK = {"eBay ES": 0, "eBay IT": 1, "eBay GB": 2, "eBay": 3}
KIT_WORDS = {
    "home": r"home|local|casa|domicile|1st",
    "away": r"away|visitante|trasferta|suplente|ext[ée]rieur|2nd",
    "third": r"third|tercera|terza|3rd",
    "goalkeeper": r"goalkeeper|keeper|portero|portiere|gk",
    "training": r"training|entrenamiento|allenamento",
    "prematch": r"pre-?match|warm[- ]?up|calentamiento",
}
fld = lambda b, k: (re.search(rf'\n    {k}: "([^"]*)"', b) or [None, ""])[1]
idx = {fld(b, "id"): i for i, b in enumerate(blocks) if fld(b, "id")}


def key_of(line):
    m = ITM.search(line)
    return f"ebay:{m[1]}" if m else re.search(r'url: "([^"]+)"', line)[1]


def title_season(title, retro):
    # "2020 - 21" -> "2020-21": con espacios el parser lo leía como 2020 suelto
    title = re.sub(r'\b(\d{4})\s+([-/])\s+(\d{2,4})\b', r'\1\2\3', title)
    # "2021 2022" (dos años seguidos) -> "2021/22"
    title = re.sub(r'\b(19\d\d|20\d\d) (19\d\d|20\d\d)\b',
                   lambda m: f"{m[1]}/{m[2][-2:]}" if int(m[2]) == int(m[1]) + 1 else m[0], title)
    season = parse_retro_season(title) if retro else explicit_season(title)
    # "2023/2034" es una errata, no una temporada: no se decide con eso. Los
    # kits de selección de 2-3 años ("2006-08", "2022-24") sí son reales.
    if season and "/" in season and not 1 <= (int(season[-2:]) - int(season[2:4])) % 100 <= 3:
        season = None
    return season


def best_match(pids, titles):
    """Ficha más parecida a los títulos: equipación del id, año de su temporada."""
    text = " ".join(titles).lower()
    said = {k for k, w in KIT_WORDS.items() if re.search(rf"\b({w})\b", text)}
    # "Pre-Match Training Jersey" es prematch; "Third Away Shirt" es tercera
    said -= {"training"} if "prematch" in said else set()
    said -= {"away"} if "third" in said else set()
    def score(p):
        b = blocks[idx[p]]
        kit = next((k for k in KIT_WORDS if p.endswith("-" + k) or f"-{k}-" in p), None)
        year = fld(b, "season")[:4]
        return (2 * (kit in said) + bool(year and year in text), len(OFFER_RE.findall(b)))
    return max(pids, key=score)


lines_of = lambda p: OFFER_RE.findall(blocks[idx[p]])
eb_before = sum(1 for b in blocks for l in OFFER_RE.findall(b) if ITM.search(l))

# 1. entre fichas
where = collections.defaultdict(list)
for pid in idx:
    for line in lines_of(pid):
        where[key_of(line)].append((pid, line))

removed, kept_in, skipped, doubtful = collections.Counter(), {}, 0, 0
for key, occ in where.items():
    pids = list(dict.fromkeys(p for p, _ in occ))
    if len(pids) < 2:
        continue
    titles = [(re.search(r'title: "([^"]*)"', l) or [None, ""])[1] for _, l in occ]
    retro = 'typeKey: "retro"' in blocks[idx[pids[0]]]
    season = next((s for s in (title_season(t, retro) for t in titles) if s), None)
    good = [p for p in pids if season and fld(blocks[idx[p]], "season") == season]
    if len(good) == 1:
        keep = good[0]
    elif key.startswith("ebay:"):
        keep = best_match(good or pids, titles)
        doubtful += 1
        print(f"DUDOSO {key}: queda en {keep}, fuera de {', '.join(p for p in pids if p != keep)} | {titles[0][:70]}")
    else:
        skipped += 1
        continue
    for p, line in occ:
        if p != keep and line in blocks[idx[p]]:
            blocks[idx[p]] = blocks[idx[p]].replace(line, "", 1)
            removed[p] += 1
            kept_in.setdefault(p, keep)
            if len(good) == 1:
                print(f"{p}: fuera ({season}, queda en {keep}) | {titles[0][:60]}")

# 2. dentro de cada ficha: una fila por anuncio eBay
in_ficha = 0
for pid in idx:
    groups = collections.defaultdict(list)
    for line in lines_of(pid):
        if ITM.search(line):
            groups[key_of(line)].append(line)
    for lines in groups.values():
        if len(lines) < 2:
            continue
        rank = lambda l: STORE_RANK.get(re.search(r'store: "([^"]+)"', l)[1], 9)
        keep = min(lines, key=rank)
        b = blocks[idx[pid]]
        for line in lines:
            if line is not keep:
                b = b.replace(line, "", 1)
                in_ficha += 1
        if any("inStock: false" in l for l in lines) and "inStock: true" in keep:
            b = b.replace(keep, keep.replace("inStock: true", "inStock: false", 1), 1)
        blocks[idx[pid]] = b

aliases = {}
for p in removed:
    if not OFFER_RE.findall(blocks[idx[p]]):
        aliases[p] = kept_in[p]
        blocks[idx[p]] = ""

# 3. ficha de año suelto con gemela de temporada
tm = open(ROOT + "/src/data/teamMeta.ts", encoding="utf-8").read()
tm = tm[tm.index("TEAM_LEAGUE"):]
TEAM_LEAGUE = dict(re.findall(r'^  "?([a-z0-9]+)"?: "([a-z0-9-]+)",$', tm[:tm.index("\n};")], re.M))
# Ligas de año natural: ahí "2024" ES la temporada, no un duplicado.
CALENDAR_LEAGUES = {"mls", "brasileirao", "liga-argentina", "j-league", "liga-colombia", "liga-chile", "liga-uruguay"}


def core(pid, season):
    """Id sin la temporada: "celtic-retro-2024-away" y "celtic-retro-202425-away" -> "celtic-retro-*-away"."""
    return re.sub(r"-mens$", "", pid.replace("-" + season.replace("/", ""), "-*", 1))


twin_groups = collections.defaultdict(list)
for pid, i in idx.items():
    if blocks[i]:
        b = blocks[i]
        twin_groups[(core(pid, fld(b, "season")), fld(b, "typeKey"), fld(b, "ageGroup"))].append(pid)

moved = already = undecided = 0
twin_aliases = {}
for pid, i in idx.items():
    b = blocks[i]
    season, team, age = fld(b, "season"), fld(b, "teamKey"), fld(b, "ageGroup")
    # niños: una ficha por equipo y tipo con temporada fija, no son gemelas reales
    if not b or not re.fullmatch(r"\d{4}", season) or age == "kids" \
            or TEAM_LEAGUE.get(team) in (None, *CALENDAR_LEAGUES):
        continue
    y = int(season)
    split_seasons = {f"{y - 1}/{str(y)[2:]}", f"{y}/{str(y + 1)[2:]}"}
    twins = {fld(blocks[idx[q]], "season"): q for q in twin_groups[(core(pid, season), fld(b, "typeKey"), age)]
             if q != pid and fld(blocks[idx[q]], "season") in split_seasons}
    if not twins:
        continue
    retro = fld(b, "typeKey") == "retro"
    got = collections.Counter()
    for line in OFFER_RE.findall(b):
        said = title_season((re.search(r'title: "([^"]*)"', line) or [None, ""])[1], retro)
        if said in twins:
            target = twins[said]
        elif said in (None, season) and len(twins) == 1:
            target = next(iter(twins.values()))
        else:
            undecided += 1
            continue
        t = idx[target]
        blocks[i] = blocks[i].replace(line, "", 1)
        if any(key_of(l) == key_of(line) for l in OFFER_RE.findall(blocks[t])):
            already += 1
        else:
            cut = blocks[t].rindex("    ],\n")
            blocks[t] = blocks[t][:cut] + line + blocks[t][cut:]
            moved += 1
        got[target] += 1
    if got and not OFFER_RE.findall(blocks[i]):
        twin_aliases[pid] = got.most_common(1)[0][0]
        blocks[i] = ""
        print(f"{pid}: fundida en {twin_aliases[pid]}")

eb_after = sum(1 for b in blocks for l in OFFER_RE.findall(b) if ITM.search(l))
print(f"\nfilas eBay: {eb_before} -> {eb_after}; repetidas dentro de la ficha quitadas: {in_ficha}")
print(f"anuncios duplicados entre fichas resueltos: {sum(removed.values())} filas"
      f" (dudosos: {doubtful}), sin decidir: {skipped}, fichas vaciadas: {len(aliases)}")
print(f"fichas de año suelto fundidas con su temporada: {len(twin_aliases)} "
      f"(anuncios movidos: {moved}, ya estaban: {already}, sin decidir: {undecided})")


def write_aliases(new, why):
    """Una sola escritura para las dos pasadas. Una ficha que ya era alias y la
    minería resucitó se reapunta en su entrada (una clave repetida rompe tsc)."""
    A = ROOT + "/src/data/productAliases.ts"
    s = open(A, encoding="utf-8").read()
    marker = "export const PRODUCT_ID_ALIASES: Record<string, string> = {\n"
    old = {k for k in new if re.search(rf'^  "{re.escape(k)}": ', s, re.M)}
    for k in old:
        s = re.sub(rf'^(  "{re.escape(k)}": )"[^"]*",', lambda m: f'{m[1]}"{new[k]}",', s, flags=re.M)
    fresh = [k for k in new if k not in old]
    if fresh:
        s = s.replace(marker, marker + f"  // {datetime.date.today()}: {why}\n"
                      + "".join(f'  "{k}": "{new[k]}",\n' for k in fresh), 1)
    for k, v in new.items():  # apuntar siempre al id vigente, nunca a otro alias
        s = s.replace(f': "{k}",', f': "{v}",')
    open(A, "w", encoding="utf-8").write(s)

if APPLY and (removed or in_ficha or moved or already):
    open(P, "w", encoding="utf-8").write(head + "".join(blocks) + tail)
    if aliases or twin_aliases:
        write_aliases({**aliases, **twin_aliases},
                      "fichas fundidas por dedupe_same_url.py (mismo anuncio en dos\n"
                      "  // fichas, o año suelto con gemela de temporada); redirigen a la que quedó.")
    print("aplicado")
