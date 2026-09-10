import { Metadata } from "next";
import Link from "@/lib/i18n/LocaleLink";
import { bootProducts } from "@/data/boots";
import BootCard from "@/components/BootCard";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  return {
    title: "Botas de fútbol — Comparar precios | Football Cult",
    description:
      "Comparativa piloto de botas de fútbol entre tiendas: Nike, adidas, Puma y más.",
    alternates: buildAlternates(locale, "/botas"),
  };
}

export default function BotasPage() {
  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-8 sm:px-8">
      <Link
        href="/"
        className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#675c44] transition-colors hover:text-[#1B3B2B]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver al catálogo
      </Link>
      <div className="mb-6">
        <h1 className="font-vintage text-2xl text-[#1B3B2B] sm:text-3xl">
          Botas de fútbol
        </h1>
        <p className="mt-2 text-sm text-[#675c44]">
          Piloto: {bootProducts.length} modelos reales comparados entre Futbol
          Emotion y Forum Sport.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 2xl:grid-cols-6">
        {bootProducts.map((product, i) => (
          <BootCard key={product.id} boot={product} priority={i < 8} />
        ))}
      </div>
    </div>
  );
}
