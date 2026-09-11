import { Metadata } from "next";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import CompareClient from "./CompareClient";

const META: Record<Locale, { title: string; description?: string }> = {
  es: { title: "Comparar productos | Football Cult" },
  en: { title: "Compare Products | Football Cult" },
  pt: { title: "Comparar Produtos | Football Cult" },
  fr: { title: "Comparer les Produits | Football Cult" },
  it: { title: "Confronta Prodotti | Football Cult" },
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
    alternates: buildAlternates(locale, "/comparar"),
    robots: { index: false, follow: true },
  };
}

export default function Page() {
  return <CompareClient />;
}
