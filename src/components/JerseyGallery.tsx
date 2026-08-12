"use client";

import { useRef, useState } from "react";
import { getDisplaySrc } from "@/lib/images";
import JerseyIcon from "./JerseyIcon";
import JerseySkeleton from "./JerseySkeleton";
import type { JerseyPattern } from "@/data/products";

const LOUPE_SIZE = 160;
const ZOOM = 2.4;

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
  const [loupe, setLoupe] = useState<{ x: number; y: number; bgX: number; bgY: number } | null>(
    null
  );
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const photo = photos[index];

  function updateLoupe(clientX: number, clientY: number) {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      setLoupe(null);
      return;
    }
    setLoupe({
      x,
      y,
      bgX: (x / rect.width) * 100,
      bgY: (y / rect.height) * 100,
    });
  }

  function goTo(i: number) {
    setImageLoaded(false);
    setIndex((i + photos.length) % photos.length);
  }

  return (
    <div>
      <div
        ref={frameRef}
        className="vintage-card relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl p-16"
        style={{
          background: `linear-gradient(135deg, #fffdf8, ${colorHex}33, ${colorHexSecondary}22)`,
        }}
        onMouseMove={(e) => updateLoupe(e.clientX, e.clientY)}
        onMouseLeave={() => setLoupe(null)}
        onTouchMove={(e) => {
          const t = e.touches[0];
          if (t) updateLoupe(t.clientX, t.clientY);
        }}
        onTouchEnd={() => setLoupe(null)}
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
            {/* Lupa de inspección: círculo que sigue el cursor/dedo mostrando
                la misma foto ampliada. La nitidez del resultado depende de
                la resolución real que trae cada tienda -- en fotos chicas
                se ve más suave, es un límite de los datos, no un bug. */}
            {loupe && imageLoaded && (
              <div
                className="shadow-vintage-lg pointer-events-none absolute z-20 hidden rounded-full border-2 border-[#C9A24B] sm:block"
                style={{
                  width: LOUPE_SIZE,
                  height: LOUPE_SIZE,
                  left: loupe.x - LOUPE_SIZE / 2,
                  top: loupe.y - LOUPE_SIZE / 2,
                  backgroundImage: `url(${getDisplaySrc(photo, 1200)})`,
                  backgroundSize: `${ZOOM * 100}%`,
                  backgroundPosition: `${loupe.bgX}% ${loupe.bgY}%`,
                  backgroundRepeat: "no-repeat",
                  backgroundColor: "#fffdf8",
                }}
                aria-hidden
              />
            )}
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
