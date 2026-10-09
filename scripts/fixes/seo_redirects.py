#!/usr/bin/env python3
"""Redirecciones 308 para las fichas de equipamiento que murieron sin alias.

    python3 scripts/fixes/seo_redirects.py          # escribe los alias
    python3 scripts/fixes/seo_redirects.py --dry    # solo cuenta

Revisión SEO 2026-10-08 (H11): de las ~9.000 ids de ropa retiradas desde el
24-09 (el proveedor cambió de CDN y de idioma a la vez y el id salía del
texto), solo 289 tenían entrada en gearAliases.json; el resto daba 404 y
Google las sigue pidiendo (estaban en los sitemaps de 09-24 a 10-02).

Fuente de las URLs viejas: TODAS las versiones de src/data/{apparel,gloves,
balls,training,boots}.ts en el historial de git -- los sitemaps se generaban
de esos mismos archivos, así que ahí está cada id que alguna vez se publicó.

Para cada id muerto sin alias (o con un alias cuyo destino también murió):
  1. la ficha viva que hoy tiene alguna de sus mismas URLs de oferta,
  2. la que tiene la misma foto (nombre de archivo del fabricante: la clave
     estable de scripts/gear-mining/gear_ids.json),
  3. y si no queda equivalente, el hub más cercano que exista hoy:
     tipo (ropa/entrenamiento) > marca+terreno (botas) > marca > terreno >
     la sección. Un valor que empieza por "/" es una ruta (ver
     src/lib/gearAliases.ts y botas/[id]/page.tsx).

Idempotente: nunca toca un alias que ya apunta a una ficha viva ni crea alias
de un id vivo. Lo que escribe lo conserva refresh_gear.py/refresh_boots.py
(sus update_aliases son acumulativos).
"""
import json
import os
import re
import subprocess
import sys
import unicodedata
import urllib.parse
from collections import Counter

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
DRY = "--dry" in sys.argv
SECTIONS = [  # sección URL, archivo de datos
    ("ropa", "apparel"),
    ("entrenamiento", "training"),
    ("guantes", "gloves"),
    ("pelotas", "balls"),
    ("botas", "boots"),
]
GEAR_ALIASES = os.path.join(REPO, "src", "data", "gearAliases.json")
BOOT_ALIASES = os.path.join(REPO, "src", "data", "bootAliases.json")
GEAR_IDS = os.path.join(REPO, "scripts", "gear-mining", "gear_ids.json")
GROUNDS = {"FG", "AG", "SG", "MG", "TF", "FG/AG"}  # GROUND_CODES de gearHubs.ts
# MIN_HUB_ITEMS es 6 en gearHubs.ts; con margen, para no apuntar a un hub que
# por una ficha de menos dé 404 tras el scan de mañana.
MIN_HUB = 8

ENTRY = re.compile(r'\n  \{\n    id: "([^"]+)"(.*?)(?=\n  \{\n    id: "|\n\];|\Z)', re.S)


def git(*args):
    return subprocess.run(["git", "-C", REPO, *args], capture_output=True, text=True, check=True).stdout


def slugify(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def photo_key(url):
    """Mismo criterio que refresh_gear.photo_keys / mine_gear._img_key."""
    m = re.search(r"url=([^&\"]+)", url)
    raw = urllib.parse.unquote(m.group(1)) if m else url
    base = os.path.splitext(os.path.basename(raw.split("?")[0]))[0].lower()
    return base if len(base) >= 6 else None


def field(body, name):
    m = re.search(rf'\n    {name}: "([^"]*)"', body)
    return m.group(1) if m else None


def parse(src):
    out = {}
    for m in ENTRY.finditer(src):
        pid, body = m.group(1), m.group(2)
        if pid in out:
            continue
        out[pid] = {
            "brand": field(body, "brand") or "",
            "type": field(body, "type"),
            "ground": field(body, "groundType"),
            "urls": set(re.findall(r'url: "([^"]+)"', body)),
            "photos": {k for k in (photo_key(u) for u in re.findall(r'imageUrl: "([^"]+)"', body)) if k},
        }
    return out


def main():
    gear_aliases = json.load(open(GEAR_ALIASES, encoding="utf-8"))
    boot_aliases = json.load(open(BOOT_ALIASES, encoding="utf-8"))
    registry = json.load(open(GEAR_IDS, encoding="utf-8")) if os.path.exists(GEAR_IDS) else {}
    report = []
    for section, fname in SECTIONS:
        path = f"src/data/{fname}.ts"
        current = parse(open(os.path.join(REPO, path), encoding="utf-8").read())
        live = {k for k, v in current.items() if v["urls"]}
        history = {}
        for commit in git("log", "--format=%H", "--", path).split():
            try:
                old = parse(git("show", f"{commit}:{path}"))
            except subprocess.CalledProcessError:
                continue
            for k, v in old.items():
                history.setdefault(k, v)

        aliases = boot_aliases if section == "botas" else gear_aliases.setdefault(section, {})
        url_to_id = {u: k for k in live for u in current[k]["urls"]}
        photo_to_id = {p: k for k in live for p in current[k]["photos"]}
        for p, k in registry.get(section, {}).items():
            if k in live:
                photo_to_id.setdefault(p.lower(), k)

        brands = Counter(slugify(current[k]["brand"]) for k in live)
        types = Counter(current[k]["type"] for k in live if current[k]["type"])
        grounds = Counter(current[k]["ground"] for k in live if current[k]["ground"] in GROUNDS)
        combos = Counter((slugify(current[k]["brand"]), current[k]["ground"]) for k in live if current[k]["ground"] in GROUNDS)

        def hub(v):
            b, t, g = slugify(v["brand"]), v["type"], v["ground"]
            if section in ("ropa", "entrenamiento") and t and types[t] >= MIN_HUB:
                return f"/{section}/tipo/{t}"
            if section == "botas" and g in GROUNDS and combos[(b, g)] >= MIN_HUB:
                return f"/botas/marca/{b}/{g.lower().replace('/', '-')}"
            if b and brands[b] >= MIN_HUB:
                return f"/{section}/marca/{b}"
            if section == "botas" and g in GROUNDS and grounds[g] >= MIN_HUB:
                return f"/botas/terreno/{g.lower().replace('/', '-')}"
            return f"/{section}"

        dead = [k for k in history if k not in live]
        before = sum(1 for k in dead if not (aliases.get(k, "").startswith("/") or aliases.get(k) in live))
        stats = Counter()
        for k in dead:
            cur = aliases.get(k)
            if cur and (cur.startswith("/") or cur in live):
                stats["ya"] += 1
                continue
            v = history[k]
            target = next((url_to_id[u] for u in v["urls"] if u in url_to_id), None)
            how = "url"
            if not target:
                target = next((photo_to_id[p] for p in v["photos"] if p in photo_to_id), None)
                how = "foto"
            if not target:
                target, how = hub(v), "hub"
            aliases[k] = target
            stats[how] += 1
        # Ningún alias de un id vivo (lo exige la página y update_aliases).
        for k in [k for k in aliases if k in live]:
            del aliases[k]
        report.append(
            f"{section}: {len(history)} ids en el historial, {len(dead)} retirados; sin redirección antes {before}, "
            f"después 0 (ya tenían {stats['ya']}, nuevos: {stats['url']} misma oferta, {stats['foto']} misma foto, {stats['hub']} al hub)"
        )

    print("\n".join(report))
    if DRY:
        return
    gear_aliases = {s: dict(sorted(m.items())) for s, m in sorted(gear_aliases.items())}
    with open(GEAR_ALIASES, "w", encoding="utf-8") as f:
        json.dump(gear_aliases, f, ensure_ascii=False, indent=0)
    with open(BOOT_ALIASES, "w", encoding="utf-8") as f:
        json.dump(dict(sorted(boot_aliases.items())), f, ensure_ascii=False, indent=0)


if __name__ == "__main__":
    main()
