import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ticketProducts } from "@/data/tickets";
import { ticketSeller, ticketOfferTotalInEUR } from "@/lib/offerMoney";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import TicketDetailPageClient from "./TicketDetailPageClient";
import { HubBacklinks } from "@/components/hubs/HubLinkParts";
import { EXTRA } from "@/lib/extraHubStrings";
import { teamKeyForTicketName, ticketCompetitionFacets, ticketTeamFacets, ticketTeams } from "@/lib/extraHubs";
import { slugify } from "@/lib/gearHubs";
import { asLocale } from "@/lib/hubPages";
import { teamName } from "@/lib/hubs";
import type { HubLocale } from "@/data/teamMeta";
import type { TicketProduct } from "@/data/tickets";

// Partido -> hubs de sus dos equipos y de su competición (solo los que existen).
function ticketHubLinks(ticket: TicketProduct, locale: HubLocale) {
  const x = EXTRA[locale];
  const out: { href: string; label: string }[] = [];
  for (const n of ticketTeams(ticket.event)) {
    const f = ticketTeamFacets().find((t) => t.slug === slugify(n));
    const k = teamKeyForTicketName(n);
    if (f) out.push({ href: `/${locale}/tickets/equipo/${f.slug}`, label: x.ticketsOf(k ? teamName(k, locale) : n) });
  }
  const c = ticketCompetitionFacets().find((t) => t.name === ticket.competition);
  if (c) out.push({ href: `/${locale}/tickets/competicion/${c.slug}`, label: x.ticketsOf(c.name) });
  return out;
}

const SITE_URL = "https://football-cult.com";

const META_TEMPLATE: Record<Locale, { title: string; description: string }> = {
  es: {
    title: "{event} — Entradas | Football Cult",
    description: "Entradas para {event}: precio, fecha, estadio y enlace directo a la tienda.",
  },
  en: {
    title: "{event} — Tickets | Football Cult",
    description: "Tickets for {event}: price, date, venue and a direct link to the store.",
  },
  pt: {
    title: "{event} — Ingressos | Football Cult",
    description: "Ingressos para {event}: preço, data, estádio e link direto para a loja.",
  },
  fr: {
    title: "{event} — Billets | Football Cult",
    description: "Billets pour {event} : prix, date, stade et lien direct vers la boutique.",
  },
  it: {
    title: "{event} — Biglietti | Football Cult",
    description: "Biglietti per {event}: prezzo, data, stadio e link diretto al negozio.",
  },
};

function findTicket(id: string) {
  return ticketProducts.find((p) => p.id === id);
}

// ISR (2026-09-20): sin generateStaticParams estas páginas eran ƒ
// (cache-control no-store): cada visita de un usuario o de Googlebot
// ejecutaba una función que carga el catálogo entero -- la causa más
// probable de que la cuenta Hobby llegara al 100% de Fluid Active CPU.
// Con esto no se prerenderiza nada (no suma storage al deploy), pero la
// primera visita a cada URL queda cacheada en el CDN por un día.
export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, id } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const ticket = findTicket(id);
  if (!ticket) return {};

  const tmpl = META_TEMPLATE[locale];
  const title = tmpl.title.replace("{event}", ticket.event);
  const description = tmpl.description.replace("{event}", ticket.event);
  const image = ticket.imageUrl;

  return {
    title,
    description,
    alternates: buildAlternates(locale, `/tickets/${ticket.id}`),
    openGraph: { title, description, type: "website", images: image ? [image] : undefined },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : undefined },
  };
}

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const ticket = findTicket(id);
  if (!ticket?.offers.length) notFound();

  // Campos que Search Console marcó como faltantes (2026-09-19, "problemas
  // no críticos" de Eventos): eventStatus, performer, offers.validFrom,
  // location.address, description. Sin ciudad real en el feed, address usa
  // el nombre del estadio (dato real) en vez de inventar una ciudad.
  const [homeTeam, awayTeam] = ticket.event.split(/\s+vs\s+/i);
  const teams = [homeTeam, awayTeam].filter(Boolean).map((n) => ({ "@type": "SportsTeam", name: n.trim() }));
  const offersBySeller = [...ticket.offers]
    .sort((a, b) => ticketOfferTotalInEUR(a) - ticketOfferTotalInEUR(b))
    .filter((o, i, arr) => arr.findIndex((x) => ticketSeller(x.store) === ticketSeller(o.store)) === i);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: ticket.event,
    description: `${ticket.event} -- ${ticket.competition}, ${ticket.venue}, ${ticket.date}.`,
    startDate: `${ticket.date}T${ticket.time}`,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: ticket.venue, address: ticket.city ? `${ticket.venue}, ${ticket.city}` : ticket.venue },
    performer: teams,
    ...(teams.length === 2 ? { homeTeam: teams[0], awayTeam: teams[1] } : {}),
    image: ticket.imageUrl ? [ticket.imageUrl] : undefined,
    url: `${SITE_URL}/${locale}/tickets/${ticket.id}`,
    // Una Offer por vendedor distinto (la más barata): UK y US son la misma
    // tienda y no deben figurar como dos ofertas independientes.
    offers: offersBySeller.map((o) => ({
      "@type": "Offer",
      url: o.url,
      price: o.price,
      priceCurrency: o.currency,
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString().slice(0, 10),
      seller: { "@type": "Organization", name: ticketSeller(o.store) },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TicketDetailPageClient ticket={ticket} />
      <HubBacklinks label={EXTRA[asLocale(locale)].explore} items={ticketHubLinks(ticket, asLocale(locale))} />
    </>
  );
}
