import { Metadata } from "next";
import { Locale, translations } from "@/lib/i18n/translations";
import { buildAlternates } from "@/lib/i18n/locales";

// Metadata para las 5 páginas de categoría de camisetas (selecciones,
// clubes, retro, mujer, niños) -- reusa el título/subtítulo de
// heroSlides (ya traducido a los 5 idiomas) en vez de escribir 25
// strings nuevas a mano, así el <title>/description del SEO nunca se
// desalinea del texto real que ve el usuario en la página.
// Exportado: lo reusa la ficha de camiseta, que tenía su propio
// "Comparar precios" cableado en español para los cinco idiomas.
export const TITLE_SUFFIX: Record<Locale, string> = {
  es: "Comparar precios",
  en: "Compare Prices",
  pt: "Comparar Preços",
  fr: "Comparer les Prix",
  it: "Confronta i Prezzi",
};

/** "Mujer" / "Niños" (localizado) para distinguir la ficha de la de adulto.
 *
 * Sin esto, `barcelona-home-women` y `barcelona-home-202526` salían con el
 * MISMO <title> y la misma descripción, que es exactamente lo que hace que
 * Google marque una de las dos como duplicada -- el mismo problema que ya
 * había con las copias por idioma. Afecta a 239 fichas (116 de mujer, 123
 * de niños). Devuelve null para adulto, que no lleva sufijo. */
export function ageGroupLabel(locale: Locale, ageGroup: string | undefined): string | null {
  if (ageGroup === "women") return translations[locale].search.ageGroupWomen;
  if (ageGroup === "kids") return translations[locale].search.ageGroupKids;
  return null;
}

// <title> con la consulta de compra (revisión SEO 2026-10-09, H26): el
// eyebrow del slide ("Los aficionados más pequeños — Comparar precios") no
// dice qué se vende. Mismo orden que heroSlides: selecciones, clubes, retro,
// mujer, niños.
const CATEGORY_TITLE: Record<Locale, string[]> = {
  es: ["Camisetas de selecciones de fútbol: compara precios", "Camisetas de clubes de fútbol: compara precios", "Camisetas retro de fútbol (hasta 2006)", "Camisetas de fútbol de mujer: compara precios", "Camisetas de fútbol para niños: compara precios"],
  en: ["National team football shirts: compare prices", "Club football shirts: compare prices", "Retro football shirts (up to 2006)", "Women's football shirts: compare prices", "Kids' football shirts: compare prices"],
  pt: ["Camisas de seleções de futebol: compare preços", "Camisas de clubes de futebol: compare preços", "Camisas retrô de futebol (até 2006)", "Camisas de futebol femininas: compare preços", "Camisas de futebol infantis: compare preços"],
  fr: ["Maillots des sélections nationales : comparer les prix", "Maillots de clubs de football : comparer les prix", "Maillots rétro de football (jusqu'en 2006)", "Maillots de football femme : comparer les prix", "Maillots de football enfant : comparer les prix"],
  it: ["Maglie delle nazionali di calcio: confronta i prezzi", "Maglie dei club di calcio: confronta i prezzi", "Maglie retrò da calcio (fino al 2006)", "Maglie da calcio donna: confronta i prezzi", "Maglie da calcio bambino: confronta i prezzi"],
};

export function buildCategoryMetadata(locale: Locale, sectionIndex: number, path: string): Metadata {
  const slide = translations[locale].heroSlides[sectionIndex];
  const base = CATEGORY_TITLE[locale][sectionIndex] ?? `${slide.eyebrow} — ${TITLE_SUFFIX[locale]}`;
  const title = base.length + 16 <= 60 ? `${base} | Football Cult` : base;
  return {
    title,
    description: slide.subtitle,
    alternates: buildAlternates(locale, path),
  };
}
