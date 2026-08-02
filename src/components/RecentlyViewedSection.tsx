"use client";

import { useEffect, useState } from "react";
import { Product, findProduct } from "@/data/products";
import { getRecentlyViewed } from "@/lib/recentlyViewed";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import ProductCard from "./ProductCard";

export default function RecentlyViewedSection() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const ids = getRecentlyViewed();
    setProducts(
      ids
        .map((id) => findProduct(id))
        .filter((p): p is Product => Boolean(p))
    );
  }, []);

  if (products.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-tagline text-sm not-italic text-[#5b5442]">
        {t.recentlyViewed.title}
      </h2>
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <div key={product.id} className="w-40 shrink-0 sm:w-48">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
