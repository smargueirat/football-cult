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
    // Search Console (2026-09-23): "Falta el campo item" en itemListElement.
    // Bug real: el inicio del trail siempre pasa path: "" (raíz del locale,
    // ej. /es), y `c.path ? ... : {}` trata "" como falsy -- así que el
    // primer breadcrumb de TODAS las páginas (no el último, donde omitir
    // item es intencional y válido) quedaba sin "item". Chequear undefined,
    // no truthiness.
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.path !== undefined ? { item: `${SITE_URL}/${locale}${c.path}` } : {}),
    })),
  };
}
