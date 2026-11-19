#!/usr/bin/env bash
# Si la PC estuvo apagada a las 6:07 (UTC) y hoy no arrancó el scan, lo corre al volver.
# Cron: @reboot sleep 300 && /home/piojo/football-cult/scripts/scan_catchup.sh
cd /home/piojo/football-cult || exit 1
LOG=scripts/daily_scan.log
[ "$(date -u +%H)" -lt 7 ] && exit 0   # antes de las 7 UTC lo corre el cron normal
grep -q "^=== $(date -u +%F)T.* daily scan start" "$LOG" && exit 0
exec flock -n /tmp/fc-scan-catchup.lock bash scripts/daily_scan.sh >> "$LOG" 2>&1
