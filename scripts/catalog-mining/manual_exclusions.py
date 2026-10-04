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
