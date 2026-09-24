"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useFavorites } from "@/lib/favorites/FavoritesContext";
import { trackPriceAlertSignup } from "@/lib/analytics";

// "Avisame si baja" sin crear cuenta.
//
// Antes esto era el corazón de favoritos, que exige sesión: pedir una
// alerta de precio obligaba a registrarse. Para la función que más
// retiene, esa era la fricción más cara del sitio. Ahora:
//  - con sesión iniciada sigue siendo el favorito de siempre (así la
//    camiseta también aparece en /favoritos);
//  - sin sesión, se despliega un campo de mail y listo.
export default function PriceAlertInline({ productId }: { productId: string }) {
  const { t } = useLanguage();
  const { status } = useSession();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const favorited = isFavorite(productId);

  if (status === "authenticated") {
    return (
      <button
        onClick={() => toggleFavorite(productId)}
        className="mt-2 text-left text-sm text-[#8a6a1f] underline decoration-[#C9A24B] underline-offset-2 hover:text-[#1B3B2B]"
      >
        {favorited ? t.detail.priceAlertCtaOn : t.detail.priceAlertCtaOff}
      </button>
    );
  }

  if (state === "done") {
    return (
      <p className="mt-2 text-sm font-medium text-[#1B3B2B]">{t.detail.priceAlertDone}</p>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-2 text-left text-sm text-[#8a6a1f] underline decoration-[#C9A24B] underline-offset-2 hover:text-[#1B3B2B]"
      >
        {t.detail.priceAlertCtaOff}
      </button>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/price-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, subscribe: true, email }),
      });
      if (!res.ok) throw new Error("failed");
      trackPriceAlertSignup({ productId, loggedIn: false });
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={submit} className="mt-2 flex flex-col gap-2">
      <label className="text-sm text-[#5b5442]" htmlFor={`alert-${productId}`}>
        {t.detail.priceAlertPrompt}
      </label>
      <div className="flex flex-wrap gap-2">
        <input
          id={`alert-${productId}`}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.detail.priceAlertPlaceholder}
          className="min-w-0 flex-1 rounded-full border border-[#C9A24B]/50 bg-white px-4 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[#1B3B2B]"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="vintage-plaque shrink-0 rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          {t.detail.priceAlertSubmit}
        </button>
      </div>
      {state === "error" && (
        <p className="text-sm text-[#B45309]">{t.detail.priceAlertError}</p>
      )}
    </form>
  );
}
