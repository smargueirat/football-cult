import type { Metadata } from "next";
import { HUB } from "@/lib/hubStrings";
import { asLocale, breadcrumbLd, hubMetadata } from "@/lib/hubPages";
import { leagueTeams, teamItems, teamName } from "@/lib/hubs";
import { SEASON_UI } from "@/lib/seasonStrings";
import { priceDrops, seasonItems, seasonList, seasonSlug } from "@/lib/seasonHubs";
import { COUNTRY_SLUGS, LEAGUES, leagueName } from "@/data/teamMeta";
import { Crumbs, HubHeader, JsonLd, Section, TeamLinks } from "@/components/hubs/HubParts";

export const revalidate = 86400;

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = asLocale(raw);
  return hubMetadata(locale, "/ligas", HUB[locale].leaguesIndex, HUB[locale].indexIntro);
}

export default async function LeaguesIndex({ params }: P) {
  const { locale: raw } = await params;
  const locale = asLocale(raw);
  const s = HUB[locale];
  const leagues = LEAGUES.map((l) => ({ l, n: leagueTeams(l.slug).flatMap((k) => teamItems(k)).length })).filter((x) => x.n > 0);
  const countries = COUNTRY_SLUGS.map((c) => ({ c, name: teamName(c, locale) })).sort((a, b) => a.name.localeCompare(b.name, locale));

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-8">
      <JsonLd data={breadcrumbLd(locale, [{ name: s.home, path: "" }, { name: s.leaguesIndex }])} />
      <Crumbs locale={locale} trail={[{ label: s.leaguesIndex }]} />
      <HubHeader h1={s.leaguesIndex} intro={s.indexIntro} />
      <Section title={s.browseLeagues}>
        <TeamLinks
          locale={locale}
          items={leagues.map(({ l, n }) => ({ href: `/${locale}/liga/${l.slug}`, name: leagueName(l, locale), count: n }))}
        />
      </Section>
      <Section title={SEASON_UI[locale].seasons}>
        <TeamLinks
          locale={locale}
          items={[
            ...seasonList().map((se) => ({ href: `/${locale}/temporada/${seasonSlug(se)}`, name: SEASON_UI[locale].seasonH1(se), count: seasonItems(se).length })),
            { href: `/${locale}/ofertas`, name: SEASON_UI[locale].offersH1, count: priceDrops().length },
          ]}
        />
      </Section>
      <Section title={s.browseCountries}>
        <TeamLinks
          locale={locale}
          items={countries.map(({ c, name }) => ({
            href: `/${locale}/pais/${c}`,
            name,
            count: [c, ...LEAGUES.filter((l) => l.country === c).flatMap((l) => leagueTeams(l.slug))].reduce((a, k) => a + teamItems(k).length, 0),
          }))}
        />
      </Section>
    </div>
  );
}
