"use client";

import { goHref, type GoKind } from "@/lib/go";
import { trackOfferClick } from "@/lib/analytics";
import { CONV } from "@/lib/convStrings";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Botón directo a la mejor oferta, DEBAJO de la tarjeta (la tarjeta entera
// ya es un <a> a la ficha y un <a> no puede ir dentro de otro). Así, desde
// un listado: un toque a la tienda, o la tarjeta para comparar.
export default function CardGo({
  kind,
  productId,
  offer,
  total,
}: {
  kind: GoKind;
  productId: string;
  offer: { store: string; url: string; currency: string };
  total: number;
}) {
  const { locale } = useLanguage();
  return (
    <a
      href={goHref({ kind, productId, url: offer.url, locale, origin: "listado", position: 1, isBest: true })}
      target="_blank"
      rel="noopener noreferrer nofollow sponsored"
      data-testid="card-go"
      onClick={() =>
        trackOfferClick({ productId, position: 1, isBest: true, store: offer.store, url: offer.url, price: total, currency: offer.currency, surface: "listado" })
      }
      className="mt-1.5 flex min-h-11 items-center justify-center truncate rounded-full border border-[#1B3B2B]/25 bg-[#1B3B2B] px-2 text-center text-[11px] font-medium text-[#F3E9C9] transition-colors hover:bg-[#15301f] sm:text-sm"
    >
      <span className="truncate">{CONV[locale].goStore.replace("{store}", offer.store)}</span>
      <span aria-hidden className="ml-1">→</span>
    </a>
  );
}
