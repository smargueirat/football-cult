#!/usr/bin/env python3
"""Segunda tienda para las fichas retro: el MISMO modelo en eBay Reino Unido.

Por qué existe (2026-09-28): el 75,6% de las fichas de camiseta tenía una
sola tienda, pero el 88% de esas eran retro -- 4.452 fichas cuya única
oferta es un anuncio de eBay EE.UU. Una camiseta retro suele ser un
ejemplar único, así que no hay "otra tienda que venda el mismo", pero sí
otros anuncios del mismo modelo (mismo equipo, temporada y equipación).
Eso es lo que se compara en retro.

Reino Unido porque es el mayor mercado de camisetas retro: en una muestra
de 30 fichas, 14 tenían en eBay UK un anuncio verificado del mismo equipo y
temporada. eBay Alemania dio 5 de 30, así que no vale la cuota.

NO mina de cero: recorre las fichas retro que YA existen y busca ese modelo
concreto, con los mismos filtros que la pasada retro de siempre
(RETRO_EXCLUDE_RE, ACCESSORY_RE, rango de precio, exclusiones manuales) y
exigiendo que el anuncio coincida en equipo, equipación y temporada exacta.

La cuota de la Browse API es compartida con la minería diaria de los tres
mercados, así que trabaja por tandas con un cursor persistente, igual que
ebay_mine_cycle.py, y se corta sola si eBay empieza a devolver 429.

Uso:
    python3 ebay_gb_retro.py [tanda]            # busca y deja los picks en el estado
    python3 ebay_gb_retro.py [tanda] --apply    # además los inserta en products.ts
"""
import json, os, re, sys, time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import extract
from ebay_mine import (
    ACCESSORY_RE, EbayClient, JERSEY_RE, MAX_JERSEY_PRICE, MIN_JERSEY_PRICE,
    get_team_en_names, upsize_ebay_image,
)
from manual_exclusions import is_manually_excluded
from refresh import split_blocks
from retro_extract import RETRO_EXCLUDE_RE, parse_retro_season

HERE = os.path.dirname(os.path.abspath(__file__))
META_TS = os.path.join(HERE, "..", "..", "src", "lib", "productMeta.ts")
PRODUCTS_TS = os.path.join(HERE, "..", "..", "src", "data", "products.ts")
STATE = os.path.join(HERE, "ebay_gb_retro_state.json")
STORE = "eBay GB"
KITS = {"home", "away", "third", "goalkeeper"}
GB_KIDS_EXTRA_RE = extract.KIDS_EXTRA_RE  # definicion compartida, ver extract.py

# La edad suelta SIN rango. KIDS_SIGNAL_RE de extract.py exige un RANGO
# ("13-14 Years") justamente para no confundirlo con una temporada, pero eBay
# UK escribe tambien el talle unico: "Chelsea Away 2021 Football Shirt - UK
# Size 13 Years (XL)" entro como camiseta de adulto el 2026-10-06. Pide la
# palabra "year(s)" pegada al numero, que una temporada nunca lleva.
GB_SINGLE_AGE_RE = re.compile(r"\b(?:size\s*)?([0-9]|1[0-7])\s*(?:yrs?|years?)\b", re.I)

# Sufijo de CLUB en el titulo. Segundo filtro contra la colision pais/club,
# para los clubes que no estan en TEAM_PATTERNS: "Sint-Truidense HVV ...
# Belgium", "FC Chaves ... Portugal", "GWANGJU FC (South Korea)". Solo se
# aplica a fichas de seleccion. SIN "united"/"city" a proposito: chocan con
# "United States" y descartaban camisetas legitimas de EE.UU.
CLUB_SUFFIX_RE = re.compile(
    r"\b(FC|CF|AFC|SC|HVV|SV|BK|CD|SD|UD|RC|VfB|VfL|FK|NK|HSV|CSKA)\b|calcio|rovers|wanderers", re.I
)


def national_teams():
    """Claves de seleccion nacional, leidas de teamCategory en productMeta.ts."""
    src = open(META_TS, encoding="utf-8").read()
    m = re.search(r"export const teamCategory[^=]*=\s*\{(.*?)\n\};", src, re.S)
    return set(re.findall(r'(\w+):\s*"national"', m.group(1)))


def retro_targets(content):
    """Fichas retro de adulto con UNA sola tienda y sin oferta de eBay GB."""
    _, blocks, _ = split_blocks(content)
    out = []
    for b in blocks:
        if 'typeKey: "retro"' not in b or "ageGroup:" in b:
            continue
        stores = set(re.findall(r'\{ store: "([^"]+)"', b))
        if len(stores) != 1 or STORE in stores:
            continue
        pid = re.search(r'id: "([^"]+)"', b).group(1)
        team = re.search(r'teamKey: "([^"]+)"', b).group(1)
        season = re.search(r'season: "([^"]+)"', b).group(1)
        # La equipación de una ficha retro vive solo en el id:
        # {equipo}-retro-{temporada}-{equipación}[-variante]
        m = re.search(r"-retro-\d{4,6}-([a-z]+)", pid)
        kit = m.group(1) if m else None
        if kit in KITS:
            out.append({"id": pid, "team": team, "season": season, "kit": kit})
    return out


def search_model(client, t, team_en, teams, types, nationals):
    """El anuncio más barato de eBay UK que es de verdad ese mismo modelo."""
    year = t["season"][:4]
    kit_word = "goalkeeper" if t["kit"] == "goalkeeper" else t["kit"]
    results = client.search(f"{team_en} {year} {kit_word} shirt", limit=30)
    best = None
    for item in results:
        title = item.get("title") or ""
        if not JERSEY_RE.search(title) or RETRO_EXCLUDE_RE.search(title) or ACCESSORY_RE.search(title):
            continue
        # Las fichas retro de este script son de HOMBRE: una talla de mujer o de
        # nino es OTRA dimension, con su propio pipeline. Pedido el 2026-09-29 y
        # otra vez el 10-01, cuando volvio a costar dos ofertas sacadas a mano
        # (un Club Tijuana "Boys" y un Castore "Size 12UK"). Mismo guard que
        # ebay_mine_full.py's mine_retro.
        if extract.WOMEN_SIGNAL_RE.search(title) or extract.KIDS_SIGNAL_RE.search(title):
            continue
        if GB_KIDS_EXTRA_RE.search(title) or GB_SINGLE_AGE_RE.search(title):
            continue
        if has_player_print(title) or NOT_A_GARMENT_RE.search(title):
            continue
        hit = extract.match_team(title, teams)
        if not hit or hit[0] != t["team"]:
            continue
        # Colision pais/club: una camiseta de club que NOMBRA al pais entraba
        # como si fuera de la seleccion. Reales encontrados el 2026-09-29:
        # "Rangers FC (Scotland) 2024/25 Home Shirt" -> Escocia, "ISCO 22#
        # Malaga away ... LA LIGA SPAIN" -> Espana, "AC Milan 2023/2024 Crespo
        # Italy Third" -> Italia, "England 1990/92 Third Shirt Umbro Italia 90"
        # -> Italia. Es la misma clase que el caso Ucrania/Shakhtar del README.
        #
        # Regla: si la ficha es de SELECCION y el titulo nombra a cualquier
        # otro equipo, se descarta. Pierde alguna legitima (una camiseta de
        # Suecia que menciona el club del jugador), pero en un comparador una
        # camiseta equivocada cuesta mucho mas que una que falta.
        if t["team"] in nationals:
            if any(k != t["team"] and pat.search(title) for k, pat in teams.items()):
                continue
            if CLUB_SUFFIX_RE.search(title) or extract.CLUB_WORD_RE.search(title):
                continue
        kit = next((k for k, p in types.items() if p.search(title)), None)
        if kit != t["kit"]:
            continue
        if parse_retro_season(title) != t["season"]:
            continue
        price = item.get("price") or {}
        try:
            amount = float(price.get("value"))
        except (TypeError, ValueError):
            continue
        if not (MIN_JERSEY_PRICE <= amount <= MAX_JERSEY_PRICE):
            continue
        link = item.get("itemAffiliateWebUrl") or item.get("itemWebUrl")
        if not link or is_manually_excluded(link):
            continue
        if best is None or amount < best["price"]:
            best = {
                "title": title, "price": amount,
                "currency": price.get("currency") or "GBP",
                "link": link, "item_id": item.get("itemId"),
                "image": upsize_ebay_image((item.get("image") or {}).get("imageUrl")),
            }
    if best and best.get("item_id"):
        sizes, shipping = client.get_item_details(best["item_id"])
        best["sizes"] = sizes or ["M", "L"]
        best["shipping"] = shipping if shipping is not None else 0.0
    return best



# --- Estampado de jugador / prenda que no es la camiseta (agregado 2026-10-06) ---
# Esta pasada no tenia NINGUN filtro de estampado: el 10-05 se cayeron 19 de 103
# a mano y el 10-06 otros 20 de 106 (~19% las dos veces), siempre lo mismo
# -- "Vieira 4", "Arteta #8", "RONALDO 9", "#14 Chicharito", "MALDINI 3". El
# miner retro normal no las trae; este si, porque busca el MODELO de una ficha
# que ya existe y el vendedor le pone el nombre del jugador al titulo.
#
# Dos formas: "#N" suelto (un numero con almohadilla es practicamente siempre
# dorsal) y "<Palabra> N". La segunda necesita lista de parada o se come la
# marca y la talla: medido sobre los 106 titulos de esta noche, sin ella marca
# de mas "Lotto 23\" Pit to Pit" (medida en pulgadas) y "Football Shirt 1 Star"
# (la estrella del escudo). Con ella: 19 de 20 reales, 0 falsos positivos.
PRINT_STOPWORDS = {
    # marcas
    "lotto", "adidas", "nike", "puma", "umbro", "kappa", "castore", "joma",
    "macron", "hummel", "mizuno", "errea", "score", "draw", "diadora",
    "newbalance", "balance", "reebok", "charly", "mitre", "admiral",
    # palabras de catalogo / talle / medida
    "shirt", "jersey", "size", "sizes", "years", "year", "edition", "anniversary",
    "kit", "home", "away", "third", "season", "age", "chest", "pit", "width",
    "length", "boys", "girls", "men", "mens", "women", "womens", "small",
    "medium", "large", "vintage", "retro", "football", "soccer", "maglia",
    "camiseta", "maillot", "trikot", "top", "number", "sleeve", "cup", "world",
    "league", "serie", "liga", "rrp", "bnwt", "nwt", "new", "tags", "player",
    "version", "authentic", "replica", "star", "stars", "fc", "afc", "cf",
}
_NAME_NUM_RE = re.compile(r"\b([A-Za-z][A-Za-z'\-]{2,})\s+#?(\d{1,2})\b(?!\s*[\"\u2033])")
_HASH_NUM_RE = re.compile(r"#\s?\d{1,2}\b")
NOT_A_GARMENT_RE = re.compile(
    r"name\s*set|nameset|heat\s*(press|transfer)|\bonly\s+patch\b|\bbadge\s+only\b", re.I)


def has_player_print(title):
    """True si el titulo delata un dorsal/nombre estampado."""
    if _HASH_NUM_RE.search(title):
        return True
    for m in _NAME_NUM_RE.finditer(title):
        word = m.group(1).lower()
        if word in PRINT_STOPWORDS:
            continue
        # un ano suelto ("Shirt 2024 25") no es dorsal: group(2) ya limita a 2
        # digitos, pero "19" puede ser parte de "1997-98" partido por el regex
        if re.search(re.escape(m.group(0)) + r"\s*[/-]\s*\d", title):
            continue
        return True
    return False


def esc(s):
    return (s or "").replace("\\", "\\\\").replace('"', '\\"')


def apply(picks):
    """Inserta cada pick en SU ficha, por id. Por id y no por equipo|tipo:
    en retro decenas de fichas comparten equipo y tipo "retro", así que
    refresh.py las marcaría ambiguas y no tocaría ninguna."""
    content = open(PRODUCTS_TS, encoding="utf-8").read()
    head, blocks, tail = split_blocks(content)
    done = 0
    for i, b in enumerate(blocks):
        m = re.search(r'id: "([^"]+)"', b)
        if not m or m.group(1) not in picks or f'store: "{STORE}"' in b:
            continue
        d = picks[m.group(1)]
        # `picks` es el estado ACUMULADO de todas las corridas, y el filtro de
        # is_manually_excluded() solo corre al BUSCAR -- así que un pick cacheado
        # antes de que lo bloquearan volvía a insertarse en cada corrida, para
        # siempre (22 reaparecidos el 2026-10-05, todos WRONG_KIT/NOT_JERSEY de
        # pasadas anteriores). Revisar acá hace la lista negra retroactiva.
        if is_manually_excluded(d["link"]):
            continue
        sizes = ", ".join(f'"{s}"' for s in d["sizes"])
        line = (
            f'      {{ store: "{STORE}", price: {d["price"]}, shipping: {d["shipping"]}, '
            f'currency: "{d["currency"]}", url: "{esc(d["link"])}", title: "{esc(d["title"])}", '
            f'inStock: true, sizes: [{sizes}], imageUrl: "{esc(d["image"])}" }},\n'
        )
        new = re.sub(r"(    \],\n  \},\n?)$", line + r"\1", b)
        if new != b:
            blocks[i] = new
            done += 1
    open(PRODUCTS_TS, "w", encoding="utf-8").write(head + "".join(blocks) + tail)
    return done


def main(batch, do_apply):
    state = json.load(open(STATE)) if os.path.exists(STATE) else {"checked": [], "picks": {}}
    checked = set(state["checked"])
    content = open(PRODUCTS_TS, encoding="utf-8").read()
    todo = [t for t in retro_targets(content) if t["id"] not in checked]
    print(f"fichas retro con una sola tienda sin revisar: {len(todo)}", flush=True)

    client = EbayClient("EBAY_GB")
    names = get_team_en_names()
    teams, types = extract.team_re_all(), extract.type_re_all()
    nationals = national_teams()
    found = 0
    for n, t in enumerate(todo[:batch], 1):
        team_en = names.get(t["team"])
        if team_en:
            pick = search_model(client, t, team_en, teams, types, nationals)
            if client.rate_limited:
                print("eBay devolvió 429: se corta la tanda para no gastar la cuota de mañana", flush=True)
                break
            if pick:
                state["picks"][t["id"]] = pick
                found += 1
        checked.add(t["id"])
        if n % 50 == 0:
            print(f"  {n}/{min(batch, len(todo))} revisadas, {found} con modelo en eBay UK", flush=True)
            state["checked"] = sorted(checked)
            json.dump(state, open(STATE, "w"), ensure_ascii=False, indent=0)
        time.sleep(0.1)
    state["checked"] = sorted(checked)
    json.dump(state, open(STATE, "w"), ensure_ascii=False, indent=0)
    print(f"tanda: {found} fichas con el mismo modelo en eBay UK", flush=True)

    if do_apply:
        n = apply(state["picks"])
        print(f"insertadas en products.ts: {n}", flush=True)


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if a != "--apply"]
    main(int(args[0]) if args else 200, "--apply" in sys.argv)
