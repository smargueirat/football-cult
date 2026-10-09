import type { Metadata } from "next";
import { HUB } from "@/lib/hubStrings";
import { asLocale, breadcrumbLd, hubMetadata } from "@/lib/hubPages";
import { DEAL_SECTIONS, archiveDates, verifiedDropRows } from "@/lib/dealsData";
import { DEALS, longDate } from "@/lib/dealsStrings";
import { Crumbs, HubHeader, JsonLd, Section } from "@/components/hubs/HubParts";
import { DealTable, DealsRelated, FeedLink, dealsListLd, feedPath } from "@/components/hubs/DealParts";

// Registro de bajadas VERIFICADAS (priceDrops.json + fecha del archivo), en
// tabla. /ofertas es la vitrina con fotos; esta es la lista con antes, ahora y
// fecha, y la fuente del feed Atom.
export const revalidate = 3600;

const PER_SECTION = 25; // con 40 el HTML pasaba de 450 KB (hubs: ~180 KB)
type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const m = hubMetadata(locale, "/bajadas-de-precio", DEALS[locale].dropsH1, DEALS[locale].dropsMeta);
  return { ...m, alternates: { ...m.alternates, types: { "application/atom+xml": feedPath(locale) } } };
}

export default async function DropsPage({ params }: P) {
  const locale = asLocale((await params).locale);
  const s = DEALS[locale];
  const rows = verifiedDropRows();
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-8">
      <JsonLd data={[breadcrumbLd(locale, [{ name: HUB[locale].home, path: "" }, { name: s.dropsH1 }], "/bajadas-de-precio"), dealsListLd(rows, locale, s.dropsH1, "/bajadas-de-precio")]} />
      <Crumbs locale={locale} trail={[{ label: s.dropsH1 }]} />
      <HubHeader h1={s.dropsH1} intro={rows.length ? s.dropsIntro(rows.length, longDate(archiveDates().last, locale)) : s.dropsEmpty} />
      <FeedLink locale={locale} />
      <div className="mt-6">
        {DEAL_SECTIONS.map((sec) => {
          const list = rows.filter((r) => r.section === sec);
          if (!list.length) return null;
          return (
            <Section key={sec} title={`${s.section[sec]} (${list.length})`}>
              <DealTable rows={list.slice(0, PER_SECTION)} locale={locale} mode="drop" />
              <p className="mt-2 text-xs text-[#675c44]">{s.topOf(Math.min(PER_SECTION, list.length), list.length)}</p>
            </Section>
          );
        })}
      </div>
      <Section title={s.methodH2}>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#3a3a36]">
          {s.method.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </Section>
      <DealsRelated locale={locale} current="/bajadas-de-precio" />
    </div>
  );
}
