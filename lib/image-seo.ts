export type ImageSeoEntry = {
  fileUrl?: string;
  altText?: string;
  title?: string;
  caption?: string;
  description?: string;
};

export type InlineImageSeo = Partial<ImageSeoEntry> & {
  alt?: string;
};

function readNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function decodeSafe(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function toInlineImageSeo(value: unknown): ImageSeoEntry | undefined {
  if (!value || typeof value !== 'object') return undefined;

  const candidate = value as InlineImageSeo;
  const entry: ImageSeoEntry = {
    ...(readNonEmptyString(candidate.fileUrl) ? { fileUrl: readNonEmptyString(candidate.fileUrl) } : {}),
    ...(readNonEmptyString(candidate.altText) || readNonEmptyString(candidate.alt)
      ? { altText: readNonEmptyString(candidate.altText) ?? readNonEmptyString(candidate.alt) }
      : {}),
    ...(readNonEmptyString(candidate.title) ? { title: readNonEmptyString(candidate.title) } : {}),
    ...(readNonEmptyString(candidate.caption) ? { caption: readNonEmptyString(candidate.caption) } : {}),
    ...(readNonEmptyString(candidate.description) ? { description: readNonEmptyString(candidate.description) } : {}),
  };

  return Object.keys(entry).length > 0 ? entry : undefined;
}

export function normalizeImagePath(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';

  const withoutHash = trimmed.split('#')[0];
  const withoutQuery = withoutHash.split('?')[0];

  let pathname = withoutQuery;
  if (/^https?:\/\//i.test(withoutQuery)) {
    try {
      pathname = new URL(withoutQuery).pathname;
    } catch {
      pathname = withoutQuery;
    }
  }

  pathname = decodeSafe(pathname).replace(/\\/g, '/');
  if (!pathname) return '';
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}
