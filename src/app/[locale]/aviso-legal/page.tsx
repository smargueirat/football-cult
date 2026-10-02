import { Metadata } from "next";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { LEGAL } from "@/lib/legalStrings";
import LegalPage from "@/components/LegalPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const p = LEGAL[locale].pages.aviso;
  return {
    title: p.metaTitle,
    description: p.metaDescription,
    alternates: buildAlternates(locale, "/aviso-legal"),
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  return <LegalPage locale={locale} pageKey="aviso" />;
}
