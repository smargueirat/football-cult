---
name: motion-and-scroll
description: Animación y comportamiento de scroll intencionados, nunca decorativos por defecto.
---

# Motion & Scroll

Guía general de movimiento para el sitio -- complementa (no reemplaza)
la sección de animación de `ui-craftsmanship` y `mobile-performance-vault`.

## Reglas

- Toda animación debe expresar una relación causa-efecto (algo cambió
  de estado), no ser decoración pura.
- Duración: 150-300ms para micro-interacciones, hasta 400ms para
  transiciones más grandes (apertura de secciones, carruseles).
  `ease-out` al entrar, `ease-in` al salir.
- Reveals de scroll (si se usan) deben ser sutiles -- fade + pequeño
  translateY, nunca más de un elemento entrando a la vez en pantalla
  para no marear.
- `prefers-reduced-motion` siempre respetado (ya hay una regla global
  en `globals.css` que congela toda animación/transición cuando el
  usuario lo pide).
- Nunca animar `width`/`height`/`top`/`left` -- solo `transform` y
  `opacity`, para no generar layout thrashing.
- Un solo momento "orquestado" (ej. la carga inicial de la foto
  principal) vale más que efectos sueltos repartidos por toda la
  página.

## Por qué

El movimiento mal usado es la señal más rápida de "esto lo armó una
IA con un carrusel de plugins" -- con propósito, es lo opuesto: se
siente diseñado.
