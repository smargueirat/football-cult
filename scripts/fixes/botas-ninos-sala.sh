#!/usr/bin/env bash
# Botas de niño y de fútbol sala (2026-10-09).
#
# Regenera src/data/boots.ts (+ bootTierData.json, bootDominantColors.json,
# bootAliases.json) con el minado nuevo: las de niño entran con
# ageGroup "kids" y las de sala con groundType "IC" (antes se excluían).
# refresh_boots.py declara ageGroup en el header de boots.ts si falta, así que
# esto es idempotente y es lo mismo que hará el scan nocturno: correrlo a mano
# solo adelanta un día el resultado.
#
# Necesita los feeds de hoy en /tmp/feeds (los baja el scan de las 06:07). La
# extracción de color pide la foto de cada bota nueva (~1.500 la primera vez,
# unos minutos); las siguientes corridas solo las nuevas.
#
# Uso, en la raíz del checkout:  bash scripts/fixes/botas-ninos-sala.sh
set -euo pipefail
cd "$(dirname "$0")/../.."

for f in FOOTSTORE_ES.csv FOOTSTORE_FR.csv SPORTISGOOD_ES.csv ADIDAS_ES.csv; do
  [ -s "/tmp/feeds/$f" ] || { echo "Falta /tmp/feeds/$f: espera al scan de las 06:07 o bájalo antes." >&2; exit 1; }
done

count() { grep -c '^  {$' src/data/boots.ts || true; }
kids() { grep -c 'ageGroup: "kids"' src/data/boots.ts || true; }
sala() { grep -c 'groundType: "IC"' src/data/boots.ts || true; }
echo "antes:   $(count) botas, $(kids) de niño, $(sala) de sala"
python3 scripts/boots-mining/refresh_boots.py
echo "después: $(count) botas, $(kids) de niño, $(sala) de sala"
