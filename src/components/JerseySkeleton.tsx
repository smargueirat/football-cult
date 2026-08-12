"use client";

import { useId } from "react";

// Mismo contorno que JerseyIcon.tsx (JERSEY_PATH) -- así el estado de
// carga ya sugiere la forma de una camiseta en vez de un rectángulo
// genérico. El brillo se anima con SMIL nativo (animateTransform sobre
// el gradiente), no CSS -- evita tener que mapear el path 0-100 del
// viewBox a coordenadas de píxeles reales para un clip-path en CSS.
const JERSEY_PATH =
  "M35,8 L20,20 L8,34 L20,46 L26,40 L26,90 L74,90 L74,40 L80,46 L92,34 L80,20 L65,8 C65,8 58,15 50,15 C42,15 35,8 35,8 Z";

export default function JerseySkeleton({ className = "h-full w-full" }: { className?: string }) {
  const clipId = useId();
  const gradId = useId();

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <clipPath id={clipId}>
          <path d={JERSEY_PATH} />
        </clipPath>
        <linearGradient id={gradId} x1="-40%" y1="0" x2="140%" y2="0">
          <stop offset="0%" stopColor="rgba(180,146,63,0.10)" />
          <stop offset="50%" stopColor="rgba(180,146,63,0.28)" />
          <stop offset="100%" stopColor="rgba(180,146,63,0.10)" />
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            from="-1 0"
            to="1 0"
            dur="1.4s"
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect x="0" y="0" width="100" height="100" fill="rgba(180,146,63,0.08)" />
        <rect x="0" y="0" width="100" height="100" fill={`url(#${gradId})`} />
      </g>
    </svg>
  );
}
