const GRASS_A = "#2F6F4E";
const GRASS_B = "#245A3F";

// Franjas de césped en perspectiva, convergiendo a un punto de fuga
// por encima del horizonte (500, 260), recortadas desde el horizonte
// (y=420) hasta el borde inferior (y=1000).
const STRIPE_TOPS = [359.5, 387.6, 415.7, 443.8, 471.9, 500, 528.1, 556.2, 584.3, 612.4, 640.5];
const STRIPE_BOTTOMS = [-150, -20, 110, 240, 370, 500, 630, 760, 890, 1020, 1150];

export default function StadiumWatermark() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* cielo / techo del estadio */}
        <rect x="0" y="0" width="1000" height="430" fill="#0C2A1E" opacity="0.05" />

        {/* tribunas: niveles curvos sugiriendo gradas */}
        <g opacity="0.07" stroke="#0C2A1E" fill="none" strokeWidth="3">
          <path d="M -50 300 Q 500 190 1050 300" />
          <path d="M -50 340 Q 500 240 1050 340" />
          <path d="M -50 380 Q 500 290 1050 380" />
        </g>

        {/* torres de iluminación */}
        <g opacity="0.08" fill="#0C2A1E">
          <rect x="55" y="120" width="10" height="140" />
          <rect x="30" y="112" width="60" height="14" />
          <rect x="935" y="120" width="10" height="140" />
          <rect x="910" y="112" width="60" height="14" />
        </g>

        {/* boca del túnel: paneles oscuros a los costados, arriba */}
        <g opacity="0.1" fill="#08130D">
          <path d="M 0 0 L 200 0 L 60 300 L 0 300 Z" />
          <path d="M 1000 0 L 800 0 L 940 300 L 1000 300 Z" />
        </g>

        {/* césped en perspectiva */}
        <g opacity="0.19">
          {STRIPE_TOPS.slice(0, -1).map((topX, i) => {
            const topX2 = STRIPE_TOPS[i + 1];
            const botX = STRIPE_BOTTOMS[i];
            const botX2 = STRIPE_BOTTOMS[i + 1];
            return (
              <polygon
                key={i}
                points={`${topX},420 ${topX2},420 ${botX2},1000 ${botX},1000`}
                fill={i % 2 === 0 ? GRASS_A : GRASS_B}
              />
            );
          })}
        </g>

        {/* línea de horizonte / borde de la cancha */}
        <line x1="0" y1="420" x2="1000" y2="420" stroke="#FFFFFF" strokeWidth="3" opacity="0.12" />

        {/* círculo central, visto en perspectiva */}
        <ellipse
          cx="500"
          cy="620"
          rx="150"
          ry="55"
          stroke="#FFFFFF"
          strokeWidth="3"
          fill="none"
          opacity="0.1"
        />
      </svg>

      {/* viñeta radial, profundidad de estadio nocturno */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, transparent 35%, rgba(6,20,14,0.16) 80%, rgba(4,14,10,0.3) 100%)",
        }}
      />
    </div>
  );
}
