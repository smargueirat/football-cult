import { Metadata } from "next";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import GearHubLinks from "@/components/hubs/GearHubLinks";
import { asLocale } from "@/lib/hubPages";
import EntrenamientoPageClient from "./EntrenamientoPageClient";

const META: Record<Locale, { title: string; description: string }> = {
  es: {
    title: "Equipamiento de entrenamiento de fútbol — Comparar precios | Football Cult",
    description: "Comparativa de petos, conos, vallas, escaleras de agilidad, redes y material de entrenamiento entre tiendas reales.",
  },
  en: {
    title: "Football Training Equipment — Compare Prices | Football Cult",
    description: "Real price comparison of training bibs, cones, hurdles, agility ladders, nets and coaching gear across stores.",
  },
  pt: {
    title: "Material de Treino de Futebol — Comparar Preços | Football Cult",
    description: "Comparação real de coletes, cones, barreiras, escadas de agilidade, redes e material de treino entre lojas.",
  },
  fr: {
    title: "Matériel d'Entraînement de Football — Comparer les Prix | Football Cult",
    description: "Comparatif réel de chasubles, cônes, haies, échelles de rythme, filets et matériel d'entraînement entre boutiques.",
  },
  it: {
    title: "Materiale da Allenamento Calcio — Confronta i Prezzi | Football Cult",
    description: "Confronto reale di casacche, coni, ostacoli, scale di agilità, reti e materiale da allenamento tra negozi.",
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
    alternates: buildAlternates(locale, "/entrenamiento"),
  };
}

export default async function EntrenamientoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <EntrenamientoPageClient />
      <GearHubLinks section="entrenamiento" locale={asLocale(locale)} />
    </>
  );
}
