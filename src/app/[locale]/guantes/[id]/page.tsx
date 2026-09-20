import { Metadata } from "next";
import { notFound } from "next/navigation";
import { gloveProducts } from "@/data/gloves";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import GloveDetailPageClient from "./GloveDetailPageClient";

const SITE_URL = "https://football-cult.com";

const META_TEMPLATE: Record<Locale, { title: string; description: string }> = {
  es: {
    title: "{model} — Comparar precios | Football Cult",
    description: "Compará precios de {model} entre distintas tiendas y comprá donde te convenga.",
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

function findGlove(id: string) {
  return gloveProducts.find((p) => p.id === id);
}

// ISR (2026-09-20): sin generateStaticParams estas páginas eran ƒ
// (cache-control no-store): cada visita de un usuario o de Googlebot
// ejecutaba una función que carga el catálogo entero -- la causa más
// probable de que la cuenta Hobby llegara al 100% de Fluid Active CPU.
// Con esto no se prerenderiza nada (no suma storage al deploy), pero la
// primera visita a cada URL queda cacheada en el CDN por un día.
export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, id } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const glove = findGlove(id);
  if (!glove) return {};

  const tmpl = META_TEMPLATE[locale];
  const title = tmpl.title.replace("{model}", glove.model);
  const description = tmpl.description.replace("{model}", glove.model);
  const image = glove.offers[0]?.imageUrl;

  return {
    title,
    description,
    alternates: buildAlternates(locale, `/guantes/${glove.id}`),
    openGraph: { title, description, type: "website", images: image ? [image] : undefined },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : undefined },
  };
}

export default async function GloveDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const glove = findGlove(id);
  if (!glove) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: glove.model,
    image: glove.offers[0]?.imageUrl ? [glove.offers[0].imageUrl] : undefined,
    url: `${SITE_URL}/${locale}/guantes/${glove.id}`,
    brand: { "@type": "Brand", name: glove.brand },
    offers: glove.offers.map((o) => ({
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
      <GloveDetailPageClient glove={glove} />
    </>
  );
}
