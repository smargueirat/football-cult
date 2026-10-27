#!/usr/bin/env python3
"""Avisa a Bing/Yandex/Seznam/Naver (IndexNow) de las URLs del sitemap, en goteo.

No sirve para Google (Google no soporta IndexNow: ahí hay que usar Search
Console). La clave vive en public/<KEY>.txt y se sirve en la raiz del sitio.

Por qué en goteo (2026-10-27): Bing indexa casi solo lo que le llega por
IndexNow (Site Explorer: 512 indexadas de 657 conocidas = los ~650 hubs que
mandábamos a diario; las fichas, que nunca se mandaban, no entraban aunque
estén en el sitemap), y su recomendación principal para el sitio era "Avoid
IndexNow Batch Mode": un lote grande diario retrasa la indexación. Ahora cada
día van primero las URLs nunca enviadas y después las enviadas hace más
tiempo, hasta PER_DAY, en grupos de CHUNK con pausa: cada URL se reenvía
más o menos una vez por semana. El registro de envíos vive en STATE (fuera
del repo, como offer_seen.json).

Uso: python3 scripts/indexnow.py           # goteo diario (lo llama daily_scan.sh)
     python3 scripts/indexnow.py --dry     # qué mandaría hoy, sin enviar
"""
import datetime, json, os, re, sys, time, urllib.error, urllib.request

KEY = "24f76c1eeb9a510ee614e31ee9825725"
HOST = "football-cult.com"
STATE = os.path.expanduser("~/.local/state/fc-indexnow.json")
PER_DAY = 1000  # ~6.800 URLs en el sitemap -> cada una cada ~7 días
CHUNK = 100
PAUSE = 10  # segundos entre grupos
MIN_AGE = 6  # días antes de reenviar una URL


def sitemap_urls():
    urls = []
    for i in range(20):
        try:
            body = urllib.request.urlopen(urllib.request.Request(f"https://{HOST}/sitemap/{i}.xml", headers={"User-Agent": "Mozilla/5.0"}), timeout=120).read().decode()
        except Exception:
            break
        urls += re.findall(r"<loc>([^<]+)</loc>", body)
    return sorted(set(urls))


def todays_batch(urls, sent, n=PER_DAY, today=None):
    """Nunca enviadas primero (en orden del sitemap), luego las más viejas;
    nada que se haya enviado hace menos de MIN_AGE días."""
    cut = ((today or datetime.date.today()) - datetime.timedelta(days=MIN_AGE)).isoformat()
    due = [u for u in urls if sent.get(u, "") <= cut]
    return sorted(due, key=lambda u: (u in sent, sent.get(u, "")))[:n]


def submit(batch):
    payload = json.dumps({"host": HOST, "key": KEY, "keyLocation": f"https://{HOST}/{KEY}.txt", "urlList": batch}).encode()
    req = urllib.request.Request("https://api.indexnow.org/indexnow", data=payload, headers={"Content-Type": "application/json; charset=utf-8"})
    try:
        return urllib.request.urlopen(req, timeout=60).status
    except urllib.error.HTTPError as e:
        print("IndexNow error", e.code, e.read()[:200])
        return e.code


if __name__ == "__main__":
    assert todays_batch(["a", "b", "c"], {"a": "2026-10-20", "c": "2026-10-25"}, 2, datetime.date(2026, 10, 27)) == ["b", "a"]
    urls = sitemap_urls()
    if len(urls) < 1000:
        sys.exit(f"el sitemap devolvió solo {len(urls)} URLs: no envío nada")
    sent = json.load(open(STATE)) if os.path.exists(STATE) else {}
    batch = todays_batch(urls, sent)
    fresh = sum(1 for u in batch if u not in sent)
    print(f"{len(urls)} URLs en el sitemap; hoy {len(batch)} ({fresh} nunca enviadas)")
    if "--dry" in sys.argv:
        sys.exit(0)
    today, ok = datetime.date.today().isoformat(), 0
    for i in range(0, len(batch), CHUNK):
        part = batch[i:i + CHUNK]
        if submit(part) in (200, 202):
            ok += len(part)
            sent.update({u: today for u in part})
        time.sleep(PAUSE)
    os.makedirs(os.path.dirname(STATE), exist_ok=True)
    json.dump({u: d for u, d in sent.items() if u in set(urls)}, open(STATE, "w"), indent=0, sort_keys=True)
    print(f"IndexNow: {ok}/{len(batch)} aceptadas")
