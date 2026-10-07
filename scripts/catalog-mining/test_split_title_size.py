from extract import split_title_size as s
assert s("adidas Camiseta Local X 26 Camiseta Local X 26 Hombre 2XL - Hombre Fútbol 2XL") == ("Camiseta Local X 26", "2XL")
assert s("adidas Camiseta Local X 26 Niños Camiseta Local X 26 Niños Niño 9-10 años - Niño Fútbol 9-10 años") == ("Camiseta Local X 26 Niños", "9-10")
assert s("Camiseta Y Unisex M -  Fútbol M") == ("Camiseta Y", "M")
assert s("Jersey 2025/26 - S") == ("Jersey 2025/26", "S")  # formato previo intacto
print("ok")
