"use client";

import type { SlimGearItem } from "@/lib/gearList";
import GearListClient from "@/components/GearListClient";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function GuantesPageClient({ items }: { items: SlimGearItem[] }) {
  const { t } = useLanguage();
  return (
    <GearListClient
      items={items}
      basePath="guantes"
      pageTitle={t.guantes.pageTitle}
      pageSubtitle={t.guantes.pageSubtitle}
    />
  );
}
