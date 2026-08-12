---
name: collector-discovery-loop
description: Retención y navegación en bucle basadas en atributos de la camiseta.
---

# Collector Discovery Loop

Toda página de detalle de producto es un callejón sin salida a menos
que ofrezca un camino de vuelta al catálogo basado en lo que el
usuario ya demostró que le interesa.

## Módulos al final de la vista de detalle

- **Mismo equipo**: otros productos (otra temporada, otro tipo) del
  mismo `teamKey`.
- **Misma marca**: otras camisetas del mismo fabricante (`brand`), si
  el dato existe para el producto actual.
- **Otras ofertas en tu talle**: productos distintos que tienen
  disponible el talle que el usuario seleccionó (o uno común si no
  seleccionó ninguno).

No agregar un módulo si no hay datos reales para poblarlo -- un
carrusel vacío o con resultados forzados es peor que no tenerlo.

## Por qué

El objetivo no es solo mostrar una camiseta, es que el usuario
encuentre la SIGUIENTE camiseta. Cada página de detalle debería
alimentar la siguiente sesión de navegación, no terminarla.
