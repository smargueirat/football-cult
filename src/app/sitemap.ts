import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { LOCALES } from "@/lib/i18n/locales";

const BASE_URL = "https://football-cult.com";

function languagesFor(path: string) {
  return Object.fromEntries(
    LOCALES.map((l) => [l, `${BASE_URL}/${l}${path}`])
  ) as Record<string, string>;
}

export default function sitemap(): MetadataRoute.Sitemap {
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

  return [...staticRoutes, ...productRoutes];
}
