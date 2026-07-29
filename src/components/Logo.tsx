const HEX = "M50,4 L89.8,27 L89.8,73 L50,96 L10.2,73 L10.2,27 Z";

const JERSEY =
  "M42,22 L28,26 L18,38 L30,44 L30,80 L70,80 L70,44 L82,38 L72,26 L58,22 C58,22 54,30 50,30 C46,30 42,22 42,22 Z";

export default function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))" }}
    >
      <path d={HEX} fill="#FBF9F5" stroke="#D4AF37" strokeWidth="2.5" />
      <path d={JERSEY} fill="#1B3B2B" />

      {/* cordones del cuello, estilo camiseta retro */}
      <line x1="50" y1="30" x2="50" y2="42" stroke="#D4AF37" strokeWidth="1.6" />
      <line x1="45.5" y1="33.5" x2="54.5" y2="33.5" stroke="#D4AF37" strokeWidth="1.6" />
      <line x1="45.5" y1="38" x2="54.5" y2="38" stroke="#D4AF37" strokeWidth="1.6" />
      <line x1="45.5" y1="42.5" x2="54.5" y2="42.5" stroke="#D4AF37" strokeWidth="1.6" />
    </svg>
  );
}
