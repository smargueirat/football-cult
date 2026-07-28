export default function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={{ filter: "drop-shadow(0 0 6px rgba(34,211,238,0.55))" }}
    >
      <defs>
        <linearGradient id="fc-shield" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="55%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
      </defs>
      <path
        d="M50,3 L88,16 L88,45 C88,73 69,91 50,97 C31,91 12,73 12,45 L12,16 Z"
        fill="url(#fc-shield)"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
      />
      <path
        d="M58,12 L33,54 L47,54 L39,88 L69,44 L53,44 Z"
        fill="#05060a"
      />
    </svg>
  );
}
