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
}
bad = [(t, f(t), want) for t, want in CASES.items() if f(t) != want]
assert not bad, bad
print(f"ok: {len(CASES)} casos")
