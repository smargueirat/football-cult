"use client";

import { useId } from "react";

// Insignia genérica tipo escudo para clubes (no reproduce escudos oficiales,
// que están registrados como marca — es un diseño propio con los colores
// del equipo, misma lógica que el logo del sitio).
export default function TeamBadge({
  colors,
  className = "h-4 w-4",
}: {
  colors: [string, string];
  className?: string;
}) {
  const gradId = useId();
  const [c1, c2] = colors;

  return (
    <svg viewBox="0 0 24 24" className={className}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <path
        d="M12 2 L20 4.5 L20 11 C20 16.5 16.9 20.2 12 22 C7.1 20.2 4 16.5 4 11 L4 4.5 Z"
        fill={`url(#${gradId})`}
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="0.75"
      />
    </svg>
  );
}
