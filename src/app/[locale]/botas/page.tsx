import { Metadata } from "next";
import Image from "next/image";
import Link from "@/lib/i18n/LocaleLink";
import { bootProducts } from "@/data/boots";
import { formatOfferMoney } from "@/data/products";
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
    <div className="mx-auto w-full max-w-6xl px-3 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="font-vintage text-2xl text-[#1B3B2B] sm:text-3xl">
          Botas de fútbol
        </h1>
        <p className="mt-2 text-sm text-[#675c44]">
          Piloto: {bootProducts.length} modelos reales comparados entre Futbol
          Emotion y Forum Sport.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {bootProducts.map((product) => {
          const cheapest = product.offers.reduce((a, b) =>
            a.price + a.shipping <= b.price + b.shipping ? a : b
          );
          return (
            <Link
              key={product.id}
              href={`/botas/${product.id}`}
              className="glass-panel group flex flex-col overflow-hidden rounded-2xl border border-[#C9A24B]/25 transition-shadow hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.18)]"
            >
              <div className="relative aspect-square w-full bg-white">
                <Image
                  src={cheapest.imageUrl}
                  alt={product.model}
                  fill
                  unoptimized
                  className="object-contain p-4 transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1 p-3">
                <span className="text-[11px] uppercase tracking-wide text-[#B8933F]">
                  {product.brand} · {product.groundType}
                </span>
                <span className="line-clamp-2 text-sm font-medium text-[#1a1a1a]">
                  {product.model}
                </span>
                <span className="mt-auto text-sm font-semibold text-[#1B3B2B]">
                  Desde {formatOfferMoney(cheapest.price, "EUR")}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
