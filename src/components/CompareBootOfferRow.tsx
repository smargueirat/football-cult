"use client";

import { BootOffer } from "@/data/boots";
import { formatOfferMoney } from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Mismo layout visual que CompareOfferRow.tsx, pero para una BootOffer
// real en vez de una Offer de camiseta: sin useLiveOfferCosts (esa
// lógica de envío en vivo/cargos de importación es para las tiendas de
// camisetas que envían cruzando fronteras) y sin fila de impuestos (ese
// concepto no existe en ningún otro lugar de botas). La mayoría de las
// tiendas de botas son ES/IE en EUR, precio final tal cual muestra el
// feed -- Pro Soccer (EE.UU., USD) es la excepción, con el mismo trato
// de moneda real (nunca convertida) que ya usa BootDetailClient.
export default function CompareBootOfferRow({
  offer,
  isBest,
}: {
  offer: BootOffer;
  isBest: boolean;
}) {
  const { t } = useLanguage();
  const total = offer.price + offer.shipping;
  const isProSoccer = offer.store === "ProSoccer";

  return (
    <a
      href={offer.url}
      target="_blank"
      rel="noopener noreferrer nofollow sponsored"
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
        <span className="font-medium text-[#1a1a1a]">{formatOfferMoney(offer.price, offer.currency)}</span>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-[#675c44]">{t.compare.shippingCost}</span>
        <span className="font-medium text-[#1a1a1a]">
          {isProSoccer
            ? t.botas.shippingCalculatedAtStore
            : offer.shipping > 0
              ? formatOfferMoney(offer.shipping, offer.currency)
              : t.compare.freeShipping}
        </span>
      </div>
      <div className="mt-0.5 flex justify-between border-t border-[#C9A24B]/15 pt-1.5 text-sm">
        <span className="font-medium text-[#675c44]">{t.compare.total}</span>
        <span className="font-semibold text-[#B45309]">
          {formatOfferMoney(total, offer.currency)}
          {isProSoccer && "+"}
        </span>
      </div>
    </a>
  );
}
