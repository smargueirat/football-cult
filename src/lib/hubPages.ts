import type { Metadata } from "next";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import type { HubLocale } from "@/data/teamMeta";

export const SITE_URL = "https://football-cult.com";

export function asLocale(raw: string): HubLocale {
  return isLocale(raw) ? raw : DEFAULT_LOCALE;
}

export function hubMetadata(locale: HubLocale, path: string, title: string, description: string): Metadata {
  return {
    title: `${title} | Football Cult`,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export function breadcrumbLd(locale: HubLocale, trail: { name: string; path?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.path ? { item: `${SITE_URL}/${locale}${c.path}` } : {}),
    })),
  };
}
