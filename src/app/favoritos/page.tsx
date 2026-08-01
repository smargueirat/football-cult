"use client";

import Link from "next/link";
import { findProduct } from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useFavorites } from "@/lib/favorites/FavoritesContext";
import ProductCard from "@/components/ProductCard";

export default function FavoritosPage() {
  const { t } = useLanguage();
  const { favorites } = useFavorites();

  const savedProducts = favorites
    .map((id) => findProduct(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <h1 className="font-card-title mb-6 text-3xl text-[#1a1a1a] sm:text-4xl">
        {t.favoritesPage.title}
      </h1>

      {savedProducts.length === 0 ? (
        <div className="glass-panel flex flex-col items-center gap-4 rounded-3xl border border-[#C9A24B]/25 p-10 text-center">
          <p className="text-[#8a7a5a]">{t.favoritesPage.empty}</p>
          <Link
            href="/"
            className="rounded-full bg-[#1F6F4C] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#18573c]"
          >
            {t.favoritesPage.browse}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {savedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
