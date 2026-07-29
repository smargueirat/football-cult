export default function StadiumWatermark() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1000 1000"
        className="h-[140vmax] w-[140vmax] opacity-[0.04]"
      >
        <defs>
          <clipPath id="pitch-clip">
            <ellipse cx="500" cy="500" rx="360" ry="230" />
          </clipPath>
        </defs>

        {/* outer stands */}
        <ellipse cx="500" cy="500" rx="480" ry="330" fill="none" stroke="#1a1a1a" strokeWidth="6" />
        <ellipse cx="500" cy="500" rx="430" ry="290" fill="none" stroke="#1a1a1a" strokeWidth="4" />

        {/* floodlight towers */}
        <rect x="60" y="120" width="10" height="90" fill="#1a1a1a" />
        <rect x="930" y="120" width="10" height="90" fill="#1a1a1a" />
        <rect x="60" y="790" width="10" height="90" fill="#1a1a1a" />
        <rect x="930" y="790" width="10" height="90" fill="#1a1a1a" />

        {/* mowed grass stripes */}
        <g clipPath="url(#pitch-clip)">
          {Array.from({ length: 12 }).map((_, i) => (
            <rect
              key={i}
              x={140 + i * 60}
              y="270"
              width="60"
              height="460"
              fill={i % 2 === 0 ? "#1a1a1a" : "none"}
              opacity="0.5"
            />
          ))}
          <ellipse cx="500" cy="500" rx="360" ry="230" fill="none" stroke="#1a1a1a" strokeWidth="4" />
        </g>

        {/* pitch markings */}
        <ellipse cx="500" cy="500" rx="70" ry="45" fill="none" stroke="#1a1a1a" strokeWidth="4" />
        <line x1="500" y1="270" x2="500" y2="730" stroke="#1a1a1a" strokeWidth="4" />
      </svg>
    </div>
  );
}
