import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HUB } from "@/lib/hubStrings";
import { asLocale, breadcrumbLd, hubMetadata, SITE_URL } from "@/lib/hubPages";
import { cheapest, leagueTeams, statsOf, teamItems, teamName } from "@/lib/hubs";
import { LEAGUES, leagueName } from "@/data/teamMeta";
import { formatOfferMoney } from "@/lib/offerMoney";
import DaznLayout from "@/components/hubs/DaznLayout";
import { Crumbs, HubHeader, JerseyGrid, JsonLd, Section, TeamLinks } from "@/components/hubs/HubParts";

export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

type P = { params: Promise<{ locale: string; league: string }> };

function load(slug: string) {
  const league = LEAGUES.find((l) => l.slug === slug);
  if (!league) return null;
  const teams = leagueTeams(slug);
  if (!teams.length) return null;
  const items = teams.flatMap((k) => teamItems(k));
  return { league, teams, items, stats: statsOf(items) };
}

function money(o: { price: number; shipping: number; currency: Parameters<typeof formatOfferMoney>[1] } | undefined) {
  return o ? formatOfferMoney(o.price + o.shipping, o.currency) : "";
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale: raw, league: slug } = await params;
  const locale = asLocale(raw);
  const d = load(slug);
  if (!d) return {};
  const name = leagueName(d.league, locale);
  return hubMetadata(locale, `/liga/${slug}`, HUB[locale].leagueH1(name), HUB[locale].metaGeneric(name, d.stats.count, money(d.stats.minOffer)));
}

export default async function LeagueHub({ params }: P) {
  const { locale: raw, league: slug } = await params;
  const locale = asLocale(raw);
  const d = load(slug);
  if (!d) notFound();
  const s = HUB[locale];
  const name = leagueName(d.league, locale);
  const countryName = teamName(d.league.country, locale);
  const teamLinks = d.teams
    .map((k) => {
      const items = teamItems(k);
      return { href: `/${locale}/equipo/${k}`, name: teamName(k, locale), count: items.length, price: money(statsOf(items).minOffer) };
    })
    .sort((a, b) => a.name.localeCompare(b.name, locale));

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-8">
      <JsonLd
        data={[
          breadcrumbLd(locale, [
            { name: s.home, path: "" },
            { name: countryName, path: `/pais/${d.league.country}` },
            { name },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: s.leagueH1(name),
            url: `${SITE_URL}/${locale}/liga/${slug}`,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: d.teams.length,
              itemListElement: d.teams.map((k, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/${locale}/equipo/${k}` })),
            },
          },
        ]}
      />
      <DaznLayout league={slug} leagueName={name}>
        <Crumbs locale={locale} trail={[{ label: countryName, href: `/${locale}/pais/${d.league.country}` }, { label: name }]} />
        <HubHeader
          h1={s.leagueH1(name)}
          intro={s.leagueIntro({ league: name, teams: d.teams.length, n: d.stats.count, price: money(d.stats.minOffer) })}
        />
        <Section title={s.teams}>
          <TeamLinks items={teamLinks} locale={locale} />
        </Section>
        <Section title={s.bestDeals}>
          <JerseyGrid items={cheapest(d.items, 12)} locale={locale} showTeam />
        </Section>
      </DaznLayout>
    </div>
  );
}
