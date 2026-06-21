import aboutUsEn from '@/jsonContent/about-us/en.json';
import aboutUsSv from '@/jsonContent/about-us/sv.json';
import appDevelopmentEn from '@/jsonContent/app-development/en.json';
import appDevelopmentSv from '@/jsonContent/app-development/sv.json';
import blogsEn from '@/jsonContent/blogs/en.json';
import blogsSv from '@/jsonContent/blogs/sv.json';
import contactEn from '@/jsonContent/contact/en.json';
import contactSv from '@/jsonContent/contact/sv.json';
import cookiePolicyEn from '@/jsonContent/cookie-policy/en.json';
import cookiePolicySv from '@/jsonContent/cookie-policy/sv.json';
import digitalMarketingServicesEn from '@/jsonContent/digital-marketing-services/en.json';
import digitalMarketingServicesSv from '@/jsonContent/digital-marketing-services/sv.json';
import graphicDesignEn from '@/jsonContent/graphic-design/en.json';
import graphicDesignSv from '@/jsonContent/graphic-design/sv.json';
import landingEn from '@/jsonContent/landing/en.json';
import landingSv from '@/jsonContent/landing/sv.json';
import payItForwardEn from '@/jsonContent/pay-it-forward/en.json';
import payItForwardSv from '@/jsonContent/pay-it-forward/sv.json';
import ppcGoogleAdsManagementEn from '@/jsonContent/ppc-google-ads-management/en.json';
import ppcGoogleAdsManagementSv from '@/jsonContent/ppc-google-ads-management/sv.json';
import privacyPolicyEn from '@/jsonContent/privacy-policy/en.json';
import privacyPolicySv from '@/jsonContent/privacy-policy/sv.json';
import seoEn from '@/jsonContent/seo/en.json';
import seoSv from '@/jsonContent/seo/sv.json';
import socialMediaMarketingServicesEn from '@/jsonContent/social-media-marketing-services/en.json';
import socialMediaMarketingServicesSv from '@/jsonContent/social-media-marketing-services/sv.json';
import termsAndConditionsEn from '@/jsonContent/terms-and-conditions/en.json';
import termsAndConditionsSv from '@/jsonContent/terms-and-conditions/sv.json';
import webDesignEn from '@/jsonContent/web-design/en.json';
import webDesignSv from '@/jsonContent/web-design/sv.json';
import webDevelopmentEn from '@/jsonContent/web-development/en.json';
import webDevelopmentSv from '@/jsonContent/web-development/sv.json';
import wordpressDevelopmentEn from '@/jsonContent/wordpress-development/en.json';
import wordpressDevelopmentSv from '@/jsonContent/wordpress-development/sv.json';

export type SupportedLocale = 'en' | 'sv';

export type CmsRouteSlugEntry = {
  path?: string;
  slug?: string;
};

export type CmsRouteMetadataEntry = {
  path?: string;
  title?: string;
  description?: string;
};

type PageRouteMetadataDocument = {
  pageMetadata?: {
    routeSlugs?: CmsRouteSlugEntry[];
    routeMetadata?: CmsRouteMetadataEntry[];
  };
};

const PAGE_ROUTE_METADATA_DOCS_BY_LOCALE: Record<SupportedLocale, PageRouteMetadataDocument[]> = {
  en: [
    landingEn,
    aboutUsEn,
    appDevelopmentEn,
    blogsEn,
    contactEn,
    payItForwardEn,
    privacyPolicyEn,
    cookiePolicyEn,
    termsAndConditionsEn,
    seoEn,
    socialMediaMarketingServicesEn,
    digitalMarketingServicesEn,
    ppcGoogleAdsManagementEn,
    graphicDesignEn,
    webDesignEn,
    webDevelopmentEn,
    wordpressDevelopmentEn,
  ],
  sv: [
    landingSv,
    aboutUsSv,
    appDevelopmentSv,
    blogsSv,
    contactSv,
    payItForwardSv,
    privacyPolicySv,
    cookiePolicySv,
    termsAndConditionsSv,
    seoSv,
    socialMediaMarketingServicesSv,
    digitalMarketingServicesSv,
    ppcGoogleAdsManagementSv,
    graphicDesignSv,
    webDesignSv,
    webDevelopmentSv,
    wordpressDevelopmentSv,
  ],
};

function normalizePath(path: string): string {
  return path.replace(/^\//, '').replace(/\/$/, '').split('?')[0].split('#')[0];
}

const LEGACY_SERVICE_PATHS = new Set([
  'app-development',
  'digital-marketing-services',
  'graphic-design',
  'ppc-google-ads-management',
  'seo',
  'social-media-marketing-services',
  'web-design',
  'web-development',
  'wordpress-development',
]);

function asNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function collectRouteSlugs(documents: PageRouteMetadataDocument[]): CmsRouteSlugEntry[] {
  const routeSlugs: CmsRouteSlugEntry[] = [];
  const seenPaths = new Set<string>();

  for (const document of documents) {
    const entries = document.pageMetadata?.routeSlugs;
    if (!Array.isArray(entries)) continue;

    for (const entry of entries) {
      if (!entry || typeof entry.path !== 'string') continue;
      const path = normalizePath(entry.path);
      if (LEGACY_SERVICE_PATHS.has(path)) continue;
      if (seenPaths.has(path)) continue;

      const slug = normalizePath(
        typeof entry.slug === 'string' ? entry.slug : entry.path
      );

      seenPaths.add(path);
      routeSlugs.push({ path, slug });
    }
  }

  return routeSlugs;
}

function collectRouteMetadata(documents: PageRouteMetadataDocument[]): CmsRouteMetadataEntry[] {
  const routeMetadata: CmsRouteMetadataEntry[] = [];
  const indexByPath = new Map<string, number>();

  for (const document of documents) {
    const entries = document.pageMetadata?.routeMetadata;
    if (!Array.isArray(entries)) continue;

    for (const entry of entries) {
      if (!entry || typeof entry.path !== 'string') continue;

      const path = normalizePath(entry.path);
      if (LEGACY_SERVICE_PATHS.has(path)) continue;
      const title = asNonEmptyString(entry.title);
      const description = asNonEmptyString(entry.description);

      if (!title && !description) continue;

      const existingIndex = indexByPath.get(path);
      if (typeof existingIndex === 'number') {
        const existing = routeMetadata[existingIndex];
        routeMetadata[existingIndex] = {
          path,
          title: existing.title ?? title,
          description: existing.description ?? description,
        };
        continue;
      }

      routeMetadata.push({
        path,
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),
      });
      indexByPath.set(path, routeMetadata.length - 1);
    }
  }

  return routeMetadata;
}

export const CMS_ROUTE_SLUGS_BY_LOCALE: Record<SupportedLocale, CmsRouteSlugEntry[]> = {
  en: collectRouteSlugs(PAGE_ROUTE_METADATA_DOCS_BY_LOCALE.en),
  sv: collectRouteSlugs(PAGE_ROUTE_METADATA_DOCS_BY_LOCALE.sv),
};

export const CMS_ROUTE_METADATA_BY_LOCALE: Record<SupportedLocale, CmsRouteMetadataEntry[]> = {
  en: collectRouteMetadata(PAGE_ROUTE_METADATA_DOCS_BY_LOCALE.en),
  sv: collectRouteMetadata(PAGE_ROUTE_METADATA_DOCS_BY_LOCALE.sv),
};
