#!/usr/bin/env python3
"""Fecha en que cada ficha de camiseta apareció en el catálogo.

Para /novedades: cuando sale una camiseta nueva hay un pico de búsqueda
previsible ("nueva camiseta del X, precio, dónde comprar"), y el escaneo
nocturno ya la suma en menos de 24 horas. Lo que faltaba es una página que
Google revisite seguido y que enlace a esas fichas nuevas apenas existen.

Por qué git y no priceHistory.json: la historia de precios está indexada por
URL de oferta, y las URLs de Awin (pclick.php?p=) cambian entre descargas del
feed, así que su "primera fecha" se reinicia sola -- probado el 2026-09-28,
daba 749 camisetas "nuevas" en 14 días, que es falso. El id de la ficha, en
cambio, es estable, y git guarda cada versión de products.ts.

Primera corrida: recorre una versión por día de los últimos 45 días y asigna a
cada id la fecha de la versión más vieja que lo contiene. Después: solo suma
los ids nuevos con la fecha de hoy y borra los que ya no existen.

Uso: python3 first_seen.py
"""
import datetime, json, os, re, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
PRODUCTS = "src/data/products.ts"
OUT = os.path.join(ROOT, "src", "data", "productFirstSeen.json")
ID_RE = re.compile(r'^\s*id:\s*"([^"]+)",', re.M)


def ids_in(text):
    start = text.find("const productsData = [")
    return set(ID_RE.findall(text[start:] if start >= 0 else text))


def bootstrap():
    log = subprocess.run(
        ["git", "log", "--since=45 days ago", "--format=%H %cs", "--", PRODUCTS],
        cwd=ROOT, capture_output=True, text=True, check=True,
    ).stdout.split("\n")
    # Una versión por día: la última de cada día (git log va de nueva a vieja).
    per_day = {}
    for line in log:
        if line.strip():
            sha, day = line.split()
            per_day.setdefault(day, sha)
    seen = {}
    for day in sorted(per_day):  # de la más vieja a la más nueva
        text = subprocess.run(
            ["git", "show", f"{per_day[day]}:{PRODUCTS}"],
            cwd=ROOT, capture_output=True, text=True,
        ).stdout
        for pid in ids_in(text):
            seen.setdefault(pid, day)
    return seen, min(per_day) if per_day else None


def main():
    today = datetime.date.today().isoformat()
    current = ids_in(open(os.path.join(ROOT, PRODUCTS), encoding="utf-8").read())
    if os.path.exists(OUT):
        data = json.load(open(OUT, encoding="utf-8"))
    else:
        data, oldest = bootstrap()
        print(f"arranque desde git: {len(data)} ids, la versión más vieja es del {oldest}")
    added = 0
    for pid in current:
        if pid not in data:
            data[pid] = today
            added += 1
    data = {k: v for k, v in data.items() if k in current}
    json.dump(dict(sorted(data.items())), open(OUT, "w", encoding="utf-8"), indent=0)
    print(f"fichas con fecha de alta: {len(data)} | nuevas hoy: {added}")


if __name__ == "__main__":
    main()
