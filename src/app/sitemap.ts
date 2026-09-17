import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { bootProducts } from "@/data/boots";
import { LOCALES } from "@/lib/i18n/locales";

const BASE_URL = "https://football-cult.com";
// Límite real de Google (confirmado en Search Console: "Páginas
// descubiertas" se cortaba justo en 50.000 con error) -- un margen para
// no rozarlo apenas crezca el catálogo un poco más.
const CHUNK_SIZE = 40000;

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

  return [...staticRoutes, ...productRoutes, ...bootRoutes];
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
