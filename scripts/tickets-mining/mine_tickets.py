#!/usr/bin/env python3
"""Mina entradas reales de partidos de fútbol de los feeds regionales
de Football TicketNet en Awin (UK/GBP aid 109002, US/USD aid 109004) --
cache /tmp/feeds/*.csv del scan diario, sin descarga propia. El feed DE
(aid 109000) ya no se lee: ese programa cerró el 2026-09-01 y sus ofertas
se quitaron del catálogo. Escribe mined_tickets.json, entrada de
refresh_tickets.py.

OJO: UK y US son la MISMA tienda (USD = GBP x 1,33 en casi todos los
eventos), no una comparación. La comparación real viene de Gigsberg
(Awin, feed 117210): se agrega como oferta extra SOLO a eventos ya
minados de Football TicketNet, con el mismo "Equipo A vs Equipo B" + fecha
exactos (nunca difuso; ambiguo = se omite) y precio dentro de [1/3, 3]x.
Si el feed de Gigsberg tiene más de GIGSBERG_MAX_AGE_DAYS (7) días desde
su última importación, NO se usa (precios viejos).

Fecha/venue: no vienen en columnas propias, están embebidos en el campo
description con el formato fijo "Event Type: Football, {venue}, Date:
{date}, Time: {time}" (confirmado real en las 2713 filas de la muestra).
Competición: no viene en ningún campo -- se extrae del segmento de la
URL real justo después de footballticketnet.com/ (ej. "german-bundesliga"
-> "German Bundesliga"), humanizado a mano para los nombres reales de
liga (ver COMPETITION_NAMES).

Eventos pasados (date < hoy) se excluyen -- una entrada vencida no sirve
para nada, y el feed sí trae alguna fecha ya pasada de forma inconsistente.
"""
import csv, re, json, os, unicodedata
from datetime import date, datetime

FEEDS = "/tmp/feeds"
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_PATH = os.path.join(SCRIPT_DIR, "mined_tickets.json")

DESC_RE = re.compile(r"Event Type:\s*([^,]+),\s*(.+?),\s*Date:\s*(\d{4}-\d{2}-\d{2}),\s*Time:\s*([\d:]+)")
COMP_RE = re.compile(r"footballticketnet\.com/([a-z0-9-]+)/")

# Nombres reales de competición, prolijos -- el resto de los slugs no
# vistos en la muestra se humanizan genéricamente (reemplazar "-" por " "
# y capitalizar cada palabra), que ya da un resultado razonable para
# slugs simples tipo "premier-league" -> "Premier League".
COMPETITION_NAMES = {
    "german-bundesliga": "Bundesliga",
    "german-2bundesliga": "2. Bundesliga",
    "premier-league": "Premier League",
    "efl-championship": "EFL Championship",
    "spanish-la-liga": "LaLiga",
    "la-liga-hypermotion": "LaLiga Hypermotion",
    "italian-serie-a": "Serie A",
    "french-ligue-1": "Ligue 1",
    "dutch-eredivisie": "Eredivisie",
    "portuguese-liga-nos": "Liga Portugal",
    "scottish-premiership": "Scottish Premiership",
    "belgian-first-division-a": "Belgian Pro League",
    "swiss-super-league": "Swiss Super League",
    "austrian-football-bundesliga": "Austrian Bundesliga",
    "danish-superliga": "Danish Superliga",
    "czech-first-league": "Czech First League",
    "turkish-super-league": "Süper Lig",
    "super-league-greece": "Super League Greece",
    "saudi-pro-league": "Saudi Pro League",
    "champions-league": "UEFA Champions League",
    "europa-league": "UEFA Europa League",
    "europa-conference-league": "UEFA Conference League",
    "afc-champions-league-elite": "AFC Champions League Elite",
}


def humanize_competition(slug):
    if slug in COMPETITION_NAMES:
        return COMPETITION_NAMES[slug]
    return " ".join(w.capitalize() for w in slug.split("-"))


def mine_region(fname, store_label, currency):
    if not os.path.exists(f"{FEEDS}/{fname}"):
        print(f"{store_label}: feed not found, skipped")
        return {}
    today = date.today().isoformat()
    picks = {}
    with open(f"{FEEDS}/{fname}", newline="", encoding="utf-8", errors="replace") as f:
        for row in csv.DictReader(f):
            desc = row.get("description") or ""
            m = DESC_RE.search(desc)
            if not m:
                continue
            _sport, venue, event_date, event_time = m.groups()
            if event_date < today:
                continue
            price_raw = row.get("search_price") or ""
            try:
                price = round(float(price_raw), 2)
            except ValueError:
                continue
            if not price:
                continue
            key = row.get("merchant_product_id")
            if not key:
                continue
            comp_m = COMP_RE.search(row.get("merchant_deep_link") or "")
            competition = humanize_competition(comp_m.group(1)) if comp_m else ""
            picks[key] = {
                "event": (row.get("product_name") or "").strip(),
                "venue": venue.strip(),
                "date": event_date,
                "time": event_time,
                "competition": competition,
                "imageUrl": row.get("aw_image_url"),
                "offer": {
                    "store": store_label,
                    "price": price,
                    "currency": currency,
                    "url": row.get("aw_deep_link"),
                },
            }
    print(f"{store_label}: {len(picks)}")
    return picks


# Encontrado 2026-09-18 (reporte real del usuario, capturas de chips de
# club repetidos: "1. FC Koln" y "1. FC Köln" en el filtro de Club) --
# mismo motivo que el bug de mayúscula/minúscula de marca en
# mine_gear.py, pero acá con acentos: el `event` de cada partido sale
# del `product_name` de la región que primero trajo ese fixture (DE
# primero en `regions`, después UK/US), y cada región transcribe el
# nombre del club a su manera ("Köln" en DE, "Koln" en UK/US) -- así que
# partidos distintos del MISMO club terminaban con dos grafías reales
# distintas en el catálogo. Sin lista fija de acentos por club (sería
# inventar datos): se normaliza sacando los acentos (NFKD) como key de
# agrupación y se elige la grafía que más veces aparece en el propio
# feed, igual que canonicalize_brands en mine_gear.py.
def strip_accents(s):
    return "".join(c for c in unicodedata.normalize("NFKD", s) if not unicodedata.combining(c))


def canonicalize_teams(merged):
    counts = {}
    for d in merged.values():
        for team in d["event"].split(" vs "):
            team = team.strip()
            counts[team] = counts.get(team, 0) + 1
    canonical = {}
    for spelling, n in counts.items():
        key = strip_accents(spelling).lower()
        if key not in canonical or n > counts[canonical[key]]:
            canonical[key] = spelling
    for d in merged.values():
        parts = d["event"].split(" vs ")
        if len(parts) == 2:
            a = canonical[strip_accents(parts[0].strip()).lower()]
            b = canonical[strip_accents(parts[1].strip()).lower()]
            d["event"] = f"{a} vs {b}"


# ---------------------------------------------------------------------------
# Segunda fuente: Gigsberg (Awin aid 102705, feed ES en EUR, id 117210).
#
# Football TicketNet UK y US son la MISMA tienda: el precio US es el UK x 1,33
# en 2587 de 2588 partidos (medido 2026-10-02), o sea una sola oferta en dos
# monedas, no una comparacion. Gigsberg es otro mercado secundario, con
# precio propio e independiente, asi que es el unico candidato real a
# comparar que ya esta aprobado (active) en nuestra cuenta Awin.
#
# Reglas, todas pensadas para NO inventar una comparacion:
#  1. Emparejado SOLO por nombre exacto de equipos (sin acentos/mayusculas/
#     puntuacion) + misma fecha. Nunca difuso. Si el par es ambiguo (dos
#     partidos del mismo nombre y dia en cualquiera de las dos fuentes) se
#     descarta. Gigsberg NO crea partidos nuevos: solo suma oferta a uno
#     que Football TicketNet ya trae.
#  2. Frescura: el feed de Gigsberg estuvo congelado desde 2026-09-09 (campo
#     "Last Imported" del listado de feeds de Awin, 23 dias de atraso el
#     2026-10-02; contra la pagina real: la mitad de los precios coincide y
#     el resto se movio hasta un 40%). Comparar un precio de hoy contra uno
#     de hace 3 semanas y decir "mas barato" seria mentir, asi que si el
#     feed tiene mas de GIGSBERG_MAX_AGE_DAYS (7 por defecto) NO se usa y ni
#     se descarga. Se reactiva solo cuando Awin lo vuelva a importar.
#  3. Precios incomparables: si el precio de Gigsberg es <1/3 o >3x el de
#     Football TicketNet (en EUR) casi seguro son categorias de asiento
#     distintas, y ese partido no se empareja.
# ---------------------------------------------------------------------------
GIGSBERG_FEED_ID = "117210"
GIGSBERG_MAX_AGE_DAYS = float(os.environ.get("GIGSBERG_MAX_AGE_DAYS", "7"))
GIGSBERG_RATIO_BOUNDS = (1 / 3, 3)
TO_EUR = {"EUR": 1, "GBP": 1 / 0.86, "USD": 1 / 1.08}  # misma tabla que OFFER_CURRENCY_TO_EUR en src/lib/offerMoney.ts
GIGSBERG_DESC_RE = re.compile(r"Venue:\s*(.+?),\s*Date:\s*(\d{4}-\d{2}-\d{2}),\s*Time:\s*([\d:]+)")


def event_key(event, event_date):
    s = strip_accents(event).lower()
    return (" ".join(re.sub(r"[^a-z0-9 ]", " ", s).split()), event_date)


def awin_api_key():
    m = re.search(r"apikey/([A-Za-z0-9]+)", os.environ.get("AWIN_FEED_URL_TICKETNET_UK", ""))
    if m:
        return m.group(1)
    for env_path in (os.path.join(SCRIPT_DIR, "..", "..", ".env.local"), os.path.expanduser("~/football-cult/.env.local")):
        if os.path.exists(env_path):
            m = re.search(r"AWIN_FEED_URL_TICKETNET_UK=.*?apikey/([A-Za-z0-9]+)", open(env_path, encoding="utf-8").read())
            if m:
                return m.group(1)
    return None


def fetch_gigsberg_feed():
    """Devuelve la ruta del CSV de Gigsberg ES, o None si no esta fresco/no se pudo bajar."""
    import urllib.request, gzip, io
    key = awin_api_key()
    if not key:
        print("Gigsberg: no Awin api key found, skipped")
        return None
    try:
        with urllib.request.urlopen(f"https://productdata.awin.com/datafeed/list/apikey/{key}", timeout=60) as r:
            listing = list(csv.DictReader(io.StringIO(r.read().decode("utf-8", errors="replace"))))
        row = next((x for x in listing if x["Feed ID"] == GIGSBERG_FEED_ID and x["Membership Status"] == "active"), None)
        if not row:
            print("Gigsberg: feed not active in the Awin list, skipped")
            return None
        age = (datetime.now() - datetime.strptime(row["Last Imported"], "%Y-%m-%d %H:%M:%S")).total_seconds() / 86400
        if age > GIGSBERG_MAX_AGE_DAYS:
            print(f"Gigsberg: feed last imported {row['Last Imported']} ({age:.0f} days ago, limit {GIGSBERG_MAX_AGE_DAYS:g}) -> stale, NOT used")
            return None
        dest = f"{FEEDS}/GIGSBERG_ES.csv"
        with urllib.request.urlopen(row["URL"], timeout=180) as r:
            data = r.read()
        if data[:2] == b"\x1f\x8b":
            data = gzip.decompress(data)
        with open(dest, "wb") as f:
            f.write(data)
        return dest
    except Exception as e:  # red/Awin caidos: el miner sigue sin segunda fuente, nunca rompe la corrida
        print(f"Gigsberg: could not fetch ({e}), skipped")
        return None


def add_gigsberg_offers(merged):
    path = fetch_gigsberg_feed()
    if not path:
        return 0
    today = date.today().isoformat()
    index = {}
    for d in merged.values():
        index.setdefault(event_key(d["event"], d["date"]), []).append(d)
    seen = {}
    with open(path, newline="", encoding="utf-8", errors="replace") as f:
        for row in csv.DictReader(f):
            if "/sport-tickets/football/" not in (row.get("merchant_deep_link") or ""):
                continue
            m = GIGSBERG_DESC_RE.search(row.get("description") or "")
            if not m or m.group(2) < today:
                continue
            try:
                price = round(float(row.get("search_price") or ""), 2)
            except ValueError:
                continue
            if not price or row.get("currency") != "EUR" or not row.get("aw_deep_link"):
                continue
            k = event_key(row.get("product_name") or "", m.group(2))
            seen.setdefault(k, []).append((price, row["aw_deep_link"]))
    added = skipped_ambiguous = skipped_price = 0
    for k, offers in seen.items():
        targets = index.get(k)
        if not targets:
            continue
        if len(offers) > 1 or len(targets) > 1:
            skipped_ambiguous += 1
            continue
        price, url = offers[0]
        tn_eur = min(o["price"] * TO_EUR[o["currency"]] for o in targets[0]["offers"])
        if not GIGSBERG_RATIO_BOUNDS[0] <= price / tn_eur <= GIGSBERG_RATIO_BOUNDS[1]:
            skipped_price += 1
            continue
        targets[0]["offers"].append({"store": "Gigsberg", "price": price, "currency": "EUR", "url": url})
        added += 1
    print(f"Gigsberg: {added} events matched by exact teams+date (skipped: {skipped_ambiguous} ambiguous, {skipped_price} incomparable price)")
    return added


if __name__ == "__main__":
    regions = [
        # Football TicketNet DE: programa Awin CERRADO el 2026-09-01 (el nombre del
        # anunciante en Awin dice "CLOSED 01.09.2026") -> sus links ya no pagan
        # comision. Se deja afuera; UK/US siguen vigentes.
        ("TICKETNET_UK.csv", "FootballTicketNetUK", "GBP"),
        ("TICKETNET_US.csv", "FootballTicketNetUS", "USD"),
    ]
    merged = {}
    for fname, store_label, currency in regions:
        picks = mine_region(fname, store_label, currency)
        for key, d in picks.items():
            if key not in merged:
                merged[key] = {
                    "event": d["event"],
                    "venue": d["venue"],
                    "date": d["date"],
                    "time": d["time"],
                    "competition": d["competition"],
                    "imageUrl": d["imageUrl"],
                    "offers": [],
                }
            merged[key]["offers"].append(d["offer"])

    add_gigsberg_offers(merged)
    canonicalize_teams(merged)
    results = list(merged.values())
    print("TOTAL distinct events:", len(results))
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=1)
