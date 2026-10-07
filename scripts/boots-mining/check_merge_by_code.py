#!/usr/bin/env python3
"""merge_by_code funde por EAN o código de fabricante y nunca junta dos ofertas de la misma tienda."""
from refresh_boots import merge_by_code

a = {"store": "FootStoreES", "eans": ["1", "2"]}
b = {"store": "FootStoreFR", "eans": ["1"]}
c = {"store": "Pro:Direct ES", "eans": ["2", "9"]}
d = {"store": "Pro:Direct ES", "eans": ["1"]}   # misma tienda que c: queda aparte
e = {"store": "AdidasES", "eans": ["7"]}         # sin EAN en común: queda aparte
f = {"store": "SportIsGoodES", "eans": ["5"], "style": "fj2586-002"}
g = {"store": "Pro:Direct ES", "eans": ["6"], "style": "FJ2586-002"}  # mismo estilo, otros talles
h = {"store": "AdidasES", "eans": ["8"], "style": "IH7154"}
i = {"store": "AdidasCL", "eans": ["9"], "style": "ih7154"}   # mismo estilo adidas ES/CL, otros EAN
assert [[x["store"] for x in g] for g in merge_by_code([[h], [i]])] == [["AdidasES", "AdidasCL"]]
got = [[x["store"] for x in grp] for grp in merge_by_code([[a, b], [c], [d], [e], [f], [g]])]
assert got == [["FootStoreES", "FootStoreFR", "Pro:Direct ES"], ["Pro:Direct ES"], ["AdidasES"],
               ["SportIsGoodES", "Pro:Direct ES"]], got
print("ok")
