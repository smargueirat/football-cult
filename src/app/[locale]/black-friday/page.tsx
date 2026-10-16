import type { Metadata } from "next";
import Link from "next/link";
import { HUB } from "@/lib/hubStrings";
import { asLocale, breadcrumbLd, hubMetadata } from "@/lib/hubPages";
import { withBrand } from "@/lib/seoMeta";
import { archiveDates, dealHref, dealImage, dealName, itemName } from "@/lib/dealsData";
import { DEALS, longDate } from "@/lib/dealsStrings";
import { BF_GROUPS, bfBands, bfDrops, bfGroupOf, bfLows, bfReference, type RefRow } from "@/lib/seasonalData";
import { SEASONAL } from "@/lib/seasonalStrings";
import { currentBlackFriday, todayIso } from "@/lib/seasonal";
import { formatOfferMoney, type OfferCurrencyCode } from "@/lib/offerMoney";
import type { HubLocale } from "@/data/teamMeta";
import { Crumbs, HubHeader, JsonLd, Section } from "@/components/hubs/HubParts";
import { DealTable, DealsRelated, listLd } from "@/components/hubs/DealParts";
import DealCard from "@/components/hubs/DealCard";

// Black Friday (viernes tras el 4.º jueves de noviembre) y Cyber Monday. Misma
// URL todos los años, para que madure en Google. Todo es dato del día: bajadas
// verificadas y mínimos de dealsData.ts filtrados al mercado del idioma, y una
// tabla "hoy vs mínimo registrado" que da valor a la página antes del evento.
export const revalidate = 3600;

const PER_GROUP = 20;
const PER_BAND = 8;
const REF_ROWS = 15;
const PATH = "/black-friday";
const GRID = "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const s = SEASONAL[locale].bf;
  return { ...hubMetadata(locale, PATH, s.title, s.meta), title: { absolute: withBrand(s.title) } };
}

function RefTable({ rows, locale }: { rows: RefRow[]; locale: HubLocale }) {
  const s = SEASONAL[locale].bf;
  const c = s.refCol;
  const th = "px-2 py-2 text-left font-semibold";
  const td = "px-2 py-2 align-top";
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#C9A24B]/35 bg-[#fffdf8]">
      <table className="w-full min-w-[640px] text-sm text-[#3a3a36]">
        <thead className="bg-[#f6efdd] text-[#1B3B2B]">
          <tr>
            <th className={th}>{c.product}</th>
            <th className={th}>{c.store}</th>
            <th className={th}>{c.today}</th>
            <th className={th}>{c.min}</th>
            <th className={th}>{c.minDate}</th>
            <th className={th}>{c.diff}</th>
            <th className={th}>{c.days}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const cur = r.currency as OfferCurrencyCode;
            const diff = r.price > r.min ? `+${Math.round(((r.price - r.min) / r.min) * 100)} %` : s.atMin;
            return (
              <tr key={r.item.id} className="border-t border-[#C9A24B]/20">
                <td className={td}>
                  <Link className="font-medium text-[#1B3B2B] underline decoration-[#C9A24B]/60 underline-offset-2" href={`/${locale}/${r.section}/${r.item.id}`}>
                    {itemName(r.section, r.item, locale)}
                  </Link>
                </td>
                <td className={td}>{r.store}</td>
                <td className={`${td} font-semibold text-[#1B3B2B]`}>{formatOfferMoney(r.price, cur)}</td>
                <td className={td}>{formatOfferMoney(r.min, cur)}</td>
                <td className={`${td} whitespace-nowrap`}>{longDate(r.minDate, locale)}</td>
                <td className={`${td} font-semibold ${r.price > r.min ? "text-[#675c44]" : "text-[#B45309]"}`}>{diff}</td>
                <td className={td}>{r.days}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default async function BlackFridayPage({ params }: P) {
  const locale = asLocale((await params).locale);
  const s = SEASONAL[locale].bf;
  const d = DEALS[locale];
  const today = todayIso();
  const ev = currentBlackFriday(today);
  const drops = bfDrops(locale);
  const lows = bfLows(locale);
  const bands = bfBands(locale, PER_BAND);
  const ref = [...bfReference(locale, "botas", REF_ROWS), ...bfReference(locale, "camiseta", REF_ROWS)];
  const byGroup = (rows: typeof drops) => BF_GROUPS.map((g) => ({ g, rows: rows.filter((r) => bfGroupOf(r.section) === g) }));

  const intro = s.intro({
    year: ev.year,
    bf: longDate(ev.bf, locale),
    cm: longDate(ev.cm, locale),
    during: today >= ev.bf && today <= ev.cm,
    drops: drops.length,
    lows: lows.length,
    last: longDate(archiveDates().last, locale),
  });
  const listed = [...drops.slice(0, 30), ...lows.slice(0, 20)];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-8">
      <JsonLd
        data={[
          breadcrumbLd(locale, [{ name: HUB[locale].home, path: "" }, { name: s.title }], PATH),
          listLd(locale, s.title, PATH, listed.map((r) => ({ href: dealHref(r, locale), name: dealName(r, locale) }))),
        ]}
      />
      <Crumbs locale={locale} trail={[{ label: s.title }]} />
      <HubHeader h1={s.title} intro={intro} />

      {ref.length > 0 && (
        <Section title={s.refH2}>
          <p className="mb-3 max-w-3xl text-sm text-[#675c44]">{s.refIntro}</p>
          <RefTable rows={ref} locale={locale} />
        </Section>
      )}

      {byGroup(drops).map(({ g, rows }) => (
        <Section key={g} title={`${s.dropsH2} · ${s.group[g]} (${rows.length})`}>
          {rows.length ? (
            <>
              <DealTable rows={rows.slice(0, PER_GROUP)} locale={locale} mode="drop" />
              <p className="mt-2 text-xs text-[#675c44]">{d.topOf(Math.min(PER_GROUP, rows.length), rows.length)}</p>
            </>
          ) : (
            <p className="text-sm text-[#675c44]">{s.dropsEmpty}</p>
          )}
        </Section>
      ))}

      {bands.length > 0 && (
        <Section title={s.bandsH2}>
          {bands.map(({ band, rows }) => (
            <div key={band.key} className="mb-6">
              <h3 className="font-card-title mb-3 text-lg text-[#1B3B2B]">{SEASONAL[locale].bands[band.key]}</h3>
              <div className={GRID}>
                {rows.map((r) => (
                  <DealCard
                    key={`${r.section}/${r.item.id}`}
                    href={dealHref(r, locale)}
                    title={dealName(r, locale)}
                    image={dealImage(r)}
                    price={r.price}
                    currency={r.currency}
                    pct={Math.round(r.pct)}
                    store={r.store}
                  />
                ))}
              </div>
            </div>
          ))}
          <p className="text-xs text-[#675c44]">{s.bandsNote}</p>
        </Section>
      )}

      {byGroup(lows).map(({ g, rows }) => (
        <Section key={g} title={`${s.lowsH2} · ${s.group[g]} (${rows.length})`}>
          {rows.length ? (
            <>
              <DealTable rows={rows.slice(0, PER_GROUP)} locale={locale} mode="low" />
              <p className="mt-2 text-xs text-[#675c44]">{d.topOf(Math.min(PER_GROUP, rows.length), rows.length)}</p>
            </>
          ) : (
            <p className="text-sm text-[#675c44]">{s.lowsEmpty}</p>
          )}
        </Section>
      ))}

      <Section title={s.methodH2}>
        <ul className="list-disc space-y-2 pl-5 text-sm text-[#3a3a36]">
          {s.method.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </Section>
      <DealsRelated locale={locale} current={PATH} />
    </div>
  );
}
