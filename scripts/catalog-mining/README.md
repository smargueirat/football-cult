# Catalog mining scripts

Read-only extraction tooling used to find and add real jerseys from the
approved Awin feeds (Foot-Store ES/FR, Sport is Good ES/FR, PlanetFoot,
adidas ES/PT, BSTN IT) into `src/data/products.ts`.

- `extract.py` — `TEAM_PATTERNS` / `TYPE_PATTERNS` regexes, jersey/exclude
  filters, season detection, kids-signal detection.
- `pick.py` — picks the best-titled, best-priced offer per (team, type)
  from a feed CSV. Supports `sport_category_col` for adidas feeds (their
  `custom_2` column names the real sport — required to avoid pulling in
  rugby/handball/volleyball items that share a team name with football).
- `split_picks.py` — classifies picks against the current catalog into
  new products vs. add-to-existing-offer vs. season-conflict (skipped).
- `gen_new_teams.py` — generates TS product blocks for genuinely new
  team+type combos, pulling team metadata from `new_teams_batch*.py`,
  falling back to colors already in `products.ts` for older teams.
- `refresh.py` — brace-depth-aware `products.ts` block parser + offer
  inserter (`split_blocks`).
- `new_teams_batch1.py`..`new_teams_batch5.py` — accumulated team
  metadata (name in es/en/pt, colorHex, colorHexSecondary, regex) for
  every team added beyond the original ~24. Add new teams to a new
  `new_teams_batch6.py` file and wire it into `gen_new_teams.py`'s
  imports rather than editing old batch files.

## Adding a team found in the feeds

1. Add its regex to `TEAM_PATTERNS` in `extract.py`.
2. Add its tuple to the current highest `new_teams_batchN.py`.
3. Add the `TeamKey` union member + `teamCategory`/`teamNames`/
   `teamFlags`/`teamColors` entries in `src/data/products.ts`.
4. **Before adding, verify by downloading and looking at the actual
   product photo** — this catalog has repeatedly caught rugby, handball,
   volleyball, basketball, motorsport, and "Classic"/"Copa" retro
   lifestyle items that share a team/country name with a real football
   club. A jersey-sounding title is not enough; check the crest/sponsor
   patch in the photo.
5. Re-run the pipeline per store (see below), review picks for the
   known false-positive classes before applying: retro/heritage items
   (bare non-current-season 2-digit suffixes like "86"/"95"/"90/92"),
   cross-language team-name collisions, adidas items whose `custom_2`
   isn't football.

## Running a full mining pass (one store)

```bash
cd scripts/catalog-mining

# 1. Fetch the feed fresh (see check-prices cron route for the env var names)
python3 -c "
import re, urllib.request, gzip
url = re.search(r'AWIN_FEED_URL_FOOTSTORE_ES=(.+)', open('../../.env.local').read()).group(1).strip()
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
raw = urllib.request.urlopen(req, timeout=60).read()
try: data = gzip.decompress(raw)
except OSError: data = raw
open('/tmp/footstore_es.csv', 'wb').write(data)
"

# 2. Extract best picks (column args vary per store — Awin format vs Google format;
#    see FEED_URLS / the price-parsing comment in src/app/api/cron/check-prices/route.ts)
python3 pick.py /tmp/footstore_es.csv search_price delivery_cost /tmp/picks.json

# 3. Split against current catalog
python3 split_picks.py /tmp/picks.json
# -> prints new_products / add_offers / season_conflict counts,
#    writes /tmp/picks_NEW.json and /tmp/picks_ADD.json

# 4. Review /tmp/picks_NEW.json and /tmp/picks_ADD.json by hand (see step 4 above)

# 5. Generate new-product TS blocks, append, apply add_offers
python3 gen_new_teams.py /tmp/picks_NEW.json FootStoreES EUR /tmp/new_blocks.ts
python3 -c "
import sys; sys.path.insert(0, '.')
from refresh import split_blocks
content = open('../../src/data/products.ts', encoding='utf-8').read()
head, blocks, tail = split_blocks(content)
new_blocks = open('/tmp/new_blocks.ts', encoding='utf-8').read()
open('../../src/data/products.ts', 'w', encoding='utf-8').write(head + ''.join(blocks) + new_blocks + tail)
"
python3 refresh.py ../../src/data/products.ts /tmp/picks_ADD.json FootStoreES EUR "" --apply

# 6. From the repo root: npx tsc --noEmit, dupe-check the id: fields, npm run build,
#    then commit/push (triggers the Vercel deploy).
```

Repeat per store: FootStoreES, FootStoreFR, SportIsGoodES, SportIsGoodFR,
PlanetFoot, AdidasES, AdidasPT, BSTNIT — each has a slightly different
column layout, see the `FEED_URLS`/`FeedRow` handling in
`src/app/api/cron/check-prices/route.ts` for the price-field quirks
(Google-format feeds put the real charged price in `sale_price`, not
`price`).

## Safety rule (standing, do not change)

Never automate login/"Join"/apply/write actions on any affiliate network
account (Awin, CJ, Rakuten, Impact.com, Skimlinks, Webgains) or any
store. Only read-only HTTP fetches of already-known feed URLs are
permitted here. The user does every login/apply/signup step themselves.
