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
import datetime
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


# ---------------------------------------------------------------- camisetas
# Fichas de camiseta con TODAS las ofertas agotadas (2026-10-09): ya no salen en
# listados, sitemap ni /indice y llevan noindex, pero la URL sigue viva por si el
# stock vuelve. Si llevan SOLD_OUT_DAYS días así y nadie hizo clic en ellas en
# CLICK_DAYS días, se retiran: fuera de products.ts y 308 a la ficha viva más
# parecida (mismo equipo, equipación y público; temporada más cercana) vía
# productAliases.ts. Sin equivalente, camiseta/[id]/page.tsx ya manda la URL
# retirada al hub del equipo.
# "Desde cuándo" vive en SOLD_OUT_STATE (no versionado, como offer_seen.json);
# la primera vez se siembra con la versión de products.ts de hace SOLD_OUT_DAYS
# días en git: si ya estaba agotada entonces, cuenta desde esa fecha.
PRODUCTS = os.path.join(REPO, "src", "data", "products.ts")
PRODUCT_ALIASES = os.path.join(REPO, "src", "data", "productAliases.ts")
SOLD_OUT_STATE = os.path.join(REPO, "scripts", "catalog-mining", "soldout_since.json")
SOLD_OUT_DAYS = int(os.environ.get("SOLD_OUT_DAYS", "14"))
CLICK_DAYS = 30
CLICK_DIR = os.environ.get("CLICK_LOG_DIR", "/home/piojo/fc-data/clicks")


def jersey_blocks(src):
    sys.path.insert(0, os.path.join(REPO, "scripts", "catalog-mining"))
    from refresh import split_blocks
    return split_blocks(src)


def jfield(block, name):
    m = re.search(rf'\n    {name}: "([^"]*)"', block)
    return m.group(1) if m else None


def sold_out_ids(blocks):
    return {jfield(b, "id"): b for b in blocks
            if "\n      { store: " in b and "inStock: true" not in b}


def clicked_jerseys(today):
    import glob
    cutoff = (today - datetime.timedelta(days=CLICK_DAYS)).isoformat()
    out = set()
    for f in glob.glob(os.path.join(CLICK_DIR, "*.jsonl")):
        for line in open(f, encoding="utf-8"):
            try:
                r = json.loads(line)
            except ValueError:
                continue
            if r.get("k") == "j" and r.get("ua") != "bot" and r.get("t", "") >= cutoff:
                out.add(r.get("p"))
    return out


def season_value(s):
    m = re.match(r"(\d{4})", s or "")
    return int(m.group(1)) if m else 0


def write_product_aliases(new, why, today):
    """Mismo formato que dedupe_same_url.write_aliases (ese módulo corre al
    importarlo): una clave ya presente se reapunta; nunca alias de alias."""
    s = open(PRODUCT_ALIASES, encoding="utf-8").read()
    marker = "export const PRODUCT_ID_ALIASES: Record<string, string> = {\n"
    old = {k for k in new if re.search(rf'^  "{re.escape(k)}": ', s, re.M)}
    for k in old:
        s = re.sub(rf'^(  "{re.escape(k)}": )"[^"]*",', lambda m: f'{m[1]}"{new[k]}",', s, flags=re.M)
    fresh = [k for k in new if k not in old]
    if fresh:
        s = s.replace(marker, marker + f"  // {today}: {why}\n" + "".join(f'  "{k}": "{new[k]}",\n' for k in fresh), 1)
    for k, v in new.items():
        s = s.replace(f': "{k}",', f': "{v}",')
    open(PRODUCT_ALIASES, "w", encoding="utf-8").write(s)


def retire_sold_out_jerseys():
    today = datetime.date.today()
    if subprocess.run(["git", "-C", REPO, "diff", "--quiet", "--", "src/data/products.ts"]).returncode:
        return "camisetas: products.ts tiene cambios sin commitear, no se retira nada hoy"
    head, blocks, tail = jersey_blocks(open(PRODUCTS, encoding="utf-8").read())
    sold = sold_out_ids(blocks)
    state = json.load(open(SOLD_OUT_STATE)) if os.path.exists(SOLD_OUT_STATE) else {}
    state = {k: v for k, v in state.items() if k in sold}  # volvió el stock: se reinicia
    unseeded = [k for k in sold if k not in state]
    if unseeded:
        then = (today - datetime.timedelta(days=SOLD_OUT_DAYS)).isoformat()
        rev = git("log", "--format=%H", f"--before={then}", "-1", "--", "src/data/products.ts").strip()
        old = set(sold_out_ids(jersey_blocks(git("show", f"{rev}:src/data/products.ts"))[1])) if rev else set()
        for k in unseeded:
            state[k] = then if k in old else today.isoformat()
    clicked = clicked_jerseys(today)
    due = [k for k in sold if (today - datetime.date.fromisoformat(state[k])).days >= SOLD_OUT_DAYS]
    retire = {k for k in due if k not in clicked}

    live = [b for b in blocks if "inStock: true" in b]
    # La equipación de una "retro" va en el id (kitOf en productMeta.ts).
    kit = lambda b: jfield(b, "typeKey") if jfield(b, "typeKey") != "retro" else \
        (re.search(r"-(home|away|third|goalkeeper|training|prematch)(?:-|$)", jfield(b, "id")) or [None, "retro"])[1]

    def twin(k):
        b = sold[k]
        team, age, y = jfield(b, "teamKey"), jfield(b, "ageGroup"), season_value(jfield(b, "season"))
        cands = [x for x in live if jfield(x, "teamKey") == team and kit(x) == kit(b) and jfield(x, "ageGroup") == age]
        cands.sort(key=lambda x: (abs(season_value(jfield(x, "season")) - y), -x.count("inStock: true")))
        return jfield(cands[0], "id") if cands else None

    aliases = {k: t for k in retire if (t := twin(k))}
    summary = (f"camisetas: {len(sold)} fichas agotadas, {len(due)} con >= {SOLD_OUT_DAYS} días, "
               f"retiradas {len(retire)} ({len(aliases)} -> ficha equivalente, {len(retire) - len(aliases)} -> hub del equipo), "
               f"con clics en {CLICK_DAYS} días (se quedan): {len(set(due) & clicked)}")
    if DRY:
        return summary
    json.dump({k: v for k, v in sorted(state.items()) if k not in retire}, open(SOLD_OUT_STATE, "w"), indent=0)
    if retire:
        open(PRODUCTS, "w", encoding="utf-8").write(head + "".join(b for b in blocks if jfield(b, "id") not in retire) + tail)
        if aliases:
            write_product_aliases(aliases, f"agotadas {SOLD_OUT_DAYS}+ días y sin clics, retiradas por\n"
                                  "  // scripts/fixes/seo_redirects.py; redirigen a la ficha viva más parecida.", today)
    return summary


def main():
    print(retire_sold_out_jerseys())
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
