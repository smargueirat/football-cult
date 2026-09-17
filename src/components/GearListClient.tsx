"use client";

import { useMemo, useState } from "react";
import Link from "@/lib/i18n/LocaleLink";
import GearCard from "./GearCard";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Listado simple (grilla + búsqueda de texto + orden por precio, sin los
// filtros de Marca/Talla/Color/Tier que tiene SearchExplorer para botas
// -- esos conceptos vienen del calzado y no aplican acá) para guantes y
// pelotas. No se integró en SearchExplorer.tsx a propósito en esta
// primera carga: es un componente grande y compartido con camisetas/
// botas, tocarlo para sumar 2 tipos de producto más es un cambio aparte
// que conviene revisar por separado en vez de arriesgar una regresión
// ahí solo para esto.
interface GearOffer {
  store: string;
  price: number;
  shipping: number;
  currency: "EUR";
  imageUrl: string;
  sizes: string[];
}
interface GearProductLike {
  id: string;
  brand: string;
  model: string;
  offers: GearOffer[];
}

const PAGE_SIZE = 24;

export default function GearListClient({
  items,
  basePath,
  pageTitle,
  pageSubtitle,
}: {
  items: GearProductLike[];
  basePath: "guantes" | "pelotas";
  pageTitle: string;
  pageSubtitle: string;
}) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? items.filter((i) => `${i.brand} ${i.model}`.toLowerCase().includes(q))
      : items;
    return [...base].sort((a, b) => {
      const pa = Math.min(...a.offers.map((o) => o.price + o.shipping));
      const pb = Math.min(...b.offers.map((o) => o.price + o.shipping));
      return pa - pb;
    });
  }, [items, query]);

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-8">
      <Link
        href="/"
        className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#675c44] transition-colors hover:text-[#1B3B2B]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t.detail.backToCatalog}
      </Link>
      <h1 className="font-vintage text-2xl text-[#1B3B2B] sm:text-3xl">{pageTitle}</h1>
      <p className="mt-1 text-sm text-[#675c44]">{pageSubtitle.replace("{n}", String(items.length))}</p>

      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setVisible(PAGE_SIZE);
        }}
        placeholder={t.nav.search}
        className="glass-panel mt-5 w-full max-w-sm rounded-xl border border-[#C9A24B]/30 px-4 py-2 text-sm text-[#1a1a1a] outline-none placeholder:text-[#675c44]/60"
      />

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.slice(0, visible).map((item, i) => (
          <GearCard key={item.id} item={item} basePath={basePath} priority={i < 4} />
        ))}
      </div>

      {visible < filtered.length && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="vintage-plaque rounded-xl px-5 py-2.5 text-sm font-semibold"
          >
            {t.search.loadMore}
          </button>
        </div>
      )}
    </div>
  );
}
