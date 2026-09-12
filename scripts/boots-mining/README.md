# Boots mining scripts

Keeps `src/data/boots.ts` prices/tallas/fotos actualizados contra los
feeds Awin/Google-Shopping ya aprobados que tienen botas reales: adidas
ES, Sport is Good ES/FR, Foot-Store ES/FR, Decathlon Irlanda, Deporte
Outlet, Pro Soccer (USD), más FutbolEmotion (TradeTracker) desde un
snapshot manual. Reusa el mismo cache de feeds (`/tmp/feeds/*.csv`) que
el scan diario de camisetas ya descarga -- no hace su propia descarga.

Los 71 modelos "legacy" (cruzados por nombre entre FutbolEmotion y Forum
Sport, comparación de precio real entre 2 tiendas de un mismo modelo)
viven aparte, en `legacyBootProducts` dentro de `boots.ts`, y este
pipeline nunca los toca. Lo mismo para `browserMinedBootProducts`
(Nike CL, Nike AR, Puma AR) -- ver la sección dedicada más abajo.

## Monedas reales por tienda

Todas las tiendas ES/IE/FR cobran en EUR. Pro Soccer cobra en USD (su
storefront real, no un EUR fabricado). Nike CL cobra en CLP, Nike AR y
Puma AR en ARS. `BootCurrency`/`BOOT_CURRENCY_TO_EUR` en `boots.ts`
siguen el mismo patrón que `products.ts` ya usa para camisetas: el
precio real de cada oferta se muestra tal cual en su moneda nativa
(nunca convertido), la tasa a EUR es solo un número interno para poder
comparar/ordenar "más barata" entre monedas distintas.

## FutbolEmotion: snapshot manual, no feed automático

FutbolEmotion (TradeTracker) no tiene una URL de feed bulk descargable
por HTTP como el resto -- `mine_futbolemotion()` lee un CSV puntual
(`FUTBOLEMOTION_FEED_PATH`, default `/tmp/feeds/futbolemotion_feed.csv`).
Si ese archivo no está, la función lo salta con un aviso en vez de
romper el resto del pipeline -- el catálogo simplemente sale sin esas
~315 botas ese día. Refrescar el snapshot (bajarlo de nuevo del panel
de TradeTracker) es manual; no hay automatización todavía.

## Nike CL / Nike AR / Puma AR: minadas a mano, sin auto-refresh

Estas 3 tiendas (aprobadas vía Soicos) están detrás de Cloudflare, que
bloquea el fetch headless que usa el resto del pipeline -- pero no a un
visitante real, así que los links funcionan igual en el sitio. Se
minaron a mano vía una sesión real de Chrome (`claude-in-chrome`),
navegando cada página de catálogo y transcribiendo nombre/precio/
terreno/imagen reales. Viven en `browserMinedBootProducts` dentro de
`boots.ts`, arriba del marcador `AUTO-GENERATED`, para que
`refresh_boots.py` nunca las toque.

**Limitación real, a propósito no resuelta**: son una muestra
verificada (65 productos: 18 Nike CL, 31 Nike AR, 16 Puma AR tras
deduplicar variantes del mismo modelo al precio más barato), no el
catálogo completo de cada tienda (~111/87/88 respectivamente) -- el
costo de transcribir cada página a mano, mensaje por mensaje, hizo que
extender la cobertura no valiera la pena frente a otras prioridades.
No se auto-refrescan a diario (sin feed CSV/XML que un script pueda
leer) -- para actualizar precios/agregar más modelos hay que repetir el
mismo proceso manual.

## Uso diario (automatizado)

```bash
python3 scripts/boots-mining/refresh_boots.py
```

Hace todo de una: mina los feeds, reconstruye `boots.ts`, reclasifica
Tier/Horma, y extrae color dominante real de fotos nuevas. Pensado para
correr todas las noches junto al scan de camisetas (ver
`scripts/daily_scan.sh`) -- sin esto, los precios de botas quedaban
congelados en lo último que se minó a mano.

Cómo funciona (por qué es seguro correrlo todas las noches sin romper
nada):

- **Ids deterministas**: cada oferta minada tiene un id
  `slugify(tienda-marca-modelo-terreno)`. Mientras la tienda siga
  vendiendo el mismo producto, el id no cambia de un día al otro -- así
  que "reconstruir todo de cero" es, en la práctica, un update in-place
  (mismo id → precio/talles/foto de hoy). Confirmado con una corrida
  real: sin cambios reales en el feed, el archivo sale byte-idéntico.
- **Nunca pisa lo de arriba del marcador**: `boots.ts` tiene una línea
  literal `// ===AUTO-GENERATED-BOOTS-BELOW===` -- todo lo de ARRIBA
  (tipos, comentario de historia, `legacyBootProducts`) se lee del
  archivo TAL COMO ESTÁ hoy y se deja intacto; todo lo de ABAJO se
  reconstruye entero. (Antes, durante el desarrollo de este pipeline a
  mano, hubo un bug real por usar una copia estática vieja del header en
  vez de releerlo del archivo actual -- este marcador existe
  justamente para que un script automatizado no pueda repetir ese
  error.)
- **Extracción de color incremental**: `extract_boot_colors.mjs` sólo
  descarga/analiza la foto real de un id si no está ya en
  `bootDominantColors.json` de una corrida anterior -- una corrida
  nocturna sin productos nuevos no vuelve a pegarle a la red por 1600+
  fotos.
- **Tier/Horma se recalcula entero** cada vez (barato: solo texto, sin
  red) usando las reglas reales transcriptas de la planilla de
  referencia del usuario (`Comparativa_Gamas_Botines_Futbol`, pestaña
  "Matriz de Concordancia") -- ver `refresh_boots.py` para la tabla
  completa por marca.

Al final imprime un resumen: productos nuevos, productos que
desaparecieron del feed de hoy, y cuántos precios existentes cambiaron
de verdad.

## Limitación conocida: sin `inStock`

`BootOffer` no tiene un campo de stock (a diferencia de `Offer`,
camisetas). Si una tienda saca un producto del feed (agotado,
discontinuado, error puntual), sale del catálogo ese mismo día en vez
de marcarse "agotado" -- si vuelve a aparecer al día siguiente, vuelve
solo (mismo id determinista). Aceptado a propósito en vez de sumar un
campo y UI nuevos sólo para esto; si se vuelve un problema real, ahí sí
vale la pena.

## Archivos

- `mine_boots.py` — extrae del feed cache, aplica las reglas de
  exclusión reales (rugby, fútbol americano, sala/futsal/indoor
  incluyendo el código de suela "IC"/"IN", ver comentarios en el propio
  archivo para la historia de las pasadas que hizo falta). Una función
  por tienda/esquema: `mine_adidas_es`, `mine_sportisgood_awin`,
  `mine_footstore_awin`, `mine_decathlon_ie` (esquema Awin clásico),
  `mine_google_shopping_fr` (Foot-Store FR/Sport is Good FR, esquema
  Google Shopping), `mine_deporte_outlet`, `mine_prosoccer` (USD),
  `mine_futbolemotion` (TradeTracker, ver snapshot manual arriba).
- `refresh_boots.py` — orquesta todo el pipeline de arriba, es el único
  comando que hay que correr.
- `extract_boot_colors.mjs` — mismo pipeline de análisis de píxel real
  que `scripts/catalog-mining/extract_dominant_colors.mjs`, adaptado
  para leer `{id, imageUrl}` en vez de reparsear TypeScript.
