import enContent from "./en.json";

export type WebDevContent = typeof enContent;

export function useWebDevContent(): WebDevContent {
  return enContent;
}
