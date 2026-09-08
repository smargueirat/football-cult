import { Locale } from "./translations";

export const LOCALES: Locale[] = ["es", "en", "pt", "fr", "it"];
export const DEFAULT_LOCALE: Locale = "es";

// BCP47 tags for og:locale / <html lang> — one real-world region per
// language, matching who actually reads that language on the site today
// (pt -> Brazil, not Portugal: the /brasil page and Rakuten Brazil
// catalog are the only real pt-speaking audience so far).
export const OG_LOCALE: Record<Locale, string> = {
  es: "es_ES",
  en: "en_US",
  pt: "pt_BR",
  fr: "fr_FR",
  it: "it_IT",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}

/**
 * hreflang alternates for a given un-prefixed path (e.g. "" for home,
 * "/argentina", "/camiseta/xyz"). x-default points at the Spanish
 * version -- the site's real default audience, not a neutral fallback.
 */
export function buildAlternates(locale: Locale, path: string) {
  const languages = Object.fromEntries(
    LOCALES.map((l) => [l, `/${l}${path}`])
  ) as Record<Locale, string>;
  return {
    canonical: `/${locale}${path}`,
    languages: { ...languages, "x-default": `/${DEFAULT_LOCALE}${path}` },
  };
}
