import type { Metadata } from "next";
import { HUB } from "@/lib/hubStrings";
import { SEASON_UI } from "@/lib/seasonStrings";
import { asLocale, breadcrumbLd, hubMetadata } from "@/lib/hubPages";
import { priceDrops } from "@/lib/seasonHubs";
import { sectionDrops } from "@/lib/offersFeed";
import { translations } from "@/lib/i18n/translations";
import { localizeGearModel } from "@/lib/gearText";
import { offerTotalInEUR, type OfferCurrencyCode } from "@/lib/offerMoney";
import { Crumbs, HubHeader, JerseyGrid, JsonLd, Section } from "@/components/hubs/HubParts";
import DealCard from "@/components/hubs/DealCard";
import { isPriceDropped } from "@/lib/priceDrops";
import { bootProducts } from "@/data/boots";
import { ticketProducts } from "@/data/tickets";
import { apparelProducts } from "@/data/apparel";
import { gloveProducts } from "@/data/gloves";
import { ballProducts } from "@/data/balls";
import { trainingProducts } from "@/data/training";

// Se recalcula cada hora: los precios se controlan una vez al día pero la
// lista debe quedar al día apenas corre el scan diario.
export const revalidate = 3600;

// Cuántas fichas por sección. Las camisetas siguen con 120 (son la
// sección más grande); el resto va acotado para que la página no se
// vuelva infinita -- de cada una se muestran las de mayor descuento.
const PER_SECTION = 24;

const GRID = "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6";

/** La oferta que de verdad bajó y es la más barata de las que bajaron. */
function bestDrop<T extends { offers: { store: string; price: number; shipping?: number; currency: OfferCurrencyCode; url: string; imageUrl?: string }[] }>(x: T) {
  const dropped = x.offers.filter((o) => isPriceDropped(o));
  return dropped.sort((a, b) => offerTotalInEUR({ ...a, shipping: 0 }) - offerTotalInEUR({ ...b, shipping: 0 }))[0] ?? x.offers[0];
}

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = asLocale(raw);
  return hubMetadata(locale, "/ofertas", SEASON_UI[locale].offersH1, SEASON_UI[locale].offersMeta);
}

export default async function Offers({ params }: P) {
  const { locale: raw } = await params;
  const locale = asLocale(raw);
  const ui = SEASON_UI[locale];
  const t = translations[locale];

  const drops = priceDrops().slice(0, 120);
  const badges = Object.fromEntries(drops.map((d) => [d.product.id, `-${d.pct}%`]));

  // Las secciones que no son camisetas, cada una con su tarjeta ya
  // existente en vez de una nueva (ver offersFeed.ts para el porqué de
  // incluirlas). Botas y entradas van primero de las no-camisetas: son
  // las de precio medio más alto, así que son las que un visitante que
  // viene a ver rebajas agradece más.
  const boots = sectionDrops(bootProducts, PER_SECTION);
  const tickets = sectionDrops(ticketProducts, PER_SECTION);
  const gear = [
    { label: t.ropa.navLabel, base: "ropa" as const, items: sectionDrops(apparelProducts, PER_SECTION) },
    { label: t.guantes.navLabel, base: "guantes" as const, items: sectionDrops(gloveProducts, PER_SECTION) },
    { label: t.pelotas.navLabel, base: "pelotas" as const, items: sectionDrops(ballProducts, PER_SECTION) },
    { label: t.entrenamiento.navLabel, base: "entrenamiento" as const, items: sectionDrops(trainingProducts, PER_SECTION) },
  ].filter((g) => g.items.length > 0);

  const total =
    drops.length + boots.length + tickets.length + gear.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-8">
      <JsonLd data={breadcrumbLd(locale, [{ name: HUB[locale].home, path: "" }, { name: ui.offersH1 }], "/ofertas")} />
      <Crumbs locale={locale} trail={[{ label: ui.offersH1 }]} />
      <HubHeader h1={ui.offersH1} intro={total ? ui.offersIntro(total) : ui.offersEmpty} />

      {drops.length > 0 && (
        <Section title={t.botas.sectionJerseys}>
          <JerseyGrid items={drops} locale={locale} showTeam badges={badges} />
        </Section>
      )}

      {boots.length > 0 && (
        <Section title={t.botas.navLabel}>
          <div className={GRID}>
            {boots.map((b, i) => {
              const o = bestDrop(b);
              return (
                <DealCard
                  key={b.id}
                  href={`/${locale}/botas/${b.id}`}
                  title={`${b.brand} ${b.model}`}
                  image={o.imageUrl ?? ""}
                  price={o.price + (o.shipping ?? 0)}
                  currency={o.currency}
                  pct={b.pct}
                  store={o.store}
                  priority={i < 4}
                />
              );
            })}
          </div>
        </Section>
      )}

      {tickets.length > 0 && (
        <Section title={t.tickets.navLabel}>
          <div className={GRID}>
            {tickets.map((x, i) => {
              const o = bestDrop(x);
              return (
                <DealCard
                  key={x.id}
                  href={`/${locale}/tickets/${x.id}`}
                  title={`${x.event} · ${x.date}`}
                  image={x.imageUrl}
                  price={o.price}
                  currency={o.currency}
                  pct={x.pct}
                  store={o.store}
                  priority={i < 4}
                />
              );
            })}
          </div>
        </Section>
      )}

      {gear.map((g) => (
        <Section key={g.base} title={g.label}>
          <div className={GRID}>
            {g.items.map((x, i) => {
              const o = bestDrop(x);
              return (
                <DealCard
                  key={x.id}
                  href={`/${locale}/${g.base}/${x.id}`}
                  title={localizeGearModel(x.model, x.brand, locale)}
                  image={o.imageUrl ?? ""}
                  price={o.price + (o.shipping ?? 0)}
                  currency={o.currency}
                  pct={x.pct}
                  store={o.store}
                  priority={i < 4}
                />
              );
            })}
          </div>
        </Section>
      ))}
    </div>
  );
}
