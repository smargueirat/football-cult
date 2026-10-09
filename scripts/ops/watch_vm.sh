#!/usr/bin/env bash
# Vigilante inverso, corre en la Mini PC cada 5 min (cron). Avisa al móvil, una
# vez por cambio de estado, si:
#  - la VM de Oracle no responde por SSH o su fc-web local no da 200
#    (2 comprobaciones seguidas = 10 min), y cuando vuelve;
#  - la Mini PC ya sirve bien pero el conector de la VM sigue activo
#    (después de un failover hay que pararlo a mano).
# Si esta PC no tiene internet no hace nada: el problema es local y el
# vigilante de la VM ya avisa de la caída del sitio.
D="$HOME/.local/state/fc-ops"; mkdir -p "$D"
export XDG_RUNTIME_DIR=${XDG_RUNTIME_DIR:-/run/user/$(id -u)}   # systemctl --user desde cron
H="$(dirname "$0")"
log() { echo "$(date '+%F %T') $*" >> "$D/watch_vm.log"; }
notify() { timeout 60 node "$H/notify.mjs" "$1" "$2" >> "$D/watch_vm.log" 2>&1; }

curl -s -m 10 -o /dev/null https://ntfy.sh || exit 0

out=$(ssh -i "$HOME/.ssh/oracle_fc" -o BatchMode=yes -o ConnectTimeout=15 -o LogLevel=ERROR "${FC_VM:-opc@51.170.44.144}" \
  'curl -s -o /dev/null -m 10 -w "%{http_code}" http://127.0.0.1:3100/es; echo " $(systemctl is-active fc-cloudflared)"' 2>/dev/null)
code=${out%% *}; cf=${out##* }
[ -n "$out" ] || { code=ssh; cf=?; }

if [ "$code" = "200" ]; then
  echo 0 > "$D/vm.count"
  if [ -e "$D/vm.down" ]; then
    notify "✅ VM de respaldo OK de nuevo" "Oracle responde por SSH y su fc-web da 200." && rm -f "$D/vm.down" && log "VM ok"
  fi
else
  n=$(( $(cat "$D/vm.count" 2>/dev/null || echo 0) + 1 )); echo $n > "$D/vm.count"
  if [ "$n" -ge 2 ] && [ ! -e "$D/vm.down" ]; then
    why=$([ "$code" = ssh ] && echo "no responde por SSH" || echo "su fc-web local da HTTP $code")
    notify "⚠️ VM de respaldo caída" "La VM de Oracle $why desde hace ~$((n*5)) min. El sitio sigue en la Mini PC, pero sin respaldo." \
      && touch "$D/vm.down" && log "VM caída: $code"
  fi
fi

# Conector de la VM activo con la PC sana = tráfico repartido entre dos copias.
pc=$(curl -s -o /dev/null -m 10 -w "%{http_code}" http://127.0.0.1:3100/es)
if [ "$cf" = active ] && [ "$pc" = 200 ] && systemctl --user is-active --quiet fc-tunnel; then
  # La VM sirve una copia que puede ir por detrás de main: se apaga sola (2026-10-09).
  ssh $K $V 'sudo systemctl stop fc-cloudflared' 2>/dev/null \
    && notify "🟢 La Mini PC volvió: apagué el respaldo de Oracle" "El sitio vuelve a salir solo de la Mini PC." \
    && log "conector VM apagado"
elif [ "$cf" = inactive ]; then
  rm -f "$D/vm.serving"
fi
