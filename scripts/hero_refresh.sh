#!/usr/bin/env bash
# Rotación quincenal de las fotos del banner de la home (crontab: lunes 12:00 Europe/Madrid;
# corre solo las semanas ISO pares). Reemplaza a la rutina en la nube, que trabajaba sobre
# v2-preview y no podía publicar: el sitio se sirve desde esta PC.
set -uo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
[[ "${1:-}" == "--force" ]] || (( 10#$(date +%V) % 2 == 0 )) || exit 0
echo "=== $(date -u +%Y-%m-%dT%H:%M:%SZ) hero refresh start ==="

# No pisarse con el escaneo diario (comparte el checkout y commitea products.ts).
for _ in $(seq 1 24); do pgrep -f daily_scan.sh >/dev/null || break; sleep 300; done
pgrep -f daily_scan.sh >/dev/null && { echo "daily scan sigue corriendo, salto esta vez"; exit 0; }

BEFORE="$(git rev-parse HEAD)"
OUT="$(/home/piojo/.local/bin/claude -p "$(cat scripts/hero_refresh_prompt.md)" \
  --permission-mode auto --output-format text --no-session-persistence 2>&1)"
echo "$OUT" | tail -40

if [[ "$(git rev-parse HEAD)" != "$BEFORE" ]] && git log --format=%s "$BEFORE"..HEAD | grep -q '^chore(hero)'; then
  scripts/deploy_local.sh 2>&1 | tail -3
  subject="Banner de la home: fotos rotadas"
else
  subject="Banner de la home: sin cambios esta vez"
fi
api_key="$(grep '^RESEND_API_KEY=' .env.local | cut -d= -f2-)"
to="$(grep '^REPORT_EMAIL_TO=' .env.local | cut -d= -f2-)"
[[ -n "$api_key" && -n "$to" ]] && curl -s -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer $api_key" -H "Content-Type: application/json" \
  -d "$(node -e "console.log(JSON.stringify({from:'Football Cult <onboarding@resend.dev>', to: process.argv[1], subject: process.argv[2], text: process.argv[3]}))" "$to" "$subject" "$(echo "$OUT" | tail -60)")" >/dev/null
echo "=== $(date -u +%Y-%m-%dT%H:%M:%SZ) hero refresh end ==="
