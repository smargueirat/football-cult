import type { OfferPriceStats } from "@/lib/priceArchive";

/** Prueba social que se puede comprobar: tiendas comparadas y, solo si el
 *  precio de hoy ES el mínimo de nuestro archivo (14+ días, con cambios),
 *  "Precio más bajo en N días". */
export function proofLine(stores: string, stats: OfferPriceStats | null | undefined, price: number, lowestTpl: string): string {
  const low = stats && stats.distinct > 1 && stats.current === stats.min && price === stats.current;
  return [stores, low ? lowestTpl.replace("{days}", String(stats.coverageDays)) : ""].filter(Boolean).join(" · ");
}

// CTA principal de la ficha en pantallas donde no está la barra fija:
// total (con envío cuando está medido), tienda, prueba social y botón.
// Sin estado ni efectos: sirve en server y client components.
export default function BestOfferBox({
  label,
  total,
  approx,
  store,
  proof,
  goLabel,
  href,
  onClick,
  className = "",
}: {
  label: string;
  total: string;
  approx?: string | null;
  store: string;
  /** "Comparando 5 tiendas · Precio más bajo en 30 días" (solo lo que es verdad). */
  proof?: string;
  goLabel: string;
  href: string;
  onClick?: () => void;
  /** Visibilidad por breakpoint, p. ej. "hidden lg:flex". */
  className?: string;
}) {
  return (
    <div
      data-testid="best-offer-box"
      className={`items-center justify-between gap-4 rounded-2xl border border-[#B8923F]/60 bg-white/70 p-4 ring-1 ring-[#C9A24B]/30 ${className}`}
    >
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-[#675c44]">{label}</p>
        <p className="text-2xl font-semibold leading-tight text-[#B45309]">
          {total}
          {approx && <span className="ml-2 text-sm font-normal text-[#675c44]">{approx}</span>}
        </p>
        <p className="truncate text-sm text-[#675c44]">{store}</p>
        {proof && <p className="mt-0.5 text-xs font-medium text-[#1B3B2B]">{proof}</p>}
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow sponsored"
        onClick={onClick}
        className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-[#1B3B2B] px-5 py-2.5 text-sm font-medium text-[#F3E9C9] transition-colors hover:bg-[#15301f]"
      >
        {goLabel}
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}
