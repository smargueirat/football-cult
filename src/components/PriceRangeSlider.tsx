import { useState } from "react";
import { PriceRange } from "@/lib/search/SearchFilterContext";

// Dos <input type="range"> superpuestos (ver .range-slider-input en
// globals.css) -- el truco sin librería para lograr dos manijas
// independientes. Llevar la manija de arriba hasta el tope (max) se
// interpreta como "sin límite superior", no como "hasta exactamente
// este número" (ver comentario en SearchFilterContext.tsx).
//
// Pedido explícito del usuario: el slider solo (0-300 en un espacio
// chico) es muy sensible para elegir un número exacto -- agregado un
// <input type="number"> al lado de cada manija para poder escribir el
// precio a mano. Los dos inputs numéricos y los dos sliders comparten
// el mismo `value`/`onChange` de arriba, así que quedan siempre en
// sincro sin importar cuál se use.
export default function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: PriceRange;
  onChange: (v: PriceRange) => void;
}) {
  const [lo, hi] = value;
  const loPct = ((lo - min) / (max - min)) * 100;
  const hiPct = ((hi - min) / (max - min)) * 100;
  // Si el usuario empuja la manija de mínimo cerca del tope, le damos
  // prioridad de z-index para que no quede atrapada debajo de la manija
  // de máximo (que si no, siempre gana por estar después en el DOM).
  const minOnTop = lo > min + (max - min) * 0.8;

  // Texto libre mientras se escribe (para poder borrar y tipear un
  // número nuevo sin que cada tecla ya intente clampear/redondear) --
  // se confirma (clampea contra min/max y el otro extremo) recién al
  // salir del campo o con Enter.
  const [loText, setLoText] = useState<string | null>(null);
  const [hiText, setHiText] = useState<string | null>(null);

  function commitLo(text: string) {
    setLoText(null);
    const n = Number(text);
    if (!Number.isFinite(n)) return;
    onChange([Math.min(Math.max(n, min), hi - 1), hi]);
  }
  function commitHi(text: string) {
    setHiText(null);
    const n = Number(text);
    if (!Number.isFinite(n)) return;
    onChange([lo, Math.max(Math.min(n, max), lo + 1)]);
  }

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
      <div className="flex items-center justify-between gap-2 text-sm font-medium text-[#1a1a1a]">
        <label className="flex items-center gap-1 rounded-lg border border-[#C9A24B]/30 bg-[#FFFDF8] px-2 py-1">
          <span className="text-[#8a836e]">€</span>
          <input
            type="number"
            inputMode="numeric"
            min={min}
            max={hi - 1}
            value={loText ?? lo}
            onChange={(e) => setLoText(e.target.value)}
            onBlur={(e) => commitLo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && commitLo(e.currentTarget.value)}
            className="w-14 bg-transparent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:opacity-60 [&::-webkit-outer-spin-button]:opacity-60"
            aria-label="Minimum price, exact value"
          />
        </label>
        <span className="text-[#8a836e]">–</span>
        <label className="flex items-center gap-1 rounded-lg border border-[#C9A24B]/30 bg-[#FFFDF8] px-2 py-1">
          <span className="text-[#8a836e]">€</span>
          <input
            type="number"
            inputMode="numeric"
            min={lo + 1}
            max={max}
            value={hiText ?? hi}
            onChange={(e) => setHiText(e.target.value)}
            onBlur={(e) => commitHi(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && commitHi(e.currentTarget.value)}
            className="w-14 bg-transparent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:opacity-60 [&::-webkit-outer-spin-button]:opacity-60"
            aria-label="Maximum price, exact value"
          />
          {hi === max && <span className="text-[#8a836e]">+</span>}
        </label>
      </div>
    </div>
  );
}
