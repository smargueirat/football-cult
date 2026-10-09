#!/usr/bin/env bash
# Datos visibles de la auditoría 2026-10-08 (calidad-datos.md F8/F9/F21,
# seo-tecnico.md H13). Idempotente: se puede correr en main las veces que haga
# falta; imprime las cifras antes y después.
#
#  1. Entradas: regenera src/data/tickets.ts con el minero corregido (sin
#     precios de relleno de Football TicketNet, sin NFL). Necesita los feeds
#     del scan en /tmp/feeds; si no están, lo deja para el scan nocturno.
#     Las fechas en el idioma de la página son código (ticketDate.ts), no datos.
#  2. Fichas de año suelto con gemela de temporada: dedupe_same_url.py --apply
#     (pasada 2) las funde y deja el alias en productAliases.ts.
#  3. Brighton/Burnley: no hay datos que corregir aquí; los trae la pasada
#     EBAY_GB nueva de ebay_mine_cycle.py en el scan nocturno.
#  4. Foto con marca de agua como principal: código (mainPhoto); la cifra
#     compara la regla vieja con la nueva sobre el catálogo actual.
#
# Uso: scripts/fixes/datos_visibles.sh            (aplica)
#      scripts/fixes/datos_visibles.sh --dry-run  (solo cifras)
set -euo pipefail
cd "$(dirname "$0")/../.."

cifras() {
  python3 - <<'PY'
import re, sys, statistics, collections
sys.path.insert(0, "scripts/catalog-mining")
from refresh import split_blocks
t = open("src/data/tickets.ts", encoding="utf-8").read()
ev = re.findall(r'competition: "([^"]*)",\n.*?\n    offers: \[\n(.*?)\n    \],', t, re.S)
uk = [float(m) for _, o in ev for m in re.findall(r'store: "FootballTicketNetUK", price: ([\d.]+)', o)]
med = statistics.median(uk) if uk else 0
fill = {p for p, n in collections.Counter(uk).items() if n >= 10 and p >= 5 * med}
bad = sum(1 for _, o in ev if any(float(p) in fill or float(p) / {"EUR": 1, "GBP": .86, "USD": 1.08}[c] >= 10000
                                   for p, c in re.findall(r'store: "FootballTicketNet\w+", price: ([\d.]+), currency: "(\w+)"', o)))
print(f"  entradas: {len(ev)} eventos | con precio de relleno: {bad} (valores {sorted(fill)}) | no fútbol: {sum(1 for c, _ in ev if re.match('nfl', c, re.I))}")
head, blocks, tail = split_blocks(open("src/data/products.ts", encoding="utf-8").read())
fld = lambda b, k: (re.search(rf'\n    {k}: "([^"]*)"', b) or [None, ""])[1]
cur = [b for b in blocks if fld(b, "teamKey") == "brighton" and fld(b, "season") in ("2025/26", "2026/27")]
print(f"  camisetas: {len(blocks)} fichas | Brighton: {sum(fld(b, 'teamKey') == 'brighton' for b in blocks)} fichas, {len(cur)} de 25/26-26/27")
PY
  python3 scripts/catalog-mining/dedupe_same_url.py | grep "año suelto" | sed 's/^/  /'
  npx tsx -e '
    import { products, productImage as antes } from "./src/data/products";
    import { productImage as ahora } from "./src/lib/productPhoto";
    import { hasWatermarkedPhotos } from "./src/lib/officialStores";
    const marcada = (u: string | undefined, p: (typeof products)[number]) => !!u && p.offers.some((o) => o.imageUrl === u && hasWatermarkedPhotos(o.store));
    const n = (f: typeof antes) => products.filter((p) => marcada(f(p), p) && p.offers.some((o) => o.imageUrl && !hasWatermarkedPhotos(o.store))).length;
    console.log(`  foto principal con marca de agua habiendo otra limpia: regla vieja ${n(antes)}, regla nueva ${n(ahora)} (fichas con foto de FansJerseyHub de principal en total: regla vieja ${products.filter((p) => marcada(antes(p), p)).length})`);
  '
}

echo "== ANTES =="
cifras
[ "${1:-}" = "--dry-run" ] && exit 0

if [ -s /tmp/feeds/TICKETNET_UK.csv ] && [ -s /tmp/feeds/TICKETNET_US.csv ]; then
  python3 scripts/tickets-mining/refresh_tickets.py | tail -4
else
  echo "AVISO: sin /tmp/feeds/TICKETNET_{UK,US}.csv; tickets.ts se corrige en el próximo scan nocturno"
fi
python3 scripts/catalog-mining/dedupe_same_url.py --apply | tail -2

echo "== DESPUÉS =="
cifras
