from adidas_latam_feed import translate_row, boot_us

COLS = ["merchant_product_id", "merchant_category", "product_name", "description", "search_price", "custom_1",
        "colour", "Fashion:suitable_for", "Fashion:size", "product_price_old"]


def row(**kw):
    r = dict.fromkeys(COLS, "")
    r.update(kw)
    return r


# MX: color pegado al título, talla en el id, rebaja en custom_1, deporte en suitable_for.
r = translate_row(row(
    merchant_product_id="IV6097-0002_S", merchant_category="Jerseys/Hombre", search_price="2999.00", custom_1="1799.00",
    product_name="adidas Jersey Tigres Tercero Uanl 24/25 Blanco - Hombre", product_price_old="2999.00",
    description="Jersey Tigres Tercero Uanl 24/25 - Blanco en adidas.mx. Texto.", **{"Fashion:suitable_for": "Fútbol", "Fashion:size": "XYZ12"}))
assert r["search_price"] == "1799.00" and r["product_price_old"] == "2999.00"
assert r["merchant_category"] == "Camisetas de equipos/Hombre" and r["custom_1"] == "Adult" and r["colour"] == "Blanco"
assert r["product_name"] == ("adidas Jersey Tigres Tercero Uanl 24/25 Jersey Tigres Tercero Uanl 24/25 Hombre S"
                             " - Hombre Fútbol S"), r["product_name"]

# CO: sin color en el título, sexo y talla al final, mismo precio si custom_1 no es una rebaja.
r = translate_row(row(
    merchant_product_id="KA7790-0001_9-10 años", merchant_category="Camisetas de equipos/Niño", search_price="99950.00",
    custom_1="99950.00", product_name="adidas Camiseta Local Real Madrid 25/26 Niño 9-10 años", product_price_old="99950.00",
    description="adidas - Camiseta Local Real Madrid 25/26 - Blanco en adidas.co!", **{"Fashion:suitable_for": "Fútbol"}))
assert r["custom_1"] == "Kids" and r["search_price"] == "99950.00" and r["Fashion:size"] == "9-10 años"
assert r["product_name"].endswith("Real Madrid 25/26 Niño 9-10 años - Niño Fútbol 9-10 años"), r["product_name"]

# Fútbol americano no pasa por "fútbol"; las tallas MX de bota se pasan a US (+2 hombre/unisex, +3 mujer).
assert "Fútbol" not in translate_row(row(merchant_category="Jerseys/Hombre", product_name="adidas X - Hombre",
                                         **{"Fashion:suitable_for": "Fútbol Americano"}))["product_name"]
assert boot_us("MX 5", "Unisex") == "US 7" and boot_us("MX 2.5", "Mujer") == "US 5.5" and boot_us("MX 17", "Niño") == "MX 17"
print("ok")
