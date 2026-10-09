import type { HubLocale } from "@/data/teamMeta";

// Fecha larga de un partido en el idioma de la página. A mano, no con
// toLocaleDateString: antes se llamaba con `undefined` y salía en inglés en
// los 5 idiomas ("Saturday, 06 March 2027" en /es), y el ICU del servidor
// tampoco es fiable (ver newStrings.ts). La fecha corta es shortDate().
const MONTHS: Record<HubLocale, string[]> = {
  es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  pt: ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"],
  fr: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
  it: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
};
const WEEKDAYS: Record<HubLocale, string[]> = {
  es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  pt: ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"],
  fr: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
  it: ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"],
};

/** "2027-03-06" -> "sábado, 6 de marzo de 2027" / "Saturday, 6 March 2027" / "samedi 6 mars 2027"... */
export function longDate(iso: string, locale: HubLocale): string {
  const [y, m, d] = iso.split("-").map(Number);
  const wd = WEEKDAYS[locale][new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  const month = MONTHS[locale][m - 1];
  if (locale === "es" || locale === "pt") return `${wd}, ${d} de ${month} de ${y}`;
  if (locale === "en") return `${wd}, ${d} ${month} ${y}`;
  return `${wd} ${d} ${month} ${y}`;
}
