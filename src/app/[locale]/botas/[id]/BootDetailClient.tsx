"use client";

import Link from "@/lib/i18n/LocaleLink";
import Image from "next/image";
import { BootProduct } from "@/data/boots";
import { formatOfferMoney } from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function BootDetailClient({ boot }: { boot: BootProduct }) {
  const { t } = useLanguage();

  const sortedOffers = [...boot.offers].sort(
    (a, b) => a.price + a.shipping - (b.price + b.shipping)
  );
  const cheapestTotal = sortedOffers[0].price + sortedOffers[0].shipping;

  return (
    <div className="mx-auto w-full max-w-4xl px-3 py-8 sm:px-6">
      <Link
        href="/botas"
        className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#675c44] transition-colors hover:text-[#1B3B2B]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t.detail.backToCatalog}
      </Link>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white">
          <Image
            src={boot.offers[0].imageUrl}
            alt={boot.model}
            fill
            unoptimized
            className="object-contain p-6"
          />
        </div>
        <div>
          <span className="text-xs uppercase tracking-wide text-[#B8933F]">
            {boot.brand} · {boot.groundType}
          </span>
          <h1 className="font-vintage mt-1 text-2xl text-[#1B3B2B]">{boot.model}</h1>
          <p className="mt-2 text-sm text-[#675c44]">
            {t.botas.bestPrice}: {formatOfferMoney(cheapestTotal, "EUR")} {t.botas.shippingIncluded}
          </p>

          <div className="mt-6 flex flex-col gap-3">
            {sortedOffers.map((offer, i) => (
              <div
                key={offer.store}
                className="glass-panel flex items-center justify-between gap-3 rounded-xl border border-[#C9A24B]/25 p-4"
              >
                <div>
                  <p className="text-sm font-medium text-[#1a1a1a]">
                    {offer.store}
                    {i === 0 && (
                      <span className="ml-2 rounded-full bg-[#1B3B2B] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#F3E9C9]">
                        {t.botas.bestPrice}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-[#675c44]">
                    {t.botas.sizesEU}: {offer.sizes[0]}–{offer.sizes[offer.sizes.length - 1]}
                  </p>
                  <p className="text-xs text-[#675c44]">
                    {formatOfferMoney(offer.price, "EUR")}
                    {offer.shipping > 0
                      ? ` + ${formatOfferMoney(offer.shipping, "EUR")} ${t.botas.shippingCost}`
                      : ` · ${t.botas.freeShipping}`}
                  </p>
                </div>
                <a
                  href={offer.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="vintage-plaque shrink-0 rounded-xl px-4 py-2 text-sm font-semibold"
                >
                  {t.botas.viewOffer}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
