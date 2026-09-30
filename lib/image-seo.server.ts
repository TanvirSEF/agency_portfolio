import 'server-only';

import { normalizeImagePath, type ImageSeoEntry } from './image-seo';

type ImageObjectSchema = {
  '@type': 'ImageObject';
  contentUrl: string;
  url: string;
  name?: string;
  caption?: string;
  description?: string;
};

function toAbsoluteUrl(pathname: string, baseUrl: string): string {
  if (/^https?:\/\//i.test(pathname)) {
    return pathname;
  }

  const normalizedBaseUrl = baseUrl.replace(/\/$/, '');
  return `${normalizedBaseUrl}${pathname.startsWith('/') ? '' : '/'}${pathname}`;
}

export function getImageSeoSchemaGraph(baseUrl: string, _locale?: string): ImageObjectSchema[] {
  // Static brand assets for ImageObject schema graph
  const defaultEntries: ImageSeoEntry[] = [
    {
      fileUrl: '/logo-zephlo.png',
      altText: 'Zephlo Tech Logo',
      title: 'Zephlo Tech',
    },
    {
      fileUrl: '/hero-image1.png',
      altText: 'Webbly Media Digital Solutions',
      title: 'Webbly Media',
    },
  ];

  return defaultEntries.map((entry) => {
    const normalizedPath = normalizeImagePath(entry.fileUrl || '');
    const absoluteUrl = toAbsoluteUrl(normalizedPath, baseUrl);
    const name = entry.title || entry.altText;

    return {
      '@type': 'ImageObject',
      contentUrl: absoluteUrl,
      url: absoluteUrl,
      ...(name ? { name } : {}),
      ...(entry.caption ? { caption: entry.caption } : {}),
      ...(entry.description ? { description: entry.description } : {}),
    };
  });
}
