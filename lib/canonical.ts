import type { Metadata } from 'next';

function normalizeSiteUrl(value: string): string {
  return value.replace(/meida\.com/gi, 'media.com').replace(/\/$/, '');
}

const BASE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zephlotech.com');
const BRAND_NAME = 'Zephlo Tech';

export type RouteSeoMetadata = {
  title: string;
  description: string;
};

const ROUTE_SEO_METADATA: Record<string, RouteSeoMetadata> = {
  '': {
    title: 'Digital Marketing & Web Development | Zephlo Tech',
    description:
      'Zephlo Tech helps brands grow with web design, web development, SEO, PPC, social media, and creative digital marketing built for results.',
  },
  'about-us': {
    title: 'About Zephlo Tech | Digital Growth Experts',
    description:
      'Learn about Zephlo Tech, our team, and our mission to deliver measurable growth through web, SEO, paid ads, and brand-focused marketing.',
  },
  'contact': {
    title: 'Contact Zephlo Tech | Start Your Project',
    description:
      'Contact Zephlo Tech to discuss web design, development, SEO, PPC, and digital marketing services. Share your goals and get a tailored plan.',
  },
  'privacy-policy': {
    title: 'Privacy Policy | Zephlo Tech',
    description:
      "Read Zephlo Tech's Privacy Policy to understand how we collect, use, and protect your personal information across our website and services.",
  },
  'terms-and-conditions': {
    title: 'Terms and Conditions | Zephlo Tech',
    description:
      "Review Zephlo Tech's Terms and Conditions for website usage, service policies, and legal responsibilities for clients and visitors.",
  },
  'cookie-policy': {
    title: 'Cookie Policy | Zephlo Tech',
    description:
      'Understand how Zephlo Tech uses cookies and similar technologies to enhance your browsing experience, analyze traffic, and support analytics.',
  },
  'domain-hosting': {
    title: 'Domain & Hosting Services | High-Speed Infrastructure | Zephlo Tech',
    description:
      'Fast, reliable, and secure domain registration and web hosting solutions designed for uptime, performance, and scale.',
  },
  'pay-it-forward': {
    title: 'Pay It Forward | Empowering Communities | Zephlo Tech',
    description:
      'Learn about our mission to give back by supporting impactful organizations, non-profits, and purpose-driven initiatives.',
  },
  'blogs': {
    title: 'Digital Growth Insights & Strategy Blog | Zephlo Tech',
    description:
      'Explore actionable articles on web development, SEO, PPC, design trends, and digital growth from the Zephlo Tech team.',
  },
  'services/app-development': {
    title: 'Custom Mobile App Development Agency | Zephlo Tech',
    description:
      'Build fast, scalable mobile and web applications with Zephlo Tech. We design, develop, and launch user-focused digital products.',
  },
  'services/digital-marketing-services': {
    title: 'Full-Service Digital Marketing Agency | Zephlo Tech',
    description:
      'Grow your reach, leads, and revenue with Zephlo Tech. We provide multi-channel marketing, paid advertising, and conversion-driven strategy.',
  },
  'services/seo': {
    title: 'Data-Driven SEO Agency & Consulting Services | Zephlo Tech',
    description:
      'Improve keyword rankings, organic traffic, and domain authority with technical SEO, keyword strategy, and on-page optimization from Zephlo Tech.',
  },
  'services/social-media-marketing-services': {
    title: 'Social Media Marketing Agency & Management | Zephlo Tech',
    description:
      'Engage target audiences and build community through strategic social media campaigns, content creation, and paid social management.',
  },
  'services/ppc-google-ads-management': {
    title: 'PPC Management & Google Ads Agency | Zephlo Tech',
    description:
      'Maximize ad spend ROI with targeted Google Ads, display campaigns, retargeting, and performance-driven paid search management.',
  },
  'services/web-design': {
    title: 'Modern UI/UX Web Design Agency | Zephlo Tech',
    description:
      'Create high-converting, responsive websites tailored to your brand identity, user experience best practices, and modern design standards.',
  },
  'services/web-development': {
    title: 'Full-Stack Web Development Agency | Zephlo Tech',
    description:
      'Develop secure, fast, and scalable websites and web platforms using modern frameworks, clean code, and reliable architecture.',
  },
  'services/graphic-design': {
    title: 'Creative Graphic Design Agency Services | Zephlo Tech',
    description:
      'Elevate your brand with custom visual identity, branding assets, campaign creative, and marketing collateral designed by Zephlo Tech.',
  },
  'services/wordpress-development': {
    title: 'Custom WordPress Development Agency | Zephlo Tech',
    description:
      'Custom themes, plugins, speed optimization, and secure architecture for enterprise and high-traffic WordPress websites.',
  },
};

function normalizePath(path: string): string {
  return path.replace(/^\//, '').replace(/\/$/, '').split('?')[0].split('#')[0];
}

function humanizePath(path: string): string {
  return path
    .replace(/[-/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getRouteMetadata(arg1: string, arg2?: string): RouteSeoMetadata {
  // Support both getRouteMetadata(path) and getRouteMetadata(locale, path)
  const path = arg2 !== undefined ? arg2 : arg1;
  const normalizedPath = normalizePath(path);
  const mapped = ROUTE_SEO_METADATA[normalizedPath];

  if (mapped) {
    return mapped;
  }

  const subject = humanizePath(normalizedPath || 'Home');
  return {
    title: `${subject} | ${BRAND_NAME}`,
    description: `Explore ${subject.toLowerCase()} with Zephlo Tech and see how we support growth through strategy, design, development, and digital marketing.`,
  };
}

export function getCanonicalUrl(path: string, baseUrl = BASE_URL): string {
  const normalizedBaseUrl = normalizeSiteUrl(baseUrl);
  const canonicalSegment = normalizePath(path);
  const pathPart = canonicalSegment ? `/${canonicalSegment}` : '';
  return `${normalizedBaseUrl}${pathPart}`;
}

export function getCanonicalMetadata(arg1: string, arg2?: string, baseUrl = BASE_URL): Metadata {
  const path = arg2 !== undefined ? arg2 : arg1;
  const meta = getRouteMetadata(path);
  const canonical = getCanonicalUrl(path, baseUrl);

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonical,
      siteName: BRAND_NAME,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
  };
}
