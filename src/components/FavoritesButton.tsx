"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useFavorites } from "@/lib/favorites/FavoritesContext";
import Portal from "./Portal";
import { useAnchoredDropdown } from "@/lib/useAnchoredDropdown";

// FavoritesButton se manda en TODAS las páginas (Header.tsx, que vive
// en el layout de [locale]), incluidas páginas estáticas como
// "términos" que no muestran ningún producto. El botón/badge solo
// necesita la CANTIDAD de favoritos (favorites.length, ids planos, sin
// tocar products.ts); el contenido real del panel (nombres, precios --
// necesita findProduct/teamNames/etc. del catálogo de 5.9MB) vive en
// FavoritesPanelContent y sólo se pide cuando el usuario abre el
// panel. Mismo patrón que CompareBar/CompareBarContent.
const FavoritesPanelContent = dynamic(() => import("./FavoritesPanelContent"), { ssr: false });

export default function FavoritesButton() {
  const { t } = useLanguage();
  const { favorites } = useFavorites();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const position = useAnchoredDropdown(buttonRef, open);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen((o) => !o)}
        aria-label={t.nav.favorites}
        className="relative flex h-8 w-8 items-center justify-center rounded-full text-[#1a1a1a] transition-colors before:absolute before:-inset-1.5 before:content-[''] hover:bg-[#C9A24B]/10 sm:h-9 sm:w-9"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21l-7.682-8.318a4.5 4.5 0 010-6.364z"
          />
        </svg>
        {favorites.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#D97706] text-[9px] font-semibold text-white">
            {favorites.length}
          </span>
        )}
      </button>

      {open && (
        <Portal>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            style={{ top: position?.top ?? 56, right: position?.right ?? 12 }}
            className="solid-panel fixed z-50 w-72 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-[#C9A24B]/25 p-4 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.25)]"
          >
            <p className="mb-2 text-sm font-medium text-[#1a1a1a]">
              {t.favoritesPanel.title}
            </p>
            <FavoritesPanelContent onNavigate={() => setOpen(false)} />
          </div>
        </Portal>
      )}
    </div>
  );
}
