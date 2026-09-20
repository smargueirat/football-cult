import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ticketProducts } from "@/data/tickets";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import TicketDetailPageClient from "./TicketDetailPageClient";

const SITE_URL = "https://football-cult.com";

const META_TEMPLATE: Record<Locale, { title: string; description: string }> = {
  es: {
    title: "{event} — Entradas | Football Cult",
    description: "Compará precios de entradas para {event} entre distintas tiendas y comprá donde te convenga.",
  },
  en: {
    title: "{event} — Tickets | Football Cult",
    description: "Compare ticket prices for {event} across stores and buy wherever suits you best.",
  },
  pt: {
    title: "{event} — Ingressos | Football Cult",
    description: "Compare preços de ingressos para {event} entre lojas e compre onde for melhor para você.",
  },
  fr: {
    title: "{event} — Billets | Football Cult",
    description: "Comparez les prix des billets pour {event} entre boutiques et achetez où cela vous convient.",
  },
  it: {
    title: "{event} — Biglietti | Football Cult",
    description: "Confronta i prezzi dei biglietti per {event} tra i negozi e acquista dove preferisci.",
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
  if (!ticket) notFound();

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
    description: `${ticket.event} -- ${ticket.competition}, ${ticket.venue}, ${ticket.date}. Compará precios de entradas entre tiendas reales.`,
    startDate: `${ticket.date}T${ticket.time}`,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: ticket.venue, address: ticket.city ? `${ticket.venue}, ${ticket.city}` : ticket.venue },
    performer: teams,
    ...(teams.length === 2 ? { homeTeam: teams[0], awayTeam: teams[1] } : {}),
    image: ticket.imageUrl ? [ticket.imageUrl] : undefined,
    url: `${SITE_URL}/${locale}/tickets/${ticket.id}`,
    offers: ticket.offers.map((o) => ({
      "@type": "Offer",
      url: o.url,
      price: o.price,
      priceCurrency: o.currency,
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString().slice(0, 10),
      seller: { "@type": "Organization", name: o.store },
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
    </>
  );
}
