import { Metadata } from "next";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import RopaPageClient from "./RopaPageClient";

const META: Record<Locale, { title: string; description: string }> = {
  es: {
    title: "Ropa de fútbol — Comparar precios | Football Cult",
    description: "Comparativa de shorts, chaquetas, pantalones y medias de fútbol entre tiendas reales.",
  },
  en: {
    title: "Football Apparel — Compare Prices | Football Cult",
    description: "Real comparison of football shorts, jackets, pants and socks across stores.",
  },
  pt: {
    title: "Roupas de Futebol — Comparar Preços | Football Cult",
    description: "Comparação real de shorts, jaquetas, calças e meias de futebol entre lojas.",
  },
  fr: {
    title: "Vêtements de Football — Comparer les Prix | Football Cult",
    description: "Comparatif réel de shorts, vestes, pantalons et chaussettes de football entre boutiques.",
  },
  it: {
    title: "Abbigliamento da Calcio — Confronta i Prezzi | Football Cult",
    description: "Confronto reale di shorts, giacche, pantaloni e calzettoni da calcio tra negozi.",
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
    alternates: buildAlternates(locale, "/ropa"),
  };
}

export default function RopaPage() {
  return <RopaPageClient />;
}
