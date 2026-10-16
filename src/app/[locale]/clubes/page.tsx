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
  return buildCategoryMetadata(locale, 1, "/clubes");
}

export default async function ClubesPage({ params }: { params: Promise<{ locale: string }> }) {
  const raw = (await params).locale;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  return (
    <CategoryCatalogPage sectionIndex={1} category="club">
      <DirectDeals deals={todaysDeals(locale, ["camiseta"], "listado", "club")} title={CONV[locale].dealsTitle} surface="listado" />
    </CategoryCatalogPage>
  );
}
