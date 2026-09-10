import { Metadata } from "next";
import CategoryCatalogPage from "@/components/CategoryCatalogPage";
import { buildCategoryMetadata } from "@/lib/categoryMeta";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  return buildCategoryMetadata(locale, 3, "/mujer");
}

export default function MujerPage() {
  return <CategoryCatalogPage sectionIndex={3} ageGroup="women" />;
}
