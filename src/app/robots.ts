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
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", ...LOCALES.map((l) => `/${l}/favoritos`)],
    },
    sitemap: sitemaps,
  };
}
