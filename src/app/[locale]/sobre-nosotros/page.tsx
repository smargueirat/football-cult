import { Metadata } from "next";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import SobreNosotrosClient from "./SobreNosotrosClient";

const META: Record<Locale, { title: string; description?: string }> = {
  es: { title: "Sobre nosotros | Football Cult", description: "Un pequeño equipo de aficionados que compara precios de camisetas, botas y material de fútbol. Cómo elegimos las ofertas y cómo nos financiamos." },
  en: { title: "About Us | Football Cult", description: "A small team of football fans comparing prices of shirts, boots and gear. How we pick offers and how we are funded." },
  pt: { title: "Sobre Nós | Football Cult", description: "Uma pequena equipe de fãs que compara preços de camisas, chuteiras e material de futebol. Como escolhemos as ofertas e como nos financiamos." },
  fr: { title: "À Propos | Football Cult", description: "Une petite équipe de passionnés qui compare les prix des maillots, crampons et équipements de football. Comment nous choisissons les offres et comment nous nous finançons." },
  it: { title: "Chi Siamo | Football Cult", description: "Una piccola squadra di appassionati che confronta i prezzi di maglie, scarpe e attrezzatura da calcio. Come scegliamo le offerte e come ci finanziamo." },
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
