import type { Metadata } from "next";
import { HUB } from "@/lib/hubStrings";
import { asLocale, breadcrumbLd, hubMetadata } from "@/lib/hubPages";
import { DEAL_SECTIONS, archiveDates, dealHref, dealImage, dealName, weeklyRows } from "@/lib/dealsData";
import { DEALS, longDate } from "@/lib/dealsStrings";
import { Crumbs, HubHeader, JsonLd, Section } from "@/components/hubs/HubParts";
import DealCard from "@/components/hubs/DealCard";
import { DealsRelated, dealsListLd } from "@/components/hubs/DealParts";

// Resumen semanal que se rehace solo: las bajadas verificadas de los últimos
// 7 días del archivo, con topes (ver weeklyRows en dealsData.ts).
export const revalidate = 3600;

const GRID = "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4";
type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  return hubMetadata(locale, "/ofertas-de-la-semana", DEALS[locale].weekH1, DEALS[locale].weekMeta);
}

export default async function WeekPage({ params }: P) {
  const locale = asLocale((await params).locale);
  const s = DEALS[locale];
  const rows = weeklyRows();
  const last = archiveDates().last;
  const from = last ? new Date(Date.parse(last + "T00:00:00Z") - 6 * 86_400_000).toISOString().slice(0, 10) : "";
  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-8">
      <JsonLd data={[breadcrumbLd(locale, [{ name: HUB[locale].home, path: "" }, { name: s.weekH1 }], "/ofertas-de-la-semana"), dealsListLd(rows, locale, s.weekH1, "/ofertas-de-la-semana")]} />
      <Crumbs locale={locale} trail={[{ label: s.weekH1 }]} />
      <HubHeader h1={s.weekH1} intro={rows.length ? s.weekIntro(rows.length, longDate(from, locale), longDate(last, locale)) : s.weekEmpty} />
      {DEAL_SECTIONS.map((sec) => {
        const list = rows.filter((r) => r.section === sec);
        if (!list.length) return null;
        return (
          <Section key={sec} title={s.section[sec]}>
            <div className={GRID}>
              {list.map((r, i) => (
                <DealCard
                  key={r.item.id}
                  href={dealHref(r, locale)}
                  title={dealName(r, locale)}
                  image={dealImage(r)}
                  price={r.price}
                  currency={r.currency}
                  pct={Math.round(r.pct)}
                  store={r.store}
                  priority={i < 4 && sec === rows[0].section}
                />
              ))}
            </div>
          </Section>
        );
      })}
      <DealsRelated locale={locale} current="/ofertas-de-la-semana" />
    </div>
  );
}
