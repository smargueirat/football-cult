"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

// "A través del estadio": la versión anterior (foto respirando +
// reflectores + polvo, todo animándose solo, sin relación con lo que el
// usuario hace) no convenció. Esta reemplaza esa animación ambiental
// por profundidad real ligada al scroll -- tres capas (tribuna lejana,
// cancha, boca de túnel) se desplazan a velocidades distintas a medida
// que se recorre la página, dando la sensación de caminar hacia la
// cancha en vez de mirar una foto fija con efectos encima.
// prefers-reduced-motion la deja completamente estática (nunca se
// engancha el listener de scroll).
export default function StadiumWatermark() {
  const farRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    function apply() {
      const y = window.scrollY;
      const zoom = 1 + Math.min(y, 900) / 6000;
      if (farRef.current) {
        farRef.current.style.transform = `translateY(${y * 0.05}px) scale(1.1)`;
      }
      if (midRef.current) {
        midRef.current.style.transform = `translateY(${y * 0.14}px) scale(${zoom})`;
      }
      if (nearRef.current) {
        nearRef.current.style.transform = `translateY(${y * 0.26}px)`;
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
      {/* tribuna lejana: la misma foto, desenfocada y casi quieta */}
      <div ref={farRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/pitch-ground-level.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-[0.14] blur-[2px]"
        />
      </div>

      {/* cancha: nítida, se mueve un poco más rápido -- capa intermedia */}
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

      {/* boca del túnel: capa más cercana, la que más se mueve */}
      <div ref={nearRef} className="absolute inset-0 will-change-transform">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice"
        >
          <g opacity="0.12" fill="#08130D">
            <path d="M 0 0 L 260 0 L 90 420 L 0 420 Z" />
            <path d="M 1000 0 L 740 0 L 910 420 L 1000 420 Z" />
          </g>
        </svg>
      </div>

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
