---
name: ui-craftsmanship
description: Guía de estilo y diseño para evitar patrones genéricos de IA y construir interfaces con acabado profesional, editorial y de alta calidad.
---

# UI Craftsmanship & Anti-AI Design Standards

## 1. Tipografía y Jerarquía Visual
- **Evitar la monotonía:** No usar Inter o Arial para todo. Combinar una tipografía con personalidad para encabezados/números (ej. condensada o deportiva) con una sans-serif limpia para cuerpo de texto.
- **Micro-copy auténtico:** Prohibido usar textos genéricos estilo "Descubre la mejor experiencia", "Explora nuestro universo" o "Soluciones integrales". Utilizar jerga futbolera/coleccionista auténtica (ej. *"Joyas de catálogo"*, *"Temporada '98"*, *"Edición de utilería"*).

## 2. Color, Sombras y Texturas
- **Sin gradientes AI:** Evitar el típico degradado violeta/azul/rosa genérico.
- **Paleta con carácter:** Usar un fondo de alto contraste pero suave para la vista (ej. no `#000000` puro, sino tonos carbón o crema según la estética retro/deportiva).
- **Sombras con intención:** En lugar de `shadow-lg` estándar que ensucia el diseño, preferir bordes sutiles de 1px (`border border-white/10` o `border-zinc-200`) y sombras muy difuminadas y de baja opacidad.

## 3. Microinteracciones y Sensación Táctil
- **Feedback inmediato:** Cada botón, favorito o tarjeta debe responder al hover/tap con animaciones rápidas (150ms-200ms) usando curvas bézier naturales (`ease-out`).
- **Estados vacíos y de carga (Skeletons):** En lugar de spinners genéricos, diseñar esqueletos de carga que imiten la forma exacta de las camisetas o estados vacíos con personalidad.

## 4. Layouts Orgánicos (Romper la rigidez)
- Evitar que todas las tarjetas se vean exactamente iguales de punta a punta.
- Introducir variaciones de tamaño en el grid para destacar "Camisetas de la semana" o "Piezas históricas" (layout tipo revista o bento-grid sutil).
