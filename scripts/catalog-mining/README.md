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

Full team-list run is ~4600+ API calls (6 current types + 3 kids types +
3 retro types per team) — this reliably eats the Browse API's whole daily
quota in one run (near-total 429s confirmed 2026-08-14 and 2026-08-20, see
"Batched eBay mining" below). **Don't invoke `ebay_mine_full.py all` directly
for the daily pass anymore** — use `ebay_mine_cycle.py`, which calls the
same `mine_current`/`mine_kids`/`mine_retro` functions from this module but
spreads the 385 teams across several days instead of blowing the quota on
one run. `ebay_mine_full.py all` is still fine for a deliberate one-off full
re-mine (e.g. after a query-logic bug fix, like the "Second full eBay
re-mine" below) where you're prepared for it to take multiple sessions/days
to actually finish due to rate-limiting. Same resume support either way
(per output file, keyed by team).

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

### Second full eBay re-mine (2026-08-10) — more name-collision classes, and a rate-limit gap

Re-ran `ebay_mine_full.py` end to end (this was a re-mine, not the first
pass) to keep expanding coverage. Two things worth carrying forward:

- **eBay's Browse API rate-limited hard partway through the ~2000-call
  run** — the last ~77 of 252 teams (by request order) got a 429 "Too
  many requests" on literally every query, meaning those teams were
  never actually checked this pass, not "checked and found nothing".
  Includes 4 Argentina clubs the site cares about: **Racing Club, San
  Lorenzo, Vélez Sarsfield, Estudiantes de La Plata** — zero picks for
  any of them this run, purely from being unlucky in queue order, not a
  real coverage gap. Re-run `ebay_mine_full.py` for just the affected
  teams once the quota window resets (a few hours to a day) rather than
  assuming their eBay coverage is exhausted.
- **"Independiente" (Club Atlético Independiente, Avellaneda) collides
  with several other real clubs of the same name** — found by hand
  auditing this run's retro picks (10 of 16 were actually Independiente
  Santa Fe / Independiente Medellín, both Colombia; Independiente del
  Valle, Ecuador; Independiente Rivadavia and Independiente de
  Chivilcoy, both Argentina but different clubs). Unlike the
  Jordan/Ukraine collisions elsewhere in this doc, this one *was* worth
  a regex fix (enumerable, small set of known homonyms) — `extract.py`'s
  `TEAM_PATTERNS["independiente"]` now excludes those five qualifiers
  via a negative lookahead. Verified against all 17 real titles found
  this run before applying.
- **More one-off bare-word collisions, dropped by hand (not
  regex-fixed — too broad to safely enumerate, same call as
  Jordan/Ukraine)**: `espana`'s bare "Spain"/"España" match picked up
  Real Madrid/Barcelona/Valencia/Real Betis/Sevilla club listings that
  just mention Spain in passing (every single `espana|third` pick this
  run was actually a club, not the national team — home/away were
  clean); a `torino|away` and `sevilla|away` pick were actually
  Juventus and Real Betis respectively (both clubs' listings happened
  to mention the other club's city/name); three kids picks
  (`ecuador|away`, `mexico|third`, `santos|home`) were actually
  Ecuadorian/Mexican *club* jerseys (Barcelona SC-style crest,
  Chivas Guadalajara, Santos Laguna) that only matched because the
  bare country/city word appeared in the seller's title — confirmed by
  photo, all dropped before generating. When auditing a large eBay
  batch, budget time to actually read every title in `..._truly_new`
  outputs by eye, not just trust `extract.py`'s existing filters — this
  pass alone found name collisions across 5 different team keys.

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
   `teamFlags`/`teamColors` entries in `src/data/products.ts` (or run
   `apply_batch.py`, which does this for you -- since 2026-09-02 it
   auto-fills the new `fr`/`it` locale keys in `teamNames` with the
   same value as `es`, which is correct for the ~278/385 existing
   entries that are club proper nouns identical across every locale.
   If the new key is a **national team** (rare -- all major footballing
   nations are already covered), fix its `fr`/`it` names by hand
   afterward, same as `es`/`en`/`pt` already needed manual translation
   for those).
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
FansJerseyHub, ForumSport — each has a slightly different column layout, see the
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
python3 pick.py f.csv search_price delivery_cost out.json product_name "Fashion:size"   aw_deep_link aw_image_url          # ForumSport — huge 107K-row generic sporting-goods feed; filter to product_type in {fútbol > camiseta de fútbol oficiales, ... niño, fútbol > camiseta portero, ... niño} BEFORE running pick.py, or you'll pick from every sport on the site

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

## Post-batch quality bugs found 2026-08-10 (after the second full eBay re-mine)

Found by the user browsing the live site right after this batch deployed,
not by any automated check — worth re-reading before trusting a big
batch is clean just because the mining scripts ran without errors.

- **A `manual_exclusions.py` entry silently stopped applying because the
  mining process was already running when the entry was added.**
  `ebay_mine_full.py` imports `MANUAL_EXCLUDE_LINK_SUBSTRINGS` once at
  process start; a ~4-hour background run that started *before* a new
  entry gets appended to the file keeps using its stale in-memory copy
  for its entire run, silently re-mining an item that was supposedly
  already permanently blocked (the Albania home 2024 no-visible-brand
  listing, `ebay.com/itm/236671403906`, came right back). **Standing
  check: after any long-running mining pass finishes, re-grep every
  `manual_exclusions.py` substring against the freshly-updated
  `products.ts` before trusting the batch** — don't assume "it's in the
  blocklist" means "it stayed excluded" if the process was started
  earlier than the blocklist edit.
- **More no-visible-brand-logo listings, same class as Albania**: two
  Guatemala retro items (home+away 2023/24, a generic sash-pattern
  template with no crest or manufacturer mark at all) and a "Puma"
  Valencia CF listing whose photo shows the real Valencia crest but no
  Puma logo anywhere (title claims a brand the photo doesn't back up) —
  found by the user browsing, confirmed by photo, removed. Same
  standing rule as always: if a jersey's own photo doesn't show a real
  manufacturer's mark, don't trust the title.
- **The retro pipeline's kids exclusion misses eBay's numeric
  age-range template.** `extract.py`'s `KIDS_SIGNAL_RE` (used for
  current-season and the dedicated kids pass) correctly catches
  `"- 9/10 - (5-6 Years)"`-style titles (condition rating, then a kid
  age range with an explicit units word) — but `retro_extract.py`'s
  `RETRO_EXCLUDE_RE` only ever matched literal keywords like
  "kids"/"niño"/"junior", not that numeric shape, so retro mining
  (both `ebay_mine_full.py`'s own retro pass and the Awin-CSV retro
  pipeline, since both share this one regex) let real kids-sized items
  through as ordinary adult retro products. Found 16 candidates via a
  catalog-wide scan for `KIDS_SIGNAL_RE` hits inside non-kids blocks;
  13 were genuine (2 Sunderland ones is what the user actually spotted
  browsing), 3 were false positives (bare "14/15"-style season numbers
  that happen to look like a plausible kid age range, but the title
  explicitly said "Men's" right next to it — kept those). Fixed
  `RETRO_EXCLUDE_RE` to also match `\d{1,2}-\d{1,2}\s*(years|años|ans)`
  — deliberately requires the units word, same reasoning
  `KIDS_SIGNAL_RE` already uses, so it doesn't start rejecting retro
  titles' own season ranges ("18/19"), which never carry a units word.
  For the 10 single-offer retro blocks that were entirely a kids item,
  tagged the existing block `ageGroup: "kids"` in place (same pattern
  already used for `WOMEN_SIGNAL_RE`) rather than deleting/regenerating
  — cheaper and keeps the real offer. For 3 blocks that mixed one kids
  offer alongside genuinely-adult offers from other stores (Barcelona
  retro, two current-season Liverpool products), removed just the
  kids-signaling offer instead of tagging the whole block.
- **General lesson**: a batch this size (today's re-mine added ~3650
  products) cannot be fully hand-verified by photo before it ships —
  but budget a first-week-after-deploy pass specifically re-checking
  user-facing browsing reports against these known bug classes (no
  visible brand, kids-mislabeled-as-adult, stale exclusions) rather
  than assuming a clean `tsc`/`build`/dedup-check run means the data
  itself is clean.

## DeporteOutletES full re-mine (2026-08-11) — three real pipeline bugs

Re-ran DeporteOutletES/Sportspar end to end after the user reported
missing jerseys on the live site. Its `merchant_product_category_path`
isn't football-specific (a broad multi-sport discount outlet — "Moda y
ropa deportiva > Ropa de hombre > Camisetas" mixes real jerseys with
Lambretta/Ellesse/Ben Sherman/NASA/Marvel fashion tees), so filtering by
category doesn't work here like it did for AdidasES/FootStoreES/Sport Is
Good — filtered by `equipación|portero` signal words in the title
instead and checked every unmatched title by hand.

- **`pick.py`'s size parsing only understood bare sizes** (`"M"`) —
  DeporteOutlet's `size_stock_status` column mixes that with a
  `"Talla:M"` prefixed form in ~16% of rows (1422/8776), silently
  dropping every jersey whose row happened to use the prefixed form.
  Caught because a real Czech Republic PUMA jersey came back with zero
  sizes and got dropped. Fixed by stripping a `"TALLA:"` prefix before
  the `SIZE_MAP` lookup.
- **`extract.py`'s `is_old_season()` had no team-name masking** before
  searching the title for a season year — same "Como 1907" class of bug
  the retro pipeline (`retro_extract.py`) already worked around, just
  never ported to the main `analyze()`/`analyze_kids()` functions. "US
  Salernitana **1919**" was reading its own founding year as an old
  season and getting silently excluded entirely. Fixed by masking the
  matched team-name span out of the title before calling
  `is_old_season()`, in both `analyze()` and `analyze_kids()`. Also had
  to extend `salernitana`'s own regex to `\bsalernitana\b(\s+1919)?` so
  the mask actually covers the year too, not just the club name.
- **"Sevilla Atlético" (Sevilla FC's reserve team) matched the
  `"sevilla"` pattern** and would have overwritten Sevilla FC's real
  home kit with the reserve team's jersey — a real, separate club with
  its own different crest, confirmed by photo (fetched the full 600x600
  source image, not just the 200x200 thumbnail, to see the crest
  clearly). Same class as the Independiente homonym-club fix: excluded
  via negative lookahead (`\bsevilla\b(?! atl[eé]tico)`) rather than
  mislabeling it as the first team, since there's no separate TeamKey
  for the reserve side.

Also found (not a pipeline bug, a data artifact worth knowing about):
the **daily automated re-mine reintroduces the prematch season-pair
duplicates already fixed earlier this session** (Arsenal/Bayern/
Benfica/Liverpool/ManUtd/RealMadrid/Ajax `-202526` vs `-202627`) —
`refresh.py`'s add-offer path matches on `(team, type)` only, so when
two products exist for the same team+type at different seasons, a
store's offer can get inserted into the wrong (older) one on every
re-mine even after being manually cleaned up once, since nothing dedupes
an offer URL across *different* products. Not fixed at the pipeline
level yet (would need `refresh.py` to check the offer URL against every
product for that team+type, not just the one being refreshed) — cleaned
up by hand again this pass, but expect it to keep recurring nightly
until that's actually fixed.

## Product id stability (favorites depend on this — read before renaming/deleting an id)

`src/data/productAliases.ts` maps an old product `id` to whatever it
became. This exists because favorites (and "recently viewed") are stored
as raw id strings — either in a signed-in user's account or in the
guest's `localStorage` — and `findProduct()` used to just return
`undefined` for an id that no longer exists, which the favorites page
silently filters out. A user's saved favorite would vanish with zero
explanation the next time the catalog changed underneath it. Found and
fixed 2026-08-11 after the user asked directly whether catalog updates
could do this — they could, and several of that day's own fixes
(retro id renames, exact-URL-duplicate merges) were live examples.

**Whenever a change to `products.ts` renames, merges, or splits a
product id — anything where the "same" real product keeps existing but
under a different id — add an entry to `PRODUCT_ID_ALIASES`
(`old id -> new id`) in the same commit.** Point it at the id's current,
final form directly (never chain an alias to another alias — the lookup
is single-hop by design). Do NOT add an entry when a product is deleted
because it shouldn't have existed at all (wrong team, unlicensed
reproduction, reserve-team collision, etc.) — that favorite disappearing
is correct, not a bug, since there's no legitimate successor to redirect
to.

## Full pass across all 11 Awin stores + MSC + eBay (2026-08-12)

Ran a genuinely full daily pass (hadn't run yet that day) across every
`AWIN_FEED_URL_*` store, Mystery Shirt Club, and `ebay_mine.py` end to end
(completed all 376 teams × 3 types without hitting a rate limit this
time). Net +49 product blocks (35 genuinely new team/type/store finds +
14 from splitting merged gender products, see below), plus price/offer
refreshes applied across every store. Worth carrying forward:

- **A real environment bug, not a data bug: several scripts hardcoded
  the absolute path `/home/piojo/football-cult/src/data/products.ts`
  (and `.env.local`) instead of resolving relative to their own file
  location.** Running from a git worktree (a different absolute path)
  meant `split_picks.py`'s new-vs-add classification, `gen_new_teams.py`'s
  color fallback, and `ebay_mine.py`'s team-name lookup were all silently
  reading the *other* checkout's stale `products.ts` — not the one
  actually being edited. Caused one real duplicate-id collision this run
  (`monaco-third-202627` got generated twice, once each from FootStoreES
  and SportIsGoodES, because neither run could see the other's insert).
  Fixed in `split_picks.py`, `gen_new_teams.py`, `ebay_mine.py`,
  `retro_gen.py`, `gen_kids_teams.py`, `brand_apply.py` to resolve off
  `os.path.dirname(os.path.abspath(__file__))` instead. If this pipeline
  is ever run from anywhere other than the main checkout again, verify
  these paths still resolve correctly.
- **The prematch season-pair duplicate bug (documented below under
  DeporteOutletES 2026-08-11) recurred exactly as predicted** — 17 offers
  across Real Madrid/Arsenal/Bayern/Liverpool/Man Utd/Ajax prematch
  products got inserted into BOTH the `-202526` and `-202627` id for the
  same team+type, since `refresh.py` matches on (team, type) only, not
  season. Cleaned up by hand again (kept whichever id's `season` field
  actually matched the offer title's detected season, dropped the other)
  — still not fixed at the pipeline level, expect it to keep recurring.
- **Real regex gaps for punctuation/abbreviation variants of
  already-tracked teams**, found via PlanetFoot's unmatched-title scan:
  `"RedBull Leipzig"` (no space) wasn't matching `rb leipzig|red bull
  leipzig`; `"San Diego F.C."` (with periods) wasn't matching `san diego
  fc`; `"L.A. Galaxy"` (with periods) wasn't matching `\bla galaxy\b`;
  `"SRFC"`/`"GFC"` (bare abbreviations for Stade Rennais/Girona) matched
  nothing at all. All fixed in `extract.py`. Also added a bare `\bbahia\b`
  alternative (was requiring the full `esporte clube bahia|ec bahia`).
- **FansJerseyHub uses invented SEO nicknames instead of real team names
  for several listings** — "La Roja" (Spain), "Eagle Squad" (Germany —
  not even Germany's real nickname, the store just riffed on the eagle
  crest), "Yellow Wall FC" (Borussia Dortmund), "West London Blue"
  (Chelsea), "Parisians" (PSG), "Samurai Blue" (Japan), "Bafana Bafana"
  (South Africa), "La Vinotinto" (Venezuela), "Los Cafeteros" (Colombia).
  Verified every single one by cross-checking the listing's image
  filename against the nickname (e.g. `spainhomefan.jpg` under a "La
  Roja" title) — 100% consistent across every sample checked. **Did not**
  add these to the shared `TEAM_PATTERNS` in `extract.py`: several are
  genuinely ambiguous for OTHER tracked teams if the pattern ever fired
  elsewhere — "La Roja" is also Chile's nickname (tracked as `chile`),
  "Parisians" could mean Red Star FC (also a Paris club, also tracked),
  "Eagle(s)" is Benfica's nickname too (`Águias`) and Nigeria's ("Super
  Eagles"). Instead wrote a one-off script
  (`fansjerseyhub_nicknames.py`, not part of the standing pipeline) that
  matches the nickname AND cross-checks the image filename before
  attaching an offer, scoped to only this one store's CSV. If this
  store's nickname convention shows up again on a future pass, re-run
  that same filename-verification approach rather than trusting the
  nickname text alone.
- **New false-positive class on eBay: "Personalized"/"Custom ... 3D
  Shirt" listings** (found: Club Tijuana, Pumas UNAM) are unlicensed
  sublimation reproductions with visibly low-quality printed (not
  embroidered) crests/sponsor logos — same class as the Concept/AIRO and
  JELEX exclusions already in `EXCLUDE_RE`, just not yet covered by it.
  Dropped both by hand rather than generalizing the regex (only 2 samples
  seen so far, not enough to safely characterize the pattern).
- **7 genuinely new teams added**, all found via unmatched-title scans
  and verified by photo before adding: Portland Timbers, Vancouver
  Whitecaps FC, Orlando City SC (MLS), Málaga CF (Spain), Club León
  (Liga MX, Mexico), Olympiacos FC (Greece), Guinea (national team). Team
  metadata in `new_teams_batch15.py`, wired into both `gen_new_teams.py`
  and `retro_gen.py` (and `gen_kids_teams.py` for consistency).
- **Re-audited the whole catalog for the two bug classes fixed earlier
  that same day (exact-duplicate offer URL across different product
  ids; a men's-cut and women's-cut offer merged into one product) before
  starting new mining** — found 0 more exact-duplicate-URL cases (that
  class was already clean), but found **14 more instances of the
  gender-merge bug** beyond the 1 already fixed
  (`manutd-retro-202324-third`): `mancity-retro-202223-away`,
  `mancity-retro-202324-away`, `mancity-retro-202324-home`,
  `acmilan-retro-202324-away`, `argentina-retro-202425-away`,
  `intermiami-retro-202425-away`, `italia-retro-202223-away`,
  `manutd-retro-202122-away`, `manutd-retro-202223-away`,
  `manutd-retro-202324-away`, `manutd-retro-202122-home`,
  `manutd-retro-202324-home`, `manutd-retro-202223-third`,
  `roma-retro-202324-home`. Fixed the same way: original id keeps only
  the explicitly-female-signaling offer(s) (`ageGroup: "women"`), a new
  `<id>-mens` product holds everything else (explicit "Men's" offers AND
  unmarked ones — an unmarked generic-store listing is far more likely to
  be the standard/men's cut than the niche women's cut). A precise
  detector script (only flags a block when it has BOTH an explicit
  female-signal offer title AND an explicit male-signal one, or a
  female-signal offer with no `ageGroup` tag at all) is worth keeping
  around and re-running after any large retro batch — the first, cruder
  attempt at this check (any block merely containing a "(Ladies)" offer)
  produced way too many false positives to be usable by hand.

## Safety rule (standing, do not change)

Never automate login/"Join"/apply/write actions on any affiliate network
account (Awin, CJ, Rakuten, Impact.com, Skimlinks, Webgains) or any
store. Only read-only HTTP fetches of already-known feed URLs are
permitted here. The user does every login/apply/signup step themselves.

## Daily pass (2026-08-13) — teamKey regex missing digits, ebay_mine.py never checks manual_exclusions.py

Ran a normal incremental daily pass across all 11 Awin stores (3 —
PlanetFoot, FansJerseyHub, ComoFC — returned a persistent HTTP 500 from
`ui.awin.com` across 6 retries over ~10 minutes on this run; a
concurrent separate pass later the same day fetched all 11 fine, so
this was transient, not a real outage), MysteryShirtClub, and
`ebay_mine.py` (current season only, all teams, 384 picks). Two real
pipeline bugs found:

- **`TEAM_RE`'s `[a-z]+` character class in `split_picks.py`,
  `refresh.py`, and `gen_kids_teams.py` doesn't match a `teamKey`
  containing a digit** (`hannover96`, `versailles78` — both real,
  already-catalogued teams). `existing_products()` silently skips any
  block it can't parse a team from, so both teams were invisible to the
  new-vs-add classifier: a fresh eBay pick for `hannover96|home`
  (identical URL/price/title to the offer already on file) got
  classified as a brand-new product, which would have created a
  duplicate id if applied blindly. Caught by hand-checking each
  "new_products" entry against the catalog before generating blocks
  (as this doc already recommends) rather than by any automatic guard.
  Fixed all three regexes to `[a-z0-9]+`. Since `refresh.py` has the
  same bug, this also means offer-refresh passes have been silently
  skipping these two teams entirely (missed price updates, not
  corrupted data) — worth a manual price spot-check for hannover96 and
  versailles78 next time.
- **`ebay_mine.py` (unlike `ebay_mine_full.py`) never imports
  `manual_exclusions.py`** — `pick_for_team_type()` filters by
  `JERSEY_RE`/`EXCLUDE_RE`/`ACCESSORY_RE`/price/team/type only, so a
  previously-blocklisted eBay listing (wrong-brand Wales listing,
  `ebay.com/itm/206250291403`) can resurface through the plain
  current-season miner even though it's permanently excluded from the
  full miner — it did resurface, via a plain `refresh.py --apply` of
  this run's eBay ADD offers, and had to be pulled back out by hand
  after applying. Also found 4 more blocklisted links already sitting
  in `products.ts` before this pass even started (2 BSTNIT heritage
  reissues, the Denmark goalkeeper "86" heritage reissue on both
  FootStoreES/FR — that product had ONLY those two blocklisted offers,
  so the whole product was deleted, not just the offers). Not fixed at
  the pipeline level yet (`ebay_mine.py` would need the same
  `is_manually_excluded()` import as `ebay_mine_full.py`, and
  `refresh.py` would need it too so a blocklisted offer can't be
  reinserted by ANY store's apply step) — worked around this pass by
  re-grepping every `MANUAL_EXCLUDE_LINK_SUBSTRINGS` entry against the
  freshly-updated `products.ts` after every apply step, per the
  standing check already documented above. **This standing check needs
  to keep happening by hand until manual_exclusions.py is actually
  wired into `ebay_mine.py` and `refresh.py`.**

Also found (and fixed, same move-to-the-right-sibling-block approach as
before) the still-unfixed "prematch season-pair duplicate" bug
recurring again for 6 offers (Liverpool/Man Utd/Real Madrid prematch,
PSG/Real Madrid home, Ajax prematch) — same root cause as documented
above (`refresh.py` matches on team+type only, not season, so a store's
offer can land in whichever of two same-team-type products happens to
match first). The exact-duplicate-offer-URL and gender-merge audits
were both clean this pass (0 flagged).

New products this pass were unusually thin (1: Portland Timbers away,
eBay) after dropping several false positives: two Jordan "national
team" picks that were actually a Nike Jordan-brand PSG kit and Brazil's
goalkeeper (real name Jordan) — the exact collision class already
documented above — and 3 "Personalized/Custom ... 3D Shirt" unlicensed
reproductions (Club Tijuana, Pumas UNAM, Club León), same class as the
Tijuana/Pumas UNAM examples already documented above. Also dropped one
more "S-5XL"-sizing print-on-demand-pattern listing (Norway, no
"Personalized"/"Custom" wording but same tell-tale wide generic size
range as the confirmed unlicensed ones) and 2 explicitly-"Personalized"
Cruz Azul offers from the add-offers batch, on the same suspicion.

## Daily pass (2026-08-14) — real `refresh.py` bug: offers duplicated across every product sharing a team+type

Ran all 11 Awin stores fresh (PlanetFoot and ComoFC hit a persistent
`ui.awin.com` HTTP 500 across 4 retries with 15s backoff — same transient
class documented above, not retried further this pass), MysteryShirtClub,
and — for the first time — Rakuten Advertising's FTP feed for all 5
approved Brazilian club stores end to end (previously only documented,
never actually run). 1 genuinely new product (`asse-away-202627`, ASSE's
2026/27 away kit, found independently by both FootStoreFR and
SportIsGoodFR — verified by photo: real crest, Hummel mark, Casino
sponsor), ~1050 offers refreshed/added across the rest. Two "jordania"
(Jordan the country) picks from FootStoreES/FR were dropped by hand —
exactly the already-documented Jordan-brand/PSG and Brazil-goalkeeper
name-collision class, not the real country team.

**Found and fixed a real, previously-undocumented `refresh.py` bug, much
bigger in scope than the already-documented "prematch season-pair"
special case**: `refresh.py` matched every block sharing a
`teamKey|typeKey` key and applied the store's *single* picked offer to
**all** of them, not just one. Any team+type with more than one product
(season variants like `-202526`/`-202627`, or color/style variants like
`-green`/`-black`/`-jacket`/`-warmup`) got the same offer duplicated
across every variant — 91 offers ended up duplicated across 2-5 products
apiece this pass (found via a post-apply exact-duplicate-offer-URL scan
that came back suspiciously high; the standing scan documented above only
ever checked for the same URL landing on two *different* ids after the
fact, never diagnosed *why* it kept happening at this scale).

Cleaned up by reconciling against a pre-batch snapshot of `products.ts`:
for each duplicated URL, if it already existed under some product id
*before* this run, that id keeps it and every other copy is a bug to
delete (82 of 91 resolved this way, fully mechanical). The remaining 9
were genuinely new offers with no baseline precedent, requiring reading
the offer's title text against each candidate product's own established
title wording (season number, "home"/"away"/"local"/"domicile", or a
matching SKU already seen on another store's offer for that exact
variant) to decide the one correct home — see the git history for this
commit for the reasoning kept per case. One of these (`bay-goalkeeper`)
led to discovering `bay-home-heritage-2025` is itself a pre-existing,
out-of-scope mislabeling bug (typeKey `"home"` but every offer on it is
actually a goalkeeper jersey photo) — left alone, but flagged here since
it explains why that id keeps attracting stray goalkeeper-titled offers
from the `bayern|home` key. Two of the 91 were themselves fallout from a
`replace` (matching by store name only, not URL) silently overwriting a
correct existing offer with a same-store-different-SKU pick *before* the
dupe was even visible — `ale-goalkeeper-away-2026`'s AdidasES offer and
`argentina-prematch-stripes-2026`'s sole FootStoreFR offer were both
fully destroyed this way (the latter left the product with zero offers
entirely, caught by a `newly-empty-product` regression check added for
this cleanup, not by the dupe scan). Both restored by hand from the
pre-batch snapshot.

**Fixed at the root in `refresh.py`**: it now only ever touches a block
unambiguously — a plain replace when exactly one product sharing that
team+type already carries the store's offer, or an insert when exactly
one product shares the key at all. Any other shape (zero products have
the store yet AND more than one product shares the key, or — in
principle — more than one already does) is skipped and printed as
`Skipped (ambiguous ...)` rather than guessed at, same skip-over-guess
default used everywhere else in this pipeline. Verified against this
session's own picks post-cleanup: re-running is fully idempotent (0
inserted/replaced where already correctly applied) and correctly flags
the real remaining multi-variant collisions (`alemania|goalkeeper`,
`juventus|training`, `bayern|home`, `bayern|goalkeeper`) as ambiguous
instead of re-duplicating them.

**Rakuten store-name mismatch, caught immediately after applying**: used
"Santos Store"/"Inter Store"/"Cruzeiro Store"/"Shop Timão"/"Loja PST"
(spaced, readable names) when the catalog's actual established
convention (set when these stores were first onboarded) is the unspaced
`SantosStore`/`InterStore`/`CruzeiroStore`/`ShopTimao`/`LojaPST` — caused
5 fresh inserts with a brand-new store-name variant instead of replacing
the existing entries. Caught before commit by grepping both spellings'
counts; removed the 10 wrongly-named offer lines and reapplied with the
correct names (clean replaces, 0 inserts, as expected). **`ShopTimao`
(no diacritic, no space) vs `Shop Timão` (with diacritic) was already
inconsistent in the catalog before this pass** (1 pre-existing entry
each) — not fixed, since neither is clearly "the" canonical one and
picking wrong risks a second split; worth resolving explicitly next time
someone's looking at Corinthians data.

**eBay full pass (`ebay_mine_full.py`) hit near-total 429 rate-limiting
almost immediately this run** — by team 41/383, 500 of 508 log lines were
`429 Too many requests`, far earlier than the "partway through" pattern
documented in every previous full-pass entry above. Left running in the
background rather than killed (zero-cost to babysit, and the resume
support means any teams that do get through still land in the output
files), but did not wait on it to ship the rest of this pass — see commit
history for whether a follow-up eBay-only commit landed same day or the
picks got carried to the next daily pass instead.

## season_conflict is now auto-resolved-when-clean, not always a skip (2026-08-18)

**Behavior change, read before touching `split_picks.py`/`gen_new_teams.py`
again.** Every entry above this point in the doc describes `season_conflict`
as a dead end: `split_picks.py` finds a fresh pick whose season doesn't
match the catalog's existing product for that team+type, prints it, and
stops -- a human decides by hand whether to add it as a new product. That
required an explicit "go ahead and add these" from the user every time a
club's kit rolled over to a new season, which happens constantly (~15+
clubs at once during a real season-rollover wave, see the untouched
"large wave of clubs' 2026/27 kits are now live" note originally logged
right below this section). The user asked for this to stop requiring
manual sign-off going forward.

**What changed, concretely:**

1. `split_picks.py`'s `existing_products()` had a real bug worth fixing
   before wiring anything else to it: it kept `existing[key] = season`
   (one value) for a `team|type` key, but a key isn't unique to one
   product id (season/color/style variant splits, e.g.
   `liverpool-prematch-202526` vs `liverpool-prematch-red-202526`, or
   genuinely different-season siblings like `manutd-prematch-202627` vs
   `manutd-prematch-202526`, both real, both already on file). Whichever
   block happened to be LAST in file order silently overwrote the
   others, so a fresh pick could get misclassified as a conflict against
   the wrong season entirely. Confirmed real-world hits: `manutd|prematch`
   and `realmadrid|prematch` both already had their `-202627` sibling on
   file, but a fresh PlanetFoot 2026/27 pick was still printing as
   `season_conflict` against whichever *other*, older-season block got
   visited last. Fixed: `existing_products()` now returns every season
   seen for a key (a `set`), and `split()` checks `seasons_equivalent`
   against *any* of them, not just one. This matters more now than it
   used to, because misclassifying an already-covered season as a fresh
   conflict no longer just prints a stale log line -- it would generate a
   real duplicate product (see point 2).
2. `split_picks.py` now writes a third output file,
   `<picks>_CONFLICT.json`, in the exact same shape as `_NEW.json` (full
   pick dict per key: title/price/shipping/sizes/link/image), not just
   the old `(old_season, new_season, title)` summary tuple used for the
   printed log line. This means a season_conflict pick can be run through
   `gen_new_teams.py` exactly like a genuinely-new pick.
3. `gen_new_teams.py` now refuses to generate an id that already exists
   in `products.ts` (`existing_product_ids()`, checked before appending
   each block) -- printed as `SKIP (id already exists, would duplicate --
   check by hand)` instead of silently duplicating. This was always a
   latent gap (nothing stopped two picks from generating the same id even
   for ordinary new-product runs), but became worth actually fixing once
   `_CONFLICT.json` started feeding this same generator.

**The actual workflow now, per store, replacing step 4-5 of "Running a
full mining pass" above:**

```bash
python3 split_picks.py /tmp/picks.json
# -> picks_NEW.json (genuinely new team+type), picks_ADD.json (offer
#    refresh into an existing product), picks_CONFLICT.json (season
#    doesn't match anything on file for that team+type)

# Photo-verify picks_NEW.json AND picks_CONFLICT.json the SAME way --
# same standard as every other new-product candidate this file has ever
# documented: download the real image, look at it, check crest/brand/
# item-type, and for anything the false-positive classes above call out
# by name (national teams that don't redesign yearly, anniversary
# editions, kids/women's cuts, retro reissues, blank templates, wrong
# sport) cross-check against the existing product's own photo before
# trusting the season in the title. This step is NOT optional and NOT
# skippable just because the pipeline can now technically auto-generate
# the block -- "auto-resolve" means removing the human-approval gate
# for CLEAN cases, not removing the verification itself.

# Whatever survives verification in EITHER file goes through the same
# generator:
python3 gen_new_teams.py /tmp/picks_NEW.json StoreName EUR /tmp/new_blocks.ts
python3 gen_new_teams.py /tmp/picks_CONFLICT.json StoreName EUR /tmp/conflict_blocks.ts
# (two separate out_path files, or concatenate -- either way, insert
# both the same way as any other new-product batch)

# Whatever DOESN'T survive verification (ambiguous, ambiguous multi-store
# split, same-kit-relabeled false positive) stays skipped and logged for
# manual review, exactly like before -- this is the one case where
# "skip rather than guess" still applies unchanged.
```

**First real run under this new behavior (2026-08-18), applying the
season_conflict backlog this same doc had been logging as "left skipped"
for the past several passes**: 81 team+type season_conflict candidates
across 50 clubs, all re-verified fresh (re-fetched every relevant store's
feed rather than trusting the earlier skip-log) and photo-checked one by
one before generating anything.

- **72 confirmed genuine new-season products added.** Real photo evidence
  of an actual redesign (different colorway, different pattern, different
  sponsor-era print), not just a different year string in the title.
  Where a key had multiple stores independently listing the same fresh
  season, checked whether their photos agreed (merge into one product,
  multiple offers) or showed two genuinely different real releases (split
  into two products with a descriptive id suffix, same pattern as the
  pre-existing `liverpool-prematch-red-202526` split) -- found two more
  real instances of this: `juventus-goalkeeper-home-202627` vs
  `juventus-goalkeeper-away-202627` (AdidasES's "primera equipación"
  goalkeeper pick and AdidasPT's "Away Goalkeeper" pick are two distinct
  real jerseys, orange vs green, confirmed by photo -- titles said so
  too, just needed the photo to trust it), and
  `juventus-prematch-202627` (white/gold, SportIsGoodES+FR) vs
  `juventus-prematch-heritage-202627` (black/cream adidas Originals-style
  retro print, PlanetFoot only -- a real product, just a different design
  line than the standard prematch top).
- **6 confirmed false positives, caught before creating a duplicate**:
  `brasil-away`/`brasil-home`/`coreadelsur-away`/`haiti-home`/
  `paisesbajos-away` (all MysteryShirtClub) and `ghana-away`
  (FansJerseyHub) -- every one of these had a photo **pixel-identical**
  to the existing product's own stored photo (same crest position, same
  print, same collar), just re-titled with a different year range
  (MysteryShirtClub's `"2026-2027 <Team> ... Shirt"` template in
  particular looks like a generic label applied across its whole current
  stock, not a real season signal -- worth treating any MysteryShirtClub
  season_conflict pick for a national team with real suspicion going
  forward). Exactly the risk this doc's task instructions called out by
  name: national-team World Cup kits don't redesign on the yearly cycle
  clubs do, so a bare year bump in the title is much weaker evidence for
  a country than for a club.
- **2 skipped as genuinely ambiguous, not added**: `manutd|home`
  (AdidasPT's pick title literally says "Camisola **Curta**" -- Portuguese
  for "cropped" -- a fashion/cropped-cut variant, not the standard replica
  shirt this catalog otherwise lists under `home`; needs a human call on
  whether cropped items belong in the same `typeKey` at all) and
  `liverpool|home` (AdidasPT's only pick shows an unexpected burgundy/wine
  colorway for what Liverpool has always had as a plain red home -- not
  corroborated by any second store, so left for a second opinion rather
  than trusted on one source).
- **1 near-miss caught by cross-checking the existing block, not just the
  photo**: `astonvilla|training`'s AdidasES pick looked at first like a
  false conflict (bare "2025" vs "2025/26" notation on the existing
  product, same club, same type) -- but the existing
  `astonvilla-training-2025` block *already has its own, different*
  AdidasES offer (a long-sleeve "Tiro 25 Competition" top), and the fresh
  pick's photo is a visibly different garment (a paint-splash warm-up
  top). Same class as the already-documented
  `bayern-training`/`bayern-training-jacket`/`bayern-training-beige`
  three-way split: added as its own product
  (`astonvilla-training-warmup-202526`) instead of either merging into
  the existing block or dropping it. **Always check ALL existing offers
  on a candidate's team+type block, not just the season string, before
  deciding "same product, different label"** -- the season match alone
  isn't sufficient once a team+type key can carry more than one real
  design.
- 2 team+type keys (`manutd|prematch`, `realmadrid|prematch`) that
  appeared in the original skip-log turned out not to be real conflicts
  at all once `existing_products()`'s multi-season bug (point 1 above)
  was fixed -- PlanetFoot's fresh 2026/27 pick already matches the
  `-202627` sibling product that was sitting on file the whole time under
  a different, older-season block's shadow.

## Daily pass (2026-08-18) — applied the Aug-17 eBay kids+retro backlog, new false-positive class: country keys matching domestic clubs

The 06:07 cron run on 2026-08-18 identified but didn't finish applying
the previous day's completed `ebay_mine_full.py` output
(`current_picks.json` had already been applied via the 2026-08-17
"eBay full-catalog sweep" commit, but `kids_picks.json` — 170 entries —
and `retro_picks.json` — 3632 entries — were still sitting unapplied in
`/tmp/ebay_full_20260817/`). This pass applied both, then did a normal
incremental Awin (11 stores) + MysteryShirtClub pass.

**New regex fixes** (now in `EXCLUDE_RE`/`KIDS_EXCLUDE_RE` in
`extract.py` and `RETRO_EXCLUDE_RE` in `retro_extract.py` —
`personali[sz]ed|\btowel\b|\bblanket\b|\bcushion\b|\bpillow\b`):
- **"Personalized LIGA MX \<team\> Shirt 3D" unlicensed sublimation
  dropship reproductions** — the exact class flagged in earlier passes
  as "only 2 samples, too narrow to regex" (Club Tijuana, Pumas UNAM)
  turned out to be a real recurring seller pattern once the eBay kids+
  retro backlog was reviewed at volume: ~20 hits this pass alone
  spanning Club Tijuana, Pumas UNAM, Club León, Chivas Guadalajara,
  Cruz Azul, Tigres UANL, 100% of "personalized/personalised" matches
  in the whole 3800-entry batch were this pattern or the novelty class
  below — safe to generalize now.
- **Novelty items matching a jersey title but photographed as a towel/
  cushion/blanket** (Bournemouth "... Home Shirt Personalised Vintage
  Beach Towel", Brentford "... Personalised Retro Football Shirt Shaped
  Cushion", Brighton "... Personalised Fleece Blanket") — the exact
  false-positive class this project's standing instructions call out by
  name, first real hits caught.
- Also dropped by hand (not regexed, too store/listing-specific): 2
  New Era 9TWENTY baseball caps mislabeled "Third Jersey" in the kids
  batch (Vancouver Whitecaps, Orlando City — same class as the
  documented Vancouver Whitecaps cap from the 2026-08-17 pass, this
  seller does it repeatedly) and 1 "Sweden home" pick that was actually
  a Houston Dynamo (MLS) "Starting Lineup" branded T-shirt with no
  connection to Sweden at all.

**New false-positive class, not previously documented: a country/
national-team `TeamKey`'s picks can be dominated by DOMESTIC CLUB
listings that merely mention the country for context** (kit supplier
copy, league name, or just the seller's location tag), same root shape
as the already-documented India/Zambia domestic-club problem but far
larger in scope. Found by two methods used together — (1) cross-
checking every retro pick's title against every OTHER team's
`TEAM_PATTERNS` regex (catches the case where the contaminating club is
itself a tracked `TeamKey`), and (2) a "club-name-immediately-before-
the-country-name" heuristic (strip brand/condition/size noise words
from the text before the country name in the title; a real proper noun
left over is a tell) for the untracked-club case. Both are one-off
scripts, not wired into the standing pipeline (see below for why).
Confirmed by hand, real examples this pass:
- **escocia** (Scotland) — of ~43 retro picks, ~26 were actually
  Celtic/Rangers/Hibernian/Ross County/Partick Thistle/Clyde FC/Hearts
  of Midlothian/East Fife (Scottish clubs), not the national team.
- **inglaterra** (England) — 8 of 27 were Everton/Man City/Leicester/
  Bournemouth/Wolves/West Ham/Stoke City/Liverpool club listings.
- **turquia** (Turkey) — 9 of 18 were Fenerbahçe/Galatasaray/Göztepe/
  Kocaelispor/Adana Demirspor/Ankaragücü club listings.
- **qatar** — 8 of 11 were Qatar Airways-SPONSORED other clubs
  (Barcelona/PSG/Inter Milan) or World-Cup-host mentions on a different
  country's shirt (Mexico, USA/Pulisic) — only 3 were genuine bare
  "Qatar Home Jersey ... World Cup" items. **Near-miss caught while
  building the drop list**: a first pass wrote this key off as "all
  contamination" without checking the full per-team title list first —
  would have deleted 3 real Qatar NT products. Same near-miss happened
  for **finlandia** (1 bad pick — a Denmark shirt that also says "vs
  Finland" — almost got generalized to drop all 7, 6 of which are
  genuine Litmanen-era/"NATIONAL TEAM"-explicit Finland items). **Always
  print and read the full per-team pick list before writing a team off
  as "all contamination," even when every *flagged* sample looks bad** —
  the heuristic's own selection bias (it only flags picks matching the
  suspicious shape) means the un-flagged remainder can still be mostly
  genuine.
- Smaller confirmed hits (all hand-verified by title, several cross-
  checked by photo): ucrania/Dynamo Kyiv+Shakhtar+Karpaty Lviv+Metalurh
  Sobol+Nyva Ternopil, francia/Marseille+PSG, alemania/Schalke+Nürnberg,
  italia/Juventus+AC Milan+Chievo+Avellino, portugal/Porto+Juventus+AC
  Milan (Ronaldo/Leão playing for their CLUB, not the NT), sudafrica/
  Kaizer Chiefs (+2 stray England Confederations-Cup/World-Cup-host
  shirts), suecia/Djurgården+Helsingborgs+1 stray Beckham/England
  shirt, peru/8 different domestic clubs, israel/Maccabi Netanya+
  Maccabi Tel Aviv, plus one-off hits for arabiasaudita, argelia,
  belgica, bolivia, botswana, china, colombia, croacia, dinamarca,
  egipto, elsalvador, eslovenia, georgia (Atlanta United — the exact
  "Georgia/US state" collision this doc already flagged as a candidate
  to watch), gales, honduras, indonesia, iran, iraq, japon, myanmar,
  noruega, paisesbajos, paraguay, tailandia, uruguay, venezuela. ~200
  bad picks dropped total (of 3632 retro + 170 kids candidates).
- **Not generalized into the standing pipeline** — same call as the
  already-documented Jordan/Ukraine/India collisions: enumerable per
  team this time (unlike the fully generic "bare word collision" cases),
  so a per-team substring blocklist could be added if this recurs, but
  building it required the full cross-check + heuristic + hand-read
  pass above, not something worth running proactively on every store
  every day. If Scotland/England/Turkey/Qatar keep recurring, promoting
  their specific club lists to a real blocklist (like
  `manual_exclusions.py` but keyed on team+substring instead of URL)
  would be the next step.
- **jordania** continues to need its national-team-explicit whitelist
  (not blocklist) treatment already documented above — 12 more Nike-
  Jordan-brand PSG kits dropped this pass alone via the same rule.

**Post-insertion cleanup (mechanical, same playbook as every previous
large batch)**: the exact-duplicate-offer-URL scan came back with 236
hits — all bare-year-vs-full-range season-notation duplicates (e.g.
`italia-retro-2024-home` vs the pre-existing `italia-retro-202425-home`,
identical eBay URL under both), same class documented under "Adding a
team" above. Resolved 236/236 mechanically against a pre-batch snapshot
(whichever id already had the URL before this run keeps it; the other
copy — always a brand-new single-offer product `retro_gen.py` had just
generated — gets deleted). This also surfaced the **gender-merge bug
recurring for 6 more products** (5 already had a `-mens` sibling from
the 2026-08-12 fix — the new eBay men's offer just needed moving there
— but `dortmund-retro-202425-home` was a previously-undetected instance
with several non-women offers already sitting in a `women`-tagged block
before this pass ever started; split it into a new `dortmund-retro-
202425-home-mens` sibling). **Always re-run the WOMEN_SIGNAL_RE-vs-
men's-signal scan after any large retro insertion**, not just the
duplicate-URL one — they catch different things and both keep recurring.

**Awin (all 11 stores) + MysteryShirtClub**: normal incremental pass,
~1500 offers refreshed. 1 new product (`hamburg-home-202627` — Hamburg
had only 2 retro products, no current-season product at all before
this). Dropped 3 more Jordan-brand-PSG / Brazil-goalkeeper-named-Jordan
picks (FootStoreES ×2, FootStoreFR ×1) — same standing collision class.
**A large wave of clubs' 2026/27 kits are now live** (AC Milan, Bayern,
Valencia, Monaco, RC Lens, PSV, Marseille, LA Galaxy, and more, mostly
via PlanetFoot) showing up as `season_conflict` against the catalog's
current `2025/26` products — left skipped per the pipeline's standing
"skip rather than guess" default, since treating a full season/design
refresh as a same-product price update would be wrong and treating it
as a parallel new product for ~15+ teams at once is a bigger structural
change than a daily incremental pass should make unreviewed. Worth a
dedicated season-rollover pass if this keeps growing.

**Superseded later the same day**: this exact backlog (plus the rest of
the 81-candidate season_conflict list accumulated up to this point) was
the trigger for the "season_conflict is now auto-resolved-when-clean"
behavior change documented further up this file — see that section for
what actually happened to these teams (72 added as real new products, 6
false positives caught by photo, 2 left ambiguous) and the new standing
workflow going forward. The "left skipped" framing in the paragraph above
no longer describes current behavior.

**DAZN Canada** (Awin-approved per project notes, never checked before)
— confirmed it's purely a streaming subscription service with no
merchandise shop at all (checked its homepage HTML for any shop/store/
jersey/merch wording; found nothing but generic app-store links). No
feed to mine, nothing to add — same conclusion as Asics CL/Pro Soccer,
safe to stop re-checking this one too.

**Infra note**: hit the same "Bash tool fails on literally every command,
including `echo`" symptom documented under 2026-08-12/13 above, this
time with a real root cause found: `/tmp` quota (a tmpfs, per-session)
got exhausted by ~4GB of leftover duplicate feed CSVs from earlier
sessions that were never cleaned up (`/tmp/mine20260817/`,
`scratchpad/mining/0816/`, etc.) plus this session's own large feed
downloads. Freeing that space fixed it. **Clean up large feed CSVs from
the scratchpad after each store is done with them**, not just at the
very end — they're multi-hundred-MB each (FootStoreES/FR alone are
~300-360MB) and this pipeline fetches 11+ of them.

## Batched eBay mining (`ebay_mine_cycle.py`, 2026-08-20) — the full pass alone exhausts the daily quota

Confirmed twice now (2026-08-14, 2026-08-20) that a single `ebay_mine_full.py
all` run — ~4600+ Browse API calls for the full 385-team list — reliably eats
the whole day's rate limit on its own, usually ending in near-total 429s and
capturing few or zero picks. The 2026-08-20 case was made worse by several
same-day cloud-routine test runs sharing the same `EBAY_CLIENT_ID` (see
`project_ebay_full_mine_rate_limit` and `project_football_cult_github_routine_blocker`
in Claude's memory for the full incident writeup) — that specific cause won't
repeat now that the cloud routine is disabled, but the underlying "one full
pass ≈ one day's quota" math doesn't depend on that and would keep biting the
daily cron on its own eventually.

**Fix**: `ebay_mine_cycle.py` wraps `ebay_mine_full.py`'s own
`mine_current`/`mine_kids`/`mine_retro` functions (imports them directly, no
duplicated logic) and mines the team list in daily batches instead of all at
once:

```bash
cd scripts/catalog-mining
python3 -u ebay_mine_cycle.py /tmp/ebay_daily        # default batch size 60
python3 -u ebay_mine_cycle.py /tmp/ebay_daily 40      # explicit batch size
```

- Progress persists in `ebay_full_cycle_state.json` (next to the script —
  **commit it to the repo alongside `products.ts` every time it changes**, or
  the cycle position is lost and the next run just repeats the same teams).
- A team only counts "done" for the cycle if none of its queries hit a 429 —
  a team with genuinely zero real listings still gets a clean 200 and counts
  as done; a rate-limited team stays pending and gets retried in a later
  batch. (`EbayClient.rate_limited`, set in `ebay_mine.py`'s `search()` on a
  429 response, is what makes this distinction possible.)
- Stops early after 3 consecutive rate-limited teams in one run — no point
  burning through the rest of the batch on doomed requests once the quota's
  visibly gone for the day.
- Once every team in `TEAM_PATTERNS` is marked done, the next run starts a
  fresh cycle (clears the done list, bumps the cycle counter) — the sweep
  repeats indefinitely rather than stalling after the first full pass.
- Output files (`current_picks.json`/`kids_picks.json`/`retro_picks.json` in
  `<out_dir>`) accumulate the same way `ebay_mine_full.py`'s own resume
  support does — same downstream insertion paths (see the "Full eBay pass"
  section above), unchanged.

At batch size 60, a full 385-team cycle takes roughly a week of daily runs
(assuming no rate-limiting interference) — tested end-to-end on 2026-08-20
with a 15-team batch: 17 teams completed cleanly, zero 429s, 222 real
picks captured (dominated by retro, which keeps every distinct historic
season per team+type). `daily_scan.sh`'s prompt now calls this instead of
`ebay_mine_full.py all` for the daily pass.

**Real bug found applying the first real batch (2026-08-21)**: when checking
whether a retro pick's (team, type, season) already exists in `products.ts`,
matching on the `typeKey` field directly is wrong -- every retro product has
`typeKey: "retro"` literally (home/away/third only shows up in its `id`
suffix, e.g. `clubtijuana-retro-200910-home`). Comparing a pick's raw type
("home"/"away"/"third") against existing products' `typeKey` field always
mismatches for retro, so everything looks "new" and gets inserted as a
duplicate block -- caught via a dupe-id check (135+ collisions) before
committing, reverted, and fixed by matching on the full generated id
(`{team}-retro-{seasonSlug}-{type}`) instead. Of 165 raw retro picks that
batch, only 14 were genuinely new; 148 already existed as retro products
(116 of those were exact re-discoveries of an offer already on file, only 32
needed a new offer merged in) -- always check against existing full ids for
retro, never against typeKey.

## Daily pass (2026-08-22) -- season_conflict false positives are often exact duplicate offers hiding behind a season-notation mismatch

Ran the full daily pass: all 12 Awin stores (ProSoccer confirmed footwear-only
again, skipped), MysteryShirtClub, all 5 Rakuten Brazilian club feeds, and one
`ebay_mine_cycle.py` batch (60 teams, 137/385 done in cycle 1). 46 new products
added, 0 removed, `tsc`/dupe-id/build all clean.

**Recurring pattern found across FOUR independent sources this pass: a
`season_conflict` pick is frequently not a new season at all -- it's an
offer already sitting in the catalog, just re-scraped with a different season
notation than the one already on file.** Before generating a `season_conflict`
pick as a new product, check whether its exact offer URL already appears
somewhere in `products.ts` -- if it does, it's a duplicate-to-merge (route
through the normal add/replace path against the existing id), not a new
product. Confirmed hits this pass:
- **AdidasES**: `japon|home` (pick "26/27" vs catalog's `japon-home-2026`)
  and `lagalaxy|away` (pick "25/26" vs catalog's `lagalaxy-away-2025`) --
  both picks' exact URLs were already offers inside those existing blocks.
- **AdidasPT**: `lagalaxy|away` (same offer, same URL, picked again) and
  `celtic|training` -- both already on file.
- **BSTNIT**: `intermiami|third` (pick "2025" vs catalog's "2025/26") --
  same photo confirmed (just a different crop/angle), same real jersey.
- **MysteryShirtClub**: 5 hits -- `coreadelsur|away`, `haiti|home`,
  `brasil|away`, `brasil|home`, `paisesbajos|away`, all against MSC's own
  generic `"2026-2027 <Team>... Shirt"` template title (the exact
  already-documented false-positive class, confirmed again by pixel-identical
  image URL already on file).
- **eBay retro** (`ebay_mine_cycle.py`): of 209 raw retro picks, only 17 were
  genuinely new products; 190 already matched an existing full id
  (`{team}-retro-{season}-{type}`), and of those 44 needed a new store offer
  merged in (the rest, 146, were exact re-discoveries of an offer already on
  file -- same ratio as the 2026-08-21 entry above).

**New false-positive class confirmed, not just a one-off**: `pumasunam|third`
(current pick, "Custom LIGA MX Pumas UNAM 2026 Third Design 3D Shirt") and
`pumasunam|away|2023` (retro pick, "Custom Name - LIGA MX Pumas UNAM Shirt 3D
2023 - 2024") -- more hits of the already-documented unlicensed
Personalized/Custom/3D sublimation reproduction pattern, this time for a
team not previously seen with this exact issue. Dropped both.

**"Tiro 25 Competition" (adidas's training-template name) misread as season
"2025" -- recurring, not a one-off.** Two more hits this pass, both AdidasPT:
`juventus|training` and `newcastle|training`. Both are real, already-catalogued
training tops (same design already on file under `-202526`), just re-listed
with updated SKU/price under the same "Tiro 25" wording that `detect_season()`
reads as a bare year. Merged as offer replacements into the existing blocks by
hand rather than generating spurious new products -- this class (a product
line name that contains a plausible-looking year, distinct from the
"Como 1907"/"Salernitana 1919" team-name-embeds-a-year class already
documented) is worth a real fix in `detect_season()`/`is_old_season()` if a
third team hits it.

**Team name embeds a year, again -- new team hit by the "Como 1907" class**:
an eBay retro pick titled "Parma Calcio 1913 XL Home Jersey Puma BNWT Hernan
Crespo" generated id `parmacalcio-retro-1913-home` -- "1913" is Parma's own
founding year in the club's official name, not a season (the real jersey,
confirmed by photo -- Puma logo, Parmalat sponsor -- is from the late-1990s
Crespo era, roughly 1996-99, but the exact season can't be confidently
determined from the title alone). Dropped rather than guessing a season label;
`retro_extract.py`'s team-name-masking fix apparently doesn't cover this
team's pattern yet (parma's `TEAM_PATTERNS` regex likely doesn't include the
"1913" suffix the way `salernitana`'s was extended to `\bsalernitana\b(\s+1919)?`
-- same fix would apply here if this recurs).

**Two more country-key-matches-domestic-club false positives** (same class as
the India/Zambia and Scotland/England/Turkey/Qatar entries documented above):
`botswana|third|2021/22` was actually **Township Rollers** (a real Botswana
Premier League club, Stanbic Bank sponsor visible in the photo) and
`myanmar|home|2012` was actually **Yangon United** (a real Myanmar National
League club, airBagan sponsor visible) -- both dropped. A second Myanmar pick
this same pass (`myanmar|home|2018/19`, Warrix-branded, explicitly titled
"MYANMAR ... National Soccer Football Jersey" with a flag patch in the photo)
was confirmed genuine and kept -- a reminder that a country key hitting this
false-positive class once doesn't mean every pick for that key is bad; keep
checking each one by title wording + photo.

**Two new genuine season-redesign products confirmed by photo, not just a
title year bump**: `francia-away-2025` (a cream/beige Nike design with the
rooster crest, genuinely different from the already-catalogued mint-green
2026 World Cup away kit) and `paisesbajos-away-2025` (light blue with a black
lion crest and "oranje" collar tag, genuinely different from the catalogued
navy/orange 2026 World Cup away kit) -- both from FootStoreES, both real,
distinct Nike releases sold alongside the World Cup kit, not reissues of it.
Also 3 new Lazio 2026/27 products (home/away/goalkeeper, Mizuno-branded, real
crest) and a third genuine Bayern Munich prematch design
(`bayern-prematch-2025`, camo pattern, distinct from the two prematch designs
already on file) from PlanetFoot.

**FansJerseyHub: 20 `season_conflict` picks, all confirmed genuine by photo,
none were false positives this time** -- every one had the store's pick
season OLDER than the catalog's own (e.g. pick "2025/26" vs catalog's already
-202627 product), the reverse of the usual "new season just arrived" direction.
Spot-checked 7 by photo (Leeds away, West Ham away, El Salvador home, NYCFC
away, Bayern prematch) against the existing catalog image each time -- all
were genuinely different, real licensed jerseys (this store apparently
carries older-season/alternate-design stock alongside its newest listings),
not the same design re-titled. Generated as 20 new products.

## Soicos (Nike CL/AR, Puma AR) — needs a real browser, not headless Playwright (2026-08-31)

A new affiliate network, separate from Awin/eBay/Rakuten. Approved
programs so far: **Nike (CL)** (pid 14271), **Nike (AR)** (pid 14661),
**Puma (AR)** (pid 14084) — all under one Soicos account (aid 56058).
Check `soicos.com/publisher/programs` (search the site name) for any
newly-approved ones; program IDs show up in the "Programa" dropdown at
`soicos.com/publisher/tool_box/deeplinks`.

**This is fundamentally different from every other source in this repo
and does not fit the CSV-feed pattern:**

- Soicos itself has **no product feed** (CSV/XML/API). Every "tool" in
  its dashboard (Home, Deeplink, Coupons, even the one literally named
  "Feed") is a tracked marketing *link* to a page on the store's own
  site, not a machine-readable catalog. Confirmed by generating one and
  following it — it 302-redirects to the store's normal homepage/offers
  page, nothing more.
- **Nike.cl and nike.com.ar block headless browser automation outright**
  (Cloudflare "Attention Required!" challenge page) — confirmed by
  pointing plain `playwright-core` (chromium, headless, no stealth) at
  both directly. A real browser (this repo's `claude-in-chrome` MCP
  tool, i.e. an actual Chrome instance with the extension, not a
  scripted one) loads them fine — Cloudflare's bot detection is
  specifically flagging headless/automated fingerprints, not blocking
  by IP or user-agent string.
- Net effect: **this can't run unattended inside `daily_scan.sh`'s
  headless `claude -p` invocation unless that invocation has
  `claude-in-chrome` available** (i.e. real Chrome, with the extension,
  actually running on the Mini PC when cron fires). If it does, the
  same manual process below can in principle be repeated by that run.
  If it doesn't, this needs an interactive session instead — don't
  spend time trying to make plain Playwright work here again, it won't
  get past Cloudflare no matter how it's configured.

### The actual process (done by hand once, 2026-08-31, via claude-in-chrome)

1. **Find products via the store's own category/search pages**, not
   Soicos. Nike CL has a stable category page for national teams at
   `nike.cl/federaciones` (54 products at the time, real photos/prices/
   sizes, normal pagination). Nike AR (VTEX-based like CL, but a
   different storefront) doesn't have that same route — its in-page
   search overlay works instead (click the search icon, click the now-
   visible input, type, wait ~1.5s — the overlay is flaky about landing
   typed text if you interact with it too fast or in the wrong order,
   just retake a screenshot and retry the click+type if the box comes
   back empty). Puma AR (`ar.puma.com`, not VTEX) has an ordinary
   `/search?q=...` route that works directly.
2. **Cross-reference every candidate against what's already in
   `products.ts` by Nike/Puma style code** (e.g. `IB5290-100`) before
   treating it as a new product — Nike in particular reuses the exact
   same style code across every country storefront for the same
   physical jersey (confirmed: CL and AR both sell `IB5290-100`
   "Inglaterra local 2026 Stadium" at the identical style code). Use
   `existing_products()` from `split_picks.py` to check `team|type` ->
   season(s) on file, then grep for the style code inside that
   product's existing offers (visible in other stores' image/URL
   strings) to confirm it's the same jersey before adding a plain
   add-offer. A season/style mismatch means it needs the
   `season_conflict` new-product path instead — don't force it into an
   existing block.
3. **Extract price/sizes/image per product directly from its PDP**, not
   from list/search cards (cards are frequently missing real size
   availability). `document.querySelector('meta[property="og:image"]')`
   via the `javascript_tool` gives a clean, query-string-free image URL
   fast; sizes need a screenshot (grey/struck-through button = sold
   out) since neither `.disabled` nor `aria-disabled` reliably reflects
   it in either storefront's markup.
4. **Generate the affiliate link through Soicos' own Deeplinks tool**
   (`soicos.com/publisher/tool_box/deeplinks` — pick the program, paste
   the real product URLs one per line, click Generar). The resulting
   links follow a flat, reconstructable pattern once you've seen one:
   `https://ad.soicos.com/sclick?aid=56058&pid=<program_id>&dl=<url-
   encoded target URL>` — so once you know the pid for a program, you
   can build these directly with `urllib.parse.quote` instead of
   re-running the tool per batch. **Verify at least one with `curl -sI`
   before trusting the pattern for the rest** (expect a `302` with a
   `location:` header pointing at the real product, tagged with
   `utm_source=soicos`).
5. **Nike (AR) links geo-check the visitor's country** — resolving one
   from this repo's own (non-Argentine) network returned an HTML page
   titled "Campaña no válida para tu país de residencia" (200, not the
   expected 302) instead of redirecting. Nike (CL)'s links didn't show
   this behavior from the same network. Real site visitors clicking
   from Argentina should be unaffected (that's the whole target
   audience), but this means an AR-based curl/redirect check from
   outside Argentina will always look "broken" even when it isn't —
   don't treat that as a bug to chase without first confirming from an
   AR vantage point.

### What's done vs. still open

- **Nike (CL): 7 add-offers** (Brasil home + goalkeeper, Inglaterra
  home + away, Francia home, Uruguay home, Países Bajos home) — all
  matched to existing `-2026` season products via style code. Store
  name `NikeCL`, currency `CLP`.
- **Nike (AR): the identical 7 products**, same style codes, confirmed
  separately on nike.com.ar. Store name `NikeAR`, currency `ARS`.
- **Puma (AR): 2 new products** for Independiente (`teamKey:
  "independiente"`) — `independiente-away-202627` (`Camiseta
  Alternativa CAI 26/27`, a real season/sponsor change vs. the existing
  2025 away offer, which was itself already dead/`inStock:false`) and
  `independiente-third-202627` (`Camiseta Tercer Conjunto CAI`, no
  `independiente|third` product existed before this). Both reuse the
  team's existing `colorHex`/`colorHexSecondary` rather than the
  specific kit's own colors — matches the established convention (see
  e.g. Brasil's home/away/goalkeeper all sharing one colorHex despite
  being yellow/navy/green). Store name `PumaAR`, currency `ARS`. Puma
  AR's deeplinks redirect via client-side JS
  (`window.location.href`) rather than an HTTP 302 like Nike's do —
  `curl -I` alone shows a bare 200 that looks broken; read the response
  body to see the real redirect target and tracking params. No country
  geo-check observed on these links (unlike Nike AR's).
  The home replica jersey didn't turn up anywhere on `ar.puma.com`
  (checked the dedicated Independiente collection page and a ~78-result
  general search) — not blocking, since `independiente-home-2025`
  already has a real, in-stock eBay offer. May be worth checking again
  later in case Puma AR lists it eventually.
- Both Nike storefronts and Puma AR sell plenty more than this one
  batch — check for other Argentine clubs Puma actually sponsors
  (Independiente was found via its home-page hero banner, not a
  systematic search) and for more national teams' away kits on Nike
  before assuming there's nothing else there. This pass covered one
  category page's worth by hand on each site, not everything available.
