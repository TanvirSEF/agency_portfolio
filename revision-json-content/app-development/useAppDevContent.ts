import enContent from "./en.json";

export type AppDevContent = typeof enContent;

export function useAppDevContent(): AppDevContent {
  return enContent;
}
