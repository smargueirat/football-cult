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
  { pattern: /pr[eé].?-?match|prematch/gi, es: "Pre-Match", en: "Pre-Match", pt: "Pré-Jogo", fr: "Avant-Match", it: "Pre-Partita" },
  { pattern: /primera equipaci[oó]n/gi, es: "Titular", en: "Home", pt: "Titular", fr: "Domicile", it: "Casa" },
  { pattern: /segunda equipaci[oó]n/gi, es: "Visitante", en: "Away", pt: "Reserva", fr: "Extérieur", it: "Trasferta" },
  { pattern: /tercera equipaci[oó]n/gi, es: "Tercera", en: "Third", pt: "Terceira", fr: "Troisième", it: "Terza" },

  // Tipo de camiseta (mismo vocabulario que TYPE_PATTERNS en extract.py).
  { pattern: /\bportero\b|\bgardien\b|\bgoalkeeper\b|\bgoleiro\b|\bportiere\b/gi, es: "Arquero", en: "Goalkeeper", pt: "Goleiro", fr: "Gardien", it: "Portiere" },
  { pattern: /\bentrenamiento\b|\btraining\b|\btreino\b/gi, es: "Entrenamiento", en: "Training", pt: "Treino", fr: "Entraînement", it: "Allenamento" },
  { pattern: /\bdomicile\b|\btitular\b|\bhome\b/gi, es: "Titular", en: "Home", pt: "Titular", fr: "Domicile", it: "Casa" },
  { pattern: /\bext[ée]rieur\b|\bvisitante\b|\baway\b/gi, es: "Visitante", en: "Away", pt: "Reserva", fr: "Extérieur", it: "Trasferta" },
  { pattern: /\btercer[ao]?\b|\bthird\b|\btroisi[eè]me\b|\bterceir[ao]\b/gi, es: "Tercera", en: "Third", pt: "Terceira", fr: "Troisième", it: "Terza" },

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
// propios), devuelve el título sin tocar.
export function translateTitleVocabulary(title: string, locale: Locale): string {
  let result = title;
  for (const entry of ENTRIES) {
    result = result.replace(entry.pattern, entry[locale]);
  }
  return result;
}
