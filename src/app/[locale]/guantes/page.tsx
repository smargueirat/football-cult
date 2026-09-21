import { Metadata } from "next";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import GearHubLinks from "@/components/hubs/GearHubLinks";
import { asLocale } from "@/lib/hubPages";
import GuantesPageClient from "./GuantesPageClient";

const META: Record<Locale, { title: string; description: string }> = {
  es: {
    title: "Guantes de arquero — Comparar precios | Football Cult",
    description: "Comparativa de guantes de arquero entre tiendas reales: Uhlsport, Reusch, adidas y más.",
  },
  en: {
    title: "Goalkeeper Gloves — Compare Prices | Football Cult",
    description: "Real goalkeeper glove comparison across stores: Uhlsport, Reusch, adidas and more.",
  },
  pt: {
    title: "Luvas de Goleiro — Comparar Preços | Football Cult",
    description: "Comparação real de luvas de goleiro entre lojas: Uhlsport, Reusch, adidas e mais.",
  },
  fr: {
    title: "Gants de Gardien — Comparer les Prix | Football Cult",
    description: "Comparatif réel de gants de gardien entre boutiques : Uhlsport, Reusch, adidas et plus.",
  },
  it: {
    title: "Guanti da Portiere — Confronta i Prezzi | Football Cult",
    description: "Confronto reale di guanti da portiere tra negozi: Uhlsport, Reusch, adidas e altri.",
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
    alternates: buildAlternates(locale, "/guantes"),
  };
}

export default async function GuantesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <GuantesPageClient />
      <GearHubLinks section="guantes" locale={asLocale(locale)} />
    </>
  );
}
