"use client";

import { useId } from "react";
import { JerseyPattern } from "@/data/products";

const JERSEY_PATH =
  "M35,8 L20,20 L8,34 L20,46 L26,40 L26,90 L74,90 L74,40 L80,46 L92,34 L80,20 L65,8 C65,8 58,15 50,15 C42,15 35,8 35,8 Z";

const STRIPE_X = [8, 22.5, 37, 51.5, 66, 80.5];
const STRIPE_WIDTH = 14.5;

export default function JerseyIcon({
  className = "h-full w-full",
  primary = "#1a1a1a",
  secondary = "#ffffff",
  pattern = "solid",
}: {
  className?: string;
  primary?: string;
  secondary?: string;
  pattern?: JerseyPattern;
}) {
  const clipId = useId();

  return (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        <clipPath id={clipId}>
          <path d={JERSEY_PATH} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <rect x="0" y="0" width="100" height="100" fill={primary} />

        {pattern === "stripes" &&
          STRIPE_X.filter((_, i) => i % 2 === 1).map((x) => (
            <rect key={x} x={x} y="0" width={STRIPE_WIDTH} height="100" fill={secondary} />
          ))}

        {pattern === "band" && (
          <rect x="0" y="38" width="100" height="16" fill={secondary} />
        )}

        {/* collar */}
        <path d="M40,10 C43,16 57,16 60,10 L58,18 C54,22 46,22 42,18 Z" fill={secondary} opacity="0.9" />
        {/* cuffs */}
        <path d="M14,38 L24,44 L21,50 L11,44 Z" fill={secondary} opacity="0.85" />
        <path d="M86,38 L76,44 L79,50 L89,44 Z" fill={secondary} opacity="0.85" />
      </g>

      <path
        d={JERSEY_PATH}
        fill="none"
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="1.5"
      />
    </svg>
  );
}
