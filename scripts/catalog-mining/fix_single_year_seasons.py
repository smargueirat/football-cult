#!/usr/bin/env python3
"""Fichas con temporada de un solo año ("2025", "2026") en ligas de temporada
partida -> "2025/26", "2026/27", fundidas con su gemela si ya existe.

Por qué (2026-10-18): el 2026-10-09 se corrigió a mano `cremonese-home-2025` ->
`cremonese-home-202526`; quedaban otras 90 fichas iguales (4 de 2025, 85 de 2026,
1 de 2027). `dedupe_same_url.py` solo funde las que tienen gemela exacta y se salta
las de niño; las demás se quedaban con "2026" para siempre, mezclando camisetas de
dos temporadas en una ficha (alaves-home-2026: 2025/26 y 2026/27).

Regla (solo con evidencia, nunca por adivinar): la temporada la dicen los TÍTULOS de
las ofertas ("Camiseta Real Sociedad 2025/26"); un año suelto en el título no
cuenta. Una oferta sin temporada completa va con la mayoría de la ficha.
  - todas las ofertas dicen la misma temporada T -> la ficha pasa a T;
  - varias temporadas (mezcla) -> cada oferta va a la ficha de su temporada;
  - ninguna oferta la dice -> no se toca (se lista como "sin evidencia").
Destino de cada grupo: si ya existe la ficha gemela (mismo id con la temporada
puesta: `x-home-202627`, `x-home-202627-kids`) y es de T, las ofertas pasan a ella
(sin repetir anuncio) y el id viejo queda como alias; si no, la ficha se renombra
(id con la temporada, season = T) y el id viejo queda como alias. Los ids de niño /
mujer sin año ("x-home-kids") reciben el año ("x-home-202526-kids"). Las claves de
productFirstSeen.json / productDominantColors.json siguen al id nuevo para que no
salga como "novedad de hoy".

Solo ligas de temporada partida (no MLS, Brasileirão, Argentina, Japón, Colombia,
Chile, Uruguay) y solo fichas que no son retro. Idempotente.

Uso: python3 fix_single_year_seasons.py [--apply]"""
import collections, datetime, json, os, re, sys
from urllib.parse import unquote

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
sys.path.insert(0, HERE)
from refresh import split_blocks
from split_picks import explicit_season

APPLY = "--apply" in sys.argv
P = ROOT + "/src/data/products.ts"
OFFER_RE = re.compile(r'      \{ store: [^\n]*\},\n')
CALENDAR_LEAGUES = {"mls", "brasileirao", "liga-argentina", "j-league", "liga-colombia", "liga-chile", "liga-uruguay"}
fld = lambda b, k: (re.search(rf'\n    {k}: "([^"]*)"', b) or [None, ""])[1]
slug = lambda season: season.replace("/", "")

tm = open(ROOT + "/src/data/teamMeta.ts", encoding="utf-8").read()
tm = tm[tm.index("TEAM_LEAGUE"):]
TEAM_LEAGUE = dict(re.findall(r'^  "?([a-z0-9]+)"?: "([a-z0-9-]+)",$', tm[:tm.index("\n};")], re.M))

head, blocks, tail = split_blocks(open(P, encoding="utf-8").read())
idx = {fld(b, "id"): i for i, b in enumerate(blocks) if fld(b, "id")}


def key_of(line):
    m = re.search(r'url: "https://www\.ebay\.[a-z.]+/itm/(\d+)', line)
    return f"ebay:{m[1]}" if m else re.search(r'url: "([^"]+)"', line)[1]


def said_season(line):
    """Temporada completa ("2025/26") que escribe el título de la oferta, o None."""
    title = (re.search(r'title: "((?:[^"\\]|\\.)*)"', line) or [None, ""])[1]
    title = re.sub(r'\b(\d{4})\s+([-/])\s+(\d{2,4})\b', r'\1\2\3', title)
    # Si el título solo trae el año suelto, el slug de la URL de la tienda suele traer
    # la temporada entera ("...-tercera-equipacion-2025-2026-...").
    url = unquote(unquote((re.search(r'url: "([^"]+)"', line) or [None, ""])[1])).rsplit("/", 1)[-1].replace("-", " ")
    for text in (title, url):
        s = explicit_season(text)
        if s and re.fullmatch(r"20\d\d/\d\d", s) and (int(s[-2:]) - int(s[2:4])) % 100 == 1:
            return s
    return None


def new_id(pid, old, new):
    """Mismo id con la temporada puesta; None si el id no admite el cambio."""
    if f"-{old}" in pid:
        return pid.replace(f"-{old}", f"-{slug(new)}", 1)
    m = re.search(r"-(kids|women)$", pid)
    return pid[: m.start()] + f"-{slug(new)}" + pid[m.start():] if m else None


moved = merged = renamed = 0
aliases, first_seen_moves = {}, {}
undecided, split_report = [], []
for pid in list(idx):
    b = blocks[idx[pid]]
    season, team = fld(b, "season"), fld(b, "teamKey")
    if not b or not re.fullmatch(r"20(2[4-9])", season) or fld(b, "typeKey") == "retro" \
            or TEAM_LEAGUE.get(team) in (None, *CALENDAR_LEAGUES):
        continue
    lines = OFFER_RE.findall(b)
    said = [said_season(l) for l in lines]
    seasons = collections.Counter(s for s in said if s)
    if not seasons:
        undecided.append(pid)
        continue
    # Mayoría; en empate, la más reciente. Las ofertas sin temporada completa van con ella.
    main = max(seasons, key=lambda s: (seasons[s], s))
    groups = collections.defaultdict(list)
    for l, s in zip(lines, said):
        groups[s or main].append(l)
    if len(groups) > 1:
        split_report.append(f"{pid}: {dict(seasons)}")
    for target_season, group in sorted(groups.items(), key=lambda kv: kv[0] != main):
        tid = new_id(pid, season, target_season)
        t = idx.get(tid) if tid else None
        if t is not None and blocks[t] and fld(blocks[t], "season") == target_season and tid != pid:
            for l in group:
                blocks[idx[pid]] = blocks[idx[pid]].replace(l, "", 1)
                if any(key_of(x) == key_of(l) for x in OFFER_RE.findall(blocks[t])):
                    continue
                cut = blocks[t].rindex("    ],\n")
                blocks[t] = blocks[t][:cut] + l + blocks[t][cut:]
                moved += 1
            aliases[pid] = aliases.get(pid) or tid
            merged += 1
        elif target_season == main:
            nb = re.sub(r'(\n    season: )"[^"]*"', rf'\1"{target_season}"', blocks[idx[pid]], count=1)
            if tid and tid not in idx:
                nb = re.sub(r'(\n    id: )"[^"]*"', rf'\1"{tid}"', nb, count=1)
                aliases[pid] = tid
                first_seen_moves[pid] = tid
                idx[tid] = idx.pop(pid)
            blocks[idx[tid] if tid and tid in idx else idx[pid]] = nb
            renamed += 1
        else:
            # Otra temporada sin ficha propia: copia de la ficha con solo estas ofertas.
            if not tid or tid in idx:
                continue  # sin id libre: las ofertas se quedan donde están
            nb = blocks[idx.get(pid) or idx[aliases.get(pid, pid)]]
            nb = re.sub(r'(\n    id: )"[^"]*"', rf'\1"{tid}"', nb, count=1)
            nb = re.sub(r'(\n    season: )"[^"]*"', rf'\1"{target_season}"', nb, count=1)
            nb = OFFER_RE.sub("", nb)
            cut = nb.rindex("    ],\n")
            nb = nb[:cut] + "".join(group) + nb[cut:]
            for l in group:
                src = idx.get(pid) or idx[aliases.get(pid, pid)]
                blocks[src] = blocks[src].replace(l, "", 1)
            idx[tid] = len(blocks)
            blocks.append(nb)
            renamed += 1
    # Una ficha que se quedó sin ofertas se borra (su id ya es alias).
    cur = idx.get(pid)
    if cur is not None and pid in aliases and blocks[cur] and not OFFER_RE.findall(blocks[cur]):
        blocks[cur] = ""

print(f"fichas renombradas/creadas: {renamed}, fundidas en gemela: {merged} (anuncios movidos: {moved})")
print(f"fichas con ofertas de varias temporadas, repartidas: {len(split_report)}")
for r in split_report:
    print("   ", r)
print(f"sin evidencia en los títulos (no se tocan): {len(undecided)}: {', '.join(undecided)}")


def write_aliases(new, why):
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
    # Cadenas que ya existían (cremonese-retro-199596-home -> cremonese-home-2025 -> ...202526).
    entries = dict(re.findall(r'^  "([^"]+)": "([^"]+)",$', s, re.M))
    for k, v in entries.items():
        final, seen = v, set()
        while final in entries and final not in seen:
            seen.add(final)
            final = entries[final]
        if final != v:
            s = s.replace(f'  "{k}": "{v}",', f'  "{k}": "{final}",', 1)
    open(A, "w", encoding="utf-8").write(s)


def move_keys(path, moves, compact):
    d = json.load(open(path, encoding="utf-8"))
    for old, new in moves.items():
        if old in d:
            v = d.pop(old)
            d[new] = min(d[new], v) if new in d and compact is False else d.get(new, v)
    if compact:
        open(path, "w", encoding="utf-8").write(json.dumps(d, ensure_ascii=False, separators=(",", ":")))
    else:
        d = dict(sorted(d.items()))
        open(path, "w", encoding="utf-8").write("{\n" + ",\n".join(f'"{k}": "{v}"' for k, v in d.items()) + "\n}")


if APPLY and (renamed or merged):
    open(P, "w", encoding="utf-8").write(head + "".join(blocks) + tail)
    write_aliases(aliases, "temporada de un solo año -> 2025/26 o 2026/27 según los títulos\n"
                  "  // (scripts/catalog-mining/fix_single_year_seasons.py); redirigen a la ficha vigente.")
    moves = {**first_seen_moves, **{k: v for k, v in aliases.items() if k not in first_seen_moves}}
    move_keys(ROOT + "/src/data/productFirstSeen.json", moves, False)
    move_keys(ROOT + "/src/data/productDominantColors.json", first_seen_moves, True)
    print("aplicado")
