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

# Refresco determinista SIN Claude (2026-10-09): descarga los feeds y refresca
# precio/stock/tallas de camisetas (por oferta), botas y equipamiento, y lo
# commitea. Va antes de Claude para que una noche en que Claude no arranca
# (16 de 62 hasta el 10-08) el catálogo igual quede al día. Ver el script.
SCAN_MARK="$(mktemp)"
REFRESH_OUT="$(scripts/daily_refresh.sh 2>&1)"
echo "$REFRESH_OUT"

"$CLAUDE_BIN" -p "Daily football-cult.com catalog scan: find and add any real football jerseys still missing from the site, across ALL currently-connected sources.

YA HECHO antes de esta sesión, sin LLM (scripts/daily_refresh.sh, 2026-10-09; su salida está al final de scripts/daily_scan.log): todos los feeds de abajo ya están descargados en /tmp/feeds (download_feeds.py), cada oferta de camiseta de tienda con feed ya tiene el precio/stock/tallas de hoy (refresh_offers.py, que además marca inStock:false lo que ya no está en el feed de su tienda -- no lo deshagas), y botas y equipamiento ya se refrescaron (refresh_boots.py, refresh_gear.py), todo commiteado. No vuelvas a descargar un feed de /tmp/feeds que tenga menos de 6 h ni vuelvas a correr refresh_boots.py/refresh_gear.py, salvo que esa salida diga FAIL/ABORTADO/WARNING para ellos; tu trabajo es la minería de productos y ofertas NUEVAS (y los pasos de eBay, Rakuten, tickets, GTIN, colores y bajadas de precio de abajo). Archivos derivados como FORUMSPORT_jerseys.csv sí los tienes que generar tú.

Repo: /home/piojo/football-cult. Reusable tooling: scripts/catalog-mining/ (read its README.md first — it documents the whole pipeline, false-positive classes found, and the standing safety rule). Enumerate connected Awin stores fresh via \`grep '^AWIN_FEED_URL_' .env.local\` rather than assuming a fixed list — plus eBay (Partner Network + Browse API) which isn't in that env-var list. Do NOT mine Mystery Shirt Club anymore — its Awin affiliate programme (aid 124324) closed 2026-09-16, its 313 offers were already removed from products.ts, and any link generated through that aid is dead even if the Shopify product feed itself still responds.

STANDING RULE, applies to every step below: this is a headless, one-shot, non-resumable run (\`--no-session-persistence\`) — there is no \"continue later\". If any mining script is started in the background (or its output is only watched via a PID/task watcher) and the turn ends before that background task has actually finished, the work is silently abandoned, not resumed — this happened for real on 2026-09-09, 2026-09-12 and 2026-09-23, each time ending with something like \"I'll continue once the background task finishes\" and then just exiting, leaving the bash-level safety net below to recover the data without the verification/summary pass this run is supposed to do. Every mining script listed below (ebay_mine_cycle.py included) already streams its own progress with \`-u\`/unbuffered output and is meant to be run and waited on in the foreground within this same turn, exactly like any other command — never launch one as a background job and end the response while it's still running. If a single command would run past what's comfortable, that's fine — stay in this turn and let it finish before moving to the next step or writing the final summary.

For eBay specifically, use ebay_mine_cycle.py (NOT ebay_mine_full.py directly, and NOT the older ebay_mine.py) — it wraps the same current/kids/retro coverage as ebay_mine_full.py (per team: current season across ALL 5 types home/away/third/goalkeeper/training, a kids pass, a retro pass keeping every distinct historic season found) but mines the ~385-team list in daily batches instead of all at once, since a single full pass is ~4600+ calls and reliably exhausts the Browse API's daily quota in one run (near-total 429s confirmed 2026-08-14 and 2026-08-20 -- see the README's eBay section). Run \`python3 -u ebay_mine_cycle.py <out_dir> 20\` (batch size 20 -- NOT the script's default of 60, see the EBAY_IT/EBAY_ES paragraph below for why: the three marketplaces share one daily quota and a 60-team US batch eats all of it) — it persists which teams are done in ebay_full_cycle_state.json (next to the script, committed to the repo) and auto-stops early if it hits several consecutive 429s, so it's safe to just run it once per day and let it work through the full list over about a week, cycling back to start once every team's done. Its three output files (current_picks.json, kids_picks.json, retro_picks.json) need different insertion paths: current goes through the normal split_picks.py -> gen_new_teams.py -> refresh.py flow; kids goes through gen_kids_teams.py (gen_new_teams.py has no ageGroup support) for NEW kids products, and ALSO run \`python3 scripts/catalog-mining/refresh.py src/data/products.ts <out_dir>/kids_picks.json eBay USD "" --kids --apply\` to refresh prices/insert eBay offers on EXISTING kids products (refresh.py skips kids blocks unless --kids, and only touches kids blocks with it; closed 2026-09-20 after the scan flagged that kids prices were never refreshed); retro needs each entry wrapped as \`{key: [offer_with_store_field]}\` before retro_gen.py (see the git history around 2026-08-07 for the exact one-liner used). gen_new_teams.py and retro_gen.py both import new_teams_batch1..6 — if a future batch7+ gets added, wire it into both files' imports the same way, or every pick for those teams silently no-ops with \"no metadata found\". IMPORTANT: git add and commit ebay_full_cycle_state.json alongside products.ts each time it changes -- if it's left uncommitted the cycle position is lost and the next run repeats the same teams instead of progressing.

Also mine eBay Italia (EBAY_IT) and eBay España (EBAY_ES) the same way, added 2026-09-22 — ebay_mine_cycle.py now takes a marketplace_id as a 3rd positional arg (defaults to EBAY_US when omitted, so the paragraph above is unaffected): run \`python3 -u ebay_mine_cycle.py <out_dir_it> 20 EBAY_IT\` and \`python3 -u ebay_mine_cycle.py <out_dir_es> 20 EBAY_ES\` as two more independent daily batches, each with its own out_dir (do not reuse the EBAY_US out_dir) and its own cycle-state file (ebay_full_cycle_state_IT.json / ebay_full_cycle_state_ES.json, next to the script — commit these alongside ebay_full_cycle_state.json, same reason as always: losing one just repeats that marketplace's teams instead of progressing). BATCH SIZE AND ORDER MATTER, learned the hard way 2026-09-25: all three marketplaces share ONE app credential and therefore ONE daily Browse API quota, so they are not really independent. That night EBAY_US ran first at batch 60, completed 42 teams, exhausted the day's quota, and EBAY_IT/EBAY_ES then got 40 consecutive 429s each and advanced ZERO teams — and because US had always been going first, US had already reached cycle 4 while IT and ES were both still stuck on cycle 1. So: use batch size 20 (not 60) for ALL THREE marketplaces, and rotate which one goes first each day (day-of-year mod 3: 0 -> US, IT, ES / 1 -> IT, ES, US / 2 -> ES, US, IT) so a bad-quota day starves a different marketplace each time instead of always the same two. Same app credentials (EBAY_CLIENT_ID/SECRET/CAMPAIGN_ID) work unchanged across marketplaces — only the header and result currency (EUR for both IT and ES) differ, same team/type extraction and exclusion filters as EBAY_US, no separate false-positive classes found so far. Route current_picks.json through the normal split_picks.py -> gen_new_teams.py -> refresh.py flow same as EBAY_US, but with \`store_name=\"eBay IT\"\`/\`\"eBay ES\"\` and \`currency=EUR\` instead of \`eBay\`/\`USD\` (distinct store label per marketplace, same pattern as the site's multi-country Amazon tags) — e.g. \`python3 gen_new_teams.py <out_dir_it>/current_picks_NEW.json \"eBay IT\" EUR /tmp/ebay_it_new_blocks.ts\` and \`python3 refresh.py src/data/products.ts <out_dir_it>/current_picks_ADD.json \"eBay IT\" EUR --apply\` (same for ES). Kids and retro follow the exact same per-marketplace store_name/currency substitution through gen_kids_teams.py/refresh.py --kids and the retro_gen.py wrap-with-offer-store-field step described above. Known gap, left as-is on purpose (not a bug to fix reflexively): the live per-buyer-country shipping lookup (src/app/api/ebay-shipping/route.ts, useLiveOfferTotal/useLiveOfferCosts/useBestOfferForCountry) only activates for \`offer.store === "eBay"\` exactly, so "eBay IT"/"eBay ES" offers behave like every other static-shipping store (their catalog shipping figure is used as-is, no live re-check) instead of getting eBay US's live-lookup treatment — reasonable since EU-to-EU shipping is far less variable than eBay US's worldwide-buyer problem that feature exists for, but worth knowing if it ever needs revisiting.

Also mine Rakuten Advertising's FTP Product Catalog feed for the 5 approved Brazilian club stores (Cruzeiro, Santos, Loja PST/Sport Recife, Shop Timão/Corinthians, Inter Store/Internacional) PLUS Umbro (MID 41001 — confirmed approved 2026-08-13, 7552 product links live in the Rakuten dashboard as of 2026-09-16, feed access appears to already be auto-enrolled so no user Apply click should be needed anymore) — read the README's \"Rakuten Advertising\" section first. Download each store's feed via the read-only FTP credentials already in .env.local (RAKUTEN_FTP_HOST/USER/PASSWORD), then run rakuten_convert.py to turn it into a synthetic Awin-CSV (pass the team_hint arg for Loja PST/Sport Recife, whose titles sometimes drop \"Recife\" — do NOT pass team_hint for Umbro, it's a multi-team brand, titles should carry their own real team names for team_re_all() to match) so it flows through the exact same pick.py -> split_picks.py -> gen_new_teams.py -> refresh.py pipeline as every other store. If the 41001_4733330_mp.txt.gz file isn't on the FTP server yet, just note that and skip it this run rather than treating it as an error. Do not attempt to log in to Rakuten's web UI or apply/join anything there — FTP fetch of the already-approved feeds only.

Also check the Soicos-sourced stores (Nike CL, Nike AR, Puma AR — read the README's \"Soicos\" section first, it explains why these don't fit the CSV-feed pattern the rest of this list does). This one CANNOT be done with a headless fetch: Soicos has no product feed at all, and nike.cl/nike.com.ar actively block headless browser automation (Cloudflare challenge, confirmed) — it only works through a real Chrome session via the claude-in-chrome MCP tool. If that tool isn't available in this run, skip this step entirely rather than trying to force it through curl/Playwright — it will not work no matter how it's configured, and isn't worth burning time re-discovering that. If it IS available: Nike CL/AR already have one batch of 7 matching products each and Puma AR has Independiente's away+third (see the README for exactly which, and how to cross-reference a new candidate against products already on file by Nike style code, or by team+type+season for Puma, before treating it as new) — check both storefronts for more than this first batch (other national teams on Nike, other Argentine clubs Puma actually sponsors) rather than assuming there's nothing else to mine there.

For each store: mine for jerseys of teams/types not yet in src/data/products.ts (new products) and cheaper/updated offers for existing ones, verify a sample by photo before applying (watch for the false-positive classes documented in the README: rugby/handball/volleyball items sharing a team name, kids sizing not excluded, retro/heritage items, cross-language name collisions, country/club name collisions, outlier prices with no cheaper alternative, sponsor patches sold as jerseys, generic/unlicensed \"kit sets\" with no real federation crest). EXCEPTION: the 3 \`AWIN_FEED_URL_GIGASPORT_*\` entries and \`AWIN_FEED_URL_CLOVIS_BR\` are boots-only (see the comment above each in .env.local and scripts/boots-mining/README.md) — just download them to /tmp/feeds/GIGASPORT_{DE,CH,FR}.csv and /tmp/feeds/CLOVIS_BR.csv, do NOT run the jersey-mining pipeline on them. Never automate login/apply/join actions on any affiliate network or store — read-only fetches of already-known feed URLs only (standing safety rule, do not change).

Corre tambien la pasada de CAMISETAS DE MUJER, que es una dimension aparte de la de adultos igual que la de ninos (agregada 2026-09-28): \`python3 -u scripts/catalog-mining/mine_women.py /tmp/women\` y despues \`python3 -u scripts/catalog-mining/apply_women.py /tmp/women --apply\`. NO hace falta correr pick.py/split_picks.py a mano para esto: mine_women.py ya recorre las 13 tiendas de camisetas con las columnas correctas de cada una y apply_women.py hace el split/gen/insert/refresh por tienda en el orden correcto (funda la ficha la tienda que trae la temporada mas fiable en el titulo, no la primera alfabetica). Por que existe: hasta el 2026-09-28 \"mujer|women|dama|feminin\" estaba en EXCLUDE_RE Y en KIDS_EXCLUDE_RE, asi que NINGUNA pasada de NINGUNA tienda podia traer una camiseta de mujer -- las 64 que habia eran todas retro sembradas a mano, mientras el sitio publicaba /mujer como seccion propia. Revisa los picks a ojo como en cualquier otra tienda: la clase de falso positivo propia de esta pasada es el CORTE de hombre de la camiseta de un equipo FEMENINO (\"USWNT Men's Home Soccer Jersey - Women's Team\", \"Maillot Allemagne Exterieur (Equipe feminine) Homme\"), que ya esta cubierta por WOMEN_EXCLUDE_RE pero puede aparecer con otra redaccion. Ojo con la columna de categoria deportiva: ForumSport NO lleva (su custom_2 es una fecha, pasarla deja la tienda en cero picks), adidas ES/PT SI la llevan y sin ella entra rugby/balonmano.

Despues de minar, corre \`python3 scripts/catalog-mining/update_gtins.py\` y commitea \`src/data/offerGtins.json\` junto a products.ts (agregado 2026-09-28). Cruza las URLs de oferta del catalogo con la columna de EAN/GTIN de cada feed y deja el mapa que lee el feed de Google Shopping. Importa por dos motivos: Merchant Center prioriza los articulos con GTIN correcto (es como empareja el mismo producto entre comercios) y a nosotros nos da la unica forma FIABLE de saber que dos tiendas venden exactamente la misma camiseta, sin depender del titulo ni de la foto. OJO: la columna NO se llama igual en todos los feeds (ean / gtin / product_GTIN, la tabla esta en el script), y el GTIN NO se guarda dentro de la oferta en products.ts a proposito -- ese archivo esta al borde del limite de complejidad de tipos de TypeScript y sumarle un campo opcional mas a las ofertas lo revienta con "Expression produces a union type that is too complex to represent" (probado ese dia). Mismo patron que priceDrops.ts.

Corre \`python3 scripts/catalog-mining/check_women_type.py\` (agregado 2026-09-28) y no sigas si falla: cubre las dos reglas de clasificacion que se arreglaron ese dia -- que \"third\" le gana a \"away\"/\"home\" (FansJerseyHub llama a la tercera equipacion \"Third Away\" y 355 titulos de ese feed entraban como suplente) y que la pasada de mujer distingue el corte de mujer del equipo femenino.

Despues de la mineria de eBay de siempre (NO antes: comparten la cuota diaria de la Browse API y la de siempre tiene prioridad), corre \`python3 -u scripts/catalog-mining/ebay_gb_retro.py 300 --apply\` (agregado 2026-09-28) y commitea \`scripts/catalog-mining/ebay_gb_retro_state.json\` junto a products.ts -- si se pierde, se vuelven a revisar las mismas fichas. Busca en eBay Reino Unido el MISMO modelo (equipo, equipacion y temporada exacta) de cada ficha retro que tiene una sola tienda, y lo suma como oferta "eBay GB". Por que: el 88% de las fichas con una sola tienda son retro, y una retro suele ser un ejemplar unico, asi que lo que se compara es otros anuncios del mismo modelo; Reino Unido es el mayor mercado de retro (en la tanda del 28-09, ~40% de las fichas tenian el mismo modelo ahi). Se corta solo si eBay devuelve 429. Revisa a ojo una muestra de los picks como en cualquier tienda: la clase de falso positivo esperable es la reproduccion moderna vendida como "retro" nueva a precio bajo, que es la misma que ya acepta la pasada retro de eBay EE.UU.

Pro:Direct España (added 2026-09-29, WEEKLY, not nightly): if /tmp/feeds/PRODIRECT_ES.csv exists and is less than 24 hours old (a Sunday 04:00 crontab entry runs scripts/catalog-mining/prodirect_es_feed.py, ~30 min, to build it), run it through the normal pick.py -> split_picks.py -> refresh.py / gen_new_teams.py flow with store_name \"Pro:Direct ES\" and currency EUR (columns: price delivery_cost, product_name custom_1 aw_deep_link aw_image_url -- it already has the Awin shape). Same for /tmp/feeds/PRODIRECT_UK.csv (added 2026-09-30, same Sunday crontab with --uk): the UK site prodirectsport.com, a DIFFERENT store, store_name \"Pro:Direct Soccer\" and currency GBP, English titles, ships to the UK only (already in storeShipping). If a file is missing or older than 24h, skip it silently. Pro:Direct BOOTS need nothing here: refresh_boots.py reads /tmp/feeds/PRODIRECT_ES_BOOTS.json by itself (nightly crontab), and fuses the same boot across stores by EAN or manufacturer code. It is a Shopify store with no affiliate feed; the direct link is monetized by Skimlinks on click. It ships only to the EU (already registered in storeShipping). False-positive classes found when it was first integrated: \"Prepartido\" in the title, \"ML\" = long sleeve, \"LS\" = long sleeve in English titles, \"With <Name> <N>\" = printed player shirt; the feed script already drops the ones whose DESCRIPTION says pre-match. \"Originals\" is NOT a false positive (adidas sells the 2026 away kits under that line). Verify a sample by photo like any store.
Also mine the 2 TradeTracker (not Awin) jersey stores the same way as any Awin store — same extract.py -> pick.py/pick_no_size.py -> split_picks.py -> gen_new_teams.py -> refresh.py --apply flow, same false-positive checks, same photo verification before applying. These were previously only mined by hand once (2026-09-09) and had gone stale until this was added (2026-09-22) — do not let that happen again, run them every night like every other store. Download each with \`curl \"https://pf.tradetracker.net/?aid=514692&encoding=utf-8&type=csv&fid=<FID>&categoryType=2&additionalType=2&csvDelimiter=%3B&csvEnclosure=%22&filter_extended=1\" -o /tmp/feeds/<NAME>.csv\` (semicolon-delimited, own schema, not the Awin one):
  - **Futbol Factory** (fid=2551751, campaignID=32066, futbolfactory.es): ~6,800 products, no size column at all (one row per player-edition/gender variant) — use pick_no_size.py, not pick.py, same as the original 2026-09-09 run (a fixed S-XXL range was spot-checked against real product pages then; re-verify that's still accurate if it's been a while).
  - **Shop Real Betis** (fid=2291247, campaignID=37797, shop.realbetisbalompie.es): single-team official store, ~2000 products (mostly non-jersey merch — shorts, shin guards, mugs — filter hard on real jersey/camiseta wording). Real product titles here often don't include \"Real Betis\" at all (store name is implicit) — prefix titles with \"Real Betis\" before matching, same as the original run. The auto-picker previously chose wrong items (a stock=0 replica, a non-wearable minishirt) here more than on other stores, so give this one's picks extra scrutiny by photo before applying, not just a quick pass.
  FutbolEmotion (TradeTracker, fid=2066871) is NOT part of this paragraph — it's boots-only and already fully automated inside refresh_boots.py (see below), mining it again here for jerseys would duplicate work for no reason (the 71 legacy jersey crossovers already live in a fixed block in products.ts, untouched by any pipeline).

STANDING RULE, applies from 2026-09-22 onward: any new recurring data source added to this project (a new store, a new feed, a new scraping/mining script, a new marketplace of an existing source like eBay IT/ES) must be wired into this same nightly scan the same day it's built — either by adding it to the generic \`AWIN_FEED_URL_*\` enumeration if it fits that pattern, or by adding an explicit paragraph here otherwise. A one-off manual mining pass that never gets added here WILL go stale (this exact thing happened to Futbol Factory/Shop Real Betis above, and to FutbolEmotion boots before 2026-09-21) — do not repeat that mistake. If a future session adds a new source and does not have time to also automate it same-day, it must say so explicitly to the user rather than silently leaving it manual-only.

Also run \`python3 scripts/catalog-mining/ebay_check_stale.py\` (no args = default 200/day batch) — eBay listings get sold/delisted after we mine them, and nothing else re-checks an already-mined offer, so this catches ones that have since gone dead (confirmed real 2026-08-28: 54 of the first 300 checked, ~18%, were genuine 404s from eBay's own API) and flips them to \`inStock: false\` directly in products.ts. It persists its cycle position in ebay_stale_check_state.json (next to the script) — git add and commit that file alongside products.ts every time, same reason as ebay_full_cycle_state.json above (losing it just repeats the same batch instead of progressing through the catalog).

Also run \`python3 scripts/boots-mining/refresh_boots.py\` (read scripts/boots-mining/README.md first) — refreshes src/data/boots.ts against the same Awin feed cache used above (adidas ES, Sport is Good ES, Foot-Store ES, Decathlon Irlanda boots, Gigasport DE/CH/FR, Clovis Calçados BR, Reebok DE), which used to only ever get re-mined by hand and had started drifting from real store prices. Clovis Calçados BR (aid 107702, added 2026-09-22) is a general Brazilian footwear retailer — category_id/category_name are always empty in its feed, so mine_clovis() filters on product_type == \"Masculino - Chuteira\" (its dedicated men's football-boots category; \"Infantil - Menino - Chuteira\" is kids' and stays excluded same as every other store), then drops Futsal/Indoor titles via the existing EXCLUDE_KEYWORDS (already covers those words) and keeps Society/Campo (real outdoor ground types, ~AG/~FG) — prices are real BRL, shown natively like Pro Soccer's USD. Reebok DE (aid 121508, added 2026-10-05) needs nothing extra: its feed is a MIXED one already downloaded to /tmp/feeds/REEBOK_DE.csv by the normal AWIN_FEED_URL_* enumeration (it also goes through the jersey pipeline, unlike Gigasport/Clovis), and mine_reebok_de() picks the boots out of it by \"Fußballschuh\" in the title. It's a single self-contained script (mines, rebuilds boots.ts, reclassifies Tier/Horma, extracts dominant color for any new photos) — just run it and git add its three output files (src/data/boots.ts, src/data/bootTierData.json, src/data/bootDominantColors.json) alongside everything else. Ids are deterministic so this is safe to run every day even with zero real changes (produces a byte-identical file). Since 2026-09-21 it ALSO downloads the FutbolEmotion (TradeTracker) feed itself, re-applies today's sizes/prices/stock to the 71 legacy models (legacy_stock.py) and mines ProSoccer per-size stock — so sold-out boots and vanished sizes leave the catalog every night; if its output contains a \`WARNING: no se pudo refrescar el feed de FutbolEmotion\` line, mention it in your summary (that store's sizes are then a day stale). Print its summary (new/dropped/price-changed counts and the legacy-refresh line) in your own summary at the end.

Also run \`node scripts/catalog-mining/extract_dominant_colors.mjs\` after every jersey insert/refresh above has landed in products.ts -- extrae el color DOMINANTE real de la foto de cada camiseta nueva y lo guarda en src/data/productDominantColors.json, que es lo que usa el filtro por color (src/lib/colorClassify.ts: productColorKey cae al colorHex \"de marca\" del EQUIPO, compartido por todas sus camisetas, para cualquier producto que no esté en ese archivo). Desde 2026-09-26 es INCREMENTAL y fusiona en vez de sobreescribir, así que corre en segundos cuando no hay productos nuevos y una corrida parcial ya no puede borrar entradas buenas -- ese riesgo era justamente por qué no estaba acá, y el archivo quedó congelado desde 2026-08-21 con 1.312 de 6.575 productos sin color real. git add src/data/productDominantColors.json junto con products.ts. Also run \`python3 scripts/gear-mining/refresh_gear.py\` — same idea as refresh_boots.py but for src/data/gloves.ts, src/data/balls.ts, src/data/apparel.ts and src/data/training.ts (guantes de arquero, pelotas, ropa de fútbol -- shorts/chaquetas/pantalones/medias, apparel.ts added 2026-09-18 -- y equipamiento de entrenamiento: conos/petos/vallas/escaleras/redes/material, training.ts added 2026-09-24, filtrado por hoja de categoría real vía TRAINING_LEAVES en mine_gear.py; los petos salieron de ropa ese mismo día). Reuses the exact same feed cache (Foot-Store ES/FR, Sport is Good ES/FR, Deporte Outlet, Gigasport DE/CH/FR, and since 2026-10-05 Reebok DE = /tmp/feeds/REEBOK_DE.csv for Ropa only: mine_reebok() classifies its Sidewinder/ID Football apparel and the country fan tees by product_name because the feed has no categories) via scripts/gear-mining/mine_gear.py -- no separate download step, no new feed sources. mine_gear.py already fuses the same real product sold across mirror stores (Foot-Store/Sport is Good ES+FR) into one product with multiple offers, and requires the top-level feed category to literally be "Football" (not just contain the category word) so Running/Training apparel from unrelated brands doesn't leak in — don't loosen either check. Deterministic ids same as boots (safe to re-run daily). git add src/data/gloves.ts, src/data/balls.ts, src/data/apparel.ts and src/data/training.ts alongside everything else. Print its summary too.

Also download the TICKETNET feeds to /tmp/feeds/TICKETNET_{UK,US}.csv (TICKETS-ONLY -- solo UK y US: el programa DE (aid 109000) cerró el 2026-09-01 y sus ofertas ya se quitaron del catálogo, pero Awin sigue sirviendo su feed, así que se bajaban 2,4 MB cada noche para nada. Si alguna vez reabre, volver a sumar AWIN_FEED_URL_TICKETNET_DE acá, see the comment above them in .env.local -- do NOT run the jersey/boots/gear pipeline on these) and run \`python3 scripts/tickets-mining/refresh_tickets.py\` — refreshes src/data/tickets.ts, added 2026-09-17. Real football match tickets (Bundesliga, LaLiga, Premier League, Champions League, etc.), same event compared across the 3 regional currencies (EUR/GBP/USD) since it's genuinely the same match at a different real price per region. Past events (date already gone) are dropped automatically by the miner, so a nonzero "dropped" count here is normal/expected, not an error. Then run \`python3 scripts/tickets-mining/resolve_venue_cities.py\` (only queries Wikidata for NEW stadiums, ~1s each, cached in venue_cities.json; unresolved ones can be added by hand to venue_city_overrides.json) and re-run refresh_tickets.py so new venues get their city. git add src/data/tickets.ts scripts/tickets-mining/venue_cities.json scripts/tickets-mining/venue_city_overrides.json alongside everything else. Print its summary too.

Finally, run \`npx tsx scripts/catalog-mining/track_price_drops.mts\` LAST, after every other store/offer update above has already landed in the data files — it diffs today's prices against yesterday's snapshot (price_snapshot.json, next to the script) and writes src/data/priceDrops.json with every offer that got cheaper, which is what powers the site's price-drop badge/section/filter (\"Bajaron de Precio\"). Since 2026-09-25 it covers ALL SEVEN sections (camisetas, botas, entradas, ropa, guantes, pelotas, entrenamiento), not just camisetas: it replaced track_price_drops.py, which only rewrote products.ts with regex and therefore never flagged a boot or a ticket — ver src/lib/priceDrops.ts. It also appends today's price to a rolling per-offer history (src/data/priceHistory.json, capped at the last 14 days, SOLO camisetas: ese archivo ya pesa 8 MB con una sección y el límite que ajusta en Hobby es el almacenamiento), which is what powers the price-history sparkline on the product detail page (src/components/PriceHistorySparkline.tsx) — It ALSO appends every price CHANGE (all seven sections, change-only, never trimmed) to the durable archive data/price-history/YYYY-MM.jsonl (added 2026-10-02; read by src/lib/priceArchive.ts for the "mínimo histórico" line on the product page, the monthly price index and the sitemap lastmod) — git add that directory too. git add and commit price_snapshot.json, src/data/priceDrops.json AND src/data/priceHistory.json alongside the data files every time, same reason as the other state files: losing alguno just means tomorrow's run (or the sparkline) loses a day of real data, not a crash. Then run \`npx tsx scripts/catalog-mining/broadcast_price_drops.mts\` (added 2026-09-25) — publica las mejores bajadas al canal de Telegram, ordenadas por descuento POR comisión esperada (una bota al 30% vale mucho más que un cono al 30%, ver src/lib/commissionRates.ts). Sin TELEGRAM_BOT_TOKEN y TELEGRAM_CHANNEL_ID en .env.local hace un ENSAYO: imprime los mensajes y no publica nada, que es el comportamiento correcto hasta que existan esas dos variables. git add scripts/catalog-mining/telegram_posted.json (el estado que evita repetir una bajada ya publicada) cuando exista.

Tras refrescar equipamiento, corre \`python3 scripts/gear-mining/check_gear_ids.py\` (agregado 2026-09-27): comprueba que la URL de una ficha de equipamiento NO se mueve cuando el proveedor cambia de CDN, de idioma o reescribe el titulo. Eso paso de verdad el 27-09 (Foot-Store hizo las dos cosas a la vez) y mato 5.912 URLs en 48 horas; el registro scripts/gear-mining/gear_ids.json es lo que lo impide, y HAY QUE COMMITEARLO siempre junto a los .ts de equipamiento -- si se pierde, todas las URLs se vuelven a sortear. RESUELTO 2026-09-27 (Crystal Palace 26/27, que quedo sin aplicar tres dias): el Palace **invirtio sus colores esta temporada**, juega de BLANCO en casa y a rayas fuera, asi que la etiqueta "Domicile" del feed para la camiseta blanca con banda era CORRECTA -- la suposicion de que la primera del Palace son rayas rojiazules ya no vale para 26/27. Codigo de estilo blanco 600153340001 = **HOME** ("Eagle Sash", vuelve la banda diagonal 50 anos despues, confirmado por cpfc.co.uk y about.macron.com). Codigo negro 600153380001 = **AWAY** ("Eagle Black", base negra con detalles rojos y azules). La tercera de esta temporada es la "Eagle Wings" (rayas diagonales tipo rayo), que es OTRA camiseta y no ninguna de estas dos. Aplicarlas con esos dos slots.

After applying changes: npx tsc --noEmit, dupe-check id fields in products.ts, npm run build, commit and push. Pushing NO LONGER deploys anything: since 2026-09-29 the site is served from THIS machine (next start on 127.0.0.1:3100 behind a Cloudflare tunnel, Vercel paused the account) and this script runs scripts/deploy_local.sh by itself after you finish -- do NOT run it yourself, and NEVER stop/kill the fc-web or fc-tunnel services or any process listening on port 3100 (careful with pkill -f next: that is the live site). Ignore Vercel \"deployment failed\" emails. If nothing new is found, just say so — don't force a commit." \
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

# Safety net for a real bug found twice (2026-09-01, 2026-09-02): the run
# above can finish -- sometimes genuinely completing all its mining work --
# without ever reaching its own "commit and push" instruction, both times
# because the interactive Bash tool went down mid-run and the agent
# gracefully reported status instead of crashing loudly. That left real,
# valid, typecheck-clean work sitting uncommitted in this shared working
# directory both times, discovered by accident days later and recovered by
# hand. This tries the same recovery automatically instead of depending on
# someone noticing.
send_alert() {
  local subject="$1" body="$2"
  local api_key to
  api_key="$(grep '^RESEND_API_KEY=' .env.local | cut -d= -f2-)"
  to="$(grep '^REPORT_EMAIL_TO=' .env.local | cut -d= -f2-)"
  [[ -z "$api_key" || -z "$to" ]] && return
  curl -s -X POST https://api.resend.com/emails \
    -H "Authorization: Bearer $api_key" \
    -H "Content-Type: application/json" \
    -d "$(node -e "console.log(JSON.stringify({from:'Football Cult <onboarding@resend.dev>', to: process.argv[1], subject: process.argv[2], text: process.argv[3]}))" "$to" "$subject" "$body")" \
    > /dev/null
}

if [[ $CLAUDE_EXIT -ne 0 ]]; then
  send_alert "Daily scan failed (exit $CLAUDE_EXIT)" "The headless run at $(date -u +%Y-%m-%dT%H:%M:%SZ) exited with code $CLAUDE_EXIT. Check scripts/daily_scan.log on the Mini PC for details."
  # Precios y stock ya los dejó el refresco determinista de arriba; lo que
  # Claude hace al final (bajadas de precio, historial) se hace aquí, salvo
  # que Claude llegara a hacerlo antes de fallar (snapshot ya tocado).
  if [[ ! scripts/catalog-mining/price_snapshot.json -nt "$SCAN_MARK" ]]; then
    npx tsx scripts/catalog-mining/track_price_drops.mts 2>&1 | tail -2
  fi
fi
rm -f "$SCAN_MARK"

if printf '%s' "$REFRESH_OUT" | grep -q '^AVISO amazon:'; then
  send_alert "Amazon: ofertas sin verificar a punto de caducar" "$(printf '%s' "$REFRESH_OUT" | grep -A200 '^AVISO amazon:' | grep -E '^(AVISO|    )')

Sin PA-API no se puede leer el precio de Amazon en bloque: cada oferta caduca (inStock:false) a los 14 días sin verificar. Abrir cada enlace, corregir el precio en src/data/products.ts si cambió y marcarla verificada con el comando de arriba."
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "=== $(date -u +%Y-%m-%dT%H:%M:%SZ) uncommitted changes found after run, attempting safety-net commit ==="
  BRANCH="$(git branch --show-current)"
  # Explicit allowlist, not `git add -A`/`.` -- this shared working
  # directory can have unrelated clutter sitting in it (seen in practice:
  # stray debug logs from other tooling) that must never get swept into an
  # unattended commit. Only the exact files this pipeline is documented
  # above to touch.
  git add \
    src/data/products.ts \
    src/data/productDominantColors.json \
    src/data/priceHistory.json \
    src/data/priceDrops.json \
    src/data/boots.ts \
    src/data/bootTierData.json \
    src/data/bootDominantColors.json \
    src/data/gloves.ts \
    src/data/balls.ts \
    src/data/apparel.ts \
    src/data/training.ts \
    src/data/tickets.ts \
    scripts/tickets-mining/venue_cities.json \
    scripts/tickets-mining/venue_city_overrides.json \
    scripts/catalog-mining/ebay_full_cycle_state.json \
    scripts/catalog-mining/ebay_full_cycle_state_IT.json \
    scripts/catalog-mining/ebay_full_cycle_state_ES.json \
    scripts/catalog-mining/ebay_stale_check_state.json \
    scripts/catalog-mining/price_snapshot.json \
    data/price-history \
    2>/dev/null

  if git diff --cached --quiet; then
    echo "=== safety net: nothing from the known file list was staged, leaving as-is ==="
  elif npx tsc --noEmit && node -e '
      const fs = require("fs");
      const src = fs.readFileSync("src/data/products.ts", "utf8");
      const start = src.indexOf("const productsData = [");
      const ids = [...src.slice(start).matchAll(/^\s*id:\s*"([^"]+)",/gm)].map((m) => m[1]);
      const seen = new Map();
      for (const id of ids) seen.set(id, (seen.get(id) || 0) + 1);
      const dupes = [...seen.entries()].filter(([, c]) => c > 1);
      if (dupes.length > 0) { console.error("duplicate ids:", dupes); process.exit(1); }
    '; then
    git commit -m "Daily scan safety-net commit ($(date -u +%Y-%m-%d))

The scan above finished without reaching its own commit/push step --
recovered here after verifying tsc + the duplicate-id check pass clean."
    git push origin "$BRANCH"
    echo "=== safety net: recovered and pushed to $BRANCH ==="
    send_alert "Daily scan: safety-net commit recovered work on $BRANCH" "The scan's own commit/push step didn't run, but the safety net verified (tsc + duplicate-id check) and pushed it after the fact. No action needed, just flagging in case it happens often enough to be worth investigating why."
  else
    git reset -- src/data/products.ts src/data/productDominantColors.json src/data/priceHistory.json src/data/boots.ts src/data/bootTierData.json src/data/bootDominantColors.json scripts/catalog-mining/*.json
    echo "=== safety net: FAILED verification, left uncommitted for manual review ==="
    send_alert "Daily scan: uncommitted changes need manual review" "Uncommitted changes are sitting in /home/piojo/football-cult on branch $BRANCH, but they failed tsc or the duplicate-id check, so the safety net left them uncommitted on purpose. Needs a manual look before committing -- don't just force it through."
  fi
fi

# Un club nuevo que entra al catálogo sin liga en teamMeta.ts se trata como
# selección nacional en silencio: se queda fuera de /liga/ y /pais/ y nadie
# se entera, porque su página /equipo/ sí existe igual. No bloquea nada (no
# es corrupción de datos, la ficha funciona), solo avisa.
TEAM_LEAGUE_OUT="$(python3 scripts/check_team_leagues.py 2>&1)"
echo "$TEAM_LEAGUE_OUT"
if printf '%s' "$TEAM_LEAGUE_OUT" | grep -q '^AVISO teamMeta:'; then
  send_alert "Daily scan: club nuevo sin liga en teamMeta.ts" "$TEAM_LEAGUE_OUT

Agregarlo a TEAM_LEAGUE en src/data/teamMeta.ts (y la liga a LEAGUES si no existe todavía). Si a propósito no va a tener liga, sumarlo a KNOWN_WITHOUT_LEAGUE en scripts/check_team_leagues.py con el motivo."
fi

# Las fichas retro no guardan en ningún campo qué equipación son: el
# typeKey es "retro" para las 5.234 y la variante vive solo en el sufijo
# del id, que es de donde la lee kitTypeName (src/lib/productMeta.ts).
# Si una pasada genera un id retro con un sufijo que no está en esa
# lista, la ficha vuelve a compartir <title>, meta descripción y JSON-LD
# con las otras equipaciones del mismo equipo y temporada -- en silencio,
# que es justo como estuvo hasta el 2026-09-28. Ver el comentario largo
# de scripts/check_retro_kit.mts.
RETRO_KIT_OUT="$(npx tsx scripts/check_retro_kit.mts 2>&1)" || send_alert "Daily scan: ficha retro sin equipación en el id" "$RETRO_KIT_OUT

Arreglar el id en src/data/products.ts para que termine en una de las seis equipaciones (-home/-away/-third/-goalkeeper/-training/-prematch, con cola de colorway opcional). Si de verdad apareció una equipación nueva que no estaba contemplada, sumar el sufijo a RETRO_KIT en src/lib/productMeta.ts y traducirlo en typeNames."
echo "$RETRO_KIT_OUT"

# Fecha de alta de cada ficha, para /novedades (agregado 2026-09-28). Sale del
# historial de git y no de la historia de precios, cuyas URLs de Awin cambian
# entre descargas y reinician la fecha. Va ANTES de IndexNow para que la página
# de novedades ya tenga las fichas de hoy cuando se avisa a Bing.
python3 scripts/catalog-mining/first_seen.py 2>&1 | tail -2
if ! git diff --quiet -- src/data/productFirstSeen.json; then
  git add src/data/productFirstSeen.json
  git commit -q -m "chore(novedades): fechas de alta del $(date +%Y-%m-%d)" && git push -q origin "$(git rev-parse --abbrev-ref HEAD)"
fi

# IndexNow (Bing, Yandex, Seznam, Naver) -- agregado 2026-09-28. Hasta ese
# día solo se había mandado a mano, dos veces. Bing tenía 61,7K URLs nuestras
# descubiertas y CERO indexadas, y es el índice que alimenta Yahoo,
# DuckDuckGo, Ecosia y la búsqueda de ChatGPT: el canal donde nuestra falta de
# autoridad pesa menos. Todas las noches van los hubs (unos cientos, cambian
# con el catálogo).
# SOLO hubs, nunca --all: el 2026-09-29 Vercel pausó el sitio entero por
# superar el plan Hobby (escrituras ISR 7,5x el límite, solicitudes CDN 3x).
# Mandar 14.000 URLs a Bing invita a rastrearlas todas, y cada ficha que no
# está en caché se regenera: es una escritura ISR y CPU por URL.
python3 scripts/indexnow.py 2>&1 | tail -3

# El mismo anuncio en dos fichas (año suelto vs temporada): lo deja solo en la
# de su temporada real. Agregado 2026-09-30, ver el docstring del script.
if python3 scripts/catalog-mining/dedupe_same_url.py --apply | tail -1 | grep -q "aplicado"; then
  git add src/data/products.ts src/data/productAliases.ts && \
    git commit -q -m "chore(catalogo): mismo anuncio en dos fichas, deduplicado ($(date +%Y-%m-%d))" && \
    git push -q origin "$(git rev-parse --abbrev-ref HEAD)"
fi

# Publicar en el servidor de esta PC (desde 2026-09-29; antes lo hacía Vercel
# al recibir el push). Va al final para incluir todos los commits de la noche.
scripts/deploy_local.sh 2>&1 | tail -5
