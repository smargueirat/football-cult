import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter, Alfa_Slab_One, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StadiumWatermark from "@/components/StadiumWatermark";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { FavoritesProvider } from "@/lib/favorites/FavoritesContext";
import { CountryProvider } from "@/lib/country/CountryContext";
import { SearchFilterProvider } from "@/lib/search/SearchFilterContext";
import { CompareProvider } from "@/lib/compare/CompareContext";
import { PriceAlertsProvider } from "@/lib/priceAlerts/PriceAlertsContext";
import CompareBar from "@/components/CompareBar";

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

export const metadata: Metadata = {
  title: "Football Cult — Comparador de precios de camisetas de fútbol",
  description:
    "Buscá camisetas de fútbol de tu selección, club o liga favorita y compará precios entre distintas tiendas antes de comprar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
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
      </head>
      <body className="paper-texture flex min-h-full flex-col bg-[#f0e6d2] text-[#201d16]">
        <StadiumWatermark />
        <SessionProvider>
          <LanguageProvider>
            <CountryProvider>
              <FavoritesProvider>
                <PriceAlertsProvider>
                  <SearchFilterProvider>
                    <CompareProvider>
                      <Header />
                      <main className="flex flex-1 flex-col">{children}</main>
                      <Footer />
                      <CompareBar />
                    </CompareProvider>
                  </SearchFilterProvider>
                </PriceAlertsProvider>
              </FavoritesProvider>
            </CountryProvider>
          </LanguageProvider>
        </SessionProvider>
        <script
          type="text/javascript"
          src="https://s.skimresources.com/js/307104X1795379.skimlinks.js"
        />
      </body>
    </html>
  );
}
