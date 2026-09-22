// Limpieza de PRESENTACIÓN de títulos de oferta -- nunca toca el título
// real guardado (offer.title), que sigue siendo la fuente de verdad para
// búsqueda/SEO/datos estructurados (ver feedback_realname_primary.md).
// Archivo chico aparte por el mismo motivo que offerMoney.ts: evitar que
// un componente cliente arrastre el catálogo entero al bundle.

// Palabras que describen "es una camiseta de fútbol" en distintas
// variantes regionales de inglés/español -- cuando aparece MÁS DE UNA
// (ej. "FOOTBALL ... SOCCER" o "Camiseta ... Camiseta" tras traducir el
// vocabulario) se conserva solo la primera aparición. Nunca toca una
// palabra que aparece una sola vez, ni talla/temporada/marca.
const NOISE_GROUPS: RegExp[] = [
  /\b(football|soccer)\b/gi,
  /\b(jersey|shirt|camiseta|camisa|maillot|maglia|trikot)\b/gi,
];

function dedupeGroup(title: string, pattern: RegExp): string {
  let seen = false;
  return title.replace(pattern, (match) => {
    if (seen) return "";
    seen = true;
    return match;
  });
}

// Por PALABRA, no por título entero -- un título ya traducido por
// translateTitleVocabulary mezcla vocabulario recién traducido ("Titular",
// "Camiseta") con el resto del título real tal cual vino de la tienda
// (a veces todo en mayúscula, "WEST HAM UNITED ... UMBRO"), así que
// exigir que el título ENTERO esté en mayúscula para "arreglarlo" dejaba
// pasar justo esas palabras -- que es la mitad del título real.
function isShoutyWord(word: string): boolean {
  // Tallas/temporadas con dígitos (2XL, 23/24, #6) y abreviaturas cortas
  // (FC, NWT, XXL, L) se dejan como están -- pasarlas por título-case las
  // rompe ("FC" -> "Fc", "XXL" -> "Xxl").
  if (/\d/.test(word) || word.length <= 3) return false;
  return /[A-ZÀ-ÖØ-Þ]/.test(word) && !/[a-zà-öø-þ]/.test(word);
}

function titleCaseWord(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function cleanDisplayTitle(title: string): string {
  let result = title
    .split(" ")
    .map((w) => (w && isShoutyWord(w) ? titleCaseWord(w) : w))
    .join(" ");

  for (const pattern of NOISE_GROUPS) {
    result = dedupeGroup(result, pattern);
  }

  return result.replace(/\s{2,}/g, " ").trim();
}
