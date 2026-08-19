"use client";

import { useEffect, useRef, useState } from "react";

// Fila horizontal con scroll (chips de filtro, típicamente). En trackpad
// se puede desplazar con dos dedos, pero con mouse común no hay forma
// obvia de hacerlo -- estas flechitas dan una manera visible de avanzar
// sin depender del tipo de dispositivo de entrada.
export default function ScrollArrowRow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateArrows() {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children]);

  function scrollBy(amount: number) {
    scrollerRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollBy(-140)}
          aria-label="scroll left"
          className="shadow-vintage-sm absolute -left-1 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-[#C9A24B]/40 bg-[#FFFDF8] text-[#5b5442] hover:text-[#1a1a1a]"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      <div
        ref={scrollerRef}
        onScroll={updateArrows}
        className={`flex overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
      >
        {children}
      </div>
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollBy(140)}
          aria-label="scroll right"
          className="shadow-vintage-sm absolute -right-1 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-[#C9A24B]/40 bg-[#FFFDF8] text-[#5b5442] hover:text-[#1a1a1a]"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
