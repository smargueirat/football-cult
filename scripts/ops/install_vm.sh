#!/usr/bin/env bash
# Instala en la VM de Oracle el vigilante con avisos (desde la Mini PC):
#   bash scripts/ops/install_vm.sh
# Copia fc-failover.sh y notify.mjs a /usr/local/bin y el topic de ntfy
# (~/.config/fc-alerts.env de la Mini PC) a /etc/fc-alerts.env (600, root).
# No toca fc-web ni fc-cloudflared.
set -euo pipefail
cd "$(dirname "$0")"
K=(-i "$HOME/.ssh/oracle_fc" -o BatchMode=yes -o ConnectTimeout=15 -o LogLevel=ERROR); V=opc@51.170.44.144
scp "${K[@]}" -q fc-failover.sh notify.mjs "$HOME/.config/fc-alerts.env" $V:/tmp/
ssh "${K[@]}" $V 'sudo install -m 755 /tmp/fc-failover.sh /usr/local/bin/fc-failover.sh &&
  sudo install -m 644 /tmp/notify.mjs /usr/local/bin/fc-notify.mjs &&
  sudo install -m 600 /tmp/fc-alerts.env /etc/fc-alerts.env &&
  rm -f /tmp/fc-failover.sh /tmp/notify.mjs /tmp/fc-alerts.env && echo "VM: vigilante instalado"'
