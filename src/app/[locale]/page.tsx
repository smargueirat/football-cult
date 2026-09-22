import LazySearchExplorer from "@/components/LazySearchExplorer";
import FloatingFilterButton from "@/components/FloatingFilterButton";
import HeroCarousel from "@/components/HeroCarousel";
import CategorySections from "@/components/CategorySections";
import PriceDropsSection from "@/components/PriceDropsSection";
import LeagueShortcuts from "@/components/LeagueShortcuts";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { translations } from "@/lib/i18n/translations";
import { countries, type CountryCode } from "@/data/countries";
import {
  SEASONS,
  bestOfferForCountry,
  priceDropPercent,
  products,
  productPriceDropped,
  type Product,
} from "@/data/products";

const MAX_DROPS_SHOWN = 16;

// Este archivo es un server component a propósito (SIN "use client") --
// products.ts es el catálogo completo (5.9MB/76 mil líneas) y antes
// FloatingFilterButton y PriceDropsSection lo importaban cada uno por su
// cuenta desde el cliente (SEASONS, brandNames, `products` en vivo, etc.),
// arrastrando ese archivo entero al bundle del home aunque SearchExplorer
// (que sí necesita el catálogo para buscar) ya lo trae. Acá, en cambio,
// esos cómputos corren una sola vez en el servidor (esta página es SSG) y
// bajan al cliente ya resueltos como props -- mismo patrón documentado en
// src/lib/offerMoney.ts y src/lib/productMeta.ts.
function computePriceDrops() {
  const byId = new Map<string, Product>();
  const dropIdsByCountry: Partial<Record<CountryCode, string[]>> = {};

  for (const country of countries) {
    const ranked = products
      .filter((p) => productPriceDropped(p, country.code))
      .sort((a, b) => {
        const bestA = bestOfferForCountry(a, country.code);
        const bestB = bestOfferForCountry(b, country.code);
        const dropA = bestA ? priceDropPercent(bestA) : 0;
        const dropB = bestB ? priceDropPercent(bestB) : 0;
        return dropB - dropA;
      })
      .slice(0, MAX_DROPS_SHOWN);

    if (ranked.length === 0) continue;
    dropIdsByCountry[country.code] = ranked.map((p) => p.id);
    for (const p of ranked) byId.set(p.id, p);
  }

  return { dropProducts: Array.from(byId.values()), dropIdsByCountry };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const t = translations[locale];
  const { dropProducts, dropIdsByCountry } = computePriceDrops();

  return (
    <>
      <div className="flex flex-1 flex-col">
        {/* Hero: carrusel dinámico que va rotando entre las secciones
            reales del catálogo (selecciones, clubes, retro, mujer,
            niños, botas), cada una con una foto real de una oferta
            cargada -- reemplaza la placa chica de siempre. */}
        <section className="mx-auto w-full max-w-[1800px] px-4 pt-3 sm:px-8 sm:pt-6">
          <HeroCarousel />
        </section>

        <section className="mx-auto w-full max-w-[1800px] px-4 pt-4 sm:px-8">
          <CategorySections />
        </section>

        <LeagueShortcuts />

        <PriceDropsSection dropProducts={dropProducts} dropIdsByCountry={dropIdsByCountry} />

        {/* Search + results: mezcla de todo por defecto (camisetas y
            botas, ordenadas por relevancia), con filtros para acotar. */}
        <section id="catalogo" className="mx-auto w-full max-w-[1800px] flex-1 scroll-mt-20 px-4 pb-24 pt-6 sm:px-8">
          <LazySearchExplorer />
        </section>

        {/* Steps */}
        <section className="vintage-dark border-y border-[#C9A24B]/20">
          <div className="mx-auto grid max-w-[1800px] grid-cols-1 gap-8 px-4 py-14 sm:grid-cols-3 sm:gap-10 sm:px-8 sm:py-20">
            {[
              { title: t.steps.title1, text: t.steps.text1 },
              { title: t.steps.title2, text: t.steps.text2 },
              { title: t.steps.title3, text: t.steps.text3 },
            ].map((step, i) => (
              <div key={step.title} className="flex flex-col items-start gap-2">
                <span className="vintage-plaque flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold">
                  0{i + 1}
                </span>
                <h3 className="font-card-title mt-1 text-xl text-[#F3E9C9]">
                  {step.title}
                </h3>
                <p className="text-sm text-[#B8AF98]">{step.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <FloatingFilterButton seasons={SEASONS} />
    </>
  );
}
