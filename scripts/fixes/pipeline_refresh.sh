#!/usr/bin/env bash
# Limpieza única de ofertas fantasma de camisetas (tanda 2, 2026-10-09).
# Idempotente: aplica a src/data/products.ts del checkout actual el mismo
# refresco por oferta que desde hoy corre cada noche (refresh_offers.py):
# precio/stock/tallas de hoy y inStock:false para lo que ya no está en el feed.
# Si los feeds de /tmp/feeds no son de hoy (<20 h), los baja antes.
# No commitea: revisa `git diff --stat src/data/products.ts` y commitea tú.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/../.."
if [[ -z "$(find /tmp/feeds/FOOTSTORE_ES.csv -mmin -1200 2>/dev/null)" ]]; then
  python3 -u scripts/catalog-mining/download_feeds.py
fi
python3 -u scripts/catalog-mining/refresh_offers.py --apply
git diff --stat -- src/data/products.ts
