"use client";

import { useLocale } from "next-intl";
import enContent from "./en.json";
import svContent from "./sv.json";

export type WebDesignContent = typeof enContent;

const contentMap: Record<string, WebDesignContent> = {
  en: enContent,
  sv: svContent,
};

export function useWebDesignContent(): WebDesignContent {
  let locale = "en";
  try {
    locale = useLocale();
  } catch {
    // fallback to English when not inside NextIntlClientProvider
  }
  return contentMap[locale] ?? enContent;
}
