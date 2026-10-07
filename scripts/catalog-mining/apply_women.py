#!/usr/bin/env python3
"""Inserta los picks de mujer de mine_women.py en products.ts.

Recorre las tiendas EN ORDEN: la primera que tiene un (equipo, tipo) crea la
ficha, las demas suman su oferta a esa misma ficha. El orden no es alfabetico
a proposito -- funda el que trae la temporada mas fiable en el titulo, porque
la temporada de la ficha sale de ahi (ver ORDEN abajo).

Por tienda hace lo mismo que hace el scan nocturno a mano para los ninos:
  split_picks(--women)  -> que es nuevo y que es oferta para una ficha que ya existe
  gen_kids_teams(women) -> bloques TS de los nuevos
  <insercion>           -> los mete en productsData
  refresh(--women)      -> suma/actualiza las ofertas de los que ya existen

Uso: python3 apply_women.py <out_dir de mine_women.py> [--apply]
"""
import json, os, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from refresh import split_blocks

HERE = os.path.dirname(os.path.abspath(__file__))
PRODUCTS_TS = os.path.join(HERE, "..", "..", "src", "data", "products.ts")

# FootStore ES/FR primero: son las que escriben la temporada completa
# ("2025/26", "Coupe du Monde 2026") en el titulo. FansJerseyHub va despues
# porque abrevia y usa nombres alternativos ("La Albiceleste", "El Tri"), que
# sirven como oferta pero no como nombre de la ficha.
ORDEN = ["FootStoreES", "FootStoreFR", "SportIsGoodES", "SportIsGoodFR",
         "AdidasES", "AdidasPT", "AdidasCL", "ForumSport", "PlanetFoot",
         "FansJerseyHub", "ComoFCShop", "BSTNIT", "BSTNUK", "DecathlonIE"]


def insertar(blocks_path):
    """Mete los bloques generados al final de productsData."""
    nuevos = open(blocks_path, encoding="utf-8").read()
    if not nuevos.strip():
        return 0
    content = open(PRODUCTS_TS, encoding="utf-8").read()
    head, blocks, tail = split_blocks(content)
    open(PRODUCTS_TS, "w", encoding="utf-8").write(head + "".join(blocks) + nuevos + tail)
    return nuevos.count('\n    id: "')


def main(out_dir, apply):
    manifest = {m["store"]: m for m in json.load(open(os.path.join(out_dir, "manifest.json")))}
    total_nuevos = total_ofertas = 0
    for store in ORDEN:
        m = manifest.get(store)
        if not m or not m["picks"]:
            continue
        picks = m["path"]
        cur = m["currency"]
        print(f"\n===== {store} ({m['picks']} picks, {cur}) =====")
        subprocess.run([sys.executable, "split_picks.py", picks, "--women"], cwd=HERE, check=True)
        new_path = picks.replace(".json", "_NEW.json")
        add_path = picks.replace(".json", "_ADD.json")

        if json.load(open(new_path)):
            blocks = picks.replace(".json", "_blocks.ts")
            subprocess.run([sys.executable, "gen_kids_teams.py", new_path, store, cur, blocks, "women"],
                           cwd=HERE, check=True)
            if apply:
                n = insertar(blocks)
                print(f"  insertadas {n} fichas nuevas en products.ts")
                total_nuevos += n
            else:
                print(f"  [seco] bloques generados en {blocks}, sin insertar")

        if json.load(open(add_path)):
            cmd = [sys.executable, "refresh.py", PRODUCTS_TS, add_path, store, cur, "", "--women"]
            if apply:
                cmd.append("--apply")
            r = subprocess.run(cmd, cwd=HERE, capture_output=True, text=True)
            print("  " + (r.stdout or r.stderr).strip().splitlines()[-1][:160])
            total_ofertas += 1
    print(f"\n{'APLICADO' if apply else 'SECO'}: {total_nuevos} fichas nuevas, "
          f"{total_ofertas} tiendas con ofertas sumadas")


if __name__ == "__main__":
    main(sys.argv[1], "--apply" in sys.argv)
