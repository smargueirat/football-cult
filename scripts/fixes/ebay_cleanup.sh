#!/usr/bin/env bash
# Limpieza eBay de una vez (2026-10-09), sobre los datos del main actual:
#   1. ebay_check_stale.py: propaga "muerto" a todas las copias de un id
#      (eBay/ES/IT/GB) y revisa con la Browse API lo que quepa en la cuota
#      de hoy, dejando RESERVE llamadas para la minería de esta noche (que
#      cae en la misma ventana: eBay reinicia la cuota a las 07:00 UTC) y
#      para /api/ebay-shipping.
#   2. dedupe_same_url.py --apply: una fila por anuncio dentro de cada ficha
#      y cada anuncio en una sola ficha (los "DUDOSO" quedan en
#      /tmp/ebay_cleanup_dudosos.txt para revisarlos).
# Imprime cifras antes/después y cuántos días tarda la rotación completa.
# No hace commit. Idempotente: repetirlo no cambia nada salvo que sigue la
# rotación (gasta cuota).
# Uso: scripts/fixes/ebay_cleanup.sh [RESERVE=2500] [MAX_LLAMADAS=4000]
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/../.."
RESERVE="${1:-2500}"
MAX="${2:-4000}"
M=scripts/catalog-mining

stats() {
  python3 - <<'EOF'
import re, collections
src = open("src/data/products.ts", encoding="utf-8").read()
rows = re.findall(r'\{ store: "(eBay(?: [A-Z]{2})?)", [^\n]*?/itm/(\d+)[^\n]*?inStock: (true|false)', src)
ids = collections.defaultdict(set)
for s, i, st in rows: ids[i].add(st)
live = collections.Counter(s for s, _, st in rows if st == "true")
zombies = sum(1 for v in ids.values() if v == {"true", "false"})
print(f"  filas eBay: {len(rows)}  anuncios únicos: {len(ids)}  filas redundantes: {len(rows) - len(ids)}")
print(f"  filas en stock por sitio: {dict(live)}  ids vivos y muertos a la vez: {zombies}")
EOF
}

echo "== ANTES"; stats
echo "== 1. revisión de anuncios muertos (reserva $RESERVE llamadas)"
python3 -u $M/ebay_check_stale.py "$MAX" --reserve "$RESERVE" | grep -v '^  unknown' \
  || echo "  la revisión falló (¿OAuth/red?); sigo con el deduplicado"
echo "== 2. deduplicado"
python3 $M/dedupe_same_url.py --apply | tee /tmp/ebay_cleanup_dedupe.txt | tail -4
grep '^DUDOSO' /tmp/ebay_cleanup_dedupe.txt > /tmp/ebay_cleanup_dudosos.txt || true
echo "  dudosos (decididos por mejor coincidencia): $(wc -l < /tmp/ebay_cleanup_dudosos.txt), lista en /tmp/ebay_cleanup_dudosos.txt"
echo "== DESPUÉS"; stats

python3 - <<'EOF'
import json
s = json.load(open("scripts/catalog-mining/ebay_stale_check_state.json")).get("last_run", {})
live, done = s.get("live_ids", 0), s.get("checked", 0)
print(f"== Rotación: {live} anuncios vivos; hoy revisados {done} ({s.get('dead', 0)} muertos).")
for per_night in (2000, 3000):
    print(f"   a {per_night} llamadas/noche (cuota 5000 - minería - sitio - reserva 600): ~{-(-live // per_night)} días por vuelta")
EOF
echo "Siguiente: npx tsc --noEmit, revisar /tmp/ebay_cleanup_dudosos.txt y commitear src/data/products.ts src/data/productAliases.ts $M/ebay_stale_check_state.json"
