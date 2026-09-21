#!/usr/bin/env python3
"""Avisa a Bing/Yandex/Seznam/Naver (IndexNow) de las URLs de hubs del sitio.

No sirve para Google (Google no soporta IndexNow: ahí hay que usar Search
Console). La clave vive en public/<KEY>.txt y se sirve en la raiz del sitio.

Uso: python3 scripts/indexnow.py            # hubs + paginas fijas (todas las lenguas)
     python3 scripts/indexnow.py --all      # ademas fichas de producto (puede ser mucho)
"""
import re, sys, json, urllib.request

KEY = "24f76c1eeb9a510ee614e31ee9825725"
HOST = "football-cult.com"
HUB = re.compile(r"/(?:es|en|pt|fr|it)(?:/(?:equipo|liga|pais|ligas|temporada|ofertas|botas/marca|botas/terreno|guantes/marca|pelotas/marca|ropa/marca|ropa/tipo|guia)(?:/|$)|$|/(?:botas|guantes|pelotas|ropa|tickets|selecciones|clubes|retro|mujer|ninos)$)")

def sitemap_urls():
    urls = []
    for i in range(20):
        try:
            body = urllib.request.urlopen(urllib.request.Request(f"https://{HOST}/sitemap/{i}.xml", headers={"User-Agent": "Mozilla/5.0"}), timeout=120).read().decode()
        except Exception:
            break
        urls += re.findall(r"<loc>([^<]+)</loc>", body)
    return urls

if __name__ == "__main__":
    urls = sitemap_urls()
    if "--all" not in sys.argv:
        urls = [u for u in urls if HUB.search(u.replace(f"https://{HOST}", ""))]
    urls = sorted(set(urls))
    print(len(urls), "URLs")
    for i in range(0, len(urls), 9000):
        payload = json.dumps({"host": HOST, "key": KEY, "keyLocation": f"https://{HOST}/{KEY}.txt", "urlList": urls[i:i + 9000]}).encode()
        req = urllib.request.Request("https://api.indexnow.org/indexnow", data=payload, headers={"Content-Type": "application/json; charset=utf-8"})
        try:
            r = urllib.request.urlopen(req, timeout=60)
            print("IndexNow", r.status)
        except urllib.error.HTTPError as e:
            print("IndexNow error", e.code, e.read()[:200])
