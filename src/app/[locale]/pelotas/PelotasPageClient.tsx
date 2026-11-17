"use client";

import type { SlimGearItem } from "@/lib/gearList";
import GearListClient from "@/components/GearListClient";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function PelotasPageClient({ items }: { items: SlimGearItem[] }) {
  const { t } = useLanguage();
  return (
    <GearListClient
      items={items}
      basePath="pelotas"
      pageTitle={t.pelotas.pageTitle}
      pageSubtitle={t.pelotas.pageSubtitle}
    />
  );
}
