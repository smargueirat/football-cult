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
Fichas que quedan vacías: borradas + alias en productAliases.ts.

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
eb_after = sum(1 for b in blocks for l in OFFER_RE.findall(b) if ITM.search(l))
print(f"\nfilas eBay: {eb_before} -> {eb_after}; repetidas dentro de la ficha quitadas: {in_ficha}")
print(f"anuncios duplicados entre fichas resueltos: {sum(removed.values())} filas"
      f" (dudosos: {doubtful}), sin decidir: {skipped}, fichas vaciadas: {len(aliases)}")
if APPLY and (removed or in_ficha):
    open(P, "w", encoding="utf-8").write(head + "".join(blocks) + tail)
    if aliases:
        A = ROOT + "/src/data/productAliases.ts"
        s = open(A, encoding="utf-8").read()
        marker = "export const PRODUCT_ID_ALIASES: Record<string, string> = {\n"
        # una ficha que ya era alias y la minería resucitó: se reapunta la
        # entrada existente (una clave repetida rompe tsc)
        old = {k: v for k, v in aliases.items() if re.search(rf'^  "{re.escape(k)}": ', s, re.M)}
        for k, v in old.items():
            s = re.sub(rf'^(  "{re.escape(k)}": )"[^"]*",', lambda m: f'{m[1]}"{v}",', s, flags=re.M)
        add = (f"  // {datetime.date.today()}: el mismo anuncio estaba en dos fichas\n"
               "  // (dedupe_same_url.py); la que quedó vacía redirige a la que se quedó.\n"
               + "".join(f'  "{k}": "{v}",\n' for k, v in aliases.items() if k not in old))
        s = s.replace(marker, marker + add, 1)
        for k, v in aliases.items():
            s = s.replace(f': "{k}",', f': "{v}",')
        open(A, "w", encoding="utf-8").write(s)
    print("aplicado")
