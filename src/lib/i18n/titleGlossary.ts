import { Locale } from "./translations";

// Traduce el VOCABULARIO genérico de camiseta (tipo, género, "réplica",
// torneo, etc.) dentro del título REAL de la oferta, dejando todo lo demás
// intacto -- nombres de equipo, jugador, marca, números de temporada.
// Esto es lo que el usuario pidió explícitamente después de que probamos
// (y revertimos, dos veces) reemplazar el título real por uno armado por
// nosotros: "el titulo real tiene que ser traducido en el idioma de la
// página tal cual está. No inventar uno nuevo." Ver
// feedback_realname_primary.md -- el título real sigue siendo la fuente
// de verdad, esto solo traduce sus palabras genéricas conocidas.
//
// Patrones reutilizados de extract.py's TYPE_PATTERNS/JERSEY_RE donde es
// posible (ya están probados contra todo el catálogo sin falsos
// positivos contra nombres de equipo), no inventados de cero acá.
interface GlossaryEntry {
  pattern: RegExp;
  es: string;
  en: string;
  pt: string;
  fr: string;
  it: string;
}

const ENTRIES: GlossaryEntry[] = [
  // Frases primero, para que no queden mordidas por las palabras sueltas
  // de abajo -- en particular "primera/segunda/tercera equipación" tiene
  // que ir antes que el \btercer[ao]?\b de más abajo, si no éste la muerde
  // dejando "equipación" colgado sin traducir.
  { pattern: /coupe du monde|copa (do|del) mundo|world cup/gi, es: "Copa del Mundo", en: "World Cup", pt: "Copa do Mundo", fr: "Coupe du Monde", it: "Coppa del Mondo" },
  { pattern: /manches? longues?|manga larga|manga longa|long ?sleeve/gi, es: "Manga Larga", en: "Long Sleeve", pt: "Manga Longa", fr: "Manches Longues", it: "Manica Lunga" },
  { pattern: /pr[eé].?-?match|prematch/gi, es: "Prepartido", en: "Pre-Match", pt: "Pré-Jogo", fr: "Avant-Match", it: "Pre-Partita" },
  { pattern: /primera equipaci[oó]n/gi, es: "Primera Equipación", en: "Home", pt: "Titular", fr: "Domicile", it: "Casa" },
  { pattern: /segunda equipaci[oó]n/gi, es: "Segunda Equipación", en: "Away", pt: "Reserva", fr: "Extérieur", it: "Trasferta" },
  { pattern: /tercera equipaci[oó]n/gi, es: "Tercera Equipación", en: "Third", pt: "Terceira", fr: "Troisième", it: "Terza" },

  // Tipo de camiseta (mismo vocabulario que TYPE_PATTERNS en extract.py).
  { pattern: /\bportero\b|\bgardien\b|\bgoalkeeper\b|\bgoleiro\b|\bportiere\b/gi, es: "Portero", en: "Goalkeeper", pt: "Goleiro", fr: "Gardien", it: "Portiere" },
  { pattern: /\bentrenamiento\b|\btraining\b|\btreino\b/gi, es: "Entrenamiento", en: "Training", pt: "Treino", fr: "Entraînement", it: "Allenamento" },
  { pattern: /\bdomicile\b|\btitular\b|\bhome\b/gi, es: "Primera Equipación", en: "Home", pt: "Titular", fr: "Domicile", it: "Casa" },
  { pattern: /\bext[ée]rieur\b|\bvisitante\b|\baway\b/gi, es: "Segunda Equipación", en: "Away", pt: "Reserva", fr: "Extérieur", it: "Trasferta" },
  { pattern: /\btercer[ao]?\b(?! equipaci)|\bthird\b|\btroisi[eè]me\b|\bterceir[ao]\b/gi, es: "Tercera Equipación", en: "Third", pt: "Terceira", fr: "Troisième", it: "Terza" },

  // Jersey/camiseta como palabra en sí (JERSEY_RE). "camiseta" (ES) faltaba
  // -- \bcamisa\b no la matchea porque no es un límite de palabra dentro de
  // "camiseta", así que se queda sin traducir en cientos de títulos de
  // AdidasES/AdidasPT.
  { pattern: /\bmaillot\b|\bjersey\b|\bcamiseta\b|\bcamisola\b|\btrikot\b|\bshirt\b|\bmaglia\b|\bcamisa\b/gi, es: "Camiseta", en: "Jersey", pt: "Camisa", fr: "Maillot", it: "Maglia" },

  // Género.
  { pattern: /\bhomme\b|\bhombre\b|\bmen'?s\b|\bmasculin[ao]\b/gi, es: "Hombre", en: "Men's", pt: "Masculina", fr: "Homme", it: "Uomo" },
  { pattern: /\bfemme\b|\bmujer\b|\bwomen'?s\b|\bwoman'?s\b|\bfeminin[ao]\b|\bf[ée]minin\b|\bladies\b|\bdama\b/gi, es: "Mujer", en: "Women's", pt: "Feminina", fr: "Femme", it: "Donna" },
  { pattern: /\bni[ñn][oa]s?\b|\bkids?\b|\bjunior\b|\benfant\b|\binfantil\b/gi, es: "Niño/a", en: "Kids", pt: "Infantil", fr: "Enfant", it: "Bambino" },

  // Otros términos comunes.
  { pattern: /\br[ée]plica\b|\breplique\b/gi, es: "Réplica", en: "Replica", pt: "Réplica", fr: "Réplique", it: "Replica" },
  { pattern: /\baut[ée]ntic[ao]\b|\bauthentic\b/gi, es: "Auténtica", en: "Authentic", pt: "Autêntica", fr: "Authentique", it: "Autentica" },
];

// Traduce el título real, palabra de vocabulario por palabra de
// vocabulario -- nunca arma un nombre nuevo desde cero. Si no reconoce
// ninguna palabra (título ya en el idioma correcto, o solo tiene nombres
// propios), devuelve el título sin tocar. Con `team` (teamNames[teamKey] de
// la ficha) también cambia el nombre ESPAÑOL del equipo por el del idioma
// de la página ("Olympique Marsella" -> "Olympique de Marseille" en /fr).
export function translateTitleVocabulary(title: string, locale: Locale, team?: Record<Locale, string>): string {
  let result = team ? localizeTeamName(title, team, locale) : title;
  for (const entry of ENTRIES) {
    result = result.replace(entry.pattern, entry[locale]);
  }
  return result;
}

const fold = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Formas españolas del nombre que hay que cambiar: el nombre en español y
 *  el mismo sin " de " ("Olympique Marsella", el de Futbol Emotion). Solo si
 *  esa forma es propia del español: si el inglés usa la misma ("Napoli",
 *  "Paraguay") es el nombre oficial y se deja. */
export function spanishTeamForms(team: Record<Locale, string>): string[] {
  const others = new Set((["en", "pt", "fr", "it"] as const).map((l) => team[l]));
  return [...new Set([team.es, team.es.replace(/ de /g, " ")])]
    .filter((f) => f !== team.en && !others.has(f))
    .sort((a, b) => b.length - a.length);
}

/** Cambia la forma española del nombre del equipo por la del idioma
 *  pedido. Compara sin tildes ni mayúsculas (eBay ES escribe "Japon",
 *  "Mexico"); si el título ya trae el nombre correcto, no lo toca. */
export function localizeTeamName(title: string, team: Record<Locale, string>, locale: Locale): string {
  const target = team[locale];
  if (locale === "es" || !target) return title;
  title = title.normalize("NFC");
  for (const form of spanishTeamForms(team)) {
    const folded = fold(title);
    // "Inter de Milán" -> "Inter": el nombre corto va dentro del largo.
    const inside = fold(form) !== fold(target) && fold(form).includes(fold(target));
    // Con tildes: "Croacia" no es el "Croácia" de /pt.
    if (!inside && title.toLowerCase().includes(target.toLowerCase())) break;
    const re = new RegExp(`(?<![\\p{L}\\p{N}])${escapeRe(fold(form))}(?![\\p{L}\\p{N}])`, "u");
    const m = re.exec(folded);
    // Con el título en NFC, fold() deja una letra por letra: los índices
    // del texto plegado sirven para cortar el original.
    if (m && folded.length === title.length) title = title.slice(0, m.index) + target + title.slice(m.index + m[0].length);
  }
  return title;
}
