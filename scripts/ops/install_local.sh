#!/usr/bin/env bash
# Instala en la Mini PC los scripts de operación (copia en ~/.local/lib/fc-ops,
# para que una edición o un checkout a medias del repo no rompa un cron en
# curso) y AÑADE sus entradas al crontab si faltan. No toca las existentes.
#   bash scripts/ops/install_local.sh      (re-ejecutar tras cambiar scripts/ops)
set -euo pipefail
L="$HOME/.local/lib/fc-ops"; S="$HOME/.local/state/fc-ops"
mkdir -p "$L" "$S"
cd "$(dirname "$0")"
install -m 755 watch_vm.sh backup.sh housekeeping.sh "$L/"
install -m 644 notify.mjs redis_dump.mjs logrotate.conf "$L/"

want=(
  "*/5 * * * * $L/watch_vm.sh >> $S/watch_vm.log 2>&1"
  "45 3 * * * $L/backup.sh >> $S/backup.log 2>&1"
  "15 5 * * * $L/housekeeping.sh >> $S/housekeeping.log 2>&1"
)
cur=$(crontab -l 2>/dev/null || true); add=""
for line in "${want[@]}"; do grep -qF "$line" <<<"$cur" || add+="$line"$'\n'; done
if [ -n "$add" ]; then
  printf '%s\n# fc-ops (scripts/ops/install_local.sh)\n%s' "$cur" "$add" | crontab -
  echo "crontab: añadidas $(grep -c . <<<"$add") entradas"
else
  echo "crontab: ya estaba todo"
fi
