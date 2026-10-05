Rotación quincenal de las fotos del banner principal de football-cult.com (producción).

Contexto: el sitio se sirve desde ESTA PC (rama `main`, repo /home/piojo/football-cult). No hay
preview ni Vercel: lo que commitees en `main` lo publica el script que te llamó, al terminar.
Objetivo: que el banner de la home no muestre siempre las mismas fotos, sin bajar la calidad.

Dónde vive todo: `src/lib/sections.ts`. `HERO_PHOTOS` tiene una foto por slide, en el mismo orden
que `SECTION_PATHS` y que `heroSlides` en `src/lib/i18n/translations.ts`. Cada índice tiene además
su `SECTION_HERO_FIT`, `SECTION_HERO_POSITION` y `SECTION_HERO_TRANSFORM`: si cambiás una foto,
revisá y ajustá esos tres valores del MISMO índice. Leé completos los comentarios de ese archivo
y de `src/components/HeroCarousel.tsx` antes de tocar nada: documentan pedidos y rechazos reales
del dueño del sitio (por ejemplo, Liverpool reemplazado por Real Madrid porque la audiencia habla
español; Son Heung-Min rechazado; Messi y Bellingham rechazados en botas porque quedaban tapados
por el degradé del texto). Nunca vuelvas a poner una foto que esos comentarios dicen que se rechazó.

Reglas:
1. Cambiá como máximo 3 slides por corrida, y solo los de fotos de campaña (selecciones, clubes,
   retro, mujer, niños, botas, tickets). Los slides con foto de producto de estudio (guantes,
   pelotas, ropa, entrenamiento) se quedan, salvo que encuentres una foto de campaña real mejor.
2. Fuentes: SOLO fotos reales de prensa oficial, del mismo origen que las actuales
   (news.adidas.com / preview.thenewsmarket.com, ADID). Nada de bancos de imágenes, nada generado
   por IA, nada de renders inventados. La foto tiene que mostrar el producto real de esa categoría
   (retro = temporada 2006 o anterior, según isVintageRetro(); mujer = plantel o modelo femenino
   con la camiseta; niños = chico real con la camiseta infantil).
3. Composición panorámica con el sujeto corrido a un costado y aire alrededor. Una persona
   centrada en la foto original queda tapada por el degradé: descartala.
4. Verificación obligatoria por cada candidata: bajala y armá con sharp
   (/home/piojo/football-cult/node_modules/sharp) un compuesto con el degradé REAL del slide
   (copiá los linear-gradient de HeroCarousel.tsx) en las dos medidas reales del banner,
   1736x460 (escritorio) y 360x300 (celular), con el FIT/POSITION que vas a usar. Miralo con Read.
   Solo sirve si la camiseta/producto se ve bien fuera del degradé en las DOS medidas.
5. Preferí equipos de habla hispana o con mucha audiencia hispana (Real Madrid, Argentina, España,
   Boca, México, Colombia...) y que el resultado se vea distinto del anterior. No repitas ninguna
   URL que esté hoy en HERO_PHOTOS.
6. Si para un slide no encontrás una candidata que pase el punto 4, dejá ese slide como está. Es
   mejor no cambiar nada que poner una foto peor. Si no cambiás nada, no commitees.
7. Al cambiar una foto, actualizá su comentario con lo que muestra y la URL de la nota de prensa,
   en el mismo estilo que los existentes.

Al terminar: `npx tsc --noEmit` sin errores, y commit SOLO de los archivos que tocaste, por ruta
explícita (es un checkout compartido; nunca `git add -A` ni `git add .`). Mensaje:
`chore(hero): rotación quincenal de fotos del banner` + una línea por slide cambiado, y al final
una línea en blanco y `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. No hagas push y
no publiques: el script que te llamó publica si hay commit nuevo.

Tu última respuesta (va por mail al dueño): qué slides cambiaste, foto anterior → foto nueva con
su nota de prensa, y cuáles dejaste igual y por qué. En castellano rioplatense, corto.
