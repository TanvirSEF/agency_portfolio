import enSitemapData from '@/jsonContent/system/sitemap/en.json';
import svSitemapData from '@/jsonContent/system/sitemap/sv.json';
import { getLocalizedPath } from '@/lib/route-slugs';
import { statSync } from 'node:fs';
import path from 'node:path';

export type Locale = 'en' | 'sv';

type SitemapLink = {
  url?: string;
  lastModified?: string;
  changeFrequency?: string;
  priority?: number | string;
};

type SitemapDocument = {
  links?: SitemapLink[];
};

export type RouteContext = {
  params: Promise<{ locale: string }> | { locale: string };
};

export type SitemapEntry = {
  url: string;
  lastModified?: string;
  changeFrequency?: string;
  priority?: string;
};

type SitemapIndexEntry = {
  loc: string;
  lastModified?: string;
};

const SITEMAP_BY_LOCALE: Record<Locale, SitemapDocument> = {
  en: enSitemapData as SitemapDocument,
  sv: svSitemapData as SitemapDocument,
};

const ALLOWED_CHANGE_FREQUENCIES = new Set([
  'always',
  'hourly',
  'daily',
  'weekly',
  'monthly',
  'yearly',
  'never',
]);

export function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

export function resolveSitemapBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://webblymedia.com')
    .replace(/meida\.com/gi, 'media.com')
    .replace(/\/$/, '');
}

export async function resolveLocaleFromContext(context: RouteContext): Promise<Locale | undefined> {
  const params = await context.params;
  return toSupportedLocale(params.locale);
}

function toSupportedLocale(locale: string): Locale | undefined {
  if (locale === 'en' || locale === 'sv') {
    return locale;
  }

  return undefined;
}

function hasLocalePrefix(pathname: string): boolean {
  return pathname === '/en' || pathname.startsWith('/en/') || pathname === '/sv' || pathname.startsWith('/sv/');
}

function normalizeUrl(rawUrl: unknown, baseUrl: string, locale: Locale): string | undefined {
  if (typeof rawUrl !== 'string') {
    return undefined;
  }

  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return undefined;
  }

  const maybeAbsoluteUrl = trimmed.startsWith('http://') || trimmed.startsWith('https://');
  const localePrefix = `/${locale}`;

  const absoluteUrl = maybeAbsoluteUrl
    ? trimmed
    : (() => {
        const normalizedPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
        const localizedPath = hasLocalePrefix(normalizedPath)
          ? normalizedPath
          : `${localePrefix}${normalizedPath === '/' ? '' : normalizedPath}`;
        return `${baseUrl}${localizedPath}`;
      })();

  try {
    return new URL(absoluteUrl).toString();
  } catch {
    return undefined;
  }
}

function normalizeLastModified(rawValue: unknown): string | undefined {
  if (typeof rawValue !== 'string') {
    return undefined;
  }

  const trimmed = rawValue.trim();
  if (!trimmed) {
    return undefined;
  }

  const parsedDate = new Date(trimmed);
  return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate.toISOString();
}

function normalizeChangeFrequency(rawValue: unknown): string | undefined {
  if (typeof rawValue !== 'string') {
    return undefined;
  }

  const normalizedValue = rawValue.trim().toLowerCase();
  return ALLOWED_CHANGE_FREQUENCIES.has(normalizedValue) ? normalizedValue : undefined;
}

function normalizePriority(rawValue: unknown): string | undefined {
  const priorityValue =
    typeof rawValue === 'number'
      ? rawValue
      : typeof rawValue === 'string' && rawValue.trim().length > 0
        ? Number(rawValue)
        : Number.NaN;

  if (!Number.isFinite(priorityValue) || priorityValue < 0 || priorityValue > 1) {
    return undefined;
  }

  return priorityValue.toFixed(1);
}

export function getLocaleSitemapEntries(locale: Locale): SitemapEntry[] {
  const links = SITEMAP_BY_LOCALE[locale]?.links;
  if (!Array.isArray(links)) {
    return [];
  }

  const baseUrl = resolveSitemapBaseUrl();
  const fallbackLastModified = getLocaleSitemapLastModified(locale);
  const entries: SitemapEntry[] = [];

  for (const link of links) {
    const url = normalizeUrl(link?.url, baseUrl, locale);
    if (!url) {
      continue;
    }

    const lastModified = normalizeLastModified(link?.lastModified) ?? fallbackLastModified;
    const changeFrequency = normalizeChangeFrequency(link?.changeFrequency);
    const priority = normalizePriority(link?.priority);

    entries.push({
      url,
      lastModified,
      ...(changeFrequency ? { changeFrequency } : {}),
      ...(priority ? { priority } : {}),
    });
  }

  return entries;
}

function getLocaleSitemapLastModified(locale: Locale): string {
  try {
    const sourcePath = path.join(process.cwd(), 'jsonContent', 'system', 'sitemap', `${locale}.json`);
    return statSync(sourcePath).mtime.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export function splitLocaleSitemapEntries(locale: Locale): {
  pageEntries: SitemapEntry[];
  blogEntries: SitemapEntry[];
} {
  const entries = getLocaleSitemapEntries(locale);
  const localizedBlogsSlug = getLocalizedPath(locale, 'blogs');
  const blogListingPath = `/${locale}/${localizedBlogsSlug}`.replace(/\/$/, '');
  const blogPostPrefix = `${blogListingPath}/`;

  const pageEntries: SitemapEntry[] = [];
  const blogEntries: SitemapEntry[] = [];

  for (const entry of entries) {
    try {
      const pathname = new URL(entry.url).pathname.replace(/\/$/, '');
      if (pathname.startsWith(blogPostPrefix)) {
        blogEntries.push(entry);
      } else {
        pageEntries.push(entry);
      }
    } catch {
      pageEntries.push(entry);
    }
  }

  return { pageEntries, blogEntries };
}

export function getLatestLastModified(entries: SitemapEntry[]): string {
  const timestamps = entries
    .map((entry) => entry.lastModified)
    .filter((value): value is string => typeof value === 'string')
    .map((value) => Date.parse(value))
    .filter((value) => Number.isFinite(value));

  if (timestamps.length === 0) {
    return new Date().toISOString();
  }

  return new Date(Math.max(...timestamps)).toISOString();
}

export function buildUrlSetXml(entries: SitemapEntry[]): string {
  const xslHref = '/sitemap.xsl';
  const urlElements = entries
    .map((entry) => {
      const optionalTags: string[] = [];

      if (entry.lastModified) {
        optionalTags.push(`    <lastmod>${escapeXml(entry.lastModified)}</lastmod>`);
      }

      if (entry.changeFrequency) {
        optionalTags.push(`    <changefreq>${escapeXml(entry.changeFrequency)}</changefreq>`);
      }

      if (entry.priority) {
        optionalTags.push(`    <priority>${escapeXml(entry.priority)}</priority>`);
      }

      const optionalXml = optionalTags.length > 0 ? `\n${optionalTags.join('\n')}` : '';

      return `  <url>
    <loc>${escapeXml(entry.url)}</loc>${optionalXml}
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${escapeXml(xslHref)}"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

export function buildSitemapIndexXml(entries: SitemapIndexEntry[]): string {
  const xslHref = '/sitemap.xsl';
  const sitemapElements = entries
    .map((entry) => {
      const optionalLastModified = entry.lastModified
        ? `\n    <lastmod>${escapeXml(entry.lastModified)}</lastmod>`
        : '';

      return `  <sitemap>
    <loc>${escapeXml(entry.loc)}</loc>${optionalLastModified}
  </sitemap>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${escapeXml(xslHref)}"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapElements}
</sitemapindex>`;
}
