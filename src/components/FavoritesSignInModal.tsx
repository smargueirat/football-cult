"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import Portal from "./Portal";
import SignInOptions from "./SignInOptions";

export default function FavoritesSignInModal({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 sm:items-center"
        onClick={onClose}
      >
        <div
          className="vintage-card w-full max-w-sm rounded-3xl bg-[#fffdf8] p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="font-card-title text-xl text-[#1a1a1a]">
            {t.loginPanel.favoritesGateTitle}
          </h2>
          <p className="mt-1 text-sm text-[#675c44]">{t.loginPanel.favoritesGateText}</p>
          <div className="mt-4">
            <SignInOptions />
          </div>
        </div>
      </div>
    </Portal>
  );
}
