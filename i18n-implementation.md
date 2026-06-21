# i18n (Internationalization) Implementation Documentation

This document provides a comprehensive guide on how internationalization (i18n) is implemented in this WebblyHost project using `next-intl` and how you can replicate the same setup in other Next.js projects.

## Table of Contents

1. [Overview](#overview)
2. [Installation & Dependencies](#installation--dependencies)
3. [Project Structure](#project-structure)
4. [Configuration Files](#configuration-files)
5. [Routing & Navigation](#routing--navigation)
6. [Translation Files](#translation-files)
7. [Usage in Components](#usage-in-components)
8. [Middleware Integration](#middleware-integration)
9. [Implementation in Other Projects](#implementation-in-other-projects)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)

---

## Overview

This project uses **next-intl** for internationalization, supporting multiple languages with a locale-based routing system. Currently, the project supports:

- **English (en)** - Default locale
- **Swedish (sv)**

The i18n implementation provides:
- ✅ Locale-based routing (`/en/...`, `/sv/...`)
- ✅ Automatic locale detection and redirection
- ✅ Type-safe translations
- ✅ Server and client component support
- ✅ Dynamic translation loading
- ✅ Language switcher component
- ✅ SEO-friendly URLs

---

## Installation & Dependencies

### Required Packages

Install `next-intl` package:

```bash
npm install next-intl
# or
pnpm add next-intl
# or
yarn add next-intl
```

### Package Version

```json
{
  "dependencies": {
    "next-intl": "^4.6.1"
  }
}
```

---

## Project Structure

### Directory Layout

```
project-root/
├── app/
│   ├── [locale]/              # Locale-based routes
│   │   ├── layout.tsx         # Locale layout with NextIntlClientProvider
│   │   ├── page.tsx           # Homepage for each locale
│   │   ├── about/
│   │   ├── blog/
│   │   ├── contact/
│   │   └── ... (other pages)
│   ├── layout.tsx             # Root layout (html/body tags)
│   └── page.tsx               # Root page (redirects to locale)
├── i18n/
│   ├── routing.ts             # Routing configuration
│   └── request.ts             # Server-side i18n configuration
├── translations/              # Translation JSON files
│   ├── home/
│   │   ├── en.json
│   │   └── sv.json
│   ├── about/
│   │   ├── en.json
│   │   └── sv.json
│   ├── blog/
│   ├── contact/
│   ├── pricing/
│   │   ├── web-hosting/
│   │   ├── vps-hosting/
│   │   ├── wordpress-hosting/
│   │   └── domains/
│   └── ... (other sections)
├── components/
│   └── LanguageSwitcher.tsx   # Language switcher component
└── proxy.ts                   # Middleware with i18n integration
```

---

## Configuration Files

### 1. i18n/routing.ts

This file defines the routing configuration and creates navigation utilities.

```typescript
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'sv'],
  defaultLocale: 'en',
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;
```

**Key Features:**
- `locales`: Array of supported locale codes
- `defaultLocale`: Fallback locale
- `createNavigation`: Generates locale-aware navigation utilities
- Exports: `Link`, `redirect`, `usePathname`, `useRouter` for locale-aware navigation

### 2. i18n/request.ts

Server-side configuration for loading translations.

```typescript
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate locale
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // Import translation files dynamically
  const homeMessages = (await import(`@/translations/home/${locale}.json`)).default;
  const vpsMessages = (await import(`@/translations/vps/${locale}.json`)).default;
  const sharedHostingMessages = (await import(`@/translations/shared-hosting/${locale}.json`)).default;
  const wordpressHostingMessages = (await import(`@/translations/wordpress-hosting/${locale}.json`)).default;
  const ecommerceHostingMessages = (await import(`@/translations/ecommerce-hosting/${locale}.json`)).default;
  const domainSearchMessages = (await import(`@/translations/domain-search/${locale}.json`)).default;
  const domainTransferMessages = (await import(`@/translations/domain-transfer/${locale}.json`)).default;
  const privacyPolicyMessages = (await import(`@/translations/legal/privacy-policy/${locale}.json`)).default;
  const termsOfServiceMessages = (await import(`@/translations/legal/terms-of-service/${locale}.json`)).default;
  const cookiePolicyMessages = (await import(`@/translations/legal/cookie-policy/${locale}.json`)).default;
  const blogMessages = (await import(`@/translations/blog/${locale}.json`)).default;
  const contactPageMessages = (await import(`@/translations/contact/${locale}.json`)).default;
  const aboutMessages = (await import(`@/translations/about/${locale}.json`)).default;
  const footerMessages = (await import(`@/translations/footer/${locale}.json`)).default;

  return {
    locale,
    messages: {
      ...homeMessages,
      vps: vpsMessages,
      'shared-hosting': sharedHostingMessages,
      'wordpress-hosting': wordpressHostingMessages,
      'ecommerce-hosting': ecommerceHostingMessages,
      'domain-search': domainSearchMessages,
      'domain-transfer': domainTransferMessages,
      'privacy-policy': privacyPolicyMessages,
      'terms-of-service': termsOfServiceMessages,
      'cookie-policy': cookiePolicyMessages,
      blogPage: blogMessages,
      'contact-page': contactPageMessages,
      about: aboutMessages,
      webHosting: (await import(`@/translations/pricing/web-hosting/${locale}.json`)).default,
      wordpressHosting: (await import(`@/translations/pricing/wordpress-hosting/${locale}.json`)).default,
      vpsHosting: (await import(`@/translations/pricing/vps-hosting/${locale}.json`)).default,
      domains: (await import(`@/translations/pricing/domains/${locale}.json`)).default,
      footer: footerMessages,
    },
  };
});
```

**Key Features:**
- Dynamic translation loading based on locale
- Namespace organization for different sections
- Fallback to default locale if invalid
- Merges all translations into a single messages object

### 3. next.config.ts

Next.js configuration with next-intl plugin.

```typescript
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // ... your other config
};

export default withNextIntl(nextConfig);
```

**Important:** The `createNextIntlPlugin()` wraps your Next.js config to enable i18n features.

---

## Routing & Navigation

### Locale-Based Routes

All public pages are under the `[locale]` dynamic segment:

```
/en/about       → English about page
/sv/about       → Swedish about page
/en/blog        → English blog
/sv/blog        → Swedish blog
```

### Root Page Redirect

The root `app/page.tsx` is handled by middleware to redirect to the appropriate locale:

```typescript
// app/page.tsx
// This page is handled by the middleware which redirects to the locale routes
// The actual homepage is in app/[locale]/page.tsx
export default function RootPage() {
  return null;
}
```

### Locale Layout

The `app/[locale]/layout.tsx` wraps all locale-specific pages:

```typescript
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages}>
      {/* Your layout components */}
      {children}
    </NextIntlClientProvider>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
```

**Key Features:**
- `NextIntlClientProvider`: Provides translations to client components
- `generateMetadata`: Localized metadata for SEO
- `generateStaticParams`: Pre-renders pages for all locales
- Locale validation with 404 fallback

### Navigation Utilities

Use locale-aware navigation from `i18n/routing.ts`:

```typescript
import { Link, useRouter, usePathname, redirect } from '@/i18n/routing';

// Link component (automatically prefixes locale)
<Link href="/about">About Us</Link>
// Renders: /en/about or /sv/about based on current locale

// Router
const router = useRouter();
router.push('/contact');  // Navigates to /[locale]/contact

// Pathname (without locale prefix)
const pathname = usePathname();  // Returns '/about' not '/en/about'

// Redirect
redirect('/login');  // Redirects to /[locale]/login
```

---

## Translation Files

### File Structure

Translations are organized by section in JSON format:

```
translations/
├── home/
│   ├── en.json
│   └── sv.json
├── about/
│   ├── en.json
│   └── sv.json
└── pricing/
    ├── web-hosting/
    │   ├── en.json
    │   └── sv.json
    └── vps-hosting/
        ├── en.json
        └── sv.json
```

### Translation File Example

**translations/home/en.json:**
```json
{
  "metadata": {
    "title": "WebblyHosting",
    "description": "Professional Web Hosting Services"
  },
  "navbar": {
    "pricing": "Pricing",
    "aboutUs": "About Us",
    "services": {
      "title": "Services",
      "hosting": "Hosting",
      "domains": "Domains"
    }
  },
  "hero": {
    "brandName": "WebblyHosting",
    "mainTitle": "Fast, Reliable Web Hosting",
    "pricing": {
      "from": "From",
      "price": "$2.99",
      "unit": "/month",
      "offer": "Limited time offer"
    }
  },
  "footer": {
    "copyright": "© 2024 WebblyHosting. All rights reserved."
  }
}
```

**translations/home/sv.json:**
```json
{
  "metadata": {
    "title": "WebblyHosting",
    "description": "Professionella Webbhotell Tjänster"
  },
  "navbar": {
    "pricing": "Priser",
    "aboutUs": "Om Oss",
    "services": {
      "title": "Tjänster",
      "hosting": "Webbhotell",
      "domains": "Domäner"
    }
  },
  "hero": {
    "brandName": "WebblyHosting",
    "mainTitle": "Snabb, Pålitlig Webbhotell",
    "pricing": {
      "from": "Från",
      "price": "$2.99",
      "unit": "/månad",
      "offer": "Tidsbegränsat erbjudande"
    }
  },
  "footer": {
    "copyright": "© 2024 WebblyHosting. Alla rättigheter förbehållna."
  }
}
```

### Nested Translations

Translations support nested objects for better organization:

```json
{
  "pricing": {
    "hero": {
      "title": "Choose Your Plan",
      "subtitle": "Flexible pricing for everyone"
    },
    "features": {
      "websites": "{count, plural, =1 {1 Website} other {# Websites}}",
      "storage": "{amount} SSD Storage",
      "bandwidth": "{amount} Bandwidth"
    }
  }
}
```

---

## Usage in Components

### Server Components

Use `getTranslations` for server components:

```typescript
import { getTranslations } from 'next-intl/server';

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.description')}</p>
    </div>
  );
}
```

### Client Components

Use `useTranslations` hook for client components:

```typescript
'use client';

import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section>
      <h1>{t('brandName')}</h1>
      <h2>{t('mainTitle')}</h2>
      <p>{t('pricing.from')} {t('pricing.price')}{t('pricing.unit')}</p>
    </section>
  );
}
```

### With Namespace Parameter

Components can accept namespace as a prop for reusability:

```typescript
'use client';

import { useTranslations } from 'next-intl';

export default function CTA({ namespace = 'cta' }: { namespace?: string }) {
  const t = useTranslations(namespace);

  return (
    <section>
      <h2>{t('title')}</h2>
      <p>{t('description')}</p>
      <button>{t('button')}</button>
    </section>
  );
}

// Usage:
<CTA namespace="about.cta" />
<CTA namespace="home.cta" />
```

### Getting Current Locale

```typescript
'use client';

import { useLocale } from 'next-intl';

export default function Component() {
  const locale = useLocale();  // 'en' or 'sv'

  return <div>Current locale: {locale}</div>;
}
```

---

## Middleware Integration

### Custom Middleware with i18n

The project uses a custom middleware (`proxy.ts`) that integrates i18n with authentication:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

function resolveLocale(request: NextRequest): string {
  const pathnameLocale = request.nextUrl.pathname.split('/')[1];
  if (routing.locales.includes(pathnameLocale as any)) {
    return pathnameLocale;
  }

  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && routing.locales.includes(cookieLocale as any)) {
    return cookieLocale;
  }

  return routing.defaultLocale;
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Admin routes (no i18n)
  const isAdminRoute = pathname.startsWith('/spike');
  const isTinaCMSRoute = pathname.startsWith('/admin') || pathname.startsWith('/tina-admin');
  const isClientAuthRoute = pathname.startsWith('/dashboard') || pathname === '/login';

  // Apply i18n middleware only to public routes
  if (!isAdminRoute && !isClientAuthRoute && !isTinaCMSRoute) {
    return intlMiddleware(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
```

**Key Features:**
- Locale resolution from pathname or cookies
- Selective i18n application (public routes only)
- Integration with authentication routes
- Excludes admin, dashboard, and API routes from i18n

### Middleware Export

The middleware must be exported from a `middleware.ts` file in the root:

```typescript
// middleware.ts
export { proxy as middleware, config } from './proxy';
```

---

## Language Switcher Component

### Implementation

```typescript
'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: GBFlag },
  { code: 'sv', label: 'Svenska', flag: SEFlag },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div>
      {LANGUAGES.map((language) => (
        <button
          key={language.code}
          onClick={() => handleLanguageChange(language.code)}
        >
          <language.flag />
          <span>{language.label}</span>
          {locale === language.code && <Check />}
        </button>
      ))}
    </div>
  );
}
```

**Key Features:**
- Uses `useLocale()` to get current locale
- Uses `router.replace()` with locale option to switch languages
- Preserves current pathname when switching
- Visual indicator for active language

---

## Implementation in Other Projects

### Step-by-Step Guide

#### 1. Install Dependencies

```bash
npm install next-intl
```

#### 2. Create i18n Configuration

Create `i18n/routing.ts`:

```typescript
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'es', 'fr'],  // Your supported locales
  defaultLocale: 'en',
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
```

#### 3. Create Request Configuration

Create `i18n/request.ts`:

```typescript
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../translations/${locale}.json`)).default,
  };
});
```

#### 4. Update Next.js Config

Update `next.config.ts`:

```typescript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  // Your config
};

export default withNextIntl(nextConfig);
```

#### 5. Create Middleware

Create `middleware.ts`:

```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
```

#### 6. Set Up App Structure

```
app/
├── [locale]/
│   ├── layout.tsx
│   ├── page.tsx
│   └── ... (your pages)
├── layout.tsx
└── page.tsx
```

#### 7. Create Locale Layout

Create `app/[locale]/layout.tsx`:

```typescript
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
```

#### 8. Create Translation Files

```
translations/
├── en.json
├── es.json
└── fr.json
```

**Example `translations/en.json`:**
```json
{
  "home": {
    "title": "Welcome",
    "description": "This is the homepage"
  },
  "about": {
    "title": "About Us",
    "description": "Learn more about our company"
  }
}
```

#### 9. Use Translations

**Server Component:**
```typescript
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('home');
  return <h1>{t('title')}</h1>;
}
```

**Client Component:**
```typescript
'use client';
import { useTranslations } from 'next-intl';

export default function Component() {
  const t = useTranslations('home');
  return <h1>{t('title')}</h1>;
}
```

---

## Best Practices

### 1. Organize Translations by Feature

```
translations/
├── home/
├── about/
├── products/
└── common/
```

### 2. Use Namespaces

```typescript
const t = useTranslations('products.pricing');
// Access: products.pricing.title, products.pricing.description
```

### 3. Keep Keys Descriptive

```json
{
  "hero.mainTitle": "Welcome",
  "hero.subtitle": "Get started today",
  "cta.button": "Sign Up"
}
```

### 4. Use Pluralization

```json
{
  "items": "{count, plural, =0 {No items} =1 {1 item} other {# items}}"
}
```

### 5. Handle Missing Translations

Provide fallback values:

```typescript
const t = useTranslations('optional');
const title = t('title', { default: 'Default Title' });
```

### 6. Type Safety

Create TypeScript types for your translations:

```typescript
type Messages = typeof import('./translations/en.json');
declare global {
  interface IntlMessages extends Messages {}
}
```

### 7. SEO Optimization

Always set locale-specific metadata:

```typescript
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'sv': '/sv',
      },
    },
  };
}
```

---

## Troubleshooting

### Issue 1: Translations Not Loading

**Problem:** Translations show keys instead of values.

**Solution:**
- Check that translation files exist in `translations/[locale].json`
- Verify the namespace matches the file structure
- Ensure `NextIntlClientProvider` wraps your components

### Issue 2: Locale Not Detected

**Problem:** Always defaults to English.

**Solution:**
- Check middleware configuration
- Verify `matcher` in middleware config
- Ensure locale is in the URL path

### Issue 3: Hydration Mismatch

**Problem:** Server and client render different content.

**Solution:**
- Use `useTranslations` in client components
- Use `getTranslations` in server components
- Don't mix server/client translation methods

### Issue 4: Dynamic Routes Not Working

**Problem:** Dynamic routes like `[slug]` don't work with locale.

**Solution:**
```typescript
// app/[locale]/blog/[slug]/page.tsx
export default async function BlogPost({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  // Your code
}
```

### Issue 5: Link Component Not Prefixing Locale

**Problem:** Links don't include locale prefix.

**Solution:**
- Import `Link` from `@/i18n/routing`, not `next/link`
- Use the custom `Link` component created by `createNavigation`

---

## Summary

This i18n implementation provides:

- ✅ **Locale-based routing** with automatic URL prefixing
- ✅ **Server and client component support** with appropriate hooks
- ✅ **Dynamic translation loading** for better performance
- ✅ **Type-safe translations** with TypeScript support
- ✅ **SEO-friendly** with locale-specific metadata
- ✅ **Language switcher** for easy locale switching
- ✅ **Middleware integration** with authentication
- ✅ **Organized translation files** by feature/section
- ✅ **Easy to replicate** in other Next.js projects

The setup is production-ready, scalable, and follows Next.js App Router best practices with next-intl v4.x.
