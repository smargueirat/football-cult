"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "football-cult-compare";
const MAX_COMPARE = 3;

// Cada entrada es la oferta de UN vendedor puntual de UNA camiseta puntual
// (no "la camiseta en general") -- así se puede comparar entre distintos
// proveedores de la misma camiseta, no solo entre camisetas distintas.
export interface CompareEntry {
  productId: string;
  store: string;
}

function sameEntry(a: CompareEntry, b: CompareEntry) {
  return a.productId === b.productId && a.store === b.store;
}

function isCompareEntry(v: unknown): v is CompareEntry {
  return (
    !!v &&
    typeof v === "object" &&
    typeof (v as CompareEntry).productId === "string" &&
    typeof (v as CompareEntry).store === "string"
  );
}

interface CompareValue {
  compareList: CompareEntry[];
  toggleCompare: (productId: string, store: string) => void;
  isComparing: (productId: string, store: string) => boolean;
  clearCompare: () => void;
  maxReached: boolean;
}

const CompareContext = createContext<CompareValue | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<CompareEntry[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      // Formato viejo: array de ids de producto (string[]). Se descarta en
      // vez de migrarse -- no hay forma de saber qué vendedor quería decir
      // el usuario, y es una lista chica que se rearma fácil.
      if (Array.isArray(parsed) && parsed.every(isCompareEntry)) {
        setCompareList(parsed);
      }
    } catch {
      // ignore malformed storage
    }
  }, []);

  function persist(next: CompareEntry[]) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setCompareList(next);
  }

  function toggleCompare(productId: string, store: string) {
    const entry: CompareEntry = { productId, store };
    if (compareList.some((c) => sameEntry(c, entry))) {
      persist(compareList.filter((c) => !sameEntry(c, entry)));
      return;
    }
    if (compareList.length >= MAX_COMPARE) return;
    persist([...compareList, entry]);
  }

  function isComparing(productId: string, store: string) {
    return compareList.some((c) => c.productId === productId && c.store === store);
  }

  function clearCompare() {
    persist([]);
  }

  return (
    <CompareContext.Provider
      value={{
        compareList,
        toggleCompare,
        isComparing,
        clearCompare,
        maxReached: compareList.length >= MAX_COMPARE,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return ctx;
}
