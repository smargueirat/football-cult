"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface PriceAlertsValue {
  priceAlerts: string[];
  toggleAlert: (id: string) => void;
  hasAlert: (id: string) => boolean;
  // Las alertas necesitan saber a quién avisar, por eso requieren cuenta
  // (a diferencia de favoritos, que también funcionan como invitado).
  needsLogin: boolean;
}

const PriceAlertsContext = createContext<PriceAlertsValue | undefined>(undefined);

export function PriceAlertsProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const authenticated = status === "authenticated";
  const [priceAlerts, setPriceAlerts] = useState<string[]>([]);

  useEffect(() => {
    if (!authenticated) {
      setPriceAlerts([]);
      return;
    }
    fetch("/api/price-alerts")
      .then((res) => res.json())
      .then((data) => setPriceAlerts(data.productIds ?? []))
      .catch(() => setPriceAlerts([]));
  }, [authenticated]);

  async function toggleAlert(id: string) {
    if (!authenticated) return;
    // Optimista: cambiamos ya la UI, y confirmamos con la respuesta real.
    const wasActive = priceAlerts.includes(id);
    setPriceAlerts((prev) => (wasActive ? prev.filter((p) => p !== id) : [...prev, id]));

    try {
      const res = await fetch("/api/price-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id }),
      });
      const data = await res.json();
      setPriceAlerts((prev) => {
        const withoutId = prev.filter((p) => p !== id);
        return data.active ? [...withoutId, id] : withoutId;
      });
    } catch {
      // si falla la llamada, revertimos el cambio optimista
      setPriceAlerts((prev) =>
        wasActive ? [...prev, id] : prev.filter((p) => p !== id)
      );
    }
  }

  function hasAlert(id: string) {
    return priceAlerts.includes(id);
  }

  return (
    <PriceAlertsContext.Provider
      value={{ priceAlerts, toggleAlert, hasAlert, needsLogin: !authenticated }}
    >
      {children}
    </PriceAlertsContext.Provider>
  );
}

export function usePriceAlerts() {
  const ctx = useContext(PriceAlertsContext);
  if (!ctx) {
    throw new Error("usePriceAlerts must be used within a PriceAlertsProvider");
  }
  return ctx;
}
