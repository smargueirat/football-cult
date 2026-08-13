"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const MAX_TILT_DEG = 2.5;

// Quinto intento -- el anterior (rayos diagonales + inclinación con el
// mouse) resultó imperceptible: los rayos eran finitos y el ciclo
// (26-38s) demasiado largo como para notar el cambio mirando la
// página unos segundos, y la inclinación necesitaba mover el mouse a
// propósito. Esta vez el elemento vivo es grande y rápido de verdad --
// tres manchas de color (dorado y verde bosque, los colores de la
// marca) del tamaño de la pantalla, en movimiento continuo con un
// ciclo corto (14-20s) para que el cambio sea obvio en cualquier
// vistazo, sin necesitar que el usuario haga nada. La foto de la
// cancha sigue de fondo, ahora un poco más visible (opacity 0.2), y la
// inclinación con el mouse en desktop se mantiene como plus.
export default function StadiumWatermark() {
  const photoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canTilt =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canTilt || !photoRef.current) return;

    let ticking = false;
    let targetX = 0;
    let targetY = 0;

    function apply() {
      if (photoRef.current) {
        photoRef.current.style.transform = `scale(1.06) rotateX(${targetY}deg) rotateY(${targetX}deg)`;
      }
      ticking = false;
    }

    function onMouseMove(e: MouseEvent) {
      const px = e.clientX / window.innerWidth - 0.5;
      const py = e.clientY / window.innerHeight - 0.5;
      targetX = px * MAX_TILT_DEG;
      targetY = -py * MAX_TILT_DEG;
      if (!ticking) {
        window.requestAnimationFrame(apply);
        ticking = true;
      }
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ perspective: "1400px" }}
      aria-hidden="true"
    >
      <div
        ref={photoRef}
        className="absolute inset-0 will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        <Image
          src="/images/pitch-ground-level.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-[0.2]"
        />
      </div>

      {/* pátina cálida para que la foto se integre con la paleta marfil */}
      <div className="absolute inset-0 bg-[#EDE0C4] mix-blend-color opacity-45" />

      {/* manchas de color en movimiento -- el elemento vivo, grande y
          rápido a propósito para que se note sin tener que buscarlo */}
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />

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
