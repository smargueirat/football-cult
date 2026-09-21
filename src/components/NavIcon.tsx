// Íconos de línea del menú (reemplazan los emoji 🔍/🛒, que se veían
// ajenos al resto del sitio). Trazo fino en dorado, mismo lenguaje que
// los demás íconos SVG del header.
export default function NavIcon({ kind, className = "" }: { kind: "search" | "grid" | "trophy"; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-[18px] w-[18px] shrink-0 text-[#8a6a1f] ${className}`}
    >
      {kind === "search" ? (
        <>
          <circle cx="11" cy="11" r="6.5" />
          <path d="M20 20l-4.2-4.2" />
        </>
      ) : kind === "trophy" ? (
        <>
          <path d="M8 4h8v5a4 4 0 0 1-8 0V4z" />
          <path d="M8 6H5.5a1 1 0 0 0-1 1c0 2 1.3 3.5 3.5 3.8M16 6h2.5a1 1 0 0 1 1 1c0 2-1.3 3.5-3.5 3.8" />
          <path d="M12 13v4M9 20h6M10 17h4" />
        </>
      ) : (
        <>
          <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
          <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
          <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
          <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
        </>
      )}
    </svg>
  );
}
