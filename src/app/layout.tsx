import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StadiumWatermark from "@/components/StadiumWatermark";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { FavoritesProvider } from "@/lib/favorites/FavoritesContext";
import { CountryProvider } from "@/lib/country/CountryContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-vintage",
  weight: "400",
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
      className={`${inter.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#f7f5f0] text-[#1a1a1a]">
        <StadiumWatermark />
        <LanguageProvider>
          <CountryProvider>
            <FavoritesProvider>
              <Header />
              <main className="flex flex-1 flex-col">{children}</main>
              <Footer />
            </FavoritesProvider>
          </CountryProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
