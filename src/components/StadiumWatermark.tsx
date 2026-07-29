export default function StadiumWatermark() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* césped cortado a dos tonos, extremadamente sutil */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #1F6F4C 0px, #1F6F4C 48px, #0F4A32 48px, #0F4A32 96px)",
        }}
      />

      {/* viñeta radial, profundidad de estadio nocturno */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(10,26,20,0.10) 85%, rgba(8,20,16,0.16) 100%)",
        }}
      />
    </div>
  );
}
