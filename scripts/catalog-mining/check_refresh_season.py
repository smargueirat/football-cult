#!/usr/bin/env python3
"""refresh.py no mete una oferta 26/27 en la ficha 25/26 (bug hallado el 2026-09-30)."""
import json, os, sys, tempfile
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from refresh import refresh

TS = '''const productsData = [
  {
    id: "ajax-home-202526",
    teamKey: "ajax",
    season: "2025/26",
    typeKey: "home",
    offers: [
      { store: "FootStoreES", price: 90.0, shipping: 0, currency: "EUR", url: "https://x/old", title: "Ajax 2025/26", inStock: true, sizes: ["M"], imageUrl: "i" },
    ],
  },
];
'''
d = tempfile.mkdtemp()
p, k = os.path.join(d, "p.ts"), os.path.join(d, "k.json")
open(p, "w").write(TS)
for title, expect in (("Camisa de local Ajax 2026/27", "https://x/old"), ("Camisa de local Ajax 2025/26", "https://x/new"),
                      ("Camisa de local Ajax", "https://x/new")):  # sin temporada: se actualiza como siempre
    json.dump({"ajax|home": {"title": title, "price": 80, "shipping": 0, "link": "https://x/new",
                             "image": "i", "sizes": ["M"]}}, open(k, "w"))
    assert expect in refresh(p, k, "FootStoreES", "EUR", dry_run=True), title
print("ok")
