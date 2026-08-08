"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const REASONS = [
  "wrongPhoto",
  "wrongPrice",
  "wrongName",
  "brokenLink",
  "other",
] as const;
type Reason = (typeof REASONS)[number];

export default function ReportProductModal({
  productId,
  productUrl,
  onClose,
}: {
  productId: string;
  productUrl: string;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const [reason, setReason] = useState<Reason>("wrongPhoto");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/report-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, productUrl, reason, details }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  const reasonLabels: Record<Reason, string> = {
    wrongPhoto: t.reportProduct.reasonWrongPhoto,
    wrongPrice: t.reportProduct.reasonWrongPrice,
    wrongName: t.reportProduct.reasonWrongName,
    brokenLink: t.reportProduct.reasonBrokenLink,
    other: t.reportProduct.reasonOther,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="vintage-card w-full max-w-md rounded-3xl bg-[#fffdf8] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {status === "sent" ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <p className="text-2xl">✅</p>
            <p className="text-sm text-[#3a3a36]">{t.reportProduct.success}</p>
            <button
              onClick={onClose}
              className="mt-2 rounded-full bg-[#1B3B2B] px-4 py-2 text-sm font-medium text-[#F3E9C9]"
            >
              {t.reportProduct.cancel}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <h2 className="font-card-title text-xl text-[#1a1a1a]">
                {t.reportProduct.modalTitle}
              </h2>
              <p className="mt-1 text-sm text-[#8a7a5a]">{t.reportProduct.modalIntro}</p>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-[#5b5442]">
                {t.reportProduct.reasonLabel}
              </p>
              <div className="flex flex-col gap-2">
                {REASONS.map((r) => (
                  <label
                    key={r}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors ${
                      reason === r
                        ? "border-[#1B3B2B] bg-[#1B3B2B]/5"
                        : "border-[#C9A24B]/25 bg-white/60"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r}
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      className="accent-[#1B3B2B]"
                    />
                    {reasonLabels[r]}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#5b5442]">
                {t.reportProduct.detailsLabel}
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={t.reportProduct.detailsPlaceholder}
                rows={3}
                maxLength={2000}
                className="w-full rounded-xl border border-[#C9A24B]/25 bg-white/60 p-3 text-sm text-[#1a1a1a] outline-none focus:border-[#1B3B2B]/50"
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-[#B45309]">{t.reportProduct.error}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-[#C9A24B]/30 bg-white/60 px-4 py-2 text-sm font-medium text-[#3a3a36]"
              >
                {t.reportProduct.cancel}
              </button>
              <button
                type="submit"
                disabled={status === "sending"}
                className="rounded-full bg-[#1B3B2B] px-4 py-2 text-sm font-medium text-[#F3E9C9] disabled:opacity-50"
              >
                {status === "sending" ? t.reportProduct.submitting : t.reportProduct.submit}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
