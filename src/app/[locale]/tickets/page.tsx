import { Metadata } from "next";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import TicketsPageClient from "./TicketsPageClient";
import { asLocale } from "@/lib/hubPages";
import { teamKeyForTicketName, ticketCompetitionFacets, ticketTeamFacets } from "@/lib/ticketHubs";
import { EXTRA } from "@/lib/extraHubStrings";
import { teamNames } from "@/lib/productMeta";
import { LinkChipRow } from "@/components/hubs/HubLinkParts";
import { QaList } from "@/components/hubs/HubParts";
import { ticketFaq, ticketsPageMeta } from "@/lib/ticketFacts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  return {
    ...ticketsPageMeta(locale),
    alternates: buildAlternates(locale, "/tickets"),
  };
}

export default async function TicketsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  const x = EXTRA[locale];
  const faq = ticketFaq(locale);
  const label = (name: string) => {
    const k = teamKeyForTicketName(name);
    return k ? teamNames[k][locale] : name;
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
      {faq && (
        <section className="mx-auto w-full max-w-4xl px-4 pb-12 sm:px-8">
          <h2 className="font-vintage mb-4 text-xl text-[#1B3B2B] sm:text-2xl">{faq.h2}</h2>
          <QaList items={faq.qa} />
        </section>
      )}
    </>
  );
}
