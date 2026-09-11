"use client";

import Link from "@/lib/i18n/LocaleLink";
import { findProduct } from "@/data/products";
import { bootProducts } from "@/data/boots";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useFavorites } from "@/lib/favorites/FavoritesContext";
import ProductCard from "@/components/ProductCard";
import BootCard from "@/components/BootCard";

// Un id favorito puede ser de una camiseta o de una bota -- mismo
// comportamiento pedido explícitamente por el usuario. Se resuelve
// contra el catálogo que corresponda y se renderiza con la card real de
// esa sección (ProductCard para camisetas, BootCard para botas).
export default function FavoritosClient() {
  const { t } = useLanguage();
  const { favorites } = useFavorites();

  const savedItems = favorites
    .map((id) => {
      const product = findProduct(id);
      if (product) return { kind: "jersey" as const, id, product };
      const boot = bootProducts.find((b) => b.id === id);
      if (boot) return { kind: "boot" as const, id, boot };
      return null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <h1 className={`font-card-title text-3xl text-[#1a1a1a] sm:text-4xl ${savedItems.length > 0 ? "" : "mb-6"}`}>
        {t.favoritesPage.title}
      </h1>
      {savedItems.length > 0 && (
        <p className="mb-6 mt-1 text-sm text-[#675c44]">{t.favoritesPage.priceAlertNote}</p>
      )}

      {savedItems.length === 0 ? (
        <div className="glass-panel flex flex-col items-center gap-4 rounded-3xl border border-[#C9A24B]/25 p-10 text-center">
          <p className="text-[#675c44]">{t.favoritesPage.empty}</p>
          <Link
            href="/"
            className="rounded-full bg-[#1F6F4C] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#18573c]"
          >
            {t.favoritesPage.browse}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {savedItems.map((item) =>
            item.kind === "boot" ? (
              <BootCard key={item.id} boot={item.boot} />
            ) : (
              <ProductCard key={item.id} product={item.product} />
            )
          )}
        </div>
      )}
    </div>
  );
}
