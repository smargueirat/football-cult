import csv, re, sys, json
from collections import defaultdict

TEAM_PATTERNS = {
    "argentina": r"argentina|\bargentine\b",
    "brasil": r"\bbrasil\b|\bbrazil\b|\bbr[ée]sil\b",
    "espana": r"\bespaña\b|\bespana\b|\bespanha\b|\bspain\b|\bespagne\b",
    "francia": r"\bfrancia\b|\bfrance\b|\bfrança\b",
    "alemania": r"\balemania\b|\bgermany\b|\ballemagne\b|\balemanha\b|\bdeutschland\b",
    "italia": r"\bitalia\b|\bitaly\b|\bitalie\b|\bit[aá]lia\b",
    "inglaterra": r"\binglaterra\b|\bengland\b|\bangleterre\b",
    "portugal": r"\bportugal\b",
    "uruguay": r"\buruguay\b",
    "colombia": r"\bcolombia\b|\bcolômbia\b|\bcolombie\b",
    "paisesbajos": r"países bajos|paises bajos|países baixos|paises baixos|\bnetherlands\b|\bholanda\b|\bholland\b|pays-bas",
    "croacia": r"\bcroacia\b|\bcroatia\b|\bcroatie\b|\bcro[aá]cia\b",
    "realmadrid": r"real madrid",
    "boca": r"boca juniors|\bboca\b",
    "manutd": r"manchester united|man utd|man\. utd",
    "barcelona": r"\bbarcelona\b|\bbarça\b|\bbarca\b|\bfc barcelona\b|\bbarcelone\b",
    "liverpool": r"\bliverpool\b",
    "bayern": r"bayern",
    "psg": r"\bpsg\b|paris saint-germain|paris saint germain",
    "juventus": r"juventus",
    "riverplate": r"river plate",
    "chelsea": r"\bchelsea\b",
    "independiente": r"independiente",
    "como": r"como 1907|como f\.?c\.?\s*1907|\bcomofootball\b",
    "arsenal": r"\barsenal\b",
    "astonvilla": r"aston villa",
    "bournemouth": r"\bbournemouth\b",
    "brentford": r"\bbrentford\b",
    "brighton": r"\bbrighton\b",
    "crystalpalace": r"crystal palace",
    "everton": r"\beverton\b",
    "fulham": r"\bfulham\b",
    "leeds": r"leeds united",
    "mancity": r"manchester city",
    "newcastle": r"newcastle",
    "nottinghamforest": r"nottingham forest",
    "sunderland": r"\bsunderland\b",
    "tottenham": r"tottenham",
    "westham": r"west ham",
    "wolves": r"wolverhampton|\bwolves\b",
    "atleticomadrid": r"atl[eé]tico de madrid|atl[eé]tico madrid|\bcholo\b",
    "athleticbilbao": r"athletic (club|bilbao)",
    "realsociedad": r"real sociedad",
    "realbetis": r"real betis|betis balompi[eé]",
    "villarreal": r"\bvillarreal\b",
    "valencia": r"valencia cf|valencia c\.f|valence cf|valence c\.f",
    "sevilla": r"\bsevilla\b",
    "celtavigo": r"celta de vigo|celta vigo",
    "girona": r"\bgirona\b",
    "osasuna": r"\bosasuna\b",
    "rayovallecano": r"rayo vallecano",
    "getafe": r"\bgetafe\b",
    "mallorca": r"\bmallorca\b",
    "alaves": r"alav[eé]s",
    "espanyol": r"\bespanyol\b",
    "levante": r"\blevante\b",
    "elche": r"\belche\b",
    "realoviedo": r"real oviedo",
    "intermilan": r"\binter (de )?mil[aá]n\b|internazionale",
    "acmilan": r"\b(ac )?milan\b",
    "napoli": r"\bnapoli\b",
    "roma": r"\bas roma\b",
    "lazio": r"\blazio\b",
    "atalanta": r"\batalanta\b",
    "fiorentina": r"\bfiorentina\b",
    "bologna": r"\bbologna\b|\bbologne\b",
    "torino": r"\btorino\b",
    "udinese": r"\budinese\b",
    "dortmund": r"borussia dortmund|\bbvb\b",
    "rbleipzig": r"rb leipzig",
    "leverkusen": r"bayer leverkusen",
    "frankfurt": r"eintracht frankfurt",
    "gladbach": r"m[oö]nchengladbach",
    "stuttgart": r"vfb stuttgart",
    "wolfsburg": r"wolfsburg",
    "marseille": r"marseille|\bom\b",
    "monaco": r"\bmonaco\b",
    "lyon": r"\blyon\b|olympique lyonnais",
    "lille": r"\blille\b",
    "nice": r"\bnice\b",
    "rennes": r"\brennes\b|\brennais\b",
    "werderbremen": r"werder (de )?bremen",
    "freiburg": r"\bfreiburg\b",
    "unionberlin": r"union berlin",
    "mainz": r"\bmainz\b",
    "augsburg": r"\baugsburg\b",
    "hoffenheim": r"\bhoffenheim\b",
    "koln": r"\bk[oö]ln\b|fc cologne",
    "hamburg": r"hamburger sv|\bhsv\b",
    "lens": r"\blens\b",
    "strasbourg": r"strasbourg",
    "toulouse": r"\btoulouse\b",
    "nantes": r"\bnantes\b",
    "brest": r"\bbrest\b",
    "reims": r"\breims\b",
    "belgica": r"\bb[eé]lgica\b|\bbelgium\b|\bbelgique\b",
    "dinamarca": r"\bdinamarca\b|\bdenmark\b|\bdanemark\b",
    "suiza": r"\bsuiza\b|\bswitzerland\b|\bsuisse\b|\bsu[ií]ça\b",
    "polonia": r"\bpolonia\b|\bpoland\b|\bpologne\b|\bpol[oô]nia\b",
    "gales": r"\bgales\b|\bwales\b|\bpays de galles\b",
    "escocia": r"\bescocia\b|\bscotland\b|\b[eé]cosse\b|\besc[oó]cia\b",
    "suecia": r"\bsuecia\b|\bsweden\b|\bsu[eè]de\b|\bsu[eé]cia\b",
    "noruega": r"\bnoruega\b|\bnorway\b|\bnorv[eè]ge\b",
    "turquia": r"\bturqu[ií]a\b|\bturkey\b|\bturquie\b",
    "ecuador": r"\becuador\b|\b[eé]quateur\b",
    "chile": r"\bchile\b|\bchili\b",
    "peru": r"\bper[uú]\b|\bp[ée]rou\b",
    "mexico": r"\bm[eé]xico\b|\bmexico\b|\bmexique\b",
    "estadosunidos": r"\bestados unidos\b|\busa\b|\bunited states\b|\b[eé]tats-unis\b",
    "japon": r"\bjap[oó]n\b|\bjapan\b",
    "coreadelsur": r"corea del sur|\bsouth korea\b|cor[eé]e du sud",
    "marruecos": r"\bmarruecos\b|\bmorocco\b|\bmaroc\b",
    "senegal": r"\bsenegal\b|\bs[eé]n[eé]gal\b",
    "nigeria": r"\bnigeria\b|\bnig[eé]ria\b",
    "arabiasaudita": r"arabia saudita|saudi arabia|arabie saoudite",
    "australia": r"\baustralia\b|\baustr[aá]lia\b",
    "ucrania": r"\bucrania\b|\bukraine\b|\bucr[aâ]nia\b",
    "flamengo": r"\bflamengo\b",
    "palmeiras": r"\bpalmeiras\b",
    "corinthians": r"\bcorinthians\b",
    "saopaulo": r"s[aã]o paulo",
    "santos": r"\bsantos\b",
    "gremio": r"\bgr[eê]mio\b",
    "internacional": r"\binternacional\b|\bsc internacional\b",
    "penarol": r"pe[nñ]arol",
    "nacional": r"club nacional de football|nacional de montevideo",
    "colocolo": r"colo-?colo",
    "ajax": r"\bajax\b",
    "psveindhoven": r"\bpsv\b",
    "feyenoord": r"\bfeyenoord\b",
    "porto": r"\bfc porto\b|\bporto\b",
    "benfica": r"\bbenfica\b",
    "sportingcp": r"sporting (cp|clube de portugal|lisbon|lisboa)",
    "braga": r"\bsc braga\b|\bbraga\b",
    "celtic": r"\bceltic\b",
    "rangers": r"\brangers\b",
    "intermiami": r"inter miami",
    "lagalaxy": r"\bla galaxy\b",
    "clubamerica": r"club am[eé]rica",
    "chivas": r"\bchivas\b|guadalajara",
    "cruzazul": r"cruz azul",
    "tigresuanl": r"\btigres\b",
    "monterrey": r"\bmonterrey\b",
    "racingclub": r"racing club",
    "sanlorenzo": r"san lorenzo",
    "velez": r"v[eé]lez sarsfield|v[eé]lez",
    "estudiantes": r"estudiantes de la plata",
    "cruzeiro": r"\bcruzeiro\b",
    "atleticomineiro": r"atl[eé]tico mineiro|\bgal[oo]\b",
    "botafogo": r"\bbotafogo\b",
    "vascodagama": r"vasco da gama",
    "fluminense": r"\bfluminense\b",
    "egipto": r"\begipto\b|\begypt\b|\b[eé]gypte\b",
    "ghana": r"\bghana\b",
    "argelia": r"\bargelia\b|\balgeria\b|\balg[eé]rie\b|\barg[eé]lia\b",
    "tunez": r"\bt[uú]nez\b|\btunisia\b|\btunisie\b",
    "camerun": r"camer[uú]n|\bcameroon\b|\bcameroun\b",
    "costamarfil": r"costa de marfil|ivory coast|c[oô]te d.ivoire",
    "austria": r"\baustria\b|\b[aá]ustria\b",
    "irlandadelnorte": r"irlanda del norte|irlanda do norte|northern ireland|irlande du nord",
    "irlanda": r"\birlanda\b|\bireland\b|\birlande\b",
    "islandia": r"\bislandia\b|\biceland\b|\bisland[eê]",
    "serbia": r"\bserbia\b|\bs[eé]rvia\b",
    "qatar": r"\bcatar\b|\bqatar\b",
    "iran": r"\bir[aá]n\b",
    "emiratosarabes": r"emiratos [aá]rabes|united arab emirates|[eé]mirats arabes",
    "china": r"\bchina\b",
    "nuevazelanda": r"nueva zelanda|new zealand|nouvelle-z[eé]lande",
    "costarica": r"costa rica",
    "jamaica": r"\bjamaica\b|\bjama[iï]que\b",
    "panama": r"\bpanam[aá]\b",
    "sudafrica": r"\bsud[aá]frica\b|\bsouth africa\b|afrique du sud",
    "grecia": r"\bgrecia\b|\bgreece\b|\bgr[eè]ce\b|\bgr[eé]cia\b",
    "haiti": r"\bhait[ií]\b|\bhaiti\b|\bha[iï]ti\b",
    "hungria": r"\bhungr[ií]a\b|\bhungary\b|\bhongrie\b|\bhungria\b",
    "rdcongo": r"\brd congo\b|\bdr congo\b|\bcongo rd\b",
    "venezuela": r"\bvenezuela\b",
    "fenerbahce": r"fenerbah[çc]e",
    "galatasaray": r"galatasaray",
    "besiktas": r"be[sş]ikta[sş]",
    "alnassr": r"al-nassr|al nassr",
    "youngboys": r"young boys",
    "fccopenhagen": r"fc copenhag(ue|en|a)|f\.c\. copenhagen",
    "realvalladolid": r"real valladolid",
    "stpauli": r"st\.?\s*pauli",
    "hullcity": r"hull city",
    "speziacalcio": r"spezia calcio",
    "fcmetz": r"\bfc metz\b|\bmetz\b",
    "asse": r"\basse\b|saint-[ée]tienne",
    "guingamp": r"guingamp",
    "redstarfc": r"red star fc",
    "estunis": r"\bes tunis\b|esp[ée]rance.{0,3}tunis",
    "jskabylie": r"js kabylie",
    "versailles78": r"versailles 78",
    "kallithea": r"kallith[ée]a",
    "wydad": r"wydad",
    "seattlesounders": r"seattle sounders",
    "clermontfoot": r"clermont foot",
    "genoa": r"\bgenoa\b",
    "nycfc": r"new york city fc",
    "nyredbulls": r"new york red bulls",
    "columbuscrew": r"columbus crew",
    "sandiegofc": r"san diego fc",
    "rbsalzburg": r"rb salzbur(g|go|gh|ourg)",
    "deportivo": r"deportivo la coru[ñn]a|deportivo la corogne",
    "partizanbelgrade": r"partizan belgrad",
    "lafc": r"los angeles fc",
    "cerclebrugge": r"cercle bruges|cercle brugge",
}

TYPE_PATTERNS = {
    # goalkeeper se chequea primero: títulos como "Maillot de portero
    # local" contienen "local" pero son de arquero, no de titular.
    "goalkeeper": r"portero|gardien|arquero|goalkeeper|\bgk\b|meta\b|guarda-?redes|portiere",
    # training también se chequea antes que home/away/third: "Camiseta de
    # entrenamiento" no tiene un color titular/suplente definido, así que
    # si se la clasificara por esos patrones podría quedar mal etiquetada.
    "training": r"entrenamiento|\btraining\b|treino|pr[eé].?match|calentamiento|prematch|calenta",
    "home": r"\blocal\b|\bhome\b|\bdomicile\b|titular|\b1[ºª]?\s*equipaci[oó]n\b|primera equipaci[oó]n|principal\b",
    "away": r"\bexterior\b|\bext[ée]rieur\b|\bvisitante\b|\baway\b|segunda equipaci[oó]n|\b2[ºª]?\s*equipaci[oó]n\b|alternativ[oa]\b",
    "third": r"\btercer[ao]?\b|\bthird\b|troisi[eè]me|3[ºª]?\s*equipaci[oó]n|\bterceiro\b",
}

JERSEY_RE = re.compile(r"\b(camiseta|camisola|maillot|jersey|trikot|shirt|maglia)\b", re.I)
EXCLUDE_RE = re.compile(
    r"protecci[oó]n|mcdavid|\bhex\b|new england|nouvelle-angleterre|nouvelle angleterre|"
    r"infantil|niñ|nino|bebé|bebe|baby|kids?|junior|mujer|women|dama|f[ée]minin|femenin|\bfemme\b|crian[çc]a|"
    r"\benfant\b|bambin[oa]|ragazz[oi]|neonato|\bmini\b|"
    r"ciclismo|chandal|chándal|sudadera|hoodie|pantal|short|medias|calcetin|"
    r"retro|vintage|clásic|classic|hist[oó]ric|retr[oò]|riedizione|años? \d0\b|"
    r"marvel|avengers|disney|maradona|"
    r"fan\b|aficionado|réplica infantil|"
    r"poster|toalla|bufanda|gorra|llavero|taza|funda|mochila|balón|balon|"
    r"\bconcept\b|\bairo\b|"
    r"\brugby\b|dkali|ruckfield|eden park|canterbury|\bkooga\b|xv de france|xv du coq",
    re.I,
)
# Igual que EXCLUDE_RE pero sin filtrar por edad (para el modo "kids": acá
# SÍ queremos infantil/niño/kids/junior; el resto de las exclusiones
# —entrenamiento, retro, merch, etc.— se mantienen igual).
KIDS_EXCLUDE_RE = re.compile(
    r"protecci[oó]n|mcdavid|\bhex\b|new england|nouvelle-angleterre|nouvelle angleterre|"
    r"bebé|bebe|\bbaby\b|\bmois\b|"
    r"mujer|women|dama|f[ée]minin|femenin|\bfemme\b|"
    r"ciclismo|chandal|chándal|sudadera|hoodie|pantal|short|medias|calcetin|"
    r"retro|vintage|clásic|classic|hist[oó]ric|retr[oò]|riedizione|años? \d0\b|"
    r"marvel|avengers|disney|maradona|"
    r"fan\b|aficionado|"
    r"poster|toalla|bufanda|gorra|llavero|taza|funda|mochila|balón|balon|"
    r"\bconcept\b|\bairo\b|"
    r"\brugby\b|dkali|ruckfield|eden park|canterbury|\bkooga\b|xv de france|xv du coq",
    re.I,
)
KIDS_SIGNAL_RE = re.compile(
    r"infantil|\bniñ|\bnino|\bkids?\b|\bjunior\b|\benfant|crian[çc]a|"
    r"\b\d{1,2}\s*[/-]\s*\d{1,2}\s*(ans|years|anos|años)?\s*$|"
    r"\b\d{1,2}-\d{1,2}\s*(ans|years|anos|años)\b",
    re.I,
)
KIDS_AGE_RE = re.compile(r"\b(\d{1,2})\s*[/-]\s*(\d{1,2})\b")
# Detecta cualquier mención de temporada en el título ("2024/25", "24/25",
# "24-25", "2026", "95" de un aniversario retro no cuenta acá porque no
# matchea ninguno de estos patrones de temporada real) y devuelve True si
# es una temporada ANTERIOR a la actual (2025/26 en adelante).
SEASON_4DIGIT_RE = re.compile(r"\b(19\d\d|20\d\d)\s*[/-]\s*(\d{2,4})\b")
SEASON_2DIGIT_RE = re.compile(r"\b(\d{2})\s*[/-]\s*(\d{2})\b")
SEASON_BARE_YEAR_RE = re.compile(r"\b(19\d\d|20\d\d)\b")

def is_old_season(title):
    m = SEASON_4DIGIT_RE.search(title)
    if m:
        start_year = int(m.group(1))
        return start_year < 2025
    m = SEASON_2DIGIT_RE.search(title)
    if m:
        a, b = int(m.group(1)), int(m.group(2))
        # solo lo tratamos como temporada si son años consecutivos (25/26, 24/25, etc.)
        if b == (a + 1) % 100:
            return a < 25
    m = SEASON_BARE_YEAR_RE.search(title)
    if m:
        return int(m.group(1)) < 2025
    # títulos de selecciones estilo adidas: "Argentina 26", "Alemania 24"
    # (número de 2 dígitos suelto al final = año del Mundial/Euro). Solo
    # lo tratamos como marca de temporada si cae en la ventana 24-27; fuera
    # de esa ventana (ej. "Manchester United 90") es ambiguo y se maneja
    # por penalización de score, no como exclusión dura.
    for m in re.finditer(r"\b(\d{2})\b", title):
        n = int(m.group(1))
        if 20 <= n <= 27:
            return n < 25
    return False

def team_re_all():
    return {k: re.compile(v, re.I) for k, v in TEAM_PATTERNS.items()}

def type_re_all():
    return {k: re.compile(v, re.I) for k, v in TYPE_PATTERNS.items()}

SIZE_MAP = {
    "XS": "XS", "S": "S", "M": "M", "L": "L", "XL": "XL",
    "2XL": "XXL", "XXL": "XXL",
    "3XL": "3XL", "XXXL": "3XL",
    "4XL": "4XL", "XXXXL": "4XL",
}

# Algunos feeds (Como, FansJerseyHub) no traen una columna de talla separada:
# cada talla es una fila distinta con la talla como sufijo del título
# ("... Jersey 2025/26 - S"). Esto separa esa base del sufijo de talla.
TITLE_SIZE_SUFFIX_RE = re.compile(r"^(.*?)\s*-\s*(XXS|XS|S|M|L|XL|2XL|XXL|3XL|4XL)\s*$", re.I)
# PlanetFoot: "... Junior Noir - XXS / 5-6 ans" (talla de letra + edad juntas)
TITLE_KIDS_AGE_SUFFIX_RE = re.compile(
    r"^(.*?)\s*-\s*(?:XXS|XS|S|M|L|XL|2XL|XXL)?\s*/?\s*(\d{1,2})\s*[/-]\s*(\d{1,2})\s*(?:ans|years|anos|años)?\s*$",
    re.I,
)

def split_title_size(title):
    m = TITLE_SIZE_SUFFIX_RE.match(title)
    if m:
        return m.group(1).strip(), m.group(2).upper()
    m = TITLE_KIDS_AGE_SUFFIX_RE.match(title)
    if m:
        return m.group(1).strip(), f"{int(m.group(2))}-{int(m.group(3))}"
    return title, None

def analyze(csv_path, price_col, size_col=None, title_col="product_name", link_col="aw_deep_link", image_col="aw_image_url", encoding="utf-8-sig"):
    rows = list(csv.DictReader(open(csv_path, encoding=encoding)))
    teams = team_re_all()
    types = type_re_all()

    candidates = defaultdict(list)  # (team,type) -> list of (base_title, row)

    for r in rows:
        title = r.get(title_col) or ""
        if not JERSEY_RE.search(title):
            continue
        if EXCLUDE_RE.search(title):
            continue
        team_match = None
        for tk, pat in teams.items():
            if pat.search(title):
                team_match = tk
                break
        if not team_match:
            continue
        type_match = None
        for tyk, pat in types.items():
            if pat.search(title):
                type_match = tyk
                break
        if not type_match:
            continue
        base_title, title_size = split_title_size(title)
        candidates[(team_match, type_match)].append((base_title, r, is_old_season(title), title_size))

    return candidates, rows

def normalize_kids_size(raw):
    """'7/8 ans', '9-10', '13 - 14 years' -> '7-8' (o None si no matchea)."""
    if not raw:
        return None
    m = KIDS_AGE_RE.search(raw)
    if not m:
        return None
    return f"{int(m.group(1))}-{int(m.group(2))}"

def analyze_kids(csv_path, price_col, size_col=None, title_col="product_name", link_col="aw_deep_link", image_col="aw_image_url", encoding="utf-8-sig"):
    rows = list(csv.DictReader(open(csv_path, encoding=encoding)))
    teams = team_re_all()
    types = type_re_all()

    candidates = defaultdict(list)

    for r in rows:
        title = r.get(title_col) or ""
        if not JERSEY_RE.search(title):
            continue
        if KIDS_EXCLUDE_RE.search(title):
            continue
        size_raw = (r.get(size_col) or "") if size_col else ""
        if not KIDS_SIGNAL_RE.search(title) and not KIDS_AGE_RE.search(size_raw):
            continue
        team_match = None
        for tk, pat in teams.items():
            if pat.search(title):
                team_match = tk
                break
        if not team_match:
            continue
        type_match = None
        for tyk, pat in types.items():
            if pat.search(title):
                type_match = tyk
                break
        if not type_match:
            continue
        base_title, title_size = split_title_size(title)
        candidates[(team_match, type_match)].append((base_title, r, is_old_season(title), title_size))

    return candidates, rows

if __name__ == "__main__":
    path = sys.argv[1]
    price_col = sys.argv[2] if len(sys.argv) > 2 else "search_price"
    candidates, rows = analyze(path, price_col)
    for (team, typ), items in sorted(candidates.items()):
        titles = sorted(set(t for t, r, old, tsize in items))
        print(f"=== {team} / {typ} ({len(items)} rows, {len(titles)} unique titles) ===")
        for t in titles[:8]:
            print("   ", t)
