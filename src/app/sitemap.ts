import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { bootProducts } from "@/data/boots";
import { gloveProducts } from "@/data/gloves";
import { ballProducts } from "@/data/balls";
import { ticketProducts } from "@/data/tickets";
import { apparelProducts } from "@/data/apparel";
import { trainingProducts } from "@/data/training";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n/locales";
import { COUNTRY_SLUGS, LEAGUES } from "@/data/teamMeta";
import { countryTeams, leagueTeams, teamKeysWithItems } from "@/lib/hubs";
import { seasonSortValue } from "@/lib/productMeta";
import { brandFacets, brandGroundCombos, groundFacets, groundSlug, typeFacets } from "@/lib/gearHubs";
import { seasonList, seasonSlug, seasonTypes } from "@/lib/seasonHubs";
import { indexPaths } from "@/lib/catalogIndex";
import { GUIDE_SLUGS } from "@/lib/guides";
import { archive, lastChangeDate } from "@/lib/priceArchive";
import { retailerFamilyLocal } from "@/lib/retailerFamilyLocal";
import firstSeen from "@/data/productFirstSeen.json";

const BASE_URL = "https://football-cult.com";
// Dos límites reales, no solo el de Google (50.000 URLs/sitemap,
// confirmado en Search Console): el primer intento con 40.000 hizo
// fallar el build entero -- "Oversized Incremental Static Regeneration
// page: sitemap/0.xml (28.67 MB)" -- Vercel rechaza cualquier página
// estática de más de 19.07 MB, y con las 5 alternates hreflang por URL
// cada entrada pesa ~750-900 bytes reales. 20.000 URLs midió 17 MB en
// build local -- apenas 2 MB de margen, y el catálogo suma productos
// todas las noches. 15.000 deja más aire para no volver a romper esto
// en unas semanas.
// Bajado de 15.000 a 5.000 el 2026-09-27, cuando el sitemap pasó a listar
// una sola entrada por página en vez de cinco: con 13.485 URLs entraba
// todo en UN archivo de 12 MB, que es lento de rastrear y además habría
// dejado en 404 los cuatro sitemaps ya enviados a Google y a Bing. Con
// 5.000 quedan tres archivos de ~4 MB, cómodos de leer y sin acercarse a
// ninguno de los dos límites de arriba.
const CHUNK_SIZE = 5000;

// PODA DEL SITEMAP (2026-09-24). Le estábamos pidiendo a Google 150.335
// URLs y tenía 4.080 indexadas (3%): 46.835 quedaban en "descubierta,
// actualmente sin indexar", o sea ni las visitaba. Un dominio joven tiene
// un presupuesto de rastreo chico y nosotros lo estábamos repartiendo
// entre decenas de miles de fichas que, encima, no comparan nada: 21.106
// de 30.067 productos (70%) tienen UNA sola tienda, y este sitio es un
// comparador de precios -- una ficha con una sola oferta es justo la
// "página delgada" que Google descarta.
//
// Así que el sitemap ahora empuja SOLO lo que tiene valor real de
// comparación (2+ tiendas) más todos los hubs. No se borra ni se
// desindexa nada: esas páginas siguen existiendo, siguen enlazadas desde
// las categorías y cualquiera puede entrar -- simplemente dejamos de
// pedirle a Google que gaste rastreo en ellas.
// (Era `comparable()`: filtraba por offers.length >= 2. Reemplazado por los
// tiers de abajo, que cuentan tiendas distintas y no ofertas.)

// TIERS POR CALIDAD REAL (2026-10-02). La poda de arriba separaba "2+
// ofertas" de "el resto" contando ofertas, y eso no es lo que Google
// valora: dos ofertas de FootStoreES y FootStoreFR son UNA tienda
// (espejo), y una ficha sin foto o sin precio vigente es delgada aunque
// tenga tres ofertas. Ahora cada ficha cae en un tier y cada tier va en
// archivos de sitemap propios, en este orden:
//   A  2+ tiendas DISTINTAS (familias, no nombres) + foto real + precio
//      vigente: lo único que de verdad compara. Va en los primeros
//      archivos, pegado a las páginas fijas y los hubs.
//   B  el resto de las que tienen al menos un precio vigente.
//   C  tienen ofertas pero ninguna con precio > 0 (hoy no muestran nada).
// Las fichas SIN ofertas no entran (no hay qué comparar).
// Nada se borra: las páginas siguen existiendo y enlazadas. Cada tier va en
// archivos separados a propósito -- Search Console reporta indexación por
// archivo, así se mide cuál rinde, y si B o C estorbaran al rastreo se
// apagan quitándolos de SITEMAP_TIERS sin tocar nada más.
const SITEMAP_TIERS = ["A", "B", "C"] as const;
type Tier = (typeof SITEMAP_TIERS)[number];

type Tierable = {
  id: string;
  offers: readonly { store: string; price: number; imageUrl?: string; url: string }[];
};

function tierOf(item: Tierable): Tier | null {
  const priced = item.offers.filter((o) => o.price > 0);
  if (item.offers.length === 0) return null;
  if (priced.length === 0) return "C";
  const families = new Set(priced.map((o) => retailerFamilyLocal(o.store)));
  const hasPhoto = priced.some((o) => !!o.imageUrl);
  return families.size >= 2 && hasPhoto ? "A" : "B";
}

/** Fecha REAL de la última modificación de la ficha: el último cambio de
 *  precio (o oferta nueva) archivado en alguna de sus ofertas, o el día en
 *  que apareció. undefined si no hay ninguna: sin fecha antes que una
 *  inventada (poner "hoy" en decenas de miles de URLs enseña a Google a
 *  ignorar el campo). */
function lastModOf(item: Tierable): string | undefined {
  const a = archive();
  let best = (firstSeen as Record<string, string>)[item.id] ?? "";
  for (const o of item.offers) {
    const d = lastChangeDate(o.url, a);
    if (d && d > best) best = d;
  }
  return best || undefined;
}

// UNA entrada por página, no cinco (2026-09-27).
//
// Cada página existe en los cinco idiomas, así que el sitemap listaba las
// cinco: 13.485 páginas reales pedían 67.425 URLs. Search Console dice que
// 46.770 estaban en "descubierta: actualmente sin indexar" -- Google las
// encontró y decidió no gastar rastreo en ellas -- contra 4.100 indexadas.
//
// Y Google ya nos dijo por qué, en el informe "Duplicada: Google ha
// elegido una versión canónica diferente": los 47 ejemplos son TODOS
// páginas /en/botas/... cuyo contenido es idéntico al /es/ (el nombre de
// una bota no se traduce). O sea que estábamos gastando cuatro quintos
// del presupuesto en copias que Google ya considera la misma página.
//
// No se desindexa ni se desenlaza nada: las cinco versiones siguen vivas,
// el selector de idioma las enlaza y el hreflang de cada entrada las
// declara igual que antes (eso lo hace languagesFor, que SÍ usa LOCALES).
// Lo único que cambia es a cuál le pedimos rastreo primero. Reversible
// volviendo esta constante a LOCALES.
const SITEMAP_LOCALES = [DEFAULT_LOCALE];

function languagesFor(path: string) {
  return Object.fromEntries([
    ...LOCALES.map((l) => [l, `${BASE_URL}/${l}${path}`]),
    // Mismo x-default que ya declara el <head> de cada página
    // (buildAlternates en locales.ts): sin él, el sitemap y la página
    // decían cosas distintas sobre qué versión mostrar por defecto.
    ["x-default", `${BASE_URL}/${DEFAULT_LOCALE}${path}`],
  ]) as Record<string, string>;
}

function buildGroups(): { groups: MetadataRoute.Sitemap[]; counts: Record<Tier, number> } {
  const staticPaths = [
    "",
    "/sobre-nosotros",
    "/contacto",
    "/privacidad",
    "/terminos",
    "/aviso-legal",
    "/como-ganamos-dinero",
    "/guia-de-tallas",
    "/autenticidad",
    "/brasil",
    "/argentina",
    "/francia",
    "/italia",
    "/botas",
    "/guantes",
    "/pelotas",
    "/tickets",
    "/ropa",
    "/entrenamiento",
    "/selecciones",
    "/clubes",
    "/retro",
    "/mujer",
    "/ninos",
    "/ligas",
  ];

  const staticRoutes = staticPaths.flatMap((path) =>
    SITEMAP_LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      alternates: { languages: languagesFor(path) },
    }))
  );

  // Hubs (equipo / liga / país): van justo después de las páginas fijas,
  // o sea en el primer sitemap -- son la puerta de entrada a las fichas
  // (cada hub enlaza a todos sus productos), así que conviene que Google
  // los descubra primero. Sólo entran los que tienen productos hoy.
  const hubPaths = [
    ...LEAGUES.filter((l) => leagueTeams(l.slug).length > 0).map((l) => `/liga/${l.slug}`),
    ...COUNTRY_SLUGS.filter((c) => countryTeams(c).length > 0).map((c) => `/pais/${c}`),
    ...teamKeysWithItems().map((k) => `/equipo/${k}`),
    // Hubs de temporada, ofertas y de botas/guantes/pelotas/ropa (marca,
    // terreno, tipo): solo los que tienen suficiente producto hoy.
    "/ofertas",
    // Puerta de entrada por presupuesto (regalos): una sola URL, no una por
    // tramo -- ver el comentario de la propia página.
    "/regalos",
    // Camisetas recién salidas: cambia a diario, es la que más conviene que
    // Google revisite.
    "/novedades",
    "/guia",
    // Derivado de GUIDE_SLUGS y no escrito a mano: estaban listadas solo
    // dos de las cuatro guías (faltaban la de tapones y la de retro), que
    // es lo que pasa cuando una lista se copia. Ahora no se puede
    // desincronizar al agregar una guía nueva.
    ...GUIDE_SLUGS.map((g) => `/guia/${g}`),
    "/estudios/precios-camisetas",
    "/estudios/indice-precios",
    // Índice rastreable del catálogo: 445 URLs que le dan a 8.680 fichas
    // su primer enlace interno real (ver src/lib/catalogIndex.ts).
    ...indexPaths().map(({ section, page }) => `/indice/${section}/${page}`),
    ...seasonList().flatMap((se) => [`/temporada/${seasonSlug(se)}`, ...seasonTypes(se).map((t) => `/temporada/${seasonSlug(se)}/${t.type}`)]),
    ...(["botas", "guantes", "pelotas", "ropa", "entrenamiento"] as const).flatMap((sec) => brandFacets(sec).map((b) => `/${sec}/marca/${b.slug}`)),
    ...groundFacets().map((g) => `/botas/terreno/${g.slug}`),
    ...brandGroundCombos().map((c) => `/botas/marca/${c.brandSlug}/${groundSlug(c.ground)}`),
    ...typeFacets().map((t) => `/ropa/tipo/${t.slug}`),
    ...typeFacets("entrenamiento").map((t) => `/entrenamiento/tipo/${t.slug}`),
  ];
  // Sin lastModified inventado (antes: new Date() en todas). Solo estas dos
  // cambian con cada corrida del scan, y su fecha real es la de la última
  // corrida registrada en el archivo de precios.
  const lastRun = archive().lastDate || undefined;
  const hubRoutes = hubPaths.flatMap((path) =>
    SITEMAP_LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      ...(path === "/ofertas" || path === "/novedades" ? { lastModified: lastRun } : {}),
      alternates: { languages: languagesFor(path) },
    }))
  );

  // Camisetas: equipos con más catálogo primero, y dentro de cada equipo la
  // temporada más nueva primero. Google ignora <priority> y no garantiza
  // orden de rastreo, pero el orden estable deja los primeros archivos con
  // lo más valioso y hace comparable la cobertura entre corridas.
  const teamSize = new Map<string, number>();
  for (const p of products) teamSize.set(p.teamKey, (teamSize.get(p.teamKey) ?? 0) + 1);
  const orderedProducts = [...products].sort(
    (a, b) =>
      (teamSize.get(b.teamKey) ?? 0) - (teamSize.get(a.teamKey) ?? 0) ||
      a.teamKey.localeCompare(b.teamKey) ||
      seasonSortValue(b.season) - seasonSortValue(a.season) ||
      a.id.localeCompare(b.id)
  );

  const sections: { base: string; items: readonly Tierable[] }[] = [
    { base: "/camiseta", items: orderedProducts },
    { base: "/botas", items: bootProducts },
    { base: "/guantes", items: gloveProducts },
    { base: "/pelotas", items: ballProducts },
    { base: "/tickets", items: ticketProducts },
    { base: "/ropa", items: apparelProducts },
    { base: "/entrenamiento", items: trainingProducts },
  ];

  const byTier: Record<Tier, MetadataRoute.Sitemap> = { A: [], B: [], C: [] };
  for (const { base, items } of sections) {
    for (const item of items) {
      const tier = tierOf(item);
      if (!tier) continue;
      const path = `${base}/${item.id}`;
      const lastModified = lastModOf(item);
      for (const locale of SITEMAP_LOCALES) {
        byTier[tier].push({
          url: `${BASE_URL}/${locale}${path}`,
          ...(lastModified ? { lastModified } : {}),
          alternates: { languages: languagesFor(path) },
        });
      }
    }
  }

  // Un grupo por tier; las páginas fijas y los hubs abren el primero.
  const groups: MetadataRoute.Sitemap[] = [];
  const open = SITEMAP_TIERS.filter((t) => byTier[t].length > 0);
  for (const t of open) groups.push(t === open[0] ? [...staticRoutes, ...hubRoutes, ...byTier[t]] : byTier[t]);
  return { groups, counts: Object.fromEntries(SITEMAP_TIERS.map((t) => [t, byTier[t].length])) as Record<Tier, number> };
}

// Cada grupo se corta en archivos de CHUNK_SIZE y NUNCA se mezcla con el
// siguiente: así un archivo contiene un solo tier (salvo el primero, que
// además lleva fijas y hubs).
let chunksCache: MetadataRoute.Sitemap[] | null = null;
function chunks(): MetadataRoute.Sitemap[] {
  if (chunksCache) return chunksCache;
  const out: MetadataRoute.Sitemap[] = [];
  for (const g of buildGroups().groups) {
    for (let i = 0; i < g.length; i += CHUNK_SIZE) out.push(g.slice(i, i + CHUNK_SIZE));
  }
  return (chunksCache = out.length ? out : [[]]);
}

/** Para reportes: cuántas URLs de ficha cayeron en cada tier. */
export function sitemapTierCounts() {
  return buildGroups().counts;
}

// Google rechaza (con error real, confirmado en Search Console 2026-09-17)
// cualquier sitemap de más de 50.000 URLs -- el catálogo entero (camisetas
// + botas x 5 idiomas) ya superaba ese límite en ~12.000 URLs, así que
// una porción del sitio nunca estaba siendo comunicada correctamente.
// generateSitemaps() de Next.js parte el resultado en varios archivos
// reales (/sitemap/0.xml, /sitemap/1.xml, ...), cada uno bajo el límite;
// robots.ts lista todos explícitamente (no depender de un índice
// implícito no documentado para esta versión de Next.js).
// Compartido con robots.ts, que necesita listar cada archivo de sitemap
// explícitamente (ver el comentario ahí).
export function sitemapChunkCount(): number {
  return chunks().length;
}

export async function generateSitemaps() {
  return Array.from({ length: sitemapChunkCount() }, (_, id) => ({ id }));
}

export default async function sitemap({
  id,
}: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const chunkId = Number(await id);
  return chunks()[chunkId] ?? [];
}
