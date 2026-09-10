import { Metadata } from "next";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import BotasPageClient from "./BotasPageClient";

const META: Record<Locale, { title: string; description: string }> = {
  es: {
    title: "Botas de fútbol — Comparar precios | Football Cult",
    description: "Comparativa piloto de botas de fútbol entre tiendas: Nike, adidas, Puma y más.",
  },
  en: {
    title: "Football Boots — Compare Prices | Football Cult",
    description: "Pilot comparison of football boots across stores: Nike, adidas, Puma and more.",
  },
  pt: {
    title: "Chuteiras de Futebol — Comparar Preços | Football Cult",
    description: "Comparação piloto de chuteiras de futebol entre lojas: Nike, adidas, Puma e mais.",
  },
  fr: {
    title: "Chaussures de Football — Comparer les Prix | Football Cult",
    description: "Comparatif pilote de chaussures de football entre boutiques : Nike, adidas, Puma et plus.",
  },
  it: {
    title: "Scarpini da Calcio — Confronta i Prezzi | Football Cult",
    description: "Confronto pilota di scarpini da calcio tra negozi: Nike, adidas, Puma e altri.",
  },
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
    alternates: buildAlternates(locale, "/botas"),
  };
}

export default function BotasPage() {
  return <BotasPageClient />;
}
