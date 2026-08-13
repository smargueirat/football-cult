import Image from "next/image";

// Tercer intento, esta vez sin tocar la foto para nada -- los dos
// anteriores (respiración+reflectores+polvo; después scroll-parallax
// con la foto duplicada en capas) fallaron por el mismo lado: cualquier
// manipulación de la propia foto (blur, escala, desplazamiento) termina
// leyéndose como un error visual, no como atmósfera. Esta versión deja
// la foto exactamente como estaba en la base original (fija, sin
// transformar, sin duplicar) y pone lo "épico" en un elemento nuevo que
// nunca puede verse "roto": orbes de luz dorada fuera de foco, como
// reflectores de estadio de noche vistos en bokeh, flotando
// larguísimo (70-105s por ciclo) y a baja opacidad. Es pura animación
// CSS de transform/opacity -- la respeta automáticamente la regla
// global de prefers-reduced-motion (ver arriba en este archivo), sin
// necesitar JS ni listener de scroll.
export default function StadiumWatermark() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <Image
        src="/images/pitch-ground-level.jpg"
        alt=""
        fill
        priority
        className="object-cover opacity-[0.12]"
      />

      {/* pátina cálida para que la foto se integre con la paleta marfil */}
      <div className="absolute inset-0 bg-[#EDE0C4] mix-blend-color opacity-45" />

      {/* orbes de luz dorada en bokeh -- el elemento nuevo, único vivo */}
      <div className="bokeh-orb bokeh-orb-1" />
      <div className="bokeh-orb bokeh-orb-2" />
      <div className="bokeh-orb bokeh-orb-3" />
      <div className="bokeh-orb bokeh-orb-4" />

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
