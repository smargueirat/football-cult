# Clubes/selecciones encontrados en un barrido completo del catalogo
# publico de Mystery Shirt Club (2026-08-10, ~3600 productos) que no
# tenian ningun TeamKey -- sus publicaciones eran invisibles para todo
# el pipeline, no "sacadas" (ver README.md). Formato igual a los demas
# archivos new_teams_batch*.py: (es, en, pt, colorHex, colorHexSecondary, regex).
BATCH8 = {
    # Inglaterra / Escocia
    "leicester": ("Leicester City", "Leicester City", "Leicester City", "#003090", "#FDBE11", r"leicester city|\bleicester\b"),
    "watford": ("Watford", "Watford", "Watford", "#FBEE23", "#000000", r"\bwatford\b"),
    "southampton": ("Southampton", "Southampton", "Southampton", "#D71920", "#FFFFFF", r"\bsouthampton\b"),
    "norwich": ("Norwich City", "Norwich City", "Norwich City", "#FFF200", "#00A650", r"norwich city|\bnorwich\b"),
    "blackburn": ("Blackburn Rovers", "Blackburn Rovers", "Blackburn Rovers", "#009EE0", "#FFFFFF", r"blackburn rovers|\bblackburn\b"),
    "millwall": ("Millwall", "Millwall", "Millwall", "#001C58", "#FFFFFF", r"\bmillwall\b"),
    "reading": ("Reading", "Reading", "Reading", "#004494", "#FFFFFF", r"\breading\b"),
    "swansea": ("Swansea City", "Swansea City", "Swansea City", "#FFFFFF", "#000000", r"swansea city|\bswansea\b"),
    "westbrom": ("West Bromwich Albion", "West Bromwich Albion", "West Bromwich Albion", "#122F67", "#FFFFFF", r"west bromwich albion|\bwest brom\b|\bwba\b"),
    "huddersfield": ("Huddersfield Town", "Huddersfield Town", "Huddersfield Town", "#0E63AD", "#FFFFFF", r"huddersfield town|\bhuddersfield\b"),
    "mkdons": ("MK Dons", "MK Dons", "MK Dons", "#FFFFFF", "#000000", r"\bmk dons\b"),
    "birminghamcity": ("Birmingham City", "Birmingham City", "Birmingham City", "#0053A0", "#FFFFFF", r"birmingham city"),
    "prestonnorthend": ("Preston North End", "Preston North End", "Preston North End", "#FFFFFF", "#002453", r"preston north end|\bpreston\b"),
    "peterboroughunited": ("Peterborough United", "Peterborough United", "Peterborough United", "#1D3F8F", "#FFFFFF", r"peterborough united"),
    "rotherhamunited": ("Rotherham United", "Rotherham United", "Rotherham United", "#DD0031", "#FFFFFF", r"rotherham united"),
    "hartlepool": ("Hartlepool United", "Hartlepool United", "Hartlepool United", "#1C398E", "#FFFFFF", r"\bhartlepool\b"),
    "cheltenhamtown": ("Cheltenham Town", "Cheltenham Town", "Cheltenham Town", "#DA020E", "#FFFFFF", r"cheltenham town"),
    "wycombe": ("Wycombe Wanderers", "Wycombe Wanderers", "Wycombe Wanderers", "#87CEEB", "#000000", r"wycombe wanderers|\bwycombe\b"),
    "airdrie": ("Airdrieonians", "Airdrieonians", "Airdrieonians", "#FFFFFF", "#ED1C24", r"\bairdrie\b|airdrieonians"),
    # Belgica / Paises Bajos
    "anderlecht": ("Anderlecht", "Anderlecht", "Anderlecht", "#5B2A86", "#FFFFFF", r"\banderlecht\b"),
    "clubbrugge": ("Club Brugge", "Club Brugge", "Club Brugge", "#000080", "#000000", r"club brugge"),
    "beerschot": ("Beerschot", "Beerschot", "Beerschot", "#8B0000", "#722F37", r"\bbeerschot\b"),
    "adodenhaag": ("ADO Den Haag", "ADO Den Haag", "ADO Den Haag", "#FFF200", "#00843D", r"ado den haag"),
    "heerenveen": ("SC Heerenveen", "SC Heerenveen", "SC Heerenveen", "#0033A0", "#FFFFFF", r"\bheerenveen\b"),
    # Alemania
    "fcmagdeburg": ("1. FC Magdeburg", "1. FC Magdeburg", "1. FC Magdeburg", "#008751", "#FFFFFF", r"fc magdeburg"),
    "hannover96": ("Hannover 96", "Hannover 96", "Hannover 96", "#78BE20", "#000000", r"hannover 96"),
    "hertaberlin": ("Hertha Berlin", "Hertha Berlin", "Hertha Berlin", "#005CA9", "#FFFFFF", r"hertha berlin|hertha bsc"),
    "holsteinkiel": ("Holstein Kiel", "Holstein Kiel", "Holstein Kiel", "#004B87", "#FFFFFF", r"holstein kiel|holsten kiel"),
    "fcingolstadt": ("FC Ingolstadt", "FC Ingolstadt", "FC Ingolstadt", "#E2001A", "#FFFFFF", r"fc ingolstadt"),
    "vflbochum": ("VfL Bochum", "VfL Bochum", "VfL Bochum", "#0059A3", "#FFFFFF", r"vfl bochum"),
    "vfraalen": ("VfR Aalen", "VfR Aalen", "VfR Aalen", "#003DA5", "#FFFFFF", r"vfr aalen"),
    "ssvjahnregensburg": ("SSV Jahn Regensburg", "SSV Jahn Regensburg", "SSV Jahn Regensburg", "#004B87", "#FFFFFF", r"ssv jahn regensburg|jahn regensburg"),
    # Italia
    "palermo": ("Palermo", "Palermo", "Palermo", "#FFC0CB", "#000000", r"\bpalermo\b"),
    "perugia": ("Perugia", "Perugia", "Perugia", "#DA020E", "#FFFFFF", r"\bperugia\b"),
    "bari": ("Bari", "Bari", "Bari", "#FFFFFF", "#DA020E", r"\bbari\b"),
    "reggina": ("Reggina", "Reggina", "Reggina", "#722F37", "#002F6C", r"\breggina\b"),
    # Turquia
    "adanaspor": ("Adanaspor", "Adanaspor", "Adanaspor", "#F58220", "#002D62", r"\badanaspor\b"),
    "bursaspor": ("Bursaspor", "Bursaspor", "Bursaspor", "#00843D", "#FFFFFF", r"\bbursaspor\b"),
    "samsunspor": ("Samsunspor", "Samsunspor", "Samsunspor", "#DA020E", "#FFFFFF", r"\bsamsunspor\b"),
    # Otros paises europeos
    "dinamozagreb": ("Dinamo Zagreb", "Dinamo Zagreb", "Dinamo Zagreb", "#0033A0", "#FFFFFF", r"dinamo zagreb"),
    "spartaprague": ("Sparta Praga", "Sparta Prague", "Sparta Praga", "#7A0019", "#000000", r"sparta prague|sparta praga"),
    "rubinkazan": ("Rubin Kazan", "Rubin Kazan", "Rubin Kazan", "#00843D", "#FFFFFF", r"rubin kazan"),
    "laspalmas": ("Las Palmas", "Las Palmas", "Las Palmas", "#FFF200", "#003DA5", r"\blas palmas\b"),
    "numancia": ("Numancia", "Numancia", "Numancia", "#DA020E", "#FFFFFF", r"\bnumancia\b"),
    "tenerife": ("Tenerife", "Tenerife", "Tenerife", "#004C97", "#FFFFFF", r"\btenerife\b"),
    # Ucrania / Arabia Saudita / Sudafrica / Ghana -- clubes que ya
    # colisionaban con selecciones (documentado en README) y ahora
    # tienen su propio TeamKey en vez de quedar mal clasificados.
    "shakhtar": ("Shakhtar Donetsk", "Shakhtar Donetsk", "Shakhtar Donetsk", "#F57F17", "#000000", r"shakhtar donetsk"),
    "alhilal": ("Al Hilal", "Al Hilal", "Al Hilal", "#0072BC", "#FFFFFF", r"\bal hilal\b"),
    "kaizerchiefs": ("Kaizer Chiefs", "Kaizer Chiefs", "Kaizer Chiefs", "#FFB81C", "#000000", r"kaizer chiefs"),
    "heartsofoak": ("Accra Hearts of Oak", "Accra Hearts of Oak", "Accra Hearts of Oak", "#DA020E", "#FFD700", r"hearts of oak"),
    # Japon (J-League)
    "kashimaantlers": ("Kashima Antlers", "Kashima Antlers", "Kashima Antlers", "#C00000", "#000000", r"kashima antlers"),
    "urawareds": ("Urawa Red Diamonds", "Urawa Red Diamonds", "Urawa Red Diamonds", "#E4002B", "#000000", r"urawa red diamonds"),
    "yokohamafmarinos": ("Yokohama F. Marinos", "Yokohama F. Marinos", "Yokohama F. Marinos", "#003DA5", "#FFFFFF", r"yokohama f\.?\s?marinos"),
    "jefunited": ("JEF United", "JEF United", "JEF United", "#FFF200", "#003DA5", r"jef united"),
    "jubiloiwata": ("Júbilo Iwata", "Jubilo Iwata", "Júbilo Iwata", "#00A0DE", "#000000", r"j[uú]bilo iwata"),
    "kawasakifrontale": ("Kawasaki Frontale", "Kawasaki Frontale", "Kawasaki Frontale", "#00A0DE", "#FFFFFF", r"kawasak[ie] frontale"),
    "omiyaardija": ("Omiya Ardija", "Omiya Ardija", "Omiya Ardija", "#F39800", "#000000", r"omiya ardija"),
    "cerezoosaka": ("Cerezo Osaka", "Cerezo Osaka", "Cerezo Osaka", "#EA5297", "#000000", r"cerezo osaka"),
    "shimizuspulse": ("Shimizu S-Pulse", "Shimizu S-Pulse", "Shimizu S-Pulse", "#F39800", "#000000", r"shimi[sz]u s-?pulse"),
    "zweigenkanazawa": ("Zweigen Kanazawa", "Zweigen Kanazawa", "Zweigen Kanazawa", "#F39800", "#000080", r"zweigen kanazawa"),
    "thespagunma": ("Thespakusatsu Gunma", "Thespakusatsu Gunma", "Thespakusatsu Gunma", "#F39800", "#722F37", r"thespakusatsu gunma"),
    "grullamorioka": ("Grulla Morioka", "Grulla Morioka", "Grulla Morioka", "#8B0000", "#FFFFFF", r"grulla morioka"),
    # Mexico / Brasil / Chile
    "clubtijuana": ("Club Tijuana", "Club Tijuana", "Club Tijuana", "#DA020E", "#000000", r"club tijuana"),
    "doradossinaloa": ("Dorados de Sinaloa", "Dorados de Sinaloa", "Dorados de Sinaloa", "#F58220", "#000000", r"dorados de sinaloa"),
    "leonesnegros": ("Leones Negros UDG", "Leones Negros UDG", "Leones Negros UDG", "#000000", "#D4AF37", r"leones negros"),
    "tampicomadero": ("Tampico Madero", "Tampico Madero", "Tampico Madero", "#800000", "#FFFFFF", r"tampico madero"),
    "athleticoparanaense": ("Athletico Paranaense", "Athletico Paranaense", "Athletico Paranaense", "#DA020E", "#000000", r"athletico paranaense|athl[eé]tico paranaense"),
    "santiagowanderers": ("Santiago Wanderers", "Santiago Wanderers", "Santiago Wanderers", "#00843D", "#FFFFFF", r"santiago wanderers"),
    # USA / Canada (USL / lower division)
    "forwardmadison": ("Forward Madison", "Forward Madison", "Forward Madison", "#5C068C", "#FFD700", r"forward madison"),
    "oaklandroots": ("Oakland Roots", "Oakland Roots", "Oakland Roots", "#F58220", "#000000", r"oakland roots|oakland soul"),
    "lasvegaslights": ("Las Vegas Lights", "Las Vegas Lights", "Las Vegas Lights", "#F58220", "#002D62", r"las vegas lights"),
    "elpasolocomotive": ("El Paso Locomotive", "El Paso Locomotive", "El Paso Locomotive", "#00843D", "#000000", r"el paso locomotive"),
    "greenvilletriumph": ("Greenville Triumph", "Greenville Triumph", "Greenville Triumph", "#002D62", "#FFD700", r"greenville triumph"),
    "sportingkc": ("Sporting Kansas City", "Sporting Kansas City", "Sporting Kansas City", "#6CACE4", "#000000", r"sporting kansas city"),
    "unionomaha": ("Union Omaha", "Union Omaha", "Union Omaha", "#002147", "#FFD700", r"union omaha"),
    "valourfc": ("Valour FC", "Valour FC", "Valour FC", "#00285E", "#FFFFFF", r"valour fc"),
    # Selecciones nacionales chicas que faltaban
    "botswana": ("Botsuana", "Botswana", "Botsuana", "#75AADB", "#000000", r"\bbotswana\b"),
    "cuba": ("Cuba", "Cuba", "Cuba", "#002A8F", "#CF142B", r"\bcuba\b"),
    "cambodia": ("Camboya", "Cambodia", "Camboja", "#032EA1", "#E00025", r"\bcambodia\b"),
    "gambia": ("Gambia", "Gambia", "Gâmbia", "#CE1126", "#0C1C8C", r"\bgambia\b"),
    "guadeloupe": ("Guadalupe", "Guadeloupe", "Guadalupe", "#FCD116", "#000000", r"\bguadeloupe\b"),
    "latvia": ("Letonia", "Latvia", "Letônia", "#9E3039", "#FFFFFF", r"\blatvia\b"),
    "luxembourg": ("Luxemburgo", "Luxembourg", "Luxemburgo", "#00A1DE", "#ED2939", r"\bluxembourg\b"),
    "malta": ("Malta", "Malta", "Malta", "#CF142B", "#FFFFFF", r"\bmalta\b"),
    "montserrat": ("Montserrat", "Montserrat", "Montserrat", "#008000", "#FFFFFF", r"\bmontserrat\b"),
    "myanmar": ("Myanmar", "Myanmar", "Myanmar", "#FECB00", "#34B233", r"\bmyanmar\b"),
    # Clubes indios documentados en README como colisión recurrente con
    # "india" (selección) -- reciben su propio TeamKey en vez de quedar
    # mal atribuidos o descartados a mano cada vez.
    "keralablasters": ("Kerala Blasters", "Kerala Blasters", "Kerala Blasters", "#FDB913", "#000080", r"kerala blasters"),
    "northeastunited": ("NorthEast United", "NorthEast United", "NorthEast United", "#8B0000", "#FFD700", r"north\s?east united"),
}
