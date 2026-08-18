"use client";

import { Offer, formatOfferMoney } from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useLiveOfferCosts } from "@/lib/useLiveOfferCosts";

export default function CompareOfferRow({
  offer,
  countryCode,
  isBest,
}: {
  offer: Offer;
  countryCode: string;
  isBest: boolean;
}) {
  const { t } = useLanguage();
  const { shipping, importCharges } = useLiveOfferCosts(offer, countryCode);
  const total = offer.price + shipping + importCharges;

  return (
    <a
      href={offer.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`flex flex-col gap-1.5 rounded-xl border p-3 transition-colors ${
        isBest
          ? "border-[#1B3B2B]/40 bg-[#1B3B2B]/[0.06]"
          : "border-[#C9A24B]/20 bg-[#FFFDF8] hover:border-[#C9A24B]/50"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-[#1a1a1a]">{offer.store}</span>
        {isBest && (
          <span className="rounded-full bg-[#1B3B2B] px-2 py-0.5 text-[10px] font-semibold text-[#F3E9C9]">
            {t.product.bestPrice}
          </span>
        )}
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-[#675c44]">{t.compare.price}</span>
        <span className="font-medium text-[#1a1a1a]">
          {formatOfferMoney(offer.price, offer.currency)}
        </span>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-[#675c44]">{t.compare.taxes}</span>
        <span className="font-medium text-[#1a1a1a]">
          {importCharges > 0 ? formatOfferMoney(importCharges, offer.currency) : t.compare.taxesIncluded}
        </span>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-[#675c44]">{t.compare.shippingCost}</span>
        <span className="font-medium text-[#1a1a1a]">
          {shipping > 0 ? formatOfferMoney(shipping, offer.currency) : t.compare.freeShipping}
        </span>
      </div>
      <div className="mt-0.5 flex justify-between border-t border-[#C9A24B]/15 pt-1.5 text-sm">
        <span className="font-medium text-[#675c44]">{t.compare.total}</span>
        <span className="font-semibold text-[#B45309]">
          {formatOfferMoney(total, offer.currency)}
        </span>
      </div>
    </a>
  );
}
