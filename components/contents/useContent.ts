'use client';

import { contentRegistry, ContentPath } from './contentRegistry';

export function useContent<T = any>(contentPath?: ContentPath, fallback?: T): T {
  if (!contentPath) {
    return (fallback ?? {}) as T;
  }

  const baseContent = contentRegistry[contentPath] ?? fallback ?? {};
  return baseContent as T;
}

export type { ContentPath };
