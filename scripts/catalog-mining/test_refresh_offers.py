#!/usr/bin/env python3
"""Comprobación de refresh_offers.py con un feed y un catálogo de juguete.

Cubre: precio nuevo, talla vendida -> enlace a otra talla, producto ausente ->
inStock:false, y la guarda (feed truncado -> la tienda no se toca).
Uso: python3 scripts/catalog-mining/test_refresh_offers.py
"""
import os, shutil, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
tmp = tempfile.mkdtemp()
os.makedirs(f"{tmp}/repo/scripts/catalog-mining")
os.makedirs(f"{tmp}/repo/src/data")
os.makedirs(f"{tmp}/feeds")
for f in ("refresh_offers.py", "shopify_feed_to_csv.py"):
    shutil.copy(f"{HERE}/{f}", f"{tmp}/repo/scripts/catalog-mining/")

L = '      {{ store: "FootStoreES", price: {p}, shipping: 8.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p={id}&a=3013769&m=65912", title: "{t}", inStock: true, sizes: ["S", "M"], imageUrl: "x" }},'
products = "\n".join([
    "const productsData = [", "  {", '    id: "a",', "    offers: [",
    L.format(p=50.0, id=1, t="Camiseta A"),   # sigue, precio nuevo
    L.format(p=60.0, id=2, t="Camiseta B"),   # su talla se vendió, el producto sigue
    L.format(p=70.0, id=3, t="Camiseta C"),   # desapareció del feed
    "    ],", "  },", "];", ""])
open(f"{tmp}/repo/src/data/products.ts", "w").write(products)

HEAD = "aw_product_id,aw_deep_link,product_name,search_price,delivery_cost,parent_product_id,custom_1,merchant_deep_link\n"
def row(i, t, p, size, parent):
    return f"{i},https://www.awin1.com/pclick.php?p={i}&a=3013769&m=65912,{t},{p},8.99,{parent},{size},https://x/{parent}\n"
feed = HEAD + row(1, "Camiseta A", 45.0, "M", "PA") + row(11, "Camiseta A", 45.0, "L", "PA") + \
    row(21, "Camiseta B", 55.0, "XL", "PB") + "".join(row(100 + k, f"Otra {k}", 10, "M", f"P{k}") for k in range(100))
open(f"{tmp}/feeds/FOOTSTORE_ES.csv", "w").write(feed)

env = dict(os.environ, FEED_DIR=f"{tmp}/feeds")
run = lambda: subprocess.run([sys.executable, f"{tmp}/repo/scripts/catalog-mining/refresh_offers.py", "--apply", "--no-net"],
                             env=env, capture_output=True, text=True)
r = run()
out = open(f"{tmp}/repo/src/data/products.ts").read().split("\n")
a, b, c = out[4], out[5], out[6]
assert "price: 45.0" in a and 'sizes: ["M", "L"]' in a and "inStock: true" in a, (a, r.stdout, r.stderr)
assert "p=21&" in b and "price: 55.0" in b and 'sizes: ["XL"]' in b and "inStock: true" in b, b
assert "inStock: false" in c and "price: 70.0" in c, c

# Guarda: feed de hoy con <80 % de las filas de la última vez -> no se toca nada.
open(f"{tmp}/repo/src/data/products.ts", "w").write(products)
open(f"{tmp}/feeds/FOOTSTORE_ES.csv", "w").write(HEAD + "".join(row(100 + k, f"Otra {k}", 10, "M", f"P{k}") for k in range(60)))
r = run()
assert open(f"{tmp}/repo/src/data/products.ts").read() == products, r.stdout
assert "SALTADA: feed truncado" in r.stdout, r.stdout
shutil.rmtree(tmp)
print("OK refresh_offers: precio, talla vendida, ausente y guarda de feed truncado")
