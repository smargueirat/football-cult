import { Metadata } from "next";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import AutenticidadClient from "./AutenticidadClient";

const META: Record<Locale, { title: string; description?: string }> = {
  es: { title: "Cómo verificar autenticidad | Football Cult", description: "Diferencia entre camiseta auténtica y réplica, señales de un vendedor no confiable, y cómo marcamos las ofertas de réplicas no oficiales en el sitio." },
  en: { title: "How to Verify Authenticity | Football Cult", description: "The difference between an authentic shirt and a replica, signs of an untrustworthy seller, and how we flag unofficial replica offers on the site." },
  pt: { title: "Como Verificar Autenticidade | Football Cult", description: "A diferença entre uma camisa autêntica e uma réplica, sinais de um vendedor não confiável, e como marcamos as ofertas de réplicas não oficiais no site." },
  fr: { title: "Comment Vérifier l'Authenticité | Football Cult", description: "La différence entre un maillot authentique et une réplique, les signes d'un vendeur non fiable, et comment nous signalons les offres de répliques non officielles sur le site." },
  it: { title: "Come Verificare l'Autenticità | Football Cult", description: "La differenza tra una maglia autentica e una replica, i segnali di un venditore non affidabile, e come segnaliamo le offerte di repliche non ufficiali sul sito." },
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
    alternates: buildAlternates(locale, "/autenticidad"),
  };
}

export default function Page() {
  return <AutenticidadClient />;
}
