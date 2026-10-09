import type { Metadata } from "next";
import { HUB } from "@/lib/hubStrings";
import { asLocale, breadcrumbLd, hubMetadata } from "@/lib/hubPages";
import { DEAL_SECTIONS, LOW_MIN_DAYS, archiveDates, historicLowRows } from "@/lib/dealsData";
import { DEALS, longDate } from "@/lib/dealsStrings";
import { Crumbs, HubHeader, JsonLd, Section } from "@/components/hubs/HubParts";
import { DealTable, DealsRelated, dealsListLd } from "@/components/hubs/DealParts";

// Precio de hoy = el más bajo que registramos para esa oferta (21+ días de
// archivo, 3 %+ bajo su mediana). Ver historicLowRows en dealsData.ts.
export const revalidate = 3600;

const PER_SECTION = 40;
type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  return hubMetadata(locale, "/minimos-historicos", DEALS[locale].lowsH1, DEALS[locale].lowsMeta);
}

export default async function LowsPage({ params }: P) {
  const locale = asLocale((await params).locale);
  const s = DEALS[locale];
  const rows = historicLowRows();
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-8">
      <JsonLd data={[breadcrumbLd(locale, [{ name: HUB[locale].home, path: "" }, { name: s.lowsH1 }], "/minimos-historicos"), dealsListLd(rows, locale, s.lowsH1, "/minimos-historicos")]} />
      <Crumbs locale={locale} trail={[{ label: s.lowsH1 }]} />
      <HubHeader h1={s.lowsH1} intro={rows.length ? s.lowsIntro(rows.length, LOW_MIN_DAYS, longDate(archiveDates().first, locale)) : s.lowsEmpty} />
      {DEAL_SECTIONS.map((sec) => {
        const list = rows.filter((r) => r.section === sec);
        if (!list.length) return null;
        return (
          <Section key={sec} title={`${s.section[sec]} (${list.length})`}>
            <DealTable rows={list.slice(0, PER_SECTION)} locale={locale} mode="low" />
            <p className="mt-2 text-xs text-[#675c44]">{s.topOf(Math.min(PER_SECTION, list.length), list.length)}</p>
          </Section>
        );
      })}
      <p className="text-sm text-[#675c44]">{s.lowsNote}</p>
      <DealsRelated locale={locale} current="/minimos-historicos" />
    </div>
  );
}
