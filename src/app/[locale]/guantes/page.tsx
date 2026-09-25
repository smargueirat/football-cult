import { Metadata } from "next";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import GearHubLinks from "@/components/hubs/GearHubLinks";
import { asLocale, breadcrumbLd } from "@/lib/hubPages";
import { HUB } from "@/lib/hubStrings";
import { JsonLd } from "@/components/hubs/HubParts";
import GuantesPageClient from "./GuantesPageClient";

const META: Record<Locale, { title: string; description: string }> = {
  es: {
    title: "Guantes de arquero — Comparar precios | Football Cult",
    description: "Comparativa de guantes de arquero entre tiendas reales: Uhlsport, Reusch, adidas y más.",
  },
  en: {
    title: "Goalkeeper Gloves — Compare Prices | Football Cult",
    description: "Real goalkeeper glove comparison across stores: Uhlsport, Reusch, adidas and more.",
  },
  pt: {
    title: "Luvas de Goleiro — Comparar Preços | Football Cult",
    description: "Comparação real de luvas de goleiro entre lojas: Uhlsport, Reusch, adidas e mais.",
  },
  fr: {
    title: "Gants de Gardien — Comparer les Prix | Football Cult",
    description: "Comparatif réel de gants de gardien entre boutiques : Uhlsport, Reusch, adidas et plus.",
  },
  it: {
    title: "Guanti da Portiere — Confronta i Prezzi | Football Cult",
    description: "Confronto reale di guanti da portiere tra negozi: Uhlsport, Reusch, adidas e altri.",
  },
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
    alternates: buildAlternates(locale, "/guantes"),
  };
}

const SECTION_NAME: Record<Locale, string> = {
  es: META.es.title.split(" —")[0].split(" |")[0],
  en: META.en.title.split(" —")[0].split(" |")[0],
  pt: META.pt.title.split(" —")[0].split(" |")[0],
  fr: META.fr.title.split(" —")[0].split(" |")[0],
  it: META.it.title.split(" —")[0].split(" |")[0],
};

export default async function GuantesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      {/* Estas páginas de categoría no tenían breadcrumb: Google no
          veía la jerarquía inicio -> sección (Search Console, 25/09). */}
      <JsonLd
        data={breadcrumbLd(
          asLocale(locale),
          [{ name: HUB[asLocale(locale)].home, path: "" }, { name: SECTION_NAME[asLocale(locale)] }],
          "/guantes",
        )}
      />
      <GuantesPageClient />
      <GearHubLinks section="guantes" locale={asLocale(locale)} />
    </>
  );
}
