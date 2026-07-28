export default function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))" }}
    >
      <path
        d="M50,3 L88,16 L88,45 C88,73 69,91 50,97 C31,91 12,73 12,45 L12,16 Z"
        fill="#1F6F4C"
      />
      <path d="M58,12 L33,54 L47,54 L39,88 L69,44 L53,44 Z" fill="#FFFFFF" />
    </svg>
  );
}
