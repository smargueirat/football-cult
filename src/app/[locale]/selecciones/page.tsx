import { Metadata } from "next";
import CategoryCatalogPage from "@/components/CategoryCatalogPage";
import { buildCategoryMetadata } from "@/lib/categoryMeta";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import DirectDeals from "@/components/DirectDeals";
import { todaysDeals } from "@/lib/directDeals";
import { CONV } from "@/lib/convStrings";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  return buildCategoryMetadata(locale, 0, "/selecciones");
}

export default async function SeleccionesPage({ params }: { params: Promise<{ locale: string }> }) {
  const raw = (await params).locale;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  return (
    <CategoryCatalogPage sectionIndex={0} category="national" guideSlug="camisetas-mundial-2026">
      <DirectDeals deals={todaysDeals(locale, ["camiseta"], "listado", "national")} title={CONV[locale].dealsTitle} surface="listado" />
    </CategoryCatalogPage>
  );
}
