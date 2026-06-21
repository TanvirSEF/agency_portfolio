import { NextResponse } from 'next/server';

export const revalidate = 0;

export function GET(request: Request) {
  const iconUrl = new URL('/assets/icons/favicon.svg', request.url);

  return NextResponse.redirect(iconUrl, {
    status: 308,
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
