#!/usr/bin/env bash
# Daily catalog scan, run by crontab (see `crontab -l`) at 6:07 AM Europe/Madrid.
# Invokes Claude Code headlessly with the same instructions/permission mode
# used interactively during the project's build sessions.
set -uo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

echo "=== $(date -u +%Y-%m-%dT%H:%M:%SZ) daily scan start ==="

claude -p "Daily football-cult.com catalog scan: find and add any real football jerseys still missing from the site, across ALL currently-connected sources.

Repo: /home/piojo/football-cult. Reusable tooling: scripts/catalog-mining/ (read its README.md first — it documents the whole pipeline, false-positive classes found, and the standing safety rule). Enumerate connected Awin stores fresh via \`grep '^AWIN_FEED_URL_' .env.local\` rather than assuming a fixed list — plus Mystery Shirt Club (Shopify feed) and eBay (Partner Network + Browse API, ebay_mine.py) which aren't in that env-var list. For each store: mine for jerseys of teams/types not yet in src/data/products.ts (new products) and cheaper/updated offers for existing ones, verify a sample by photo before applying (watch for the false-positive classes documented in the README: rugby/handball/volleyball items sharing a team name, kids sizing not excluded, retro/heritage items, cross-language name collisions, country/club name collisions, outlier prices with no cheaper alternative, sponsor patches sold as jerseys). Never automate login/apply/join actions on any affiliate network or store — read-only fetches of already-known feed URLs only (standing safety rule, do not change). After applying changes: npx tsc --noEmit, dupe-check id fields in products.ts, npm run build, commit and push (triggers Vercel deploy), then verify the live site (football-cult.com) responds 200. If nothing new is found, just say so — don't force a commit." \
  --permission-mode auto \
  --output-format text \
  --no-session-persistence

echo "=== $(date -u +%Y-%m-%dT%H:%M:%SZ) daily scan end (exit $?) ==="
