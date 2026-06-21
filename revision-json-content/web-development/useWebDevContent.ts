"use client";

import { useLocale } from "next-intl";
import enContent from "./en.json";
import svContent from "./sv.json";

export type WebDevContent = typeof enContent;

const contentMap: Record<string, WebDevContent> = {
  en: enContent,
  sv: svContent,
};

export function useWebDevContent(): WebDevContent {
  let locale = "en";
  try {
    locale = useLocale();
  } catch {
    // fallback to English when not inside NextIntlClientProvider
  }
  return contentMap[locale] ?? enContent;
}
