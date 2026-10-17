import Link from "next/link";

// Accesos a categorías de la cabecera de la home (2026-10-17): seis
// casillas IGUALES con icono; en móvil una fila con scroll lateral (una
// rejilla 3x2 ocupaba 64 px más y dejaba el botón de la primera oferta
// fuera de la primera pantalla), en escritorio una fila de 6. Sustituyen
// a las "pastillas" de categoría, que no eran enlaces, se partían en filas
// desiguales y se mezclaban con "Gratis, sin registro". Botas primero: es lo que más deja por clic (ver
// CategorySections). Iconos SVG en línea, sin peticiones ni JS.
export const HOME_CATS = ["/botas", "/clubes", "/selecciones", "/guantes", "/pelotas", "/ropa"] as const;

const ICONS: Record<(typeof HOME_CATS)[number], string> = {
  // bota de tacos
  "/botas": "M3 15.5V8.8c0-.6.5-1 1-.9l4.2.9 2.3 2.7 7.8 1.5c1.5.3 2.7 1.6 2.7 3.1v.4H3ZM5 19v-2.5M9 19v-2.5M13 19v-2.5M18 19v-2.5",
  // escudo de club
  "/clubes": "M12 3 4.5 6v5.5c0 4.4 3.1 8.1 7.5 9.5 4.4-1.4 7.5-5.1 7.5-9.5V6L12 3Zm0 4v10M8 10h8",
  // bandera
  "/selecciones": "M5 21V4M5 4h12.5l-2.2 4 2.2 4H5",
  // guante de portero
  "/guantes": "M7 21v-4.5L4.5 12c-.5-.9.6-1.8 1.4-1.1L8 12.8V5.5a1.3 1.3 0 0 1 2.6 0V11m0-6.5V4a1.3 1.3 0 0 1 2.6 0v7m0-6a1.3 1.3 0 0 1 2.6 0v6m0-4a1.3 1.3 0 0 1 2.6 0V15c0 3-2 6-5 6H7",
  // balón
  "/pelotas": "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13.5 3.8 2.8-1.5 4.4H9.7l-1.5-4.4L12 7.5Zm0 0V3.2M15.8 10.3l4.6-1.4M14.3 14.7l2.8 3.9M9.7 14.7l-2.8 3.9M8.2 10.3 3.6 8.9",
  // camiseta
  "/ropa": "M8.5 3.5 3 6.5l2 4.2 2-1V20.5h10V9.7l2 1 2-4.2-5.5-3c-.6 1.6-1.9 2.5-3.5 2.5s-2.9-.9-3.5-2.5Z",
};

export default function HomeCategoryTiles({ locale, labels }: { locale: string; labels: string[] }) {
  return (
    <ul className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-6 sm:gap-3 sm:overflow-visible sm:px-0" data-hero="cats">
      {HOME_CATS.map((path, i) => (
        <li key={path} className="w-[100px] shrink-0 sm:w-auto">
          <Link
            href={`/${locale}${path}`}
            className="flex h-14 flex-col items-center justify-center gap-1 rounded-xl border border-[#C9A24B]/45 bg-white/75 px-1 text-[#1B3B2B] shadow-sm transition-colors hover:border-[#1B3B2B]/60 hover:bg-white sm:h-[72px]"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="h-[22px] w-[22px] shrink-0 fill-none stroke-[#8a6a1f] sm:h-6 sm:w-6" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <path d={ICONS[path]} />
            </svg>
            <span className="w-full truncate text-center text-xs font-medium leading-tight sm:text-sm">{labels[i]}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
