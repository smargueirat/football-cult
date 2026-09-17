import { Metadata } from "next";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import TicketsPageClient from "./TicketsPageClient";

const META: Record<Locale, { title: string; description: string }> = {
  es: {
    title: "Entradas de fútbol — Comparar precios | Football Cult",
    description: "Comparativa de entradas de partidos de fútbol entre tiendas reales: Premier League, LaLiga, Champions League y más.",
  },
  en: {
    title: "Football Tickets — Compare Prices | Football Cult",
    description: "Real football match ticket comparison across stores: Premier League, LaLiga, Champions League and more.",
  },
  pt: {
    title: "Ingressos de Futebol — Comparar Preços | Football Cult",
    description: "Comparação real de ingressos de partidas de futebol entre lojas: Premier League, LaLiga, Champions League e mais.",
  },
  fr: {
    title: "Billets de Football — Comparer les Prix | Football Cult",
    description: "Comparatif réel de billets de matchs de football entre boutiques : Premier League, LaLiga, Ligue des Champions et plus.",
  },
  it: {
    title: "Biglietti di Calcio — Confronta i Prezzi | Football Cult",
    description: "Confronto reale di biglietti per partite di calcio tra negozi: Premier League, LaLiga, Champions League e altri.",
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
    alternates: buildAlternates(locale, "/tickets"),
  };
}

export default function TicketsPage() {
  return <TicketsPageClient />;
}
