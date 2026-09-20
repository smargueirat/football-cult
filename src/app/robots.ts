import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/i18n/locales";
import { sitemapChunkCount } from "./sitemap";

// El sitemap se parte en varios archivos (sitemap.ts, generateSitemaps())
// porque un solo archivo con más de 50.000 URLs es rechazado por Google
// (error real confirmado en Search Console 2026-09-17) -- acá se listan
// todos explícitamente en vez de depender de un índice implícito.
export default function robots(): MetadataRoute.Robots {
  const sitemaps = Array.from(
    { length: sitemapChunkCount() },
    (_, id) => `https://football-cult.com/sitemap/${id}.xml`
  );

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", ...LOCALES.map((l) => `/${l}/favoritos`)],
      },
      // Crawlers de SEO/scraping sin valor para el sitio que rastrean
      // decenas de miles de URLs dinámicas (cada una una invocación de
      // función en Vercel Hobby, 4 h/mes de CPU activa).
      {
        userAgent: ["AhrefsBot", "SemrushBot", "MJ12bot", "DotBot", "PetalBot", "Bytespider", "BLEXBot", "DataForSeoBot"],
        disallow: "/",
      },
    ],
    sitemap: sitemaps,
  };
}
