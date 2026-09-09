"use client";

import Image from "next/image";
import Link from "@/lib/i18n/LocaleLink";
import { BootProduct } from "@/data/boots";
import { formatOfferMoney } from "@/data/products";

export default function BootCard({ boot, priority }: { boot: BootProduct; priority?: boolean }) {
  const cheapest = boot.offers.reduce((a, b) => (a.price + a.shipping <= b.price + b.shipping ? a : b));

  return (
    <Link
      href={`/botas/${boot.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-vintage-sm transition-transform hover:-translate-y-0.5"
    >
      <div className="relative aspect-square w-full bg-white">
        <Image
          src={cheapest.imageUrl}
          alt={boot.model}
          fill
          unoptimized
          priority={priority}
          className="object-contain p-4 transition-transform group-hover:scale-105"
        />
        <span className="absolute left-2 top-2 rounded-full bg-[#1B3B2B] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#F3E9C9]">
          Botas
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-0.5 p-3">
        <span className="text-[11px] uppercase tracking-wide text-[#B8933F]">
          {boot.brand} · {boot.groundType}
        </span>
        <span className="line-clamp-2 text-sm font-medium text-[#1a1a1a]">{boot.model}</span>
        <span className="mt-auto text-sm font-semibold text-[#1B3B2B]">
          Desde {formatOfferMoney(cheapest.price, "EUR")}
        </span>
      </div>
    </Link>
  );
}
