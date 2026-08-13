"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

// "A través del estadio": profundidad real ligada al scroll en vez de
// una animación ambiental que se mueve sola. Dos capas de la misma foto
// (tribuna lejana desenfocada casi fija, cancha nítida) se acercan
// suavemente a medida que se baja en la página -- como caminar hacia
// la cancha, no como deslizar una foto. Sutil a propósito (feedback:
// "no tanto"): nada de paneles oscuros ni desplazamientos grandes.
// prefers-reduced-motion la deja completamente estática (nunca se
// engancha el listener de scroll).
export default function StadiumWatermark() {
  const farRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    function apply() {
      const y = window.scrollY;
      const zoom = 1 + Math.min(y, 1400) / 14000;
      if (farRef.current) {
        farRef.current.style.transform = `scale(${1.06 + Math.min(y, 1400) / 20000})`;
      }
      if (midRef.current) {
        midRef.current.style.transform = `translateY(${y * 0.03}px) scale(${zoom})`;
      }
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(apply);
        ticking = true;
      }
    }
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* tribuna lejana: la misma foto, desenfocada y casi fija */}
      <div ref={farRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/pitch-ground-level.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-[0.14] blur-[2px]"
        />
      </div>

      {/* cancha: nítida, la que se va acercando al bajar en la página */}
      <div ref={midRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/pitch-ground-level.jpg"
          alt=""
          fill
          className="object-cover opacity-[0.16]"
        />
      </div>

      {/* pátina cálida para que la foto se integre con la paleta marfil */}
      <div className="absolute inset-0 bg-[#EDE0C4] mix-blend-color opacity-45" />

      {/* viñeta radial, profundidad de estadio nocturno */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, transparent 35%, rgba(6,20,14,0.16) 80%, rgba(4,14,10,0.3) 100%)",
        }}
      />
    </div>
  );
}
