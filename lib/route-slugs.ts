import {
  CMS_ROUTE_METADATA_BY_LOCALE,
  CMS_ROUTE_SLUGS_BY_LOCALE,
  type CmsRouteSlugEntry,
  type SupportedLocale,
} from '@/lib/page-route-metadata';

const SUPPORTED_LOCALES: SupportedLocale[] = ['en', 'sv'];
const PREFIX_ONLY_DEFAULT_PATHS = ['services'];

export function normalizeRoutePath(path: string): string {
  return path.replace(/^\//, '').replace(/\/$/, '').split('?')[0].split('#')[0];
}

function toSupportedLocale(locale: string): SupportedLocale {
  return locale === 'sv' ? 'sv' : 'en';
}

function collectDefaultPaths(locale: SupportedLocale): string[] {
  const paths = new Set<string>(['', ...PREFIX_ONLY_DEFAULT_PATHS]);

  for (const entry of CMS_ROUTE_METADATA_BY_LOCALE[locale]) {
    if (!entry || typeof entry.path !== 'string') continue;
    paths.add(normalizeRoutePath(entry.path));
  }

  return Array.from(paths);
}

function collectRouteSlugEntries(locale: SupportedLocale): CmsRouteSlugEntry[] {
  return CMS_ROUTE_SLUGS_BY_LOCALE[locale];
}

function getCanonicalPathOrder(): string[] {
  const canonicalPaths = new Set<string>();

  // English routeSlugs order is the canonical route order baseline.
  for (const entry of collectRouteSlugEntries('en')) {
    if (!entry || typeof entry.path !== 'string') continue;
    canonicalPaths.add(normalizeRoutePath(entry.path));
  }

  // Fallback from metadata paths/prefixes in case a route exists there but not in routeSlugs.
  for (const path of collectDefaultPaths('en')) {
    canonicalPaths.add(path);
  }

  return Array.from(canonicalPaths);
}

const CANONICAL_PATH_ORDER = getCanonicalPathOrder();
const CANONICAL_PATH_SET = new Set(CANONICAL_PATH_ORDER);

function buildForwardMap(locale: SupportedLocale): Record<string, string> {
  const map: Record<string, string> = {};
  const localeEntries = collectRouteSlugEntries(locale);

  // Identity defaults on canonical route keys.
  for (const path of CANONICAL_PATH_ORDER) {
    map[path] = path;
  }

  // Primary: direct canonical path matches (backward compatible).
  for (const entry of localeEntries) {
    if (!entry || typeof entry.path !== 'string') continue;
    const path = normalizeRoutePath(entry.path);
    if (path === '') {
      map[''] = '';
      continue;
    }

    const fallback = path;
    const slug = normalizeRoutePath(typeof entry.slug === 'string' ? entry.slug : fallback);
    if (!slug) continue;
    if (CANONICAL_PATH_SET.has(path)) {
      map[path] = slug;
    }
  }

  map[''] = '';
  return map;
}

function invertMap(forwardMap: Record<string, string>): Record<string, string> {
  const reversed: Record<string, string> = {};
  for (const [canonicalPath, localizedPath] of Object.entries(forwardMap)) {
    reversed[localizedPath] = canonicalPath;
  }
  return reversed;
}

function resolveMappedPath(value: string, map: Record<string, string>): string | undefined {
  if (Object.prototype.hasOwnProperty.call(map, value)) {
    return map[value];
  }

  let bestSourcePrefix = '';
  let bestTargetPrefix: string | undefined;

  for (const [sourcePrefix, targetPrefix] of Object.entries(map)) {
    if (!sourcePrefix) continue;
    if (!value.startsWith(`${sourcePrefix}/`)) continue;

    if (sourcePrefix.length > bestSourcePrefix.length) {
      bestSourcePrefix = sourcePrefix;
      bestTargetPrefix = targetPrefix;
    }
  }

  if (!bestTargetPrefix) return undefined;
  const remainder = value.slice(bestSourcePrefix.length);
  return `${bestTargetPrefix}${remainder}`;
}

const FORWARD_ROUTE_SLUG_MAP: Record<SupportedLocale, Record<string, string>> = {
  en: buildForwardMap('en'),
  sv: buildForwardMap('sv'),
};

const REVERSE_ROUTE_SLUG_MAP: Record<SupportedLocale, Record<string, string>> = {
  en: invertMap(FORWARD_ROUTE_SLUG_MAP.en),
  sv: invertMap(FORWARD_ROUTE_SLUG_MAP.sv),
};

export function getLocalizedPath(locale: string, canonicalPath: string): string {
  const normalizedCanonicalPath = normalizeRoutePath(canonicalPath);
  const localeMap = FORWARD_ROUTE_SLUG_MAP[toSupportedLocale(locale)];
  return resolveMappedPath(normalizedCanonicalPath, localeMap) ?? normalizedCanonicalPath;
}

function resolveCanonicalPathFromAnyLocale(localizedPath: string): string | undefined {
  for (const locale of SUPPORTED_LOCALES) {
    const match = resolveMappedPath(localizedPath, REVERSE_ROUTE_SLUG_MAP[locale]);
    if (match) return match;
  }
  return undefined;
}

export function getCanonicalPathFromLocalizedPath(locale: string, localizedPath: string): string {
  const normalizedLocalizedPath = normalizeRoutePath(localizedPath);
  const localeMap = REVERSE_ROUTE_SLUG_MAP[toSupportedLocale(locale)];
  const currentLocaleMatch = resolveMappedPath(normalizedLocalizedPath, localeMap);
  if (currentLocaleMatch) return currentLocaleMatch;

  // Fallback helps cross-locale switching when the previous locale slug
  // is still in the URL (e.g. /sv/about -> /sv/om-oss).
  return resolveCanonicalPathFromAnyLocale(normalizedLocalizedPath) ?? normalizedLocalizedPath;
}

export function getLocalizedPathname(locale: string, canonicalPath: string): string {
  const localizedPath = getLocalizedPath(locale, canonicalPath);
  return localizedPath ? `/${locale}/${localizedPath}` : `/${locale}`;
}
