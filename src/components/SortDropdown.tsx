"use client";

import { useEffect, useRef, useState } from "react";
import Portal from "./Portal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Dropdown de orden, extraído literal del de SearchExplorer (mismo botón
// + panel posicionado con Portal, no z-index relativo -- ver el
// comentario largo original sobre por qué Portal hacía falta: un
// stacking context propio en las tarjetas le ganaba al panel pese al
// z-index más alto). Mismo motivo que FilterSheet.tsx: pedido explícito
// del usuario de reusar este formato en guantes/pelotas/ropa/tickets.
export default function SortDropdown<K extends string>({
  value,
  onChange,
  options,
}: {
  value: K;
  onChange: (key: K) => void;
  options: { key: K; label: string }[];
}) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (!open || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        panelRef.current &&
        !panelRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#C9A24B]/30 bg-[#FFFDF8] py-3 text-sm font-medium text-[#1a1a1a] transition-colors hover:border-[#1B3B2B]/40"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h10M3 12h6M3 17h3M17 4v16m0 0l-3.5-3.5M17 20l3.5-3.5" />
        </svg>
        {t.search.sortLabel}
      </button>
      {open && (
        <Portal>
          <div
            ref={panelRef}
            className="fixed z-50 flex w-64 flex-col gap-1 rounded-2xl border border-[#C9A24B]/30 bg-[#FFFDF8] p-2 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.25)]"
            style={{ top: pos.top, right: pos.right }}
          >
            {options.map((opt) => (
              <button
                key={opt.key}
                onClick={() => {
                  onChange(opt.key);
                  setOpen(false);
                }}
                className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm transition-colors ${
                  value === opt.key ? "bg-[#1B3B2B] text-[#F3E9C9]" : "text-[#3a3a36] hover:bg-black/[0.04]"
                }`}
              >
                {opt.label}
                {value === opt.key && (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </Portal>
      )}
    </>
  );
}
