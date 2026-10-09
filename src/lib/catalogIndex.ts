import { products } from "@/data/products";
import { bootProducts } from "@/data/boots";
import { gloveProducts } from "@/data/gloves";
import { ballProducts } from "@/data/balls";
import { apparelProducts } from "@/data/apparel";
import { trainingProducts } from "@/data/training";
import { ticketProducts } from "@/data/tickets";
import { kitTypeName, teamNames } from "@/lib/productMeta";
import { localizeGearModel } from "@/lib/gearText";
import { brandLabel, gearName, jerseyName, ticketName, type GearLike } from "@/lib/seoMeta";
import type { GearSection } from "@/lib/gearHubs";
import type { HubLocale } from "@/data/teamMeta";

// ÍNDICE RASTREABLE DEL CATÁLOGO (2026-09-24)
//
// El problema medido: /botas tiene 4.844 productos y su HTML inicial
// expone 49 enlaces a ficha. "Ver más" es un <button> de JS, así que
// Googlebot no llega al resto por ahí. El sitemap los declara, pero un
// sitemap es descubrimiento, no importancia: una página sin ningún enlace
// interno es justo la que se queda en "Descubierta: actualmente sin
// indexar" (46.835 URLs el 23/09).
//
// Estas páginas le dan a cada producto al menos UN enlace interno real.
// Se generan estáticas en build (no ISR): así no gastan invocaciones de
// función, que es el otro problema abierto -- de hecho descargan al
// servidor en vez de cargarlo.
//
// 2026-10-09: TODAS las fichas con ofertas (antes solo las de 2+ ofertas)
// y también las entradas. El crawl del 08-10 midió 4.461 fichas sin ningún
// enlace HTML -- 2.523 de ellas entradas -- y la cadena prev/next dejaba
// /indice/ropa/70 a 71 clics de la home. Ahora cada página enlaza a todas
// las de su sección y /indice las lista todas: cualquier ficha queda a 3
// clics (home -> /indice -> página -> ficha).

export const INDEX_SECTIONS = [
  "camisetas",
  "botas",
  "ropa",
  "entrenamiento",
  "guantes",
  "pelotas",
  "tickets",
] as const;
export type IndexSection = (typeof INDEX_SECTIONS)[number];

export const PER_PAGE = 100;

export interface IndexEntry {
  href: string;
  label: string;
  /** Clave de orden (en castellano, igual en los 5 idiomas): de acá salen
   *  los rangos "A–C" de /indice. */
  key: string;
}

const teamName = (key: string, locale: HubLocale): string =>
  (teamNames as Record<string, Record<string, string>>)[key]?.[locale] ?? key;

const withOffers = <T extends { offers: readonly unknown[] }>(items: readonly T[]): T[] => items.filter((i) => i.offers.length > 0);

// El orden se fija con las etiquetas en castellano y se reusa en los 5
// idiomas. Ordenar por la etiqueta ya traducida parece más prolijo, pero
// deja /es/indice/x/3 y /it/indice/x/3 con productos distintos mientras el
// hreflang los declara traducción uno del otro (visto en vivo el 24/09).
function ordered<T>(items: T[], sortKey: (i: T) => string): { item: T; key: string }[] {
  return items.map((item) => ({ item, key: sortKey(item) })).sort((a, b) => a.key.localeCompare(b.key));
}

function gearEntries(items: readonly GearLike[], section: GearSection, locale: HubLocale): IndexEntry[] {
  // Por marca y modelo (no por el sustantivo "Botas de fútbol…", que es igual
  // en todas): así los saltos de /indice dicen algo ("adidas Copa–adidas F50").
  return ordered(withOffers(items), (i) => `${brandLabel(i.brand)} ${localizeGearModel(i.model, i.brand, "es")}`).map(({ item, key }) => ({
    href: `/${section}/${item.id}`,
    label: gearName(section, item, locale),
    key,
  }));
}

// Se cachea por seccion+idioma: cada pagina de indice llamaba a esto de
// nuevo (y generateMetadata otra vez via pageCount), o sea filtrar+mapear+
// ordenar el catalogo entero 445 veces. En local no se nota; el build de
// Vercel corre con UN worker y pasó de 1.100 páginas cada 15 s a 100 cada
// minuto. Mismo patrón que priceStudy().
const cache = new Map<string, IndexEntry[]>();

export function indexEntries(section: IndexSection, locale: HubLocale): IndexEntry[] {
  const key = `${section}:${locale}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const built = buildEntries(section, locale);
  cache.set(key, built);
  return built;
}

function buildEntries(section: IndexSection, locale: HubLocale): IndexEntry[] {
  switch (section) {
    case "camisetas":
      return ordered(withOffers(products), (p) => `${teamName(p.teamKey, "es")} ${p.season} ${kitTypeName(p, "es")} ${p.id}`).map(({ item, key }) => ({
        href: `/camiseta/${item.id}`,
        label: jerseyName(item, locale),
        key,
      }));
    case "tickets":
      return ordered(withOffers(ticketProducts), (t) => `${t.date} ${t.event}`).map(({ item, key }) => ({
        href: `/tickets/${item.id}`,
        label: ticketName(item, locale),
        key,
      }));
    case "botas":
      return gearEntries(bootProducts, "botas", locale);
    case "ropa":
      return gearEntries(apparelProducts, "ropa", locale);
    case "entrenamiento":
      return gearEntries(trainingProducts, "entrenamiento", locale);
    case "guantes":
      return gearEntries(gloveProducts, "guantes", locale);
    case "pelotas":
      return gearEntries(ballProducts, "pelotas", locale);
  }
}

export function pageCount(section: IndexSection, locale: HubLocale): number {
  return Math.max(1, Math.ceil(indexEntries(section, locale).length / PER_PAGE));
}

/** Todas las páginas de índice de un locale, para el sitemap y para
 *  generateStaticParams. Se calcula con "es": el conteo no cambia por
 *  idioma (mismos productos, solo cambia el texto del enlace). */
export function indexPaths(): { section: IndexSection; page: number }[] {
  const out: { section: IndexSection; page: number }[] = [];
  for (const section of INDEX_SECTIONS) {
    const total = pageCount(section, "es");
    for (let page = 1; page <= total; page += 1) out.push({ section, page });
  }
  return out;
}

/** Qué cubre cada página: "Ac–Al" (o fechas, en entradas), para los saltos
 *  de /indice y de la paginación. */
export function pageRanges(section: IndexSection): { page: number; label: string }[] {
  const entries = indexEntries(section, "es");
  const cut = (k: string) =>
    section === "tickets" ? `${k.slice(8, 10)}/${k.slice(5, 7)}` : k.split(/\s+/).slice(0, 2).join(" ").slice(0, 18);
  const out: { page: number; label: string }[] = [];
  for (let i = 0; i < entries.length; i += PER_PAGE) {
    const a = cut(entries[i].key);
    const b = cut(entries[Math.min(i + PER_PAGE, entries.length) - 1].key);
    out.push({ page: i / PER_PAGE + 1, label: a === b ? a : `${a}–${b}` });
  }
  return out;
}
