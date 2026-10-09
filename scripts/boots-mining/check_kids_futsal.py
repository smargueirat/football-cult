#!/usr/bin/env python3
"""Clasificación niño / sala del minado (2026-10-09) y que niño y adulto nunca se fundan."""
from mine_boots import blaz_boot_category, blaz_is_kids, classify, eu_size_from_futbolemotion_kids
from refresh_boots import merge_by_code

assert classify("Kakari Rugby boot") is None
assert classify("adidas Predator Crib") is None                      # patucos de bebé
assert classify("Nike Street Gato IC") == (False, True)
assert classify("adidas Predator Freak.3 IN") == (False, True)
assert classify("Mizuno Morelia Neo V Beta Made in Japan FG") == (False, False)  # "in" no es sala
assert classify("Hummel Top Star VC 2.0 I.C") == (False, True)
assert classify("Chaussures de futsal Mizuno Morelia Pro") == (False, True)
assert classify("Nike Phantom 6 Academy IC Niño") == (True, True)
assert classify("Bota de fútbol Predator League", kids=True) == (True, False)

assert blaz_boot_category("Football > Chaussures de football > Junior > Mixte")
assert blaz_boot_category("Football > Boutique du supporter > Chaussures de football > Adulte > Homme")
assert blaz_boot_category("Football/Chaussures de football/Adulte/Mixte")
assert blaz_boot_category("Football > Chaussures indoor > Adulte > Mixte")
assert not blaz_boot_category("Basketball > Chaussures indoor > Adulte > Homme")
assert blaz_is_kids("Football > Chaussures de football > Baby > Mixte")
assert not blaz_is_kids("Football > Chaussures de football > Adulte > Mixte")

assert eu_size_from_futbolemotion_kids("5,5Y") == "38"
assert eu_size_from_futbolemotion_kids("12 UK") == "30.5"
assert eu_size_from_futbolemotion_kids("33") == "33"
assert eu_size_from_futbolemotion_kids("10C") is None

adult = {"store": "FootStoreES", "eans": ["1"], "style": "X1"}
kid = {"store": "Pro:Direct ES", "eans": ["1"], "style": "X1", "ageGroup": "kids"}
assert len(merge_by_code([[adult], [kid]])) == 2
print("ok")
