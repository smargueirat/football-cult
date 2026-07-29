"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Header usa backdrop-filter (glass-panel), lo que por spec de CSS lo
// convierte en el "containing block" de cualquier descendiente con
// position:fixed — rompiendo su tamaño/posición (queda acotado al
// header en vez de ocupar toda la pantalla). Este portal escapa ese
// contexto renderizando directo en <body>.
export default function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return createPortal(children, document.body);
}
