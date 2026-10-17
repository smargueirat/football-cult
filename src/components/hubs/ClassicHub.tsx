import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { HubLocale } from "@/data/teamMeta";
import { teamCategory } from "@/lib/productMeta";
import { classicHub, classicTeamDecadeFacets, classicTeamFacets, retroTeamFacets, type ClassicSpec } from "@/lib/extraHubs";
import { EXTRA } from "@/lib/extraHubStrings";
import { CLASSIC } from "@/lib/classicStrings";
import { hubFacts } from "@/lib/hubFaq";
import { teamItems, teamName } from "@/lib/hubs";
import { breadcrumbLd, hubMetadata, SITE_URL } from "@/lib/hubPages";
import { HUB } from "@/lib/hubStrings";
import { Crumbs, HubHeader, JsonLd, Section, TeamLinks } from "@/components/hubs/HubParts";
import HubFaq from "@/components/hubs/HubFaq";
import HubCatalog from "@/components/hubs/HubCatalog";
import { AllItemLinks, LinkChipRow } from "@/components/hubs/HubLinkParts";

// Clásicas (temporadas 2007-2019, isClassicKit; 2026-10-17): /clasicas,
// /clasicas/[equipo] y /clasicas/[equipo]/[década]. Mismo diseño que
// RetroHub (datos en extraHubs.ts classicHub); listado = SearchExplorer con
// Filtros/Ordenar y el tramo 2007-2019 forzado.
export function classicMetadata(spec: ClassicSpec, locale: HubLocale): Metadata {
  const r = classicHub(spec, locale);
  if (!r) return {};
  return { ...hubMetadata(locale, r.path, r.headline, r.description), title: r.title };
}

export default function ClassicHub({ spec, locale }: { spec: ClassicSpec; locale: HubLocale }) {
  const r = classicHub(spec, locale);
  if (!r) notFound();
  const c = CLASSIC[locale];
  const x = EXTRA[locale];
  const facts = { ...hubFacts(r.items), seasons: undefined };
  const teams = classicTeamFacets().filter((t) => t.team !== r.team);
  const teamDecades = r.team ? classicTeamDecadeFacets(r.team).filter((d) => d.decade !== r.decade) : [];
  const national = r.team ? teamCategory[r.team] === "national" : false;
  const teamHubCrumb = r.team && r.decade !== undefined ? [{ name: c.teamH1(r.name, national), path: `/clasicas/${r.team}` }] : [];
  const sectionCrumb = r.team ? [{ name: c.nav, path: "/clasicas" }] : [];
  const hasRetro = r.team ? retroTeamFacets().some((f) => f.team === r.team) : true;

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-8">
      <JsonLd
        data={[
          breadcrumbLd(locale, [{ name: HUB[locale].home, path: "" }, ...sectionCrumb, ...teamHubCrumb, { name: r.headline }], r.path),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: r.headline,
            url: `${SITE_URL}/${locale}${r.path}`,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: r.items.length,
              itemListElement: r.items.slice(0, 20).map((it, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/${locale}/camiseta/${it.product.id}` })),
            },
          },
        ]}
      />
      <Crumbs
        locale={locale}
        trail={[...[...sectionCrumb, ...teamHubCrumb].map((t) => ({ label: t.name, href: `/${locale}${t.path}` })), { label: r.headline }]}
      />
      <HubHeader h1={r.headline} intro={r.intro} />
      {teamDecades.length > 0 && (
        <nav aria-label={c.byDecade}>
          <LinkChipRow
            title={c.byDecade}
            items={teamDecades.map((d) => ({ href: `/${locale}/clasicas/${r.team}/${d.decade}`, label: `${c.decadeName(d.decade)} (${d.count})` }))}
          />
        </nav>
      )}
      <p className="-mt-5 mb-6 flex flex-wrap gap-4 text-sm">
        {r.team && teamItems(r.team).length > r.items.length && (
          <Link className="font-medium text-[#1B3B2B] underline decoration-[#C9A24B] underline-offset-2" href={`/${locale}/equipo/${r.team}`}>
            {x.retroCurrent(r.name)} →
          </Link>
        )}
        {hasRetro && (
          <Link className="font-medium text-[#1B3B2B] underline decoration-[#C9A24B] underline-offset-2" href={`/${locale}/retro${r.team ? `/${r.team}` : ""}`}>
            {r.team ? x.retroTeamH1(r.name, national) : c.retroLink} →
          </Link>
        )}
      </p>

      <HubCatalog forcedSection="jerseys" forcedType="retro" forcedClassic forcedTeam={r.team} forcedDecade={r.decade} />

      <HubFaq locale={locale} subject={r.headline} facts={facts} variant="gear" />
      {r.team && (
        <AllItemLinks
          title={x.allModels(r.items.length)}
          items={r.items.map(({ product: p }) => ({ href: `/${locale}/camiseta/${p.id}`, label: `${teamName(p.teamKey, locale)} ${p.season}` }))}
        />
      )}

      {teams.length > 0 && (
        <Section title={c.byTeam}>
          <TeamLinks
            locale={locale}
            items={(r.team ? teams.slice(0, 48) : teams).map((t) => ({ href: `/${locale}/clasicas/${t.team}`, name: teamName(t.team, locale), count: t.count }))}
          />
        </Section>
      )}
    </div>
  );
}
