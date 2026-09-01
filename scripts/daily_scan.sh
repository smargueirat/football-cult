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

For eBay specifically, use ebay_mine_cycle.py (NOT ebay_mine_full.py directly, and NOT the older ebay_mine.py) — it wraps the same current/kids/retro coverage as ebay_mine_full.py (per team: current season across ALL 5 types home/away/third/goalkeeper/training, a kids pass, a retro pass keeping every distinct historic season found) but mines the ~385-team list in daily batches instead of all at once, since a single full pass is ~4600+ calls and reliably exhausts the Browse API's daily quota in one run (near-total 429s confirmed 2026-08-14 and 2026-08-20 -- see the README's eBay section). Run \`python3 ebay_mine_cycle.py <out_dir>\` (default batch size 60, unbuffered output recommended: \`python3 -u ebay_mine_cycle.py <out_dir>\`) — it persists which teams are done in ebay_full_cycle_state.json (next to the script, committed to the repo) and auto-stops early if it hits several consecutive 429s, so it's safe to just run it once per day and let it work through the full list over about a week, cycling back to start once every team's done. Its three output files (current_picks.json, kids_picks.json, retro_picks.json) need different insertion paths: current goes through the normal split_picks.py -> gen_new_teams.py -> refresh.py flow; kids goes through gen_kids_teams.py (gen_new_teams.py has no ageGroup support); retro needs each entry wrapped as \`{key: [offer_with_store_field]}\` before retro_gen.py (see the git history around 2026-08-07 for the exact one-liner used). gen_new_teams.py and retro_gen.py both import new_teams_batch1..6 — if a future batch7+ gets added, wire it into both files' imports the same way, or every pick for those teams silently no-ops with \"no metadata found\". IMPORTANT: git add and commit ebay_full_cycle_state.json alongside products.ts each time it changes -- if it's left uncommitted the cycle position is lost and the next run repeats the same teams instead of progressing.

Also mine Rakuten Advertising's FTP Product Catalog feed for the 5 approved Brazilian club stores (Cruzeiro, Santos, Loja PST/Sport Recife, Shop Timão/Corinthians, Inter Store/Internacional) — read the README's \"Rakuten Advertising\" section first. Download each store's feed via the read-only FTP credentials already in .env.local (RAKUTEN_FTP_HOST/USER/PASSWORD), then run rakuten_convert.py to turn it into a synthetic Awin-CSV (pass the team_hint arg for Loja PST/Sport Recife, whose titles sometimes drop \"Recife\") so it flows through the exact same pick.py -> split_picks.py -> gen_new_teams.py -> refresh.py pipeline as every other store. Do not attempt to log in to Rakuten's web UI or apply/join anything there — FTP fetch of the already-approved feeds only.

Also check the Soicos-sourced stores (Nike CL, Nike AR, Puma AR — read the README's \"Soicos\" section first, it explains why these don't fit the CSV-feed pattern the rest of this list does). This one CANNOT be done with a headless fetch: Soicos has no product feed at all, and nike.cl/nike.com.ar actively block headless browser automation (Cloudflare challenge, confirmed) — it only works through a real Chrome session via the claude-in-chrome MCP tool. If that tool isn't available in this run, skip this step entirely rather than trying to force it through curl/Playwright — it will not work no matter how it's configured, and isn't worth burning time re-discovering that. If it IS available: Nike CL/AR already have one batch of 7 matching products each and Puma AR has Independiente's away+third (see the README for exactly which, and how to cross-reference a new candidate against products already on file by Nike style code, or by team+type+season for Puma, before treating it as new) — check both storefronts for more than this first batch (other national teams on Nike, other Argentine clubs Puma actually sponsors) rather than assuming there's nothing else to mine there.

For each store: mine for jerseys of teams/types not yet in src/data/products.ts (new products) and cheaper/updated offers for existing ones, verify a sample by photo before applying (watch for the false-positive classes documented in the README: rugby/handball/volleyball items sharing a team name, kids sizing not excluded, retro/heritage items, cross-language name collisions, country/club name collisions, outlier prices with no cheaper alternative, sponsor patches sold as jerseys, generic/unlicensed \"kit sets\" with no real federation crest). Never automate login/apply/join actions on any affiliate network or store — read-only fetches of already-known feed URLs only (standing safety rule, do not change).

Also run \`python3 scripts/catalog-mining/ebay_check_stale.py\` (no args = default 200/day batch) — eBay listings get sold/delisted after we mine them, and nothing else re-checks an already-mined offer, so this catches ones that have since gone dead (confirmed real 2026-08-28: 54 of the first 300 checked, ~18%, were genuine 404s from eBay's own API) and flips them to \`inStock: false\` directly in products.ts. It persists its cycle position in ebay_stale_check_state.json (next to the script) — git add and commit that file alongside products.ts every time, same reason as ebay_full_cycle_state.json above (losing it just repeats the same batch instead of progressing through the catalog).

Finally, run \`python3 scripts/catalog-mining/track_price_drops.py\` LAST, after every other store/offer update above has already landed in products.ts — it diffs today's prices against yesterday's snapshot (price_snapshot.json, next to the script) and flags every offer that got cheaper with a \`previousPrice\` field, which is what powers the site's price-drop badge/section/filter (\"Bajaron de Precio\"). git add and commit price_snapshot.json alongside products.ts every time, same reason as the other state files — it's how tomorrow's run knows what \"yesterday\" looked like.

After applying changes: npx tsc --noEmit, dupe-check id fields in products.ts, npm run build, commit and push (triggers Vercel deploy), then verify the live site (football-cult.com) responds 200. If nothing new is found, just say so — don't force a commit." \
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
