"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "football-cult-compare";
const MAX_COMPARE = 3;

interface CompareValue {
  compareList: string[];
  toggleCompare: (id: string) => void;
  isComparing: (id: string) => boolean;
  clearCompare: () => void;
  maxReached: boolean;
}

const CompareContext = createContext<CompareValue | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<string[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) setCompareList(parsed);
    } catch {
      // ignore malformed storage
    }
  }, []);

  function persist(next: string[]) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setCompareList(next);
  }

  function toggleCompare(id: string) {
    if (compareList.includes(id)) {
      persist(compareList.filter((c) => c !== id));
      return;
    }
    if (compareList.length >= MAX_COMPARE) return;
    persist([...compareList, id]);
  }

  function isComparing(id: string) {
    return compareList.includes(id);
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
