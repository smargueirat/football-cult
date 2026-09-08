import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { Inter, Alfa_Slab_One, Cormorant_Garamond } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StadiumWatermark from "@/components/StadiumWatermark";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { FavoritesProvider } from "@/lib/favorites/FavoritesContext";
import { CountryProvider } from "@/lib/country/CountryContext";
import { SearchFilterProvider } from "@/lib/search/SearchFilterContext";
import { CompareProvider } from "@/lib/compare/CompareContext";
import CompareBar from "@/components/CompareBar";
import { Locale } from "@/lib/i18n/translations";
import { LOCALES, OG_LOCALE, buildAlternates, isLocale } from "@/lib/i18n/locales";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const alfaSlabOne = Alfa_Slab_One({
  variable: "--font-vintage",
  weight: "400",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-tagline",
  weight: ["500", "600"],
  subsets: ["latin"],
});

// Traducciones fieles del título/descripción de marca -- no son contenido
// de página (eso vive en translations.ts), son los dos strings que
// necesita <head> antes de que exista ningún <Translations> real, así
// que se resuelven acá directo por locale.
const SITE_META: Record<Locale, { title: string; description: string }> = {
  es: {
    title: "Football Cult — Comparador de precios de camisetas de fútbol",
    description:
      "Buscá camisetas de fútbol de tu selección, club o liga favorita y compará precios entre distintas tiendas antes de comprar.",
  },
  en: {
    title: "Football Cult — Football Shirt Price Comparison",
    description:
      "Search for football shirts from your national team, club, or favorite league and compare prices between different stores before buying.",
  },
  pt: {
    title: "Football Cult — Comparador de Preços de Camisas de Futebol",
    description:
      "Procure camisas de futebol da sua seleção, clube ou liga favorita e compare preços entre diferentes lojas antes de comprar.",
  },
  fr: {
    title: "Football Cult — Comparateur de Prix de Maillots de Football",
    description:
      "Recherchez des maillots de football de votre sélection, club ou ligue préférée et comparez les prix entre différentes boutiques avant d'acheter.",
  },
  it: {
    title: "Football Cult — Comparatore di Prezzi delle Maglie da Calcio",
    description:
      "Cerca maglie da calcio della tua nazionale, club o campionato preferito e confronta i prezzi tra diversi negozi prima di acquistare.",
  },
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "es";
  const { title, description } = SITE_META[locale];

  return {
    // Sin "www" -- mismo dominio que ya usan sitemap.ts/robots.ts/feed.xml/
    // el JSON-LD de producto como fuente de verdad (ver next.config.ts: la
    // versión con www redirige acá, no al revés).
    metadataBase: new URL("https://football-cult.com"),
    title,
    description,
    alternates: buildAlternates(locale, ""),
    // Código HTML-tag de Search Console (Configuración > Verificación de la
    // propiedad > etiqueta HTML): pegar solo el valor del atributo content,
    // no el <meta> entero. Sin la env var, Next directamente no imprime el
    // tag -- no hace falta tocar código de nuevo una vez que exista.
    verification: process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : undefined,
    openGraph: {
      title,
      description,
      siteName: "Football Cult",
      type: "website",
      locale: OG_LOCALE[locale],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${alfaSlabOne.variable} ${cormorant.variable} h-full antialiased`}
    >
      <head>
        {/* Impact.com pide este tag con el atributo "value" (no "content"),
            por eso el cast: el tipo de <meta> de React no lo contempla. */}
        <meta
          {...({
            name: "impact-site-verification",
            value: "8890468b-0e54-4e00-a128-a1a140108427",
          } as React.DetailedHTMLProps<
            React.MetaHTMLAttributes<HTMLMetaElement>,
            HTMLMetaElement
          >)}
        />
        <meta
          {...({
            name: "impact-site-verification",
            value: "8de79bb0-46f4-4bf9-be31-deac6e225a7f",
          } as React.DetailedHTMLProps<
            React.MetaHTMLAttributes<HTMLMetaElement>,
            HTMLMetaElement
          >)}
        />
        <meta name="verify-admitad" content="2666c15826" />
        <meta name="fo-verify" content="474f9e3b-cac4-4cea-9223-473788483f72" />
        {/* Ahorra el DNS+TLS de la primera foto en vez de pagarlo recién
            cuando el navegador la pide -- casi todas las fotos del
            catálogo pasan por este proxy (ver src/lib/images.ts). */}
        <link rel="preconnect" href="https://images.weserv.nl" />
      </head>
      <body className="paper-texture flex min-h-full flex-col bg-[#f0e6d2] text-[#201d16]">
        <StadiumWatermark />
        <SessionProvider>
          <LanguageProvider initialLocale={locale}>
            <CountryProvider>
              <FavoritesProvider>
                <SearchFilterProvider>
                  <CompareProvider>
                    <Header />
                    <main className="flex flex-1 flex-col">{children}</main>
                    <Footer />
                    <CompareBar />
                  </CompareProvider>
                </SearchFilterProvider>
              </FavoritesProvider>
            </CountryProvider>
          </LanguageProvider>
        </SessionProvider>
        <script
          type="text/javascript"
          src="https://s.skimresources.com/js/307104X1795379.skimlinks.js"
        />
        {/* Google Analytics -- Measurement ID de la propiedad GA4 creada
            2026-09-03 (analytics.google.com), seteado en Vercel como
            NEXT_PUBLIC_GA_MEASUREMENT_ID (mismo patrón que
            GOOGLE_SITE_VERIFICATION arriba: sin la env var, no se
            imprime nada). */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
