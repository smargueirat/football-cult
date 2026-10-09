import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { HubLocale } from "@/data/teamMeta";
import { formatOfferMoney } from "@/lib/offerMoney";
import { translations } from "@/lib/i18n/translations";
import {
  TICKET_MIN,
  teamKeyForTicketName,
  ticketCompetitionFacets,
  ticketCompetitionItems,
  ticketStats,
  ticketTeamFacets,
  ticketTeamItems,
  ticketTeams,
} from "@/lib/ticketHubs";
import { EXTRA } from "@/lib/extraHubStrings";
import { teamNames } from "@/lib/productMeta";
import { breadcrumbLd, hubMetadata, SITE_URL } from "@/lib/hubPages";
import { HUB } from "@/lib/hubStrings";
import { Crumbs, HubHeader, JsonLd, Section, TeamLinks } from "@/components/hubs/HubParts";
import { AllItemLinks, LinkChipRow } from "@/components/hubs/HubLinkParts";
import TicketsPageClient from "@/app/[locale]/tickets/TicketsPageClient";

// Hubs de entradas: /tickets/equipo/[slug] y /tickets/competicion/[slug],
// con el listado de /tickets (Filtros + Ordenar) recortado al hub. El nombre
// es el del feed ("Inter Milan"); si coincide con un equipo del catálogo de
// camisetas se muestra con el nombre localizado y se enlaza a su hub.
export type TicketSpec = { team: string } | { competition: string };

function resolve(spec: TicketSpec, locale: HubLocale) {
  const x = EXTRA[locale];
  if ("team" in spec) {
    const facet = ticketTeamFacets().find((f) => f.slug === spec.team);
    if (!facet) return null;
    const items = ticketTeamItems(spec.team);
    const key = teamKeyForTicketName(facet.name);
    const name = key ? teamNames[key][locale] : facet.name;
    return { items, raw: facet.name, key, name, headline: x.ticketTeamH1(name), path: `/tickets/equipo/${spec.team}`, isTeam: true };
  }
  const facet = ticketCompetitionFacets().find((f) => f.slug === spec.competition);
  if (!facet) return null;
  const items = ticketCompetitionItems(spec.competition);
  return { items, raw: facet.name, key: undefined, name: facet.name, headline: x.ticketCompH1(facet.name), path: `/tickets/competicion/${spec.competition}`, isTeam: false };
}

const eur = (n: number) => formatOfferMoney(n, "EUR");

export function ticketHubMetadata(spec: TicketSpec, locale: HubLocale): Metadata {
  const r = resolve(spec, locale);
  if (!r || r.items.length < TICKET_MIN) return {};
  const s = ticketStats(r.items);
  return hubMetadata(locale, r.path, r.headline, EXTRA[locale].ticketMeta({ subject: r.headline, n: s.n, price: eur(s.minEur) }));
}

export default function TicketHub({ spec, locale }: { spec: TicketSpec; locale: HubLocale }) {
  const r = resolve(spec, locale);
  if (!r || r.items.length < TICKET_MIN) notFound();
  const x = EXTRA[locale];
  const s = ticketStats(r.items);
  const ticketsName = translations[locale].tickets.pageTitle;

  // Enlaces cruzados: competiciones en las que juega el equipo (o todas), y
  // los equipos de esta competición (o los rivales del equipo).
  const comps = new Set(r.items.map((t) => t.competition));
  const teams = new Set(r.items.flatMap((t) => ticketTeams(t.event)));
  const compLinks = ticketCompetitionFacets().filter((f) => f.name !== r.raw && (!r.isTeam || comps.has(f.name)));
  const teamLinks = ticketTeamFacets().filter((f) => f.name !== r.raw && teams.has(f.name));

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-8">
      <JsonLd
        data={[
          breadcrumbLd(locale, [{ name: HUB[locale].home, path: "" }, { name: ticketsName, path: "/tickets" }, { name: r.headline }], r.path),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: r.headline,
            url: `${SITE_URL}/${locale}${r.path}`,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: r.items.length,
              itemListElement: r.items.slice(0, 20).map((t, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/${locale}/tickets/${t.id}` })),
            },
          },
        ]}
      />
      <Crumbs locale={locale} trail={[{ label: ticketsName, href: `/${locale}/tickets` }, { label: r.headline }]} />
      <HubHeader h1={r.headline} intro={x.ticketIntro({ subject: r.headline, n: s.n, first: s.first, last: s.last, sellers: s.sellers, price: eur(s.minEur) })} />
      {/* Equipo también en el catálogo de camisetas: enlace a su hub. */}
      {r.key && (
        <p className="-mt-5 mb-6 text-sm">
          <Link className="font-medium text-[#1B3B2B] underline decoration-[#C9A24B] underline-offset-2" href={`/${locale}/equipo/${r.key}`}>
            {HUB[locale].teamH1(r.name)} →
          </Link>
        </p>
      )}

      <TicketsPageClient forcedClub={r.isTeam ? r.raw : undefined} forcedCompetition={r.isTeam ? undefined : r.raw} />

      <AllItemLinks title={x.ticketsAll} items={r.items.map((t) => ({ href: `/${locale}/tickets/${t.id}`, label: `${t.event} · ${t.date.slice(8, 10)}/${t.date.slice(5, 7)}` }))} />
      <nav aria-label={x.explore}>
        <LinkChipRow title={x.ticketByComp} items={compLinks.map((f) => ({ href: `/${locale}/tickets/competicion/${f.slug}`, label: f.name }))} />
      </nav>
      {teamLinks.length > 0 && (
        <Section title={x.ticketByTeam}>
          <TeamLinks
            locale={locale}
            countLabel={String}
            items={teamLinks.slice(0, 48).map((f) => {
              const k = teamKeyForTicketName(f.name);
              return { href: `/${locale}/tickets/equipo/${f.slug}`, name: k ? teamNames[k][locale] : f.name, count: f.count };
            })}
          />
        </Section>
      )}
    </div>
  );
}
