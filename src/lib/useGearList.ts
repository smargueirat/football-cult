"use client";

import { useEffect, useState } from "react";
import type { GearListProps, SlimGearItem } from "@/lib/gearList";

/**
 * Las fichas del HTML ya; el listado completo (811 KB gzip en ropa) recién
 * cuando la persona interactúa (toca, teclea o enfoca algo): quien entra,
 * mira las primeras y se va no lo baja nunca. Buscar, filtrar, ordenar o
 * "ver más" empiezan todos con un toque/tecla, así que llegan a tiempo.
 */
export function useGearList({ initial, url }: GearListProps): SlimGearItem[] {
  const [items, setItems] = useState(initial);
  useEffect(() => {
    let live = true;
    const events = ["pointerdown", "keydown", "focusin"] as const;
    const load = () => {
      events.forEach((e) => window.removeEventListener(e, load, true));
      fetch(url)
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then((all: SlimGearItem[]) => live && setItems(all))
        .catch(() => {}); // sin red queda lo del HTML: se ve, solo que incompleto
    };
    events.forEach((e) => window.addEventListener(e, load, { capture: true, passive: true }));
    return () => {
      live = false;
      events.forEach((e) => window.removeEventListener(e, load, true));
    };
  }, [url]);
  return items;
}
