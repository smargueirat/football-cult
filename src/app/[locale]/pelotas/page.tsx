import { Metadata } from "next";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import GearHubLinks from "@/components/hubs/GearHubLinks";
import { asLocale, breadcrumbLd } from "@/lib/hubPages";
import { HUB } from "@/lib/hubStrings";
import { JsonLd } from "@/components/hubs/HubParts";
import PelotasPageClient from "./PelotasPageClient";

const META: Record<Locale, { title: string; description: string }> = {
  es: {
    title: "Pelotas de fútbol — Comparar precios | Football Cult",
    description: "Comparativa de pelotas de fútbol entre tiendas reales: adidas, Nike, Erima y más.",
  },
  en: {
    title: "Football Balls — Compare Prices | Football Cult",
    description: "Real football ball comparison across stores: adidas, Nike, Erima and more.",
  },
  pt: {
    title: "Bolas de Futebol — Comparar Preços | Football Cult",
    description: "Comparação real de bolas de futebol entre lojas: adidas, Nike, Erima e mais.",
  },
  fr: {
    title: "Ballons de Football — Comparer les Prix | Football Cult",
    description: "Comparatif réel de ballons de football entre boutiques : adidas, Nike, Erima et plus.",
  },
  it: {
    title: "Palloni da Calcio — Confronta i Prezzi | Football Cult",
    description: "Confronto reale di palloni da calcio tra negozi: adidas, Nike, Erima e altri.",
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
    alternates: buildAlternates(locale, "/pelotas"),
  };
}

const SECTION_NAME: Record<Locale, string> = {
  es: META.es.title.split(" —")[0].split(" |")[0],
  en: META.en.title.split(" —")[0].split(" |")[0],
  pt: META.pt.title.split(" —")[0].split(" |")[0],
  fr: META.fr.title.split(" —")[0].split(" |")[0],
  it: META.it.title.split(" —")[0].split(" |")[0],
};

export default async function PelotasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      {/* Estas páginas de categoría no tenían breadcrumb: Google no
          veía la jerarquía inicio -> sección (Search Console, 25/09). */}
      <JsonLd
        data={breadcrumbLd(
          asLocale(locale),
          [{ name: HUB[asLocale(locale)].home, path: "" }, { name: SECTION_NAME[asLocale(locale)] }],
          "/pelotas",
        )}
      />
      <PelotasPageClient />
      <GearHubLinks section="pelotas" locale={asLocale(locale)} />
    </>
  );
}
