#!/usr/bin/env python3
"""Descarga los feeds conectados a FEED_DIR (/tmp/feeds), sin LLM.

Hasta el 2026-10-09 la descarga la hacía la sesión de Claude del scan diario:
si Claude no arrancaba (OAuth caducado, límite semanal, 16 de 62 noches) no se
bajaba nada y no se refrescaba nada. Esto la hace en Python puro, antes de
invocar a Claude (scripts/daily_refresh.sh).

Qué baja: cada `AWIN_FEED_URL_<NOMBRE>` de .env.local -> <NOMBRE>.csv (menos
TICKETNET_DE: el programa cerró el 2026-09-01) y los tres feeds TradeTracker
que ya se bajaban (FUTBOLFACTORY, SHOPREALBETIS, futbolemotion_feed).

Guarda: cada archivo se baja a <nombre>.csv.tmp y solo reemplaza al anterior
si trae cabecera y al menos el 80 % de las líneas del anterior. Si no, el
anterior se queda (con su fecha vieja, así refresh_offers.py lo ve como "no
descargado hoy" y no toca esa tienda). Nunca deja un archivo a medias.

Uso: python3 scripts/catalog-mining/download_feeds.py [NOMBRE ...]
"""
import concurrent.futures, gzip, os, re, shutil, sys, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
FEED_DIR = os.environ.get("FEED_DIR", "/tmp/feeds")
SKIP = {"TICKETNET_DE"}
TT = "https://pf.tradetracker.net/?aid=514692&encoding=utf-8&type=csv&fid={}&categoryType=2&additionalType=2&csvDelimiter=%3B&csvEnclosure=%22&filter_extended=1"
TRADETRACKER = {"FUTBOLFACTORY": TT.format(2551751), "SHOPREALBETIS": TT.format(2291247),
                "futbolemotion_feed": TT.format(2066871)}


def feeds():
    env = open(os.environ.get("ENV_FILE", os.path.join(REPO, ".env.local")), encoding="utf-8").read()
    out = {m.group(1): m.group(2).strip().strip('"')
           for m in re.finditer(r"^AWIN_FEED_URL_([A-Z0-9_]+)=(.+)$", env, re.M) if m.group(1) not in SKIP}
    out.update(TRADETRACKER)
    return out


def lines(path):
    n = 0
    with open(path, "rb") as f:
        while b := f.read(1 << 22):
            n += b.count(b"\n")
    return n


def download(name, url):
    dst = os.path.join(FEED_DIR, f"{name}.csv")
    tmp = dst + ".tmp"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=300) as r, open(tmp + ".raw", "wb") as f:
            shutil.copyfileobj(r, f, 1 << 20)
        if open(tmp + ".raw", "rb").read(2) == b"\x1f\x8b":
            # gzip.open lee los gzip de varios miembros (Awin los manda así) y
            # lanza EOFError si el archivo viene cortado.
            with gzip.open(tmp + ".raw") as g, open(tmp, "wb") as f:
                shutil.copyfileobj(g, f, 1 << 20)
            os.remove(tmp + ".raw")
        else:
            os.replace(tmp + ".raw", tmp)
        head = open(tmp, encoding="utf-8", errors="replace").readline()
        n, prev = lines(tmp), (lines(dst) if os.path.exists(dst) else 0)
        if len(re.split(r"[,;]", head)) < 5:
            raise ValueError(f"cabecera rara: {head[:60]!r}")
        if n < 10 or (prev and n < 0.8 * prev):
            raise ValueError(f"{n} líneas (el anterior tenía {prev})")
        os.replace(tmp, dst)
        return f"OK {name} {n} líneas"
    except Exception as e:  # noqa: BLE001 -- cualquier fallo deja el archivo anterior
        for p in (tmp, tmp + ".raw"):
            if os.path.exists(p):
                os.remove(p)
        return f"FAIL {name}: {type(e).__name__}: {e} (se conserva el archivo anterior)"


def main(only):
    os.makedirs(FEED_DIR, exist_ok=True)
    todo = {k: v for k, v in feeds().items() if not only or k in only}
    with concurrent.futures.ThreadPoolExecutor(4) as ex:
        res = list(ex.map(lambda kv: download(*kv), todo.items()))
    for line in sorted(res):
        print(line)
    bad = [r for r in res if r.startswith("FAIL")]
    print(f"=== download_feeds: {len(res) - len(bad)} OK, {len(bad)} FAIL ===")
    return 0


if __name__ == "__main__":
    sys.exit(main(set(sys.argv[1:])))
