#!/usr/bin/env python3
"""Sacar del catálogo cualquier OFERTA sin foto real (pedido explícito del
usuario: "si no los tienen sacarlos. Es raro que una publicación no tenga
al menos una foto"). Si un producto queda con offers: [] después de eso,
se saca el producto entero.

Cubre todo catálogo cuyo Offer tiene imageUrl POR OFERTA: boots.ts,
products.ts, apparel.ts, balls.ts, gloves.ts. tickets.ts queda afuera a
propósito -- TicketOffer no tiene imageUrl (la foto vive en el evento/
producto, no por oferta), forma distinta, este chequeo no aplica ahí.

"Sin foto real" = falta el campo imageUrl, o está vacío/en blanco. No se
resuelven placeholders conocidos por hash (eso ya lo hace
drop_dead_images() en refresh_boots.py con una descarga real) -- acá solo
texto, sin red, pensado para poder correr seguido.

Uso:
  python3 scripts/fix_missing_offer_images.py            (dry run, solo reporta)
  python3 scripts/fix_missing_offer_images.py --apply    (escribe los archivos)
"""
import re, sys, os

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

FILES = [
    "src/data/boots.ts",
    "src/data/products.ts",
    "src/data/apparel.ts",
    "src/data/balls.ts",
    "src/data/gloves.ts",
]

# Una línea propia "const NAME[: Type[]] = [" -- todo catálogo auto-generado
# de este repo arranca cada bloque así (ver write_boots_ts/write_ts/etc en
# los scripts de mining), un solo array literal por bloque.
CONST_RE = re.compile(r'^(?:export )?const \w+(?:\s*:\s*[\w.]+\[\])?\s*=\s*\[\s*$', re.M)


def split_top_level(body):
    """Divide el texto de un array (ENTRE su '[' y su '];') en objetos
    top-level '{...}', contando solo profundidad de llaves -- los
    corchetes anidados (ej. sizes: ["S","M"]) no la alteran. Devuelve
    (bloques, cola) donde cada bloque incluye su espacio/indentación
    inicial (para no perder formato al reconstruir) y `cola` es lo que
    queda después del último bloque (normalmente solo un salto de línea)."""
    blocks = []
    depth = 0
    open_idx = None
    prev_end = 0
    i = 0
    while i < len(body):
        ch = body[i]
        if ch == '{':
            if depth == 0:
                open_idx = i
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0 and open_idx is not None:
                j = i + 1
                while j < len(body) and body[j] in ',\n':
                    j += 1
                blocks.append(body[prev_end:j])
                prev_end = j
                open_idx = None
        i += 1
    return blocks, body[prev_end:]


def find_matching_bracket(text, open_idx):
    depth = 0
    for i in range(open_idx, len(text)):
        if text[i] == '[':
            depth += 1
        elif text[i] == ']':
            depth -= 1
            if depth == 0:
                return i
    raise ValueError("corchetes desbalanceados")


def offer_has_image(offer_text):
    m = re.search(r'imageUrl:\s*"((?:[^"\\]|\\.)*)"', offer_text)
    return bool(m and m.group(1).strip())


def clean_product(product_text):
    """(texto_nuevo_o_None, ofertas_sacadas). None = sacar el producto
    entero (quedó sin ofertas)."""
    m = re.search(r'offers:\s*\[', product_text)
    if not m:
        return product_text, 0
    open_idx = product_text.index('[', m.start())
    close_idx = find_matching_bracket(product_text, open_idx)
    offers_body = product_text[open_idx + 1:close_idx]
    offers, tail = split_top_level(offers_body)
    kept = [o for o in offers if offer_has_image(o)]
    removed = len(offers) - len(kept)
    if removed == 0:
        return product_text, 0
    if not kept:
        return None, removed
    new_body = "".join(kept) + tail
    new_product = product_text[:open_idx + 1] + new_body + product_text[close_idx:]
    return new_product, removed


def process_file(path, apply):
    full_path = os.path.join(REPO_ROOT, path)
    content = open(full_path, encoding='utf-8').read()
    offers_removed = 0
    products_removed = 0
    # de atrás para adelante: reemplazar un bloque no corre los offsets de
    # los bloques anteriores en `content`.
    for m in reversed(list(CONST_RE.finditer(content))):
        body_start = m.end()
        close_idx = content.index('\n];', body_start)
        body = content[body_start:close_idx]
        blocks, tail = split_top_level(body)
        new_blocks = []
        for b in blocks:
            new_b, removed = clean_product(b)
            offers_removed += removed
            if new_b is None:
                products_removed += 1
                continue
            new_blocks.append(new_b)
        new_body = "".join(new_blocks) + tail
        content = content[:body_start] + new_body + content[close_idx:]
    if apply and (offers_removed or products_removed):
        open(full_path, 'w', encoding='utf-8').write(content)
    return offers_removed, products_removed


if __name__ == "__main__":
    apply = "--apply" in sys.argv
    total_offers = 0
    total_products = 0
    for f in FILES:
        o, p = process_file(f, apply)
        total_offers += o
        total_products += p
        print(f"{f}: {o} ofertas sacadas, {p} productos sacados (quedaron sin ofertas)")
    print(f"TOTAL: {total_offers} ofertas, {total_products} productos")
    if not apply:
        print("(dry run -- correr con --apply para escribir los archivos)")
