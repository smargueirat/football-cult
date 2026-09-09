import { Metadata } from "next";
import CategoryCatalogPage from "@/components/CategoryCatalogPage";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  return {
    title: "Camisetas de clubes — Comparar precios | Football Cult",
    description: "Real Madrid, Boca, Manchester United y cientos de clubes más, al mejor precio real.",
    alternates: buildAlternates(locale, "/clubes"),
  };
}

export default function ClubesPage() {
  return (
    <CategoryCatalogPage
      title="Grandes clubes"
      subtitle="Real Madrid, Boca, Manchester United y cientos de clubes más, al mejor precio real."
      category="club"
    />
  );
}
