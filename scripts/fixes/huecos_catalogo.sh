#!/usr/bin/env bash
# Huecos de catálogo (2026-10-18). Regenera los datos partiendo del main actual;
# idempotente (cada paso es el mismo que corre cada noche o se salta lo ya hecho).
#
#  1. Futbol Emotion (mine_futbolemotion_jerseys.py): los colorways que se saltaban
#     porque su ficha "ya tenía esa variante" (pre-match Away junto al Home, training
#     de otro color, portero 2ª/3ª...) entran como oferta de la ficha si es el mismo
#     producto (mismo código de fabricante, o mismo rasgo + marca + color) y como ficha
#     nueva si es otro colorway. + Genoa ("Kappa Genova"), LAFC ("adidas Los Angeles"),
#     Strasbourg ("adidas Rc Strasbourg"). Luego refresh_offers.py pone precio/tallas.
#  2. Temporada de un solo año ("2025", "2026") en ligas de temporada partida ->
#     "2025/26" / "2026/27" según los títulos; fundidas con su gemela, id viejo = alias
#     (fix_single_year_seasons.py, como cremonese-home-2025 -> cremonese-home-202526).
#  3. Color dominante de las fichas nuevas y fechas de alta (first_seen.py).
#
# Necesita el feed de Futbol Emotion de hoy en /tmp/feeds (daily_refresh.sh lo baja).
# Uso, en la raíz del checkout:  bash scripts/fixes/huecos_catalogo.sh
set -euo pipefail
cd "$(dirname "$0")/../.."

[ -s /tmp/feeds/futbolemotion_feed.csv ] || { echo "Falta /tmp/feeds/futbolemotion_feed.csv: python3 scripts/catalog-mining/download_feeds.py futbolemotion_feed" >&2; exit 1; }
cifras() { NODE_OPTIONS=--max-old-space-size=6144 npx tsx scripts/fixes/huecos_cifras.mts; }

echo "== antes"; cifras
echo "== 1. Futbol Emotion"
python3 scripts/catalog-mining/mine_futbolemotion_jerseys.py --apply
python3 scripts/catalog-mining/refresh_offers.py --apply --no-net --only "Futbol Emotion" | tail -2
echo "== 2. temporadas sueltas"
python3 scripts/catalog-mining/fix_single_year_seasons.py --apply
echo "== 3. colores y fechas"
node scripts/catalog-mining/extract_dominant_colors.mjs 2>&1 | tail -2
python3 scripts/catalog-mining/first_seen.py 2>&1 | tail -2
echo "== después"; cifras

flock /tmp/fc-tsc.lock env NODE_OPTIONS=--max-old-space-size=6144 npx tsc --noEmit
node -e '
  const src = require("fs").readFileSync("src/data/products.ts", "utf8");
  const ids = [...src.slice(src.indexOf("const productsData = [")).matchAll(/^\s*id:\s*"([^"]+)",/gm)].map((m) => m[1]);
  if (new Set(ids).size !== ids.length) { console.error("ids duplicados"); process.exit(1); }
  console.log("tsc OK, ids únicos:", ids.length);'
echo "Listo. Revisa el diff de src/data y commitea."
