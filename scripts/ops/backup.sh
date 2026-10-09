#!/usr/bin/env bash
# Backup diario CIFRADO de lo que no está en GitHub, a la VM de Oracle
# (/home/opc/backups/fc-AAAA-MM-DD.tar.gz.enc, se guardan los 14 últimos).
# Clave: ~/.config/fc-backup.key (600, solo en la Mini PC: guárdala también en
# tu gestor de contraseñas o no podrás descifrar si muere el disco).
# Restaurar: ver scripts/ops/README.md. Si falla, avisa al móvil (notify.mjs).
set -euo pipefail
H=$(cd "$(dirname "$0")" && pwd)
REPO=/home/piojo/football-cult
KEY=$HOME/.config/fc-backup.key
V=opc@51.170.44.144; K=(-i "$HOME/.ssh/oracle_fc" -o BatchMode=yes -o ConnectTimeout=20 -o LogLevel=ERROR)
fail() { echo "$(date '+%F %T') backup FALLÓ (línea $1)"; timeout 60 node "$H/notify.mjs" "⚠️ Backup de football-cult falló" "backup.sh, línea $1. Mira ~/.local/state/fc-ops/backup.log en la Mini PC." || true; }
trap 'fail $LINENO' ERR
[ -s "$KEY" ] || { echo "falta $KEY"; false; }

W=$(mktemp -d); trap 'rm -rf "$W"' EXIT
name=fc-$(date +%F).tar.gz.enc

node "$H/redis_dump.mjs" dump > "$W/redis.json"
git -C "$REPO" bundle create --quiet "$W/repo.bundle" --all
# Archivos del repo que no están en git: estado de minería (mined_*.json,
# image_ok.json, boot_image_pairs.json...), logs, .env.local. Sin basura.
git -C "$REPO" ls-files -z --others --exclude-standard > "$W/l"
git -C "$REPO" ls-files -z --others --ignored --exclude-standard -- scripts data >> "$W/l"
tr '\0' '\n' < "$W/l" | grep -v -e __pycache__ -e '^\.claude/' -e '^\.rc-phone' -e '^bridge-transcript' -e '^latest$' | sort -u > "$W/repo-files.lst"

cd /
extra=(); for p in home/piojo/.oci home/piojo/.config/fc-alerts.env; do [ -e "$p" ] && extra+=("$p"); done
# Exit 1 de tar = "un archivo cambió mientras lo leía" (un log): no es fallo.
tar -czf "$W/b.tgz" --ignore-failed-read -C "$W" redis.json repo.bundle repo-files.lst \
  -C / home/piojo/fc-data home/piojo/.cloudflared home/piojo/.ssh/oracle_fc* "${extra[@]}" \
  -C "$REPO" .env.local -T "$W/repo-files.lst" || [ $? -eq 1 ]
openssl enc -aes-256-cbc -pbkdf2 -iter 200000 -salt -pass "file:$KEY" -in "$W/b.tgz" -out "$W/$name"
sum=$(sha256sum "$W/$name" | cut -d' ' -f1)

ssh "${K[@]}" $V 'mkdir -p ~/backups && chmod 700 ~/backups'
scp "${K[@]}" -q "$W/$name" "$V:backups/$name.part"
ssh "${K[@]}" $V "cd ~/backups && [ \"\$(sha256sum $name.part | cut -d' ' -f1)\" = $sum ] && mv $name.part $name &&
  ls -1t fc-*.tar.gz.enc | tail -n +15 | xargs -r rm -f && ls -1 fc-*.tar.gz.enc | wc -l" > "$W/n"
echo "$(date '+%F %T') backup ok: $name $(du -h "$W/$name" | cut -f1), $(cat "$W/n") copias en la VM"
