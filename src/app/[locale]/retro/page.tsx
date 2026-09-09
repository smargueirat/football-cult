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
    title: "Colección retro — Comparar precios | Football Cult",
    description: "Camisetas vintage de temporadas 2006 para atrás, verificadas una por una.",
    alternates: buildAlternates(locale, "/retro"),
  };
}

export default function RetroPage() {
  return (
    <CategoryCatalogPage
      title="Colección retro"
      subtitle="Reliquias de otra época: camisetas vintage de temporadas 2006 para atrás, verificadas una por una."
      type="retro"
    />
  );
}
