export default function StadiumWatermark() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* césped cortado a dos tonos */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #2F6F4E 0px, #2F6F4E 90px, #245A3F 90px, #245A3F 180px)",
          opacity: 0.14,
        }}
      />

      {/* líneas de cancha: círculo central y línea de mitad */}
      <svg
        className="absolute left-1/2 top-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 opacity-[0.05]"
        viewBox="0 0 1000 1000"
        fill="none"
      >
        <line x1="500" y1="0" x2="500" y2="1000" stroke="#FFFFFF" strokeWidth="4" />
        <circle cx="500" cy="500" r="160" stroke="#FFFFFF" strokeWidth="4" />
        <circle cx="500" cy="500" r="6" fill="#FFFFFF" />
        <path d="M 500 -50 A 260 260 0 0 1 500 250" stroke="#FFFFFF" strokeWidth="4" />
        <path d="M 500 750 A 260 260 0 0 1 500 1050" stroke="#FFFFFF" strokeWidth="4" />
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
