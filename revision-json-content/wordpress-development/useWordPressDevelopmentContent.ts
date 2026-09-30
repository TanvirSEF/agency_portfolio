import enContent from "./en.json";

export type WordPressDevelopmentContent = typeof enContent;

export function useWordPressDevelopmentContent(): WordPressDevelopmentContent {
  return enContent;
}
