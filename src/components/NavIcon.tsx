// Íconos de línea del menú (reemplazan los emoji 🔍/🛒, que se veían
// ajenos al resto del sitio). Trazo fino en dorado, mismo lenguaje que
// los demás íconos SVG del header.
export default function NavIcon({ kind, className = "" }: { kind: "search" | "grid"; className?: string }) {
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
