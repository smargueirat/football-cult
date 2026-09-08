import { Metadata } from "next";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import FranciaClient from "./FranciaClient";

const META: Record<Locale, { title: string; description?: string }> = {
  es: { title: "Fútbol francés | Football Cult", description: "Cómo cubrimos el fútbol francés en Football Cult: la Selección de Francia, comparada en hasta 10 tiendas distintas, y un archivo retro real desde 1950." },
  en: { title: "French Football | Football Cult", description: "How we cover French football at Football Cult: the France national team, compared across up to 10 different stores, and a real retro archive going back to 1950." },
  pt: { title: "Futebol Francês | Football Cult", description: "Como cobrimos o futebol francês na Football Cult: a Seleção da França, comparada em até 10 lojas diferentes, e um arquivo retrô real desde 1950." },
  fr: { title: "Football Français | Football Cult", description: "Comment nous couvrons le football français sur Football Cult : l'équipe de France, comparée dans jusqu'à 10 boutiques différentes, et une véritable archive rétro remontant à 1950." },
  it: { title: "Calcio Francese | Football Cult", description: "Come copriamo il calcio francese su Football Cult: la Nazionale francese, confrontata in fino a 10 negozi diversi, e un vero archivio retrò a partire dal 1950." },
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
    alternates: buildAlternates(locale, "/francia"),
  };
}

export default function Page() {
  return <FranciaClient />;
}
