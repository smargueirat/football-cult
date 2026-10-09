#!/usr/bin/env bash
# Tanda 3 (2026-10-09): cobertura y limpieza del catálogo. Regenera los datos
# partiendo del main actual; idempotente (cada paso es el mismo que corre cada
# noche desde ahora, así que repetirlo solo adelanta un día el resultado).
#
#  1. Camisetas de Futbol Emotion (mine_futbolemotion_jerseys.py): adulto, niño,
#     mujer y versión jugador; sincroniza TeamKey con los 23 clubes nuevos de
#     productMeta.ts. Luego refresh_offers.py pone precio/tallas/stock de hoy.
#  2. Botas de Forum Sport (mine_boots.py -> refresh_boots.py).
#  3. Equipamiento: el mismo artículo en dos fichas se funde (refresh_gear.py,
#     alias 308 en gearAliases.json); además ya no borra una tienda si su feed
#     falta o viene cortado.
#  4. Camisetas agotadas 14+ días y sin clics: fuera, con 308 (seo_redirects.py).
#
# Necesita los feeds del scan de hoy en /tmp/feeds. Los pasos 2 y 3 tardan
# ~10 min (extracción de color de las fotos nuevas y minería de equipamiento).
#
# Uso, en la raíz del checkout:  bash scripts/fixes/tanda3_catalogo.sh
set -euo pipefail
cd "$(dirname "$0")/../.."

for f in futbolemotion_feed.csv FORUMSPORT.csv FOOTSTORE_ES.csv FOOTSTORE_FR.csv SPORTISGOOD_ES.csv SPORTISGOOD_FR.csv ADIDAS_ES.csv; do
  [ -s "/tmp/feeds/$f" ] || { echo "Falta /tmp/feeds/$f: espera al scan de las 06:07 o bájalo antes (download_feeds.py)." >&2; exit 1; }
done
cifras() { NODE_OPTIONS=--max-old-space-size=6144 npx tsx scripts/fixes/tanda3_cifras.mts; }

echo "== antes"; cifras
echo "== 1. camisetas de Futbol Emotion"
python3 scripts/catalog-mining/mine_futbolemotion_jerseys.py --apply
python3 scripts/catalog-mining/refresh_offers.py --apply --no-net --only "Futbol Emotion" | tail -2
echo "== 2. botas (Forum Sport)"
python3 scripts/boots-mining/refresh_boots.py 2>&1 | grep -E "ForumSport|ABORT|WARNING|^(total|new|products|existing|legacy|fichas)" || true
echo "== 3. equipamiento"
python3 scripts/gear-mining/refresh_gear.py 2>&1 | grep -E "SALTADA|fundidas|^total" || true
python3 scripts/gear-mining/check_gear_ids.py
echo "== 4. camisetas agotadas"
SOLD_OUT_ALLOW_DIRTY=1 python3 scripts/fixes/seo_redirects.py | head -1
echo "== después"; cifras

flock /tmp/fc-tsc.lock env NODE_OPTIONS=--max-old-space-size=6144 npx tsc --noEmit
node -e '
  const src = require("fs").readFileSync("src/data/products.ts", "utf8");
  const ids = [...src.slice(src.indexOf("const productsData = [")).matchAll(/^\s*id:\s*"([^"]+)",/gm)].map((m) => m[1]);
  if (new Set(ids).size !== ids.length) { console.error("ids duplicados"); process.exit(1); }
  console.log("tsc OK, ids únicos:", ids.length);'
echo "Listo. Revisa git diff --stat y commitea src/data + scripts/gear-mining/gear_ids.json."
