#!/usr/bin/env python3
"""club_listing_for_national: camisetas de club que nombran al país no entran en la selección."""
from extract import club_listing_for_national, team_re_all

teams = team_re_all()
CLUB = [("escocia", "RANGERS SCOTLAND 2021/2022 THIRD FOOTBALL SHIRT CASTORE SIZE L ADULT"),
        ("jordania", "Air Jordan x PSG 2020 Away Soccer Jersey Men's Size Medium AJ5552-613"),
        ("alemania", "FC Nurnberg 2023/2024 Germany Third Soccer Jersey Size M"),
        ("ucrania", "FC SHAKHTAR UKRAINE THIRD FOOTBALL JERSEY 2025/2026 NEW WITH TAG SIZE XL")]
NATIONAL = [("escocia", "Scotland 2021/22 Away Shirt adidas"),
            ("croacia", "Mundial 2022 Nike Croacia Luka Modric Home Jersey M camiseta real madrid kit"),
            ("italia", "Maglia calcio Italia 2024 Home Adidas uomo blu FIGC"),
            ("rangers", "RANGERS SCOTLAND 2021/2022 THIRD FOOTBALL SHIRT")]  # ficha de club: nunca se filtra
bad = [t for k, t in CLUB if not club_listing_for_national(t, k, teams)] + \
      [t for k, t in NATIONAL if club_listing_for_national(t, k, teams)]
assert not bad, bad
print("ok")
