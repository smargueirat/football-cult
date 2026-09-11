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
    # Futbol Factory "Camiseta de portero Luanvi Santos": "Santos" here is
    # Luanvi's own generic teamwear product-line name, not a reference to
    # Santos FC (the Brazilian club) -- confirmed by the real product page
    # ("linea Santos de Luanvi"), no crest/club branding at all, EUR 14-29
    # price far below any real official jersey. TEAM_PATTERNS' bare
    # "santos" match false-positived on this (2026-09-09).
    "comprar-camiseta-de-portero-luanvi-santos",
    # Scotland (escocia) "Maillot Domicile/Exterieur Ecosse" on Sport is
    # Good FR/ES: these are Scotland RUGBY shirts (Macron, thistle crest of
    # Scottish Rugby, Arnold Clark sponsor), not the football team's kit --
    # Scotland football is made by adidas with the SFA crest. Nothing in
    # the title says rugby, so only a link blocklist catches them
    # (2026-09-10). The 2025/26 one had already slipped into
    # escocia-home-202526 as an offer and was removed in the same pass.
    "600150270001-maillot-domicile-ecosse",
    "600150350001-maillot-exterieur-ecosse",
    "400070810001-maillot-domicile-ecosse",
    # Sport is Good / Foot-Store "Camiseta sin mangas de entrenamiento
    # Sudafrica": Springbok crest = South Africa RUGBY, not Bafana Bafana
    # (SAFA crest), and it's a sleeveless training vest, not a jersey
    # (2026-09-10).
    "p=45800189009",
    # Forum Sport "Spyro porto camiseta portero": "porto" is the Spyro
    # goalkeeper line's colourway/model name -- plain black shirt, no FC
    # Porto crest or any club branding at all (2026-09-10).
    "p=30043170455",
    # FansJerseyHub Birmingham City "2026/27" home+away: actually mid-2000s
    # Coral-sponsor retro reissues (old Nike template, collar) mislabelled
    # with the current season -- the real 2025/26 kit (Undefeated sponsor)
    # is already on file (2026-09-10).
    "birmingham-city-f-c-home-soccer-jersey-2026-27",
    "birmingham-city-fc-away-soccer-jersey-2026-27",
    # Foot-Store ES "Jordan"-branded items landing on the Jordania (Jordan
    # national team) key: a PSG training top and a Brasil goalkeeper shirt,
    # both matched only because of the Jordan BRAND name in the title
    # (2026-09-10).
    "p=45010082048",
    "p=44645300845",
    # eBay Crvena Zvezda (Red Star Belgrade) "26-27" home + away: real
    # Macron design and crest, but $28.98 for a current-season licensed
    # shirt (retail ~EUR 75), no brand named in the title and the usual
    # grey-carpet dropship photo -- same low-trust replica class as the
    # Germany/Mexico/Albania listings above (2026-09-10).
    "ebay.com/itm/287439126604",
    "ebay.com/itm/187781985149",
    # Inter Store "Camisa Internacional Basic Home Vermelha": licensed
    # casual/fan raglan tee (no supplier branding, no sponsor), not the
    # adidas match jersey already on file (2026-09-10).
    "T70-2195-016",
    # Nike style IF3900, both colourways (-417 blue, -741 yellow): the
    # "Maillot Gardien Brasil Jordan Coupe du Monde 2026" is a Jordan x
    # Brasil LIFESTYLE collab (mesh panels, a big "23", no CBF goalkeeper
    # kit anywhere near it), not the real Nike GK shirt already on file
    # under brasil|goalkeeper (2026-09-11). Matched on the style code
    # because the Awin `pclick.php?p=` id is not stable -- the code shows
    # up in the image URL at every store carrying it.
    "if3900",
    # Inter Store "Camisa Betel Internacional Basic Home Masculina - Preto":
    # the same licensed casual raglan tee class as T70-2195-016 above, just
    # a different colourway/SKU -- plain black, small crest, no supplier
    # branding, no sponsor (2026-09-11).
    "0NN-086Z-006",
    # --- 2026-09-11 eBay batch -------------------------------------------
    # Same low-trust dropship class as the Crvena Zvezda pair above: a real
    # crest and a real current design, but a flat $28.98 for a licensed
    # current-season shirt, no brand named in the title, and the seller's
    # house mannequin-against-patterned-wall photo. Unlike the Awin feed
    # items, eBay item ids ARE permanent, so a link blocklist holds here.
    "ebay.com/itm/800590051308",  # Schalke 04 third 26/27
    "ebay.com/itm/168388086797",  # EC Bahia away 2026
    "ebay.com/itm/366635675880",  # Cagliari home 26/27
    "ebay.com/itm/178130297912",  # Bosnia away 26/27
    # Unlicensed sublimation mockup, the "Personalized LIGA MX ... 3D"
    # family already covered by EXCLUDE_RE -- this one says "Custom ...
    # Design 3D Shirt" instead, so the regex missed it. Flat render, not a
    # photograph of a real garment.
    "ebay.com/itm/128012293878",  # "Custom LIGA MX Pumas UNAM 2026 Third 3D"
    # No federation crest and no brand anywhere: a plain blue polo with
    # "ES" screen-printed on the chest, sold as El Salvador's home kit.
    "ebay.com/itm/147430904083",
    # "2026/2027 Spain Lamine Yamal #19 Home ... Player Version": no adidas
    # mark anywhere and the design doesn't match Spain's real 2026 kit --
    # a name-and-number replica, not the federation shirt.
    "ebay.com/itm/398378887588",
    # Deportivo Cali's Hillside third kit (WPlay.co sponsor, Cali crest)
    # listed with "Colombia" in the title, so it landed on the colombia
    # national-team key. Cross-team, not low-trust.
    "ebay.com/itm/198562275583",
]


def is_manually_excluded(*links):
    """True if ANY of the given URLs contains a blocklisted substring.

    Takes several URLs because Awin's `pclick.php?p=<id>` deep links are
    NOT stable between feed pulls -- the same physical product comes back
    with a new `p=` id days later, sailing straight past a blocklist
    entry that matched the old one (confirmed 2026-09-11: three items
    blocklisted on 2026-09-10 all reappeared). The image URL and the
    merchant deep link carry a stable product slug or manufacturer style
    code instead, so pass those alongside the deep link and blocklist the
    stable part. Case-insensitive, since style codes appear both ways.
    """
    return any(
        sub.lower() in link.lower()
        for link in links
        if link
        for sub in MANUAL_EXCLUDE_LINK_SUBSTRINGS
    )
