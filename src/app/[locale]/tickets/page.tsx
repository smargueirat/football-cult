import { Metadata } from "next";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import TicketsPageClient from "./TicketsPageClient";
import { asLocale } from "@/lib/hubPages";
import { byDate, teamKeyForTicketName, ticketCompetitionFacets, ticketTeamFacets } from "@/lib/ticketHubs";
import { ticketProducts } from "@/data/tickets";
import { breadcrumbLd, SITE_URL } from "@/lib/hubPages";
import { HUB } from "@/lib/hubStrings";
import { translations } from "@/lib/i18n/translations";
import { EXTRA } from "@/lib/extraHubStrings";
import { teamNames } from "@/lib/productMeta";
import { LinkChipRow } from "@/components/hubs/HubLinkParts";
import { JsonLd, QaList } from "@/components/hubs/HubParts";
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
  // Próximos 20 partidos (nombre, fecha, enlace): lo que enumera el listado.
  const name = translations[locale].tickets.pageTitle;
  const today = new Date().toISOString().slice(0, 10);
  const next = ticketProducts.filter((t) => t.date >= today).sort(byDate).slice(0, 20);
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd(locale, [{ name: HUB[locale].home, path: "" }, { name }], "/tickets"),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name,
            url: `${SITE_URL}/${locale}/tickets`,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: next.length,
              itemListElement: next.map((t, i) => {
                const url = `${SITE_URL}/${locale}/tickets/${t.id}`;
                return { "@type": "ListItem", position: i + 1, url, item: { "@type": "SportsEvent", name: t.event, startDate: `${t.date}T${t.time}`, url } };
              }),
            },
          },
        ]}
      />
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
