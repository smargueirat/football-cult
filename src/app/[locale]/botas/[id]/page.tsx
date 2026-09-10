import { Metadata } from "next";
import { notFound } from "next/navigation";
import { bootProducts } from "@/data/boots";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import BootDetailClient from "./BootDetailClient";

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

function findBoot(id: string) {
  return bootProducts.find((p) => p.id === id);
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
  if (!boot) notFound();

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
      priceCurrency: "EUR",
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
      <BootDetailClient boot={boot} />
    </>
  );
}
