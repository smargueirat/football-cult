"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function SignInOptions() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    try {
      const res = await signIn("resend", { email, redirect: false });
      setStatus(res?.error ? "error" : "sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => signIn("google")}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1B3B2B] py-2 text-sm font-medium text-[#F3E9C9] transition-colors hover:bg-[#15301f]"
      >
        <svg className="h-4 w-4" viewBox="0 0 48 48">
          <path
            fill="#FFC107"
            d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34 5.1 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.3-.4-3.5z"
          />
          <path
            fill="#FF3D00"
            d="M6.3 14.7l6.6 4.8C14.5 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34 5.1 29.3 3 24 3c-7.7 0-14.4 4.4-17.7 10.7z"
          />
          <path
            fill="#4CAF50"
            d="M24 45c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 36.6 26.7 37.5 24 37.5c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.5 40.5 16.2 45 24 45z"
          />
          <path
            fill="#1976D2"
            d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.1 5.6l6.2 5.2C41 35.5 43 30.4 43 24c0-1.2-.1-2.3-.4-3.5z"
          />
        </svg>
        {t.loginPanel.googleCta}
      </button>

      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#675c44]">
        <span className="h-px flex-1 bg-[#C9A24B]/25" />
        {t.loginPanel.or}
        <span className="h-px flex-1 bg-[#C9A24B]/25" />
      </div>

      {status === "sent" ? (
        <p className="rounded-xl bg-[#1B3B2B]/5 px-3 py-2 text-xs text-[#1B3B2B]">
          {t.loginPanel.emailSent}
        </p>
      ) : (
        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.loginPanel.emailPlaceholder}
            className="w-full rounded-xl border border-[#C9A24B]/25 bg-white/60 px-3 py-2 text-sm text-[#1a1a1a] outline-none transition focus:border-[#1B3B2B]/50 focus:ring-2 focus:ring-[#1B3B2B]/10"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-xl border border-[#1B3B2B]/30 py-2 text-sm font-medium text-[#1B3B2B] transition-colors hover:bg-[#1B3B2B]/5 disabled:opacity-50"
          >
            {status === "sending" ? t.loginPanel.emailSending : t.loginPanel.emailCta}
          </button>
          {status === "error" && (
            <p className="text-xs text-[#B45309]">{t.loginPanel.emailError}</p>
          )}
        </form>
      )}
    </div>
  );
}
