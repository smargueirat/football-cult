#!/usr/bin/env bash
# Detalles de la auditoría SEO (2026-10-19): sku/mpn/gtin en las fichas.
#
# Regenera src/data/offerGtins.json y offerMpns.json con update_gtins.py, que
# ahora también cruza las botas, guantes y balones (antes solo camisetas) y
# descarta los EAN cuyo dígito de control no cuadra. Idempotente: es lo mismo
# que hace el scan nocturno, correrlo a mano solo adelanta un día el resultado.
#
# Necesita los feeds de hoy en /tmp/feeds (los baja el scan de las 06:07).
# Los títulos de las fichas no cambian de un modo que haga falta revisar, pero
# después conviene correr: npx tsx scripts/check_seo_titles.mts
#
# Uso, en la raíz del checkout:  bash scripts/fixes/seo_detalles.sh
set -euo pipefail
cd "$(dirname "$0")/../.."

for f in FOOTSTORE_ES.csv FOOTSTORE_FR.csv SPORTISGOOD_ES.csv ADIDAS_ES.csv; do
  [ -s "/tmp/feeds/$f" ] || { echo "Falta /tmp/feeds/$f: espera al scan de las 06:07 o bájalo antes." >&2; exit 1; }
done

n() { python3 -c "import json,sys; print(len(json.load(open('src/data/$1'))))"; }
echo "antes:   $(n offerGtins.json) GTIN, $(n offerMpns.json) códigos de fabricante"
python3 scripts/catalog-mining/update_gtins.py | tail -4
echo "después: $(n offerGtins.json) GTIN, $(n offerMpns.json) códigos de fabricante"
