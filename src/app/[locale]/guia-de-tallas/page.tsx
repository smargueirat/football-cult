import { Metadata } from "next";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import GuiaDeTallasClient from "./GuiaDeTallasClient";

const META: Record<Locale, { title: string; description?: string }> = {
  es: { title: "Guía de tallas | Football Cult", description: "Cómo elegir la talla correcta de camiseta de fútbol: diferencia entre auténtica y réplica, cómo medir, y por qué cada marca talla distinto." },
  en: { title: "Size Guide | Football Cult", description: "How to choose the right football shirt size: the difference between authentic and replica, how to measure, and why each brand sizes differently." },
  pt: { title: "Guia de Tamanhos | Football Cult", description: "Como escolher o tamanho certo de camisa de futebol: a diferença entre autêntica e réplica, como medir, e por que cada marca tem uma numeração diferente." },
  fr: { title: "Guide des Tailles | Football Cult", description: "Comment choisir la bonne taille de maillot de football : la différence entre authentique et réplique, comment mesurer, et pourquoi chaque marque taille différemment." },
  it: { title: "Guida alle Taglie | Football Cult", description: "Come scegliere la taglia giusta per la maglia da calcio: la differenza tra autentica e replica, come misurare, e perché ogni marca ha una taglia diversa." },
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
    alternates: buildAlternates(locale, "/guia-de-tallas"),
  };
}

export default function Page() {
  return <GuiaDeTallasClient />;
}
