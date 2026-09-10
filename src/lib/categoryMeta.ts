import { Metadata } from "next";
import { Locale, translations } from "@/lib/i18n/translations";
import { buildAlternates } from "@/lib/i18n/locales";

// Metadata para las 5 páginas de categoría de camisetas (selecciones,
// clubes, retro, mujer, niños) -- reusa el título/subtítulo de
// heroSlides (ya traducido a los 5 idiomas) en vez de escribir 25
// strings nuevas a mano, así el <title>/description del SEO nunca se
// desalinea del texto real que ve el usuario en la página.
const TITLE_SUFFIX: Record<Locale, string> = {
  es: "Comparar precios",
  en: "Compare Prices",
  pt: "Comparar Preços",
  fr: "Comparer les Prix",
  it: "Confronta i Prezzi",
};

export function buildCategoryMetadata(locale: Locale, sectionIndex: number, path: string): Metadata {
  const slide = translations[locale].heroSlides[sectionIndex];
  const title = `${slide.eyebrow} — ${TITLE_SUFFIX[locale]} | Football Cult`;
  return {
    title,
    description: slide.subtitle,
    alternates: buildAlternates(locale, path),
  };
}
