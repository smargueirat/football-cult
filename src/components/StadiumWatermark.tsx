export default function StadiumWatermark() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* césped cortado a dos tonos */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #2F6F4E 0px, #2F6F4E 90px, #245A3F 90px, #245A3F 180px)",
          opacity: 0.18,
        }}
      />

      {/* cancha completa: líneas, área, semicírculos, córners */}
      <svg
        className="absolute left-1/2 top-1/2 h-[85vmin] w-[85vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.1]"
        viewBox="0 0 1050 680"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect x="20" y="20" width="1010" height="640" stroke="#FFFFFF" strokeWidth="5" />
        <line x1="525" y1="20" x2="525" y2="660" stroke="#FFFFFF" strokeWidth="5" />
        <circle cx="525" cy="340" r="91.5" stroke="#FFFFFF" strokeWidth="5" />
        <circle cx="525" cy="340" r="5" fill="#FFFFFF" />

        {/* área y semicírculo izquierdo */}
        <rect x="20" y="138" width="165" height="404" stroke="#FFFFFF" strokeWidth="5" />
        <rect x="20" y="249" width="55" height="182" stroke="#FFFFFF" strokeWidth="5" />
        <circle cx="131" cy="340" r="5" fill="#FFFFFF" />
        <path d="M 185 266 A 91.5 91.5 0 0 1 185 414" stroke="#FFFFFF" strokeWidth="5" />

        {/* área y semicírculo derecho */}
        <rect x="865" y="138" width="165" height="404" stroke="#FFFFFF" strokeWidth="5" />
        <rect x="975" y="249" width="55" height="182" stroke="#FFFFFF" strokeWidth="5" />
        <circle cx="919" cy="340" r="5" fill="#FFFFFF" />
        <path d="M 865 266 A 91.5 91.5 0 0 0 865 414" stroke="#FFFFFF" strokeWidth="5" />

        {/* arcos de córner */}
        <path d="M 20 45 A 25 25 0 0 1 45 20" stroke="#FFFFFF" strokeWidth="5" />
        <path d="M 1005 20 A 25 25 0 0 1 1030 45" stroke="#FFFFFF" strokeWidth="5" />
        <path d="M 45 660 A 25 25 0 0 1 20 635" stroke="#FFFFFF" strokeWidth="5" />
        <path d="M 1030 635 A 25 25 0 0 1 1005 660" stroke="#FFFFFF" strokeWidth="5" />
      </svg>

      {/* viñeta radial, profundidad de estadio nocturno */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(6,20,14,0.18) 85%, rgba(4,14,10,0.32) 100%)",
        }}
      />
    </div>
  );
}
