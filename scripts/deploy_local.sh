#!/usr/bin/env bash
# Publica main en el servidor de esta PC (desde 2026-09-29 el sitio se sirve
# desde acá por un túnel de Cloudflare; Vercel pausó la cuenta Hobby).
#
# Dos copias, fc-prod-a y fc-prod-b, y ~/fc-prod es un enlace a la que está
# en uso: se compila en la otra y se cambia el enlace. Compilar encima de la
# que está sirviendo deja el sitio devolviendo 500 durante el build.
set -euo pipefail
export XDG_RUNTIME_DIR="/run/user/$(id -u)"
cd "$HOME"
CUR=$(readlink -f fc-prod)
NEW="$HOME/fc-prod-a"; [ "$CUR" = "$NEW" ] && NEW="$HOME/fc-prod-b"

rm -rf "$NEW"
git clone -q --branch main /home/piojo/football-cult "$NEW"
cd "$NEW"
# Solo las variables que el código del sitio lee (más las AUTH_* que next-auth
# lee por su cuenta). .env.local tiene además las claves de minería (Awin,
# eBay, Amazon, Telegram...) y no tienen por qué vivir en un proceso público.
keys=$( (grep -rhoE "process\.env\.[A-Z_0-9]+" src | sed 's/process\.env\.//'; \
         printf '%s\n' AUTH_SECRET AUTH_GOOGLE_ID AUTH_GOOGLE_SECRET AUTH_TRUST_HOST) | sort -u | paste -sd'|')
grep -E "^($keys)=" /home/piojo/football-cult/.env.local > .env.local
npm ci --no-audit --no-fund --silent
NODE_OPTIONS=--max-old-space-size=8192 npx next build > build.log 2>&1 || { tail -30 build.log; exit 1; }

cd "$HOME"
ln -sfn "$NEW" fc-prod.tmp && mv -T fc-prod.tmp fc-prod
systemctl --user restart fc-web
sleep 8
code=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3100/es)
if [ "$code" != "200" ]; then
  echo "el build nuevo responde $code: vuelvo al anterior ($CUR)"
  ln -sfn "$CUR" fc-prod.tmp && mv -T fc-prod.tmp fc-prod
  systemctl --user restart fc-web
  exit 1
fi
echo "publicado $(git -C "$NEW" log --oneline -1)"
