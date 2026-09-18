"use client";

import { useMemo, useState } from "react";
import Link from "@/lib/i18n/LocaleLink";
import GearCard from "./GearCard";
import Chip from "./Chip";
import ScrollArrowRow from "./ScrollArrowRow";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Variante de GearListClient para ropa: misma UI (grilla + búsqueda +
// filtros de Marca/Talla/Color, reusando GearCard), más un filtro extra
// de Tipo (shorts/chaqueta/pantalón/medias) que gloves/balls no tienen.
// No se generalizó GearListClient para aceptar un `type` opcional
// porque las tallas también cambian de forma real: shorts/chaquetas/
// pantalones usan XS-4XL (letras), medias usan rangos numéricos
// ("39/42") -- el sort por talla de GearListClient asume números sueltos
// (parseFloat) y rompería con letras, así que hace falta su propio
// comparador acá en vez de forzar uno solo para los 3 tipos de producto.
const APPAREL_TYPES = ["shorts", "jacket", "pants", "socks"] as const;
type ApparelType = (typeof APPAREL_TYPES)[number];

const LETTER_SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "2XL", "3XL", "4XL", "5XL"];
function sizeSortKey(s: string): number {
  const i = LETTER_SIZE_ORDER.indexOf(s.toUpperCase());
  if (i !== -1) return i;
  const n = parseFloat(s);
  // Tallas numéricas (medias en rango "39/42", pantalón de mujer "38")
  // ordenan después de las de letra, por su propio valor -- separar los
  // dos mundos evita que un "40" se intercale entre "S" y "M" por una
  // comparación numérica que no tiene sentido para talla de letra.
  return Number.isNaN(n) ? 100 + LETTER_SIZE_ORDER.length : LETTER_SIZE_ORDER.length + n;
}

interface ApparelOffer {
  store: string;
  price: number;
  shipping: number;
  currency: "EUR";
  imageUrl: string;
  sizes: string[];
}
interface ApparelProductLike {
  id: string;
  brand: string;
  model: string;
  colour: string;
  type: ApparelType;
  offers: ApparelOffer[];
}

const PAGE_SIZE = 24;

export default function ApparelListClient({
  items,
  pageTitle,
  pageSubtitle,
}: {
  items: ApparelProductLike[];
  pageTitle: string;
  pageSubtitle: string;
}) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [typeFilter, setTypeFilter] = useState<ApparelType | "">("");
  const [brandFilter, setBrandFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [colourFilter, setColourFilter] = useState("");

  const typeLabel = (ty: ApparelType) => t.ropa.types[ty];

  const scopedByType = useMemo(
    () => (typeFilter ? items.filter((i) => i.type === typeFilter) : items),
    [items, typeFilter],
  );
  const brands = useMemo(
    () => [...new Set(scopedByType.map((i) => i.brand))].sort((a, b) => a.localeCompare(b)),
    [scopedByType],
  );
  const sizes = useMemo(
    () =>
      [...new Set(scopedByType.flatMap((i) => i.offers.flatMap((o) => o.sizes)))].sort(
        (a, b) => sizeSortKey(a) - sizeSortKey(b),
      ),
    [scopedByType],
  );
  const colours = useMemo(
    () =>
      [...new Set(scopedByType.map((i) => i.colour))]
        .filter((c) => c && c !== "N/D")
        .sort((a, b) => a.localeCompare(b)),
    [scopedByType],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = items.filter((i) => {
      if (q && !`${i.brand} ${i.model}`.toLowerCase().includes(q)) return false;
      if (typeFilter && i.type !== typeFilter) return false;
      if (brandFilter && i.brand !== brandFilter) return false;
      if (colourFilter && i.colour !== colourFilter) return false;
      if (sizeFilter && !i.offers.some((o) => o.sizes.includes(sizeFilter))) return false;
      return true;
    });
    return [...base].sort((a, b) => {
      const pa = Math.min(...a.offers.map((o) => o.price + o.shipping));
      const pb = Math.min(...b.offers.map((o) => o.price + o.shipping));
      return pa - pb;
    });
  }, [items, query, typeFilter, brandFilter, sizeFilter, colourFilter]);

  function resetPage() {
    setVisible(PAGE_SIZE);
  }

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
          resetPage();
        }}
        placeholder={t.nav.search}
        className="glass-panel mt-5 w-full max-w-sm rounded-xl border border-[#C9A24B]/30 px-4 py-2 text-sm text-[#1a1a1a] outline-none placeholder:text-[#675c44]/60"
      />

      <div className="mt-4 flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-[#675c44]">{t.ropa.typeLabel}:</span>
          <ScrollArrowRow className="-mx-4 gap-2 px-4 sm:-mx-8 sm:px-8">
            <Chip active={typeFilter === ""} onClick={() => { setTypeFilter(""); resetPage(); }} className="flex-shrink-0 whitespace-nowrap">
              {t.search.allCategories}
            </Chip>
            {APPAREL_TYPES.map((ty) => (
              <Chip key={ty} active={typeFilter === ty} onClick={() => { setTypeFilter(ty); setBrandFilter(""); setSizeFilter(""); setColourFilter(""); resetPage(); }} className="flex-shrink-0 whitespace-nowrap">
                {typeLabel(ty)}
              </Chip>
            ))}
          </ScrollArrowRow>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-[#675c44]">{t.search.brandLabel}:</span>
          <ScrollArrowRow className="-mx-4 gap-2 px-4 sm:-mx-8 sm:px-8">
            <Chip active={brandFilter === ""} onClick={() => { setBrandFilter(""); resetPage(); }} className="flex-shrink-0 whitespace-nowrap">
              {t.search.allCategories}
            </Chip>
            {brands.map((b) => (
              <Chip key={b} active={brandFilter === b} onClick={() => { setBrandFilter(b); resetPage(); }} className="flex-shrink-0 whitespace-nowrap">
                {b}
              </Chip>
            ))}
          </ScrollArrowRow>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-[#675c44]">{t.search.sizeLabel}:</span>
          <ScrollArrowRow className="-mx-4 gap-2 px-4 sm:-mx-8 sm:px-8">
            <Chip active={sizeFilter === ""} onClick={() => { setSizeFilter(""); resetPage(); }} className="flex-shrink-0 whitespace-nowrap">
              {t.search.allCategories}
            </Chip>
            {sizes.map((s) => (
              <Chip key={s} active={sizeFilter === s} onClick={() => { setSizeFilter(s); resetPage(); }} className="flex-shrink-0 whitespace-nowrap">
                {s}
              </Chip>
            ))}
          </ScrollArrowRow>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-[#675c44]">{t.search.colorLabel}:</span>
          <ScrollArrowRow className="-mx-4 gap-2 px-4 sm:-mx-8 sm:px-8">
            <Chip active={colourFilter === ""} onClick={() => { setColourFilter(""); resetPage(); }} className="flex-shrink-0 whitespace-nowrap">
              {t.search.allCategories}
            </Chip>
            {colours.map((c) => (
              <Chip key={c} active={colourFilter === c} onClick={() => { setColourFilter(c); resetPage(); }} className="flex-shrink-0 whitespace-nowrap">
                {c}
              </Chip>
            ))}
          </ScrollArrowRow>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.slice(0, visible).map((item, i) => (
          <GearCard key={item.id} item={item} basePath="ropa" priority={i < 4} />
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
