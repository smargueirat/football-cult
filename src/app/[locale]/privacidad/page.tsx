import { Metadata } from "next";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import PrivacidadClient from "./PrivacidadClient";

const META: Record<Locale, { title: string; description?: string }> = {
  es: { title: "Política de privacidad | Football Cult", description: "Qué información recopila Football Cult y cómo la usa." },
  en: { title: "Privacy Policy | Football Cult", description: "What information Football Cult collects and how it's used." },
  pt: { title: "Política de Privacidade | Football Cult", description: "Quais informações a Football Cult coleta e como as usa." },
  fr: { title: "Politique de Confidentialité | Football Cult", description: "Quelles informations Football Cult collecte et comment elles sont utilisées." },
  it: { title: "Informativa sulla Privacy | Football Cult", description: "Quali informazioni raccoglie Football Cult e come le utilizza." },
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
    alternates: buildAlternates(locale, "/privacidad"),
  };
}

export default function Page() {
  return <PrivacidadClient />;
}
