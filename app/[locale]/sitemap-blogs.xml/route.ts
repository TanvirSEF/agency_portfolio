import { NextResponse } from 'next/server';
import {
  buildUrlSetXml,
  resolveLocaleFromContext,
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

  const { blogEntries } = splitLocaleSitemapEntries(locale);
  const xml = buildUrlSetXml(blogEntries);

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
