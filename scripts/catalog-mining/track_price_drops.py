#!/usr/bin/env python3
# Compara el precio de cada oferta (mismo store + misma url = mismo
# proveedor vendiendo la misma camiseta) contra el snapshot del día
# anterior. Si bajó, le agrega `previousPrice` a esa oferta puntual en
# products.ts -- eso es lo que la interfaz usa para el badge "bajó de
# precio", la sección de la home y el filtro. Si no bajó (o subió, o
# quedó igual), se asegura de que la oferta NO tenga previousPrice --
# el flag es "bajó desde ayer", no un historial que se acumula.
#
# Corre una vez por día como parte de daily_scan.sh, después de que
# todas las tiendas ya actualizaron sus precios reales -- así el
# snapshot de "hoy" que guarda al final ya refleja el catálogo del día,
# listo para ser el "ayer" de mañana.
import json
import os
import re

REPO_ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
PRODUCTS_TS = os.path.join(REPO_ROOT, "src", "data", "products.ts")
SNAPSHOT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "price_snapshot.json")

# Captura hasta el final de `url: "..."` -- el resto de la oferta
# (title, inStock, sizes, imageUrl, el `},` de cierre) queda afuera del
# match a propósito, así re.sub() no lo toca.
OFFER_RE = re.compile(
    r'\{ store: "([^"]*)", price: ([\d.]+), (?:previousPrice: [\d.]+, )?shipping: [\d.]+, currency: "([A-Z]{3})", url: "([^"]*)"'
)


def main():
    content = open(PRODUCTS_TS, encoding="utf-8").read()

    current = {}
    for m in OFFER_RE.finditer(content):
        _, price, currency, url = m.group(1), float(m.group(2)), m.group(3), m.group(4)
        current[url] = {"price": price, "currency": currency}

    previous = {}
    if os.path.exists(SNAPSHOT_PATH):
        previous = json.load(open(SNAPSHOT_PATH, encoding="utf-8"))

    # Recalcula desde cero: saca cualquier previousPrice que haya quedado
    # de una corrida anterior antes de decidir cuáles corresponden hoy.
    content = re.sub(r'previousPrice: [\d.]+, ', "", content)

    dropped = 0

    def inject(m):
        nonlocal dropped
        price_str, currency, url = m.group(2), m.group(3), m.group(4)
        old = previous.get(url)
        if old and old["currency"] == currency and old["price"] > float(price_str):
            dropped += 1
            return m.group(0).replace(
                f"price: {price_str},", f"price: {price_str}, previousPrice: {old['price']},", 1
            )
        return m.group(0)

    content = OFFER_RE.sub(inject, content)

    open(PRODUCTS_TS, "w", encoding="utf-8").write(content)
    json.dump(current, open(SNAPSHOT_PATH, "w", encoding="utf-8"), indent=1, sort_keys=True)
    print(f"{len(current)} offers in today's snapshot, {dropped} price drops flagged")


if __name__ == "__main__":
    main()
