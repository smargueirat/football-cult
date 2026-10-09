# GA4: marcar `click_offer` como evento clave (lo hace el dueño, 5 min)

Qué manda el sitio (src/lib/analytics.ts): evento `click_offer` con `store`, `link_url`,
`value` (= PRECIO de la oferta, no ingreso), `currency`, `commission_rate`, `est_commission`,
`product_id`, `position`, `is_best`, `jersey_version`. Desde 2026-10-09 lo mandan con
`product_id` también botas, equipamiento, entradas y las filas de "comparar" (antes solo
camisetas), y la barra fija de móvil de botas/equipamiento pasa por /go/ (antes iba directa a la
tienda: sin registro, sin sub-id y sin filtro de robots).

Solo lo envían visitantes que ACEPTARON la analítica (Consent Mode v2 básico).

## 1. Evento clave
1. analytics.google.com → propiedad de football-cult.com → **Administrar** (engranaje, abajo a la izquierda).
2. **Visualización de datos → Eventos clave → Nuevo evento clave**.
3. Nombre exacto: `click_offer` → **Guardar**.
   (Si `click_offer` ya aparece en **Visualización de datos → Eventos**, basta con pulsar la estrella "Marcar como evento clave" de su fila.)
4. En el evento clave → ⋮ → **Editar configuración**: método de recuento **Una vez por evento**.
   Ojo: el "valor" que sume GA4 será el precio de las ofertas clicadas, no lo que cobramos. Para el ingreso estimado, la métrica `est_commission` (paso 2).

## 2. Que los parámetros se vean en los informes
**Administrar → Visualización de datos → Definiciones personalizadas**:
- **Crear dimensión personalizada**, ámbito **Evento**, una por parámetro: `store` (Tienda), `product_id` (Ficha), `position` (Posición), `is_best` (Era la mejor), `jersey_version` (Versión).
- Pestaña **Métricas personalizadas → Crear**: parámetro `est_commission`, ámbito Evento, unidad **Moneda** (Comisión estimada).

No son retroactivas: cuentan desde el día en que se crean.

## 3. Comprobar
**Informes → Tiempo real**: abre una ficha en el móvil, acepta la analítica, pulsa "Ver oferta" → en ~1 min debe salir `click_offer` en "Recuento de eventos por nombre" y en "Eventos clave".

## ¿Medición sin consentimiento?
- **Consent Mode v2 "avanzado"** (cargar gtag antes de aceptar y mandar pings sin cookies): no se implementa. Los pings mandan a Google datos del dispositivo (IP, UA, página) sin consentimiento; las Directrices 2/2023 del CEPD sobre el art. 5.3 de ePrivacy tratan ese tipo de píxel como acceso al terminal que necesita consentimiento, y la exención de medición de audiencia (CNIL/AEPD) no cubre a Google Analytics. Además, el modelado de Google necesita un volumen que el sitio no tiene.
- **La medición sin consentimiento ya existe y es nuestra**: el registro de /go/ (servidor, sin cookies ni IP guardada). Con el filtro de robots, `python3 scripts/clicks_report.py` da clics de personas por día, sección, tienda, idioma y país. Esa es la cifra de referencia; GA4 queda como muestra de quienes aceptan.
- Las ventas por origen salen de los informes de cada red con el sub-id que añade /go/: Awin "Click Reference" (`clickref` = sección_idioma_país, `clickref2` = ficha, `clickref3` = ficha+posición), eBay EPN `customid`, TradeTracker `r`, Rakuten `u1`, Skimlinks `xcust`.
