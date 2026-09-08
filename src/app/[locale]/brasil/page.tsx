import { Metadata } from "next";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import BrasilClient from "./BrasilClient";

const META: Record<Locale, { title: string; description?: string }> = {
  es: { title: "Fútbol brasileño | Football Cult", description: "Cómo cubrimos el fútbol brasileño en Football Cult: selección, catorce clubes y cinco tiendas oficiales de club integradas al catálogo." },
  en: { title: "Brazilian Football | Football Cult", description: "How we cover Brazilian football at Football Cult: the national team, fourteen clubs, and five official club stores integrated into the catalog." },
  pt: { title: "Futebol Brasileiro | Football Cult", description: "Como cobrimos o futebol brasileiro na Football Cult: seleção, quatorze clubes e cinco lojas oficiais de clube integradas ao catálogo." },
  fr: { title: "Football Brésilien | Football Cult", description: "Comment nous couvrons le football brésilien sur Football Cult : l'équipe nationale, quatorze clubs et cinq boutiques officielles de club intégrées au catalogue." },
  it: { title: "Calcio Brasiliano | Football Cult", description: "Come copriamo il calcio brasiliano su Football Cult: nazionale, quattordici club e cinque negozi ufficiali di club integrati nel catalogo." },
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
    alternates: buildAlternates(locale, "/brasil"),
  };
}

export default function Page() {
  return <BrasilClient />;
}
