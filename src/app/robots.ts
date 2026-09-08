import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/i18n/locales";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", ...LOCALES.map((l) => `/${l}/favoritos`)],
    },
    sitemap: "https://football-cult.com/sitemap.xml",
  };
}
