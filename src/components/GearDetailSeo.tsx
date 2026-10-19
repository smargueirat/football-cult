import type { Metadata } from "next";
import type { ReactNode } from "react";
import type { HubLocale } from "@/data/teamMeta";
import { buildAlternates } from "@/lib/i18n/locales";
import { bootOfferTotalInEUR, type BootCurrencyCode } from "@/lib/offerMoney";
import { productGtin, singleSizeGtin } from "@/lib/offerGtin";
import { translations } from "@/lib/i18n/translations";
import type { GearSection } from "@/lib/gearHubs";
import { OG_LOCALE, SITE_URL, aggregateOfferLd, brandLabel, gearDescription, itemPageLd, gearMpn, gearName, gearTitle, ldImage, ogImages, type GearLike } from "@/lib/seoMeta";
import { gearRelated, gearTrail } from "@/lib/detailLinks";
import { JsonLd } from "@/components/hubs/HubParts";
import { DetailCrumbs, RelatedLinks } from "@/components/DetailNav";
import DirectDeals from "@/components/DirectDeals";
import { cheaperAlternatives } from "@/lib/directDeals";
import { CONV } from "@/lib/convStrings";

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
  const mpn = gearMpn(item);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${url}#product`,
      name: gearName(section, item, locale),
      image: image ? [image.url] : undefined,
      url,
      sku: item.id,
      brand: { "@type": "Brand", name: brandLabel(item.brand) },
      ...(mpn ? { mpn } : {}),
      ...productGtin(item.offers),
      ...(item.colour ? { color: item.colour } : {}),
      offers: aggregateOfferLd(
        item.offers,
        url,
        (o) => bootOfferTotalInEUR({ price: o.price, shipping: o.shipping ?? 0, currency: o.currency as BootCurrencyCode }),
        singleSizeGtin,
      ),
    },
    ...itemPageLd(url, item.offers),
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <DetailCrumbs locale={locale} trail={gearTrail(section, item, locale)} current={path} />
      {children}
      {/* Ficha cara: parecidas un 15 %+ más baratas, con botón directo. */}
      <div className="mx-auto w-full max-w-6xl px-3 sm:px-6">
        <DirectDeals deals={cheaperAlternatives(section, item, all, locale)} title={CONV[locale].altCheaper} max={3} surface="alt" />
      </div>
      {/* El código en texto, no solo en el JSON-LD: es lo que se busca
          ("ie1802", "893873") y lo que un comprador compara entre tiendas. */}
      {mpn && (
        <p className="mx-auto w-full max-w-[1800px] px-4 pb-4 text-sm text-[#675c44] sm:px-8">
          {translations[locale].detail.manufacturerCode}: <span className="font-mono">{mpn}</span>
        </p>
      )}
      <RelatedLinks related={gearRelated(section, item, all, locale)} />
    </>
  );
}
