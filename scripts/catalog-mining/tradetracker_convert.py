#!/usr/bin/env python3
"""Convierte un feed TradeTracker (';'-delimited, esquema propio) a un CSV
estandar (','-delimited) para que extract.py/pick.py/pick_no_size.py (que
asumen csv.DictReader por defecto, sin parametro de delimitador) lo lean
sin cambios -- mismo espiritu que rakuten_convert.py para el feed FTP de
Rakuten. No inventa columnas: solo re-escribe el delimitador.

Uso: python3 tradetracker_convert.py <in.csv ';'-delim> <out.csv ','-delim>
"""
import csv, sys

csv.field_size_limit(10**9)

def convert(src, dst):
    with open(src, newline="", encoding="utf-8", errors="replace") as f_in:
        rows = list(csv.DictReader(f_in, delimiter=";"))
    with open(dst, "w", newline="", encoding="utf-8") as f_out:
        w = csv.DictWriter(f_out, fieldnames=rows[0].keys())
        w.writeheader()
        w.writerows(rows)
    return len(rows)

if __name__ == "__main__":
    src, dst = sys.argv[1], sys.argv[2]
    n = convert(src, dst)
    print(f"{n} rows -> {dst}")
