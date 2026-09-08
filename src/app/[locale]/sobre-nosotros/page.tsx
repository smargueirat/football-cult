import { Metadata } from "next";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import SobreNosotrosClient from "./SobreNosotrosClient";

const META: Record<Locale, { title: string; description?: string }> = {
  es: { title: "Sobre nosotros | Football Cult", description: "Football Cult es un comparador de precios de camisetas de fútbol. Conocé cómo funciona el sitio." },
  en: { title: "About Us | Football Cult", description: "Football Cult is a football shirt price comparison site. Find out how it works." },
  pt: { title: "Sobre Nós | Football Cult", description: "Football Cult é um comparador de preços de camisas de futebol. Saiba como funciona o site." },
  fr: { title: "À Propos | Football Cult", description: "Football Cult est un comparateur de prix de maillots de football. Découvrez comment fonctionne le site." },
  it: { title: "Chi Siamo | Football Cult", description: "Football Cult è un comparatore di prezzi di maglie da calcio. Scopri come funziona il sito." },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  return {
    ...META[locale],
    alternates: buildAlternates(locale, "/sobre-nosotros"),
  };
}

export default function Page() {
  return <SobreNosotrosClient />;
}
