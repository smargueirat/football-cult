"use client";

import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

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
    const next = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];

    if (authenticated) {
      update({ favorites: next });
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setLocalFavorites(next);
    }
  }

  function isFavorite(id: string) {
    return favorites.includes(id);
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
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
