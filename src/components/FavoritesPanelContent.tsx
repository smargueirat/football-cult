"use client";

import Link from "@/lib/i18n/LocaleLink";
import {
  bestOfferForCountry,
  displayTitleForCountry,
  findProduct,
  formatOfferMoney,
  offerTotal,
  teamNames,
  typeNames,
} from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useFavorites } from "@/lib/favorites/FavoritesContext";
import { useCountry } from "@/lib/country/CountryContext";

// Separado de FavoritesButton.tsx a propósito -- ver el comentario
// largo ahí. Este archivo (y sólo este) importa products.ts, así que
// sólo se carga cuando el usuario realmente abre el panel de
// favoritos, no en cada página del sitio.
export default function FavoritesPanelContent({ onNavigate }: { onNavigate: () => void }) {
  const { locale, t } = useLanguage();
  const { countryCode } = useCountry();
  const { favorites } = useFavorites();

  const savedProducts = favorites
    .map((id) => findProduct(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      {savedProducts.length === 0 ? (
        <p className="text-xs text-[#675c44]">{t.favoritesPanel.empty}</p>
      ) : (
        <ul className="flex max-h-72 flex-col gap-1 overflow-y-auto">
          {savedProducts.map((product) => {
            const best = bestOfferForCountry(product, countryCode);
            const displayName =
              displayTitleForCountry(product, countryCode, locale) ??
              `${teamNames[product.teamKey][locale]} ${typeNames[product.typeKey][locale]}`;
            return (
              <li key={product.id}>
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
      {savedProducts.length > 0 && (
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
