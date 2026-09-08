import { Metadata } from "next";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import FavoritosClient from "./FavoritosClient";

const META: Record<Locale, { title: string; description?: string }> = {
  es: { title: "Tus favoritos | Football Cult" },
  en: { title: "Your Favorites | Football Cult" },
  pt: { title: "Seus Favoritos | Football Cult" },
  fr: { title: "Vos Favoris | Football Cult" },
  it: { title: "I Tuoi Preferiti | Football Cult" },
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
    alternates: buildAlternates(locale, "/favoritos"),
    robots: { index: false, follow: true },
  };
}

export default function Page() {
  return <FavoritosClient />;
}
