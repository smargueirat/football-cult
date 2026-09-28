import type { Metadata } from "next";
import { HUB } from "@/lib/hubStrings";
import { GIFTS_UI } from "@/lib/giftStrings";
import { GIFT_BANDS, giftPicks } from "@/lib/giftPicks";
import { asLocale, breadcrumbLd, hubMetadata } from "@/lib/hubPages";
import { localizeGearModel } from "@/lib/gearText";
import { teamNames, typeNames } from "@/lib/productMeta";
import { Crumbs, HubHeader, JsonLd, Section } from "@/components/hubs/HubParts";
import DealCard from "@/components/hubs/DealCard";
import { products } from "@/data/products";
import { bootProducts } from "@/data/boots";
import { apparelProducts } from "@/data/apparel";
import { gloveProducts } from "@/data/gloves";
import { ballProducts } from "@/data/balls";
import { trainingProducts } from "@/data/training";

// Puerta de entrada por PRESUPUESTO, no por equipo ni por tipo de producto.
//
// Todas las demás páginas del sitio están organizadas para quien ya sabe qué
// quiere ("camiseta del Barcelona 25/26"). Quien busca un regalo no lo sabe:
// busca por lo que quiere gastar. No teníamos ninguna página para eso, y la
// camiseta de fútbol es un regalo de manual cuyo pico de búsqueda arranca a
// principios de noviembre.
//
// UNA sola página y no una por tramo, a propósito: Google ya tiene 46.770 URLs
// nuestras en "descubierta, actualmente sin indexar", así que pedirle cuatro
// páginas flojas en vez de una buena va en la dirección contraria.
export const revalidate = 3600;

const PER_BAND_SECTION = 6;
const GRID = "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = asLocale(raw);
  const ui = GIFTS_UI[locale];
  return hubMetadata(locale, "/regalos", ui.metaTitle, ui.metaDescription);
}

export default async function Gifts({ params }: P) {
  const { locale: raw } = await params;
  const locale = asLocale(raw);
  const ui = GIFTS_UI[locale];

  const bands = GIFT_BANDS.map((band) => {
    // Dos por equipo/marca como mucho: en una página de regalos la variedad
    // es el producto. Y las camisetas van primero en cada tramo porque son
    // lo que la gente busca para regalar.
    const jerseys = giftPicks(products, band, PER_BAND_SECTION, (p) => p.teamKey);
    const boots = giftPicks(bootProducts, band, PER_BAND_SECTION, (b) => b.brand);
    const gear = [
      { base: "ropa" as const, items: giftPicks(apparelProducts, band, PER_BAND_SECTION, (x) => x.brand) },
      { base: "pelotas" as const, items: giftPicks(ballProducts, band, PER_BAND_SECTION, (x) => x.brand) },
      { base: "guantes" as const, items: giftPicks(gloveProducts, band, PER_BAND_SECTION, (x) => x.brand) },
      { base: "entrenamiento" as const, items: giftPicks(trainingProducts, band, PER_BAND_SECTION, (x) => x.brand) },
    ].filter((g) => g.items.length > 0);
    return { band, jerseys, boots, gear };
  }).filter((b) => b.jerseys.length + b.boots.length + b.gear.length > 0);

  const total = bands.reduce(
    (n, b) => n + b.jerseys.length + b.boots.length + b.gear.reduce((m, g) => m + g.items.length, 0),
    0,
  );

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-8">
      <JsonLd
        data={breadcrumbLd(locale, [{ name: HUB[locale].home, path: "" }, { name: ui.h1 }], "/regalos")}
      />
      <Crumbs locale={locale} trail={[{ label: ui.h1 }]} />
      <HubHeader h1={ui.h1} intro={total ? ui.intro(total) : ui.empty} />

      {bands.map(({ band, jerseys, boots, gear }) => (
        <Section key={band.key} title={ui[band.key]}>
          <div className={GRID}>
            {jerseys.map((p, i) => (
              <DealCard
                key={p.id}
                href={`/${locale}/camiseta/${p.id}`}
                title={`${teamNames[p.teamKey][locale]} ${typeNames[p.typeKey][locale]} ${p.season}`}
                image={p.pick.imageUrl ?? ""}
                price={p.pick.price + (p.pick.shipping ?? 0)}
                currency={p.pick.currency}
                store={p.pick.store}
                priority={i < 2}
              />
            ))}
            {boots.map((b) => (
              <DealCard
                key={b.id}
                href={`/${locale}/botas/${b.id}`}
                title={`${b.brand} ${b.model}`}
                image={b.pick.imageUrl ?? ""}
                price={b.pick.price + (b.pick.shipping ?? 0)}
                currency={b.pick.currency}
                store={b.pick.store}
              />
            ))}
            {gear.flatMap((g) =>
              g.items.map((x) => (
                <DealCard
                  key={x.id}
                  href={`/${locale}/${g.base}/${x.id}`}
                  title={localizeGearModel(x.model, x.brand, locale)}
                  image={x.pick.imageUrl ?? ""}
                  price={x.pick.price + (x.pick.shipping ?? 0)}
                  currency={x.pick.currency}
                  store={x.pick.store}
                />
              )),
            )}
          </div>
          <p className="mt-3 text-xs text-[#8a8a84]">{ui.note}</p>
        </Section>
      ))}
    </div>
  );
}
