#!/usr/bin/env python3
"""Dos pasadas contra fichas duplicadas por formato de temporada. Fichas que
quedan vacías: borradas + alias en productAliases.ts (la URL vieja hace 301 a
la buena, ver camiseta/[id]/page.tsx).

1. El mismo anuncio (misma URL) en dos fichas -> se queda solo en la ficha
   cuya temporada coincide con la que ESCRIBE su título; si el título no
   decide, no se toca.
   Por qué (2026-09-30): 182 anuncios, casi todos retro de eBay, estaban a la
   vez en la ficha de año suelto y en la de temporada
   ("atalanta-retro-2024-home" y "atalanta-retro-202425-home").

2. Ficha de año suelto de un club de liga de temporada partida ("2024") con
   gemela de temporada ("2023/24" o "2024/25", mismo equipo, equipación,
   variante y público) -> sus anuncios pasan a la gemela: a la que nombra el
   título, o a la única gemela si el título no dice nada. Si hay dos gemelas
   y el título no decide, o el título nombra otra temporada, el anuncio se
   queda. Por qué (2026-10-08): 459 fichas gemelas ("celtic-retro-2024-away"
   junto a "celtic-retro-202425-away"); los parsers leían "2024 / 2025" como
   2024 suelto (arreglado en extract.normalize_season_text) y varias pasadas
   de minería crean fichas por su cuenta.

Corre cada noche al final del escaneo (daily_scan.sh), así lo que la minería
recrea se vuelve a fundir antes de publicar.

Uso: python3 dedupe_same_url.py [--apply]"""
import re, sys, collections, os, datetime
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.insert(0, ROOT + "/scripts/catalog-mining")
from refresh import split_blocks
from retro_extract import parse_retro_season
from split_picks import explicit_season

APPLY = "--apply" in sys.argv
P = ROOT + "/src/data/products.ts"
A = ROOT + "/src/data/productAliases.ts"
head, blocks, tail = split_blocks(open(P, encoding="utf-8").read())
OFFER_RE = re.compile(r'      \{ store: [^\n]*\},\n')
fld = lambda b, k: (re.search(rf'\n    {k}: "([^"]*)"', b) or [None, ""])[1]
url_of = lambda line: re.search(r'url: "([^"]+)"', line).group(1)
title_of = lambda line: (re.search(r'title: "([^"]*)"', line) or [None, ""])[1]
idx = {fld(b, "id"): i for i, b in enumerate(blocks) if fld(b, "id")}


def title_season(title, retro):
    return parse_retro_season(title) if retro else explicit_season(title)


# --- 1. mismo anuncio en dos fichas -------------------------------------------
where = collections.defaultdict(list)
for pid, i in idx.items():
    for line in OFFER_RE.findall(blocks[i]):
        where[url_of(line)].append((pid, line))

removed, kept_in, skipped = collections.Counter(), {}, 0
for url, occ in where.items():
    if len({p for p, _ in occ}) < 2:
        continue
    title = title_of(occ[0][1])
    season = title_season(title, 'typeKey: "retro"' in blocks[idx[occ[0][0]]])
    # "2023/2034" es una errata, no una temporada: no se decide con eso. Los
    # kits de selección de 2-3 años ("2006-08", "2022-24") sí son reales.
    if season and "/" in season and not 1 <= (int(season[-2:]) - int(season[2:4])) % 100 <= 3:
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

# --- 2. ficha de año suelto con gemela de temporada -----------------------------
tm = open(ROOT + "/src/data/teamMeta.ts", encoding="utf-8").read()
tm = tm[tm.index("TEAM_LEAGUE"):]
TEAM_LEAGUE = dict(re.findall(r'^  "?([a-z0-9]+)"?: "([a-z0-9-]+)",$', tm[:tm.index("\n};")], re.M))
# Ligas de año natural: ahí "2024" ES la temporada, no un duplicado.
CALENDAR_LEAGUES = {"mls", "brasileirao", "liga-argentina", "j-league", "liga-colombia", "liga-chile", "liga-uruguay"}


def core(pid, season):
    """Id sin la temporada: "celtic-retro-2024-away" y "celtic-retro-202425-away" -> "celtic-retro-*-away"."""
    return re.sub(r"-mens$", "", pid.replace("-" + season.replace("/", ""), "-*", 1))


groups = collections.defaultdict(list)
for pid, i in idx.items():
    b = blocks[i]
    if b:
        groups[(core(pid, fld(b, "season")), fld(b, "typeKey"), fld(b, "ageGroup"))].append(pid)

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
    twins = {fld(blocks[idx[q]], "season"): q for q in groups[(core(pid, season), fld(b, "typeKey"), age)]
             if q != pid and fld(blocks[idx[q]], "season") in split_seasons}
    if not twins:
        continue
    retro = fld(b, "typeKey") == "retro"
    got = collections.Counter()
    for line in OFFER_RE.findall(b):
        said = title_season(title_of(line), retro)
        if said in twins:
            target = twins[said]
        elif (said in (None, season)) and len(twins) == 1:
            target = next(iter(twins.values()))
        else:
            undecided += 1
            continue
        t = idx[target]
        blocks[i] = blocks[i].replace(line, "", 1)
        if url_of(line) in blocks[t]:
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
print(f"\nfichas de año suelto fundidas con su temporada: {len(twin_aliases)} "
      f"(anuncios movidos: {moved}, ya estaban: {already}, sin decidir: {undecided})")


def write_aliases(new, why):
    s = open(A, encoding="utf-8").read()
    marker = "export const PRODUCT_ID_ALIASES: Record<string, string> = {\n"
    fresh = {}
    for k, v in new.items():
        line = re.compile(rf'^  "{re.escape(k)}": "[^"]*",$', re.M)
        if line.search(s):  # la ficha vieja ya tenía alias y la minería la recreó
            s = line.sub(f'  "{k}": "{v}",', s)
        else:
            fresh[k] = v
    if fresh:
        s = s.replace(marker, marker + f"  // {datetime.date.today()}: {why}\n"
                      + "".join(f'  "{k}": "{v}",\n' for k, v in fresh.items()), 1)
    for k, v in new.items():  # apuntar siempre al id vigente, nunca a otro alias
        s = s.replace(f': "{k}",', f': "{v}",')
    open(A, "w", encoding="utf-8").write(s)


if APPLY and (removed or moved or already):
    open(P, "w", encoding="utf-8").write(head + "".join(blocks) + tail)
    if aliases:
        write_aliases(aliases, "el mismo anuncio estaba en dos fichas\n  // (dedupe_same_url.py); la que quedó vacía redirige a la de su temporada.")
    if twin_aliases:
        write_aliases(twin_aliases, "ficha de año suelto con gemela de temporada\n  // (dedupe_same_url.py, pasada 2): redirige a la ficha de su temporada.")
    print("aplicado")
