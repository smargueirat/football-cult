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

// Ruido de VENDEDOR, no nombre de producto. El título real de la tienda
// sigue siendo la fuente de verdad y no se reemplaza nunca por uno armado
// por nosotros (feedback_realname_primary.md) -- esto solo le saca los
// trozos que no nombran nada: jerga de estado de eBay, promesas de envío y
// afirmaciones de autenticidad que además no podemos verificar.
//
// Medido sobre los 11.051 títulos del catálogo (2026-09-28): 1.341 traen
// BNIB/BNWT/NWT, 206 "new with tags", 54 "100% original/authentic" y 3 una
// promesa de envío. La jerga de eBay es, de lejos, la que más pesa.
//
// Deliberadamente NO se toca:
//   - "New" suelto (1.008 títulos): es parte de nombres reales -- New York
//     City FC, New Balance.
//   - La talla ("Size M", "S-2XL", 85 títulos): en un listado suelto de
//     eBay puede ser el único ejemplar que existe, así que sacarla puede
//     quitar información de verdad. La ficha ya muestra las tallas aparte.
const SELLER_NOISE: RegExp[] = [
  /\b(bnib|bnwt|bnwot|nwot|nwt)\b/gi,
  /\bbrand\s+new\s+(?:with\s+|w\/\s*)?tags?(?:\s+on)?\b/gi,
  /\bnew\s+with\s+tags?\b/gi,
  /\bwith\s+tags\s+on\b/gi,
  /\bcon\s+etiquetas\b/gi,
  /\b(?:fast|free|quick|express)\s+(?:domestic\s+)?shipping\b!*/gi,
  /\benv[ií]o\s+gratis\b/gi,
  /\b100\s*%\s*(?:original|authentic|genuine)\b/gi,
];

// Sacar un trozo del medio deja separadores huérfanos ("Jersey - - Qatar",
// "Shirt |", "Camiseta ,"). Esto los recompone en vez de dejar el título
// peor de lo que estaba.
function tidySeparators(title: string): string {
  return title
    .replace(/\s{2,}/g, " ")
    .replace(/\s*([-–|,/])\s*(?:\1\s*)+/g, " $1 ")
    .replace(/\(\s*\)|\[\s*\]/g, "")
    .replace(/^[\s\-–|,/!.]+/, "")
    .replace(/[\s\-–|,/]+$/, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function cleanDisplayTitle(title: string): string {
  let result = title
    .split(" ")
    .map((w) => (w && isShoutyWord(w) ? titleCaseWord(w) : w))
    .join(" ");

  for (const pattern of NOISE_GROUPS) {
    result = dedupeGroup(result, pattern);
  }

  for (const pattern of SELLER_NOISE) {
    result = result.replace(pattern, " ");
  }

  // Si la limpieza se comió el título entero (un listado que solo decía
  // "BNWT NEW"), se devuelve el original: mejor ruidoso que vacío.
  const tidied = tidySeparators(result);
  return tidied.length >= 3 ? tidied : title.trim();
}
