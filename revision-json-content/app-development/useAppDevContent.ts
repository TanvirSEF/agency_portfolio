"use client";

import { useLocale } from "next-intl";
import enContent from "./en.json";
import svContent from "./sv.json";

export type AppDevContent = typeof enContent;

const contentMap: Record<string, AppDevContent> = {
  en: enContent,
  sv: svContent,
};

export function useAppDevContent(): AppDevContent {
  let locale = "en";
  try {
    locale = useLocale();
  } catch {
    // fallback to English when not inside NextIntlClientProvider
  }
  return contentMap[locale] ?? enContent;
}
