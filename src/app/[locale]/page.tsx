import LazySearchExplorer from "@/components/LazySearchExplorer";
import FloatingFilterButton from "@/components/FloatingFilterButton";
import HeroCarousel from "@/components/HeroCarousel";
import HeroSearch from "@/components/HeroSearch";
import CategorySections from "@/components/CategorySections";
import PriceDropsSection from "@/components/PriceDropsSection";
import LeagueShortcuts from "@/components/LeagueShortcuts";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { translations } from "@/lib/i18n/translations";
import { SITE_URL } from "@/lib/hubPages";
import { heroSuggestions } from "@/lib/heroSuggestions";
import { groupThousands, trustStats } from "@/lib/trustStrip";
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
  const suggestions = heroSuggestions(locale);
  const trust = trustStats();
  const { dropProducts, dropIdsByCountry } = computePriceDrops();

  return (
    <>
      {/* La home no tenía NINGÚN dato estructurado. Organization es lo que
          le dice a Google (y a los buscadores de IA) qué entidad es este
          sitio, y pesa especialmente acá: buscar "football-cult.com" en
          Bing devolvía thefootballcult.com, otro sitio que compite por la
          misma marca (comprobado 2026-09-25).

          NO se declara un SearchAction (la caja de búsqueda en los
          resultados de Google) a propósito: haría falta que el buscador
          respondiera a una URL tipo ?q=..., y hoy el estado de búsqueda
          es solo de cliente. Declarar un endpoint que no existe es peor
          que no declarar nada. */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: t.brand,
              url: `${SITE_URL}/${locale}`,
              logo: `${SITE_URL}/logo-badge.png`,
              description: t.hero.h1Sub.replace("{s}", String(trust.stores)),
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: t.brand,
              url: `${SITE_URL}/${locale}`,
              inLanguage: locale,
              publisher: { "@type": "Organization", name: t.brand },
            },
          ]),
        }}
      />
      <div className="flex flex-1 flex-col">
        {/* Hero: carrusel dinámico que va rotando entre las secciones
            reales del catálogo (selecciones, clubes, retro, mujer,
            niños, botas), cada una con una foto real de una oferta
            cargada -- reemplaza la placa chica de siempre. */}
        <section className="mx-auto w-full max-w-[1800px] px-4 pt-3 sm:px-8 sm:pt-6">
          <HeroCarousel />
          {/* H1 fijo con la propuesta de valor. Antes el H1 era el título
              del carrusel y rotaba con él, así que ni el visitante ni
              Google llegaban a saber qué hace el sitio: el copy de las
              diapositivas es emotivo ("Los colores que elegiste de chico")
              y nunca dice que esto compara precios. El copy emotivo se
              queda arriba, en las diapositivas; la explicación va acá
              (auditoría 2026-09-24).

              La composición usa el mismo vocabulario que el resto del
              sitio -- volanta en font-tagline dorada, titular en
              font-vintage, vintage-divider, fichas con borde dorado --
              porque en su primera versión eran dos párrafos planos sin
              jerarquía y, siendo lo primero que se ve, parecía un
              documento de texto. */}
          <div className="mt-6 sm:mt-9">
            {/* La volanta estaba en 10px dorado claro sobre crema: casi
                no se leía. Sube de tamaño y baja a un dorado más oscuro,
                que sobre el fondo claro sí contrasta. */}
            <span className="font-tagline text-[11px] uppercase text-[#8a6a1f] sm:text-sm">
              {t.hero.h1Eyebrow}
            </span>

            <h1 className="font-vintage mt-2.5 max-w-4xl text-[26px] leading-[1.1] text-balance text-[#1B3B2B] sm:mt-3 sm:text-[38px] lg:text-[46px]">
              {t.hero.h1}{" "}
              {/* El remate va en dorado y subrayado a mano: es lo que nos
                  diferencia de mirar el precio suelto en cada tienda. */}
              <span className="relative inline-block text-[#8a6a1f]">
                {t.hero.h1Accent}
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-0.5 h-[0.14em] rounded-full bg-[#C9A24B]/55 sm:-bottom-1"
                />
              </span>
            </h1>

            <div className="vintage-divider mt-6 max-w-2xl sm:mt-7" />

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#3f3a2f] sm:text-lg">
              {/* El número de tiendas sale del contador real, no escrito
                  a mano: la volanta decía "14 tiendas" (las del estudio de
                  camisetas en euros) mientras la franja de abajo contaba
                  37, dos cifras distintas en la misma pantalla. */}
              {t.hero.h1Sub.replace("{s}", String(trust.stores))}
            </p>

            <ul className="mt-4 flex flex-wrap items-center gap-2">
              {t.hero.h1Items.map((item) => (
                <li
                  key={item}
                  className="font-card-title rounded-full border border-[#C9A24B]/45 bg-white/70 px-3.5 py-1.5 text-xs tracking-wide text-[#4a4438] sm:text-[13px]"
                >
                  {item}
                </li>
              ))}
              <li className="font-card-title rounded-full bg-[#1B3B2B] px-3.5 py-1.5 text-xs tracking-wide text-[#F3E9C9] sm:text-[13px]">
                {t.hero.h1Free}
              </li>
            </ul>

            {/* El catálogo y sus filtros vivían al final de la página,
                después del carrusel, las categorías, las ligas y las
                bajadas de precio: había que hacer bastante scroll antes
                de poder buscar. Esto escribe en el mismo estado
                compartido, no es un segundo buscador. */}
            <HeroSearch suggestions={suggestions} />

            {/* Franja de confianza con números CONTADOS del catálogo.
                La versión propuesta decía "+10.000 artículos comparados"
                y "tiendas 100% verificadas y oficiales": las dos falsas y
                comprobables (comparan 7.584, y listamos eBay, Amazon y
                una tienda de réplicas). Una franja de confianza que
                miente es peor que no tenerla. */}
            <ul className="mt-7 grid gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
              {[
                t.hero.trustCompared
                  .replace("{n}", groupThousands(trust.comparedProducts, locale))
                  .replace("{s}", String(trust.stores)),
                t.hero.trustShipping,
                t.hero.trustFresh,
              ].map((line) => (
                <li
                  key={line}
                  className="vintage-card flex items-start gap-2.5 rounded-xl px-4 py-3.5 text-sm leading-snug text-[#3f3a2f] sm:text-[15px]"
                >
                  <span aria-hidden className="mt-px text-[#B8933F]">
                    ◆
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
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
