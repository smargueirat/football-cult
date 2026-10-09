#!/usr/bin/env bash
# Refresco determinista, SIN LLM (2026-10-09): precios, stock y tallas de
# camisetas, botas y equipamiento contra los feeds de hoy.
#
# Por qué: hasta hoy todo el refresco vivía dentro de `claude -p` en
# daily_scan.sh, y si Claude no arrancaba (OAuth caducado, límite semanal, Bash
# caído: 16 de 62 noches) el catálogo no se movía. daily_scan.sh lo llama ANTES
# de Claude; Claude queda para la minería de productos nuevos.
#
# Cada paso es independiente: si uno falla, los demás siguen, y nada que no pase
# su propia guarda se escribe (feed truncado o no descargado hoy -> esa tienda
# no se toca; refresh_boots.py aborta solo si falta una tienda entera).
# Al final commitea y empuja SOLO sus archivos, tras tsc + ids duplicados.
#
# Uso: scripts/daily_refresh.sh            (lo que corre el cron)
#      NO_DOWNLOAD=1 NO_COMMIT=1 scripts/daily_refresh.sh   (prueba local)
set -uo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

echo "=== $(date -u +%Y-%m-%dT%H:%M:%SZ) daily refresh start ==="
[[ -n "${NO_DOWNLOAD:-}" ]] || python3 -u scripts/catalog-mining/download_feeds.py
python3 -u scripts/catalog-mining/refresh_offers.py --apply
# Camisetas nuevas de Futbol Emotion (2026-10-09): mismo feed y misma guarda;
# solo añade ofertas/fichas, el precio y stock de mañana los pone refresh_offers.
python3 -u scripts/catalog-mining/mine_futbolemotion_jerseys.py --apply
python3 -u scripts/boots-mining/refresh_boots.py 2>&1 | grep -E "WARNING|ABORT|Error|===|^(total|new|products|existing|legacy|fichas)" || true
python3 -u scripts/gear-mining/refresh_gear.py 2>&1 | tail -8
if ! python3 scripts/gear-mining/check_gear_ids.py; then
  echo "check_gear_ids FALLÓ: se descartan los cambios de equipamiento de hoy"
  git checkout -- src/data/gloves.ts src/data/balls.ts src/data/apparel.ts src/data/training.ts scripts/gear-mining/gear_ids.json 2>/dev/null
fi

FILES=(src/data/products.ts src/data/boots.ts src/data/bootTierData.json src/data/bootDominantColors.json
       src/data/bootAliases.json src/data/gloves.ts src/data/balls.ts src/data/apparel.ts src/data/training.ts
       src/data/gearAliases.json scripts/gear-mining/gear_ids.json)
if [[ -n "${NO_COMMIT:-}" ]] || git diff --quiet -- "${FILES[@]}"; then
  echo "=== daily refresh end (sin commit) ==="
  exit 0
fi
# Misma verificación que la red de seguridad de daily_scan.sh.
if NODE_OPTIONS=--max-old-space-size=6144 npx tsc --noEmit && node -e '
    const src = require("fs").readFileSync("src/data/products.ts", "utf8");
    const ids = [...src.slice(src.indexOf("const productsData = [")).matchAll(/^\s*id:\s*"([^"]+)",/gm)].map((m) => m[1]);
    if (new Set(ids).size !== ids.length) { console.error("ids duplicados"); process.exit(1); }'; then
  git add -- "${FILES[@]}"
  git commit -q -m "chore(refresco): precios y stock desde los feeds ($(date -u +%Y-%m-%d))

Paso determinista sin LLM (scripts/daily_refresh.sh)." && git push -q origin "$(git branch --show-current)"
  echo "=== daily refresh end (commit $(git rev-parse --short HEAD)) ==="
else
  echo "=== daily refresh: FALLÓ la verificación, se descartan sus cambios ==="
  git checkout -- "${FILES[@]}"
fi
