"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ContactoClient() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <h1 className="font-card-title text-4xl text-[#1a1a1a]">{t.contact.title}</h1>
      <div className="vintage-card rounded-3xl p-8 text-[#3a3a36]">
        <p className="mb-6">{t.contact.p1}</p>

        {status === "sent" ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <p className="text-2xl">✅</p>
            <p className="text-sm text-[#3a3a36]">{t.contact.success}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#5b5442]">
                {t.contact.nameLabel}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.contact.namePlaceholder}
                maxLength={200}
                className="w-full rounded-xl border border-[#C9A24B]/25 bg-white/60 p-3 text-sm text-[#1a1a1a] outline-none transition focus:border-[#1B3B2B]/50 focus:ring-2 focus:ring-[#1B3B2B]/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#5b5442]">
                {t.contact.emailLabel}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                maxLength={320}
                className="w-full rounded-xl border border-[#C9A24B]/25 bg-white/60 p-3 text-sm text-[#1a1a1a] outline-none transition focus:border-[#1B3B2B]/50 focus:ring-2 focus:ring-[#1B3B2B]/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#5b5442]">
                {t.contact.messageLabel}
              </label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.contact.messagePlaceholder}
                rows={5}
                maxLength={4000}
                className="w-full rounded-xl border border-[#C9A24B]/25 bg-white/60 p-3 text-sm text-[#1a1a1a] outline-none transition focus:border-[#1B3B2B]/50 focus:ring-2 focus:ring-[#1B3B2B]/10"
              />
            </div>

            {status === "error" && <p className="text-sm text-[#B45309]">{t.contact.error}</p>}

            <button
              type="submit"
              disabled={status === "sending"}
              className="self-start rounded-full bg-[#1B3B2B] px-5 py-2.5 text-sm font-medium text-[#F3E9C9] transition-opacity disabled:opacity-50"
            >
              {status === "sending" ? t.contact.submitting : t.contact.submit}
            </button>
          </form>
        )}

        <p className="mt-6 border-t border-[#C9A24B]/20 pt-4 text-sm">
          {t.contact.orEmail}{" "}
          <a href="mailto:contact@football-cult.com" className="font-medium text-[#1F6F4C] underline">
            contact@football-cult.com
          </a>
        </p>
      </div>
    </div>
  );
}
