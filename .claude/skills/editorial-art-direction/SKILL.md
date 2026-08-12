---
name: editorial-art-direction
description: Dirección de arte editorial/deportiva para Football Cult -- paleta, tipografía y badges.
---

# Editorial Art Direction

Dirección de arte específica de este proyecto, más concreta que la
guía general de `ui-craftsmanship`.

## Paleta

- Fondos: crema/marfil suave (el sitio ya usa `#f0e6d2`/`#fffdf8` --
  mantener esa familia, no reemplazar por blanco puro).
- Texto principal: carbón profundo (`#121212`-`#1a1a1a`), nunca negro
  puro ni gris genérico.
- Acentos: dorado/latón (`#C9A24B`, `#B8923F`, familia ya establecida
  en `.vintage-plaque`/`.vintage-banner`) -- sutiles, no saturados.

## Tipografía

- Títulos: fuente serif/condensada con carácter deportivo-editorial
  (el sitio ya usa Alfa Slab One para vintage y Cormorant Garamond
  para tagline/títulos de tarjeta -- mantener esa combinación, no
  volver a Inter para títulos).
- Cuerpo: sans-serif limpia (Inter, ya en uso) solo para texto de
  lectura, nunca para titulares.

## Badges por tipo de producto

Insignias cortas, en mayúsculas, que resuman el producto de un
vistazo -- derivadas de datos reales (`season`, `typeKey`, `ageGroup`,
si es retro), nunca texto libre:
- `[Temporada 25/26]` -- de `product.season`.
- `[Entrenamiento]` / tipo real -- de `product.typeKey` vía `typeNames`.
- `[Mujer]` / `[Niño/a]` -- de `getAgeGroup(product)`, solo cuando no
  es "men" (el default no lleva badge).
- `[Retro/Colección]` -- cuando `typeKey === "retro"`.
- `[Oferta Top]` -- cuando la oferta mostrada es la más barata
  disponible para el país del usuario (ya existe como criterio en
  `bestOfferForCountry`).

## Por qué

Esta guía existe para que el "toque editorial" no se convierta en una
paleta nueva por sección -- todo el sitio debe leerse como el mismo
archivo/vitrina, no como partes pegadas de proyectos distintos.
