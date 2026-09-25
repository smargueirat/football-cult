import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HUB } from "@/lib/hubStrings";
import { SEASON_UI, typePlural } from "@/lib/seasonStrings";
import { asLocale, breadcrumbLd, hubMetadata, SITE_URL } from "@/lib/hubPages";
import { statsOf } from "@/lib/hubs";
import { SEASON_TYPES, seasonFromSlug, seasonTypeItems } from "@/lib/seasonHubs";
import { formatOfferMoney } from "@/lib/offerMoney";
import { Crumbs, HubHeader, JerseyGrid, JsonLd } from "@/components/hubs/HubParts";
import type { TypeKey } from "@/data/products";

export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

type P = { params: Promise<{ locale: string; season: string; type: string }> };

const money = (o: { price: number; shipping: number; currency: Parameters<typeof formatOfferMoney>[1] } | undefined) => (o ? formatOfferMoney(o.price + o.shipping, o.currency) : "");

function load(slug: string, type: string) {
  const season = seasonFromSlug(slug);
  if (!season || !(SEASON_TYPES as string[]).includes(type)) return null;
  const items = seasonTypeItems(season, type as TypeKey);
  return items.length >= 6 ? { season, items } : null;
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale: raw, season: slug, type } = await params;
  const locale = asLocale(raw);
  const d = load(slug, type);
  if (!d) return {};
  const h1 = SEASON_UI[locale].typeH1(typePlural(type as TypeKey, locale), d.season);
  return hubMetadata(locale, `/temporada/${slug}/${type}`, h1, SEASON_UI[locale].meta({ h1, n: d.items.length, price: money(statsOf(d.items).minOffer) }));
}

export default async function SeasonTypeHub({ params }: P) {
  const { locale: raw, season: slug, type } = await params;
  const locale = asLocale(raw);
  const d = load(slug, type);
  if (!d) notFound();
  const ui = SEASON_UI[locale];
  const plural = typePlural(type as TypeKey, locale);
  const h1 = ui.typeH1(plural, d.season);
  const items = [...d.items].sort((a, b) => a.eur - b.eur);

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-8">
      <JsonLd
        data={[
          breadcrumbLd(locale, [{ name: HUB[locale].home, path: "" }, { name: ui.seasonH1(d.season), path: `/temporada/${slug}` }, { name: h1 }], `/temporada/${slug}/${type}`),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: h1,
            url: `${SITE_URL}/${locale}/temporada/${slug}/${type}`,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: items.length,
              itemListElement: items.slice(0, 20).map((it, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/${locale}/camiseta/${it.product.id}` })),
            },
          },
        ]}
      />
      <Crumbs locale={locale} trail={[{ label: ui.seasonH1(d.season), href: `/${locale}/temporada/${slug}` }, { label: h1 }]} />
      <HubHeader h1={h1} intro={ui.typeIntro({ type: plural, season: d.season, n: items.length, price: money(statsOf(items).minOffer) })} />
      <JerseyGrid items={items} locale={locale} showTeam />
    </div>
  );
}
