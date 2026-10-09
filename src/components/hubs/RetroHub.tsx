import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { HubLocale } from "@/data/teamMeta";
import type { TeamKey } from "@/data/products";
import { teamCategory, typeNames } from "@/lib/productMeta";
import { formatOfferMoney } from "@/lib/offerMoney";
import { translations } from "@/lib/i18n/translations";
import { RETRO_MIN, retroDecadeFacets, retroDecadeItems, retroTeamFacets, retroTeamItems } from "@/lib/extraHubs";
import { EXTRA } from "@/lib/extraHubStrings";
import { hubFacts } from "@/lib/hubFaq";
import { statsOf, teamItems, teamName, type HubItem } from "@/lib/hubs";
import { breadcrumbLd, hubMetadata, SITE_URL } from "@/lib/hubPages";
import { HUB } from "@/lib/hubStrings";
import { Crumbs, HubHeader, JsonLd, Section, TeamLinks } from "@/components/hubs/HubParts";
import HubFaq from "@/components/hubs/HubFaq";
import HubCatalog from "@/components/hubs/HubCatalog";
import { AllItemLinks, LinkChipRow } from "@/components/hubs/HubLinkParts";

// Hubs retro: /retro/[equipo] (equipos con RETRO_MIN+ camisetas vintage) y
// /retro/decada/[1970|1980|...]. "Retro" = temporada <= 2006 (isVintageRetro,
// regla fija del sitio). Listado con Filtros/Ordenar = el SearchExplorer de
// /retro con el equipo o la década forzados.
export type RetroSpec = { team: string } | { decade: string };

function resolve(spec: RetroSpec, locale: HubLocale) {
  const x = EXTRA[locale];
  if ("team" in spec) {
    const items = retroTeamItems(spec.team);
    if (items.length < RETRO_MIN) return null;
    const name = teamName(spec.team, locale);
    const national = teamCategory[spec.team as TeamKey] === "national";
    return { items, team: spec.team as TeamKey, decade: undefined, name, headline: x.retroTeamH1(name, national), path: `/retro/${spec.team}` };
  }
  const decade = Number(spec.decade);
  if (!/^\d{4}$/.test(spec.decade) || decade % 10) return null;
  const items = retroDecadeItems(decade);
  if (items.length < RETRO_MIN) return null;
  return { items, team: undefined, decade, name: x.decadeName(decade), headline: x.retroDecadeH1(decade), path: `/retro/decada/${decade}` };
}

// En EUR, como en BootListHub.
const priceOf = (items: HubItem[]) => (items.length ? formatOfferMoney(statsOf(items).minEur, "EUR") : "");

export function retroMetadata(spec: RetroSpec, locale: HubLocale): Metadata {
  const r = resolve(spec, locale);
  if (!r) return {};
  return hubMetadata(locale, r.path, r.headline, EXTRA[locale].retroMeta({ subject: r.headline, n: r.items.length, price: priceOf(r.items) }));
}

export default function RetroHub({ spec, locale }: { spec: RetroSpec; locale: HubLocale }) {
  const r = resolve(spec, locale);
  if (!r) notFound();
  const x = EXTRA[locale];
  const retroName = translations[locale].heroSlides[2]?.eyebrow ?? "Retro";
  const stats = statsOf(r.items);
  const seasons = r.items.map((i) => i.product.season);
  // Las preguntas de temporadas de HubFaq usan la plantilla de camiseta
  // ("¿Qué temporadas de {x} hay?"); con el titular del hub como sujeto
  // queda mal, y el rango ya lo dice la introducción.
  const facts = { ...hubFacts(r.items), seasons: undefined };
  const decades = retroDecadeFacets().filter((d) => d.decade !== r.decade);
  const teams = retroTeamFacets().filter((t) => t.team !== r.team);

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-8">
      <JsonLd
        data={[
          breadcrumbLd(locale, [{ name: HUB[locale].home, path: "" }, { name: retroName, path: "/retro" }, { name: r.headline }], r.path),
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
      <Crumbs locale={locale} trail={[{ label: retroName, href: `/${locale}/retro` }, { label: r.headline }]} />
      <HubHeader
        h1={r.headline}
        intro={x.retroIntro({ subject: r.headline, n: stats.count, oldest: seasons[0], newest: seasons[seasons.length - 1], stores: stats.stores, price: priceOf(r.items) })}
      />
      {r.team && teamItems(r.team).length > r.items.length && (
        <p className="-mt-5 mb-6 text-sm">
          <Link className="font-medium text-[#1B3B2B] underline decoration-[#C9A24B] underline-offset-2" href={`/${locale}/equipo/${r.team}`}>
            {x.retroCurrent(r.name)} →
          </Link>
        </p>
      )}

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
