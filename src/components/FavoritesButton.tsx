"use client";

import Link from "next/link";
import { useState } from "react";
import {
  bestOfferForCountry,
  findProduct,
  formatMoney,
  offerTotal,
  teamNames,
  typeNames,
} from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useFavorites } from "@/lib/favorites/FavoritesContext";
import { useCountry } from "@/lib/country/CountryContext";

export default function FavoritesButton() {
  const { locale, t } = useLanguage();
  const { country, countryCode } = useCountry();
  const { favorites } = useFavorites();
  const [open, setOpen] = useState(false);

  const savedProducts = favorites
    .map((id) => findProduct(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t.nav.favorites}
        className="relative flex h-8 w-8 items-center justify-center rounded-full sm:h-9 sm:w-9 text-[#1a1a1a] transition-colors hover:bg-black/[0.05]"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21l-7.682-8.318a4.5 4.5 0 010-6.364z"
          />
        </svg>
        {savedProducts.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#D97706] text-[9px] font-semibold text-white">
            {savedProducts.length}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="solid-panel absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-black/[0.06] p-4 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.25)]">
            <p className="mb-2 text-sm font-medium text-[#1a1a1a]">
              {t.favoritesPanel.title}
            </p>
            {savedProducts.length === 0 ? (
              <p className="text-xs text-[#8a8a84]">{t.favoritesPanel.empty}</p>
            ) : (
              <ul className="flex max-h-72 flex-col gap-1 overflow-y-auto">
                {savedProducts.map((product) => {
                  const best = bestOfferForCountry(product, countryCode);
                  return (
                    <li key={product.id}>
                      <Link
                        href={`/camiseta/${product.id}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between gap-2 rounded-xl px-2 py-2 transition-colors hover:bg-black/[0.04]"
                      >
                        <span className="text-sm text-[#1a1a1a]">
                          {teamNames[product.teamKey][locale]}{" "}
                          {typeNames[product.typeKey][locale]}
                        </span>
                        {best ? (
                          <span className="text-sm font-semibold text-[#B45309]">
                            {formatMoney(offerTotal(best), country)}
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
          </div>
        </>
      )}
    </div>
  );
}
