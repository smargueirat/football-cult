#!/usr/bin/env python3
"""Resuelve estadio -> ciudad con Wikidata (dato real, no inventado) y lo
guarda en venue_cities.json (cache: solo consulta estadios nuevos).
Valida el país contra la liga del partido para descartar homónimos.
Uso: python3 scripts/tickets-mining/resolve_venue_cities.py"""
import json, os, re, sys, time, urllib.error, urllib.parse, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, "venue_cities.json")
TS = os.path.join(HERE, "..", "..", "src", "data", "tickets.ts")

# País esperado por liga (None = varios países, no se valida)
LEAGUE_COUNTRY = {
    "Bundesliga": "Germany", "2. Bundesliga": "Germany", "Premier League": "England",
    "EFL Championship": "England", "LaLiga": "Spain", "LaLiga Hypermotion": "Spain",
    "Serie A": "Italy", "Ligue 1": "France", "Eredivisie": "Netherlands",
    "Liga Portugal": "Portugal", "Scottish Premiership": "Scotland",
    "Belgian Pro League": "Belgium", "Swiss Super League": "Switzerland",
    "Austrian Bundesliga": "Austria", "Danish Superliga": "Denmark",
    "Czech First League": "Czech", "Süper Lig": "Turkey", "Super League Greece": "Greece",
}
VENUE_RE = re.compile(r"stadium|arena|ground|park|venue|football|sports|field|estadio|stade|stadion", re.I)


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "football-cult/1.0 (venue city resolver)"})
    for wait in (5, 15, 40, 90):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code != 429:
                raise
            time.sleep(wait)
    raise RuntimeError("429 persistente")


COUNTRIES = {"germany", "england", "scotland", "wales", "spain", "italy", "france", "netherlands", "portugal",
             "belgium", "switzerland", "austria", "denmark", "czech republic", "czechia", "turkey", "greece",
             "united kingdom", "ireland", "poland", "norway", "sweden", "ukraine", "kosovo"}
ALIASES = {"England": ["united kingdom"], "Scotland": ["united kingdom"], "Czech": ["czech"], "Turkey": ["türkiye"]}


def parse_city(desc):
    m = re.search(r"\bin (.+)$", desc)
    if not m:
        return None, []
    tail = m.group(1)
    if "London" in tail:
        return "London", ["london"]
    parts = [re.sub(r"^the (?:city|capital|town) of ", "", p.strip(), flags=re.I) for p in tail.split(",")]
    parts = [p for p in parts if p]
    city = next((p for p in parts if p.lower() not in COUNTRIES), None)
    return city, [p.lower() for p in parts]


def lookup(name, country):
    q = urllib.parse.quote(name)
    d = get(f"https://www.wikidata.org/w/api.php?action=wbsearchentities&search={q}&language=en&format=json&limit=10")
    for hit in d.get("search", []):
        desc = (hit.get("display", {}).get("description", {}) or {}).get("value", "") or hit.get("description", "")
        if not VENUE_RE.search(desc):
            continue
        city, parts = parse_city(desc)
        if not city:
            continue
        wanted = [country.lower()] + ALIASES.get(country, []) if country else []
        if wanted and any(p in COUNTRIES for p in parts) and not any(w in p for w in wanted for p in parts):
            continue
        return {"city": city, "desc": desc, "qid": hit["id"]}
    return None


def main():
    src = open(TS, encoding="utf-8").read()
    pairs = {}
    for m in re.finditer(r'venue: "([^"]+)",.*?competition: "([^"]+)"', src, re.S):
        pairs.setdefault(m.group(1), set()).add(m.group(2))
    cache = json.load(open(CACHE, encoding="utf-8")) if os.path.exists(CACHE) else {}
    def bad(v):
        return v is None or v["city"].lower() in COUNTRIES or v["city"].lower().startswith("the ")
    todo = [v for v in pairs if v not in cache or bad(cache[v])]
    print(f"{len(pairs)} estadios, {len(todo)} por resolver")
    for v in sorted(todo):
        countries = {LEAGUE_COUNTRY.get(c) for c in pairs[v]} - {None}
        country = next(iter(countries)) if len(countries) == 1 else None
        try:
            res = lookup(v, country)
        except Exception as e:
            print("ERR", v, e); continue
        cache[v] = res
        json.dump(cache, open(CACHE, "w", encoding="utf-8"), ensure_ascii=False, indent=1, sort_keys=True)
        print(("OK  " if res else "MISS"), v, "->", res["city"] if res else "")
        time.sleep(1.0)
    json.dump(cache, open(CACHE, "w", encoding="utf-8"), ensure_ascii=False, indent=1, sort_keys=True)


if __name__ == "__main__":
    main()
