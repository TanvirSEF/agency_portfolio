import { NextResponse } from 'next/server';
import robotsFile from '@/jsonContent/system/robots.json';

type PlainTextFile = {
  content?: string;
};

function resolveTextContent(value: unknown, fallback: string): string {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? value : fallback;
}

export function GET() {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://webblymedia.com')
    .replace(/meida\.com/gi, 'media.com');
  const fallback = `User-agent: *\nAllow: /\nSitemap: ${baseUrl}/en/sitemap.xml\nSitemap: ${baseUrl}/sv/sitemap.xml`;
  const content = resolveTextContent((robotsFile as PlainTextFile).content, fallback);
  const body = content.endsWith('\n') ? content : `${content}\n`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
