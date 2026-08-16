import { PriceRange } from "@/lib/search/SearchFilterContext";

// Dos <input type="range"> superpuestos (ver .range-slider-input en
// globals.css) -- el truco sin librería para lograr dos manijas
// independientes. Llevar la manija de arriba hasta el tope (max) se
// interpreta como "sin límite superior", no como "hasta exactamente
// este número" (ver comentario en SearchFilterContext.tsx).
export default function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
  formatLabel,
}: {
  min: number;
  max: number;
  value: PriceRange;
  onChange: (v: PriceRange) => void;
  formatLabel: (v: number, isMax: boolean) => string;
}) {
  const [lo, hi] = value;
  const loPct = ((lo - min) / (max - min)) * 100;
  const hiPct = ((hi - min) / (max - min)) * 100;
  // Si el usuario empuja la manija de mínimo cerca del tope, le damos
  // prioridad de z-index para que no quede atrapada debajo de la manija
  // de máximo (que si no, siempre gana por estar después en el DOM).
  const minOnTop = lo > min + (max - min) * 0.8;

  return (
    <div className="flex flex-col gap-3 px-1 py-2">
      <div className="relative h-6">
        <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#C9A24B]/25" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#1B3B2B]"
          style={{ left: `${loPct}%`, right: `${100 - hiPct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={lo}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi - 1), hi])}
          className="range-slider-input absolute inset-0 h-6 w-full"
          style={{ zIndex: minOnTop ? 5 : 3 }}
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={hi}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo + 1)])}
          className="range-slider-input absolute inset-0 h-6 w-full"
          style={{ zIndex: minOnTop ? 3 : 4 }}
          aria-label="Maximum price"
        />
      </div>
      <div className="flex items-center justify-between text-sm font-medium text-[#1a1a1a]">
        <span>{formatLabel(lo, false)}</span>
        <span>{formatLabel(hi, hi === max)}</span>
      </div>
    </div>
  );
}
