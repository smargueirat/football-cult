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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: ticket.event,
    startDate: `${ticket.date}T${ticket.time}`,
    location: { "@type": "Place", name: ticket.venue },
    image: ticket.imageUrl ? [ticket.imageUrl] : undefined,
    url: `${SITE_URL}/${locale}/tickets/${ticket.id}`,
    offers: ticket.offers.map((o) => ({
      "@type": "Offer",
      url: o.url,
      price: o.price,
      priceCurrency: o.currency,
      availability: "https://schema.org/InStock",
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
