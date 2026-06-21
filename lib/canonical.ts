import type { Metadata } from 'next';
import { richTextToPlainText } from '@/components/common/RichTextContent';
import { routing } from '@/i18n/routing';
import {
  CMS_ROUTE_METADATA_BY_LOCALE,
  type CmsRouteMetadataEntry,
} from '@/lib/page-route-metadata';
import { getLocalizedPath } from '@/lib/route-slugs';

function normalizeSiteUrl(value: string): string {
  return value.replace(/meida\.com/gi, 'media.com').replace(/\/$/, '');
}

const BASE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://webblymedia.com');
const BRAND_NAME = 'Webbly Media';

/**
 * App locale (URL segment) -> BCP 47 hreflang code for language-region targeting.
 * Matches html lang and SEO alternates.
 */
export const LOCALE_TO_HREFLANG: Record<string, string> = {
  en: 'en-GB',
  sv: 'sv-SE',
};

/** x-default points to default locale (fallback for unmatched language/region). */
const DEFAULT_LOCALE = routing.defaultLocale as string;
type SeoLocale = 'en' | 'sv';

type RouteSeoMetadata = {
  title: string;
  description: string;
};

const ROUTE_SEO_METADATA: Record<SeoLocale, Record<string, RouteSeoMetadata>> = {
  en: {
    '': {
      title: 'Digital Marketing & Web Development | Webbly Media',
      description:
        'Webbly Media helps brands grow with web design, web development, SEO, PPC, social media, and creative digital marketing built for results.',
    },
    'about-us': {
      title: 'About Webbly Media | Digital Growth Experts',
      description:
        'Learn about Webbly Media, our team, and our mission to deliver measurable growth through web, SEO, paid ads, and brand-focused marketing.',
    },
    'contact': {
      title: 'Contact Webbly Media | Start Your Project',
      description:
        'Contact Webbly Media to discuss web design, development, SEO, PPC, and digital marketing services. Share your goals and get a tailored plan.',
    },
    'privacy-policy': {
      title: 'Privacy Policy | Webbly Media',
      description:
        "Read Webbly Media's Privacy Policy to understand how we collect, use, and protect your personal information across our website and services.",
    },
    'terms-and-conditions': {
      title: 'Terms and Conditions | Webbly Media',
      description:
        "Review Webbly Media's Terms and Conditions for website usage, service policies, and legal responsibilities for clients and visitors.",
    },
    'cookie-policy': {
      title: 'Cookie Policy | Webbly Media',
      description:
        "Read Webbly Media's Cookie Policy to learn how cookies and similar technologies are used to improve site performance, analytics, and user experience.",
    },
    'pay-it-forward': {
      title: 'Pay It Forward Initiative | Webbly Media',
      description:
        "Explore Webbly Media's Pay It Forward initiative and see how we support communities through practical digital help, collaboration, and meaningful impact.",
    },
    'domain-hosting': {
      title: 'Domain & Hosting Services | Webbly Media',
      description:
        'Secure reliable domain and hosting solutions with Webbly Media to keep your website fast, stable, and ready to scale with your business.',
    },
    'seo': {
      title: 'SEO Services for Business Growth | Webbly Media',
      description:
        'Improve rankings, traffic, and qualified leads with Webbly Media SEO services, including technical SEO, on-page optimization, and content strategy.',
    },
    'web-design': {
      title: 'Web Design Services | Webbly Media',
      description:
        'Get conversion-focused web design from Webbly Media with responsive layouts, clear UX, and brand-aligned visuals built to drive business results.',
    },
    'web-development': {
      title: 'Web Development Services | Webbly Media',
      description:
        'Build fast, scalable websites with Webbly Media web development services, tailored to your business goals, user needs, and long-term growth.',
    },
    'app-development': {
      title: 'App Development Services | Webbly Media',
      description:
        'Launch reliable, user-focused apps with Webbly Media app development services, from planning and UI to deployment and performance optimization.',
    },
    'digital-marketing-services': {
      title: 'Digital Marketing Services | Webbly Media',
      description:
        'Grow faster with Webbly Media digital marketing services, including SEO, PPC, social media, and data-driven campaigns designed to increase revenue.',
    },
    'ppc-google-ads-management': {
      title: 'Google Ads Management Services | Webbly Media',
      description:
        'Drive qualified leads with Webbly Media Google Ads management, including campaign setup, keyword strategy, ad optimization, and conversion tracking.',
    },
    'social-media-marketing-services': {
      title: 'Social Media Marketing Services | Webbly Media',
      description:
        'Build audience, engagement, and sales with Webbly Media social media marketing services, including strategy, content, paid amplification, and reporting.',
    },
    'graphic-design': {
      title: 'Graphic Design Services | Webbly Media',
      description:
        'Strengthen your brand with Webbly Media graphic design services for social media, web assets, and marketing materials that stay visually consistent.',
    },
    'wordpress-development': {
      title: 'WordPress Development Services | Webbly Media',
      description:
        'Get custom WordPress development from Webbly Media with performance-focused builds, flexible CMS workflows, and support for ongoing growth.',
    },
    'blogs': {
      title: 'Digital Marketing & Web Design Blog | Webbly Media',
      description:
        'Read Webbly Media blog articles on SEO, web design, development, PPC, and social media to attract qualified traffic and convert more customers.',
    },
    'services/web-design': {
      title: 'Custom Web Design Agency Services | Webbly Media',
      description:
        'Discover Webbly Media web design agency services focused on usability, conversion performance, and brand consistency across every device.',
    },
    'services/web-development': {
      title: 'Web Development Agency Services | Webbly Media',
      description:
        'Explore Webbly Media web development agency services for high-performance websites, custom functionality, and scalable technical implementation.',
    },
    'services/app-development': {
      title: 'Custom App Development Agency | Webbly Media',
      description:
        'Explore Webbly Media app development agency services for tailored mobile and web applications that support user growth and business efficiency.',
    },
    'services/digital-marketing-services': {
      title: 'Digital Marketing Agency Services | Webbly Media',
      description:
        'Explore Webbly Media digital marketing agency services for SEO, PPC, social media, and conversion-focused campaigns tailored to your goals.',
    },
    'services/seo': {
      title: 'SEO Agency Services | Webbly Media',
      description:
        'Explore Webbly Media SEO agency services covering technical audits, keyword planning, content optimization, and long-term organic growth.',
    },
    'services/social-media-marketing-services': {
      title: 'Social Media Marketing Agency | Webbly Media',
      description:
        'Explore Webbly Media social media agency services for strategic planning, content execution, paid promotion, and measurable engagement growth.',
    },
    'services/ppc-google-ads-management': {
      title: 'PPC & Google Ads Agency Services | Webbly Media',
      description:
        'Explore Webbly Media PPC and Google Ads agency services for campaign strategy, ad optimization, budget control, and better lead quality.',
    },
    'services/graphic-design': {
      title: 'Graphic Design Agency Services | Webbly Media',
      description:
        'Explore Webbly Media graphic design agency services for branding assets, campaign creatives, and consistent visual communication across channels.',
    },
    'services/wordpress-development': {
      title: 'WordPress Agency Development Services | Webbly Media',
      description:
        'Explore Webbly Media WordPress agency development services for custom builds, performance tuning, and scalable CMS solutions for growing teams.',
    },
  },
  sv: {
    '': {
      title: 'Digital marknadsforing och webbutveckling | Webbly Media',
      description:
        'Webbly Media hjalper foretag att vaxa med webbdesign, webbutveckling, SEO, PPC och sociala medier med fokus pa matbara affarsresultat.',
    },
    'about-us': {
      title: 'Om Webbly Media | Experter pa digital tillvaxt',
      description:
        'Las mer om Webbly Media, vart team och var mission att skapa matbar tillvaxt genom webb, SEO, annonsering och strategisk marknadsforing.',
    },
    'contact': {
      title: 'Kontakta Webbly Media | Starta ditt projekt',
      description:
        'Kontakta Webbly Media for webbdesign, webbutveckling, SEO, PPC och digital marknadsforing. Beratta om dina mal och fa en skraddarsydd plan.',
    },
    'privacy-policy': {
      title: 'Integritetspolicy | Webbly Media',
      description:
        'Las Webbly Medias integritetspolicy for att forsta hur vi samlar in, anvander och skyddar personuppgifter pa webbplatsen och i vara tjanster.',
    },
    'terms-and-conditions': {
      title: 'Anvandarvillkor | Webbly Media',
      description:
        'Las Webbly Medias anvandarvillkor om webbplatsanvandning, tjanstevillkor och juridiska ansvar for kunder och besokare.',
    },
    'cookie-policy': {
      title: 'Cookiepolicy | Webbly Media',
      description:
        'Las Webbly Medias cookiepolicy och se hur cookies och liknande teknik anvands for prestanda, analys och en battre anvandarupplevelse.',
    },
    'pay-it-forward': {
      title: 'Pay It Forward-initiativ | Webbly Media',
      description:
        'Upptack Webbly Medias Pay It Forward-initiativ och hur vi stottar samhallen med praktisk digital hjalp, samarbete och verklig effekt.',
    },
    'domain-hosting': {
      title: 'Doman och hostingtjanster | Webbly Media',
      description:
        'Sakra tillforlitliga doman- och hostinglosningar med Webbly Media for en snabb, stabil och skalbar webbplats.',
    },
    'seo': {
      title: 'SEO-tjanster for tillvaxt | Webbly Media',
      description:
        'Forbattra synlighet, trafik och kvalificerade leads med Webbly Medias SEO-tjanster inom teknik, on-page-optimering och innehallsstrategi.',
    },
    'web-design': {
      title: 'Webbdesigntjanster | Webbly Media',
      description:
        'Fa konverteringsfokuserad webbdesign fran Webbly Media med responsiv layout, tydlig UX och varumarkesanpassad design som driver resultat.',
    },
    'web-development': {
      title: 'Webbutvecklingstjanster | Webbly Media',
      description:
        'Bygg snabba och skalbara webbplatser med Webbly Medias webbutvecklingstjanster anpassade efter era mal, anvandarbehov och framtida tillvaxt.',
    },
    'app-development': {
      title: 'Apputvecklingstjanster | Webbly Media',
      description:
        'Lansera tillforlitliga appar med Webbly Medias apputvecklingstjanster, fran planering och UI till publicering och prestandaoptimering.',
    },
    'digital-marketing-services': {
      title: 'Digital marknadsforingstjanster | Webbly Media',
      description:
        'Vax snabbare med Webbly Medias digitala marknadsforingstjanster inom SEO, PPC, sociala medier och datadrivna kampanjer.',
    },
    'ppc-google-ads-management': {
      title: 'Google Ads-hantering | Webbly Media',
      description:
        'Fa fler kvalificerade leads med Webbly Medias Google Ads-hantering, inklusive kampanjstruktur, sokordsstrategi och konverteringssporing.',
    },
    'social-media-marketing-services': {
      title: 'Sociala medier-marknadsforing | Webbly Media',
      description:
        'Bygg varumarke, engagemang och forsaljning med Webbly Medias tjanster inom sociala medier med strategi, innehall och annonsering.',
    },
    'graphic-design': {
      title: 'Grafisk design-tjanster | Webbly Media',
      description:
        'Stark ert varumarke med Webbly Medias grafiska design for sociala medier, webbmaterial och kampanjer med visuell konsekvens.',
    },
    'wordpress-development': {
      title: 'WordPress-utveckling | Webbly Media',
      description:
        'Fa skraddarsydd WordPress-utveckling fran Webbly Media med prestandafokuserade byggen, flexibla CMS-floden och langsiktigt stod.',
    },
    'blogs': {
      title: 'Blogg om digital tillvaxt | Webbly Media',
      description:
        'Las Webbly Medias blogg om SEO, webbdesign, webbutveckling, PPC och sociala medier for att oka trafik och fa fler konverteringar.',
    },
    'services/web-design': {
      title: 'Webbdesignbyra tjanster | Webbly Media',
      description:
        'Upptack Webbly Medias webbdesignbyra med fokus pa anvandbarhet, konvertering och ett starkt varumarke pa alla enheter.',
    },
    'services/web-development': {
      title: 'Webbutvecklingsbyra tjanster | Webbly Media',
      description:
        'Upptack Webbly Medias webbutvecklingsbyra for hog prestanda, specialfunktioner och skalbar teknisk implementation.',
    },
    'services/app-development': {
      title: 'Apputvecklingsbyra | Webbly Media',
      description:
        'Upptack Webbly Medias apputvecklingsbyra for skraddarsydda appar som stoder anvandartillvaxt och effektivare affarsprocesser.',
    },
    'services/digital-marketing-services': {
      title: 'Digital marknadsforingsbyra | Webbly Media',
      description:
        'Upptack Webbly Medias digitala marknadsforingsbyra for SEO, PPC, sociala medier och konverteringsfokuserade kampanjer.',
    },
    'services/seo': {
      title: 'SEO-byra tjanster | Webbly Media',
      description:
        'Upptack Webbly Medias SEO-byra med tekniska analyser, sokordsstrategi, innehallsoptimering och langsiktig organisk tillvaxt.',
    },
    'services/social-media-marketing-services': {
      title: 'Sociala medier-byra | Webbly Media',
      description:
        'Upptack Webbly Medias sociala medier-byra for strategi, innehallsproduktion, annonsering och matbar engagemangstillvaxt.',
    },
    'services/ppc-google-ads-management': {
      title: 'PPC och Google Ads-byra | Webbly Media',
      description:
        'Upptack Webbly Medias PPC- och Google Ads-byra for smart budgetstyrning, lopande optimering och battre leadkvalitet.',
    },
    'services/graphic-design': {
      title: 'Grafisk designbyra tjanster | Webbly Media',
      description:
        'Upptack Webbly Medias grafiska designbyra for varumarkesmaterial, kampanjkreativt innehall och visuell tydlighet i alla kanaler.',
    },
    'services/wordpress-development': {
      title: 'WordPress-byra utveckling | Webbly Media',
      description:
        'Upptack Webbly Medias WordPress-byra for skraddarsydd utveckling, prestandaoptimering och skalbara CMS-losningar.',
    },
  },
};

/**
 * Normalize path: no leading/trailing slash, no query/hash.
 */
function normalizePath(path: string): string {
  return path.replace(/^\//, '').replace(/\/$/, '').split('?')[0].split('#')[0];
}

function getSeoLocale(locale: string): SeoLocale {
  return locale === 'sv' ? 'sv' : 'en';
}

function humanizePath(path: string): string {
  return path
    .replace(/[-/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function cleanMetadataText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function clampDescription(description: string, maxLength = 160): string {
  const normalized = cleanMetadataText(description);
  if (normalized.length <= maxLength) return normalized;
  const clipped = normalized.slice(0, Math.max(maxLength - 3, 0)).trimEnd();
  return `${clipped}...`;
}

function asNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = richTextToPlainText(value).trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function getCmsRouteMetadata(entries: CmsRouteMetadataEntry[]): Record<string, Partial<RouteSeoMetadata>> {
  const routeMap: Record<string, Partial<RouteSeoMetadata>> = {};

  for (const entry of entries) {
    if (!entry || typeof entry.path !== 'string') {
      continue;
    }

    const path = normalizePath(entry.path);
    const title = asNonEmptyString(entry.title);
    const description = asNonEmptyString(entry.description);

    if (!title && !description) {
      continue;
    }

    routeMap[path] = {
      ...(title ? { title: cleanMetadataText(title) } : {}),
      ...(description ? { description: clampDescription(description) } : {}),
    };
  }

  return routeMap;
}

const CMS_ROUTE_SEO_METADATA: Record<SeoLocale, Record<string, Partial<RouteSeoMetadata>>> = {
  en: getCmsRouteMetadata(CMS_ROUTE_METADATA_BY_LOCALE.en),
  sv: getCmsRouteMetadata(CMS_ROUTE_METADATA_BY_LOCALE.sv),
};

function getFallbackRouteMetadata(locale: SeoLocale, normalizedPath: string): RouteSeoMetadata {
  const isBlogPost = normalizedPath.startsWith('blogs/');
  const subject = isBlogPost
    ? humanizePath(normalizedPath.replace(/^blogs\//, ''))
    : humanizePath(normalizedPath || 'Home');

  if (locale === 'sv') {
    return {
      title: `${subject} | ${BRAND_NAME}`,
      description:
        isBlogPost
          ? `Las artikeln "${subject}" pa Webbly Medias blogg for praktiska tips om digital tillvaxt, SEO, annonsering och webbstrategi.`
          : `Las mer om ${subject.toLowerCase()} hos Webbly Media och hur vi stoder tillvaxt med strategi, design, utveckling och digital marknadsforing.`,
    };
  }

  return {
    title: `${subject} | ${BRAND_NAME}`,
    description:
      isBlogPost
        ? `Read "${subject}" on the Webbly Media blog for practical insights on digital growth, SEO, paid ads, and web strategy.`
        : `Explore ${subject.toLowerCase()} with Webbly Media and see how we support growth through strategy, design, development, and digital marketing.`,
  };
}

export function getRouteMetadata(locale: string, path: string): RouteSeoMetadata {
  const normalizedPath = normalizePath(path);
  const seoLocale = getSeoLocale(locale);
  const mapped = ROUTE_SEO_METADATA[seoLocale][normalizedPath];
  const resolved = mapped ?? getFallbackRouteMetadata(seoLocale, normalizedPath);
  const cmsOverride = CMS_ROUTE_SEO_METADATA[seoLocale][normalizedPath];
  const title = cmsOverride?.title ?? resolved.title;
  const description = cmsOverride?.description ?? resolved.description;

  return {
    title: cleanMetadataText(title),
    description: clampDescription(description),
  };
}

/**
 * Build absolute URL for a locale and path.
 * HTTPS, no trailing slash, no query params or fragments.
 */
export function getCanonicalUrl(locale: string, path: string, baseUrl = BASE_URL): string {
  const normalizedBaseUrl = normalizeSiteUrl(baseUrl);
  const canonicalSegment = normalizePath(path);
  const localizedSegment = getLocalizedPath(locale, canonicalSegment);
  const pathPart = localizedSegment ? `/${localizedSegment}` : '';
  return `${normalizedBaseUrl}/${locale}${pathPart}`;
}

/**
 * All alternate language URLs for a given path (same content, all locales).
 * Includes self-reference and x-default. Used for hreflang and sitemap.
 */
export function getAlternateLanguages(path: string, baseUrl = BASE_URL): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    const code = LOCALE_TO_HREFLANG[locale] ?? locale;
    languages[code] = getCanonicalUrl(locale, path, baseUrl);
  }
  languages['x-default'] = getCanonicalUrl(DEFAULT_LOCALE, path, baseUrl);
  return languages;
}

/**
 * Full hreflang metadata: self-referencing canonical + all alternates (reciprocal).
 * Use in generateMetadata for every indexable localized page.
 */
export function getHreflangMetadata(locale: string, path: string, baseUrl = BASE_URL): Metadata {
  const languages = getAlternateLanguages(path, baseUrl);
  const metadata = getRouteMetadata(locale, path);
  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: getCanonicalUrl(locale, path, baseUrl),
      languages,
    },
  };
}

/**
 * @deprecated Use getHreflangMetadata for full hreflang. Kept for compatibility.
 */
export function getCanonicalMetadata(locale: string, path: string, baseUrl = BASE_URL): Metadata {
  return getHreflangMetadata(locale, path, baseUrl);
}

/**
 * Merge canonical + hreflang into existing metadata (e.g. blog posts with title/description).
 */
export function withHreflang(
  locale: string,
  path: string,
  existing: Metadata,
  baseUrl = BASE_URL
): Metadata {
  const languages = getAlternateLanguages(path, baseUrl);
  const metadata = getRouteMetadata(locale, path);
  return {
    ...metadata,
    ...existing,
    title: existing.title ?? metadata.title,
    description: existing.description ?? metadata.description,
    alternates: {
      ...existing.alternates,
      canonical: getCanonicalUrl(locale, path, baseUrl),
      languages: { ...existing.alternates?.languages, ...languages },
    },
  };
}

/**
 * @deprecated Use withHreflang for full hreflang.
 */
export function withCanonical(
  locale: string,
  path: string,
  existing: Metadata,
  baseUrl = BASE_URL
): Metadata {
  return withHreflang(locale, path, existing, baseUrl);
}
