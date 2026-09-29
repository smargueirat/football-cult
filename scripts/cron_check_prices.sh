#!/usr/bin/env bash
# Alertas de precio semanales. En Vercel lo disparaba vercel.json ("0 9 * * 1");
# desde 2026-09-29 el sitio corre en esta PC y lo dispara el crontab.
SECRET=$(grep '^CRON_SECRET=' /home/piojo/football-cult/.env.local | cut -d= -f2-)
curl -s -m 300 -H "Authorization: Bearer $SECRET" http://127.0.0.1:3100/api/cron/check-prices
echo
