"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Product, findProduct } from "@/data/products";
import { getRecentlyViewed } from "@/lib/recentlyViewed";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import ProductCard from "@/components/ProductCard";

export default function VistosRecientementeClient() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const ids = getRecentlyViewed();
    setProducts(
      ids.map((id) => findProduct(id)).filter((p): p is Product => Boolean(p))
    );
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <h1 className="font-card-title mb-6 text-3xl text-[#1a1a1a] sm:text-4xl">
        {t.recentlyViewed.title}
      </h1>

      {products.length === 0 ? (
        <div className="glass-panel flex flex-col items-center gap-4 rounded-3xl border border-[#C9A24B]/25 p-10 text-center">
          <p className="text-[#8a7a5a]">{t.recentlyViewed.empty}</p>
          <Link
            href="/"
            className="rounded-full bg-[#1F6F4C] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#18573c]"
          >
            {t.favoritesPage.browse}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
