'use client';

import NextImage, { type ImageProps } from 'next/image';
import { toInlineImageSeo, type InlineImageSeo } from '@/lib/image-seo';

type SeoImageProps = ImageProps & {
  seo?: InlineImageSeo | null;
};

export default function SeoImage({ seo: inlineSeo, ...props }: SeoImageProps) {
  const localSeo = toInlineImageSeo(inlineSeo);
  const seo = localSeo;

  const alt = typeof seo?.altText === 'string' && seo.altText.trim().length > 0
    ? seo.altText
    : props.alt;

  const title = typeof seo?.title === 'string' && seo.title.trim().length > 0
    ? seo.title
    : props.title;

  return (
    <NextImage
      {...props}
      alt={alt}
      title={title}
      {...(seo?.caption ? { 'data-image-caption': seo.caption } : {})}
      {...(seo?.description ? { 'data-image-description': seo.description } : {})}
      {...(seo?.fileUrl ? { 'data-image-file-url': seo.fileUrl } : {})}
    />
  );
}
