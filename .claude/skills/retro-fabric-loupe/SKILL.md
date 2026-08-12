---
name: retro-fabric-loupe
description: "DESCARTADA -- implementada y luego sacada por pedido explícito, no reimplementar sin que se pida de nuevo."
---

# Retro Fabric Loupe (descartada)

Se implementó en `JerseyGallery.tsx` (hover en desktop, touch en mobile)
y se sacó por completo a pedido explícito del usuario: "lo de la lupa lo
sacamos, queda raro". No reimplementar esta feature en futuras sesiones
sin que se pida otra vez -- el resto de esta skill queda documentado
abajo solo como referencia histórica de qué se probó y por qué no
funcionó en la práctica (probablemente el zoom se veía tosco por la
resolución real de las fotos de origen, que varía mucho según tienda).

## Comportamiento (como se implementó, ya no vigente)

Un coleccionista de camisetas mira de cerca la tela, el escudo bordado
y la etiqueta antes de decidir -- la foto de producto sola no alcanza.

## Comportamiento

- **Desktop**: hover sobre la foto principal activa una lupa que sigue
  el cursor, mostrando esa zona ampliada.
- **Mobile**: mantener presionado (o arrastrar) sobre la foto activa el
  mismo efecto de zoom localizado.
- La calidad del zoom depende de la resolución real de la foto de
  origen (varía según la tienda) -- en fotos chicas el resultado será
  más suave que nítido, y es un trade-off aceptado, no un bug.

## Por qué

Es la diferencia entre "ver una foto" y "inspeccionar la prenda" --
refuerza la idea de casa de coleccionistas por sobre la de tienda
genérica.
