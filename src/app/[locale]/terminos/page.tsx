import { Metadata } from "next";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import TerminosClient from "./TerminosClient";

const META: Record<Locale, { title: string; description?: string }> = {
  es: { title: "Términos y condiciones | Football Cult", description: "Qué es Football Cult y cómo funciona nuestro servicio de comparación de precios." },
  en: { title: "Terms and Conditions | Football Cult", description: "What Football Cult is and how our price comparison service works." },
  pt: { title: "Termos e Condições | Football Cult", description: "O que é a Football Cult e como funciona nosso serviço de comparação de preços." },
  fr: { title: "Conditions Générales | Football Cult", description: "Ce qu'est Football Cult et comment fonctionne notre service de comparaison de prix." },
  it: { title: "Termini e Condizioni | Football Cult", description: "Cos'è Football Cult e come funziona il nostro servizio di confronto prezzi." },
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
    alternates: buildAlternates(locale, "/terminos"),
  };
}

export default function Page() {
  return <TerminosClient />;
}
