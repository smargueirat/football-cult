#!/usr/bin/env bash
# Corre cada minuto EN LA VM de Oracle (fc-failover.timer, como root).
# Se instala con scripts/ops/install_vm.sh en /usr/local/bin/fc-failover.sh.
#
# Si el sitio público falla 3 minutos seguidos y el conector de esta VM no está
# activo, lo arranca (la VM pasa a servir el sitio). No lo apaga solo: cuando la
# Mini PC vuelva, parar a mano con
#   sudo systemctl stop fc-cloudflared
#
# Avisa al móvil (scripts/ops/notify.mjs) UNA vez por cambio de estado: al
# caer (3 fallos) y al volver a responder. Si el aviso no sale (red, ntfy...),
# se reintenta el minuto siguiente hasta que salga.
STATE=/var/tmp/fc-failover.count
DOWN=/var/tmp/fc-failover.down        # existe = ya avisé de la caída
notify() { FC_ENV=/opt/fc/prod/.env.local FC_APP=/opt/fc/prod FC_ALERTS=/etc/fc-alerts.env \
  timeout 60 node /usr/local/bin/fc-notify.mjs "$1" "$2" >/dev/null 2>&1; }

code=$(curl -s -o /dev/null -m 15 -w "%{http_code}" "https://football-cult.com/es?hc=$RANDOM" || echo 000)
if [ "$code" = "200" ]; then
  echo 0 > $STATE
  if [ -e $DOWN ]; then
    if systemctl is-active --quiet fc-cloudflared; then
      extra="Lo sirve (al menos en parte) la VM de Oracle. Cuando la Mini PC esté bien: ssh a la VM y sudo systemctl stop fc-cloudflared"
    else
      extra="El conector de la VM no está activo: lo sirve la Mini PC."
    fi
    notify "✅ football-cult.com vuelve a responder" "$(date '+%d/%m %H:%M %Z'). $extra" && rm -f $DOWN
  fi
  exit 0
fi

n=$(( $(cat $STATE 2>/dev/null || echo 0) + 1 )); echo $n > $STATE
[ "$n" -lt 3 ] && exit 0
if ! systemctl is-active --quiet fc-cloudflared; then
  logger -t fc-failover "sitio público responde $code desde hace $n minutos: arranco el conector de la VM"
  systemctl start fc-cloudflared
  did="Arranco el conector de respaldo de la VM de Oracle."
else
  did="El conector de la VM ya estaba activo: fallan los dos."
fi
[ -e $DOWN ] || { notify "🔴 football-cult.com caído" "Responde HTTP $code desde hace $n min ($(date '+%d/%m %H:%M %Z')). $did" && touch $DOWN; }
exit 0
