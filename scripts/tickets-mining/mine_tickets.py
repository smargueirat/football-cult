#!/usr/bin/env python3
"""Mina entradas reales de partidos de fútbol de los 3 feeds regionales
de Football TicketNet en Awin (DE/EUR, UK/GBP, US/USD -- aid 109000,
109002, 109004, aprobados 2026-09-14/antes) -- cache /tmp/feeds/*.csv del
scan diario, sin descarga propia. Escribe mined_tickets.json, entrada de
refresh_tickets.py.

A diferencia de camisetas/botas/guantes/pelotas, acá SÍ tiene sentido
comparar precio por evento entre las 3 regiones: es el MISMO partido real
(mismo merchant_product_id en las 3 tiendas -- confirmado real,
ej. "Bayer Leverkusen vs SC Freiburg" id 128881: £132.84 en la tienda UK,
€155 en la DE) a precio genuinamente distinto según el país de venta, así
que se agrupa por ese id real en vez de tratarlas como 3 catálogos
separados.

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

    canonicalize_teams(merged)
    results = list(merged.values())
    print("TOTAL distinct events:", len(results))
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=1)
