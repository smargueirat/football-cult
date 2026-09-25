import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HUB } from "@/lib/hubStrings";
import { SEASON_UI, typePlural } from "@/lib/seasonStrings";
import { asLocale, breadcrumbLd, hubMetadata, SITE_URL } from "@/lib/hubPages";
import { cheapest, statsOf, teamName } from "@/lib/hubs";
import { seasonFromSlug, seasonItems, seasonSlug, seasonTeams, seasonTypeItems, seasonTypes } from "@/lib/seasonHubs";
import { formatOfferMoney } from "@/lib/offerMoney";
import { Crumbs, HubHeader, JerseyGrid, JsonLd, Section, TeamLinks } from "@/components/hubs/HubParts";

export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

type P = { params: Promise<{ locale: string; season: string }> };

const money = (o: { price: number; shipping: number; currency: Parameters<typeof formatOfferMoney>[1] } | undefined) => (o ? formatOfferMoney(o.price + o.shipping, o.currency) : "");

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale: raw, season: slug } = await params;
  const locale = asLocale(raw);
  const season = seasonFromSlug(slug);
  if (!season) return {};
  const items = seasonItems(season);
  const h1 = SEASON_UI[locale].seasonH1(season);
  return hubMetadata(locale, `/temporada/${slug}`, h1, SEASON_UI[locale].meta({ h1, n: items.length, price: money(statsOf(items).minOffer) }));
}

export default async function SeasonHub({ params }: P) {
  const { locale: raw, season: slug } = await params;
  const locale = asLocale(raw);
  const season = seasonFromSlug(slug);
  if (!season) notFound();
  const ui = SEASON_UI[locale];
  const items = seasonItems(season);
  const teams = seasonTeams(season);
  const types = seasonTypes(season);
  const h1 = ui.seasonH1(season);

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-8">
      <JsonLd
        data={[
          breadcrumbLd(locale, [{ name: HUB[locale].home, path: "" }, { name: h1 }], `/temporada/${slug}`),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: h1,
            url: `${SITE_URL}/${locale}/temporada/${slug}`,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: teams.length,
              itemListElement: teams.slice(0, 50).map((t, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/${locale}/equipo/${t.team}` })),
            },
          },
        ]}
      />
      <Crumbs locale={locale} trail={[{ label: h1 }]} />
      <HubHeader h1={h1} intro={ui.seasonIntro({ season, n: items.length, teams: teams.length, price: money(statsOf(items).minOffer) })} />
      <Section title={ui.byType}>
        <TeamLinks
          locale={locale}
          countLabel={HUB[locale].jerseysCount}
          items={types.map((t) => ({ href: `/${locale}/temporada/${slug}/${t.type}`, name: typePlural(t.type, locale), count: t.count }))}
        />
      </Section>
      {types.map((t) => (
        <Section key={t.type} title={ui.cheapestOf(typePlural(t.type, locale))}>
          <JerseyGrid items={cheapest(seasonTypeItems(season, t.type), 12)} locale={locale} showTeam />
          <p className="mt-3 text-sm">
            <a className="font-medium text-[#1B3B2B] underline" href={`/${locale}/temporada/${slug}/${t.type}`}>
              {typePlural(t.type, locale)} {season} →
            </a>
          </p>
        </Section>
      ))}
      <Section title={ui.teams}>
        <TeamLinks
          locale={locale}
          items={teams.slice(0, 80).map((t) => ({ href: `/${locale}/equipo/${t.team}#s-${seasonSlug(season)}`, name: teamName(t.team, locale), count: t.count }))}
        />
      </Section>
    </div>
  );
}
