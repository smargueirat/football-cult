import { Metadata } from "next";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import VistosRecientementeClient from "./VistosRecientementeClient";

const META: Record<Locale, { title: string; description?: string }> = {
  es: { title: "Vistos recientemente | Football Cult" },
  en: { title: "Recently Viewed | Football Cult" },
  pt: { title: "Vistos Recentemente | Football Cult" },
  fr: { title: "Vus Récemment | Football Cult" },
  it: { title: "Visti di Recente | Football Cult" },
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
    alternates: buildAlternates(locale, "/vistos-recientemente"),
    robots: { index: false, follow: true },
  };
}

export default function Page() {
  return <VistosRecientementeClient />;
}
