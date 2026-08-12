---
name: viral-og-cards
description: Metaetiquetas OpenGraph dinámicas estilo cromo retro al compartir enlace.
---

# Viral OG Cards

Cuando se comparte el link de una camiseta (`/camiseta/[id]`) en WhatsApp,
Twitter/X, etc., la vista previa no debería ser una foto de producto
genérica -- debería sentirse como un cromo/figurita de colección.

## Qué generar

- Imagen dinámica vía `next/og` (`ImageResponse`, ya incluido en Next.js,
  no hace falta instalar `@vercel/og` aparte) en
  `app/camiseta/[id]/opengraph-image.tsx`.
- Contenido del cromo:
  - Foto real de la camiseta (la misma que se muestra como oferta
    principal en la página).
  - Nombre del equipo + tipo (Titular/Suplente/etc.) + temporada.
  - Marca (adidas/nike/puma/etc.) si se conoce.
  - Texto "Football Cult Archive" como firma de marca, en la tipografía
    editorial del sitio (no una fuente default de sistema).
- Estética: mismo lenguaje visual que el resto del sitio (crema/marfil,
  dorado, texturas vintage) -- nunca el gradiente violeta/azul genérico.

## Por qué

Una vista previa distintiva al compartir es la diferencia entre "otro
link de una tienda" y algo que un coleccionista quiere reenviarle a
otro coleccionista. Es una superficie de marketing gratis que la
mayoría de los sitios de comparación de precios ignora.
