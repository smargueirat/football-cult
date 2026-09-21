import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HUB } from "@/lib/hubStrings";
import { asLocale, breadcrumbLd, hubMetadata, SITE_URL } from "@/lib/hubPages";
import { kindsLabel, leagueTeams, statsOf, teamItems, teamName } from "@/lib/hubs";
import { leagueName, leagueOfTeam } from "@/data/teamMeta";
import { formatOfferMoney } from "@/lib/offerMoney";
import { Crumbs, HubHeader, JerseyGrid, JsonLd, Section, TeamLinks } from "@/components/hubs/HubParts";

// ISR: nada se prerenderiza (no suma storage al deploy) pero cada URL queda
// cacheada un día en el CDN -- mismo criterio que las fichas de producto
// (ver la nota en camiseta/[id]/page.tsx sobre el 100% de CPU de Hobby).
export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

type P = { params: Promise<{ locale: string; team: string }> };

function priceOf(items: ReturnType<typeof teamItems>) {
  const o = statsOf(items).minOffer;
  return o ? formatOfferMoney(o.price + o.shipping, o.currency) : "";
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale: raw, team } = await params;
  const locale = asLocale(raw);
  const items = teamItems(team);
  if (!items.length) return {};
  const name = teamName(team, locale);
  return hubMetadata(locale, `/equipo/${team}`, HUB[locale].teamH1(name), HUB[locale].metaTeam(name, priceOf(items)));
}

export default async function TeamHub({ params }: P) {
  const { locale: raw, team } = await params;
  const locale = asLocale(raw);
  const items = teamItems(team);
  if (!items.length) notFound();
  const s = HUB[locale];
  const name = teamName(team, locale);
  const stats = statsOf(items);
  const league = leagueOfTeam(team);
  const countryKey = league?.country;
  const kinds = kindsLabel(items, locale) || s.allJerseys.toLowerCase();

  const siblings = league
    ? leagueTeams(league.slug)
        .filter((k) => k !== team)
        .map((k) => ({ k, n: teamItems(k).length }))
        .sort((a, b) => b.n - a.n)
        .slice(0, 24)
    : [];

  const trail = [
    ...(league && countryKey ? [{ label: teamName(countryKey, locale), href: `/${locale}/pais/${countryKey}` }, { label: leagueName(league, locale), href: `/${locale}/liga/${league.slug}` }] : []),
    { label: name },
  ];

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-8">
      <JsonLd
        data={[
          breadcrumbLd(locale, [
            { name: s.home, path: "" },
            ...(league && countryKey ? [{ name: teamName(countryKey, locale), path: `/pais/${countryKey}` }, { name: leagueName(league, locale), path: `/liga/${league.slug}` }] : []),
            { name },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: s.teamH1(name),
            url: `${SITE_URL}/${locale}/equipo/${team}`,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: items.length,
              itemListElement: items.slice(0, 20).map((it, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${SITE_URL}/${locale}/camiseta/${it.product.id}`,
              })),
            },
          },
        ]}
      />
      <Crumbs locale={locale} trail={trail} />
      <HubHeader
        h1={s.teamH1(name)}
        intro={s.teamIntro({ team: name, n: stats.count, stores: stats.stores, price: priceOf(items), kinds })}
      />
      <Section title={s.allJerseys}>
        <JerseyGrid items={items} locale={locale} />
      </Section>
      {league && countryKey && (
        <Section title={s.otherTeams(leagueName(league, locale))}>
          <TeamLinks
            locale={locale}
            items={siblings.map(({ k, n }) => ({ href: `/${locale}/equipo/${k}`, name: teamName(k, locale), count: n }))}
          />
          <p className="mt-4 flex flex-wrap gap-4 text-sm">
            <a className="font-medium text-[#1B3B2B] underline" href={`/${locale}/liga/${league.slug}`}>
              {leagueName(league, locale)}
            </a>
            <a className="font-medium text-[#1B3B2B] underline" href={`/${locale}/pais/${countryKey}`}>
              {teamName(countryKey, locale)}
            </a>
          </p>
        </Section>
      )}
    </div>
  );
}
