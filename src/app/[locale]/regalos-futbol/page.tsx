import type { Locale } from "@/lib/i18n/translations";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { HUB } from "@/lib/hubStrings";
import { asLocale, breadcrumbLd, hubMetadata } from "@/lib/hubPages";
import { withBrand } from "@/lib/seoMeta";
import { longDate } from "@/lib/dealsStrings";
import { giftPage, type GiftCard } from "@/lib/seasonalData";
import { SEASONAL } from "@/lib/seasonalStrings";
import { currentGiftSeason, todayIso } from "@/lib/seasonal";
import type { OfferCurrencyCode } from "@/lib/offerMoney";
import { Crumbs, HubHeader, JsonLd } from "@/components/hubs/HubParts";
import { DealsRelated, listLd } from "@/components/hubs/DealParts";
import DealCard from "@/components/hubs/DealCard";

// Guía de regalos de Navidad y Reyes: por presupuesto y por tipo. Una sola
// URL (Google ya tiene decenas de miles de URLs nuestras sin indexar: mejor una
// página buena que once flojas). Solo ofertas en stock, con precio y con envío
// medido al mercado del idioma (seasonalData.giftable). Sustituye a /regalos.
export const revalidate = 3600;

const PATH = "/regalos-futbol";
const GRID = "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const s = SEASONAL[locale].gifts;
  return { ...hubMetadata(locale, PATH, s.title, s.meta), title: { absolute: withBrand(s.title) } };
}

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mb-10 scroll-mt-20">
      <h3 className="font-vintage mb-4 text-xl text-[#1B3B2B]">{title}</h3>
      {children}
    </section>
  );
}

function Grid({ cards, locale }: { cards: GiftCard[]; locale: Locale }) {
  return (
    <div className={GRID}>
      {cards.map((c) => (
        <DealCard key={`${c.section}/${c.id}`} href={c.href} title={c.title} image={c.image} price={c.total} currency={c.currency as OfferCurrencyCode} store={c.store} locale={locale} />
      ))}
    </div>
  );
}

export default async function GiftsPage({ params }: P) {
  const locale = asLocale((await params).locale);
  const s = SEASONAL[locale].gifts;
  const season = currentGiftSeason(todayIso());
  const { budget, types } = giftPage(locale);
  const unique = new Map<string, GiftCard>();
  for (const c of [...budget.flatMap((b) => b.cards), ...types.flatMap((t) => t.cards)]) unique.set(c.href, c);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-8">
      <JsonLd
        data={[
          breadcrumbLd(locale, [{ name: HUB[locale].home, path: "" }, { name: s.title }], PATH),
          listLd(locale, s.title, PATH, [...unique.values()].map((c) => ({ href: c.href, name: c.title }))),
        ]}
      />
      <Crumbs locale={locale} trail={[{ label: s.title }]} />
      <HubHeader h1={s.title} intro={unique.size ? s.intro({ xmas: longDate(season.xmas, locale), kings: longDate(season.kings, locale), n: unique.size }) : s.empty} />

      <nav className="mb-8 flex flex-wrap gap-2 text-sm">
        {[...budget.map((b) => ({ id: b.band.key, label: SEASONAL[locale].bands[b.band.key] })), ...types.map((t) => ({ id: t.type, label: s.type[t.type] }))].map((x) => (
          <a key={x.id} href={`#${x.id}`} className="rounded-full border border-[#C9A24B]/45 bg-white/70 px-3 py-1 text-[#1B3B2B] hover:bg-[#f6efdd]">
            {x.label}
          </a>
        ))}
      </nav>

      <h2 className="font-vintage mb-4 text-2xl text-[#1B3B2B] sm:text-3xl">{s.budgetH2}</h2>
      {budget.map(({ band, cards }) => (
        <Block key={band.key} id={band.key} title={SEASONAL[locale].bands[band.key]}>
          <Grid cards={cards} locale={locale} />
        </Block>
      ))}

      <h2 className="font-vintage mb-4 text-2xl text-[#1B3B2B] sm:text-3xl">{s.typeH2}</h2>
      {types.map(({ type, cards }) => (
        <Block key={type} id={type} title={s.type[type]}>
          <Grid cards={cards} locale={locale} />
          {type === "tickets" && <p className="mt-3 text-xs text-[#675c44]">{s.ticketsNote}</p>}
        </Block>
      ))}

      <p className="text-sm text-[#675c44]">{s.note}</p>
      <DealsRelated locale={locale} current={PATH} />
    </div>
  );
}
