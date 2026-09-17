"use client";

import Link from "@/lib/i18n/LocaleLink";
import {
  bestOfferForCountry,
  displayTitleForCountry,
  findProduct,
  offerTotal,
  teamNames,
  typeNames,
} from "@/data/products";
import { bootProducts } from "@/data/boots";
import { gloveProducts } from "@/data/gloves";
import { ballProducts } from "@/data/balls";
import { ticketProducts } from "@/data/tickets";
import { ticketOfferTotalInEUR } from "@/lib/offerMoney";
import { formatOfferMoney, bootOfferTotalInEUR } from "@/lib/offerMoney";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useFavorites } from "@/lib/favorites/FavoritesContext";
import { useCountry } from "@/lib/country/CountryContext";

// Separado de FavoritesButton.tsx a propósito -- ver el comentario
// largo ahí. Este archivo (y sólo este) importa products.ts, así que
// sólo se carga cuando el usuario realmente abre el panel de
// favoritos, no en cada página del sitio.
//
// Un id favorito puede ser de una camiseta (products.ts) o de una bota
// (boots.ts) -- pedido explícito del usuario: "tampoco está la opción
// de comparar/favoritos [en botas]... tiene que tener el mismo
// comportamiento". FavoritesContext ya guardaba ids genéricos, esto
// resuelve cada uno contra el catálogo que corresponda.
export default function FavoritesPanelContent({ onNavigate }: { onNavigate: () => void }) {
  const { locale, t } = useLanguage();
  const { countryCode } = useCountry();
  const { favorites } = useFavorites();

  const savedItems = favorites
    .map((id) => {
      const product = findProduct(id);
      if (product) return { kind: "jersey" as const, id, product };
      const boot = bootProducts.find((b) => b.id === id);
      if (boot) return { kind: "boot" as const, id, boot };
      const glove = gloveProducts.find((g) => g.id === id);
      if (glove) return { kind: "glove" as const, id, glove };
      const ball = ballProducts.find((b) => b.id === id);
      if (ball) return { kind: "ball" as const, id, ball };
      const ticket = ticketProducts.find((tk) => tk.id === id);
      if (ticket) return { kind: "ticket" as const, id, ticket };
      return null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <>
      {savedItems.length === 0 ? (
        <p className="text-xs text-[#675c44]">{t.favoritesPanel.empty}</p>
      ) : (
        <ul className="flex max-h-72 flex-col gap-1 overflow-y-auto">
          {savedItems.map((item) => {
            if (item.kind === "boot") {
              const cheapest = item.boot.offers.reduce((a, b) =>
                bootOfferTotalInEUR(a) <= bootOfferTotalInEUR(b) ? a : b
              );
              return (
                <li key={item.id}>
                  <Link
                    href={`/botas/${item.boot.id}`}
                    onClick={onNavigate}
                    className="flex items-center justify-between gap-2 rounded-xl px-2 py-2 transition-colors hover:bg-black/[0.04]"
                  >
                    <span className="truncate text-sm text-[#1a1a1a]">{item.boot.model}</span>
                    <span className="text-sm font-semibold text-[#B45309]">
                      {formatOfferMoney(cheapest.price + cheapest.shipping, cheapest.currency)}
                    </span>
                  </Link>
                </li>
              );
            }
            if (item.kind === "ticket") {
              const cheapest = item.ticket.offers.reduce((a, b) =>
                ticketOfferTotalInEUR(a) <= ticketOfferTotalInEUR(b) ? a : b
              );
              return (
                <li key={item.id}>
                  <Link
                    href={`/tickets/${item.ticket.id}`}
                    onClick={onNavigate}
                    className="flex items-center justify-between gap-2 rounded-xl px-2 py-2 transition-colors hover:bg-black/[0.04]"
                  >
                    <span className="truncate text-sm text-[#1a1a1a]">{item.ticket.event}</span>
                    <span className="text-sm font-semibold text-[#B45309]">
                      {formatOfferMoney(cheapest.price, cheapest.currency)}
                    </span>
                  </Link>
                </li>
              );
            }
            if (item.kind === "glove" || item.kind === "ball") {
              const gearItem = item.kind === "glove" ? item.glove : item.ball;
              const basePath = item.kind === "glove" ? "guantes" : "pelotas";
              const cheapest = gearItem.offers.reduce((a, b) =>
                a.price + a.shipping <= b.price + b.shipping ? a : b
              );
              return (
                <li key={item.id}>
                  <Link
                    href={`/${basePath}/${gearItem.id}`}
                    onClick={onNavigate}
                    className="flex items-center justify-between gap-2 rounded-xl px-2 py-2 transition-colors hover:bg-black/[0.04]"
                  >
                    <span className="truncate text-sm text-[#1a1a1a]">{gearItem.model}</span>
                    <span className="text-sm font-semibold text-[#B45309]">
                      {formatOfferMoney(cheapest.price + cheapest.shipping, cheapest.currency)}
                    </span>
                  </Link>
                </li>
              );
            }
            const product = item.product;
            const best = bestOfferForCountry(product, countryCode);
            const displayName =
              displayTitleForCountry(product, countryCode, locale) ??
              `${teamNames[product.teamKey][locale]} ${typeNames[product.typeKey][locale]}`;
            return (
              <li key={item.id}>
                <Link
                  href={`/camiseta/${product.id}`}
                  onClick={onNavigate}
                  className="flex items-center justify-between gap-2 rounded-xl px-2 py-2 transition-colors hover:bg-black/[0.04]"
                >
                  <span className="truncate text-sm text-[#1a1a1a]">{displayName}</span>
                  {best ? (
                    <span className="text-sm font-semibold text-[#B45309]">
                      {formatOfferMoney(offerTotal(best), best.currency)}
                    </span>
                  ) : (
                    <span className="text-xs text-[#b3b3ad]">
                      {t.countryPanel.notAvailable}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      {savedItems.length > 0 && (
        <Link
          href="/favoritos"
          onClick={onNavigate}
          className="mt-2 flex items-center justify-center rounded-xl border-t border-[#C9A24B]/25 pt-3 text-sm font-medium text-[#1F6F4C] transition-colors hover:text-[#18573c]"
        >
          {t.favoritesPanel.viewAll}
        </Link>
      )}
    </>
  );
}
