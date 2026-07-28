import type { Metadata } from "next";
import Image from "next/image";
import { Geist, Geist_Mono, Russo_One } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const russoOne = Russo_One({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Football Cult — Comparador de precios de camisetas de fútbol",
  description:
    "Buscá camisetas de fútbol de tu selección o club favorito y compará precios entre distintas tiendas antes de comprar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${russoOne.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#05060a] text-zinc-50">
        <div className="fixed inset-0 -z-10">
          <Image
            src="/images/stadium-crowd.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-[0.55]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#05060a]/70 via-[#05060a]/60 to-[#05060a]/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#05060a_92%)]" />
        </div>
        <LanguageProvider>
          <Header />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
