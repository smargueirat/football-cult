#!/usr/bin/env python3
"""parse_retro_season no lee como temporada el año del nombre de un equipo."""
from retro_extract import parse_retro_season as f

CASES = {
    "Como 1907 Home Shirt 1998/99": "1998/99",
    "Como 1907 Coach Training Jersey": None,
    "TSV 1860 Munich Trikot 1995-96": "1995/96",
    "Salernitana 1919 maglia 1998": "1998",
    "Schalke 04 1997/98 home": "1997/98",
    "Bayer 04 Leverkusen 2002 home": "2002",
    "Juventus 1996/97 home": "1996/97",
    # temporadas escritas con espacios (antes salían como año suelto)
    "Adidas Glasgow Celtic FC 2024 / 2025 Away Soccer Jersey": "2024/25",
    "Puma Manchester City 2023 -24 Away Jersey": "2023/24",
    "NIKE INTER MILAN 2022 2023 PLAYER ISSUE HOME": "2022/23",
    "Messi 2022 - 30 goals shirt": "2022",
}
from split_picks import explicit_season
assert explicit_season("Real Madrid 2025 - 26 home") == "2025/26", explicit_season("Real Madrid 2025 - 26 home")
bad = [(t, f(t), want) for t, want in CASES.items() if f(t) != want]
assert not bad, bad
print(f"ok: {len(CASES)} casos")
