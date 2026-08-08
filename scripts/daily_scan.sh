#!/usr/bin/env bash
# Daily catalog scan, run by crontab (see `crontab -l`) at 6:07 AM Europe/Madrid.
# Invokes Claude Code headlessly with the same instructions/permission mode
# used interactively during the project's build sessions.
set -uo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

echo "=== $(date -u +%Y-%m-%dT%H:%M:%SZ) daily scan start ==="

# Real bug found (2026-08-08's cron run): cron runs with a minimal PATH
# that doesn't include ~/.local/bin, so a bare `claude` failed every
# night with "command not found" -- the first run after installing the
# cron never actually did anything. Hardcoded full path now.
CLAUDE_BIN="/home/piojo/.local/bin/claude"

"$CLAUDE_BIN" -p "Daily football-cult.com catalog scan: find and add any real football jerseys still missing from the site, across ALL currently-connected sources.

Repo: /home/piojo/football-cult. Reusable tooling: scripts/catalog-mining/ (read its README.md first — it documents the whole pipeline, false-positive classes found, and the standing safety rule). Enumerate connected Awin stores fresh via \`grep '^AWIN_FEED_URL_' .env.local\` rather than assuming a fixed list — plus Mystery Shirt Club (Shopify feed) and eBay (Partner Network + Browse API) which aren't in that env-var list.

For eBay specifically, use ebay_mine_full.py (NOT the older ebay_mine.py, which only covers current-season home/away/third for adults) — it covers, per team: current season across ALL 5 types (home/away/third/goalkeeper/training), a kids pass, and a retro pass that keeps every distinct historic season found (not just the cheapest). Run it against every team in extract.py's TEAM_PATTERNS (\`python3 ebay_mine_full.py all <out_dir>\`, resumable, expect a few hours for the full team list — run it in the background and keep working on other stores while it runs). Its three output files (current_picks.json, kids_picks.json, retro_picks.json) need different insertion paths: current goes through the normal split_picks.py -> gen_new_teams.py -> refresh.py flow; kids goes through gen_kids_teams.py (gen_new_teams.py has no ageGroup support); retro needs each entry wrapped as \`{key: [offer_with_store_field]}\` before retro_gen.py (see the git history around 2026-08-07 for the exact one-liner used). gen_new_teams.py and retro_gen.py both import new_teams_batch1..6 — if a future batch7+ gets added, wire it into both files' imports the same way, or every pick for those teams silently no-ops with \"no metadata found\".

For each store: mine for jerseys of teams/types not yet in src/data/products.ts (new products) and cheaper/updated offers for existing ones, verify a sample by photo before applying (watch for the false-positive classes documented in the README: rugby/handball/volleyball items sharing a team name, kids sizing not excluded, retro/heritage items, cross-language name collisions, country/club name collisions, outlier prices with no cheaper alternative, sponsor patches sold as jerseys, generic/unlicensed \"kit sets\" with no real federation crest). Never automate login/apply/join actions on any affiliate network or store — read-only fetches of already-known feed URLs only (standing safety rule, do not change). After applying changes: npx tsc --noEmit, dupe-check id fields in products.ts, npm run build, commit and push (triggers Vercel deploy), then verify the live site (football-cult.com) responds 200. If nothing new is found, just say so — don't force a commit." \
  --permission-mode auto \
  --output-format text \
  --no-session-persistence
CLAUDE_EXIT=$?
# Real bug found: this used to read $? directly inside the echo below,
# but $(date ...) in that same command substitutes and runs BEFORE $? is
# evaluated, so it always reported date's own exit code (0), never
# claude's -- which is exactly how the PATH failure above went
# unnoticed (the log said "exit 0" while claude had actually failed
# with 127, "command not found"). Capture it immediately instead.

echo "=== $(date -u +%Y-%m-%dT%H:%M:%SZ) daily scan end (exit $CLAUDE_EXIT) ==="
