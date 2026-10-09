#!/usr/bin/env bash
# Datos de la tanda 2 (Telegram, DAZN, Soicos, envíos). Idempotente: se puede
# correr en main después de fusionar, y otra vez sin efecto.
#   bash scripts/fixes/tanda2-telegram-dazn-soicos-envios.sh
# DAZN y envíos no necesitan datos (solo código).
set -euo pipefail
cd "$(dirname "$0")/../.."

# 1) Botas de Nike CL/AR y Puma AR con enlace de Soicos (125 el 2026-10-09).
npx tsx scripts/fixes/tanda2_soicos_boots.mts

# 2) priceDrops.json con las reglas nuevas (solo bajadas verificadas). Va
#    después del paso 1 porque las bajadas se indexan por URL. No depende del
#    snapshot de ayer, así que repetirlo el mismo día da lo mismo.
npx tsx scripts/catalog-mining/track_price_drops.mts

# 3) Qué saldría hoy en el canal, sin publicar nada.
npx tsx scripts/catalog-mining/broadcast_price_drops.mts --dry-run | head -3

git status --short src/data data scripts/catalog-mining/price_snapshot.json
