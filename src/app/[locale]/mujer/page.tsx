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
    title: "Camisetas de mujer — Comparar precios | Football Cult",
    description: "Camisetas oficiales con corte de mujer, de las tiendas que realmente tienen stock.",
    alternates: buildAlternates(locale, "/mujer"),
  };
}

export default function MujerPage() {
  return (
    <CategoryCatalogPage
      title="Talles y cortes de mujer"
      subtitle="Camisetas oficiales con corte de mujer, de las tiendas que realmente tienen stock."
      ageGroup="women"
    />
  );
}
