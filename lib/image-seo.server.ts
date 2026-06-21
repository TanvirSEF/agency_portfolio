import 'server-only';

import fs from 'node:fs';
import path from 'node:path';
import { normalizeImagePath, toInlineImageSeo, type ImageSeoEntry } from './image-seo';

type ImageObjectSchema = {
  '@type': 'ImageObject';
  contentUrl: string;
  url: string;
  name?: string;
  caption?: string;
  description?: string;
};

const NON_IMAGE_EXTENSION_PATTERN = /\.(mp4|webm|mov|m4v|avi|mp3|wav|pdf)$/i;
const entriesCache = new Map<'en' | 'sv', ImageSeoEntry[]>();

function readNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function toAbsoluteUrl(pathname: string, baseUrl: string): string {
  if (/^https?:\/\//i.test(pathname)) {
    return pathname;
  }

  const normalizedBaseUrl = baseUrl.replace(/\/$/, '');
  return `${normalizedBaseUrl}${pathname.startsWith('/') ? '' : '/'}${pathname}`;
}

function isLikelyImagePath(value: string): boolean {
  const normalizedPath = normalizeImagePath(value);
  if (!normalizedPath) return false;
  return !NON_IMAGE_EXTENSION_PATTERN.test(normalizedPath);
}

function mergeEntry(map: Map<string, ImageSeoEntry>, src: string, entry?: Partial<ImageSeoEntry>) {
  if (!isLikelyImagePath(src)) return;

  const normalizedPath = normalizeImagePath(src);
  if (!normalizedPath) return;

  const previous = map.get(normalizedPath);
  map.set(normalizedPath, {
    ...previous,
    fileUrl: normalizedPath,
    ...(entry?.altText ? { altText: entry.altText } : {}),
    ...(entry?.title ? { title: entry.title } : {}),
    ...(entry?.caption ? { caption: entry.caption } : {}),
    ...(entry?.description ? { description: entry.description } : {}),
  });
}

function getSiblingSeo(record: Record<string, unknown>, key: string): ImageSeoEntry | undefined {
  const variants = [
    key,
    ...(key.endsWith('Src') ? [key.slice(0, -3)] : []),
    ...(key.endsWith('Path') ? [key.slice(0, -4)] : []),
  ];
  const seo: ImageSeoEntry = {};

  for (const variant of variants) {
    const objectSeo = toInlineImageSeo(record[`${variant}Seo`]);
    if (objectSeo) {
      Object.assign(seo, objectSeo);
    }

    const altText =
      readNonEmptyString(record[`${variant}AltText`]) ??
      readNonEmptyString(record[`${variant}Alt`]);
    const title = readNonEmptyString(record[`${variant}Title`]);
    const caption = readNonEmptyString(record[`${variant}Caption`]);
    const description = readNonEmptyString(record[`${variant}Description`]);

    if (altText) seo.altText = altText;
    if (title) seo.title = title;
    if (caption) seo.caption = caption;
    if (description) seo.description = description;
  }

  return Object.keys(seo).length > 0 ? seo : undefined;
}

function collectLocalImageSeoEntries(value: unknown, map: Map<string, ImageSeoEntry>) {
  if (!value || typeof value !== 'object') return;

  if (Array.isArray(value)) {
    for (const item of value) {
      collectLocalImageSeoEntries(item, map);
    }
    return;
  }

  const record = value as Record<string, unknown>;

  if (typeof record.fileUrl === 'string') {
    mergeEntry(map, record.fileUrl, toInlineImageSeo(record));
  }

  if (typeof record.src === 'string') {
    mergeEntry(map, record.src, toInlineImageSeo(record));
  }

  if (record.images && typeof record.images === 'object' && !Array.isArray(record.images)) {
    for (const [imageKey, imageValue] of Object.entries(record.images as Record<string, unknown>)) {
      if (typeof imageValue !== 'string') continue;
      const parentSeo = toInlineImageSeo(record[imageKey]);
      if (parentSeo) {
        mergeEntry(map, imageValue, parentSeo);
      }
    }
  }

  for (const [key, child] of Object.entries(record)) {
    if (typeof child === 'string') {
      const siblingSeo = getSiblingSeo(record, key);
      if (siblingSeo) {
        mergeEntry(map, child, siblingSeo);
      }
    }

    collectLocalImageSeoEntries(child, map);
  }
}

function getLocaleJsonFiles(rootDirectory: string, locale: 'en' | 'sv'): string[] {
  const files: string[] = [];

  for (const entry of fs.readdirSync(rootDirectory, { withFileTypes: true })) {
    const fullPath = path.join(rootDirectory, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === 'image-seo') continue;
      files.push(...getLocaleJsonFiles(fullPath, locale));
      continue;
    }

    if (entry.isFile() && entry.name === `${locale}.json`) {
      files.push(fullPath);
    }
  }

  return files;
}

function getLocalImageSeoEntries(locale?: string): ImageSeoEntry[] {
  const resolvedLocale: 'en' | 'sv' = locale === 'sv' ? 'sv' : 'en';
  const cached = entriesCache.get(resolvedLocale);
  if (cached) return cached;

  const combined = new Map<string, ImageSeoEntry>();
  const jsonContentRoot = path.join(process.cwd(), 'jsonContent');
  for (const filePath of getLocaleJsonFiles(jsonContentRoot, resolvedLocale)) {
    try {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(fileContents) as unknown;
      collectLocalImageSeoEntries(parsed, combined);
    } catch {
      continue;
    }
  }

  const entries = Array.from(combined.values());
  entriesCache.set(resolvedLocale, entries);
  return entries;
}

export function getImageSeoSchemaGraph(baseUrl: string, locale?: string): ImageObjectSchema[] {
  return getLocalImageSeoEntries(locale).map((entry) => {
    const normalizedPath = normalizeImagePath(entry.fileUrl || '');
    const absoluteUrl = toAbsoluteUrl(normalizedPath, baseUrl);
    const name = entry.title || entry.altText;

    return {
      '@type': 'ImageObject',
      contentUrl: absoluteUrl,
      url: absoluteUrl,
      ...(name ? { name } : {}),
      ...(entry.caption ? { caption: entry.caption } : {}),
      ...(entry.description ? { description: entry.description } : {}),
    };
  });
}
