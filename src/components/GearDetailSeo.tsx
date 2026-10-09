import type { Metadata } from "next";
import type { ReactNode } from "react";
import type { HubLocale } from "@/data/teamMeta";
import { buildAlternates } from "@/lib/i18n/locales";
import { bootOfferTotalInEUR, type BootCurrencyCode } from "@/lib/offerMoney";
import { productMpn } from "@/lib/offerGtin";
import type { GearSection } from "@/lib/gearHubs";
import { OG_LOCALE, SITE_URL, aggregateOfferLd, brandLabel, gearDescription, gearName, gearTitle, ldImage, ogImages, type GearLike } from "@/lib/seoMeta";
import { gearRelated, gearTrail } from "@/lib/detailLinks";
import { JsonLd } from "@/components/hubs/HubParts";
import { DetailCrumbs, RelatedLinks } from "@/components/DetailNav";

// Metadatos, JSON-LD, migas y relacionados de las cinco fichas de
// equipamiento (botas, ropa, guantes, pelotas, entrenamiento): eran cinco
// copias del mismo page.tsx con el título "{model} — Comparar precios".

const firstImage = (item: GearLike) => item.offers.find((o) => o.imageUrl)?.imageUrl;

export function gearDetailMetadata(section: GearSection, item: GearLike, locale: HubLocale): Metadata {
  const title = gearTitle(section, item, locale);
  const description = gearDescription(section, item, locale);
  const path = `/${section}/${item.id}`;
  const images = ogImages(firstImage(item));
  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: { title, description, type: "website", url: `${SITE_URL}/${locale}${path}`, siteName: "Football Cult", locale: OG_LOCALE[locale], images },
    twitter: { card: "summary_large_image", title, description, images: images?.map((i) => i.url) },
  };
}

export function GearDetailFrame({
  section,
  item,
  all,
  locale,
  children,
}: {
  section: GearSection;
  item: GearLike;
  all: readonly GearLike[];
  locale: HubLocale;
  children: ReactNode;
}) {
  const path = `/${section}/${item.id}`;
  const url = `${SITE_URL}/${locale}${path}`;
  const image = ldImage(firstImage(item));
  const mpn = productMpn([...item.offers]);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: gearName(section, item, locale),
    image: image ? [image.url] : undefined,
    url,
    brand: { "@type": "Brand", name: brandLabel(item.brand) },
    ...(mpn ? { mpn } : {}),
    ...(item.colour ? { color: item.colour } : {}),
    offers: aggregateOfferLd(item.offers, url, (o) =>
      bootOfferTotalInEUR({ price: o.price, shipping: o.shipping ?? 0, currency: o.currency as BootCurrencyCode }),
    ),
  };
  return (
    <>
      <JsonLd data={jsonLd} />
      <DetailCrumbs locale={locale} trail={gearTrail(section, item, locale)} current={path} />
      {children}
      <RelatedLinks related={gearRelated(section, item, all, locale)} />
    </>
  );
}
