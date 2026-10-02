"use client";

import { useEffect, useState } from "react";

// Barra fija inferior del celular: UN toque lleva a la mejor tienda. Muestra
// la tienda y el total, así que el botón dice adónde va y cuánto cuesta.
//
// Sin saltos de layout: la barra es position:fixed (no ocupa lugar en el
// flujo) y se renderiza ya en el HTML del servidor; el padding que le
// reserva espacio al contenido lo pone la página con una clase estática
// (pb-28), no se mide ni se calcula en el cliente.
//
// No tapa contenido: la página reserva ese padding, y cuando el footer
// entra en pantalla la barra se desliza hacia abajo (solo transform, que
// no dispara layout) para no quedar encima de los links legales.
export default function StickyBestOfferBar({
  store,
  total,
  fromLabel,
  goLabel,
  href,
  onClick,
  hideFrom,
}: {
  store: string;
  total: string;
  fromLabel: string;
  /** Texto ya armado del botón, p. ej. "Ir a FootStoreES". */
  goLabel: string;
  href: string;
  onClick: () => void;
  /** Breakpoint desde el que la barra se oculta (la ficha ya muestra la oferta a la vista). */
  hideFrom: "sm" | "lg";
}) {
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setFooterVisible(e.isIntersecting), { threshold: 0 });
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`shadow-vintage-lg fixed inset-x-0 bottom-0 z-40 border-t border-[#C9A24B]/30 bg-[#fffdf8]/95 backdrop-blur-md transition-transform duration-200 motion-reduce:transition-none ${
        hideFrom === "sm" ? "sm:hidden" : "lg:hidden"
      } ${footerVisible ? "translate-y-full" : "translate-y-0"}`}
      data-testid="best-offer-bar"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wide text-[#a8926a]">{fromLabel}</p>
          <p className="truncate text-lg font-semibold leading-tight text-[#B45309]">{total}</p>
          <p className="truncate text-[11px] leading-tight text-[#675c44]">{store}</p>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          onClick={onClick}
          className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-[#1B3B2B] px-5 py-2.5 text-sm font-medium text-[#F3E9C9]"
        >
          {goLabel}
          <span aria-hidden>→</span>
        </a>
      </div>
    </div>
  );
}
