#!/usr/bin/env python3
"""Avisa si hay clubes del catálogo sin liga en teamMeta.ts.

Un equipo que no figura en TEAM_LEAGUE se trata como selección nacional
(así está escrito en teamMeta.ts). Eso hace que un club nuevo se
clasifique mal EN SILENCIO: se queda sin aparecer en /liga/ ni /pais/ y
nadie se entera, porque su página /equipo/ sí existe.

No hace falta inventar una lista de selecciones: `teamCategory` en
src/lib/productMeta.ts ya dice club/national para cada equipo y cubre el
100% del catálogo. Cruzando las dos, un club sin liga salta solo.

Lo corre el scan nocturno (scripts/daily_scan.sh). Sale 1 si encuentra
algo, para que se vea en el log.
"""
import os
import re
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')

# Clubes que a propósito NO tienen liga, para no avisar todas las noches
# por algo ya decidido. Sacar de acá si alguna vez justifica su liga.
KNOWN_WITHOUT_LEAGUE = {
    # Una sola camiseta retro. Rusia no existe como selección en el
    # catálogo, así que crear "liga-rusia" dejaría un /pais/rusia vacío:
    # no compensa por un producto (2026-09-24).
    'rubinkazan',
}


def read(rel):
    with open(os.path.join(ROOT, rel), encoding='utf-8') as f:
        return f.read()


def entries(src, const_name):
    """Las claves de un `export const X = { ... };`. Cortar en el cierre
    importa: sin eso se arrastran los objetos que vienen después en el
    archivo (COUNTRY_ISO y compañía) y todo da falso positivo."""
    block = src.split(f'export const {const_name}')[1].split('\n};')[0]
    return {k.strip('"') for k, _ in re.findall(r'^\s*([A-Za-z0-9_"-]+):\s*"([^"]+)"', block, re.M)}


def main():
    category_block = read('src/lib/productMeta.ts').split('export const teamCategory')[1].split('\n};')[0]
    category = {k.strip('"'): v for k, v in
                re.findall(r'^\s*([A-Za-z0-9_"-]+):\s*"([a-z]+)"', category_block, re.M)}
    with_league = entries(read('src/data/teamMeta.ts'), 'TEAM_LEAGUE')
    in_catalog = set(re.findall(r'teamKey: "([^"]+)"', read('src/data/products.ts')))

    missing = sorted(t for t in in_catalog
                     if category.get(t) == 'club'
                     and t not in with_league
                     and t not in KNOWN_WITHOUT_LEAGUE)
    uncategorised = sorted(t for t in in_catalog if t not in category)

    for team in uncategorised:
        print(f'AVISO teamMeta: "{team}" no está en teamCategory (productMeta.ts), '
              f'no se puede saber si es club o selección')
    for team in missing:
        print(f'AVISO teamMeta: el club "{team}" no tiene liga en TEAM_LEAGUE '
              f'-> queda fuera de /liga/ y /pais/')
    if missing or uncategorised:
        print(f'AVISO teamMeta: {len(missing) + len(uncategorised)} equipo(s) a revisar '
              f'en src/data/teamMeta.ts')
        return 1
    print(f'teamMeta OK: {len(in_catalog)} equipos del catálogo, todos los clubes con liga')
    return 0


if __name__ == '__main__':
    sys.exit(main())
