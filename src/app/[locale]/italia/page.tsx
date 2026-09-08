import { Metadata } from "next";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import ItaliaClient from "./ItaliaClient";

const META: Record<Locale, { title: string; description?: string }> = {
  es: { title: "Fútbol italiano | Football Cult", description: "Cómo cubrimos el fútbol italiano en Football Cult: la Selección de Italia, comparada en hasta 9 tiendas distintas, y un archivo retro real desde 1970." },
  en: { title: "Italian Football | Football Cult", description: "How we cover Italian football at Football Cult: the Italy national team, compared across up to 9 different stores, and a real retro archive going back to 1970." },
  pt: { title: "Futebol Italiano | Football Cult", description: "Como cobrimos o futebol italiano na Football Cult: a Seleção da Itália, comparada em até 9 lojas diferentes, e um arquivo retrô real desde 1970." },
  fr: { title: "Football Italien | Football Cult", description: "Comment nous couvrons le football italien sur Football Cult : l'équipe d'Italie, comparée dans jusqu'à 9 boutiques différentes, et une véritable archive rétro remontant à 1970." },
  it: { title: "Calcio Italiano | Football Cult", description: "Come copriamo il calcio italiano su Football Cult: la Nazionale italiana, confrontata in fino a 9 negozi diversi, e un vero archivio retrò a partire dal 1970." },
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
    alternates: buildAlternates(locale, "/italia"),
  };
}

export default function Page() {
  return <ItaliaClient />;
}
