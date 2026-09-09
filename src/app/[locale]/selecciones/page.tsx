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
    title: "Selecciones nacionales — Comparar precios | Football Cult",
    description: "Camisetas de selecciones nacionales de todo el mundo, comparadas entre tiendas reales.",
    alternates: buildAlternates(locale, "/selecciones"),
  };
}

export default function SeleccionesPage() {
  return (
    <CategoryCatalogPage
      title="Selecciones nacionales"
      subtitle="Argentina, Brasil, España y las camisetas de selecciones de todo el mundo, comparadas en un solo lugar."
      category="national"
    />
  );
}
