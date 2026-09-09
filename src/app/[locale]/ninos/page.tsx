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
    title: "Camisetas de niños — Comparar precios | Football Cult",
    description: "Camisetas infantiles de sus ídolos, en los talles que necesitás.",
    alternates: buildAlternates(locale, "/ninos"),
  };
}

export default function NinosPage() {
  return (
    <CategoryCatalogPage
      title="Los hinchas más chicos"
      subtitle="Camisetas infantiles de sus ídolos, en los talles que necesitás."
      ageGroup="kids"
    />
  );
}
