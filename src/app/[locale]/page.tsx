import LazySearchExplorer from "@/components/LazySearchExplorer";
import FloatingFilterButton from "@/components/FloatingFilterButton";
import HeroCarousel from "@/components/HeroCarousel";
import HeroSearch from "@/components/HeroSearch";
import HomeCategoryTiles from "@/components/HomeCategoryTiles";
import CategorySections from "@/components/CategorySections";
import PriceDropsSection from "@/components/PriceDropsSection";
import LeagueShortcuts from "@/components/LeagueShortcuts";
import SeasonalBanner from "@/components/SeasonalBanner";
import { todayIso } from "@/lib/seasonal";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { translations } from "@/lib/i18n/translations";
import { SITE_URL } from "@/lib/hubPages";
import { heroSuggestions } from "@/lib/heroSuggestions";
import { groupThousands, trustStats } from "@/lib/trustStrip";
import { countries, type CountryCode } from "@/data/countries";
import { homeMeta, siteFaq } from "@/lib/siteFacts";
import type { Metadata } from "next";
import { buildAlternates, OG_LOCALE } from "@/lib/i18n/locales";
import { DEALS_NAV } from "@/lib/dealsNav";
import { GUIDE_UI } from "@/lib/guideUi";
import { QaList } from "@/components/hubs/HubParts";
import DirectDeals from "@/components/DirectDeals";
import { todaysDeals } from "@/lib/directDeals";
import { CONV } from "@/lib/convStrings";
import { LinkChipRow } from "@/components/hubs/HubLinkParts";
import { CLASSIC } from "@/lib/classicStrings";
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

// Título y descripción propios de la home (los del layout quedan como
// reserva genérica): la consulta de intención primero y cifras de hoy.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const { title, description } = homeMeta(locale);
  return {
    title,
    description,
    alternates: buildAlternates(locale, ""),
    openGraph: { title, description, siteName: "Football Cult", type: "website", locale: OG_LOCALE[locale] },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const t = translations[locale];
  const suggestions = heroSuggestions(locale);
  const trust = trustStats();
  const heroSub = t.hero.h1Sub
    .replace("{n}", groupThousands(trust.comparedProducts, locale))
    .replace("{s}", String(trust.stores));
  const { dropProducts, dropIdsByCountry } = computePriceDrops();
  const faq = siteFaq(locale);
  const deals = todaysDeals(locale, ["camiseta", "botas", "ropa", "guantes", "pelotas"], "home");

  return (
    <>
      {/* La home no tenía NINGÚN dato estructurado. Organization es lo que
          le dice a Google (y a los buscadores de IA) qué entidad es este
          sitio, y pesa especialmente acá: buscar "football-cult.com" en
          Bing devolvía thefootballcult.com, otro sitio que compite por la
          misma marca (comprobado 2026-09-25).

          El SearchAction recién se agregó cuando el endpoint existe de
          verdad: /es?q=... ahora filtra el catálogo (ver
          SearchQueryUrlSync.tsx). Antes no estaba a propósito, porque
          declarar un endpoint inexistente es peor que no declarar nada.
          Lo que gana no es el sitelinks searchbox de Google (esa función
          la retiró Google, y de todos modos solo aparecía en consultas de
          marca fuertes, que todavía no tenemos): es que la búsqueda pasó
          a tener URL propia, así que un resultado se puede compartir,
          enlazar y volver a él con el botón "atrás". */}
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
              description: heroSub,
              // Perfiles oficiales de la marca. Es lo que usa Google para
              // saber que la cuenta de X y el canal de Telegram son de este
              // sitio y no de otro "Football Cult" (hay varios).
              sameAs: ["https://x.com/FootballCultCom", "https://t.me/FootballCultOfertas"],
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: t.brand,
              url: `${SITE_URL}/${locale}`,
              inLanguage: locale,
              publisher: { "@type": "Organization", name: t.brand },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${SITE_URL}/${locale}?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            },
          ]),
        }}
      />
      <div className="flex flex-1 flex-col">
        {/* Cabecera (rediseño 2026-10-17, captura del dueño en iPhone): en
            390x844 la primera pantalla tiene que enseñar qué es esto, el
            buscador, las categorías y el comienzo de las ofertas con botón
            directo a tienda. Antes el carrusel (300 px) y un H1 de 5 líneas
            se comían la pantalla y el buscador caía en el borde: la home es
            el 75 % de las visitas y casi no daba clics a tienda.
            - H1 corto con la consulta clave por idioma (3 líneas en móvil, 2 en escritorio);
              el resto del mensaje va de subtítulo con las cifras contadas.
            - "Gratis, sin registro" y "N tiendas · envío incluido" son una
              línea de confianza, no una pastilla más entre categorías.
            - Categorías: 6 casillas iguales con icono (HomeCategoryTiles).
            - El carrusel emotivo baja debajo de las ofertas. */}
        <section className="mx-auto w-full max-w-[1800px] px-4 pt-3 sm:px-8 sm:pt-8">
          {/* Black Friday / Navidad y Reyes: solo en su ventana (src/lib/seasonal.ts). */}
          <SeasonalBanner today={todayIso()} />
          <div className="max-w-5xl">
            {/* min-h: el alto final (3 líneas en móvil, 2 en escritorio) se
                reserva antes de que llegue la fuente; con la de reserva, más
                estrecha, salía una línea menos y todo saltaba al cargar. */}
            <h1 className="font-vintage min-h-[3.36em] text-[25px] leading-[1.12] text-balance text-[#1B3B2B] sm:min-h-[2.24em] sm:text-[38px] lg:text-[44px]">
              {/* En escritorio el remate va en su propia línea: así son 2
                  líneas con la fuente final y con la de reserva, y el
                  texto no se reacomoda (CLS) cuando llega la fuente. */}
              {t.hero.h1} <span className="text-[#8a6a1f] sm:block">{t.hero.h1Accent}</span>
            </h1>
            {/* Cifras del contador real (no escritas a mano): antes dos
                bloques de la misma pantalla daban números distintos. */}
            <p className="mt-2 max-w-3xl text-[15px] leading-snug text-[#3f3a2f] sm:mt-3 sm:text-lg" data-hero="sub">
              {heroSub}
            </p>
            <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[13px] font-medium text-[#1B3B2B]" data-hero="trust">
              {[t.hero.h1Free, t.hero.trustShipping.replace("{s}", String(trust.stores))].map((line) => (
                <li key={line} className="flex items-center gap-1.5">
                  <svg viewBox="0 0 20 20" aria-hidden className="h-4 w-4 shrink-0 fill-[#8a6a1f]">
                    <path d="M10 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm-1.2 12-3.5-3.4 1.2-1.2 2.3 2.2 4.8-4.9 1.2 1.2-6 6.1Z" />
                  </svg>
                  {line}
                </li>
              ))}
            </ul>

            {/* Escribe en el mismo estado compartido que el catálogo de
                abajo (no es un segundo buscador). */}
            <HeroSearch suggestions={suggestions} />
            <HomeCategoryTiles locale={locale} labels={t.hero.cats} />
          </div>

          {/* Home -> tienda en un toque. La home recibía el 64 % de las
              entradas y no producía NINGÚN clic a tienda (GA4, 90 días):
              el único camino pasaba por ficha. */}
          <DirectDeals
            deals={deals}
            eyebrow={CONV[locale].dealsEyebrow}
            title={CONV[locale].dealsTitle}
            sub={CONV[locale].dealsSub}
            surface="home"
          />

          {/* Carrusel de secciones: copy emotivo y fotos de campaña. Iba
              arriba del todo y empujaba el buscador fuera de la pantalla. */}
          <div className="mt-8">
            <HeroCarousel />
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

        {/* Qué es y cómo elige precios, con cifras de hoy: la respuesta corta
            que un buscador (o ChatGPT, que ya nos trae más visitas que Bing)
            puede citar, y enlaces a las páginas de bajadas (2026-10-09). */}
        <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-8">
          <h2 className="font-vintage mb-5 text-2xl text-[#1B3B2B]">{faq.h2}</h2>
          <QaList items={faq.qa} />
          <div className="mt-8">
            <LinkChipRow
              title={GUIDE_UI[locale].related}
              items={[
                { href: `/${locale}/ofertas-de-la-semana`, label: DEALS_NAV[locale].week },
                { href: `/${locale}/bajadas-de-precio`, label: DEALS_NAV[locale].drops },
                { href: `/${locale}/minimos-historicos`, label: DEALS_NAV[locale].lows },
                { href: `/${locale}/black-friday`, label: DEALS_NAV[locale].bf },
                { href: `/${locale}/regalos-futbol`, label: DEALS_NAV[locale].gifts },
                { href: `/${locale}/clasicas`, label: CLASSIC[locale].allH1 },
                { href: `/${locale}/guia`, label: GUIDE_UI[locale].index },
                { href: `/${locale}/estudios/precios-camisetas`, label: t.footer.priceStudy },
              ]}
            />
          </div>
        </section>
      </div>

      <FloatingFilterButton seasons={SEASONS} />
    </>
  );
}
