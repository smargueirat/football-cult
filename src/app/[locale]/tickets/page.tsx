import { Metadata } from "next";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import TicketsPageClient from "./TicketsPageClient";
import { asLocale } from "@/lib/hubPages";
import { teamKeyForTicketName, ticketCompetitionFacets, ticketTeamFacets } from "@/lib/extraHubs";
import { EXTRA } from "@/lib/extraHubStrings";
import { teamName } from "@/lib/hubs";
import { LinkChipRow } from "@/components/hubs/HubLinkParts";

const META: Record<Locale, { title: string; description: string }> = {
  es: {
    title: "Entradas de fútbol | Football Cult",
    description: "Entradas de partidos de fútbol con precio y enlace directo a la tienda: Premier League, LaLiga, Champions League y más.",
  },
  en: {
    title: "Football Tickets | Football Cult",
    description: "Football match tickets with price and a direct link to the store: Premier League, LaLiga, Champions League and more.",
  },
  pt: {
    title: "Ingressos de Futebol | Football Cult",
    description: "Ingressos de partidas de futebol com preço e link direto para a loja: Premier League, LaLiga, Champions League e mais.",
  },
  fr: {
    title: "Billets de Football | Football Cult",
    description: "Billets de matchs de football avec prix et lien direct vers la boutique : Premier League, LaLiga, Ligue des Champions et plus.",
  },
  it: {
    title: "Biglietti di Calcio | Football Cult",
    description: "Biglietti per partite di calcio con prezzo e link diretto al negozio: Premier League, LaLiga, Champions League e altri.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  return {
    ...META[locale],
    alternates: buildAlternates(locale, "/tickets"),
  };
}

export default async function TicketsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  const x = EXTRA[locale];
  const label = (name: string) => {
    const k = teamKeyForTicketName(name);
    return k ? teamName(k, locale) : name;
  };
  return (
    <>
      <TicketsPageClient />
      {/* Hubs por competición y por equipo (2026-10-09). */}
      <nav aria-label={x.explore} className="mx-auto w-full max-w-[1800px] px-4 pb-10 sm:px-8">
        <LinkChipRow title={x.ticketByComp} items={ticketCompetitionFacets().map((f) => ({ href: `/${locale}/tickets/competicion/${f.slug}`, label: f.name }))} />
        <LinkChipRow
          title={x.ticketByTeam}
          items={ticketTeamFacets()
            .map((f) => ({ href: `/${locale}/tickets/equipo/${f.slug}`, label: label(f.name) }))
            .sort((a, b) => a.label.localeCompare(b.label))}
        />
      </nav>
    </>
  );
}
