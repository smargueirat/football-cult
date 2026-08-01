import Image from "next/image";

export default function StadiumWatermark() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <Image
        src="/images/pitch-ground-level.jpg"
        alt=""
        fill
        priority
        className="object-cover opacity-[0.16]"
      />

      {/* pátina cálida para que la foto se integre con la paleta marfil */}
      <div className="absolute inset-0 bg-[#EDE0C4] mix-blend-color opacity-45" />

      {/* boca del túnel: paneles oscuros a los costados, arriba */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <g opacity="0.08" fill="#08130D">
          <path d="M 0 0 L 200 0 L 60 300 L 0 300 Z" />
          <path d="M 1000 0 L 800 0 L 940 300 L 1000 300 Z" />
        </g>
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
