"use client";

import { useLayoutEffect, useState, type RefObject } from "react";

// Los desplegables del header (favoritos, login, país) se montan via
// Portal directo en <body>, así que no pueden apoyarse en `absolute` +
// un padre `relative` -- necesitan coordenadas `fixed` calculadas a
// partir de la posición real del botón que los abre. Antes estaban
// hardcodeadas (ej. "right-6 top-16"), lo que los dejaba flotando lejos
// del ícono en pantallas anchas, porque esa distancia se medía desde el
// borde de la ventana, no desde el botón. Este hook mide el botón de
// verdad cada vez que se abre (y en resize/scroll mientras sigue
// abierto), así el panel siempre queda justo debajo del ícono.
export function useAnchoredDropdown(
  buttonRef: RefObject<HTMLElement | null>,
  open: boolean,
  gap = 8
) {
  const [position, setPosition] = useState<{ top: number; right: number } | null>(null);

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) {
      return;
    }
    function measure() {
      const rect = buttonRef.current!.getBoundingClientRect();
      setPosition({
        top: rect.bottom + gap,
        right: Math.max(window.innerWidth - rect.right, 12),
      });
    }
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open, buttonRef, gap]);

  return position;
}
