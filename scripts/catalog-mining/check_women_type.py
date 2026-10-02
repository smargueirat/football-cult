#!/usr/bin/env python3
"""Chequeo de las dos reglas de clasificacion que se arreglaron el 2026-09-28.

1. "third" gana sobre "away"/"home": FansJerseyHub llama a la tercera
   equipacion "Third Away", y como away se evaluaba primero, 355 titulos de
   ese feed entraban al catalogo como suplente.
2. La pasada de mujer distingue el CORTE de mujer del EQUIPO femenino: la
   camiseta de hombre de una seleccion femenina no es una camiseta de mujer.

Se corre solo (`python3 check_women_type.py`) y desde daily_scan.sh.
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import extract

def tipo(title):
    return next((k for k, p in extract.type_re_all().items() if p.search(title)), None)

def mujer(title):
    if extract.WOMEN_EXCLUDE_RE.search(title):
        return False
    return bool(extract.WOMEN_SIGNAL_RE.search(title))

TIPOS = [
    ("Leeds United Third Away Soccer Jersey 2025/26", "third"),
    ("Arsenal Women's Third Away Soccer Jersey 2025/26", "third"),
    ("West Ham United Away Soccer Jersey 2025/26", "away"),
    ("Barcelona Home Soccer Jersey 2025/26", "home"),
    ("Camiseta tercera equipación Real Madrid", "third"),
    # goalkeeper sigue ganandole a todo, y training/prematch a home/away
    ("Maillot de gardien third Chelsea", "goalkeeper"),
    ("Camiseta de entrenamiento mujer PSG 2026/27", "training"),
    ("Maillot Prematch femme Angleterre", "prematch"),
    # FootStore/SportIsGood ES traducen el feed francés al pie de la letra:
    # Domicile -> Domicilio, Extérieur -> Visita/Externo/Fuera (2026-10-02)
    ("Camiseta de Visita Túnez Coupe du Monde 2026", "away"),
    ("Maillot Externo AFC Bournemouth 2026/27", "away"),
    ("Maillot Domicilio Atalanta 2025/26", "home"),
    ("Camiseta Fuera de Casa Argentina 2026", "away"),
    ("Camiseta de casa Liverpool 2025/26", "home"),
    ("Camisa de Fuera del Liverpool 2025/26", "away"),
    ("Castore England 25/26 Alternate Replica Shirt", "away"),
    ("Camiseta Domicilio de Portero PSG 2025/26", "goalkeeper"),
]

MUJER = [
    ("Barcelona Women's Home Soccer Jersey 2025/26", True),
    ("Maillot Domicile équipe féminine Bayern Munich 2026/27", True),
    ("Como 1907 Maglia Gara Home 2025/26 Donna", True),
    ("Camiseta primera equipación selección femenina España 25", True),
    # corte de hombre de un equipo femenino -> no es camiseta de mujer
    ("USWNT Men's Home Soccer Jersey 2025 White - Women's Team", False),
    ("Maillot Allemagne Extérieur (Équipe féminine) Homme Rouge", False),
    # otra prenda, no la camiseta estandar
    ("WMNS DFB Deutschland 26 Home Cropped Jersey", False),
    # ninos y retro tienen su propia dimension
    ("Barcelona Women's Home Soccer Jersey Kids 2025/26", False),
    ("Retro Nigeria Women's Away Football Jersey 1996", False),
    # una camiseta de hombre no tiene por que entrar a la pasada de mujer
    ("Barcelona Home Soccer Jersey 2025/26", False),
]

def main():
    fails = []
    for title, esperado in TIPOS:
        got = tipo(title)
        if got != esperado:
            fails.append(f"tipo: esperaba {esperado!r}, dio {got!r} -- {title}")
    for title, esperado in MUJER:
        got = mujer(title)
        if got != esperado:
            fails.append(f"mujer: esperaba {esperado}, dio {got} -- {title}")
    if fails:
        print("FALLA check_women_type:")
        for f in fails:
            print("  " + f)
        return 1
    print(f"check_women_type ok ({len(TIPOS)} tipos + {len(MUJER)} mujer)")
    return 0

if __name__ == "__main__":
    sys.exit(main())
