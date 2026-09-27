#!/usr/bin/env python3
"""Comprobacion del registro de ids de equipamiento:

    python3 scripts/gear-mining/check_gear_ids.py

Cubre exactamente lo que nos rompio el 2026-09-27: Foot-Store mudo sus
fotos de CDN y empezo a mandar los colores en castellano en vez de frances
la misma noche, y como el id salia del texto del titulo, 5.912 URLs de
equipamiento murieron en 48 horas.

La regla que se verifica es una sola: si el producto es el mismo (misma
foto), la URL no se mueve, pase lo que pase con el texto.
"""
import copy
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from refresh_gear import build_entries, photo_keys  # noqa: E402


def product(model, colour, image, brand="Acerbis", store="FootStoreES"):
    return {
        "brand": brand,
        "model": model,
        "colour": colour,
        "offers": [{"store": store, "price": 10.0, "shipping": 0.0,
                    "currency": "EUR", "url": f"https://x/{model}",
                    "imageUrl": f"https://images2.productserve.com/?url=ssl%3A{image}&feedId=1",
                    "sizes": ["M"]}],
    }


BLAZ = "cdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fc%2Facerbis_0012185.030_0012185_030a.webp"
SPACE = "b2c.spacefoot.com%2Fmedia%2Fcatalog%2Fproduct%2Fa%2Fc%2Facerbis_0012185.030_0012185_030a.jpg"

failures = []


def check(label, got, want):
    if got != want:
        failures.append(f"{label}: se esperaba {want!r} y salio {got!r}")


# --- dia 1: el feed habla frances y sirve desde blazimg -------------------
registry = {}
dia1 = [product("Chaqueta de chandal Acerbis 4 Etoiles - Blanc", "Blanc", BLAZ)]
id1 = build_entries(dia1, set(), registry)[0]["id"]
check("dia 1 deberia salir del titulo", id1,
      "acerbis-chaqueta-de-chandal-acerbis-4-etoiles-blanc")

# --- dia 2: MISMO producto, otro CDN, otra extension, color en castellano -
dia2 = [product("Chaqueta de chandal Acerbis 4 Etoiles - Blanco", "Blanco", SPACE)]
id2 = build_entries(dia2, set(), registry)[0]["id"]
check("dia 2 tiene que conservar la URL del dia 1", id2, id1)

# --- dia 3: el proveedor reescribe el nombre entero -----------------------
dia3 = [product("Veste de survetement Acerbis Quatre Etoiles - Blanc", "Blanc", SPACE)]
check("dia 3 tampoco puede mover la URL",
      build_entries(dia3, set(), registry)[0]["id"], id1)

# --- un producto DISTINTO (otra foto) tiene que recibir su propio id ------
otro = [product("Chaqueta de chandal Acerbis 4 Etoiles - Rojo", "Rojo",
                "b2c.spacefoot.com%2Fx%2Facerbis_0012185.041_0012185_041a.jpg")]
id_otro = build_entries(otro, set(), registry)[0]["id"]
if id_otro == id1:
    failures.append("dos productos distintos terminaron en la misma URL")

# --- dos productos en la MISMA corrida no pueden compartir URL ------------
# (el registro apunta a la misma foto, pero un id ya usado no se reparte)
juntos = [product("Chaqueta A", "Blanco", SPACE), product("Chaqueta B", "Blanco", SPACE)]
ids = [e["id"] for e in build_entries(juntos, set(), registry)]
if len(set(ids)) != 2:
    failures.append(f"dos fichas de la misma corrida comparten URL: {ids}")

# --- una foto sin nombre util no ancla nada, pero no revienta -------------
sin_foto = [product("Bolsa para 18 pelotas Erima", "Negro", "cdn.x%2Fa%2F1.jpg")]
check("una foto con nombre corto no se usa como ancla",
      photo_keys(sin_foto[0]), set())
build_entries(sin_foto, set(), registry)  # no debe lanzar

if failures:
    print("FALLA la comprobacion de ids de equipamiento:")
    for f in failures:
        print("  -", f)
    raise SystemExit(1)
print("OK: la URL de equipamiento sobrevive a cambios de CDN, de idioma y "
      "de titulo; productos distintos no colisionan.")
