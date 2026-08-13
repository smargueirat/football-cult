"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const MAX_TILT_DEG = 2.5;

// Cuarto intento -- se pidió explícitamente algo nuevo de verdad, no
// otra variación del mismo resultado, pero conservando la cancha
// visible (no taparla con algo abstracto como los orbes anteriores).
// Dos ideas nuevas, ninguna probada antes en este fondo:
//
// 1) Inclinación 3D sutil que sigue el mouse -- el mismo mecanismo que
//    ya funcionó bien en las tarjetas de producto (ProductCard3D), acá
//    aplicado a la foto de fondo entera. Dif clave: es UNA sola foto
//    (nunca se duplica ni se desalinea, así que no puede "verse rota"
//    como el intento del scroll-parallax) y el ángulo es mínimo (2.5°
//    contra los 9° de las tarjetas -- a pantalla completa, más que eso
//    marea). Solo en desktop con mouse de verdad (pointer: fine): en
//    celular la foto queda fija, cero riesgo de mareo.
// 2) Rayos de luz diagonales tipo "luz de reflector atravesando el
//    techo del estadio", con mix-blend-mode: screen para que iluminen
//    la propia foto en vez de tapar nada -- lenguaje visual distinto a
//    los intentos anteriores (nunca hubo formas rectas/diagonales,
//    solo manchas redondas u ondas verticales).
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
          className="object-cover opacity-[0.18]"
        />
      </div>

      {/* pátina cálida para que la foto se integre con la paleta marfil */}
      <div className="absolute inset-0 bg-[#EDE0C4] mix-blend-color opacity-45" />

      {/* rayos de luz diagonales -- iluminan la foto en vez de taparla */}
      <div className="god-ray god-ray-1" />
      <div className="god-ray god-ray-2" />
      <div className="god-ray god-ray-3" />

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
