import enContent from "./en.json";

export type WebDesignContent = typeof enContent;

export function useWebDesignContent(): WebDesignContent {
  return enContent;
}
