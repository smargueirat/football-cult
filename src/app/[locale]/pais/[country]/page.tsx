import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HUB } from "@/lib/hubStrings";
import { asLocale, breadcrumbLd, hubMetadata, SITE_URL } from "@/lib/hubPages";
import { cheapest, countryTeams, leagueTeams, statsOf, teamItems, teamName } from "@/lib/hubs";
import { COUNTRY_SLUGS, leagueName, leaguesOfCountry } from "@/data/teamMeta";
import { formatOfferMoney } from "@/lib/offerMoney";
import { Crumbs, HubHeader, JerseyGrid, JsonLd, Section, TeamLinks } from "@/components/hubs/HubParts";

export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

type P = { params: Promise<{ locale: string; country: string }> };

function load(slug: string) {
  if (!COUNTRY_SLUGS.includes(slug)) return null;
  const leagues = leaguesOfCountry(slug).filter((l) => leagueTeams(l.slug).length > 0);
  const teams = countryTeams(slug);
  if (!teams.length) return null;
  const items = teams.flatMap((k) => teamItems(k));
  return { leagues, teams, items, stats: statsOf(items) };
}

function money(o: { price: number; shipping: number; currency: Parameters<typeof formatOfferMoney>[1] } | undefined) {
  return o ? formatOfferMoney(o.price + o.shipping, o.currency) : "";
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale: raw, country } = await params;
  const locale = asLocale(raw);
  const d = load(country);
  if (!d) return {};
  const name = teamName(country, locale);
  return hubMetadata(locale, `/pais/${country}`, HUB[locale].countryH1(name), HUB[locale].metaGeneric(name, d.stats.count, money(d.stats.minOffer)));
}

export default async function CountryHub({ params }: P) {
  const { locale: raw, country } = await params;
  const locale = asLocale(raw);
  const d = load(country);
  if (!d) notFound();
  const s = HUB[locale];
  const name = teamName(country, locale);
  const clubCount = d.teams.filter((k) => k !== country).length;
  const link = (k: string) => {
    const items = teamItems(k);
    return { href: `/${locale}/equipo/${k}`, name: teamName(k, locale), count: items.length, price: money(statsOf(items).minOffer) };
  };

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-8">
      <JsonLd
        data={[
          breadcrumbLd(locale, [{ name: s.home, path: "" }, { name: s.leaguesIndex, path: "/ligas" }, { name }], `/pais/${country}`),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: s.countryH1(name),
            url: `${SITE_URL}/${locale}/pais/${country}`,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: d.teams.length,
              itemListElement: d.teams.map((k, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/${locale}/equipo/${k}` })),
            },
          },
        ]}
      />
      <Crumbs locale={locale} trail={[{ label: s.leaguesIndex, href: `/${locale}/ligas` }, { label: name }]} />
      <HubHeader
        h1={s.countryH1(name)}
        intro={s.countryIntro({ country: name, leagues: d.leagues.length, teams: clubCount, n: d.stats.count, price: money(d.stats.minOffer) })}
      />
      {teamItems(country).length > 0 && (
        <Section title={s.nationalTeam}>
          <TeamLinks items={[link(country)]} locale={locale} />
        </Section>
      )}
      {d.leagues.map((l) => (
        <Section key={l.slug} title={leagueName(l, locale)}>
          <TeamLinks items={leagueTeams(l.slug).map(link).sort((a, b) => b.count - a.count)} locale={locale} />
          <p className="mt-3 text-sm">
            <a className="font-medium text-[#1B3B2B] underline" href={`/${locale}/liga/${l.slug}`}>
              {leagueName(l, locale)} →
            </a>
          </p>
        </Section>
      ))}
      <Section title={s.bestDeals}>
        <JerseyGrid items={cheapest(d.items, 12)} locale={locale} showTeam />
      </Section>
    </div>
  );
}
