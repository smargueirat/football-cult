import { Metadata } from "next";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import ArgentinaClient from "./ArgentinaClient";

const META: Record<Locale, { title: string; description?: string }> = {
  es: { title: "Fútbol argentino | Football Cult", description: "Cómo cubrimos el fútbol argentino en Football Cult: la Selección Argentina, comparada en hasta 12 tiendas distintas, y un archivo retro real desde 1982." },
  en: { title: "Argentine Football | Football Cult", description: "How we cover Argentine football at Football Cult: the Argentina national team, compared across up to 12 different stores, and a real retro archive going back to 1982." },
  pt: { title: "Futebol Argentino | Football Cult", description: "Como cobrimos o futebol argentino na Football Cult: a Seleção Argentina, comparada em até 12 lojas diferentes, e um arquivo retrô real desde 1982." },
  fr: { title: "Football Argentin | Football Cult", description: "Comment nous couvrons le football argentin sur Football Cult : l'équipe d'Argentine, comparée dans jusqu'à 12 boutiques différentes, et une véritable archive rétro remontant à 1982." },
  it: { title: "Calcio Argentino | Football Cult", description: "Come copriamo il calcio argentino su Football Cult: la Nazionale argentina, confrontata in fino a 12 negozi diversi, e un vero archivio retrò a partire dal 1982." },
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
    alternates: buildAlternates(locale, "/argentina"),
  };
}

export default function Page() {
  return <ArgentinaClient />;
}
