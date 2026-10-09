#!/usr/bin/env python3
"""Clics /go/ de personas: por día, sección, tienda, idioma y país.

Uso: scripts/clicks_report.py [desde YYYY-MM-DD] [--ejemplos]
Lee CLICK_LOG_DIR (por omisión /home/piojo/fc-data/clicks/*.jsonl).

Quién cuenta como persona:
- Filas desde el 2026-10-09 (traen `h`): lo que decidió /go/ en vivo
  (src/lib/goOut.ts: cabeceras de navegador, ráfagas por subred, ráfaga
  global sin marca de clic j=1).
- Filas anteriores (sin cabeceras ni IP): estimación offline. Robot si el UA
  lo dice, si cae en una ráfaga global (>= RAFAGA clics en +-30 min; el
  tráfico humano visto es de pocos clics por día) o si el mismo producto se
  pidió en <10 min con otro idioma u otro navegador (los robots rotan ambos).
Las filas nuevas que /go/ dio por personas pero caen en ráfaga se cuentan
aparte ("dudosas"): si crecen, el filtro en vivo se está quedando corto.
"""
import bisect, collections, glob, json, os, sys
from datetime import datetime

D = os.environ.get("CLICK_LOG_DIR", "/home/piojo/fc-data/clicks")
RAFAGA = 20
SECCION = {"j": "camiseta", "b": "botas", "g": "guantes", "p": "pelotas", "a": "ropa", "e": "entrenamiento", "t": "tickets"}

args = [a for a in sys.argv[1:] if not a.startswith("--")]
since = args[0] if args else ""
rows = []
for f in sorted(glob.glob(D + "/*.jsonl")):
    for line in open(f, encoding="utf-8"):
        try:
            r = json.loads(line)
        except ValueError:
            continue
        if r.get("t", "") >= since:
            rows.append(r)
rows.sort(key=lambda r: r["t"])
ts = [datetime.fromisoformat(r["t"].replace("Z", "+00:00")).timestamp() for r in rows]

burst = [bisect.bisect_right(ts, t + 1800) - bisect.bisect_left(ts, t - 1800) >= RAFAGA for t in ts]
rot = set()
by_p = collections.defaultdict(list)
for i, r in enumerate(rows):
    for j in reversed(by_p[r.get("p")]):
        if ts[i] - ts[j] >= 600:
            break
        if rows[j].get("l") != r.get("l") or rows[j].get("ua") != r.get("ua"):
            rot.update((i, j))
    by_p[r.get("p")].append(i)


def offline(i):
    r = rows[i]
    if r.get("ua") in ("bot", "unknown"):
        return "ua"
    if burst[i]:
        return "ráfaga"
    if i in rot:
        return "rotación"
    return None


human, dudosas, why = [], 0, collections.Counter()
for i, r in enumerate(rows):
    if "h" in r:
        if not r["h"]:
            why["vivo:" + str(r.get("bot"))] += 1
            continue
        if offline(i) == "ráfaga":
            dudosas += 1
        human.append(r)
    else:
        w = offline(i)
        if w:
            why["histórico:" + w] += 1
            continue
        human.append(r)

ok = [r for r in human if r.get("ok")]
ms8 = sum(1 for r in human if r["t"][20:21] == "8")
print(f"clics totales {len(rows)} | personas {len(human)} ({len(ok)} con oferta resuelta) | robots {len(rows) - len(human)}")
print("motivos de robot: " + ", ".join(f"{k} {n}" for k, n in why.most_common()))
print(f"personas en vivo dentro de una ráfaga (dudosas): {dudosas}")
print(f"personas con j=1 (tocaron el enlace): {sum(1 for r in human if r.get('j'))} de {sum(1 for r in human if 'h' in r)} filas nuevas")
if human:
    print(f"milisegundos en 800-899: {ms8 / len(human):.0%} de las personas (al azar ~10%; los robots, ~30-75%)")

for title, key in [
    ("día", lambda r: r["t"][:10]),
    ("sección", lambda r: SECCION.get(r.get("k"), r.get("k", "?"))),
    ("tienda", lambda r: r.get("s") or "(sin resolver)"),
    ("idioma", lambda r: r.get("l", "?")),
    ("país", lambda r: r.get("cc", "(sin dato: antes del 09-10)")),
    ("dispositivo", lambda r: r.get("ua", "?")),
]:
    print(f"\n-- por {title}")
    c = collections.Counter(key(r) for r in human)
    for k, n in (sorted(c.items()) if title == "día" else c.most_common(15)):
        print(f"{n:5d}  {k}")

if "--ejemplos" in sys.argv:
    print("\n-- ejemplos de personas")
    for r in human[-15:]:
        print(" ", r["t"], r.get("ua"), r.get("l"), r.get("cc", ""), r.get("p"), r.get("s"))
    print("\n-- ejemplos de robots")
    for i in range(0, len(rows), max(1, len(rows) // 15)):
        r = rows[i]
        if r not in human:
            print(" ", r["t"], r.get("ua"), r.get("l"), r.get("p"), r.get("s"), r.get("bot") or offline(i))
