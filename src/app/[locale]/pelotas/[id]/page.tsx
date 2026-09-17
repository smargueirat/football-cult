import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ballProducts } from "@/data/balls";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import BallDetailPageClient from "./BallDetailPageClient";

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

function findBall(id: string) {
  return ballProducts.find((p) => p.id === id);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, id } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const ball = findBall(id);
  if (!ball) return {};

  const tmpl = META_TEMPLATE[locale];
  const title = tmpl.title.replace("{model}", ball.model);
  const description = tmpl.description.replace("{model}", ball.model);
  const image = ball.offers[0]?.imageUrl;

  return {
    title,
    description,
    alternates: buildAlternates(locale, `/pelotas/${ball.id}`),
    openGraph: { title, description, type: "website", images: image ? [image] : undefined },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : undefined },
  };
}

export default async function BallDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const ball = findBall(id);
  if (!ball) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: ball.model,
    image: ball.offers[0]?.imageUrl ? [ball.offers[0].imageUrl] : undefined,
    url: `${SITE_URL}/${locale}/pelotas/${ball.id}`,
    brand: { "@type": "Brand", name: ball.brand },
    offers: ball.offers.map((o) => ({
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
      <BallDetailPageClient ball={ball} />
    </>
  );
}
