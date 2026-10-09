#!/usr/bin/env bash
# Limpieza diaria (cron) de lo que crece sin límite, sin tocar datos útiles:
#  - logs de scripts/ y de fc-ops: rotan al pasar de 1 MB (4 copias .gz);
#  - /tmp (tmpfs, en RAM): caché de tsx de más de 7 días, feeds que nadie
#    refresca desde hace 14 días (el escaneo exige <24 h: ya no sirven) y
#    carpetas/archivos sueltos de este usuario sin tocar en 14 días.
#    Nunca toca /tmp/claude-*, tmux, systemd ni archivos ocultos.
H=$(cd "$(dirname "$0")" && pwd)
S="$HOME/.local/state/fc-ops"; mkdir -p "$S"
/usr/sbin/logrotate -s "$S/logrotate.state" "$H/logrotate.conf"
find /tmp/tsx-"$(id -u)" -type f -mtime +7 -delete 2>/dev/null
find /tmp/feeds -type f -mtime +14 -delete 2>/dev/null
find /tmp -mindepth 1 -maxdepth 1 -user "$(id -un)" -mtime +14 \
  ! -name feeds ! -name 'claude-*' ! -name 'tmux-*' ! -name 'tsx-*' ! -name '.*' \
  -exec rm -rf {} + 2>/dev/null
use=$(df --output=pcent / | tail -1 | tr -dc 0-9)
echo "$(date '+%F %T') disco / al $use%"
[ "$use" -ge 85 ] && timeout 60 node "$H/notify.mjs" "⚠️ Disco de la Mini PC al $use%" "Revisa .claude/worktrees, ~/.npm y la caché ISR de fc-prod-*."
exit 0
