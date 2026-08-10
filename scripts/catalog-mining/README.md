# Catalog mining scripts

Read-only extraction tooling used to find and add real jerseys from every
approved Awin feed into `src/data/products.ts`. The set of approved
stores is not fixed — it's whatever has an `AWIN_FEED_URL_*` entry in
`.env.local` at the time. **Always enumerate that list fresh (`grep
'^AWIN_FEED_URL_' .env.local`) rather than hardcoding a store list**,
so a newly-approved connection is picked up automatically the next time
this runs. As of the last full mining pass it had 11 entries:
PlanetFoot, FansJerseyHub, ComoFC, DeporteOutlet, Foot-Store ES/FR,
Sport is Good ES/FR, adidas ES/PT, BSTN IT — plus **Mystery Shirt Club**
(Shopify, not Awin) and **eBay** (Partner Network, not Awin either), both
onboarded without an `AWIN_FEED_URL_*` entry (see below).

## eBay (Partner Network + Browse API — not Awin)

Approved separately from Awin: eBay Partner Network (EPN, for affiliate
commission/tracking — free to join, gives a numeric Campaign ID) plus a
separate eBay Developer Program registration (also free) for API access
(Browse API). Credentials live in `.env.local`/Vercel as
`EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET`, `EBAY_CAMPAIGN_ID`. The OAuth
flow used (`client_credentials` grant, app-level token) is server-to-
server with our own issued API keys — not a user login, same read-only
posture as everything else here.

Unlike every Awin store (one bulk feed to filter), eBay has **no bulk
feed** — `ebay_mine.py` runs one Browse API search per (team, type),
picks the cheapest result that survives filtering, then makes one more
"get item" call just for that single winner to read its real size list
(search results don't include sizes). Has resume support (re-run with
the same `out_path` and it skips teams already in that file) since a
full 208-team run is ~600+ API calls and can hit a transient network
timeout partway through — don't lose partial progress on a crash.

```bash
cd scripts/catalog-mining
python3 ebay_mine.py all /tmp/ebay_picks.json      # or a text file, one TeamKey per line, instead of "all"
python3 split_picks.py /tmp/ebay_picks.json         # same new/add/season-conflict split as Awin stores
python3 gen_new_teams.py /tmp/ebay_picks_NEW.json eBay USD /tmp/ebay_new_blocks.ts
# ...then the same insert-blocks + refresh.py --apply steps as any other store (see below)
```

**False-positive classes found and fixed while building this**:
- eBay is dominated by used/second-hand listings — filtered at the API
  level via `filter=conditionIds:{1000|1500|1750}` (New / New with tags
  / New without tags), not by trusting title wording.
- SEO spam: a **$11.75 "Chelsea Home Jersey Sleeve Sponsor Patch Print"**
  turned out to be just a sponsor logo decal, not a garment — "jersey"
  in the title was enough to pass `JERSEY_RE` alone. Fixed with a
  `MIN_JERSEY_PRICE` floor ($15) plus an `ACCESSORY_RE` check for
  patch/decal/sticker/badge wording.
- The opposite problem: a **$699.99 Sevilla listing** became "the"
  price with no cheaper alternative found, which is useless for a
  price-comparison site even though the listing itself was genuine.
  Fixed with a `MAX_JERSEY_PRICE` ceiling ($500 — authentic/player-issue
  tier jerseys legitimately run $150-400, so this only catches real
  outliers).
- `"youth"` wasn't in `EXCLUDE_RE`'s kids-signal list (only
  `kids?|junior|niñ|bambin[oa]|...` etc.) — a **Man City "Youth" jersey**
  was being picked as the cheapest "home" candidate. Added.
- **Country/club name collision**: searching for national team "Ukraine"
  matched a listing for club **Shakhtar Donetsk** that merely mentioned
  "Ukraine" in its marketing title — a different entity entirely, not
  the national team. No general regex fix applied (too narrow/risky to
  generalize); dropped by hand. Watch for this class specifically when
  reviewing eBay picks for any national team whose search terms overlap
  with a well-known club's marketing copy.
- `split_picks.py`'s `detect_season()` can misread a kids age-range
  ("13-14 YEARS") or a no-separator "2025 2026" year pair as the wrong
  season — same class of bug as the retro pipeline's Como-1907/kids-age
  fixes below, not yet ported into `split_picks.py`/`gen_new_teams.py`.
  Produces false `season_conflict` skips (harmless — same
  skip-rather-than-guess default) rather than bad data, so left as a
  known gap rather than blocking on it.

### Full eBay pass (`ebay_mine_full.py`) — every type, kids, and retro

`ebay_mine.py` (above) only ever covers current-season home/away/third
for adults. `ebay_mine_full.py` covers everything else eBay actually has
in New condition: goalkeeper and training (already recognized by
`TYPE_PATTERNS`, just never queried before), a kids pass, and a retro
pass that keeps **every** distinct historic season found per (team,
type) — same "don't collapse to one" philosophy as the retro pipeline
below, not just the cheapest overall.

```bash
cd scripts/catalog-mining
python3 ebay_mine_full.py all /tmp/ebay_full      # writes current_picks.json, kids_picks.json, retro_picks.json
# current_picks.json -> the normal split_picks.py -> gen_new_teams.py -> refresh.py flow
# kids_picks.json    -> gen_kids_teams.py (gen_new_teams.py has no ageGroup support; id is
#                        "{team}-{type}-kids", no season suffix, season field hardcoded "2026")
# retro_picks.json   -> wrap each entry as {key: [offer]} with a "store": "eBay" field added,
#                        then retro_gen.py (its input shape is normally multi-store, eBay is single-store)
```

Full team-list run is ~2000+ API calls (5 current types + 3 kids types +
3 retro types per team) — budget several hours, run in the background.
Same resume support as `ebay_mine.py` (per output file, keyed by team).

**Bugs found and fixed while building this** (both live in the shared
`extract.py`, so they also benefit the Awin pipeline):
- **Query text was suppressing real results.** Baking `"2025 2026"` into
  the current-pass query (or `"retro vintage"` into the retro pass) makes
  eBay's relevance ranking treat those words as near-required — a
  genuinely current listing titled `"...2024-25..."` (different season
  notation) or a genuinely old listing with no "retro"/"vintage" wording
  at all (just an old listing being resold as-is) silently drops out of
  the results entirely, not just out of the winning pick. Confirmed by
  hand: searching `"Heidenheim soccer jersey"` (no bias words) surfaced
  real 2013/14 and 2017/18 shirts that `"Heidenheim ... retro vintage"`
  never found. Fixed by dropping season/retro words from the query text
  — `SEASON_OK_RE` / `parse_retro_season()` already do the real
  classification on the results, so the query itself should stay broad.
  The kids pass keeps `"kids youth"` in its query on purpose: unlike a
  season year (which has many equally-common formats), "kids"/"youth" is
  a near-universal, low-variance word sellers actually use, so biasing
  toward it trades away much less recall than season/retro wording did.
- `KIDS_SIGNAL_RE`'s bare `"N-N"` age-range fallback (no units word) also
  matches a season suffix — a title ending in `"... 26-27"` (2026-27
  season) was misread as ages 26-27 and mislabeled two adult jerseys
  (Bosnia, Uzbekistan) as kids products. Fixed by restricting that
  no-units fallback to plausible kid ages (0-17); a units word (ans/
  years/años) still allows any digit count, same as before.
- **Brand-name/country-name collision**: Jordan (the country)'s
  `TEAM_PATTERNS` regex includes the bare word "jordan" — which also
  matches Nike's "Jordan"/"Air Jordan" sub-brand, heavily used in PSG's
  marketing copy (PSG's kits are a real Jordan Brand collaboration). A
  "jordania" retro search came back ~80% PSG stadium/away/third shirts
  ("Nike Jordan Paris Saint-Germain 2021/22...") with only a handful of
  shirts that actually said "JORDAN NATIONAL TEAM FOOTBALL". A
  goalkeeper current-pick had the same root cause from a different
  angle: "JORDAN BRAZIL GOALKEEPER..." — Brazil's goalkeeper is named
  Jordan, so this was a *player name*, not the country, on someone
  else's national team shirt. No general regex fix applied (same call as
  the standing Ukraine/Shakhtar collision below — too narrow/risky to
  generalize past "the word happens to be a common name/brand too");
  dropped by hand, keeping only listings that explicitly said "national
  team". Watch for this whenever a country key is also a common first
  name, brand, or word (Jordan, India below, and probably others not hit
  yet — Georgia/the US state, Chad, Niger, Turkey/the bird are the
  obvious next candidates to watch).
- **National-team key matching domestic clubs**: "india" and "zambia"'s
  retro/current picks included real jerseys from real teams that are NOT
  the national team — Kerala Blasters, Real Kashmir, NorthEast United
  (Indian Super League clubs) and Nkana FC (Zambian club, confirmed by
  photo: Betway sponsor, club crest, not the copper/green national kit).
  These countries don't have any of their domestic clubs in our catalog
  as separate TeamKeys, so there was nothing for these picks to
  correctly attach to — dropped by hand rather than mislabeling them as
  the national team. If any of these clubs are worth adding as their own
  TeamKey later, that's the right fix; until then, this is a recurring
  false-positive class specifically for country keys whose domestic
  leagues are otherwise unrepresented in the catalog.
- **`split_picks.py`'s season-conflict check was too strict — fixed, not
  just documented as a known gap this time.** Running the full 208-team
  pass, ~118 of ~373 current-season picks got skipped as
  `season_conflict` even though most were the SAME season written
  differently (our own `"2026"` bare-year convention for a national
  team's World Cup kit vs. a listing titled `"2025/26"` — same season).
  Fixed with `season_end_year()`/`seasons_equivalent()`: canonicalize to
  the season's ending year (`"2026"` → 2026, `"2025/26"` → 2026,
  `"2026/27"` → 2027) and compare that instead of the raw string — a
  real next-season conflict (2026 vs 2027) still correctly skips.
  Rescued ~60 legitimate offers. Also fixed two root causes in
  `detect_season()` itself while in there: it had no pattern at all for
  full `"YYYY/YYYY"`-style seasons (`"2025/2026"`, all 4 digits both
  sides) — fell through to grabbing just the bare first year instead;
  and its generic 2-digit `"NN-NN"` pattern (meant for `"25-26"`) had no
  lower bound, so a kids age-suffix like `"...13-14 YEARS"` on an
  **Italy** listing whose real season (`"2026 - 2027"`) was sitting
  right there in the same title got misread as season `"2013/14"`
  instead. Now strips a trailing age suffix first (same
  `TITLE_KIDS_AGE_SUFFIX_RE` the retro pipeline already used for this)
  and requires the 2-digit pair's first number to be a plausible
  season-start year (24-30), not just any two consecutive digits.
- **Retro picks can collide with a product `retro_gen.py` already
  created from an Awin store** (same team+type+season, different
  source) — `retro_gen.py` has no dedup check of its own, so blindly
  running it on eBay's retro picks without checking first would produce
  a duplicate `id`. Check existing retro product ids first (by parsing
  `products.ts` for `typeKey: "retro"` blocks) and route collisions
  through a normal "merge this store's offer into the existing block"
  path instead of `retro_gen.py`, which should only ever see genuinely
  new team+type+season combos.
- **Kids products don't get their offers refreshed.** `refresh.py`
  explicitly skips `ageGroup: "kids"` blocks (by design, since it has no
  concept of age group at all) — so if a kids product already exists
  from an earlier mining pass, a new eBay kids pick for that exact
  team+type is silently dropped rather than added as a second offer or
  used to refresh the price. `gen_kids_teams.py` only ever creates
  genuinely new kids products. Known gap, not fixed yet — a
  `refresh_kids.py` analogous to `refresh.py` (keyed by `id` ==
  `"{team}-{type}-kids"` instead of team+type) would be the right fix
  if this starts mattering (kids prices going stale).
- **Two much bigger bugs, found by asking "why does Boca Juniors have
  zero eBay picks across every category despite being one of the most
  commercially popular clubs in the catalog's own stated focus
  (Argentina)":**
  - `EXCLUDE_RE`/`RETRO_EXCLUDE_RE` had a bare `junior` (for excluding
    kids sizing) with **no word boundary** — it matched as a *substring*
    of "Juniors", so literally every "Boca **Juniors**" listing got
    excluded, current AND retro, this whole project's history (Awin
    included, not just eBay — only 3 hand-seeded Boca products existed
    before this fix, all from the original MVP seed data). Fixed to
    `\bjunior\b` in both files. Checked every other team's real name
    against `EXCLUDE_RE` for the same self-collision class after fixing
    this one — none currently hit it, but re-check this whenever a new
    team gets added whose name might contain "kids"/"baby"/"mini"/
    "short"/"fan"/etc. as a substring.
  - `ebay_mine_full.py`'s `SEASON_OK_RE` (current-season filter) only
    matched a full 4-digit-prefixed season (`"2025/26"`) or a bare
    `"2026"` — but the large majority of real eBay titles use the short
    2-digit form (`"25/26"`, see literally every real Boca/Valencia
    result: `"Adidas Boca Juniors 25/26 Home..."`), so almost every
    current-season listing using that extremely common notation was
    silently rejected regardless of the junior bug. Replaced with
    `is_current_season()`, which reuses `split_picks.py`'s
    `detect_season()`/`season_end_year()` (already handles every width)
    instead of a second, narrower hand-rolled regex — but guards against
    `detect_season()`'s "assume 2025/26" default (fine for comparing
    against an already-vetted catalog entry, not fine for deciding
    whether to trust a brand-new eBay listing sight unseen): a title with
    no season indicator at all must not silently pass as current.
  - Between the two, this is likely the single highest-impact fix in
    this pipeline's history — it wasn't just Boca, it was **every**
    current-season pick across **every** team that happened to use
    2-digit season notation, silently discarded before ever reaching the
    price/photo filters. Re-ran the full team list after fixing both;
    if a "why does team X have suspiciously little/no coverage" question
    ever comes up again, check these two classes first.

## Stores without an Awin datafeed CSV (Mystery Shirt Club)

Not every newly-approved Awin advertiser has a CSV datafeed we can list —
some newly-approved programs don't show up with a feed URL at all. For
those, check whether the merchant runs a public Shopify storefront: its
own `https://<domain>/products.json?limit=250&page=N` endpoint is public,
unauthenticated, and paginates the whole catalog — no Awin login and no
merchant login involved, same read-only-only-known-URL rule as any CSV
feed, just a different URL shape. Confirm it's actually on Awin (and get
the merchant/advertiser id needed for deep links) by fetching the store's
homepage HTML and grepping for `awin-shopify-integration-code.js?aid=` —
the `aid` query param is the `awinmid` to use in
`https://www.awin1.com/cread.php?awinmid=<aid>&awinaffid=3013769&ued=<url-encoded product url>`.
Mystery Shirt Club's `aid` is `124324`, domain `mysteryshirtclub.com`.
Price re-checks for it are wired into
`src/app/api/cron/check-prices/route.ts`'s `SHOPIFY_STORES` map/
`fetchShopifyFeed`, parallel to `FEED_URLS`/`fetchFeed` for CSV stores.

`shopify_feed_to_csv.py <domain> <awinmid> <out_csv>` turns the Shopify
JSON into a CSV with the same column names `pick.py`/`extract.py` expect
(`product_name`, `price`, `custom_1` for size, `aw_deep_link`,
`aw_image_url`), so the rest of the pipeline runs unchanged from
"3. Split against current catalog" onward — just run
`python3 pick.py <out_csv> price "" /tmp/picks.json` (price col is
`price`, not the Awin-CSV default `search_price`).

**New false-positive class found in this store**: "Concept Football
Shirt" listings (vendor tag/logo "AIRO Sportswear") are unlicensed
fan-made mockups with a generic crest, not the real federation kit —
excluded via `\bconcept\b|\bairo\b` in `EXCLUDE_RE`/`KIDS_EXCLUDE_RE`.
Verified by photo: the "crest" reads e.g. "MEXICAN FOOTBALL 1923"
instead of the real FMF badge.

**Season-string bug found in this store**: `split_picks.py`'s
`detect_season()` didn't handle `YYYY-YYYY` (4-digit hyphen 4-digit,
e.g. "2026-2027") titles, only `YYYY/YY` — it fell through to matching
just the bare first year ("2026"), which happened to coincide with our
own bare-year convention for World Cup-year national team kits but
produced spurious `season_conflict` skips for everything else. Fixed by
adding a `YYYY-YYYY` branch that folds to the `YYYY/YY` form before the
older patterns run.

If a store shows up with an `AWIN_FEED_URL_*` but has few or no offers
yet in `products.ts` (check with `grep -c 'store: "StoreName"'`), treat
it as a brand-new connection: do a **full** mining pass against its
whole feed (every team we track, not just a spot-check), the same way
each store above was first onboarded — not just an incremental
re-scan. A newly-approved store can also be the source of teams/clubs
we don't have yet, so run the unmatched-title scan against it too
(see "Adding a team" below) instead of assuming its catalog only
contains teams we already know.

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
  inserter (`split_blocks`). Looks for the array via the literal
  `const productsData = [` marker (see "products.ts array size" below) —
  if that declaration is ever renamed, update `start_marker` here too.
- `unmatched_scan.py <csv> <google|awin> <out.json> [min_count]` — finds
  jersey-titled rows that pass `JERSEY_RE`/`EXCLUDE_RE` but match no
  `TEAM_PATTERNS` entry, clustered by normalized title and sorted by
  frequency, for spotting teams/clubs we don't track yet. In practice
  (checked across all 11 stores) the high-frequency clusters are almost
  entirely **blank manufacturer template kits sold without any club
  branding** — "Maillot Macron Rigel", "Camiseta Joma Championship VII",
  "adidas Entrada26", "Uhlsport Distinction", referee shirts, plain
  training tees, etc. — not real omitted teams. Don't assume a cluster is
  a new team just because it's frequent; check the sample title/photo.
- `new_teams_batch1.py`..`new_teams_batch6.py` — accumulated team
  metadata (name in es/en/pt, colorHex, colorHexSecondary, regex) for
  every team added beyond the original ~24. Add new teams to a new
  `new_teams_batch7.py` file and wire it into **both**
  `gen_new_teams.py`'s and `retro_gen.py`'s imports (both maintain their
  own separate `BATCH1..N` merge — batch6 was added to the file but only
  wired into one of the two once, and every pick for those teams
  silently printed "no metadata found" until the second import was
  added too) rather than editing old batch files.

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

**Retro/heritage items that only reveal themselves in the description,
not the title** (found 2026-08-07): a bare 2-digit suffix in the title
(e.g. "Maillot del portero de Dinamarca 86") is the only surface signal
— `EXCLUDE_RE`'s `retro|vintage|...` words only appear in the feed's
`description` column ("homenaje... época gloriosa... temporada 86"),
which the pipeline doesn't scan. Since `pick.py`'s `PENALTY_RE` only
*deprioritizes* bare 2-digit suffixes (not in the {24,25,26,27}
near-current set) rather than excluding them, a heritage item can still
win if it's the only/cheapest candidate for that (team, type) in a given
store's feed. **Before applying `_ADD.json`/`_NEW.json`, grep every
store's raw picks (not just the split output) for a title ending in a
bare 2-digit number that isn't a 24-28 season/World-Cup year** — this
catches items a same-season `detect_season()` match would otherwise let
through silently as a normal current-season "add offer". Two real hits
caught this way: BSTN IT's "Liverpool FC Away Jersey 95" (a genuine 1995
Carlsberg-sponsor heritage reissue, confirmed by photo) and Foot-Store's
"Maillot ... Dinamarca 86" (explicit "homenaje" reissue in the
description) on both FootStoreES and FootStoreFR.

**JELEX brand (Deporte Outlet / Sportspar's own house label) sells
unlicensed "retro-style" reproductions** — generic embroidered team name
instead of the real federation crest, describes itself as "aspecto
retro" / "Retro History" even on lines not named that in the title
(e.g. "Alemania 'Performante' JELEX ... Camiseta de tercera
equipación"). Same class as the Concept/AIRO fan-made mockups already
excluded — added `\bjelex\b` to `EXCLUDE_RE`/`KIDS_EXCLUDE_RE` in
`extract.py`.

**Special/anniversary-edition offers can pass season-detection as a
normal current offer while being visually a different product** — e.g.
Deporte Outlet's "S.S. Lazio ... primera equipación 125 años" is a white
anniversary shirt, not Lazio's actual sky-blue home kit; `detect_season`
correctly reads it as the current season so it would silently overwrite/
sit alongside the real home-kit offer on the same product card. Caught
by photo review, not by any regex — worth an explicit spot-check
whenever a title mentions an anniversary ("años"/"aniversario"/
"anniversary") even if the (team, type, season) key looks like a normal
match.

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
PlanetFoot, AdidasES, AdidasPT, BSTNIT, ComoFC, DeporteOutlet,
FansJerseyHub — each has a slightly different column layout, see the
`FEED_URLS`/`FeedRow` handling in `src/app/api/cron/check-prices/route.ts`
for the price-field quirks (Google-format feeds put the real charged
price in `sale_price`, not `price`).

**Exact `pick.py` column args per store**, verified 2026-08-07 (running
with wrong columns doesn't error — it silently returns zero picks, since
`pick_best` just drops every row that has no size match; always sanity-
check the output line count against the store's known catalog size
before concluding a store has nothing new):

```
# Awin-native format (search_price, product_name, aw_deep_link, aw_image_url)
python3 pick.py f.csv search_price delivery_cost out.json product_name custom_1        aw_deep_link aw_image_url            # FootStoreES, SportIsGoodES
python3 pick.py f.csv search_price delivery_cost out.json product_name size_stock_status aw_deep_link aw_image_url          # DeporteOutlet — custom_1 holds "Envío inmediato" shipping text, NOT size
python3 pick.py f.csv search_price delivery_cost out.json product_name "Fashion:size"   aw_deep_link aw_image_url custom_2 # AdidasES, AdidasPT — custom_1 now holds "Adult"/"Kids", real size moved to Fashion:size; custom_2 is still the real sport-category column
python3 pick.py f.csv search_price delivery_cost out.json product_name "Fashion:size"   aw_deep_link aw_image_url          # BSTNIT — same Fashion:size relocation, no sport_category_col needed

# Google-shopping format (price/sale_price, title, aw_deep_link, image_link)
python3 pick.py f.csv price shipping out.json title size aw_deep_link image_link  # ComoFC, FansJerseyHub, FootStoreFR, PlanetFoot, SportIsGoodFR
```

The Awin-format stores' `custom_1` column is NOT a stable "size" column
across merchants — it holds whatever that merchant's feed maps to
`custom_1` (size for FootStoreES/SportIsGoodES, shipping text for
DeporteOutlet, an age-group label for Adidas/BSTN). Google-format feeds
all reliably expose real `size`/`shipping` columns (not just the title-
suffix fallback `pick.py` falls back to) — use them explicitly rather
than relying on `title_size` parsing, which silently drops every row
for stores whose titles don't end in a "- SIZE" suffix (FootStoreFR/
SportIsGoodFR titles never do, so the title-suffix fallback alone
returns zero picks for those two even though real size data exists in
the `size` column).

## Brand field (`Product.brand`)

Every store's feed already includes a manufacturer column — `brand_name`
(Awin-native format), `brand` (Google format), or `vendor` (Mystery Shirt
Club's Shopify JSON) — it just wasn't being captured. `brand_backfill.py
<csv> <google|awin> <StoreName> <out_map.json>` builds a `url -> brand`
map per store (normalizing raw strings like "uhlsport"/"Adidas
Performance" to a fixed `Brand` key via `normalize_brand`); for Mystery
Shirt Club, match by decoding the `ued=` param of the stored
`aw_deep_link` back to the product handle and looking up `vendor` from a
fresh `/products.json` fetch instead (see inline one-off in git history).
`brand_apply.py <maps_dir> [--apply]` then walks every `products.ts`
block, matches each offer's stored URL against that store's map, and
assigns the product's `brand` by majority vote across its offers (a
product with no match in any map is left without a `brand` — still shown
under "all", just not filterable by brand). Re-run this whenever a new
team/offer is mined so it also gets a brand.

`BRAND_FILTERS` in `SearchExplorer.tsx` is a **curated** shortlist (same
reasoning as `QUICK_PICK_TEAMS`) of the brands with real product counts,
not the full `Brand` union — most values in that union exist for
type-safety/future data, not because they're worth their own filter chip
today.

## Retro/vintage jerseys (separate pipeline)

Unlike the mainline pipeline (which deliberately excludes
retro/vintage/heritage listings and keeps only ONE current offer per
team+type), the site also carries a **"Retro"** category (`typeKey:
"retro"`, its own filter chip and nav item) covering every historic
season we can find, for teams already in the catalog. This is a
separate set of scripts because the identity key is different: retro
needs MANY products per team (one per historic season found), not one.

- `retro_extract.py <csv> <google|awin|msc> <StoreName> <out.json>` —
  mines one store's feed for retro rows: jersey + team + type match,
  same junk/kids/rugby/concept exclusions as the mainline `EXCLUDE_RE`
  minus the retro/vintage/classic terms (those are wanted here), plus a
  season genuinely older than 2025 (`parse_retro_season` — handles
  2-digit-year pairs by century-guessing, unlike `split_picks.py`'s
  `detect_season` which assumes 20xx and is only meant for current
  seasons). Run once per store (these CSVs run 200-360MB — fetch,
  extract, delete the raw CSV immediately, one store at a time, or you
  will exhaust `/tmp`'s quota).
- `retro_merge.py <retro_dir> <out.json>` — merges every store's
  `picks_<store>.json` into one dict keyed by `team|type|season`, each
  holding the list of per-store offers for that exact historic design
  (cheapest-per-store, not collapsed further — a Barcelona 1991/92 home
  shirt sold by two stores keeps both as separate offers on one product).
- `retro_gen.py <merged.json> <out_blocks.ts>` — generates the TS product
  blocks, reusing team metadata from `new_teams_batch*.py` first (for
  teams that only have retro stock, no current product yet) and falling
  back to any existing `products.ts` block for that team otherwise.
- After generating, insert the blocks the same way as `gen_new_teams.py`
  (see `refresh.py`'s `split_blocks`), then `npx tsc --noEmit`, dupe-check
  ids, `npm run build`.
- `SEASONS` in `products.ts` (the season-filter chip list) explicitly
  excludes `typeKey: "retro"` products — dozens of loose historic years
  would otherwise flood that filter; retro is browsed via the "Retro"
  type filter/nav item and team search instead.

**False-positive classes found and fixed while building this pipeline**
(all in `extract.py`/`retro_extract.py`, so they benefit the mainline
pipeline too):
- A team's own name embedding a year ("Como 1907") was being read as the
  season on CURRENT stock ("Como 1907 Coach Training Jersey" → wrongly
  "season 1907"). Fixed by masking the matched `TEAM_PATTERNS` span
  before running season detection.
- Kids/age-range size suffixes formatted like a season ("... - 11/12")
  were misread as "season 2011/12". Fixed by running season detection on
  the title with any trailing size/age suffix already stripped (reusing
  `TITLE_KIDS_AGE_SUFFIX_RE`).
- Italian "portiere" (goalkeeper) wasn't in the `goalkeeper` `TYPE_PATTERNS`
  entry, so Italian-store goalkeeper shirts were falling through and
  getting mislabeled home/away/third. Added.
- Italian/French kids terms ("bambino/a", "ragazzo/i", "enfant", "mini")
  weren't in `EXCLUDE_RE`'s kids list (only es/en/pt terms were), letting
  Italian/French kids items through as if they were adult sizing. Added.
- "Concept"/AIRO unlicensed fan-made jerseys (see Mystery Shirt Club
  section above) apply here too, already excluded.
- **2026-08-10**: after splitting `prematch` out of `training` in the
  shared `TYPE_PATTERNS` (see the retro id like `chelsea-retro-202425-
  training` above), re-running the retro pipeline against feeds
  scraped fresh re-classified some already-catalogued "training" retro
  items as "prematch" — same real offer (identical URL), new id, so it
  got inserted as a second product instead of recognized as already
  covered (the retro pipeline has no id-collision check the way
  `gen_new_teams.py`'s callers are expected to add themselves). Found
  by re-running the exact-duplicate-offer-URL scan from the "Adding a
  team" dedup check further down this file, post-insertion, not by any
  automatic guard in the pipeline itself. Same check also caught a few
  pre-existing bare-year-vs-full-range season duplicates (`roma-retro-
  1978-away` / `roma-retro-197879-away`) unrelated to this change.
  **Always re-run that exact-duplicate-URL scan after any batch retro
  insertion**, not just after adding a brand new team pattern.

Given the false-positive history in this exact category (retro/heritage
is explicitly called out in "Adding a team" above as one of the trickiest
classes), **spot-check a diverse sample by photo** before trusting a full
batch — different stores, teams, and decades — rather than assuming the
regex pipeline alone is enough at this scale.

## products.ts array size (TS2590)

Once `productsData` passed ~1,050 entries, `npx tsc --noEmit` started
failing with `TS2590: Expression produces a union type that is too
complex to represent` on the array literal itself — TypeScript's
literal-type checker has a real ceiling when a huge array is checked
directly against an explicitly-typed target (`Product[]`). Fixed by
declaring the array as `const productsData = [...]` (no type annotation,
so TS infers loosely) and casting once at the very end:
`export const products: Product[] = productsData as Product[];` — much
cheaper for the compiler than bidirectional inference over 1000+ object
literals. If this error reappears as the catalog keeps growing, the next
step would be splitting `productsData` into a few `const` chunks
(`productsData1`, `productsData2`, ...) concatenated with `[...c1, ...c2]`
before the cast, since the same TS2590 ceiling is per-literal, not
per-file. Don't revert to a direct `: Product[]` annotation on the
literal — re-run `npx tsc --noEmit` after any large batch add to catch
this early. `refresh.py`'s `split_blocks()` looks for the
`const productsData = [` marker, not the old `export const products`
one — keep both in sync if either is renamed again.

## Rakuten Advertising (FTP Product Catalog — not Awin, not eBay)

A third affiliate network, approved for 5 Brazilian club stores: Santos
Store (MID 54196), Inter Store/Internacional (54197), Cruzeiro Store
(54198), Shop Timão/Corinthians (54200), Loja PST/Sport Recife (54213).
Unlike Awin (one feed URL per store) and eBay (search API, no bulk
feed), Rakuten publishes **every** approved advertiser's catalog to one
shared FTP account:

```
Host: aftp.linksynergy.com  (creds in .env.local: RAKUTEN_FTP_HOST/USER/PASSWORD)
File: {MID}_{SID}_mp.txt.gz   (SID is our channel id, 4733330)
```

**Getting FTP access provisioned is not fully self-service** — after
requesting Product Feeds access from Rakuten support (they set up the
FTP account manually, ~3hr turnaround in practice), the user *also*
has to log into the Rakuten dashboard and click "Apply" per advertiser
under a **Links → Product Feeds** page (in this UI, labeled "Noticias
de productos" in the Spanish translation, not obviously named "Product
Feeds" — easy to miss browsing the other Links submenus, which is what
happened here first). Only after that does the FTP directory actually
populate with that MID's file — same standing safety rule as
everywhere else in this pipeline, the user does that click, not us.

```bash
curl -s --list-only "ftp://aftp.linksynergy.com/" --user "$RAKUTEN_FTP_USER:$RAKUTEN_FTP_PASSWORD"
# lists MIDs and their {mid}_{sid}_mp.txt.gz etc once Apply has been clicked for that advertiser
curl -s -o out.txt.gz "ftp://aftp.linksynergy.com/{mid}_4733330_mp.txt.gz" --user "$RAKUTEN_FTP_USER:$RAKUTEN_FTP_PASSWORD"
```

### Field format (reverse-engineered — official docs are behind a login wall)

Pipe-delimited, **no header row** (first line is `HDR|{mid}|{platform}|{timestamp}`,
last line starts `TRL|`), 38 fields per row, 0-indexed after `.split("|")`:

| idx | field | idx | field |
|---|---|---|---|
| 0 | product id | 16 | brand |
| 1 | product name | 19 | sku (dup) |
| 2 | sku | 20 | brand (dup) |
| 3 | category | 22 | stock status (`in-stock`/other) |
| 5 | buy/click URL | 23 | EAN/barcode |
| 6 | image URL | 25 | currency (`BRL`) |
| 8, 9 | description (dup) | 27 | impression pixel URL |
| 10 | discount amount | 28-37 | empty in every row checked |
| 11 | discount type (`amount`) | | |
| 12 | **sale price (the real price)** | | |
| 13 | list/retail price | | |

All other indices empty in every row sampled. Cross-checked across
dozens of real rows (discount amount = field13 − field12 exactly, every
time) before trusting this — don't take it on faith if a future field
looks off, re-derive from real data the same way.

**No decodable size field.** The SKU's trailing numeric suffix
(`FBA-3556-008` → `-008`) looked like it might encode size, but 2-9
variants per product with no consistent scale across products (not
simple S/M/L/XL, not obviously numeric chest/shoe sizing either) — left
unsolved. `rakuten_convert.py` fills a placeholder `"M"` for every row
so `pick_best()` doesn't skip every real product for lacking a
recognized size (same conservative-fallback pattern `ebay_mine.py`
uses when it can't read real sizes) — sizes shown for these stores are
not currently accurate, just non-blocking.

### Pipeline: convert once, reuse everything else unchanged

`rakuten_convert.py <in.txt.gz> <out.csv> [team_hint]` turns the pipe
file into a synthetic Awin-shaped CSV (`product_name`, `search_price`,
`aw_deep_link`, `aw_image_url`, `brand_name`, `in_stock`, `custom_1`) —
from there, `pick.py` → `split_picks.py` → `gen_new_teams.py` →
`refresh.py` run completely unchanged, same as any Awin store (see
"Running a full mining pass" above; use `store_name=<StoreName>`,
`currency=BRL`).

Two things this converter does that a plain column-rename wouldn't:

- **Roman-numeral kit type.** These stores' titles use Portuguese
  convention `"Camisa Santos I 25/26"` = home, `"II"` = away, `"III"` =
  third — not any word the shared `TYPE_PATTERNS` recognizes. Rewriting
  bare `"I"/"II"/"III"` in the *shared* regex would be too risky (collides
  with all sorts of unrelated things in other languages/stores), so this
  substitution is scoped to the converter, and only applied to titles
  that already matched a real team name first.
- **`team_hint` for single-club stores whose titles sometimes drop the
  club name.** Loja PST/Sport Recife's titles are inconsistent —
  `"Camisa Sport Recife II..."` sometimes, bare `"Camisa Sport II..."`
  other times (a generic word too risky to add to `TEAM_PATTERNS`
  globally). Pass the real name as the 3rd CLI arg and it's prepended to
  any title that doesn't already match a team — **must** happen before
  roman-numeral rewriting, not as a post-hoc patch on the generated CSV
  (real bug hit building this: patching the CSV after conversion means
  `rewrite_roman_type()` already ran and no-opped, since no team had
  matched yet at that point).

### Bugs found and fixed (all in the shared `extract.py`/`retro_extract.py`)

- **`JERSEY_RE` had no `camisa`** (Brazilian Portuguese for jersey —
  distinct from Portugal's `camisola`, which was already there) —
  blocked every single Rakuten Brazil listing from matching at all, the
  same class of "whole store silently produces zero" bug as the
  `junior`/Boca Juniors one. Added.
- **`retr[oò]` didn't cover `ô` (circumflex)** — Brazilian Portuguese
  spells "retro" as `retrô` (borrowed from French), so a real product
  called `"Camisa Cruzeiro RetrôMania"` (an old heritage-reissue design,
  not current stock) sailed straight past `EXCLUDE_RE`'s retro filter
  and got picked as the "current" jersey. Fixed to `retr[oôò]`.
- **`goleiro`** (Portuguese for goalkeeper) wasn't in the goalkeeper
  `TYPE_PATTERNS` entry. Added.
- **`juvenil`** (Portuguese/Spanish for youth/junior) wasn't in
  `EXCLUDE_RE`/`KIDS_SIGNAL_RE` — youth-sized jerseys would've slipped
  into the adult pipeline. Added to both.
- **A "Street" collection item** (`"Camiseta Corinthians Street Third"`)
  — a plain streetwear t-shirt with a small badge, not a match jersey —
  passed every filter and was only caught by photo review. Added
  `\bstreet\b` to `EXCLUDE_RE` (bounded, to be safe against any future
  team/place name that might contain "street").

### Currency and shipping additions needed

`Offer["currency"]` only had `EUR | USD | GBP` — added `BRL`, plus a
matching entry in `OFFER_CURRENCY_TO_EUR` (approximate rate, sorting
only, never shown to the user) and `OFFER_CURRENCY_LOCALE` (`pt-BR`,
for `Intl.NumberFormat`). Both are `Record<Offer["currency"], ...>`
mapped types, so TypeScript itself catches a missing currency at
compile time if a new one is ever added without updating both.

`storeShipping` needed entries for all 5 new stores — **not verified
against each store's own shipping policy page** the way every existing
entry is (fetching santosstore.com.br's policy page failed); assumed
Brazil-only (`["BR"]`) since there's no evidence of international
shipping and a missing entry defaults to "ships everywhere" (`!shipping
→ return true`), which would be actively misleading. Revisit if this
turns out wrong.

## Safety rule (standing, do not change)

Never automate login/"Join"/apply/write actions on any affiliate network
account (Awin, CJ, Rakuten, Impact.com, Skimlinks, Webgains) or any
store. Only read-only HTTP fetches of already-known feed URLs are
permitted here. The user does every login/apply/signup step themselves.
