import createMiddleware from 'next-intl/middleware';
import {NextRequest, NextResponse} from 'next/server';
import {routing} from '@/i18n/routing';
import {
  getCanonicalPathFromLocalizedPath,
  getLocalizedPath,
  getLocalizedPathname,
  normalizeRoutePath,
} from '@/lib/route-slugs';

const intlMiddleware = createMiddleware(routing);
const localeSet = new Set(routing.locales);

function preserveIntlMiddlewareState(targetResponse: NextResponse, intlResponse: NextResponse) {
  const overriddenHeaders = intlResponse.headers.get('x-middleware-override-headers');

  if (overriddenHeaders) {
    targetResponse.headers.set('x-middleware-override-headers', overriddenHeaders);

    for (const headerName of overriddenHeaders.split(',').map((header) => header.trim()).filter(Boolean)) {
      const overrideValue = intlResponse.headers.get(`x-middleware-request-${headerName}`);

      if (overrideValue !== null) {
        targetResponse.headers.set(`x-middleware-request-${headerName}`, overrideValue);
      }
    }
  }

  for (const cookie of intlResponse.cookies.getAll()) {
    targetResponse.cookies.set(cookie);
  }

  return targetResponse;
}

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isTinaRoute = pathname.startsWith('/admin') || pathname.startsWith('/tina-admin');

  if (isTinaRoute) {
    // Do not apply any extra browser/basic auth for Tina routes.
    // Rely on Tina's own authentication for /admin and /tina-admin.
    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);
  const locale = segments[0];
  const hasLocalePrefix = !!locale && localeSet.has(locale as (typeof routing.locales)[number]);

  // Redirect homepage to default locale so URL is /en.
  if (!hasLocalePrefix && pathname === '/') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${routing.defaultLocale}`;
    return NextResponse.redirect(redirectUrl, 307);
  }

  const intlResponse = intlMiddleware(request);

  if (hasLocalePrefix) {
    const localizedPath = normalizeRoutePath(segments.slice(1).join('/'));
    const localizedPayItForwardPath = getLocalizedPath(locale, 'pay-it-forward');
    const localizedBlogsPath = getLocalizedPath(locale, 'blogs');

    // Legacy/bad nested URLs under Pay It Forward should point to blog posts.
    // Example: /sv/ge-vidare/{slug} -> /sv/blogg/{slug}
    if (
      locale === 'sv' &&
      localizedPath.startsWith(`${localizedPayItForwardPath}/`) &&
      localizedBlogsPath &&
      localizedPayItForwardPath !== localizedBlogsPath
    ) {
      const trailingPath = localizedPath.slice(localizedPayItForwardPath.length + 1);
      if (trailingPath) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = `/${locale}/${localizedBlogsPath}/${trailingPath}`;
        return preserveIntlMiddlewareState(NextResponse.redirect(redirectUrl, 307), intlResponse);
      }
    }

    const canonicalPath = getCanonicalPathFromLocalizedPath(locale, localizedPath);
    const expectedLocalizedPath = getLocalizedPath(locale, canonicalPath);

    // Canonicalize URL to CMS-defined slug for current locale.
    if (localizedPath !== expectedLocalizedPath) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = getLocalizedPathname(locale, canonicalPath);
      return preserveIntlMiddlewareState(NextResponse.redirect(redirectUrl, 307), intlResponse);
    }

    // Route resolution: localized slug -> internal canonical route.
    if (canonicalPath !== localizedPath) {
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname = `/${locale}${canonicalPath ? `/${canonicalPath}` : ''}`;
      return preserveIntlMiddlewareState(NextResponse.rewrite(rewriteUrl), intlResponse);
    }
  }

  return intlResponse;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
