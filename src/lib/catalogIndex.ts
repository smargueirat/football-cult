import { products } from "@/data/products";
import { bootProducts } from "@/data/boots";
import { gloveProducts } from "@/data/gloves";
import { ballProducts } from "@/data/balls";
import { apparelProducts } from "@/data/apparel";
import { trainingProducts } from "@/data/training";
import { teamNames, typeNames } from "@/lib/productMeta";
import { localizeGearModel } from "@/lib/gearText";
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
// Se indexan los mismos productos que entran al sitemap (2+ tiendas),
// por coherencia con la poda del mismo día: si decidimos no gastarle
// rastreo a las fichas de una sola tienda, tampoco tiene sentido
// empujarlas desde acá. Siguen existiendo y enlazadas desde su categoría.

export const INDEX_SECTIONS = [
  "camisetas",
  "botas",
  "ropa",
  "entrenamiento",
  "guantes",
  "pelotas",
] as const;
export type IndexSection = (typeof INDEX_SECTIONS)[number];

export const PER_PAGE = 100;

export interface IndexEntry {
  href: string;
  label: string;
}

const teamName = (key: string, locale: HubLocale): string =>
  (teamNames as Record<string, Record<string, string>>)[key]?.[locale] ?? key;
const typeName = (key: string, locale: HubLocale): string =>
  (typeNames as Record<string, Record<string, string>>)[key]?.[locale] ?? key;

function comparable<T extends { offers: unknown[] }>(items: T[]): T[] {
  return items.filter((i) => i.offers.length >= 2);
}

// El orden se fija con las etiquetas en castellano y se reusa en los 5
// idiomas. Ordenar por la etiqueta ya traducida parece más prolijo, pero
// deja /es/indice/x/3 y /it/indice/x/3 con productos distintos mientras el
// hreflang los declara traducción uno del otro (visto en vivo el 24/09).
function ordered<T>(items: T[], sortKey: (i: T) => string): T[] {
  return [...items].sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
}

function gearEntries(
  items: { id: string; brand: string; model: string }[],
  basePath: string,
  locale: HubLocale,
): IndexEntry[] {
  const list = comparable(items as unknown as { offers: unknown[] }[]).map(
    (raw) => raw as unknown as { id: string; brand: string; model: string },
  );
  return ordered(list, (i) => localizeGearModel(i.model, i.brand, "es")).map((item) => ({
    href: `/${basePath}/${item.id}`,
    label: localizeGearModel(item.model, item.brand, locale),
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
      return ordered(
        comparable(products),
        (p) => `${teamName(p.teamKey, "es")} ${typeName(p.typeKey, "es")} ${p.season}`,
      ).map((p) => ({
        href: `/camiseta/${p.id}`,
        label: `${teamName(p.teamKey, locale)} ${typeName(p.typeKey, locale)} ${p.season}`,
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
