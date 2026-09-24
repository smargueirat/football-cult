import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { bootProducts } from "@/data/boots";
import { gloveProducts } from "@/data/gloves";
import { ballProducts } from "@/data/balls";
import { ticketProducts } from "@/data/tickets";
import { apparelProducts } from "@/data/apparel";
import { trainingProducts } from "@/data/training";
import { LOCALES } from "@/lib/i18n/locales";
import { COUNTRY_SLUGS, LEAGUES } from "@/data/teamMeta";
import { countryTeams, leagueTeams, teamKeysWithItems } from "@/lib/hubs";
import { seasonSortValue } from "@/lib/productMeta";
import { brandFacets, brandGroundCombos, groundFacets, groundSlug, typeFacets } from "@/lib/gearHubs";
import { seasonList, seasonSlug, seasonTypes } from "@/lib/seasonHubs";

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
const CHUNK_SIZE = 15000;

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
function comparable<T extends { offers: unknown[] }>(items: T[]): T[] {
  return items.filter((i) => i.offers.length >= 2);
}

function languagesFor(path: string) {
  return Object.fromEntries(
    LOCALES.map((l) => [l, `${BASE_URL}/${l}${path}`])
  ) as Record<string, string>;
}

function allRoutes(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/sobre-nosotros",
    "/contacto",
    "/privacidad",
    "/terminos",
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
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
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
    "/guia",
    "/guia/camiseta-original",
    "/guia/talle-fan-vs-jugador",
    "/estudios/precios-camisetas",
    ...seasonList().flatMap((se) => [`/temporada/${seasonSlug(se)}`, ...seasonTypes(se).map((t) => `/temporada/${seasonSlug(se)}/${t.type}`)]),
    ...(["botas", "guantes", "pelotas", "ropa", "entrenamiento"] as const).flatMap((sec) => brandFacets(sec).map((b) => `/${sec}/marca/${b.slug}`)),
    ...groundFacets().map((g) => `/botas/terreno/${g.slug}`),
    ...brandGroundCombos().map((c) => `/botas/marca/${c.brandSlug}/${groundSlug(c.ground)}`),
    ...typeFacets().map((t) => `/ropa/tipo/${t.slug}`),
    ...typeFacets("entrenamiento").map((t) => `/entrenamiento/tipo/${t.slug}`),
  ];
  const hubRoutes = hubPaths.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      alternates: { languages: languagesFor(path) },
    }))
  );

  // Camisetas: equipos con más catálogo primero, y dentro de cada equipo la
  // temporada más nueva primero. Google ignora <priority> y no garantiza
  // orden de rastreo, pero el orden estable deja los primeros archivos con
  // lo más valioso y hace comparable la cobertura entre corridas. Sin
  // lastModified a propósito: no tenemos una fecha real por producto y
  // poner "hoy" en 100k URLs le enseña a Google a ignorar el campo.
  const teamSize = new Map<string, number>();
  for (const p of products) teamSize.set(p.teamKey, (teamSize.get(p.teamKey) ?? 0) + 1);
  const orderedProducts = comparable(products).sort(
    (a, b) =>
      (teamSize.get(b.teamKey) ?? 0) - (teamSize.get(a.teamKey) ?? 0) ||
      a.teamKey.localeCompare(b.teamKey) ||
      seasonSortValue(b.season) - seasonSortValue(a.season) ||
      a.id.localeCompare(b.id)
  );

  const productRoutes = orderedProducts.flatMap((product) => {
    const path = `/camiseta/${product.id}`;
    return LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      alternates: { languages: languagesFor(path) },
    }));
  });

  const bootRoutes = comparable(bootProducts).flatMap((boot) => {
    const path = `/botas/${boot.id}`;
    return LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      alternates: { languages: languagesFor(path) },
    }));
  });

  const gloveRoutes = comparable(gloveProducts).flatMap((glove) => {
    const path = `/guantes/${glove.id}`;
    return LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      alternates: { languages: languagesFor(path) },
    }));
  });

  const ballRoutes = comparable(ballProducts).flatMap((ball) => {
    const path = `/pelotas/${ball.id}`;
    return LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      alternates: { languages: languagesFor(path) },
    }));
  });

  const ticketRoutes = comparable(ticketProducts).flatMap((ticket) => {
    const path = `/tickets/${ticket.id}`;
    return LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      alternates: { languages: languagesFor(path) },
    }));
  });

  const apparelRoutes = comparable(apparelProducts).flatMap((item) => {
    const path = `/ropa/${item.id}`;
    return LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      alternates: { languages: languagesFor(path) },
    }));
  });

  const trainingRoutes = comparable(trainingProducts).flatMap((item) => {
    const path = `/entrenamiento/${item.id}`;
    return LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      alternates: { languages: languagesFor(path) },
    }));
  });

  return [...staticRoutes, ...hubRoutes, ...productRoutes, ...bootRoutes, ...gloveRoutes, ...ballRoutes, ...ticketRoutes, ...apparelRoutes, ...trainingRoutes];
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
  return Math.max(1, Math.ceil(allRoutes().length / CHUNK_SIZE));
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
  const start = chunkId * CHUNK_SIZE;
  return allRoutes().slice(start, start + CHUNK_SIZE);
}
