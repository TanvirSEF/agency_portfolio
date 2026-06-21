'use client';

import { useLocale, useMessages } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import { getCanonicalPathFromLocalizedPath, normalizeRoutePath } from '@/lib/route-slugs';

type RouteMetadataEntry = {
  path?: unknown;
  schemaMarkupCode?: unknown;
};

function asNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function looksLikeHtml(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

function tryNormalizeJsonMarkup(value: string): string | undefined {
  const trimmed = value.trim();

  if (!(trimmed.startsWith('{') || trimmed.startsWith('['))) {
    return undefined;
  }

  try {
    return JSON.stringify(JSON.parse(trimmed));
  } catch {
    return undefined;
  }
}

function collectRouteMetadataEntries(messages: Record<string, unknown>): RouteMetadataEntry[] {
  const entries: RouteMetadataEntry[] = [];

  for (const namespaceValue of Object.values(messages)) {
    if (!namespaceValue || typeof namespaceValue !== 'object') {
      continue;
    }

    const pageMetadata = (namespaceValue as Record<string, unknown>).pageMetadata;
    if (!pageMetadata || typeof pageMetadata !== 'object') {
      continue;
    }

    const routeMetadata = (pageMetadata as Record<string, unknown>).routeMetadata;
    if (!Array.isArray(routeMetadata)) {
      continue;
    }

    for (const item of routeMetadata) {
      if (item && typeof item === 'object') {
        entries.push(item as RouteMetadataEntry);
      }
    }
  }

  return entries;
}

function resolveRouteSchemaMarkup(
  entries: RouteMetadataEntry[],
  canonicalPath: string
): string | undefined {
  for (const entry of entries) {
    const entryPath = asNonEmptyString(entry.path);
    if (!entryPath) {
      continue;
    }

    if (normalizeRoutePath(entryPath) !== canonicalPath) {
      continue;
    }

    const schemaMarkupCode = asNonEmptyString(entry.schemaMarkupCode);
    if (schemaMarkupCode) {
      return schemaMarkupCode;
    }
  }

  return undefined;
}

function resolveBlogPostSchemaMarkup(
  messages: Record<string, unknown>,
  canonicalPath: string
): string | undefined {
  if (!canonicalPath.startsWith('blogs/')) {
    return undefined;
  }

  const slug = canonicalPath.slice('blogs/'.length);
  if (!slug) {
    return undefined;
  }

  const blogsNamespace = messages.blogs;
  if (!blogsNamespace || typeof blogsNamespace !== 'object') {
    return undefined;
  }

  const posts = (blogsNamespace as Record<string, unknown>).posts;
  if (!posts || typeof posts !== 'object') {
    return undefined;
  }

  const post = (posts as Record<string, unknown>)[slug];
  if (!post || typeof post !== 'object') {
    return undefined;
  }

  return asNonEmptyString((post as Record<string, unknown>).schemaMarkupCode);
}

export default function RouteSchemaMarkup() {
  const locale = useLocale();
  const pathname = usePathname();
  const messages = useMessages() as Record<string, unknown>;

  const normalizedPathname = normalizeRoutePath((pathname ?? '/').replace(/^\/(en|sv)(?=\/|$)/, ''));
  const canonicalPath = getCanonicalPathFromLocalizedPath(locale, normalizedPathname);
  const routeEntries = collectRouteMetadataEntries(messages);
  const schemaMarkupCode =
    resolveBlogPostSchemaMarkup(messages, canonicalPath) ??
    resolveRouteSchemaMarkup(routeEntries, canonicalPath);

  if (!schemaMarkupCode) {
    return null;
  }

  const normalizedJsonMarkup = tryNormalizeJsonMarkup(schemaMarkupCode);
  if (normalizedJsonMarkup) {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: normalizedJsonMarkup }}
      />
    );
  }

  if (!looksLikeHtml(schemaMarkupCode)) {
    return null;
  }

  return (
    <div
      data-page-schema-markup=""
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: schemaMarkupCode }}
    />
  );
}
