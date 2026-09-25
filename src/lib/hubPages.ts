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

export function breadcrumbLd(
  locale: HubLocale,
  trail: { name: string; path?: string }[],
  /** Ruta de la página actual, para el último breadcrumb. */
  current?: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    // Search Console (2026-09-23): "Falta el campo item" en itemListElement.
    // Bug real: el inicio del trail siempre pasa path: "" (raíz del locale,
    // ej. /es), y `c.path ? ... : {}` trata "" como falsy -- así que el
    // primer breadcrumb de TODAS las páginas quedaba sin "item". Chequear
    // undefined, no truthiness.
    //
    // 2026-09-25: seguían 18 elementos inválidos por lo mismo, ahora en el
    // ÚLTIMO del trail, que pasa path: undefined. La especificación permite
    // omitir "item" en el último, pero Google lo marca igual como error
    // crítico y omitirlo no nos da nada: ahora se emite siempre, apuntando
    // a la página actual. `current` es la URL de la propia página.
    itemListElement: trail.map((c, i) => {
      const path = c.path ?? (i === trail.length - 1 ? current : undefined);
      return {
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        // Si no sabemos la URL se OMITE, no se inventa: con un `?? ""` de
        // reserva el último breadcrumb apuntaba a la home, o sea decía que
        // "Ligas y países" vive en /es. Un item ausente es válido; uno
        // equivocado le enseña a Google una jerarquía falsa.
        ...(path !== undefined ? { item: `${SITE_URL}/${locale}${path}` } : {}),
      };
    }),
  };
}
