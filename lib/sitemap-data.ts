import { routing } from '@/i18n/routing';
import { blogPosts } from '@/lib/blogs-data';
import { getCanonicalUrl } from '@/lib/canonical';

/** Static path segments under [locale] (no leading/trailing slash). */
export const STATIC_PATHS = [
  '',
  'about-us',
  'contact',
  'blogs',
  'pay-it-forward',
  'privacy-policy',
  'domain-hosting',
  'cookie-policy',
  'terms-and-conditions',
  'services/app-development',
  'services/graphic-design',
  'services/ppc-google-ads-management',
  'services/web-design',
  'services/web-development',
  'services/wordpress-development',
  'services/digital-marketing-services',
  'services/seo',
  'services/social-media-marketing-services',
] as const;

type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

function getSeoMeta(path: string): { priority: number; changeFrequency: ChangeFreq } {
  if (path === '') return { priority: 1.0, changeFrequency: 'weekly' };
  if (path.startsWith('services/')) return { priority: 0.9, changeFrequency: 'monthly' };
  if (['about-us', 'contact', 'pay-it-forward', 'blogs'].includes(path)) return { priority: 0.9, changeFrequency: 'weekly' };
  if (['privacy-policy', 'terms-and-conditions', 'cookie-policy'].includes(path)) return { priority: 0.4, changeFrequency: 'yearly' };
  return { priority: 0.8, changeFrequency: 'monthly' };
}

export interface SitemapEntry {
  url: string;
  path: string;
  locale: string;
  lastMod: string;
  changeFrequency: ChangeFreq;
  priority: number;
}

export function getSitemapEntries(baseUrl?: string): SitemapEntry[] {
  const now = new Date().toISOString();
  const entries: SitemapEntry[] = [];

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      const url = getCanonicalUrl(locale, path, baseUrl);
      const { priority, changeFrequency } = getSeoMeta(path);
      entries.push({ url, path, locale, lastMod: now, changeFrequency, priority });
    }
  }

  for (const post of blogPosts) {
    const path = `blogs/${post.slug}`;
    const { changeFrequency } = getSeoMeta('blogs');
    const priority = 0.8;
    for (const locale of routing.locales) {
      const url = getCanonicalUrl(locale, path, baseUrl);
      entries.push({ url, path, locale, lastMod: now, changeFrequency, priority });
    }
  }

  return entries;
}
