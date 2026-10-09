#!/usr/bin/env bash
# Alertas de precio semanales (crontab: lunes 11:00, salida a scripts/check_prices.log).
# Antes hacía curl a /api/cron/check-prices: el trabajo corría dentro del proceso
# web y nunca terminaba en los 300 s del curl. Ahora es un script aparte que solo
# mira los productos con suscriptores (ver check_price_alerts.mts).
#   scripts/cron_check_prices.sh --dry-run   # ensayo: no envía ni escribe nada
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1
echo "[$(date -u +%FT%TZ)] start $*"
timeout 600 npx --yes tsx scripts/check_price_alerts.mts "$@"
rc=$?
[ "$rc" -eq 124 ] && echo "timeout (600 s)"
echo "[$(date -u +%FT%TZ)] end exit=$rc"
exit "$rc"
