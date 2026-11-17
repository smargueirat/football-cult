"use client";

import { useEffect, useState } from "react";
import type { GearListProps, SlimGearItem } from "@/lib/gearList";

/** Las fichas del HTML ya, el listado completo en cuanto llega (ver gearListProps). */
export function useGearList({ initial, url }: GearListProps): SlimGearItem[] {
  const [items, setItems] = useState(initial);
  useEffect(() => {
    let live = true;
    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((all: SlimGearItem[]) => live && setItems(all))
      .catch(() => {}); // sin red queda lo del HTML: se ve, solo que incompleto
    return () => {
      live = false;
    };
  }, [url]);
  return items;
}
