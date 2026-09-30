#!/usr/bin/env python3
"""El mismo anuncio (misma URL) en dos fichas -> se queda solo en la ficha
cuya temporada coincide con la que ESCRIBE su título; si el título no decide,
no se toca. Fichas que quedan vacías: borradas + alias en productAliases.ts.

Por qué (2026-09-30): 182 anuncios, casi todos retro de eBay, estaban a la
vez en la ficha de año suelto y en la de temporada ("atalanta-retro-2024-home"
y "atalanta-retro-202425-home"); 91 fichas eran solo copias. Varias pasadas
de minería insertan por su cuenta, así que esto corre cada noche al final del
escaneo (daily_scan.sh) en vez de parchear cada una.

Uso: python3 dedupe_same_url.py [--apply]"""
import re, sys, collections
ROOT = __import__("os").path.abspath(__import__("os").path.join(__import__("os").path.dirname(__file__), "..", ".."))
sys.path.insert(0, ROOT + "/scripts/catalog-mining")
from refresh import split_blocks
from retro_extract import parse_retro_season
from split_picks import explicit_season

APPLY = "--apply" in sys.argv
P = ROOT + "/src/data/products.ts"
head, blocks, tail = split_blocks(open(P, encoding="utf-8").read())
OFFER_RE = re.compile(r'      \{ store: [^\n]*\},\n')
fld = lambda b, k: (re.search(rf'\n    {k}: "([^"]*)"', b) or [None, ""])[1]
idx = {fld(b, "id"): i for i, b in enumerate(blocks) if fld(b, "id")}

where = collections.defaultdict(list)
for pid, i in idx.items():
    for line in OFFER_RE.findall(blocks[i]):
        where[re.search(r'url: "([^"]+)"', line).group(1)].append((pid, line))

removed, kept_in, skipped = collections.Counter(), {}, 0
for url, occ in where.items():
    if len({p for p, _ in occ}) < 2:
        continue
    title = (re.search(r'title: "([^"]*)"', occ[0][1]) or [None, ""])[1]
    # "2020 - 21" -> "2020-21": con espacios el parser lo leía como 2020 suelto
    title = re.sub(r'\b(\d{4})\s+([-/])\s+(\d{2,4})\b', r'\1\2\3', title)
    # "2021 2022" (dos años seguidos) -> "2021/22"
    title = re.sub(r'\b(19\d\d|20\d\d) (19\d\d|20\d\d)\b',
                   lambda m: f"{m[1]}/{m[2][-2:]}" if int(m[2]) == int(m[1]) + 1 else m[0], title)
    retro = 'typeKey: "retro"' in blocks[idx[occ[0][0]]]
    season = parse_retro_season(title) if retro else explicit_season(title)
    # "2023/2034" es una errata, no una temporada: no se decide con eso
    if season and "/" in season and int(season[-2:]) != (int(season[2:4]) + 1) % 100:
        season = None
    good = [p for p, _ in occ if season and fld(blocks[idx[p]], "season") == season]
    if len(good) != 1:
        skipped += 1
        continue
    for p, line in occ:
        if p != good[0] and line in blocks[idx[p]]:
            blocks[idx[p]] = blocks[idx[p]].replace(line, "", 1)
            removed[p] += 1
            kept_in.setdefault(p, good[0])
            print(f"{p}: fuera ({season}, queda en {good[0]}) | {title[:60]}")

aliases = {}
for p in removed:
    if not OFFER_RE.findall(blocks[idx[p]]):
        aliases[p] = kept_in[p]
        blocks[idx[p]] = ""
print(f"\nanuncios duplicados resueltos: {sum(removed.values())}, sin decidir: {skipped}, fichas vaciadas: {len(aliases)}")
if APPLY and removed:
    open(P, "w", encoding="utf-8").write(head + "".join(blocks) + tail)
    A = ROOT + "/src/data/productAliases.ts"
    s = open(A, encoding="utf-8").read()
    marker = "export const PRODUCT_ID_ALIASES: Record<string, string> = {\n"
    add = (f"  // {__import__('datetime').date.today()}: el mismo anuncio estaba en dos fichas\n"
           "  // (dedupe_same_url.py); la que quedó vacía redirige a la de su temporada.\n"
           + "".join(f'  "{k}": "{v}",\n' for k, v in aliases.items()))
    s = s.replace(marker, marker + add, 1)
    for k, v in aliases.items():
        s = s.replace(f': "{k}",', f': "{v}",')
    open(A, "w", encoding="utf-8").write(s)
    print("aplicado")
