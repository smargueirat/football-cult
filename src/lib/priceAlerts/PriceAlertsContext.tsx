"use client";

import { createContext, ReactNode, useContext } from "react";
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
  const { data: session, status, update } = useSession();
  const authenticated = status === "authenticated";
  const priceAlerts = session?.priceAlerts ?? [];

  function toggleAlert(id: string) {
    if (!authenticated) return;
    const next = priceAlerts.includes(id)
      ? priceAlerts.filter((a) => a !== id)
      : [...priceAlerts, id];
    update({ priceAlerts: next });
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
