#!/usr/bin/env bash
# Copia de respaldo en Oracle (VM fc-web, Madrid): tras cada deploy local, envía
# main a la VM y la compila allí. No es crítico: si falla, el sitio de la Mini PC
# sigue igual. Se lanza en segundo plano desde deploy_local.sh.
set -uo pipefail
K="-i $HOME/.ssh/oracle_fc -o BatchMode=yes -o ConnectTimeout=15"; V=opc@51.170.44.144
cd /home/piojo/football-cult
env=$(mktemp); trap 'rm -f "$env"' EXIT
sed 's#^CLICK_LOG_DIR=.*#CLICK_LOG_DIR=/home/opc/fc-data/clicks#' "$HOME/fc-prod/.env.local" > "$env"
git archive --format=tar main | ssh $K $V 'rm -rf /opt/fc/incoming && mkdir -p /opt/fc/incoming && tar -x -C /opt/fc/incoming' || exit 1
scp $K -q "$env" $V:/opt/fc/incoming/.env.local || exit 1
ssh $K $V 'chmod 600 /opt/fc/incoming/.env.local && bash /opt/fc/deploy_vm.sh'
