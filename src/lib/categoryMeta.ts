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

export function buildCategoryMetadata(locale: Locale, sectionIndex: number, path: string): Metadata {
  const slide = translations[locale].heroSlides[sectionIndex];
  const title = `${slide.eyebrow} — ${TITLE_SUFFIX[locale]} | Football Cult`;
  return {
    title,
    description: slide.subtitle,
    alternates: buildAlternates(locale, path),
  };
}
