---
name: mobile-performance-vault
description: Rendimiento crítico y 60fps en dispositivos móviles.
---

# Mobile Performance Vault

La mayoría de los visitantes navegan desde el celular con conexiones
variables. El sitio no puede sentirse pesado ni saltar de layout
mientras carga.

## Reglas

- **Cero layout shift**: cada foto reserva su espacio (aspect-ratio o
  contenedor de tamaño fijo) antes de cargar -- nunca debería empujar
  contenido de abajo cuando termina de cargar.
- **Placeholder suave**: mientras carga, mostrar un estado de espera
  con la forma real del contenido (ver el skeleton con silueta de
  camiseta ya existente), no un blur genérico ni un spinner.
- **Imágenes responsive de verdad**: `srcSet`/`sizes` reales para que
  el celular no baje el mismo archivo que un monitor de escritorio
  (ver `lib/images.ts` -- ya se corrigió esto en el catálogo).
- **Interacciones a 60fps**: animar solo `transform`/`opacity`, nunca
  `width`/`height`/`top`/`left`. Nada de más de 300ms en
  micro-interacciones.
- **Respetar `prefers-reduced-motion`** en todo movimiento nuevo.

## Por qué

Un comparador de precios que tarda en mostrar el precio pierde la
venta -- la percepción de velocidad es parte de la confianza del sitio.
