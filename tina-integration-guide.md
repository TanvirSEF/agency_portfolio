# Tina CMS + i18n (next-intl) + Next.js — Integration Guide

A step-by-step guide to implement **Tina CMS** with **next-intl** in a **Next.js** app so editors can manage localized content in the same files your app uses for translations.

---

## Table of contents

1. [Prerequisites & concepts](#1-prerequisites--concepts)
2. [Installation](#2-installation)
3. [Project structure](#3-project-structure)
4. [i18n setup (next-intl)](#4-i18n-setup-next-intl)
5. [Tina configuration (locale-aware)](#5-tina-configuration-locale-aware)
6. [Next.js config & admin route](#6-nextjs-config--admin-route)
7. [Middleware: i18n + protecting Tina admin](#7-middleware-i18n--protecting-tina-admin)
8. [Consuming content in the app](#8-consuming-content-in-the-app)
9. [Optional: Rich-text pages (e.g. legal)](#9-optional-rich-text-pages-eg-legal)
10. [Optional: App-only JSON (e.g. product overrides)](#10-optional-app-only-json-eg-product-overrides)
11. [Adding a new locale](#11-adding-a-new-locale)
12. [Adding a new Tina collection](#12-adding-a-new-tina-collection)
13. [Environment, build & deployment](#13-environment-build--deployment)
14. [Security & gitignore](#14-security--gitignore)
15. [Quick reference](#15-quick-reference)

---

## 1. Prerequisites & concepts

**You need:**

- A Next.js app (App Router).
- next-intl (or equivalent) for i18n with locale-based routes (e.g. `/en/...`, `/sv/...`).
- A single source of truth for copy: **Tina will edit the same JSON files that next-intl loads.**

**Core idea:**

- **Translations:** Stored as `translations/<section>/<locale>.json` (e.g. `translations/home/en.json`).
- **Tina:** Defines one collection per section with `path: 'translations/<section>'` and `match: { include: '{en,sv}' }` (or your locales). That makes Tina edit exactly those files.
- **Runtime:** The app does **not** call Tina’s API; it only reads the JSON from the filesystem (or bundled). So Tina and i18n share the same files.

**Supported locales:** Define them once (e.g. in `i18n/routing.ts`) and reuse the same list in Tina’s `match.include`.

---

## 2. Installation

**Packages:**

```bash
# Tina CMS
pnpm add tinacms@^3.3.1
pnpm add -D @tinacms/cli@^2.1.1

# If not already present: next-intl
pnpm add next-intl@^4.6.1
```

**Scripts (`package.json`):**

```json
{
  "scripts": {
    "dev": "tinacms dev -c \"next dev\"",
    "build": "tinacms build && next build",
    "start": "tinacms build && next start"
  }
}
```

- **dev:** Tina CLI runs Next dev and serves the GraphQL backend for the admin UI.
- **build / start:** `tinacms build` generates the static admin into `public/tina-admin`; then Next builds or runs. At runtime the app only reads JSON; it does not use Tina’s GraphQL.

---

## 3. Project structure

Use a layout like this so Tina and next-intl share the same translation files:

```
your-app/
├── app/
│   ├── [locale]/              # Locale-based routes (next-intl)
│   │   ├── layout.tsx         # NextIntlClientProvider, getMessages({ locale })
│   │   ├── page.tsx
│   │   └── ...
│   └── page.tsx               # Root redirect to /[locale]
├── i18n/
│   ├── routing.ts             # locales, defaultLocale, Link, useRouter, usePathname
│   └── request.ts             # getRequestConfig: load translation files by locale
├── translations/              # Shared by next-intl and Tina
│   ├── home/
│   │   ├── en.json
│   │   └── sv.json
│   ├── about/
│   │   ├── en.json
│   │   └── sv.json
│   └── ...                    # One folder per “section”, one file per locale
├── tina/
│   └── config.ts              # Tina schema: collections over translations/*
├── middleware.ts              # Or proxy.ts: next-intl + protect /admin
├── next.config.ts             # next-intl plugin + rewrites for /admin
└── package.json
```

**Optional:**

- **Rich-text pages (e.g. legal):** Store in `content/<section>/` with one JSON per page-type and locale (e.g. `content/legal/privacy-policy/en.json`). Use Tina’s `rich-text` field and render with `TinaMarkdown`.
- **App-only JSON:** If some JSON is not for next-intl (e.g. product overrides), put it under `translations/<section>/` or a dedicated folder and add a Tina collection + a small loader in `lib/` to read by locale.

---

## 4. i18n setup (next-intl)

**4.1 Routing (`i18n/routing.ts`):**

```ts
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'sv'],   // Use your locale codes
  defaultLocale: 'en',
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;
```

**4.2 Request config (`i18n/request.ts`):**

Load one JSON per section and locale, then merge into `messages`. Use dynamic imports so adding a locale only requires adding files.

```ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // Load one file per section per locale — same files Tina will edit
  const homeMessages = (await import(`@/translations/home/${locale}.json`)).default;
  const aboutMessages = (await import(`@/translations/about/${locale}.json`)).default;
  // ... add every section you use

  return {
    locale,
    messages: {
      ...homeMessages,
      about: aboutMessages,
      // ... namespaces for useTranslations('about'), etc.
    },
  };
});
```

**4.3 Next.js config:** Wrap with next-intl’s plugin (see [Next.js config](#6-nextjs-config--admin-route)).

**4.4 App layout:** In `app/[locale]/layout.tsx`, use `getMessages({ locale })` and `<NextIntlClientProvider messages={messages}>`. Use `Link`, `useRouter`, `usePathname` from `@/i18n/routing` so URLs stay locale-prefixed.

---

## 5. Tina configuration (locale-aware)

Create `tina/config.ts` and define one collection per translation section. The crucial part is **path** + **match** so each locale is a separate file.

**5.1 Basic config:**

```ts
import { defineConfig } from 'tinacms';

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'main';

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID ?? null,
  token: process.env.TINA_TOKEN ?? null,
  build: {
    outputFolder: 'tina-admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: '',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      // Add collections here (see below)
    ],
  },
});
```

**5.2 Locale pattern for translation collections:**

For each section (e.g. home, about) that you store as `translations/<section>/<locale>.json`:

- `path: 'translations/<section>'`
- `match: { include: '{en,sv}' }` (or your locales as a comma-separated list inside the braces)
- `format: 'json'`
- `fields`: mirror your JSON shape (objects, strings, etc.)
- `ui.filename.readonly: true` keeps filenames stable (recommended so locale files are not renamed)

**Example — “Home” collection:**

```ts
{
  name: 'homepage',
  label: 'Homepage Content',
  path: 'translations/home',
  format: 'json',
  match: { include: '{en,sv}' },
  ui: { filename: { readonly: true } },
  fields: [
    {
      type: 'object',
      name: 'metadata',
      label: 'Page Metadata',
      fields: [
        { type: 'string', name: 'title', label: 'Page Title' },
        { type: 'string', name: 'description', label: 'Meta Description' },
      ],
    },
    {
      type: 'object',
      name: 'navbar',
      label: 'Navigation',
      fields: [
        { type: 'string', name: 'pricing', label: 'Pricing Link' },
        { type: 'string', name: 'aboutUs', label: 'About Us Link' },
        // ...
      ],
    },
    // ... rest of your home JSON structure
  ],
}
```

**Result:** Tina will show and edit `translations/home/en.json` and `translations/home/sv.json`. Those are the same files loaded in `i18n/request.ts`. No duplicate content.

**5.3 Nested sections (e.g. pricing sub-pages):**

If your structure is `translations/pricing/<subfolder>/<locale>.json`:

- `path: 'translations/pricing'`
- `match: { include: '{web-hosting,vps-hosting,wordpress-hosting}' }` (subfolder names)

Adjust to your actual subfolders and ensure next-intl loads the same paths.

**5.4 Two-level locale (e.g. product-plans by group + locale):**

If you have `translations/product-plans/<group>/<locale>.json`:

- `path: 'translations/product-plans'`
- `match: { include: '{shared,wordpress,vps,ecommerce}/{en,sv}' }` (or your groups and locales)

This is typically used for app-only JSON (see [App-only JSON](#10-optional-app-only-json-eg-product-overrides)).

---

## 6. Next.js config & admin route

- Apply the next-intl plugin.
- Add rewrites so `/admin` serves the Tina admin (built into `public/tina-admin`).

```ts
// next.config.ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/admin', destination: '/tina-admin/index.html' },
      { source: '/tina/admin/:path*', destination: '/tina-admin/:path*' },
    ];
  },
};

export default withNextIntl(nextConfig);
```

The CMS will be available at **`/admin`**. Protect it in middleware (next step).

---

## 7. Middleware: i18n + protecting Tina admin

Your middleware (e.g. `middleware.ts` or `proxy.ts`) should:

1. **Resolve locale** (e.g. from pathname segment or `NEXT_LOCALE` cookie; fallback to `defaultLocale` from `i18n/routing.ts`).
2. **Treat Tina routes as special:** e.g. `pathname.startsWith('/admin') || pathname.startsWith('/tina-admin')`. Do **not** run next-intl on these (no locale prefix).
3. **Protect Tina admin:** Require your auth (e.g. admin JWT in a cookie). If unauthenticated or not allowed, redirect to your login page.
4. **Run next-intl for the rest:** For all other public routes, call `createMiddleware(routing)(request)` from next-intl so locale detection and redirects work.

**Pseudocode:**

```ts
// middleware.ts (or proxy.ts)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isTinaRoute = pathname.startsWith('/admin') || pathname.startsWith('/tina-admin');

  if (isTinaRoute) {
    // TODO: Check your admin auth (e.g. verify admin_session cookie / JWT)
    // If not allowed: return NextResponse.redirect(new URL('/your-admin-login', request.url));
    // If allowed:
    return NextResponse.next();
  }

  // Apply next-intl for all non-Tina routes
  return intlMiddleware(request);
}

export const config = { matcher: ['/((?!api|_next|.*\\..*).*)'] };
```

Use the same `routing` object as in `i18n/routing.ts` so locales stay in sync.

---

## 8. Consuming content in the app

**Translation namespaces (next-intl):**

- **Server:** `getTranslations({ locale, namespace: 'about' })` then `t('key')`.
- **Client:** `useTranslations('about')`, `useLocale()`. Use `Link`, `useRouter`, `usePathname` from `@/i18n/routing`.

Because Tina edits the same JSON files that `i18n/request.ts` loads, any change in Tina is reflected on the next request without extra wiring. No “Tina API” at runtime.

**App-only JSON (not in next-intl messages):** Create a small loader (e.g. in `lib/`) that reads `translations/<section>/<group?>/<locale>.json` and exports a helper (e.g. `getTinaMap(section, locale)`). Use that in server components or server actions and pass data to the client as needed.

---

## 9. Optional: Rich-text pages (e.g. legal)

For long-form content with rich text (e.g. legal pages), you can store JSON in a separate tree and use Tina’s **rich-text** field.

**9.1 Structure:** e.g. `content/legal/<page-type>/<locale>.json` (e.g. `content/legal/privacy-policy/en.json`).

**9.2 Tina collection:**

- `path: 'content/legal'`
- `match: { include: '{privacy-policy,terms-of-service,cookie-policy}/{en,sv}' }` (or your page types and locales)
- Include a `rich-text` field for intro and section content.

**9.3 Loading in the app:** A function like `getLegalPage(pageType, locale)` that reads `content/legal/<pageType>/<locale>.json` (e.g. with `fs` or a simple cache).

**9.4 Rendering:** Use `TinaMarkdown` from `tinacms/dist/rich-text` and pass the rich-text AST (the `content` / `introduction` from the JSON). Legal content stays outside next-intl messages; only labels/breadcrumbs can come from translations if you prefer.

---

## 10. Optional: App-only JSON (e.g. product overrides)

Some JSON might not be part of next-intl (e.g. product name/description overrides per locale). You can still manage it with Tina.

**10.1 Place files** e.g. under `translations/product-plans/<group>/<locale>.json` with a structure like `{ plans: [{ id, name, tagline, description, features }] }`.

**10.2 Tina collection:** Same as in [5.4](#54-two-level-locale-eg-product-plans-by-group--locale): `path: 'translations/product-plans'`, `match: { include: '{group1,group2}/{en,sv}' }`, and `fields` matching that JSON.

**10.3 Loader:** In `lib/` implement something like `getTinaTranslationMap(groupKey, locale)` that reads the JSON and returns a map by ID for easy lookup.

**10.4 Use in app:** In server actions or API routes, fetch base data (e.g. from an API), then overlay Tina overrides by locale so the UI shows edited names/descriptions/features while keeping IDs and pricing from the source system.

---

## 11. Adding a new locale

1. **i18n:** In `i18n/routing.ts`, add the new locale to `locales` (e.g. `['en', 'sv', 'de']`).
2. **Translations:** Add `<locale>.json` in every `translations/<section>/` (and in any nested or app-only paths you use).
3. **Tina:** In `tina/config.ts`, update every `match.include` that lists locales (e.g. change `{en,sv}` to `{en,sv,de}`). For legal or other `content/` collections, add the new locale in the match and create the corresponding files.
4. **i18n/request.ts:** If you use dynamic imports like `translations/home/${locale}.json`, no code change is needed; just ensure every namespace has a file for the new locale.

---

## 12. Adding a new Tina collection (new section)

1. **Path and match:**  
   - Flat: `path: 'translations/<section>'`, `match: { include: '{en,sv}' }`.  
   - Nested: adjust `path` and `match` to your folder and locale/subfolder pattern.
2. **Files:** Create `translations/<section>/en.json` and `translations/<section>/sv.json` (and other locales) with the shape you want.
3. **Tina:** Add a new collection in `tina/config.ts` with `format: 'json'` and `fields` mirroring that shape. Use `ui.filename.readonly: true` to avoid renaming locale files.
4. **App:**  
   - If it’s a translation namespace: in `i18n/request.ts`, add the dynamic import and merge into `messages` under a namespace; use it with `useTranslations('<namespace>')` or `getTranslations`.  
   - If it’s app-only: add a loader in `lib/` and use it where needed.

---

## 13. Environment, build & deployment

- **Env (optional for local):** `NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`. For production, set them in your host or Docker.
- **Build:** Always run `tinacms build` before `next build` so `public/tina-admin` exists. In CI/Docker: `pnpm exec tinacms build && pnpm run build`.
- **Runtime:** The app only needs the built Next app and the content files (`translations/`, `content/`, `tina/config.ts` if you use Tina Cloud features). It does not run the Tina CLI at runtime.

---

## 14. Security & gitignore

- **Tina admin:** Protect `/admin` (and `/tina-admin` if exposed) in middleware. Only allow users with an admin role; otherwise redirect to login.
- **Gitignore:** Ignore generated and local Tina artifacts; keep content and config in git:
  - `tina/__generated__`, `.tina/__generated__`, `.tina/local_content_store`, `public/tina-admin`

---

## 15. Quick reference

| Goal | What to do |
|------|------------|
| **Editable UI copy per locale** | Tina collection with `path: 'translations/<section>'`, `match: { include: '{en,sv}' }`. Load same files in `i18n/request.ts` and use next-intl namespaces. |
| **Rich-text pages (e.g. legal)** | Store in `content/<section>/<page>/<locale>.json`, Tina `rich-text` field, load with e.g. `getLegalPage(type, locale)`, render with `TinaMarkdown`. |
| **App-only JSON (e.g. overrides)** | Tina collection for that path/match; loader in `lib/` to read by section + locale; use in server actions or API. |
| **Add a locale** | Update `i18n/routing.ts`, add JSON in every `translations/...` and `content/...`, extend Tina `match.include`. |
| **Protect Tina admin** | In middleware, detect `/admin` and `/tina-admin`, require admin auth, else redirect to login. |
| **Single source of truth** | Tina and next-intl point at the same files: `translations/<section>/<locale>.json`. |

This integration guide lets you implement Tina CMS with i18n in any Next.js app that uses the same pattern: locale-based routes and JSON translation (or content) files.
