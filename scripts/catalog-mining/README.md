# Catalog mining scripts

Read-only extraction tooling used to find and add real jerseys from every
approved Awin feed into `src/data/products.ts`. The set of approved
stores is not fixed — it's whatever has an `AWIN_FEED_URL_*` entry in
`.env.local` at the time. **Always enumerate that list fresh (`grep
'^AWIN_FEED_URL_' .env.local`) rather than hardcoding a store list**,
so a newly-approved connection is picked up automatically the next time
this runs. As of the last full mining pass it had 11 entries:
PlanetFoot, FansJerseyHub, ComoFC, DeporteOutlet, Foot-Store ES/FR,
Sport is Good ES/FR, adidas ES/PT, BSTN IT — plus **Mystery Shirt Club**,
onboarded without an `AWIN_FEED_URL_*` entry (see below).

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

## Safety rule (standing, do not change)

Never automate login/"Join"/apply/write actions on any affiliate network
account (Awin, CJ, Rakuten, Impact.com, Skimlinks, Webgains) or any
store. Only read-only HTTP fetches of already-known feed URLs are
permitted here. The user does every login/apply/signup step themselves.
