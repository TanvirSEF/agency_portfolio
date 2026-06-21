import { NextResponse } from 'next/server';
import {
  buildSitemapIndexXml,
  getLatestLastModified,
  resolveLocaleFromContext,
  resolveSitemapBaseUrl,
  splitLocaleSitemapEntries,
  type RouteContext,
} from '@/lib/localized-sitemap';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(_request: Request, context: RouteContext) {
  const locale = await resolveLocaleFromContext(context);

  if (!locale) {
    return new NextResponse('Not Found', {
      status: 404,
    });
  }

  const baseUrl = resolveSitemapBaseUrl();
  const { pageEntries, blogEntries } = splitLocaleSitemapEntries(locale);
  const xml = buildSitemapIndexXml([
    {
      loc: `${baseUrl}/${locale}/sitemap-pages.xml`,
      lastModified: getLatestLastModified(pageEntries),
    },
    {
      loc: `${baseUrl}/${locale}/sitemap-blogs.xml`,
      lastModified: getLatestLastModified(blogEntries),
    },
  ]);

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
