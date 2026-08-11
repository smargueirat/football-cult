---
name: football-cult
description: Directrices de layout visual, imágenes, optimización SEO/Performance y flujo Git/Vercel para Football Cult (www.football-cult.com).
---

# Football Cult - Project Standards & Skill

## 1. Criterios para Imágenes y Layout Visual
- **Diseño Mobile-First:** El layout debe priorizar la experiencia móvil (grid de 2 columnas en teléfonos, 4 en escritorio).
- **Tratamiento de Imágenes:**
  - Garantizar relación de aspecto uniforme (4:5 o 1:1) para que las camisetas no se distorsionen.
  - Priorizar fondos limpios/neutros que destaquen la prenda sin distracciones.
- **Tarjetas de Producto:**
  - Badges o insignias visuales claras para Año/Temporada, Marca y Estado.
  - Contraste alto tanto en Modo Oscuro como en Modo Claro.

## 2. Optimización SEO y Performance
- **Carga de Imágenes:** Implementar carga diferida (`lazy loading`) y formatos optimizados (WebP/AVIF) para evitar cargas lentas en datos móviles.
- **Estructura SEO:**
  - URLs amigables y legibles para cada producto o sección.
  - Metaetiquetas (Open Graph / Twitter Cards) configuradas para que al compartir un producto en redes sociales se muestre la imagen de la camiseta correctamente.

## 3. Flujo de Trabajo Git & Vercel (CI/CD)
- **Mapeo de Aliases:**
  - Al renombrar o fusionar IDs de producto, actualizar `productAliases.ts` y documentarlo en el commit.
  - Si un producto se elimina por no ser oficial/válido, NO mapear a ID nuevo (debe limpiarse de favoritos).
- **Verificaciones Pre-Deploy:**
  1. Ejecutar verificación de tipos de TypeScript (`npx tsc --noEmit`).
  2. Verificar que el build pase localmente sin errores.
  3. Convención de commits clara (`feat:`, `fix:`, `refactor:`, `alias:`).
