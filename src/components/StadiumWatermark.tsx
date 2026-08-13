import Image from "next/image";

// Los dos intentos anteriores (respiración+reflectores+polvo; después
// scroll-parallax con la misma foto duplicada en distintas capas) no
// convencieron -- el segundo en particular se veía "borroso" porque
// dos copias de la misma foto se separaban visualmente al scrollear.
// Esta versión vuelve a una sola foto fija, sin transformar ni
// duplicar (cero riesgo de artefactos), y deja lo "dinámico" a cargo
// de un único reflector cálido que barre muy lento -- el mismo recurso
// que ya funcionó bien en el CTA del carrusel del home. Nada se mueve
// con el scroll, así que no hay forma de que maree.
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

      {/* único reflector, muy lento y sutil -- el único elemento vivo */}
      <div className="stadium-beam-a absolute inset-0" />

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
