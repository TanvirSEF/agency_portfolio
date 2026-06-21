import { NextResponse } from 'next/server';
import llmsFile from '@/jsonContent/system/llms.json';

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
  const fallback = '# llms.txt\n# Configure this file in Tina CMS.';
  const content = resolveTextContent((llmsFile as PlainTextFile).content, fallback);
  const body = content.endsWith('\n') ? content : `${content}\n`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
