"use client";

import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import FavoritesSignInModal from "@/components/FavoritesSignInModal";
import { resolveProductId } from "@/data/productAliases";

const STORAGE_KEY = "football-cult-favorites";

interface FavoritesValue {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesValue | undefined>(undefined);

function readLocalFavorites(): string[] {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { data: session, status, update } = useSession();
  const [localFavorites, setLocalFavorites] = useState<string[]>([]);
  const [showSignIn, setShowSignIn] = useState(false);
  const mergedOnLogin = useRef(false);

  useEffect(() => {
    setLocalFavorites(readLocalFavorites());
  }, []);

  // Al loguearse, fusiona una única vez los favoritos guardados como
  // invitado (localStorage) con los que ya tenga la cuenta.
  useEffect(() => {
    if (status !== "authenticated" || mergedOnLogin.current) return;
    mergedOnLogin.current = true;
    const local = readLocalFavorites();
    if (local.length === 0) return;
    const existing = session?.favorites ?? [];
    const merged = Array.from(new Set([...existing, ...local]));
    if (merged.length !== existing.length) {
      update({ favorites: merged });
    }
    window.localStorage.removeItem(STORAGE_KEY);
  }, [status, session?.favorites, update]);

  const authenticated = status === "authenticated";
  const favorites = authenticated ? session?.favorites ?? [] : localFavorites;

  function toggleFavorite(id: string) {
    // Hay que estar logueado para usar favoritos -- así podemos guardarlos
    // ligados a la cuenta (no solo a este navegador) y, más adelante, usar
    // ese registro para avisar por mail. Si todavía no inició sesión, se
    // le pide en vez de guardar solo en este dispositivo.
    if (status !== "authenticated") {
      setShowSignIn(true);
      return;
    }

    const currentlyFavorited = isFavorite(id);
    // On removal, also drop any stored alias id that resolves to this one
    // (e.g. an old pre-rename id), so toggling off actually clears it
    // instead of leaving a stale entry that only isFavorite() papers over.
    const next = currentlyFavorited
      ? favorites.filter((f) => f !== id && resolveProductId(f) !== id)
      : [...favorites, id];
    update({ favorites: next });

    // Favoritos duplica el registro en Redis (además del JWT de arriba)
    // solo para esto: es lo que permite que /api/cron/check-prices sepa a
    // quién avisarle por mail cuando una de sus camisetas favoritas baja
    // de precio, sin depender de que esa persona tenga sesión activa en
    // ese momento. No bloquea el toggle si falla -- el favorito en sí ya
    // se guardó, esto es best-effort.
    fetch("/api/price-alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id, subscribe: !currentlyFavorited }),
    }).catch(() => {});
  }

  function isFavorite(id: string) {
    // A saved favorite might still hold an old id that later got renamed/
    // merged into this one -- resolve each stored id through the alias
    // map so the heart shows filled on the product's current page too,
    // not just in the favorites list (which resolves via findProduct).
    return favorites.some((f) => f === id || resolveProductId(f) === id);
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
      {showSignIn && <FavoritesSignInModal onClose={() => setShowSignIn(false)} />}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return ctx;
}
