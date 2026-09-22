"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Gate liviano: el panel real (FloatingFilterButtonContent) no se
// muestra hasta que el usuario scrollea más de 420px, así que antes de
// ese punto no hay ninguna razón para haber descargado su chunk. Mismo
// patrón que CompareBar.tsx (dynamic()+ssr:false detrás de un early
// return real) -- acá el "no renderizar nada" es la posición de scroll
// en vez de una lista vacía, pero el efecto es el mismo: la enorme
// mayoría de los home no llegan a cargar este chunk hasta que el
// usuario scrollea, y cuando lo hacen, se pide async (no bloquea la
// hidratación inicial del resto de la página).
const FloatingFilterButtonContent = dynamic(() => import("./FloatingFilterButtonContent"), {
  ssr: false,
});

export default function FloatingFilterButton({ seasons }: { seasons: string[] }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 420);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;
  return <FloatingFilterButtonContent seasons={seasons} />;
}
