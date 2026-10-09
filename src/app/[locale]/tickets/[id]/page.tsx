import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ticketProducts } from "@/data/tickets";
import { ticketSeller, ticketOfferTotalInEUR } from "@/lib/offerMoney";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { OG_LOCALE, SITE_URL, ldImage, ogImages, ticketDescription, ticketTitle } from "@/lib/seoMeta";
import { ticketRelated, ticketTrail } from "@/lib/detailLinks";
import { DetailCrumbs, RelatedLinks } from "@/components/DetailNav";
import TicketDetailPageClient from "./TicketDetailPageClient";

/** Una oferta por vendedor distinto (la más barata): UK y US son la misma
 *  tienda y no deben figurar como dos ofertas independientes. */
function offersBySeller(ticket: NonNullable<ReturnType<typeof findTicket>>) {
  return [...ticket.offers]
    .sort((a, b) => ticketOfferTotalInEUR(a) - ticketOfferTotalInEUR(b))
    .filter((o, i, arr) => arr.findIndex((x) => ticketSeller(x.store) === ticketSeller(o.store)) === i);
}

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

  const title = ticketTitle(ticket, locale);
  const sellers = offersBySeller(ticket);
  const description = ticketDescription(ticket, locale, sellers.length, sellers[0]);
  const images = ogImages(ticket.imageUrl);
  const url = `${SITE_URL}/${locale}/tickets/${ticket.id}`;

  return {
    title,
    description,
    alternates: buildAlternates(locale, `/tickets/${ticket.id}`),
    openGraph: { title, description, type: "website", url, siteName: "Football Cult", locale: OG_LOCALE[locale], images },
    twitter: { card: "summary_large_image", title, description, images: images?.map((i) => i.url) },
  };
}

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: rawLocale, id } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const ticket = findTicket(id);
  if (!ticket?.offers.length) notFound();
  const url = `${SITE_URL}/${locale}/tickets/${ticket.id}`;
  const image = ldImage(ticket.imageUrl);

  // Campos que Search Console marcó como faltantes (2026-09-19, "problemas
  // no críticos" de Eventos): eventStatus, performer, offers.validFrom,
  // location.address, description. Sin ciudad real en el feed, address usa
  // el nombre del estadio (dato real) en vez de inventar una ciudad.
  const [homeTeam, awayTeam] = ticket.event.split(/\s+vs\s+/i);
  const teams = [homeTeam, awayTeam].filter(Boolean).map((n) => ({ "@type": "SportsTeam", name: n.trim() }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: ticket.event,
    description: `${ticket.event} -- ${ticket.competition}, ${ticket.venue}, ${ticket.date}.`,
    startDate: `${ticket.date}T${ticket.time}`,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: ticket.venue,
      address: { "@type": "PostalAddress", ...(ticket.city ? { addressLocality: ticket.city } : { streetAddress: ticket.venue }) },
    },
    performer: teams,
    ...(teams.length === 2 ? { homeTeam: teams[0], awayTeam: teams[1] } : {}),
    image: image ? [image.url] : undefined,
    url,
    offers: offersBySeller(ticket).map((o) => ({
      "@type": "Offer",
      url,
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
      <DetailCrumbs locale={locale} trail={ticketTrail(ticket, locale)} current={`/tickets/${ticket.id}`} />
      <TicketDetailPageClient ticket={ticket} />
      <RelatedLinks related={ticketRelated(ticket, locale)} />
    </>
  );
}
