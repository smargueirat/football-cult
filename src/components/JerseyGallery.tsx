"use client";

import { useEffect, useRef, useState } from "react";
import { getDisplaySrc } from "@/lib/images";
import JerseyIcon from "./JerseyIcon";
import JerseySkeleton from "./JerseySkeleton";
import type { JerseyPattern } from "@/data/products";

export default function JerseyGallery({
  photos,
  alt,
  colorHex,
  colorHexSecondary,
  jerseyPattern,
}: {
  photos: string[];
  alt: string;
  colorHex: string;
  colorHexSecondary: string;
  jerseyPattern: JerseyPattern;
}) {
  const [index, setIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const photo = photos[index];
  const imgRef = useRef<HTMLImageElement>(null);
  // Si el navegador ya tenía la imagen en caché (típico al refrescar la
  // página), puede terminar de cargarla antes de que React llegue a
  // enganchar onLoad -- el evento "load" del <img> nunca llega a
  // dispararse en ese caso y la foto queda con el skeleton pegado para
  // siempre. Se chequea `complete` al montar/cambiar de foto como red
  // de seguridad (mismo patrón que ProductCard.tsx).
  useEffect(() => {
    if (imgRef.current?.complete) {
      setImageLoaded(true);
    }
  }, [photo]);

  function goTo(i: number) {
    setImageLoaded(false);
    setIndex((i + photos.length) % photos.length);
  }

  return (
    <div>
      <div
        className="vintage-card relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl p-16"
        style={{
          background: `linear-gradient(135deg, #fffdf8, ${colorHex}33, ${colorHexSecondary}22)`,
        }}
      >
        {photo ? (
          <>
            {!imageLoaded && (
              <JerseySkeleton className="absolute inset-0 h-full w-full" />
            )}
            <img
              ref={imgRef}
              src={getDisplaySrc(photo, 1000)}
              srcSet={`${getDisplaySrc(photo, 500)} 500w, ${getDisplaySrc(photo, 800)} 800w, ${getDisplaySrc(photo, 1200)} 1200w`}
              sizes="(max-width: 1024px) 90vw, 45vw"
              alt={alt}
              fetchPriority="high"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
              className={`absolute inset-0 h-full w-full object-contain drop-shadow-sm transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </>
        ) : (
          <JerseyIcon
            className="h-2/3 w-2/3 drop-shadow-sm"
            primary={colorHex}
            secondary={colorHexSecondary}
            pattern={jerseyPattern}
          />
        )}

        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Foto anterior"
              className="shadow-vintage-sm absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#1a1a1a] backdrop-blur-md"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Foto siguiente"
              className="shadow-vintage-sm absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#1a1a1a] backdrop-blur-md"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ver foto ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-[#1B3B2B]" : "w-1.5 bg-[#C9A24B]/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
