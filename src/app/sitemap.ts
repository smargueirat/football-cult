import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { bootProducts } from "@/data/boots";
import { gloveProducts } from "@/data/gloves";
import { ballProducts } from "@/data/balls";
import { ticketProducts } from "@/data/tickets";
import { LOCALES } from "@/lib/i18n/locales";

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
    "/selecciones",
    "/clubes",
    "/retro",
    "/mujer",
    "/ninos",
  ];

  const staticRoutes = staticPaths.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      alternates: { languages: languagesFor(path) },
    }))
  );

  const productRoutes = products.flatMap((product) => {
    const path = `/camiseta/${product.id}`;
    return LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      alternates: { languages: languagesFor(path) },
    }));
  });

  const bootRoutes = bootProducts.flatMap((boot) => {
    const path = `/botas/${boot.id}`;
    return LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      alternates: { languages: languagesFor(path) },
    }));
  });

  const gloveRoutes = gloveProducts.flatMap((glove) => {
    const path = `/guantes/${glove.id}`;
    return LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      alternates: { languages: languagesFor(path) },
    }));
  });

  const ballRoutes = ballProducts.flatMap((ball) => {
    const path = `/pelotas/${ball.id}`;
    return LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      alternates: { languages: languagesFor(path) },
    }));
  });

  const ticketRoutes = ticketProducts.flatMap((ticket) => {
    const path = `/tickets/${ticket.id}`;
    return LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      alternates: { languages: languagesFor(path) },
    }));
  });

  return [...staticRoutes, ...productRoutes, ...bootRoutes, ...gloveRoutes, ...ballRoutes, ...ticketRoutes];
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
