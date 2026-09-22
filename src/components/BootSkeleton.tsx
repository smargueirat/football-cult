"use client";

import { useId } from "react";

// Mismo patrón que JerseySkeleton.tsx: un contorno (acá, de bota de
// fútbol de perfil) en vez del cuadrado genérico con animate-pulse que
// tenía BootCard antes. Path propio, sin licencia de ningún modelo real
// -- es una silueta abstracta de bota, no el diseño de una marca.
const BOOT_PATH =
  "M8,74 L8,58 C8,50 13,44 20,41 L52,29 C60,26 66,21 71,14 C73,11 76,10 79,11 L88,14 C92,15 94,19 94,23 L94,62 C94,69 88,74 81,74 Z";

export default function BootSkeleton({ className = "h-full w-full" }: { className?: string }) {
  const clipId = useId();
  const gradId = useId();

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <clipPath id={clipId}>
          <path d={BOOT_PATH} />
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
