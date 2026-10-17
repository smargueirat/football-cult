import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { HubLocale } from "@/data/teamMeta";
import { teamCategory, typeNames } from "@/lib/productMeta";
import { translations } from "@/lib/i18n/translations";
import { classicTeamFacets, retroDecadeFacets, retroHub, retroTeamDecadeFacets, retroTeamFacets, type RetroSpec } from "@/lib/extraHubs";
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

// Hubs retro: /retro/[equipo], /retro/[equipo]/[década] y
// /retro/decada/[1970|1980|...] (datos, título e intro en extraHubs.ts
// retroHub). "Retro" = temporada <= 2006 (isVintageRetro, regla fija del
// sitio). Listado con Filtros/Ordenar = el SearchExplorer de /retro con el
// equipo y/o la década forzados.
export type { RetroSpec };

export function retroMetadata(spec: RetroSpec, locale: HubLocale): Metadata {
  const r = retroHub(spec, locale);
  if (!r) return {};
  return { ...hubMetadata(locale, r.path, r.headline, r.description), title: r.title };
}

export default function RetroHub({ spec, locale }: { spec: RetroSpec; locale: HubLocale }) {
  const r = retroHub(spec, locale);
  if (!r) notFound();
  const x = EXTRA[locale];
  const retroName = translations[locale].heroSlides[2]?.eyebrow ?? "Retro";
  // Las preguntas de temporadas de HubFaq usan la plantilla de camiseta
  // ("¿Qué temporadas de {x} hay?"); con el titular del hub como sujeto
  // queda mal, y la introducción ya lista las temporadas.
  const facts = { ...hubFacts(r.items), seasons: undefined };
  const decades = retroDecadeFacets().filter((d) => d.decade !== r.decade);
  const teams = retroTeamFacets().filter((t) => t.team !== r.team);
  // Equipo: sus décadas con hub propio; equipo+década: las otras décadas del
  // mismo equipo (y el hub del equipo va en las migas).
  const teamDecades = r.team ? retroTeamDecadeFacets(r.team).filter((d) => d.decade !== r.decade) : [];
  const national = r.team ? teamCategory[r.team] === "national" : false;
  const teamHubCrumb = r.team && r.decade !== undefined ? [{ name: x.retroTeamH1(r.name, national), path: `/retro/${r.team}` }] : [];

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-8">
      <JsonLd
        data={[
          breadcrumbLd(locale, [{ name: HUB[locale].home, path: "" }, { name: retroName, path: "/retro" }, ...teamHubCrumb, { name: r.headline }], r.path),
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
        trail={[{ label: retroName, href: `/${locale}/retro` }, ...teamHubCrumb.map((c) => ({ label: c.name, href: `/${locale}${c.path}` })), { label: r.headline }]}
      />
      <HubHeader h1={r.headline} intro={r.intro} />
      {teamDecades.length > 0 && (
        <nav aria-label={x.retroByDecade}>
          <LinkChipRow
            title={x.retroByDecade}
            items={teamDecades.map((d) => ({ href: `/${locale}/retro/${r.team}/${d.decade}`, label: `${x.decadeName(d.decade)} (${d.count})` }))}
          />
        </nav>
      )}
      <p className="-mt-5 mb-6 flex flex-wrap gap-4 text-sm">
        {r.team && teamItems(r.team).length > r.items.length && (
          <Link className="font-medium text-[#1B3B2B] underline decoration-[#C9A24B] underline-offset-2" href={`/${locale}/equipo/${r.team}`}>
            {x.retroCurrent(r.name)} →
          </Link>
        )}
        {(!r.team || classicTeamFacets().some((f) => f.team === r.team)) && (
          <Link className="font-medium text-[#1B3B2B] underline decoration-[#C9A24B] underline-offset-2" href={`/${locale}/clasicas${r.team ? `/${r.team}` : ""}`}>
            {r.team ? CLASSIC[locale].teamH1(r.name, national) : CLASSIC[locale].allH1} →
          </Link>
        )}
      </p>

      <HubCatalog forcedSection="jerseys" forcedType="retro" forcedTeam={r.team} forcedDecade={r.decade} />

      <HubFaq locale={locale} subject={r.headline} facts={facts} variant="gear" />
      <AllItemLinks
        title={x.allModels(r.items.length)}
        items={r.items.map(({ product: p }) => ({
          href: `/${locale}/camiseta/${p.id}`,
          label: `${teamName(p.teamKey, locale)} ${p.season}${p.typeKey === "retro" ? "" : ` · ${typeNames[p.typeKey][locale]}`}`,
        }))}
      />

      <nav aria-label={x.explore}>
        <LinkChipRow title={x.retroByDecade} items={decades.map((d) => ({ href: `/${locale}/retro/decada/${d.decade}`, label: x.decadeName(d.decade) }))} />
      </nav>
      {teams.length > 0 && (
        <Section title={x.retroByTeam}>
          <TeamLinks locale={locale} items={teams.slice(0, 48).map((t) => ({ href: `/${locale}/retro/${t.team}`, name: teamName(t.team, locale), count: t.count }))} />
        </Section>
      )}
    </div>
  );
}
