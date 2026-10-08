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
    # 2026-10-04, Pro:Direct UK: mined as `escocia|home` but this is
    # SCOTLAND RUGBY, not football -- Macron (SRU supplier), "Arnold Clark"
    # (SRU sponsor), the thistle crest and stag-antler sleeves. The football
    # shirt on file is adidas with the SFA lion rampant. Classic
    # rugby-shares-a-team-name false positive; only the photo settles it.
    "macron-scotland-26-27-home-replica-shirt-navy-mens-replica-1043581",

    # 2026-10-04: mined under `ajax|third|2023`, but the title names TWO teams
    # ("Adidas Jamaica Third ... Bob Marley ... Ajax") and the only photo is
    # BACK-ONLY, so the crest -- the one thing that would settle it -- is not
    # visible. Carries a "BOB MARLEY 10" name print on top. Unverifiable by the
    # documented standard, so it goes regardless of which team it really is.
    "/itm/405840571001",

    # --- Daily pass 2026-10-04, RETRO candidates ---
    # Clubs mined under a NATIONAL-TEAM key (scan-invisible, see above):
    "/itm/406991751356",  # ecuador|home|1999: LDU Quito (CLUB) under `ecuador`, + player name Hurtado
    "/itm/184553760599",  # noruega|away|2011: Valerenga (CLUB) under `noruega`
    "/itm/157900157992",  # suiza|home|2011/12: FC Sion (CLUB) under `suiza`
    "/itm/317755329787",  # ucrania|home|2020/21: Dynamo Kiev (CLUB) under `ucrania`
    # Player-printed shirts, not the plain kit:
    "/itm/136594309990",  # ajax|home|2013/14: player print "Klaassen #18"
    "/itm/158202538381",  # estadosunidos|away|2005: USWNT (women) + player print "Wambach #20"
    "/itm/278406729350",  # feyenoord|away|2023/24: player print "#29 GIMENEZ"
    "/itm/146449720468",  # suecia|home|2016/17: player print "#9 Kallstrom"
    # Caught only by the PHOTO, not the title:
    "/itm/168742635584",  # australia|home|2019: WOMEN'S cut -- 2019 was the Women's World Cup (Matildas); fitted silhouette
    "/itm/168648135484",  # belgica|away|2020/21: player print "#15" (Meunier) across the chest
    "/itm/358383013072",  # mexico|away|1986: modern adidas ORIGINALS reproduction sold as retro, $31 new

    # --- Daily pass 2026-10-04, KIDS picks ---
    # Club Santos Laguna (Mexico) under `santos` (= Santos FC Brazil here)
    # AGAIN, this time in the kids set -- crest, Soriana/Penoles sponsors.
    "/itm/388517730284",
    # USWNT 2019 AWAY ("ONE NATION ONE TEAM", 4 stars over the shield) filed
    # as the MEN'S `estadosunidos|home` kids shirt -- wrong team AND wrong kit.
    "/itm/136725794185",
    # Not a garment of the right kind at all: a cotton graphic TEE with a
    # "MEXICO" wordmark print, no kit design. The Italian title said
    # "Maglietta" (t-shirt), not "maglia" -- only the photo settled it.
    "/itm/398057729349",

    # --- Daily pass 2026-10-04 ---
    # Clubs mined under a NATIONAL-TEAM key. team_collision_scan.py is
    # structurally blind to these: none of these clubs is in TEAM_PATTERNS,
    # so the scan can only ever report collisions between teams it knows.
    # The tell is always the title, never the key (see 2026-10-03 notes).
    "/itm/298727004635",  # Shakhtar Donetsk filed under `ucrania` (Ukraine)
    "/itm/158275613938",  # FC Basel filed under `suiza` (Switzerland)
    # Club Santos Laguna (MEXICO) mined under `santos`, which in this
    # catalog is Santos FC (BRAZIL, the Rakuten store). Same-name club in
    # a different country -- a new instance of the cross-name collision class.
    "/itm/137752536611",  # Santos Laguna home
    "/itm/137752536610",  # Santos Laguna away
    # Player-printed shirts (name+number on the back), not the plain kit.
    "/itm/168597426484",  # Ajax third, "Ko Itakura #4"
    "/itm/820191956714",  # Mexico home, "Raul Jimenez"
    "/itm/137789428926",  # Belgium away, "De Bruyne #7"
    # Turkey home: title hid it as "stampa marmo audace #10", but the photo
    # is a BACK-ONLY shot of a CALHANOGLU #10 print -- both drop classes at
    # once, and only the photo settled it.
    "/itm/117411173236",
    # Kids shirt leaking into the men's current set: "GIOVANI/BAMBINI XL 15-16".
    "/itm/227441091139",  # Chile home, youth sizing

    # Wales home 2025/26: title says "NWT ADIDAS" but Wales's real
    # supplier is Macron (confirmed by this same product's legit
    # SportIsGoodFR offer) -- wrong/mismatched eBay listing.
    "/itm/206250291403",
    # Germany away 2026: low-trust eBay listing, generic stock-model
    # photo, user flagged as not trustworthy (2026-08-09 corrections doc).
    "/itm/406991565559",
    # Mexico home 2026: same pattern as above.
    "/itm/406991287114",
    # PlanetFoot Real Madrid Bellingham away 2024/25 "Replica": unlicensed
    # replica, user wants only real-brand products.
    "maillot-real-madrid-exterieur-bellingham-homme-2024-25-replica",
    # Albania home 2024: same no-visible-brand-logo red flag as the
    # Germany/Mexico/Brazil eBay listings above -- user flagged by photo
    # (2026-08-10).
    "/itm/236671403906",
    # El Salvador away 2023 / Guatemala home+away 2023/24: same generic
    # no-crest-no-brand template, confirmed by photo (2026-08-10).
    "/itm/277616599695",
    "/itm/277385867203",
    "/itm/277431029544",
    # Valencia CF home 2019/20 "Puma": photo shows the real Valencia
    # crest but no Puma logo anywhere despite the title (2026-08-10).
    "/itm/406861504071",
    # USA home 2026 "Puma": actually IconSports, a generic fan-merch
    # brand, not the team's real supplier Nike (2026-08-10).
    "/itm/267737837514",
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
    # Blocklisted by the bare hummel style code, not the FR slug: the
    # slug never appears in FootStoreES's link (unstable p= id) nor in
    # its image URL (".../2025_09_hummel_222880-3389_2.jpg"), so the ES
    # side kept resurfacing every pass (3 in a row to 2026-10-02) while
    # only the FR side stayed blocked. The style code is in both.
    "222880-3389",
    # Croatia "prematch" 2026 (adidas KF4656): real HNS crest, but the
    # chest mark is the adidas ORIGINALS TREFOIL -- a lifestyle piece,
    # not a match jersey (5th instance of that class, 2nd pass for this
    # exact shirt). Same reasoning as above for using the style code:
    # it appears in FootStoreFR's ued= slug AND in both stores' image
    # filenames, where the unstable p= id does not.
    "kf4656",
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
    "/itm/287439126604",
    "/itm/187781985149",
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
    "/itm/800590051308",  # Schalke 04 third 26/27
    "/itm/168388086797",  # EC Bahia away 2026
    "/itm/366635675880",  # Cagliari home 26/27
    "/itm/178130297912",  # Bosnia away 26/27
    # Unlicensed sublimation mockup, the "Personalized LIGA MX ... 3D"
    # family already covered by EXCLUDE_RE -- this one says "Custom ...
    # Design 3D Shirt" instead, so the regex missed it. Flat render, not a
    # photograph of a real garment.
    "/itm/128012293878",  # "Custom LIGA MX Pumas UNAM 2026 Third 3D"
    # No federation crest and no brand anywhere: a plain blue polo with
    # "ES" screen-printed on the chest, sold as El Salvador's home kit.
    "/itm/147430904083",
    # "2026/2027 Spain Lamine Yamal #19 Home ... Player Version": no adidas
    # mark anywhere and the design doesn't match Spain's real 2026 kit --
    # a name-and-number replica, not the federation shirt.
    "/itm/398378887588",
    # Deportivo Cali's Hillside third kit (WPlay.co sponsor, Cali crest)
    # listed with "Colombia" in the title, so it landed on the colombia
    # national-team key. Cross-team, not low-trust.
    "/itm/198562275583",
    # France "third" 2026/27 on Sport is Good ES/FR (adidas KG7525, pink):
    # this is the FRENCH HANDBALL federation shirt, not football --
    # FFHandball's crest (rooster head over "FRANCE" with the world-title
    # stars), Caisse d'Epargne sponsor, and adidas as supplier, whereas
    # France football is Nike with the FFF shield crest. Nothing in the
    # title says handball, so only a link blocklist catches it
    # (2026-09-20). Same class as the Scotland rugby shirts above.
    "kg7525",
    # --- 2026-09-20 daily pass, eBay current picks ---
    # Wrong team (collision scan): Club America under `israel` (the player
    # is Israel Reyes -- same first-name class as 2026-09-18), a Jordan-BRAND
    # Brazil GK under `jordania`, River Plate 25/26 under `argentina`, Celtic
    # 25/26 third under `escocia`, Colo-Colo's GK shirt under `chile` (it is
    # kept, correctly keyed, as colocolo-goalkeeper-2026).
    "/itm/327313517577",
    "/itm/257688449386",
    "/itm/298679954652",
    "/itm/287594710447",
    "/itm/336798001750?_skw=Chile",
    # PSG third (Dembele #10, Ligue 1 champion patch, $250, grey-wood-table
    # reseller) listed as "France PSG" -> landed on `francia`. It had ALREADY
    # made it in as the only offer of francia-third-2026, which was deleted
    # this pass -- the "check whether an older one of the same class is
    # already in the catalog" rule from 2026-09-10.
    "/itm/407106708110",
    # Chelsea: blue/yellow collared Nike shirt with the OLD yellow-lion crest
    # and no sponsor -- a retro/anniversary release titled "Home Kit
    # 2026-2027". Retro-titled-as-current.
    "/itm/128074862658",
    # Man Utd "goalkeeper 2025/26" (JP3055): adidas ORIGINALS green terrace
    # tee (trefoil logo, Snapdragon print), not a goalkeeper jersey.
    # Wrong item type.
    "/itm/377068395435",
    # Japan "prematch" JFA 2026: adidas Originals black/white lifestyle tee
    # (trefoil), not a pre-match training jersey. Wrong item type.
    "/itm/398394562324",
    # Turkey "away 26/27": Nike WHITE kit with the marbled red chest band --
    # that is Turkiye's older HOME shirt, shot on the artificial-grass
    # backdrop the replica shops use, one listing covering "Size L and M".
    "/itm/298488193990",
    # Flamengo "home 2026/27" at $49.90: the listing photo is AI-GENERATED --
    # garbled adidas wordmark, mush where the neck label text should be, an
    # impossible floating shadow. New false-positive class; the crest and
    # colours look right, which is exactly why only looking at the photo
    # catches it.
    "/itm/358228921300",
    # Iraq "third 2026": real JAKO design and Iraq FA crest, but $28.30 on
    # the metal-grid replica-shop backdrop, and iraq-third-202627 is already
    # on file. Low-trust replica class.
    "/itm/198412972303",
    # Sao Paulo "third 26" at $28.98 -- the documented template seller whose
    # one-per-team+type titles all claim the next season (2026-09-18).
    "/itm/366665938534",
    # Columbus Crew "26/27 Authentic" -- the 2022/23 shirt (jock tag reads
    # "23") re-listed as current for the third time (09-15, 09-22, 09-24).
    "/itm/117344996491",
    # Flamengo "2026/27" at $49.90 -- AI-generated listing photo (floating
    # shirt, garbled hem text, no sponsors), same class as 09-20/09-22.
    "/itm/358228921300",
    # Chelsea "Home Kit 2026-2027 Authentic EPL" -- a 2015 Nike women's-cut
    # polo, style code 819607-L10A on the hem tag (2026-09-24).
    "/itm/128074862658",
    # Turkiye "2026/27 away" -- Turkey's white HOME kit on the artificial-
    # grass replica backdrop, same class as 09-20/09-22.
    "/itm/298488193990",
    # Japan "2026 World Cup Pre Match" -- adidas Originals JFA lifestyle tee
    # (trefoil logo), same class as the 09-20 drop.
    "/itm/398394562324",
    # NY Red Bulls kids "away" -- adidas DN2956, Climalite branding (~2019),
    # the exact shirt flagged on 09-15; kids blocks hardcode season 2026 so
    # an undated old shirt would be filed as current (2026-09-24).
    "/itm/137594301457",
    # Penarol home 2024 -- footyheadlines.com-watermarked press render as the
    # listing photo, same seller/class as the 09-22 drop (2026-09-24).
    "/itm/397901284083",
    # Eslovaquia home+away (Deporte Outlet / sportspar, Macron, EUR19.99):
    # crest real y foto real, pero el producto no lleva temporada en NINGUN
    # lado -- ni titulo, ni descripcion del feed, ni la pagina del merchant
    # (cuyo unico año plausible es 2024). Es stock viejo de outlet sin fecha,
    # no una camiseta de temporada actual. Descartado a mano el 2026-09-22,
    # el 09-24 y el 09-25; a la tercera va la entrada. El `pclick.php?p=` no
    # sirve (cambia por pull), el numero de articulo de sportspar en la URL
    # de imagen si es estable.
    "60004581-1_600x600.jpg",
    "60004584-1_600x600.jpg",
    # 2026-09-25, los tres candidatos "nuevos" de eBay US de esta pasada,
    # todos del mismo molde dropship (foto de telefono sobre el piso, USD
    # 28.98-29.99, titulo plantilla "JERSEY <equipo> <temporada>"):
    # Schalke 04 GK 26/27 y Paris FC away 26/27 llevan el trefoil de adidas
    # Originals (linea lifestyle, no de juego) y el Schalke ademas dice
    # CLIMACOOL en el ruedo, tecnologia retirada anios antes de esa
    # temporada. El Salvador home 26/27 no tiene escudo de federacion (solo
    # las letras "ES") ni marca por ningun lado -- misma plantilla generica
    # que el El Salvador away 2023 ya bloqueado mas arriba.
    "/itm/227531276227",
    "/itm/820163504044",
    "/itm/147430864671",
    # 2026-09-25, pasada kids de eBay US. Los dos primeros son conjuntos
    # (camiseta + short), no camisetas, y ninguno lleva el escudo real de su
    # federacion: El Salvador usa el escudo nacional impreso y una marca
    # generica; el de Guatemala es marca "Guate". Es la clase de "kit sets"
    # sin escudo real que el instructivo nombra explicitamente.
    "/itm/152528857600",
    "/itm/147543127669",
    # Camiseta de Brasil archivada bajo la clave `jordania` porque el titulo
    # dice "Jordan" (la marca, no el pais) -- misma colision que el 09-24.
    "/itm/298686687863",
    # Camiseta de Deportivo Cali (club colombiano) archivada bajo la clave
    # `colombia` porque el titulo nombra al pais -- misma clase de colision
    # club-vs-seleccion que india/Kerala Blasters y espana/Valencia. Nota
    # aparte: `colombia-third-2025` que ya esta en products.ts es un
    # Atletico Nacional por la misma razon, entro en una pasada anterior.
    "/itm/820135186242",
    # 2026-09-28. Camiseta de BRASIL (escudo CBF, marca Jordan) archivada bajo
    # `jordania` -- la enesima colision Air Jordan / Jordania. Aparecio en IT y ES.
    "/itm/327279998023",
    # 2026-09-28. Mali Airness real (escudo FMF autentico) pero el diseno es de
    # la era ~2010-2012 y el titulo lo vende como "2026": retro etiquetado como
    # actual, misma clase que el 09-10 de FansJerseyHub.
    "/itm/318871848098",
    # 2026-09-28. Boca "training 26-27" al precio plantilla de $28.98: el diseno
    # es el training adidas de 2024, la temporada del titulo no se sostiene.
    "/itm/377485736668",
    # 2026-09-28. River Plate "training 2026": remera con monograma CARP y SIN
    # marca de proveedor por ningun lado (River es adidas) + "Ask for available
    # sizes" = merchandising no licenciado hecho a pedido.
    "/itm/277854561514",
    # 2026-09-28. Como 1907 away: el titulo inventa una "Champions League
    # Edition" (el Como no juega la Champions) y la prenda lleva CLIMACOOL en el
    # bajo. Replica.
    "/itm/307193936823",
    # 2026-09-28. Argentina "away 2026/27": trefoil de adidas Originals +
    # CLIMACOOL + estampa de filigrana = camiseta lifestyle, no la de partido.
    # Misma clase que el Japon prematch del 09-24.
    "/itm/237058077886",
    # 2026-09-28. Crystal Palace home 26/27 "All Sizes": la camiseta es real y
    # entro al catalogo por FootStoreFR/SportIsGoodFR, pero ESTA publicacion es
    # del tipo hecho-a-pedido (misma senal que el Inglaterra 1998/99 del 09-27).
    "/itm/318901058359",
    # Daily pass 2026-09-29, eBay current picks dropped by photo:
    # "England third" on eBay ES is a NEW ENGLAND REVOLUTION (MLS) shirt --
    # "EST. 1996", tag reads "NE 3 JSY AU". The country/club collision class,
    # and the Revolution are not a TeamKey, so there is nothing to re-file it
    # under.
    "/itm/820066764651",
    # Como 1907 away "Edizione Champions League" on eBay IT: Como are not in
    # the Champions League, and the sleeve badge is a generic star, not the
    # UCL starball. Same invented-competition tell as the listing dropped
    # 2026-09-28 under this same key.
    "/itm/307193936823",
    # Croatia away 2026/27: real HNS crest but an adidas ORIGINALS trefoil
    # lifestyle jersey, not the match kit -- same class as the Japan prematch
    # (2026-09-24) and the Argentina away (2026-09-28).
    "/itm/800700704692",
    # Hamburger SV away 2026/27 (FansJerseyHub, 2026-09-30): real HSV crest,
    # real HanseMerkur sponsor and Plan International sleeve patch, but the
    # adidas mark is the Originals TREFOIL on both the chest and the neck
    # label, with CLIMACOOL on the hem and "MADE IN THAILAND" -- the exact
    # fake-dropship class already blocklisted for Schalke/Paris FC (09-27),
    # Argentina/Como (09-28) and Croatia (09-29). A match jersey never
    # carries the trefoil.
    "hamburger-sv-away-soccer-jersey-2026-27",
    # VfB Stuttgart "third" 26/27 and "away" 26/27 on eBay US (2026-10-01),
    # both from the $28.98 template line: a matched gold-on-black /
    # black-on-gold pair with the real VfB crest, real JAKO mark and real
    # LBBW sponsor. The catalog already carries Stuttgart's REAL 26/27 away
    # (red/white geometric, stuttgart-away-202627), so this seller's "away"
    # is provably a different garment -- which makes its "third" colourway
    # unverifiable as the official third rather than a special/fan line.
    # The same seller's Stuttgart HOME is the real white Jako shirt, so this
    # is a per-listing drop, not a per-seller one.
    "/itm/267791870857",
    "/itm/267791870887",
    # Como 1907 away 2026/27 on eBay ES (2026-10-01), EUR 351: white shirt
    # with the adidas ORIGINALS TREFOIL on the chest AND a UCL starball
    # sleeve patch for a club that is not in the Champions League, plus
    # CLIMACOOL on the hem. Third pass of this exact invented-competition +
    # trefoil combination under this key (09-28 eBay IT, 09-29 eBay ES).
    "/itm/128076222447",
    # "Juventus Jersey Men XL Ash Blue Adidas Authentic Away Kit Torino City
    # Flag 25/26" (eBay US, 2026-10-01): a JUVENTUS shirt that only matched
    # the `torino` key because Juventus are also from Turin and the seller
    # put "Torino City Flag" in the title. team_collision_scan.py flagged it;
    # it had already been applied as an offer on torino-away-* and was
    # removed by hand. Same class as the 09-28 torino/Juventus pair.
    "/itm/158253976643",
    # team_collision_scan.py catches, 2026-10-02 (all dropped before any
    # insertion this time, unlike 10-01's Juventus/Torino which had to be
    # pulled back out of products.ts by hand). Blocklisted by bare /itm/<id>
    # so the entry holds on every eBay marketplace, not just the one that
    # surfaced it -- see the domain-normalisation note at 2026-10-02.
    "/itm/298722554944",  # Italy/Zaccagni 24/25 national shirt under `lazio`
    "/itm/298722587042",  # Italy/Buongiorno 24/25 national shirt under `napoli`
    "/itm/406823371120",  # Man City/De Bruyne 2020 shirt under `napoli`
    "/itm/405633743951",  # Chile/Zamorano 2001 shirt under `intermilan`
    "/itm/405510909482",  # Racing Club/Lautaro 2018 shirt under `intermilan`
    "/itm/205660497545",  # Leeds United 22/23 under `bournemouth` (2nd pass)
    "/itm/267169767070",  # Newcastle JETS (Australia) under `newcastle` (2nd pass)
    "/itm/178423475382",  # AliExpress-sourced Fulham 24/25 (2nd pass)
    "/itm/135024907509",  # Tunnicliffe Fulham/Man Utd 15/16, team unresolvable
    "/itm/188977093444",  # AS Monaco 19/20 -- visibly SIGNED, sold as a shirt
    "/itm/356317453191",  # Monaco 2018 titled both "Away" and "Third", type unresolvable
    # Kids-pass drops, 2026-10-02 -- all four had already been dropped by
    # hand on 10-01 and came straight back the next pass, so they are
    # blocklisted now rather than re-reviewed nightly. Two classes, both
    # documented: a shirt-and-shorts SET sold as a jersey, and a shirt with
    # a player name/number printed on it.
    "/itm/377484288539",  # Son #7 Tottenham home SET ("conjunto corto"), eBay ES
    "/itm/198601510713",  # Declan Rice Arsenal away, player-printed
    "/itm/178423886558",  # Haaland Man City third, player-printed, toddler 3T
    "/itm/377156867000",  # Burkardt Eintracht Frankfurt third, player-printed
    # team_collision_scan drops, 2026-10-03 -- the scan was run BEFORE
    # applying (as 10-01 insisted). Four are a more specific CLUB sitting
    # under a national-team key, one is the OPPONENT named in a match
    # shirt's title.
    "/itm/198608432262",  # Colo-Colo 2026 home under `chile`
    "/itm/336797992792",  # Colo-Colo 2026 goalkeeper (Vozinha) under `chile`
    "/itm/860000426355",  # Real Madrid 25/26 third under `japon` ("Blue Japan" colourway)
    "/itm/145035723265",  # Chivas Guadalajara kids third under `mexico`, also player-printed (Alexis Vega)
    "/itm/267734730589",  # BECKHAM #7 ENGLAND shirt under `suecia` ("England v Sweden" 2006)
    # eBay current-pass drops, 2026-10-03 (photo-verified)
    "/itm/178533753238",  # UNIVERSIDAD DE CHILE (club) under `chile|third` -- team_collision_scan
                          # structurally cannot flag this: the club is not in TEAM_PATTERNS at all
    "/itm/198517560808",  # "Ecuador 26/27 third": navy polo, FEF crest but NO Marathon wordmark
                          # anywhere -- unlicensed replica (the real Ecuador kits all carry it)
    "/itm/198573703256",  # Mexico 26/27 home, player-printed (Gilberto Mora #10) AND long sleeve
    "/itm/198494025481",  # Mexico 26/27 away, player-printed (Raul Jimenez #9)
    "/itm/157101073358",  # Gladbach 25/26 away, older stock against the 26/27 on file
    # eBay kids-pass drops, 2026-10-03 (all photo-verified)
    "/itm/158300298879",  # IFK GOTEBORG (club) 1980s retro under `suecia|home`
    "/itm/297664294770",  # SD DEPORTIVO QUITO (club) under `ecuador|away`
    "/itm/358828663936",  # Norway 2026 home, player-printed (#9)
    "/itm/127905570405",  # Peru away, player-printed (Guerrero #9)
    "/itm/336722039175",  # Morocco 2026 away, player-printed (Brahim 10) and a SET
    "/itm/287431992799",  # Senegal 2026 home, player-printed (Mane #10)
    "/itm/128087310382",  # Mexico kids "Sports Uniform" -- photo is a shirt-AND-SHORTS set.
                          # New wording for the documented set class: "uniform" is the tell
                          # here, the title never says shorts/conjunto, so only the photo caught it.
    "/itm/336596444486",  # Belgium "Sizes Youth to Adult" template -- adult-cut hanger shot,
                          # not a kids garment, and the kit pictured is not the current one
    # eBay retro-pass drops, 2026-10-03 (photo-verified). The first three are
    # the night's recurring class: a CLUB whose title also names its country
    # lands on the country's key, and team_collision_scan.py structurally
    # cannot flag any of them because none of these clubs is in TEAM_PATTERNS.
    "/itm/168511234098",  # dinamarca-retro-2011-home: SonderjyskE (Danish CLUB) under `dinamarca`
    "/itm/158319086039",  # dinamarca-retro-201213-away: FC Nordsjaelland (Danish CLUB) under `dinamarca`
    "/itm/237068267639",  # suiza-retro-201920-away: Grasshoppers Zurich (Swiss CLUB) under `suiza`
    "/itm/355122697509",  # intermilan-retro-2012-third: title says both "Visitante" and "Tercera" -- type unresolvable
    "/itm/146449629398",  # lille-retro-201617-home: white shirt sold as Lille HOME (Lille home is red) -- type mismatch
    "/itm/157770038668",  # acmilan-retro-200405-third: anachronistic print (RONALDO 99 on a 2004/05 Milan third; he joined in 2007)
    # Barrido de fotos 2026-10-04 (todas las fotos del catálogo, verificadas a mano):
    "Retro_Manchester_United_Away_Jersey_199294_1_1.webp",  # manutd-retro-199294-away: WRONG_KIT -- camiseta verde/amarilla Newton Heath = tercera 1992/94; la visitante 92/94 es la azul
    "/itm/318475554643",  # curacao-home-2026: WRONG_KIT -- camiseta amarilla = visitante de Curazao; la local es azul
    "756502-03-1_600x600.jpg&feedId=99907&k=555c20fd43f7a7f797e384d466e125bf6e143cce",  # chequia-away-2026: WRONG_KIT -- camiseta amarillo fluor lisa (arquero/entreno); la visitante 2026 es blanca con dorado como las ot
    "71ABj3T8hBL._AC_SL1400_.jpg",  # dortmund-third-202627: WRONG_KIT -- camiseta amarilla/negra estilo local; la tercera 26/27 es violeta como las demas fotos
    "/itm/307117902868",  # tailandia-away-2026: WRONG_TEAM -- camiseta del club Chiang Rai United (Singha), no de la seleccion de Tailandia
    "/itm/307117967745",  # tailandia-home-2026: WRONG_TEAM -- camiseta naranja del club Chiang Rai United (Singha), no de la seleccion de Tailandia
    "/itm/336688992428",  # vietnam-home-2026: NO_PRODUCT -- captura de pantalla de app/promo con jugador y botones de interfaz, no foto del producto
    "/itm/287402237773",  # arsenal-retro-202324-third: WRONG_KIT -- amarillo fluor con remolinos negros = visitante 23/24; la tercera es la verde azulada de las fotos 3-4
    "/itm/298699324661",  # astonvilla-retro-202324-away: NO_PRODUCT -- primer plano de etiqueta y escudo, no se ve la camiseta
    "Camisola_Alternativa_24-25_do_Aston_Villa_FC_Branco_JK4034_21_model.jpg&feedId=92150&k=29024e0b1e7704829238bf21ab263325e4ad6476",  # astonvilla-retro-202425-away: NO_PRODUCT -- placeholder 'No image available'
    "/itm/406745785301",  # astonvilla-retro-202425-away: WRONG_KIT -- camiseta negra; la visitante 24/25 es blanca (fotos oficiales adidas 10-11, 14)
    "/itm/257352568181",  # astonvilla-retro-202223-home: WRONG_KIT -- camiseta celeste camuflada BK8 (alternativa 23/24); la local 22/23 es granate Cazoo
    "/itm/227125397691",  # atalanta-retro-202223-home: WRONG_KIT -- camiseta blanca = visitante; la local de Atalanta es a rayas azules y negras
    "/itm/295564190170",  # australia-retro-2015-away: NOT_JERSEY -- solo el set de nombre y numero termoadhesivo (KERR 20), no una camiseta
    "/itm/203996348233",  # australia-retro-2018-away: WRONG_KIT -- camiseta amarilla = local de Australia 2018; la visitante es oscura
    "/itm/278410856754",  # barcelona-retro-202425-away: WRONG_KIT -- camiseta rosa/celeste = tercera 24/25; la visitante 24/25 es negra como las fotos 0 y 2
    "/itm/167711204577",  # bayern-retro-201516-away: WRONG_KIT -- rayas rojas y azules = local 2014/15; la visitante 15/16 es la blanca de las fotos 17 y 19
    "/itm/198594859288",  # bayern-retro-202324-away: WRONG_KIT -- blanca con mangas rojas = local 23/24; la visitante 23/24 es la negra de las fotos 24, 25 y 27
    "/itm/377158989396",  # benfica-retro-202324-away: WRONG_KIT -- camiseta blanca/crema = tercera 23/24; la visitante 23/24 es la negra de las fotos 14 y 16
    "/itm/266920229019",  # brasil-retro-2016-third: WRONG_TEAM -- camiseta verde del club Chapecoense (Umbro), no de la seleccion de Brasil
    "/itm/800556538613",  # chelsea-retro-201011-away: NOT_JERSEY -- solo el set termoadhesivo de nombre y numero (DROGBA 11), no una camiseta
    "/itm/117281417468",  # chelsea-retro-2012-home: NO_PRODUCT -- foto de partido de un jugador festejando con el trofeo, no foto del producto
    "/itm/394816053864",  # chelsea-retro-202223-home: KIDS_MISMATCH -- nina con conjunto infantil (titulo 13-15 anos); la ficha no es de ninos
    "/itm/407176945134",  # chile-retro-2020-away: WRONG_TEAM -- camiseta de Universidad de Chile (escudo U, Petrobras), ficha es la selección de Chile
    "/itm/366476392229",  # chile-retro-2023-away: WRONG_TEAM -- camiseta de Universidad Católica (Under Armour, BCE), ficha es la selección de Chile
    "/itm/137741734048",  # colombia-retro-2024-away: WRONG_TEAM -- camiseta del Deportivo Cali (Kappa), ficha es la selección de Colombia
    "/itm/226445890639",  # colombia-retro-2018-third: WRONG_TEAM -- camiseta de Deportes Tolima, ficha es la selección de Colombia
    "/itm/188345595204",  # corinthians-retro-202425-away: NO_PRODUCT -- captura de pantalla de un celular (resultado de búsqueda), no foto del producto
    "/itm/117023540434",  # dinamarca-retro-201920-away: WRONG_TEAM -- camiseta naranja del club Aarhus AGF (Hummel, Bravida), ficha es la selección de Dinamarca
    "/itm/234689761297",  # escocia-retro-201819-away: WRONG_TEAM -- camiseta del club Partick Thistle (Joma), ficha es la selección de Escocia
    "/itm/336601591774",  # escocia-retro-202021-home: WRONG_TEAM -- camiseta del club East Fife (Joma, tartán amarillo), ficha es la selección de Escocia
    "/itm/158063372166",  # escocia-retro-202425-home: WRONG_KIT -- camiseta blanca/violeta = la away 24/25 de Escocia, ficha es home (azul marino)
    "/itm/236820169456",  # everton-retro-202122-home: WRONG_KIT -- camiseta a rayas negras/amarillas, no la local azul de Everton 21/22
    "/itm/257190241731",  # everton-retro-201617-third: WRONG_TEAM -- camiseta de Everton de Viña del Mar (Chile), ficha es Everton inglés
    "/itm/188489102552",  # feyenoord-retro-2004-away: WRONG_KIT -- camiseta mitad roja/blanca = la local de Feyenoord, ficha es away
    "/itm/168511236872",  # finlandia-retro-2007-home: WRONG_KIT -- camiseta azul (sponsor Zest, partido benéfico), la local de Finlandia es blanca
    "macron_60004631_rouge-blanc_1.webp",  # gales-retro-202425-home: NOT_JERSEY -- camiseta de RUGBY de Gales (Macron, Vodafone, 6 Nations)
    "/itm/335030316427",  # gremio-retro-202223-away: NO_PRODUCT -- foto de un jugador con un trofeo en el estadio, no foto del producto
    "/itm/256890638862",  # gremio-retro-202223-home: WRONG_KIT -- camiseta blanca = la away de Grêmio, ficha es home (rayas azul/negro)
    "/itm/137308122872",  # guatemala-retro-2021-away: WRONG_TEAM -- camiseta del club CSD Municipal (Banrural), ficha es la selección de Guatemala
    "/itm/315781449031",  # guatemala-retro-2022-away: WRONG_TEAM -- camiseta del club CSD Municipal (Banrural, betcris), ficha es la selección de Guatemala
    "/itm/257319194460",  # guatemala-retro-202425-away: WRONG_TEAM -- camiseta del club Comunicaciones (Kelme, Banrural), ficha es la selección de Guatemala
    "/itm/257009497184",  # india-retro-202122-away: WRONG_TEAM -- camiseta del club Real Kashmir (Six5Six), ficha es la selección de India
    "/itm/318563694899",  # indonesia-retro-2017-away: WRONG_TEAM -- camiseta del club Persiba Balikpapan, ficha es la selección de Indonesia
    "/itm/358914667997",  # inglaterra-retro-202425-away: WRONG_KIT -- camiseta blanca = la local de Inglaterra, la away 24/25 es violeta
    "/itm/257409359540",  # inglaterra-retro-202122-third: WRONG_TEAM -- camiseta del club Torquay United (rayas negras/doradas), ficha es la selección de Inglaterra
    "/itm/257641763193",  # intermilan-retro-202021-away: WRONG_KIT -- camiseta gris a rayas = la tercera del Inter 20/21, ficha es away (blanca)
    "/itm/175387770025",  # iraq-retro-202021-away: WRONG_TEAM -- camiseta del club Naft Al-Wasat (Bird), ficha es la selección de Irak
    "/itm/358399139913",  # iraq-retro-201920-home: WRONG_TEAM -- camiseta del club Naft Al-Wasat (Bird), ficha es la selección de Irak
    "/itm/187550911520",  # israel-retro-202122-away: WRONG_TEAM -- camiseta del club Maccabi Netanya (Lotto, sponsor en hebreo), ficha es la selección de Israel
    "/itm/186573876170",  # israel-retro-202324-away: WRONG_TEAM -- camiseta del club Maccabi Netanya (Lotto), ficha es la selección de Israel
    "/itm/187503065175",  # israel-retro-202223-home: WRONG_TEAM -- camiseta amarilla del club Maccabi Netanya (Lotto), ficha es la selección de Israel
    "/itm/186573835298",  # israel-retro-202324-home: WRONG_TEAM -- camiseta amarilla del club Maccabi Netanya (Lotto), ficha es la selección de Israel
    "/itm/186861695804",  # israel-retro-201718-third: WRONG_TEAM -- camiseta de un club israelí (título: Maccabi Tel Aviv), ficha es la selección de Israel
    "/itm/188462846319",  # israel-retro-202324-third: WRONG_TEAM -- camiseta del club Maccabi Netanya (Lotto), ficha es la selección de Israel
    "/itm/178135470328",  # italia-retro-200809-away: WRONG_KIT -- camiseta azul = la local de Italia, ficha es away (blanca)
    "/itm/174768740126",  # italia-retro-201617-third: WRONG_TEAM -- camiseta del club US Avellino (Givova), ficha es la selección de Italia
    "/itm/334331140562",  # italia-retro-201617-third: WRONG_TEAM -- camiseta del club US Avellino (Givova), ficha es la selección de Italia
    "/itm/205199791029",  # italia-retro-201718-third: WRONG_TEAM -- camiseta del club Chievo Verona (Givova), ficha es la selección de Italia
    "/itm/800468707348",  # jordania-retro-2024-home: WRONG_TEAM -- camiseta del club Al-Hussein (Kelme, amarilla), ficha es la selección de Jordania
    "/itm/137222741915",  # juventus-retro-201920-home: WRONG_KIT -- camiseta blanca con rayas rosas (away 23/24), ficha es la local 19/20 (blanca/negra mitad)
    "/itm/298575036900",  # lazio-retro-202425-home: WRONG_TEAM -- camiseta de la selección de Italia (adidas, escudo FIGC, #20 Zaccagni), ficha es Lazio
    "Camiseta_primera_equipacion_Leeds_United_FC_24-25_Adolescentes_Blanco_IV9677_21_model.jpg&feedId=92152&k=7793c04708ee4858a1a7557747ada415dd7ad9f1",  # leeds-retro-202425-home: KIDS_MISMATCH -- foto de dos niños con 
    "/itm/398362891958",  # liverpool-retro-2016-away: WRONG_KIT -- camiseta roja Firmino 11 = la local, ficha es away
    "/itm/206431800713",  # liverpool-retro-202223-third: WRONG_KIT -- camiseta blanca con remolinos = la away 2022/23, ficha es third
    "/itm/178207769789",  # mallorca-retro-2008-home: WRONG_KIT -- camiseta blanca, la local del Mallorca es roja; parece la visitante
    "/itm/358222765271",  # mancity-retro-202324-third: NO_PRODUCT -- captura de pantalla de una app de compras, no foto del producto
    "/itm/405572006138",  # marruecos-retro-202223-away: WRONG_TEAM -- camiseta visitante de España (escudo RFEF, Busquets), ficha es Marruecos
    "/itm/366466466032",  # marruecos-retro-202223-away: WRONG_TEAM -- título y diseño negro/amarillo del club MAS Fès, no de la selección de Marruecos
    "/itm/146593409898",  # napoli-retro-2007-home: WRONG_KIT -- camiseta gris con dorado, la local del Napoli es celeste
    "/itm/266000869291",  # napoli-retro-201011-home: WRONG_KIT -- camiseta gris/plateada, no la local celeste del Napoli
    "/itm/146555089543",  # napoli-retro-2011-home: WRONG_KIT -- camiseta amarilla Cavani 7, la local del Napoli es celeste
    "/itm/235030235882",  # newcastle-retro-199596-home: NOT_JERSEY -- alfombrilla de bar Newcastle Brown Ale con botellas, no una camiseta
    "/itm/358781835788",  # noruega-retro-202425-home: WRONG_KIT -- camiseta blanca Haaland 9 = la visitante de Noruega, la local es roja
    "/itm/325694150232",  # peru-retro-2012-away: WRONG_TEAM -- camiseta del club César Vallejo (UCV), no de la selección de Perú
    "/itm/325694150222",  # peru-retro-2013-away: WRONG_TEAM -- camiseta del club Juan Aurich, no de la selección de Perú
    "/itm/325694150236",  # peru-retro-2014-away: WRONG_TEAM -- camiseta del club UTC Cajamarca, no de la selección de Perú
    "/itm/357674810534",  # peru-retro-2022-away: WRONG_TEAM -- camiseta del club Alianza Lima, no de la selección de Perú
    "/itm/358711961404",  # peru-retro-2022-home: WRONG_TEAM -- camiseta rosa del club Sport Boys, no de la selección de Perú
    "/itm/397766697011",  # peru-retro-2022-third: WRONG_TEAM -- camiseta verde del club Sporting Cristal, no de la selección de Perú
    "/itm/177218463150",  # porto-retro-202122-away: WRONG_TEAM -- camiseta del Internacional de Porto Alegre (Banrisul), ficha es FC Porto
    "/itm/273201542539",  # porto-retro-201617-home: WRONG_KIT -- camiseta naranja de arquero (título dice Goal Keeper), ficha es la local de jugador
    "/itm/158350515444",  # portugal-retro-201819-home: WRONG_TEAM -- camiseta del club GD Chaves (título y escudo), no de la selección de Portugal
    "/itm/127190029916",  # realbetis-retro-202324-away: WRONG_KIT -- camiseta a rayas verdiblancas (sponsor Gree) = una local del Betis, ficha es away
    "/itm/188764338762",  # realmadrid-retro-202223-home: NO_PRODUCT -- foto de Benzema festejando en un partido, no foto del producto
    "5183EhxAjnL._AC_UL1000_.jpg",  # riverplate-retro-202324-third: WRONG_KIT -- diseño de dientes blancos sobre rojo = la away 23/24 (igual que n0/n1), la third es negra con banda roja (n13)
    "/itm/236750662486",  # suecia-retro-200203-away: WRONG_TEAM -- camiseta del club Helsingborgs IF (título y escudo), no de la selección de Suecia
    "/itm/236748960704",  # suecia-retro-200203-home: WRONG_TEAM -- camiseta a rayas celestes/azules del club Djurgardens (título), no de la selección de Suecia
    "/itm/357321213629",  # suecia-retro-201415-home: WRONG_TEAM -- camiseta negra del club AIK (título y escudo), no de la selección de Suecia
    "/itm/820078842059",  # suiza-retro-2008-home: NOT_JERSEY -- remera roja de hincha con estampado suisse08, no la camiseta de juego
    "/itm/157829244658",  # suiza-retro-201617-home: WRONG_TEAM -- camiseta negra del club FC Lugano (título y escudo), no de la selección de Suiza
    "/itm/267497734722",  # tottenham-retro-201819-home: WRONG_KIT -- camiseta azul marino/violeta = la visitante 18/19, ficha es home (blanca)
    "/itm/188205857542",  # tottenham-retro-202021-third: WRONG_KIT -- camiseta blanca manga larga, la third 20/21 es amarilla
    "/itm/176000817467",  # turquia-retro-201011-away: WRONG_TEAM -- camiseta del Galatasaray (Türk Telekom), ficha es selección de Turquía
    "/itm/157900079713",  # turquia-retro-202122-away: WRONG_TEAM -- camiseta del Karsiyaka, ficha es selección de Turquía
    "/itm/147493858992",  # turquia-retro-202324-away: WRONG_TEAM -- camiseta del MKE Ankaragucu, ficha es selección de Turquía
    "/itm/336150968325",  # turquia-retro-2019-home: WRONG_TEAM -- camiseta del Goztepe (rayas amarillas y rojas), ficha es selección de Turquía
    "/itm/227001555677",  # turquia-retro-202021-third: WRONG_TEAM -- camiseta del Adana Demirspor, ficha es selección de Turquía
    "/itm/318285788358",  # ucrania-retro-201415-away: WRONG_TEAM -- camiseta del club Metalurh (Sobol 55), ficha es selección de Ucrania
    "/itm/236968167186",  # ucrania-retro-2015-away: WRONG_TEAM -- camiseta del Dynamo Kyiv, ficha es selección de Ucrania
    "/itm/317805241980",  # ucrania-retro-202021-third: WRONG_TEAM -- camiseta del Dynamo Kiev (New Balance), ficha es selección de Ucrania
    "/itm/266920229888",  # ucrania-retro-202122-third: WRONG_TEAM -- camiseta del Shakhtar (Mariupol 4), ficha es selección de Ucrania
    "/itm/298212527441",  # ucrania-retro-202425-third: WRONG_TEAM -- camiseta del Shakhtar segun titulo, ficha es selección de Ucrania
    "/itm/287585886901",  # valencia-retro-202223-away: WRONG_TEAM -- camiseta de Ecuador con E. Valencia 13, ficha es Valencia CF
    "/itm/267206129228",  # wolves-retro-202425-away: WRONG_KIT -- camiseta amarilla/dorada = la local 24/25 de Wolves, la visitante es negra
    "/itm/227318653330",  # zambia-retro-202021-home: WRONG_TEAM -- camiseta del club Nkana (betway), ficha es selección de Zambia
    "ArgentinaHomeWorldCupJerseysKit2026_1.png",  # arg-home-2026: NOT_JERSEY -- conjunto camiseta+short (Jersey Kit)
    "2025_12_adidas_kf1712_1_apparel_photography_front_center_view_white.jpg&feedId=89044&k=5ef7dc6adfdf590831224a5088ebf2ea2c9ca7a5",  # fra-home-2026: NOT_JERSEY -- camiseta de RUGBY de Francia (adidas, Altrad)
    "2025_12_adidas_kf1712_1_apparel_photography_front_center_view_white.webp",  # fra-home-2026: NOT_JERSEY -- camiseta de RUGBY de Francia (adidas, Altrad)
    "1039537_main.jpg",  # fra-home-2026: NOT_JERSEY -- camiseta de RUGBY de Francia (adidas, Altrad); la de fútbol es Nike
    "Germany_Home_Jersey_Kit_World_Cup_2026_1.webp",  # ale-home-2026: NOT_JERSEY -- conjunto camiseta+short (Jersey Kit)
    "adidas_jy5633_1_apparel_photography_front_center_view_white.jpg&feedId=89032&k=f3985470a63963b42b5110fa1d681585348e516b",  # ita-home-2026: WRONG_KIT -- camiseta blanca con dorado = la visitante; la local de Italia 
    "adidas_jy5633_1_apparel_photography_front_center_view_white.jpg&feedId=89044&k=f3985470a63963b42b5110fa1d681585348e516b",  # ita-home-2026: WRONG_KIT -- camiseta blanca con dorado = la visitante; la local de Italia 
    "adidas_jy5633_1_apparel_photography_front_center_view_white.webp",  # ita-home-2026: WRONG_KIT -- camiseta blanca con dorado = la visitante; la local de Italia es azul
    "/itm/298525888367",  # ing-home-2026: AI_RENDER -- mock-up digital 'Re-Printed Jersey by Fan Made', no es foto del producto
    "1031188_main.jpg",  # ing-home-2026: NOT_JERSEY -- camiseta de RUGBY de Inglaterra (Castore, O2, rosa)
    "medias-1001053778-00-P-X-20251022162949.jpg",  # bar-home-2025: WRONG_KIT -- camiseta con rayas finas onduladas (pre-match/entrenamiento), no la local 25/26 a franjas
    "ii1690-101.webp",  # psg-home-2026: WRONG_KIT -- camiseta blanca = la visitante del PSG; la local es azul con franja roja
    "/itm/318324603521",  # che-home-2025: NO_PRODUCT -- captura de pantalla de celular (barra de estado visible), producto diminuto
    "/itm/820002300174",  # ale-goalkeeper-2026: WRONG_KIT -- camiseta de arquero naranja = la visitante (titulo 'Away Goalkeeper'), ficha es la de arquero local verde
    "1034363_list.jpg",  # bar-third-202526: NOT_JERSEY -- buzo de manga larga azul marino (Total 90), no la camiseta third naranja
    "1034430_main.jpg",  # che-third-202526: NOT_JERSEY -- buzo de manga larga negro (Total 90), no la camiseta
    "/itm/318931203260",  # col-away-2026: WRONG_KIT -- camiseta amarilla = la local de Colombia, ficha es away (azul)
    "2025_12_adidas_jy0843_1_apparel_photography_front_center_view_white.jpg&feedId=89044&k=9f752ee8a571be6b3bf25b4aa9a036710d3586b4",  # fra-away-2026: NOT_JERSEY -- camiseta de RUGBY de Francia (adidas, Altrad)
    "adidas_jp4334_2_apparel_photography_front_center_view_white.webp",  # fra-away-2026: NOT_JERSEY -- camiseta de RUGBY de Francia (adidas, Caisse d'Epargne); la de fútbol es Nike
    "1031189_main.jpg",  # ing-away-2026: NOT_JERSEY -- camiseta de RUGBY de Inglaterra (Castore, O2, rosa)
    "KA8093-01.jpg&feedId=99415&k=696ae3a53402fc81af06a03450da7a2aaa5f64d5",  # liv-away-202526: WRONG_KIT -- reedición retro 'Away Jersey 95' verde/blanca Carlsberg, no la visitante 25/26
    "KA8093-01.jpg&feedId=99347&k=696ae3a53402fc81af06a03450da7a2aaa5f64d5",  # liv-away-202526: WRONG_KIT -- reedición retro 'Away Jersey 95' verde/blanca Carlsberg, no la visitante 25/26
    "JM5495-01.jpg&feedId=99347&k=094283ea374da70801417bbb1eedd0b39c7b498d",  # manutd-away-202526: WRONG_KIT -- reedición retro 'Away Jersey 90/92' azul con Sharp, no la visitante 25/26
    "71K4inPLuJL._AC_SL1400_.jpg",  # por-away-2026: WRONG_KIT -- camiseta roja = la local de Portugal 2026, ficha es away
    "PSG_Fourth_Away_Soccer_Jersey_202526_2.webp",  # psg-away-202526: WRONG_KIT -- titulo y foto son la cuarta (negra Jordan), no la visitante
    "nike_hm3606-101_white-global-red_1.jpg&feedId=89032&k=4bc19f136a2ae93516e64844414e7de3aefc2b44",  # psg-third-202526: WRONG_KIT -- top de entrenamiento Strike blanco manga larga, la third 25/26 es roja
    "nike_hm3606-101_white-global-red_1.webp",  # psg-third-202526: WRONG_KIT -- top de entrenamiento Strike blanco manga larga, la third 25/26 es roja
    "1034562_main.jpg",  # psg-third-202526: NOT_JERSEY -- buzo de manga larga negro (Total 90), no la camiseta
    "/itm/318218519008",  # barcelona-away-kids: WRONG_TEAM -- camiseta del Barcelona SC de Ecuador (sponsor Pony Malta), ficha es FC Barcelona
    "/itm/116378559686",  # barcelona-home-kids: NOT_JERSEY -- remera de fan genérica azul marino con mangas rojas y escudo, sin marca ni diseño de la local
    "/itm/406060278569",  # espana-home-kids: NOT_JERSEY -- remera souvenir roja con texto ESPAÑA estampado, sin escudo RFEF ni marca
    "/itm/386881438318",  # francia-home-kids: NOT_JERSEY -- remera souvenir genérica con FRANCE 10 estampado, sin escudo FFF ni marca
    "/itm/318897992133",  # manutd-away-kids: AI_RENDER -- mock-up frente/espalda con leyenda "Item VAULT AI Generated", no es foto real
    "2025_10_adidas_kd4339_1_apparel_photography_front_view_white.webp&feedId=89044&k=601325266f3232753331f6382b38b5061387f0f6",  # realmadrid-home-kids: NOT_JERSEY -- camiseta sin mangas de básquet del Real Madrid
    "2025_10_adidas_kd4339_1_apparel_photography_front_view_white.webp",  # realmadrid-home-kids: NOT_JERSEY -- camiseta sin mangas de básquet del Real Madrid
    "errea_smkh6c20960pow_01.jpg&feedId=89044&k=5c166829812700a3e267d60ff79045f9d7b6bdc2",  # acmilan-away-202526: NOT_JERSEY -- camiseta de vóley del Allianz Powervolley Milano (Errea, Enercom, DeniCar), no es del AC Mi
    "errea_smkh6c20960pow_01.webp",  # acmilan-away-202526: NOT_JERSEY -- camiseta de vóley del Allianz Powervolley Milano (Errea, Enercom, DeniCar), no es del AC Milan
    "errea_smkh6c0041300pow_01.jpg&feedId=89044&k=f2070802b602a9676d1713baa3f6d68b968afab2",  # acmilan-home-202526: NOT_JERSEY -- camiseta de vóley del Allianz Powervolley Milano (Errea, Enercom, DeniCar), no es del AC 
    "errea_smkh6c0041300pow_01.webp",  # acmilan-home-202526: NOT_JERSEY -- camiseta de vóley del Allianz Powervolley Milano (Errea, Enercom, DeniCar), no es del AC Milan
    "1034540_list.jpg",  # tottenham-third-202526: NOT_JERSEY -- buzo/sudadera celeste de cuello redondo con puños y cintura elastizados, no la camiseta third
    "/itm/377245703924",  # intermilan-third-202526: WRONG_KIT -- camiseta azul/negra con logo Le Coq Sportif, no es la third Nike 25/26 azul marino y naranja
    "1034447_main.jpg",  # intermilan-third-202526: NOT_JERSEY -- buzo/sudadera gris de cuello redondo con puños elastizados, no la camiseta third
    "JapanHomeWorldCupJerseysKit2026_1.png",  # japon-home-2026: NOT_JERSEY -- conjunto camiseta + short (kit), ficha adulta de camiseta
    "/itm/398259494251",  # mexico-third-2026: AI_RENDER -- imagen generada: maniquí en tienda irreal, bandera pegada en lugar del escudo, sin logo adidas
    "/itm/158275836297",  # suecia-away-2026: WRONG_TEAM -- camiseta suplente gris Puma del Malmö FF (lo dice el título), ficha es la selección de Suecia
    "FCKolnhomejersey2627_1.webp",  # koln-home-202627: WRONG_KIT -- camiseta roja a rayas finas, la local 26/27 es la blanca (fotos adidas 2-4)
    "macron_400074240001_red_1.webp",  # gales-home-202526: NOT_JERSEY -- camiseta de RUGBY de Gales (Macron, Vodafone, plumas WRU)
    "1027156_list.jpg",  # gales-home-202526: NOT_JERSEY -- camiseta de RUGBY de Gales (Macron, Vodafone, plumas WRU)
    "/itm/284176063304",  # japon-away-2026: NO_PRODUCT -- solo la etiqueta y el cuello, no se ve la camiseta
    "Camiseta_primera_equipacion_Chile_93-94_Rojo_JN3716_db21_model.tiff.jpg&feedId=92152&k=eefa5449fefc6e63ed35acd2fa608cef1df921d5",  # chile-home-2026: WRONG_KIT -- retro Chile 93/94 (titulo lo dice), ficha es local 2
    "Camisola_Principal_93-94_do_Chile_Vermelho_JN3716_db21_model.tiff.jpg&feedId=92150&k=d125a4efdd0f93208395f31670131c93b5b1659d",  # chile-home-2026: WRONG_KIT -- retro Chile 93/94 (titulo lo dice), ficha es local 202
    "1027157_list.jpg",  # gales-away-2026: NOT_JERSEY -- camiseta de RUGBY de Gales (Macron, Vodafone, plumas WRU)
    "adidas_jz0265_1_apparel_photography_front_center_view_white.jpg&feedId=89032&k=cac99181e7b7bb0726fcefe08d3a6301a09b389e",  # argelia-home-2026: WRONG_KIT -- diseño marmolado con mangas verdes (Preshi/prematch), dist
    "adidas_jz0265_1_apparel_photography_front_center_view_white.jpg&feedId=89044&k=cac99181e7b7bb0726fcefe08d3a6301a09b389e",  # argelia-home-2026: WRONG_KIT -- diseño marmolado con mangas verdes (Preshi/prematch), dist
    "adidas_jz0265_1_apparel_photography_front_center_view_white.webp",  # argelia-home-2026: WRONG_KIT -- diseño marmolado con mangas verdes (Preshi/prematch), distinto de la local blanca 2026 (fotos 24-28)
    "617Peh3FvxL._AC_SL1200_.jpg",  # dortmund-training-202526: WRONG_KIT -- camiseta de partido negra con franja amarilla 1&1 (visitante), no la de entrenamiento
    "adidas_jp1667_white_4.webp",  # juventus-prematch-mural-202526: WRONG_KIT -- prematch de rayas pastel, la ficha es la variante mural gris (fotos 3-5)
    "/itm/206538278086",  # juventus-prematch-mural-202526: WRONG_KIT -- prematch de rayas pastel, la ficha es la variante mural gris (fotos 3-5)
    "/itm/188699131523",  # juventus-prematch-mural-202526: WRONG_KIT -- prematch de rayas pastel, la ficha es la variante mural gris (fotos 3-5)
    "errea_fm816c00010frv_0.jpg&feedId=89044&k=2773894e7e3a55954b483236ecb3b7267f00ec2f",  # francia-training-202526: NOT_JERSEY -- camiseta Errea con MAIF de otro deporte (la FFF viste Nike), no es de futbol
    "errea_fm816c00010frv_0.webp",  # francia-training-202526: NOT_JERSEY -- camiseta Errea con MAIF de otro deporte (la FFF viste Nike), no es de futbol
    "Camisola_de_Treino_Terrace_Icons_da_AS_Roma_Branco_JM2127_21_model.jpg&feedId=92150&k=681c79bc001599c092e14f270084ced887a3d251",  # roma-training-202526: NOT_JERSEY -- chaqueta de chandal blanca con cierre (Terrace 
    "Camisola_de_Fato_de_Treino_Inter_Miami_Originals_Branco_KG9610_21_model.jpg&feedId=92150&k=6bbd721917fe4015d5bb86dbbc127c824376157e",  # intermiami-training-202526: NOT_JERSEY -- chaqueta de chandal blanca con cierr
    "/itm/358741585511",  # grecia-away-2026: WRONG_KIT -- camiseta blanca con detalles azules = la local de Grecia; la visitante 2026 es azul (fotos 1-6)
    "/itm/820116366864",  # alnassr-home-202526: NOT_JERSEY -- conjunto camiseta + short (short azul con el 7 en primer plano)
    "canterbury-qa009625bk3-blanc-de-blanc-cadmium-green-1.webp",  # irlanda-away-202526: NOT_JERSEY -- camiseta de rugby de Irlanda (Canterbury, Vodafone)
    "/itm/117356287506",  # irlanda-away-202526: WRONG_TEAM -- título y escudo de Irlanda del Norte, ficha es Irlanda
    "/itm/407132376246",  # mancity-away-202526: WRONG_KIT -- camiseta celeste = la local del City, ficha es away
    "Retro_Soccer_Jersey_AC_Milan_Away_201314_1__1.webp",  # acmilan-retro-201314-away: WRONG_KIT -- camiseta dorada = la tercera 2013/14 del Milan, la away era blanca
    "/itm/117225379894",  # acmilan-retro-199394-home: NO_PRODUCT -- foto/póster de Van Basten con escudos superpuestos, no es foto del producto
    "/itm/227331204113",  # acmilan-retro-202425-third: NO_PRODUCT -- solo se ve la etiqueta de precio en una mano, no la camiseta
    "Camiseta_segunda_equipacion_Ajax_24-25_Adolescentes_Azul_IT3493_21_model.jpg&feedId=92152&k=68a1f3bedfad837082d7c028ffb7cbaef5781d10",  # ajax-retro-202425-away: KIDS_MISMATCH -- niño con la camiseta, título dice Ad
    "623_-_image1_-_ddr-1543.webp&feedId=89044&k=5cfc7f661fea272cc1aff5d11634cd2e775db3ed",  # alemania-retro-1974-home: WRONG_TEAM -- camiseta azul de la DDR (Alemania del Este), título lo confirma; ficha es Alemania
    "623_-_image1_-_ddr-1543.webp&feedId=89032&k=5cfc7f661fea272cc1aff5d11634cd2e775db3ed",  # alemania-retro-1974-home: WRONG_TEAM -- camiseta azul de la DDR (Alemania del Este), título lo confirma; ficha es Alemania
    "623_-_image1_-_ddr-1543.webp",  # alemania-retro-1974-home: WRONG_TEAM -- camiseta azul de la DDR (Alemania del Este), título lo confirma; ficha es Alemania
    "/itm/407100224075",  # argentina-retro-1994-away: NO_PRODUCT -- captura de pantalla de celular con la camiseta chiquita
    "/itm/358858900268",  # arsenal-retro-200405-away: NO_PRODUCT -- primer plano del logo de Nike, no se ve la camiseta
    "/itm/137081106985",  # atleticomadrid-retro-202425-home: NOT_JERSEY -- top corto sin mangas (crop tank) con el diseño, no es la camiseta
    "nike_fq2609-418-phsfm001.webp&feedId=89032&k=aba351d9aab5f2057f4e58e23edbcc94315c7604",  # barcelona-retro-202425-third: WRONG_KIT -- camiseta azul de entrenamiento Strike, no la tercera 24/25
    "nike_fq2609-418-phsfm001.jpg",  # barcelona-retro-202425-third: WRONG_KIT -- camiseta azul de entrenamiento Strike, no la tercera 24/25
    "/itm/318246617096",  # bayern-retro-202223-home: WRONG_KIT -- camiseta bordó con dorado = edición Oktoberfest, no la local roja con rayas blancas 22/23
    "/itm/117218479816",  # brasil-retro-1994-home: NO_PRODUCT -- captura de foto de partido de Romario (marca FIFA), no es foto del producto
    "/itm/318447398571",  # brasil-retro-1998-home: WRONG_TEAM -- camiseta blanca con TOTTI 20 en azul (Italia), ficha es Brasil local
    "nike_dz0782-354-phsfm001.webp&feedId=89032&k=bbf898e6e076d4d5ff0e51e076ef2e59bb315af6",  # chelsea-retro-202324-third: WRONG_KIT -- camiseta de entrenamiento Strike con sponsor trivago, no la tercera 23/24 (Infinite
    "nike_dz0782-354-phsfm001.webp",  # chelsea-retro-202324-third: WRONG_KIT -- camiseta de entrenamiento Strike con sponsor trivago, no la tercera 23/24 (Infinite Athlete)
    "/itm/117123842883",  # dinamarca-retro-202223-home: NOT_JERSEY -- remera roja de algodón con estampado 'EM 2024', no es camiseta de fútbol
    "614ElEbIqHL._AC_SL1500_.jpg",  # dortmund-retro-202425-away: WRONG_KIT -- camiseta amarilla = la local 24/25 del Dortmund, ficha es away (negra)
    "/itm/407245261252",  # espana-retro-2006-away: WRONG_KIT -- camiseta roja (colores de local), la away 2006 era blanca
    "/itm/117301962785",  # fiorentina-retro-199899-home: NOT_JERSEY -- conjunto camiseta + short (título 'Shirt Suit')
    "adidas_jg8160-001a_white_1.webp&feedId=89044&k=7b494a45025c4b562db5545d9451d2534eb2381b",  # francia-retro-202425-away: NOT_JERSEY -- camiseta de rugby XV de Francia (Altrad), título lo confirma
    "France1980_84awaylongjersey_1.webp",  # francia-retro-1980-home: WRONG_KIT -- camiseta blanca rayada = la visitante, la local de Francia es azul
    "maillot_xv_de_france_1-photoroom.png-photoroom.webp&feedId=89044&k=93c9fd22845d9596a5912be96865e4e60e99bb85",  # francia-retro-202324-home: NOT_JERSEY -- camiseta de rugby XV de Francia (Le Coq Sportif, Altrad)
    "/itm/168693350010",  # francia-retro-202324-home: NOT_JERSEY -- camiseta adidas de Francia = rugby (la de fútbol es Nike)
    "adidas_jg3533-043a_dark-blue_1.webp&feedId=89044&k=996ec18f1a7d4cd0030063af18263c80023e5e91",  # francia-retro-202425-home: NOT_JERSEY -- camiseta de rugby XV de Francia (adidas, Altrad), título lo confirma
    "umbro_885172-60-1_white_1.webp&feedId=89044&k=1ec91527e2775d4e43fe672f023133d8e2911a85",  # inglaterra-retro-202324-home: NOT_JERSEY -- camiseta de rugby de Inglaterra (Umbro, O2, rosa)
    "umbro_885172-60-1_white_1.jpg",  # inglaterra-retro-202324-home: NOT_JERSEY -- camiseta de rugby de Inglaterra (Umbro, O2, rosa)
    "/itm/167753269347",  # intermiami-retro-202324-home: WRONG_KIT -- camiseta negra = la away 23/24, la local es rosa
    "/itm/287402100966",  # intermilan-retro-202324-away: WRONG_KIT -- camiseta gris/negra con naranja, la away 23/24 es blanca con banda azul
    "/itm/257467130496",  # intermilan-retro-202324-away: WRONG_KIT -- camiseta gris/negra con naranja, la away 23/24 es blanca con banda azul
    "/itm/406818421372",  # intermilan-retro-202425-home: WRONG_TEAM -- camiseta roja de Albania (Macron), ficha es Inter local
    "/itm/206408455241",  # intermilan-retro-202324-third: WRONG_KIT -- camiseta negra con sponsor Qatar Airways (Total 90), no la tercera naranja 23/24
    "macron_58571508_bleu_1.webp",  # italia-retro-202324-home: NOT_JERSEY -- polo Macron de algodón de la selección italiana de RUGBY, no camiseta de fútbol (Italia fútbol es adidas)
    "/itm/407172264687",  # italia-retro-202324-home: WRONG_TEAM -- camiseta negra del Frattese 1928 (Zeus), ficha es Italia local
    "Camiseta_tercera_equipacion_Juventus_24-25_Adolescentes_Azul_IY5249_21_model.jpg&feedId=92152&k=59e1b05c0b3fb3a90aabcb50c3b9abad64988026",  # juventus-retro-202425-third: KIDS_MISMATCH -- foto con dos niños y título
    "Camiseta_calentamiento_Juventus_24-25_Adolescentes_Amarillo_JE4309_21_model.jpg&feedId=92152&k=c2b6e928b0bb5cb70c24c8c3029504b738294318",  # juventus-retro-202425-training: KIDS_MISMATCH -- foto de niño con conjunto
    "/itm/278379677383",  # manutd-retro-202223-away: WRONG_KIT -- camiseta verde fluo = tercera 22/23, la visitante 22/23 es blanca
    "/itm/407130473065",  # manutd-retro-202223-away-mens: WRONG_KIT -- camiseta verde fluo = tercera 22/23, la visitante 22/23 es blanca
    "/itm/278412177727",  # manutd-retro-202324-away: WRONG_KIT -- blanca con franja roja/negra y sponsor Snapdragon (tercera 24/25), no la visitante verde a rayas 23/24 TeamViewer
    "Camiseta_calentamiento_Manchester_United_24-25_Adolescentes_Negro_JD7146_21_model.jpg&feedId=92152&k=c3d29b625ff4c473d5f821b84c8f167c3f202f69",  # manutd-retro-202425-training: KIDS_MISMATCH -- foto de niño con conj
    "/itm/318895545153",  # mexico-retro-2010-home: WRONG_KIT -- camiseta negra #4 = visitante 2010, la local 2010 es verde
    "/itm/158155179594",  # portugal-retro-2010-away: WRONG_KIT -- camiseta roja con franja verde = la LOCAL 2010 (igual a n=9/10), ficha es visitante
    "/itm/128021598273",  # psg-retro-201819-away: WRONG_KIT -- camiseta negra Neymar 10 (Jordan/tercera 18/19), la visitante 18/19 es blanca
    "/itm/117029486211",  # psg-retro-201819-home: WRONG_KIT -- camiseta negra Jordan de Champions (tercera 18/19), ficha es local azul
    "nike_21848753.webp&feedId=89044&k=e0e160e49abc04d0db2f74e1f5afa0768cba30c5",  # psg-retro-202425-home: NOT_JERSEY -- título dice camiseta oficial PSG HANDBALL 24/25, no es la de fútbol
    "nike_21848753.webp",  # psg-retro-202425-home: NOT_JERSEY -- título dice maillot officiel PSG HANDBALL 24/25, no es la de fútbol
    "nike_fq2625-013_black-rust-pink-rust-pink_1.webp&feedId=89032&k=01671f3e42993ac5abd5da441b165b1f75047bec",  # psg-retro-202425-third: WRONG_KIT -- buzo negro manga larga Strike Drill de entrenamiento, la tercera 24/
    "nike_fq2625-013_black-rust-pink-rust-pink_1.jpg",  # psg-retro-202425-third: WRONG_KIT -- buzo negro manga larga Strike Drill de entrenamiento, la tercera 24/25 es rosa
    "/itm/820035987553",  # qatar-retro-202223-home: WRONG_TEAM -- camiseta del PSG Mbappé 7 (título PSG), ficha es selección de Qatar
    "Camiseta_segunda_equipacion_Real_Madrid_24-25_Adolescentes_Naranja_IT5177_21_model.jpg&feedId=92152&k=965e35a8d592804856d8fa5e723b8b21b1c1dab3",  # realmadrid-retro-202425-away: KIDS_MISMATCH -- foto de niño y títul
    "/itm/158287204831",  # westham-retro-202425-away: WRONG_KIT -- título dice 3rd y la foto es la camiseta clara (tercera 24/25), la visitante 24/25 es negra
    "/itm/116288096669",  # westham-retro-202324-home: WRONG_KIT -- dos camisetas blancas, la local 23/24 del West Ham es bordó
    "/itm/176505922181",  # wolves-retro-202122-home: WRONG_KIT -- camiseta blanca ManBetX (no la local dorada 21/22, compárese n=10/11)
    "/itm/800633754547",  # cruzazul-away-202526: NOT_JERSEY -- collage promocional con seis camisetas distintas de Cruz Azul, no se sabe cuál es la visitante
    "/itm/358765808266",  # egipto-away-2026: WRONG_KIT -- camiseta roja Salah 10 = la LOCAL 2026 (igual a n=9), la visitante es blanca
    "/itm/336651922296",  # ghana-home-2026: WRONG_KIT -- camiseta amarilla estampada, la local 2026 de Ghana es blanca (n=25/27-29)
    "/itm/397681308783",  # botafogo-home-2026: NOT_JERSEY -- dos camisetas juntas (local + tercera) en un mismo anuncio
    "/itm/178335321376",  # freiburg-away-202526: WRONG_KIT -- camiseta roja = la local del Freiburg, ficha es away (negra)
    "/itm/146703376205",  # finlandia-retro-2009-home: WRONG_KIT -- camiseta azul = la visitante de Finlandia, ficha es home (blanca)
    "/itm/298686653948",  # jordania-away-2026: WRONG_TEAM -- camiseta de Brasil marca Jordan (Nike), ficha es la selección de Jordania
    "/itm/820028210194",  # jordania-away-2026: WRONG_TEAM -- camiseta de Brasil marca Air Jordan (Raphinha 11), ficha es la selección de Jordania
    "4013715_main.jpg",  # jordania-home-2026: WRONG_TEAM -- camiseta del Bromma IF (club sueco) marca Jordan, ficha es la selección de Jordania
    "/itm/385735127006",  # georgia-retro-2022-away: NOT_JERSEY -- dos camisetas distintas (roja y negra) en la misma foto
    "/itm/188229444076",  # coreadelsur-goalkeeper-2026: NOT_JERSEY -- remera de algodón negra lifestyle (Premium T-Shirt), no camiseta de arquero
    "/itm/236729030617",  # riverplate-training-2025: WRONG_KIT -- camiseta blanca con banda roja = la titular de River, ficha es de entrenamiento
    "/itm/296973317522",  # astonvilla-home-kids: WRONG_KIT -- camiseta amarilla manga larga de arquero, ficha es la local bordó/celeste
    "/itm/316694447809",  # chivas-home-kids: AI_RENDER -- mock-up de camiseta personalizada impresa '3D' rosa, no foto del producto real
    "/itm/318843279987",  # newcastle-home-kids: WRONG_KIT -- camiseta azul = la tercera 25/26 (el título dice Third), ficha es la local a rayas
    "/itm/287479488265",  # acmilan-retro-2007-home: WRONG_KIT -- camiseta blanca = la visitante del Milan, ficha es home rossonera
    "/itm/407245289033",  # arsenal-retro-200102-away: WRONG_KIT -- camiseta roja Dreamcast = la local del Arsenal, ficha es away (dorada)
    "/itm/178207757543",  # austria-retro-2002-away: WRONG_TEAM -- título y camiseta del Rapid Wien (club), ficha es la selección de Austria
    "/itm/186039153265",  # brentford-retro-1989-home: NOT_JERSEY -- almohadón con forma de camiseta, no es una camiseta
    "/itm/204446309289",  # brentford-retro-1989-home: NOT_JERSEY -- fundas para apoyacabezas de auto, no es una camiseta
    "/itm/336274767318",  # chile-retro-1996-home: WRONG_TEAM -- camiseta azul de Universidad de Chile (club), ficha es la selección de Chile
    "/itm/177274087140",  # chile-retro-1998-home: WRONG_TEAM -- camiseta azul de Universidad de Chile (club), ficha es la selección de Chile
    "/itm/157982708708",  # clubamerica-retro-200607-home: NO_PRODUCT -- primer plano de la etiqueta sobre la tela, no se ve la camiseta
    "/itm/286434156997",  # clubamerica-retro-202122-home: WRONG_KIT -- camiseta gris/negra = la alternativa, ficha es la local amarilla
    "/itm/158051166584",  # dinamarca-retro-201213-home: WRONG_TEAM -- camiseta celeste del FC Nordsjaelland (club), ficha es la selección de Dinamarca
    "/itm/318625158284",  # estadosunidos-retro-199495-home: WRONG_KIT -- camiseta 'denim' de estrellas = la visitante del 94, ficha es la local a rayas
    "/itm/158282039150",  # italia-retro-200607-away: WRONG_TEAM -- camiseta del AC Milan final Champions 2007 (parches UCL), ficha es italia
    "/itm/157164898302",  # japon-retro-201415-away: WRONG_KIT -- camiseta amarillo fluor de arquero, la away 2014 de Japon es blanca
    "/itm/235030242408",  # newcastle-retro-199395-home: NOT_JERSEY -- alfombrilla de bar (bar mat runner), no es camiseta
    "/itm/355311641897",  # psg-retro-1992-home: WRONG_KIT -- camiseta blanca Muller = la visitante del PSG, la local 92/93 es azul marino
    "/itm/168220072133",  # senegal-retro-2002-home: WRONG_KIT -- camiseta verde Le Coq Sportif = la visitante 2002 de Senegal, la local es blanca
    "/itm/336414957204",  # werderbremen-retro-201920-home: WRONG_KIT -- camiseta negra = la tercera 19/20 (igual a n=12/13), la local es verde
    "/itm/389487781388",  # westham-retro-1999-third: WRONG_KIT -- camiseta bordo con mangas celestes Fila Dr Martens = la local, ficha es third
    "/itm/236909919042",  # canada-retro-2017-away: WRONG_TEAM -- camiseta del club Impact Montreal (BMO), ficha es seleccion de canada
    "/itm/157839864142",  # eslovenia-retro-201112-home: WRONG_TEAM -- camiseta violeta del club NK Maribor (Andjelkovic), ficha es seleccion de eslovenia
    "/itm/158049739885",  # honduras-retro-202223-away: WRONG_TEAM -- camiseta roja del club Real Espana (Claro), ficha es seleccion de honduras
    "/itm/277854758497",  # paraguay-retro-202425-away: WRONG_TEAM -- camiseta del club Cerro Porteno (ueno, tigo), ficha es seleccion de paraguay
    "/itm/397705254609",  # paraguay-retro-2023-third: WRONG_TEAM -- camiseta del club Olimpia (escudo y tigo), ficha es seleccion de paraguay
    "/itm/226715094524",  # bolivia-retro-2024-home: WRONG_TEAM -- camiseta celeste del club Bolivar (Suzuki), ficha es seleccion de bolivia
    "/itm/267622121684",  # alemania-prematch-2026: WRONG_KIT -- pre-match visitante menta/azul, el resto de la ficha es la pre-match local roja/negra/dorada
    "1054106_list.jpg",  # argelia-prematch-2026: WRONG_KIT -- pre-match segunda (estampado crema/verde), la ficha es la pre-match local blanca con mangas verdes
    "Argentina2026WorldCupPre-MatchShirt_1.webp",  # argentina-prematch-2026: WRONG_KIT -- pre-match local blanca con rayos celestes/azules, la ficha es la pre-match visitante azul/negra
    "/itm/168504992304",  # mexico-prematch-2026: WRONG_KIT -- pre-match visitante negra/verde, el resto de la ficha es la pre-match local verde estampada
    "/itm/327300964300",  # barcelona-prematch-202526: WRONG_KIT -- pre-match away negra edicion Kobe Bryant, la ficha es la Academy Pro local morada/azul
    "adidas-jd7410-bleu-marine-1.jpg&feedId=89032&k=04ce039c772a3353a7d53ed3a354ee79c9060a3b",  # parisfc-home-202526: NOT_JERSEY -- foto de un short azul solo, no camiseta
    "adidas-jd7410-bleu-marine-1.jpg&feedId=89044&k=04ce039c772a3353a7d53ed3a354ee79c9060a3b",  # parisfc-home-202526: NOT_JERSEY -- foto de un short azul solo, no camiseta
    "/itm/335525911724",  # santos-retro-2024-home: WRONG_TEAM -- camiseta del Santos Laguna de Mexico (Soriana, verde y blanca), ficha es Santos de Brasil
    "/itm/406951283143",  # acmilan-retro-199900-away: WRONG_KIT -- camiseta negra/roja a rayas, la away del Milan 99/00 es blanca
    "/itm/315927023786",  # alittihad-retro-201718-home: WRONG_TEAM -- titulo y foto son del Al-Ittihad Tripoli (Libia), roja con Afriqiyah; ficha es Al-Ittihad saudi
    "/itm/277854759450",  # almirantebrown-retro-2024-away: WRONG_KIT -- bastones amarillos y negros = la local de Almirante Brown, ficha away
    "/itm/178207752073",  # austria-retro-2008-away: WRONG_TEAM -- titulo y escudo del club Austria Wien (naranja Nike), ficha es la seleccion de Austria
    "/itm/158120608057",  # austria-retro-1999-home: WRONG_TEAM -- titulo Austria Wien FAK, camiseta violeta del club; ficha es la seleccion de Austria
    "/itm/117211217527",  # braga-retro-202223-home: WRONG_KIT -- camiseta dorada/beige con laterales negros, la local del Braga es roja
    "/itm/318721803772",  # brasil-retro-201819-home: WRONG_KIT -- camiseta BLANCA de Brasil, la local es amarilla
    "/itm/206151395653",  # brescia-retro-200304-home: WRONG_KIT -- camiseta blanca con V azul = la away del Brescia, ficha home (azul)
    "/itm/128107599301",  # celtic-retro-202324-home: WRONG_KIT -- camiseta verde lisa con una franja blanca, no es la local a aros del Celtic
    "/itm/157870709796",  # coreadelsur-retro-200203-away: WRONG_KIT -- camisetas ROJAS de Corea 2002 = la local, la away era blanca
    "/itm/366574346949",  # cruzazul-retro-2024-home: AI_RENDER -- mock-up digital frente/espalda "ANY NAME 00" de camiseta custom 3D, no es foto real
    "/itm/375275915909",  # estadosunidos-retro-2022-away: NO_PRODUCT -- primer plano de la etiqueta interior Nike, no se ve la camiseta
    "/itm/188836375567",  # fiorentina-retro-199900-home: WRONG_KIT -- camiseta BLANCA Fila Toyota = la away de la Fiorentina, la local es violeta
    "/itm/318248081378",  # galatasaray-retro-1998-home: WRONG_KIT -- camiseta NEGRA con detalles naranja, la local del Galatasaray es rojo/amarilla
    "/itm/318740512438",  # gales-retro-2023-home: WRONG_TEAM -- titulo 'Wales Bonner Jamaica': camiseta amarilla de JAMAICA, no de Gales
    "/itm/406793240910",  # ghana-retro-202223-home: WRONG_TEAM -- titulo y escudo del club Bibiani Goldstars (Ghana), ficha es la seleccion de Ghana
    "/itm/355287627373",  # hullcity-retro-201617-away: NOT_JERSEY -- conjunto camiseta+short+medias, no camiseta sola
    "/itm/236729242418",  # independiente-retro-202223-home: WRONG_KIT -- camiseta blanca = alternativa de Independiente, ficha es home (roja)
    "/itm/158338014641",  # italia-retro-200203-away: WRONG_TEAM -- camiseta del AC Milan final Champions 2003 (Maldini, starball), no de Italia
    "/itm/387289457446",  # japon-retro-2024-home: WRONG_TEAM -- camiseta del Thespa Gunma (Kelme, CAINZ), no de la seleccion de Japon
    "/itm/287213127806",  # lagalaxy-retro-1997-third: NOT_JERSEY -- solo set de estampados (nombre/numero/sponsor Campos 9), no una camiseta
    "/itm/198379870337",  # leicester-retro-201415-away: WRONG_TEAM -- camiseta amarilla Fly Emirates del Arsenal, titulo dice Arsenal
    "/itm/224480514160",  # leicester-retro-201617-home: WRONG_KIT -- camiseta roja Puma = la visitante 2016/17, ficha es home (azul)
    "/itm/264951509343",  # liverpool-retro-1978-away: WRONG_KIT -- camiseta roja Hitachi = la local del Liverpool, ficha es away
    "/itm/800504662476",  # mancity-retro-201516-home: WRONG_KIT -- camiseta oscura con detalles turquesa = visitante 2015/16, ficha es home (celeste)
    "/itm/820131581920",  # norwich-retro-201516-home: WRONG_KIT -- camiseta verde con rayas amarillas = la alternativa, la local de Norwich es amarilla
    "/itm/318076866406",  # nuevazelanda-retro-202425-home: NOT_JERSEY -- camiseta de RUGBY de los All Blacks (adidas, Altrad)
    "/itm/147521503737",  # nuevazelanda-retro-202425-home: NOT_JERSEY -- camiseta de RUGBY de los All Blacks (adidas, Altrad)
    "/itm/326729037809",  # perugia-retro-202425-home: NOT_JERSEY -- camiseta de VOLEY del Sir Safety Perugia (Ishikawa 14), no de futbol
    "/itm/315651050074",  # prestonnorthend-retro-2021-home: WRONG_KIT -- camiseta amarilla (codigo -719), la local del Preston es blanca
    "/itm/128030852129",  # pumasunam-retro-2023-away: AI_RENDER -- mock-up digital de remera 3D personalizada, no foto real del producto
    "/itm/366623989137",  # leon-retro-202425-away: AI_RENDER -- mock-up digital de remera 3D personalizada (mismo vendedor Custom Name 3D), no foto real
    "/itm/178484239244",  # pumasunam-retro-2023-away: NO_PRODUCT -- imagen placeholder de foto rota, sin producto
    "/itm/377465756728",  # pumasunam-retro-202324-away: AI_RENDER -- mock-up digital con 'ANY NAME 00', no es foto del producto
    "/itm/174509700126",  # racingclub-retro-201314-away: WRONG_TEAM -- camiseta del RC Lens, ficha es Racing Club
    "/itm/277854759444",  # racingclub-retro-2023-home: WRONG_TEAM -- Racing de Cordoba (GEA, Bancor), ficha es Racing Club Avellaneda
    "/itm/266920231211",  # racingclub-retro-202122-third: WRONG_TEAM -- camiseta del RC Lens (Auchan), ficha es Racing Club
    "/itm/134922098478",  # rangers-retro-201819-away: WRONG_KIT -- camiseta azul = la local del Rangers, ficha es away
    "/itm/155883201701",  # sanjoseearthquakes-retro-2020-home: NOT_JERSEY -- gorra New Era snapback, no camiseta
    "/itm/168260072179",  # stlouiscity-retro-202425-home: WRONG_KIT -- camiseta blanca = la away 24/25 (identica a las fichas away), local es roja
    "/itm/257291460256",  # stlouiscity-retro-202425-home: WRONG_KIT -- camiseta blanca = la away 24/25 (identica a las fichas away), local es roja
    "/itm/188801578431",  # tottenham-retro-2023-away: WRONG_KIT -- camiseta gris/taupe = la third 23/24 (titulo dice 3rd kit), away 23/24 es azul marino
    "/itm/366118101783",  # venezia-retro-202223-away: WRONG_KIT -- celeste con mangas negras = la third 21/22 (igual a n=23/24), away 22/23 es blanca
    "/itm/398313735643",  # venezuela-retro-202425-away: WRONG_TEAM -- camiseta del club Academia Puerto Cabello (titulo), ficha es la seleccion de Venezuela
    "/itm/178393947318",  # watford-retro-202122-home: NO_PRODUCT -- captura de pantalla de celular (barra de estado, '1 of 5') con la camiseta diminuta
    "/itm/336596438723",  # austria-home-kids: NOT_JERSEY -- conjunto camiseta+short ('KIDS SET'), no camiseta sola
    "/itm/366246587112",  # leon-away-kids: NOT_JERSEY -- camiseta + gorra juntas (varios articulos), titulo 'Jersey & Hat'
    "/itm/178386866333",  # mancity-home-202627: WRONG_KIT -- camiseta gris con banda dorada, no es la local celeste del City
    "/itm/336814470584",  # marruecos-away-2026: KIDS_MISMATCH -- conjunto infantil camiseta+short (boy size 16 set), ficha adulto
    "/itm/336642383627",  # ghana-away-2026: WRONG_KIT -- camiseta blanca = la local de Ghana; la visitante es amarilla (fotos 5 y 7)
    "/itm/188881396027",  # clubtijuana-home-202526: AI_RENDER -- mock-up digital de personalizacion (Any Name 00), no foto real
    "4002759_list.jpg",  # intermilan-away-202627: NOT_JERSEY -- camisa de beisbol con botones (NSW Surf Baseball Shirt), no camiseta de futbol
    "nike-iu4543-330-gorge-green-6a033e2eeea1c-1.jpg&feedId=89044&k=d507ad8a82797f34a27177b5bbfda525bbf943ea",  # sudafrica-home-202627: NOT_JERSEY -- camiseta de RUGBY de los Springboks (cuello polo, emblema springbok)
    "nike-ib6784-331-gorge-green-6a2fb9fe99f5c-1.webp",  # sudafrica-home-202627: NOT_JERSEY -- camiseta de RUGBY de los Springboks (FNB, emblema springbok)
    "1045513_list.jpg",  # sudafrica-home-202627: NOT_JERSEY -- camiseta de RUGBY Springboks, el titulo lo dice (South Africa Springboks Home Replica)
    "/itm/407190629885",  # leeds-third-202627: NO_PRODUCT -- captura de pantalla de una pagina web con miniaturas
    "/itm/407222766778",  # chelsea-away-202627: WRONG_KIT -- camiseta azul = la local del Chelsea; la visitante 26/27 es negra (fotos 9,11,12)
    "adidas-km2005-actpnk-6a6926d56e90d-1.jpg&feedId=89032&k=93d9343325f8025e9bbc4b8cff08918f5019ad7f",  # lyon-away-202627: WRONG_TEAM -- titulo y foto son de OL Lyonnes (club femenino, escudo y sponsor Mastercard disti
    "adidas-km2005-actpnk-6a6926d56e90d-1.webp",  # lyon-away-202627: WRONG_TEAM -- titulo y foto son de OL Lyonnes (club femenino, escudo y sponsor Mastercard distintos), no del Olympique Lyonnais
    "/itm/189020334005",  # tottenham-away-202627: WRONG_KIT -- camiseta violeta a rayas verticales en bolsa = la tercera 26/27; la visitante es azul marino con lineas diagonales
    "camiseta-nike-sporting-portugal-tercera-equipacion-120-aniversario-2026-2027-green-1.jpg",  # portugal-third-202627: WRONG_TEAM -- es del Sporting CP (titulo Sporting Portugal 120 aniversario, sponsor Super Bock), f
    "259594_1.jpg",  # westham-training-202627: WRONG_TEAM -- camiseta del Everton (escudo Everton, sponsor CMC Markets), ficha es West Ham
    "/itm/267768897902",  # swansea-retro-2017-home: WRONG_KIT -- camiseta granate/azul marino = la visitante 17/18; la local del Swansea es blanca
    "/itm/377442404285",  # bolivia-retro-2024-away: WRONG_TEAM -- camiseta del club Always Ready, no de la seleccion de Bolivia
    "/itm/227474416890",  # botswana-retro-202122-third: WRONG_TEAM -- camiseta del club Township Rollers, no de la seleccion de Botswana
    "/itm/398196822285",  # brasil-retro-2002-home: NOT_JERSEY -- mini camiseta de coleccion en vitrina, no es una camiseta para usar
    "/itm/278062879781",  # clubtijuana-retro-202122-home: WRONG_KIT -- camiseta negra (titulo dice 3rd), la local de Tijuana es roja/negra a rayas
    "/itm/327138761932",  # georgia-retro-2023-third: WRONG_TEAM -- camiseta de Atlanta United (MLS), ficha es la seleccion de Georgia
    "/itm/267534994765",  # israel-retro-200001-home: WRONG_TEAM -- camiseta del club Maccabi Netanya, no de la seleccion de Israel
    "/itm/800597531482",  # jordania-retro-2022-home: WRONG_TEAM -- camiseta del club Al-Wehdat, no de la seleccion de Jordania
    "/itm/137421114557",  # myanmar-retro-2012-home: WRONG_TEAM -- camiseta del club Yangon United, no de la seleccion de Myanmar
    "/itm/405180569315",  # acmilan-retro-201718-home: WRONG_KIT -- camiseta negra (Lapadula 9), no la local rojinegra a rayas
    "/itm/196445461732",  # australia-retro-202425-home: NOT_JERSEY -- camiseta amarilla Asics de rugby (Wallabies), no la de futbol Nike de Australia
    "/itm/336587245711",  # belgica-retro-201213-away: WRONG_TEAM -- camiseta del club Standard Lieja (Joma), no de la seleccion de Belgica
    "/itm/336368157015",  # belgica-retro-201819-third: WRONG_TEAM -- camiseta del club Standard Lieja (New Balance), no de la seleccion de Belgica
    "/itm/389705785996",  # chelsea-retro-201920-home: WRONG_KIT -- camiseta gris/blanca de Chelsea, no la local azul
    "/itm/137699206992",  # chile-retro-2017-away: WRONG_TEAM -- camiseta del club Colo-Colo (Under Armour), no de la seleccion de Chile
    "/itm/137428715472",  # escocia-retro-2020-home: WRONG_TEAM -- camiseta del club Hibernian (verde, Macron), no de la seleccion de Escocia
    "/itm/800651673984",  # estadosunidos-retro-2015-home: WRONG_KIT -- camiseta azul degradada (suplente), la local de USA es blanca
    "/itm/226944134120",  # gales-retro-201618-away: WRONG_TEAM -- camiseta del Cardiff City (Malaysia), no de la seleccion de Gales
    "/itm/407034608865",  # japon-retro-202122-home: WRONG_TEAM -- camiseta del club Urawa Red Diamonds, no de la seleccion de Japon
    "/itm/325694289472",  # peru-retro-1999-away: WRONG_TEAM -- camiseta del club Alianza Lima, no de la seleccion de Peru
    "/itm/325694150251",  # peru-retro-2019-away: WRONG_TEAM -- camiseta de un club peruano (titulo Atletico Grau, sponsor Caja Huancayo), no de la seleccion
    "/itm/357674508652",  # peru-retro-2020-away: WRONG_TEAM -- camiseta del club Alianza Lima (negra Nike), no de la seleccion de Peru
    "/itm/357703680788",  # peru-retro-2021-away: WRONG_TEAM -- camiseta del club Sporting Cristal, no de la seleccion de Peru
    "/itm/178459163933",  # realmadrid-retro-1999-away: WRONG_KIT -- camiseta blanca Teka = la local del Madrid, ficha es visitante
    "/itm/188489128738",  # realsociedad-retro-2014-away: WRONG_KIT -- rayas azul/blanco = la local de la Real Sociedad, ficha es visitante
    "/itm/188836387017",  # saopaulo-retro-1992-away: WRONG_KIT -- camiseta blanca con franja tricolor = la local del Sao Paulo, ficha es visitante
    "/itm/800548014830",  # sunderland-retro-200102-home: WRONG_KIT -- camiseta azul/roja (la misma visitante de n=5), la local del Sunderland es a rayas rojiblancas
    "/itm/267430753823",  # turquia-retro-2021-away: WRONG_TEAM -- camiseta del club Kocaelispor, no de la seleccion de Turquia
    "/itm/193494698019",  # turquia-retro-201819-home: WRONG_TEAM -- camiseta del Galatasaray, no de la seleccion de Turquia
    "/itm/304174318670",  # turquia-retro-201920-home: WRONG_TEAM -- camiseta del club Goztepe (rayas rojo/amarillo), no de la seleccion de Turquia
    "/itm/206299265157",  # ucrania-retro-2012-away: WRONG_KIT -- camiseta amarilla = la local de Ucrania, ficha es visitante (azul)
    "/itm/356355371931",  # ucrania-retro-2024-home: WRONG_TEAM -- camiseta del club Nyva Ternopil, no de la seleccion de Ucrania
    "/itm/237007941212",  # china-retro-2014-home: WRONG_TEAM -- camiseta del club Shanghai Shenhua (azul), no de la seleccion de China
    "/itm/178500626771",  # mancity-retro-201920-home: WRONG_KIT -- camiseta gris plateada, no la local celeste del City
    "/itm/800686479002",  # colombia-retro-2016-home: WRONG_KIT -- camiseta blanca, la local de Colombia es amarilla
    # Barrido de fotos 2026-10-04 (todas las fotos del catálogo, verificadas a mano):
    "/itm/277526675543",  # caboverde-retro-1989-home: AI_RENDER -- Modelo estilo IA en calle colonial desenfocada, camiseta verde generica con texto Terra di Morabeza, sin marca ni diseno real del retro 1989
    "/itm/267752462352",  # tottenham-retro-1980-away: AI_RENDER -- Imagen de referencia: modelo IA en gimnasio con remera amarilla lisa y escudo pegado; no es la Score Draw 1980-82 away
    "/itm/407134873626",  # esp-home-2026: AI_RENDER -- Modelo IA en cancha desenfocada; camiseta roja/azul genérica sin logo adidas ni detalles reales de la España 2026
    "/itm/406991543200",  # ale-home-2026: AI_RENDER -- Modelo IA en cancha; prenda estilo Alemania 1990 sin marca, no es el diseño adidas 2026
    "/itm/406991584990",  # ing-home-2026: AI_RENDER -- Modelo IA en cancha; remera blanca lisa con escudo pegado, sin swoosh Nike ni diseño real de Inglaterra 2026
    "/itm/800355711650",  # noruega-home-2026: AI_RENDER -- mock-up digital de camiseta personalizada "YOUR NAME 9" (print-on-demand), no es la camiseta oficial
    "/itm/358338453846",  # guatemala-retro-1996-away: AI_RENDER -- render plano digital print-on-demand (polo azul con rayas diagonales, sin costuras/etiqueta/pliegues), no es foto de una camiseta física; diseño probabl
    "/itm/358497468718",  # guatemala-retro-1998-home: AI_RENDER -- render plano sublimado print-on-demand (polo blanco 'ABA sport' con ilustración gigante de león/figura maya), no es foto de camiseta física y el diseño 
    "/itm/358522332207",  # uruguay-retro-1992-home: AI_RENDER -- ilustracion/render plano vectorial sin costuras ni etiqueta, marca inventada; titulo tipo print-on-demand 'men gift', no es la camiseta real
    "/itm/358621979028",  # uruguay-retro-1994-home: AI_RENDER -- ilustracion/render plano vectorial sin costuras ni etiqueta, marca inventada; titulo tipo print-on-demand 'team apparel men gift', no es la camiseta real
    "/itm/406991618283",  # canada-home-2026: AI_RENDER -- modelo estilo IA en campo desenfocado (arcos de futbol americano), remera roja generica con escudo pegado, sin marca Nike ni diseno real del Canada 2026
    "/itm/405040181169",  # inglaterra-retro-2014-home: AI_RENDER -- remera blanca lisa con el escudo de Inglaterra pegado en el centro del pecho, sin Nike ni detalles del diseño 2014
    "/itm/128039439945",  # clubtijuana-retro-202425-home: AI_RENDER -- mock-up digital "Custom Name ... Shirt 3D" print-on-demand, render plano, no es la camiseta oficial
    "/itm/318591943530",  # pumasunam-away-202627: AI_RENDER -- mock-up digital 3D de "maglia personalizzata ... design" print-on-demand, no es foto de la camiseta fisica
    # --- Daily pass 2026-10-05, CSV feeds: three rugby shirts and one
    # volleyball shirt, all from Sport is Good ES/FR, all mined under a
    # NATIONAL-TEAM football key and only settled by the photo. Blocklisted
    # by MANUFACTURER STYLE CODE (stable across both mirror stores and both
    # languages), per the 2026-10-02 rule -- the store slug is not stable.
    "ib6784",            # sudafrica|home: Nike SPRINGBOKS rugby, crest reads "SOUTH AFRICA RUGBY", FNB sponsor
    "iu4543",            # sudafrica|home: Nike Springboks rugby polo, springbok crest, yellow collar
    "600155310001",      # gales|home: Macron WRU (Welsh Rugby Union), Vodafone sponsor, feathers crest
    "smkh6c0041100frv",  # francia|away: Errea FRANCE VOLLEYBALL (MAIF + Betclic, no FFF cockerel crest)

    # --- Daily pass 2026-10-05, eBay CURRENT drops (bare /itm/<id>, per 10-02) ---
    "/itm/287625719346",  # tigresuanl|training: all-over sublimated "NUEVO LEON TIGRES DE MEXICO" text TEE, no club crest, floor photo -- unlicensed repro, not a training jersey
    "/itm/117404434836",  # tigresuanl|away 26/27: adidas ORIGINALS trefoil and NO club crest (only a "U") -- the documented Originals-lifestyle class, not the match kit
    "/itm/237014499846",  # estudiantes|training 2026: grey COTTON ringer t-shirt with an EdeLP patch, no supplier logo, no sponsor -- lifestyle tee, same class as the 10-04 Mexico kids "Maglietta"
    "/itm/398156613262",  # santos|home 26/27: photo is the BLACK/WHITE STRIPED shirt while Santos' home on file is plain white -- type unverifiable, skip rather than guess
    "/itm/168752181571",  # chile|third: its own retail tag reads "ANFP A JSY AU" (AWAY) and the garment is identical to chile-away-2026 already on file -- wrong type, already in catalog
    "/itm/198642658222",  # mexico|third: a COLLAGE of 5 different Mexico kits in one listing, every one player-numbered -- template listing, type unresolvable

    # --- Daily pass 2026-10-05, eBay KIDS drops ---
    "/itm/236728990335",  # sanlorenzo|away kids: title says "ENNERRE - VOLLEY" -- a VOLLEYBALL shirt, not football
    "/itm/178288447157",  # lagalaxy|home kids: player-printed "Riqui Puig 26/27"
    "/itm/820000544938",  # vancouverwhitecaps|third kids: NOT A GARMENT -- a New Era 9TWENTY baseball CAP, confirmed by photo
    "/itm/128113157807",  # escocia|away kids: player-printed "Scott McTominay"
    "/itm/117318213863",  # estadosunidos|home kids: USWNT (women's team) + player print "Lindsey Horan #10", filed on the men's key
    "/itm/175793531677",  # estadosunidos|away kids: FOUR STARS over the USA crest = USWNT, not the men's team (photo); also the 2020 blue-camo kit
    "/itm/377483027161",  # japon|home kids: "Conjunto corto y camiseta" = shirt-and-shorts SET, plus a "Mitoma #7" print

    # --- Daily pass 2026-10-05, eBay RETRO drops (bare /itm/<id>, per 10-02) ---
    "/itm/116629601689",  # australia|away|2023/24: SHORTS, not a jersey
    "/itm/314816556407",  # australia|home|2019: Football TASMANIA (state body), not the Socceroos
    "/itm/317734654841",  # coreadelsur|away|2023/24: match-detail shirt, #7 printed, AFC Asian Cup semi-final detailing
    "/itm/117424535187",  # coreadelsur|away|2024/26: BACK-ONLY photo + "KANGIN 18" player print
    "/itm/116860840928",  # coreadelsur|home|2020/22: BACK-ONLY photo + "H M SON 7" player print
    "/itm/128044881413",  # cruzazul|third|2024/25: print-on-demand MOCKUP render showing "ANY NAME 00"
    "/itm/157963326835",  # escocia|away|1994/95: BACK-ONLY photo + "DONNELLY 7" player print
    "/itm/168379725681",  # escocia|home|1982: unlicensed repro -- no supplier mark anywhere, modern shiny polyester
    "/itm/168313966553",  # escocia|third|2011/12: CELTIC (club) under a national key, BACK-ONLY, "STOKES 10"
    "/itm/257417557240",  # escocia|third|2021/23: club shirt (SPFL number badges) under a national key, BACK-ONLY, "HENDERSON 22"
    "/itm/117238558571",  # flamengo|away|1996: BACK-ONLY photo + "ROMARIO 11" player print
    "/itm/157915615743",  # gales|home|2006/07: unlicensed repro -- no supplier mark, throwback styling
    "/itm/366623993739",  # leon|home|2024/25: AI/print-on-demand MOCKUP render, seller watermark
    "/itm/377511057850",  # mexico|away|2014/15: BACK-ONLY photo + "C. BLANCO 10" player print
    "/itm/377007080059",  # mexico|home|2017: maroon adidas TRAINING top, not the green home kit
    "/itm/157202019176",  # nigeria|home|2002/04: "KANU 4" player print, front and back
    "/itm/227321387334",  # nigeria|home|2023/24: neck tape reads SUPER FALCONS = the WOMEN national team, on the men key
    "/itm/178402529203",  # noruega|away|2022: Nike PRE-MATCH top (big swoosh graphic), not the away kit
    "/itm/406550893610",  # palmeiras|home|2019: it is a PARAGUAY shirt (APF crest, Copa America Brasil 2019) -- wrong team
    "/itm/257780314196",  # suecia|home|2007: SIGNED -- visible autograph on the chest, the title never said so
    "/itm/358864891571",  # turquia|home|2006/08: generic Nike "Turkiye" shirt with a flag patch and NO TFF crest
    "/itm/168453369244",  # ucrania|away|2021: KRYVBAS (club) under a national key, BACK-ONLY, "P'YATOV 5"
    "/itm/266920231197",  # ucrania|third|2021: SHAKHTAR (club) under a national key, BACK-ONLY, "MYKOLAIV 3"
    "/itm/188946250669",  # velez|home|1996/97: modern reproduction sold as retro at $28.98 (documented template line)
    "/itm/157915617695",  # ucrania|away|2004: match-worn ENGLAND vs UKRAINE shirt -- which team it is cannot be settled
    # chile|home|2015 was dropped, but NOT blocklisted: it is the SAME eBay item
    # as peru|home|2015 (only the _skw tracking param differs), and it landed
    # correctly on peru-retro-2015-home. Blocklisting it would have killed the
    # real Peru offer. Compare the bare /itm/<id>, not the full tracked URL.
    "/itm/366464301890",  # gremio|home|2020/21: player print "Everton Cebolinha 11"
    "/itm/406349343532",  # penarol|home|2015: player print "Federico Valverde"
    "/itm/405840040677",  # penarol|home|2014: player print "Federico Valverde"
    "/itm/405840527030",  # penarol|home|2022: player print "Pablo Bengoechea"
    "/itm/127988762754",  # ajax|away|2020/21: player print "Sergino Dest"
    "/itm/227379515811",  # ecuador|home|2022: player print "Enner Valencia"

    # --- Daily pass 2026-10-05, eBay GB retro (ebay_gb_retro.py) ---
    # The GB pass filters kids/women (KIDS_EXTRA_RE, 10-03) but has NO player-print,
    # no back-only and no not-a-garment check, so 19 of its 103 inserts tonight were
    # printed shirts or bare namesets. Found by a title scan after a 4-item photo
    # spot-check turned up a back-only "KAKA 22". Worth a real filter in that script.
    "/itm/800556538613",  # chelsea-retro-201011-away: Drogba 11 NAMESET heat transfer -- not a garment
    "/itm/394816053864",  # chelsea-retro-202223-home: kids "T Shirt ... 13-15yrs" -- kids tee, not the men shirt
    "/itm/358858900268",  # arsenal-retro-200405-away: player print "No 14 Henry On The Back"
    "/itm/167753269347",  # intermiami-retro-202324-home: player print "Messi 10"
    "/itm/158287204831",  # westham-retro-202425-away: player print "10#PAQUETA"
    "/itm/820131581920",  # norwich-retro-201516-home: player print "Naismith #7", match issue
    "/itm/377544186592",  # acmilan-retro-2007-away: BACK-ONLY photo + player print "KAKA 22" (confirmed by photo)
    "/itm/237102428885",  # gales-retro-2020-away: player print "gunter 2 on the back"
    "/itm/298342268448",  # juventus-retro-199596-home: player number print "#4"
    "/itm/405648425238",  # juventus-retro-2019-home: player print "RABIOT #25", player issue
    "/itm/157782272070",  # liverpool-retro-202324-third: player print "Alexander-Arnold #66"
    "/itm/168573089763",  # mancity-retro-2022-home: player print "Haaland 9"
    "/itm/235880049779",  # manutd-retro-200506-home: player print "Gabriel Heinze #4"
    "/itm/178364438400",  # psg-retro-2018-home: player print "Neymar JR 10"
    "/itm/800561637275",  # psg-retro-201920-third: Verratti 6 NAMESET heat press transfer -- not a garment
    "/itm/298611735731",  # roma-retro-199798-home: player print "Francesco Totti 10"
    "/itm/147202331914",  # roma-retro-201415-home: player print "Totti #10"
    "/itm/278210765932",  # tottenham-retro-2020-home: player print "KANE 10"
    "/itm/358103130098",  # egipto-retro-2018-home: player print "ELMOHAMADY 3"

    # --- Daily pass 2026-10-06: Sport is Good ES/FR, OTHER SPORTS on football
    # national-team keys. Found by scanning each pick's own feed `description`,
    # which states the sport outright ("la pasión del rugby sudafricano", "los
    # apasionados del balonmano") while the TITLE says only "Maillot Domicile
    # France 2025/26" and the collision scan sees nothing. The supplier is the
    # same tell 10-05 named: France football is NIKE, Italy football is ADIDAS,
    # South Africa football is ADIDAS -- so an adidas "France", a Macron
    # "Italie" and a Nike "Sudáfrica" are all a different sport's shirt.
    # 6 of these 9 picks were ALREADY LIVE on the real football fichas from
    # earlier nightly passes (fra-home-2026, fra-away-2026, ita-home-2026,
    # francia-training-202526) and were removed in this pass.
    # Blocklisted by manufacturer style code per the 10-02 rule -- the ES
    # mirror's deep link is an opaque `pclick.php?p=<id>`, so the code only
    # appears in its aw_image_url, which is exactly why is_manually_excluded()
    # takes the image URL alongside the link.
    "iu4616",        # Nike South Africa RUGBY (Springboks) LS home 26/27 -- mined as sudafrica|home
    "kg7514",        # adidas France HANDBALL away 26/27 -- mined as francia|away
    "jp4334",        # adidas France HANDBALL home 25/26 (ES listing) -- mined as francia|home
    "jp4335",        # adidas France HANDBALL home 25/26 (FR listing, same shirt) -- francia|home
    "jp4256",        # adidas France HANDBALL training 25/26 (both mirrors) -- francia|training
    "jy0843",        # adidas France RUGBY away 25/26 -- mined as francia|away
    "700092080001",  # Macron ITALY RUGBY home 25/26 -- mined as italia|home

    # 2026-10-06, PlanetFoot: the Spain 26/27 home+away sold as a "Lamine
    # Yamal 19" PLAYER PRINT, not the plain kit. 10-05 flagged exactly these
    # two and dropped them by hand; they came straight back, so per the
    # README's own rule a class that recurs gets a blocklist entry. One
    # substring covers both colourways and any future variant of it.
    "-lamine-yamal-19-",

    # 2026-10-06, segunda vuelta del mismo barrido: la pasada de MUJER tenia
    # la misma contaminacion y nadie la habia mirado. `francia-third-women` y
    # `francia-training-women` estaban hechas ENTERAS de camisetas de balonmano
    # femenino de Francia (sus dos unicas ofertas cada una), asi que las dos
    # fichas se borraron -- no son cartas vacias, son productos que no debian
    # existir, y el README dice explicitamente que en ese caso NO va alias.
    # KF1713 aparecio al re-correr el pick: con el balonmano fuera, el
    # siguiente candidato de `francia|home` era la camiseta de RUGBY autentica
    # de Francia. Es la razon por la que este filtro se mide dos veces -- sacar
    # un falso positivo puede destapar otro abajo.
    "kl2448",          # adidas Francia BALONMANO femenino third 26/27
    "jp4290",          # adidas Francia BALONMANO femenino entrenamiento 25/26
    "kf1713",          # adidas Francia RUGBY home autentica 25/26
    "smug6s00490frv",  # Macron Francia VOLEIBOL femenino visitante ("FRV" = France Volley)
    "smug6s06800frv",  # Macron Francia VOLEIBOL femenino local

    # --- Daily pass 2026-10-06, eBay US/IT/ES ---
    # CURRENT: equipos equivocados y prendas que no son la camiseta del kit.
    "/itm/407145733240",  # egipto|third: es el LIVERPOOL third con estampado "Mohamed Salah" (Salah es egipcio)
    "/itm/920002876538",  # qatar|away: adidas ORIGINALS (trefoil + "climacool"), prenda de calle, no el kit Nike de la QFA
    "/itm/800187841012",  # costamarfil|home: el titulo vende "Home / Away" en un solo anuncio y la foto es la BLANCA (away)
    "/itm/336494790316",  # celtic|away IT: el titulo dice "DIFETTO" -- prenda con falla, ademas temporada vieja
    "/itm/318851042431",  # intermiami|home IT: estampado de jugador "Lionel Messi #10"
    "/itm/407208681946",  # chivas|away IT: "personalizzata" -- camiseta ya personalizada con nombre/numero
    # RETRO: colisiones de nombre que solo vio el team_collision_scan, mas repros.
    # OJO -- las colisiones Qatar/PSG y Qatar/Argentina de esta noche NO van en
    # esta lista, por la misma razon que las dos de Irlanda del Norte de mas
    # arriba: los cuatro anuncios (PSG third /itm/127925627465, PSG prematch
    # /itm/117117031483, PSG juvenil /itm/389944753123 y Argentina 2023
    # /itm/126714555022) son camisetas LEGITIMAS de equipos que SI estan en el
    # catalogo, y dos de ellas ya estaban vivas en su ficha correcta
    # (`psg-home-kids` y `argentina-retro-2023-home`). Bloquear por id las
    # habria matado ahi tambien, y ademas refresh.py habria dejado de
    # refrescarles el precio para siempre.
    #
    # REGLA, de esta pasada: el id del anuncio solo va a la lista negra cuando
    # la prenda es mala en CUALQUIER clave -- estampado de jugador, no es una
    # prenda, reproduccion, foto que no muestra la camiseta, talle de nino en
    # ficha de adulto, otro deporte. Si el problema es solo que se minó bajo la
    # clave equivocada y el equipo de verdad existe en el catalogo, lo que se
    # excluye es la CLAVE (5o argumento de refresh.py), nunca el anuncio.
    # OJO -- dos anuncios de IRLANDA DEL NORTE minados tambien bajo `irlanda`
    # (/itm/318888620547 current y /itm/396561239768 retro 2020) NO van en esta
    # lista, aunque la colision de equipo sea real: los dos son camisetas
    # GENUINAS que el mismo barrido fileteo correctamente bajo
    # `irlandadelnorte`, que es un TeamKey que si existe en el catalogo. Esta
    # lista casa por URL y no sabe de claves, asi que bloquear el item por id
    # habria borrado tambien la oferta BUENA. Para una colision donde el equipo
    # de verdad SI esta en el catalogo, lo que corresponde es excluir la clave
    # equivocada (5o argumento de refresh.py), no el anuncio. Distinto del caso
    # LDU Quito/Kerala Blasters mas arriba, donde el club real no existe aca y
    # el anuncio no tiene ninguna ficha correcta a la que ir.
    "/itm/388913928460",  # iran|home|2022: es INGLATERRA con estampado Rashford ("World Cup Vs Iran")
    "/itm/178421219869",  # celtic|home|2024/25: "AliExpress ... Sublimata" -- repro sublimada sin licencia (mismo item en IT y ES)
    "/itm/397555334594",  # celtic|home|2006: estampado de jugador "Shunsuke Nakamura"
    # Seis camisetas del INTER DE MILAN minadas bajo `internacional` (Inter de
    # Porto Alegre), todas ademas con estampado "#9 Icardi". La colision de
    # nombre Internacional/Inter no estaba documentada todavia; va aca entera.
    "/itm/158307975077",  # internacional|home|2014/15 -> Inter de Milan #9 Icardi
    "/itm/158307956076",  # internacional|home|2015/16 -> Inter de Milan #9 Icardi
    "/itm/158310565096",  # internacional|home|2017/18 -> Inter de Milan #9 Icardi
    "/itm/158173904347",  # internacional|away|2018/19 -> Inter de Milan #9 Icardi
    "/itm/158158536075",  # internacional|away|2013/14 -> Inter de Milan #9 Icardi
    "/itm/158194960717",  # internacional|third|2015/16 -> Inter de Milan #9 Icardi

    # --- Daily pass 2026-10-06, eBay KIDS ---
    "/itm/297303150327",  # irlanda|home kids: Umbro con patrocinio EIRCOM (1996-2008) -- retro en la pasada actual,
                          # y las fichas de ninos llevan season "2026" fija, asi que entraria fechada mal
    "/itm/204247419112",  # chivas|home kids: roja lisa con "GUADALAJARA" al pecho -- la primera de Chivas es a RAYAS
                          # rojiblancas; esta es una alternativa, y de una temporada vieja
    "/itm/318032057089",  # clubamerica|home kids: "ALVARO FIDALGO NOME SET NUMERI" -- lleva nombre y numero estampados
    "/itm/236792022317",  # intermiami|away kids: la foto es ROSA, que es la PRIMERA de Inter Miami, no la suplente

    # --- Daily pass 2026-10-06, RETRO descartados (21 claves / 21 anuncios) ---
    "/itm/158233687935",  # camerun|away|2016/17: ANTALYASPOR (club turco) bajo clave de Camerun + estampado "#9 Eto'o"
    "/itm/158185197769",  # camerun|home|2015/16: ANTALYASPOR + estampado "#9 Eto'o"
    "/itm/158240131475",  # camerun|home|2016/17: ANTALYASPOR + estampado "#9 Eto'o"
    "/itm/156483440373",  # camerun|home|2020/21: "Forces Armees Et Police" -- equipo militar/policial, no la seleccion
    "/itm/257395446445",  # egipto|away|2020/21: AL AHLY (club) bajo clave de seleccion; el club no existe como TeamKey
    "/itm/278360551610",  # egipto|home|2021/22: AL AHLY (club) bajo clave de seleccion
    "/itm/315860674909",  # guinea|home|2015/16: estampado de jugador "HEITA #15"
    "/itm/304090566471",  # hibernian|away|2019/20: estampado de jugador "Christian Doidge"
    "/itm/185870160992",  # iran|home|2016/17: MALAVAN (club irani) bajo clave de seleccion
    "/itm/188889958159",  # lagalaxy|away|2007: estampado de jugador "Beckham #23"
    "/itm/404777153620",  # orlandocity|home|2018: estampado de jugador "Yoshimar Yotun"
    "/itm/407269014547",  # palmeiras|third|2017: el titulo dice "Replica (Nueva)" -- reproduccion moderna vendida como retro
    "/itm/236723044880",  # portlandtimbers|away|2023/24: "giovane" = talle juvenil
    "/itm/387169359979",  # porto|home|2019/20: "Giovanile (Bambini)" = ninos; el filtro de texto tenia "bambino" pero no "bambini"
    "/itm/168511233943",  # rangers|away|1989: es QPR (QUEENS PARK RANGERS), no el Rangers de Glasgow
    "/itm/226822301314",  # rangers|away|2013: es QPR otra vez, ademas con "#42"
    "/itm/396647995674",  # rangers|away|1990: "SCORE DRAW" -- marca de reproducciones retro con licencia, no la prenda de epoca
    "/itm/267778035809",  # charlton|away|2003/05: la foto es la camiseta ROJA con escudo del Charlton = su PRIMERA, no la suplente
    "/itm/335710717959",  # hibernian|away|2020/21: la unica foto es la BOLSA Macron precintada: la prenda no se ve nunca
    "/itm/168304250079",  # qatar|away|2022/23: la unica foto es una bolsa precintada con una etiqueta de papel: la prenda no se ve
    "/itm/257770547452",  # rangers|away|2011/12: foto SOLO DE ESPALDA, estampado "BUTCHER 6", y ademas AZUL (color de la primera)

    # --- Daily pass 2026-10-06, eBay GB retro: 20 de 106 con estampado de
    # jugador o talle de nino. El filtro nuevo (has_player_print /
    # GB_SINGLE_AGE_RE en ebay_gb_retro.py) habria refusado 18 de estos 20
    # en origen; van igual a la lista negra porque el state file guarda los
    # picks ya encontrados y apply() los re-chequea contra esta lista.
    "/itm/236619315959",  # alhilal-retro-201415-away: AL Hilal Long Sleeve Away Football Shirt 2014-2015 (M) #77 Samaras Jer
    "/itm/178538467108",  # argentina-retro-200607-home: Argentina Football Shirt 2006/2007/2008 Messi 19 Reissue Home Mens 3XL
    "/itm/189038811132",  # portugal-retro-2016-away: 🚨 LAST ONE | Portugal Nike Away 2016 T-shirt | Ronaldo #7 ⭐️ | Small ✅
    "/itm/800436393055",  # tottenham-retro-1991-home: Tottenham Hotspur 1991 Home Shirt Sheringham #10 Umbro NWT XL
    "/itm/257516483694",  # inglaterra-retro-2004-away: Original England Away Football Shirt Jersey 2004 Beckham 7 Adults XL W
    "/itm/377387363219",  # manutd-retro-200910-home: Manchester United Rooney #10 Football Shirt Home Kit 2009/10 Size Medi
    "/itm/366333243086",  # chelsea-retro-2011-away: Chelsea Football Club 2011 2012 Away Shirt Fernando Torres 9  Adidas S
    "/itm/137796825754",  # chelsea-retro-2021-away: Chelsea Away 2021 Football Shirt - UK Size 13 Years (XL) - RRP £64.99.
    "/itm/376374696965",  # juventus-retro-2024-home: JUVENTUS 2024 2025 HOME FOOTBALL SHIRT #4 GATTI ADIDAS JERSEY SIZE M
    "/itm/137722361574",  # arsenal-retro-2006-away: Nike Arsenal 2006 away Shirt Vieira 4 Burgundy Adult Size M Long Sleev
    "/itm/366695241279",  # arsenal-retro-201112-away: Arsenal 2011/12 Away Jersey Mikel Arteta #8 125th Anniversary Edition 
    "/itm/278072039106",  # arsenal-retro-2024-away: NWT 2024 2025 Arsenal Adidas away football shirt SAKA 7 mens Large
    "/itm/157996671853",  # chelsea-retro-201314-away: BNWT CHELSEA 2013/2014 AWAY  SHIRT - Adidas - Men’s Small #10 MATA
    "/itm/398041385825",  # manutd-retro-201718-third: Manchester United 2017/18 Third Shirt Dewitt 10 XL New Tags Defects
    "/itm/157270917443",  # realmadrid-retro-200405-away: RONALDO 9 Real Madrid Shirt  XL - 2004/2005 - Adidas Away Jersey authe
    "/itm/117416415041",  # villarreal-retro-201011-home: 2010-11 Villarreal Home Shirt Cazorla #8
    "/itm/398431466587",  # juventus-retro-200304-away: BNWT Juventus 2003/04 Away Shirt Del Piero 10 (L)
    "/itm/287257495598",  # atleticomadrid-retro-201415-home: BNWT Nike Atlético Madrid Griezmann 7 2014/15 home Football Shirt Play
    "/itm/206604950998",  # acmilan-retro-199798-home: AC Milan Maldini Home 1997-98 Retro Football Shirt Jersey Lotto 23\" P
    "/itm/178325023362",  # mexico-retro-201516-away: Adidas Mexico Away Shirt 2015/16 #14 Chicharito Football Shirt

    # --- Daily pass 2026-10-08, eBay current ---
    "/itm/117141099094",  # ES current intermiami|third: player print Messi #10
    "/itm/117396430018",  # ES current clubamerica|away: personalizada, sin marca
    "/itm/237062477342",  # ES current chivas|home: personalizada (custom print)
    "/itm/318591989998",  # ES current tigresuanl|home: personalizada (custom print)
    "/itm/377495100441",  # ES current cruzazul|third: personalizada (custom print)
    "/itm/398247787068",  # US current rdcongo|away: player print Bakambu #17
    "/itm/137584565454",  # US current alnassr|home: player print Ronaldo #7
    "/itm/267706776222",  # US current alnassr|third: player print RONALDO 7
    "/itm/198412970396",  # US current panama|third: Reebok-labelled Panama fake (Panama is New Balance)
    "/itm/307106252268",  # IT current tigresuanl|home: personalizzata (custom print)
    "/itm/188850339320",  # IT current argelia|home: Messi #10 Argentina shirt filed under Algeria: wrong team + player print
    "/itm/117349522401",  # IT current egipto|home: player print Salah #10
    "/itm/206398318491",  # IT current cruzazul|away: kids size + #8 MIRAYA print
    "/itm/227517990518",  # IT current atleticomineiro|training: training VEST (gilet), not a jersey
    "/itm/136551009470",  # IT current fluminense|home: player print J. Arias
    "/itm/137752536630",  # ES current clubamerica|third: template/unverified brown "Aguilas" shirt labelled America third 26-27
    "/itm/307106243401",  # ES current tigresuanl|away: custom navy/gold home-style shirt titled away
    "/itm/206361070829",  # US current rdcongo|home: player print WISSA #20 + multi-kit template
    "/itm/336774961905",  # US current alnassr|away: player print Ronaldo 7 custom
    "/itm/198389718288",  # US current panama|home: Reebok-labelled Panama fake
    "/itm/198412966890",  # US current panama|away: Reebok-labelled Panama fake
    # --- Daily pass 2026-10-08, eBay kids ---
    "/itm/204224450943",  # ES kids: "GUADALAJARA" training-style shirt, not the home kit
    "/itm/366477551838",  # US kids: Nike 2021/22-era Galatasaray (club is Puma now), old stock
    "/itm/178282680919",  # ES kids: Messi #10 player print
    "/itm/206288404317",  # US kids: Ronaldo 7 print, jersey set
    # --- Daily pass 2026-10-08, eBay retro ---
    "/itm/257760371772",  # retro rangers|away|2011/12: back-only photo + BUTCHER 6 print
    "/itm/167402066892",  # retro rangers|away|2017: Queens Park Rangers (QPR) under rangers
    "/itm/158310281713",  # retro austria|away|2010: Wacker Innsbruck (club) under austria
    "/itm/387467508552",  # retro cruzazul|home|2019/20: kids (giovanile/bambini)
    "/itm/387464954679",  # retro cruzazul|away|2020/21: kids (giovanile/bambini)
    "/itm/176892033970",  # retro leon|away|2023/24: back-only photo with GUARDADO 17 print
    # --- Daily pass 2026-10-08, eBay GB ---
    "/itm/318567698306",  # GB retro: "Score Draw" reproduction sold as RETRO rangers|away|1990
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
