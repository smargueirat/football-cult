import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { bootProducts } from "@/data/boots";
import bootAliases from "@/data/bootAliases.json";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { brandFacets, brandGroundCombos, byBrand, byBrandGround, byGround, cheapestFirst, groundFacets, groundSlug, slugify } from "@/lib/gearHubs";
import BootDetailClient from "./BootDetailClient";
import { archiveStatsFor } from "@/lib/priceArchive";
import { HubBacklinks } from "@/components/hubs/HubLinkParts";
import { EXTRA } from "@/lib/extraHubStrings";
import { lineFacets } from "@/lib/extraHubs";
import { bootLinesOf, isKidsBoot } from "@/lib/bootLines";
import { brandHeadline, groundName } from "@/lib/gearHubStrings";
import { asLocale } from "@/lib/hubPages";
import type { HubLocale } from "@/data/teamMeta";

// Enlaces de la ficha a sus hubs (marca, línea, terreno, niño/sala): solo a
// los que existen hoy (los mismos facets que generan esas páginas).
function bootHubLinks(boot: NonNullable<ReturnType<typeof findBoot>>, locale: HubLocale) {
  const x = EXTRA[locale];
  const out: { href: string; label: string }[] = [];
  const brand = brandFacets("botas").find((b) => b.slug === slugify(boot.brand));
  if (brand) out.push({ href: `/${locale}/botas/marca/${brand.slug}`, label: brandHeadline("botas", brand.name, locale) });
  const mine = new Set(bootLinesOf(boot));
  for (const l of lineFacets()) if (mine.has(l.slug)) out.push({ href: `/${locale}/botas/linea/${l.slug}`, label: brandHeadline("botas", l.name, locale) });
  if (isKidsBoot(boot)) out.push({ href: `/${locale}/botas/ninos`, label: x.kidsH1 });
  else if (boot.groundType === "IC") out.push({ href: `/${locale}/botas/futbol-sala`, label: x.futsalH1 });
  else {
    const g = groundFacets().find((f) => f.name === boot.groundType);
    if (g) out.push({ href: `/${locale}/botas/terreno/${groundSlug(g.name)}`, label: groundName(g.name, locale) });
  }
  return out;
}

const SITE_URL = "https://football-cult.com";

const META_TEMPLATE: Record<Locale, { title: string; description: string }> = {
  es: {
    title: "{model} — Comparar precios | Football Cult",
    description: "Compara precios de {model} entre distintas tiendas y compra donde más te convenga.",
  },
  en: {
    title: "{model} — Compare Prices | Football Cult",
    description: "Compare prices for {model} across stores and buy wherever suits you best.",
  },
  pt: {
    title: "{model} — Comparar Preços | Football Cult",
    description: "Compare preços de {model} entre lojas e compre onde for melhor para você.",
  },
  fr: {
    title: "{model} — Comparer les prix | Football Cult",
    description: "Comparez les prix de {model} entre boutiques et achetez où cela vous convient.",
  },
  it: {
    title: "{model} — Confronta i prezzi | Football Cult",
    description: "Confronta i prezzi di {model} tra i negozi e acquista dove preferisci.",
  },
};

function findBoot(id: string) {
  return bootProducts.find((p) => p.id === id);
}

// ISR (2026-09-20): sin generateStaticParams estas páginas eran ƒ
// (cache-control no-store): cada visita de un usuario o de Googlebot
// ejecutaba una función que carga el catálogo entero -- la causa más
// probable de que la cuenta Hobby llegara al 100% de Fluid Active CPU.
// Con esto no se prerenderiza nada (no suma storage al deploy), pero la
// primera visita a cada URL queda cacheada en el CDN por un día.
export const revalidate = 86400;

// Pre-generación parcial (2026-09-22, pedido explícito "si no afecta el
// rendimiento"). No hay señal real de popularidad guardada en el repo
// (sin Vercel Analytics ni log de click_offer persistido), así que el
// proxy usado es: qué botas están efectivamente linkeadas desde los hubs
// estáticos de marca/terreno (marca/[brand], terreno/[ground],
// marca/[brand]/[ground]) -- esas rutas están, según los logs de runtime
// que motivaron este cambio, entre las de más tráfico del sitio junto
// con esta. GearHub (src/components/hubs/GearHub.tsx) linkea las
// primeras 60 más baratas (cheapestFirst) de cada hub; acá se toman solo
// las primeras 20 de cada uno -- suficiente para ser "la parte de arriba
// de la parte de arriba" (lo primero que un click real o un crawler
// encuentra en cada hub) sin acercarse al límite de build de Vercel
// Hobby. Medido en este repo con `npm run build` (2026-09-22): sin esto,
// 53.8s de build / 162 páginas estáticas. Con tope 60 por hub: ~1677
// botas (8385 páginas x5 locales), 87.9s (+34s). Con el tope 20 de
// abajo: 734 botas (3670 páginas x5 locales), 74.6s (+21s) -- el elegido,
// bien dentro de "unos minutos" y lejos de los límites de Build Minutes
// de Vercel Hobby. El resto del catálogo (miles de botas) sigue
// generándose on-demand con el ISR de arriba, sin cambios.
export function generateStaticParams() {
  const ids = new Set<string>();
  const take = (items: ReturnType<typeof byBrand>) => cheapestFirst(items).slice(0, 20).forEach((i) => ids.add(i.id));
  for (const b of brandFacets("botas")) take(byBrand("botas", b.slug));
  for (const g of groundFacets()) take(byGround(g.name));
  for (const c of brandGroundCombos()) take(byBrandGround(c.brandSlug, c.ground));
  return [...ids].map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, id } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const boot = findBoot(id);
  if (!boot) return {};

  const tmpl = META_TEMPLATE[locale];
  const title = tmpl.title.replace("{model}", boot.model);
  const description = tmpl.description.replace("{model}", boot.model);
  const image = boot.offers[0]?.imageUrl;

  return {
    title,
    description,
    alternates: buildAlternates(locale, `/botas/${boot.id}`),
    openGraph: { title, description, type: "website", images: image ? [image] : undefined },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : undefined },
  };
}

export default async function BootDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const boot = findBoot(id);
  if (!boot?.offers.length) {
    // Ficha fundida con otra (misma bota en otra tienda, ver merge_by_code en
    // scripts/boots-mining/refresh_boots.py): su URL vieja redirige a la que
    // la absorbió en vez de dar 404.
    const target = (bootAliases as Record<string, string>)[id];
    if (target && findBoot(target)) permanentRedirect(`/${locale}/botas/${target}`);
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: boot.model,
    image: boot.offers[0]?.imageUrl ? [boot.offers[0].imageUrl] : undefined,
    url: `${SITE_URL}/${locale}/botas/${boot.id}`,
    brand: { "@type": "Brand", name: boot.brand },
    offers: boot.offers.map((o) => ({
      "@type": "Offer",
      url: o.url,
      price: o.price,
      priceCurrency: o.currency,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: o.store },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BootDetailClient boot={boot} archiveStats={archiveStatsFor(boot.offers.map((o) => o.url))} />
      <HubBacklinks label={EXTRA[asLocale(locale)].explore} items={bootHubLinks(boot, asLocale(locale))} />
    </>
  );
}
