"use client";

import { useEffect } from "react";
import Portal from "./Portal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Bottom sheet de filtros, extraído literal del panel de SearchExplorer
// (mismo backdrop + hoja + header con título/limpiar/cerrar) -- pedido
// explícito del usuario: "los filtros tienen que tener este formato
// siempre, como hiciste con los botines". Guantes/pelotas/ropa/tickets
// no comparten el resto de SearchExplorer (equipo/categoría/temporada,
// todo específico de camisetas) así que no tiene sentido forzarlos dentro
// de ese componente gigante -- pero SÍ deben verse y comportarse
// exactamente igual por afuera, de ahí este envoltorio compartido.
export default function FilterSheet({
  open,
  onClose,
  activeCount,
  onClear,
  children,
}: {
  open: boolean;
  onClose: () => void;
  activeCount: number;
  onClear: () => void;
  children: React.ReactNode;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!open) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-3xl bg-[#FFFDF8] shadow-[0_-16px_40px_-12px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between border-b border-[#C9A24B]/20 px-5 py-4">
          <p className="font-card-title text-lg text-[#1a1a1a]">{t.search.filtersButton}</p>
          <div className="flex items-center gap-3">
            {activeCount > 0 && (
              <button
                onClick={onClear}
                className="text-xs font-medium text-[#675c44] transition-colors hover:text-[#1a1a1a]"
              >
                {t.search.clearFilters}
              </button>
            )}
            <button
              onClick={onClose}
              aria-label={t.search.clearAria}
              className="flex h-11 w-11 items-center justify-center rounded-full text-[#675c44] hover:bg-black/[0.05] hover:text-[#1a1a1a]"
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-5 overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </Portal>
  );
}
