"""Permanent blocklist of specific offer URLs/links that must never be
re-added by any future mining run, regardless of source (Awin, Rakuten,
eBay). Distinct from the regex-based EXCLUDE_RE in extract.py, which
filters by TEXT PATTERN across many products -- this file is for
one-off bad listings the user identified by hand (wrong brand, low-
trust dropship photo, unlicensed replica) that don't share a reusable
pattern with anything else in the catalog.

Match by a stable substring of the link (eBay item id, or a store's
product-slug), not the full URL, since affiliate tracking params can
change between mining runs.
"""

MANUAL_EXCLUDE_LINK_SUBSTRINGS = [
    # Wales home 2025/26: title says "NWT ADIDAS" but Wales's real
    # supplier is Macron (confirmed by this same product's legit
    # SportIsGoodFR offer) -- wrong/mismatched eBay listing.
    "ebay.com/itm/206250291403",
    # Germany away 2026: low-trust eBay listing, generic stock-model
    # photo, user flagged as not trustworthy (2026-08-09 corrections doc).
    "ebay.com/itm/406991565559",
    # Mexico home 2026: same pattern as above.
    "ebay.com/itm/406991287114",
    # PlanetFoot Real Madrid Bellingham away 2024/25 "Replica": unlicensed
    # replica, user wants only real-brand products.
    "maillot-real-madrid-exterieur-bellingham-homme-2024-25-replica",
    # Albania home 2024: same no-visible-brand-logo red flag as the
    # Germany/Mexico/Brazil eBay listings above -- user flagged by photo
    # (2026-08-10).
    "ebay.com/itm/236671403906",
    # El Salvador away 2023 / Guatemala home+away 2023/24: same generic
    # no-crest-no-brand template, confirmed by photo (2026-08-10).
    "ebay.com/itm/277616599695",
    "ebay.com/itm/277385867203",
    "ebay.com/itm/277431029544",
    # Valencia CF home 2019/20 "Puma": photo shows the real Valencia
    # crest but no Puma logo anywhere despite the title (2026-08-10).
    "ebay.com/itm/406861504071",
    # USA home 2026 "Puma": actually IconSports, a generic fan-merch
    # brand, not the team's real supplier Nike (2026-08-10).
    "ebay.com/itm/267737837514",
    # Man City prematch 2024/25 "Flaxen": both available product photos
    # (front and back listing images) only show the back of the shirt --
    # no visible Puma logo or club crest on either, confirmed by photo
    # (2026-08-10). Unlike the same line's "Granola" colourway (which
    # does show both clearly), this specific listing's own photos never
    # show the front, so it can't be trusted.
    "2024-2025-man-city-prematch-ss-shirt-flaxen-425784",
    # Denmark goalkeeper "86": genuine 1986 heritage reissue, same
    # bare-2-digit-suffix class documented in the README (2026-08-11).
    # FootStoreES lists this same product as several separate rows (one
    # per size), each with its own p= id -- list every variant id, since
    # the exclusion check runs per-row before size-grouping.
    "p=45204856699",
    "p=45195661895",
    "p=45195661896",
    "p=45195661897",
    # Same Denmark goalkeeper "86" heritage reissue, FootStoreFR's own
    # listing (different link shape -- ued= merchant slug, shared across
    # its size variants unlike FootStoreES's per-size p= ids above).
    "222880-3389-maillot-du-gardien-de-but-danemark-86",
    # BSTN IT adidas heritage reissues: Man Utd "90/92" (SKU JM5495) and
    # Liverpool "95" (SKU KA8093) away jerseys -- same bare-2-digit-suffix
    # retro class as Denmark 86 above, one row per size with a different
    # p= id each (2026-08-11).
    "p=44509578130",
    "p=44509578131",
    "p=44509578132",
    "p=44509578133",
    "p=44245437967",
    "p=44245437968",
    "p=44245437969",
    "p=44245437970",
    "p=44245437971",
    # Same Man Utd "90/92" heritage line, long-sleeve variant (SKU JM5498).
    "p=44509578137",
    # DeporteOutlet S.S. Lazio "125 anos" anniversary shirt: white special
    # edition, not the real sky-blue home kit -- same anniversary-edition
    # class already documented in the README (2026-08-11). Two separate
    # aw_product_ids carry this same SKU (MIZP2GABX75) in the feed.
    "p=44084163809",
    "p=44084163810",
]


def is_manually_excluded(link):
    if not link:
        return False
    return any(s in link for s in MANUAL_EXCLUDE_LINK_SUBSTRINGS)
