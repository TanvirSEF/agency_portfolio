'use client';
import Image from '@/components/common/SeoImage';
import { landingMarketingAgencyContent as defaultContent } from './contents/Landing/content';
import { useContent, ContentPath } from './contents/useContent';
import { RichTextBlock } from './common/RichTextContent';

// Normalize image src from Tina (may be stored without leading slash)
function normalizeImageSrc(src: string | undefined): string {
  if (!src || typeof src !== 'string') return defaultContent.image.src;
  return src.startsWith('/') || src.startsWith('http') ? src : `/${src}`;
}

interface LandingMarketingAgencyProps {
  contentPath?: ContentPath;
  content?: typeof defaultContent;
}

export default function LandingMarketingAgency({
  contentPath,
  content,
}: LandingMarketingAgencyProps) {
  const finalContent = useContent(contentPath, content || defaultContent);
  // Main image for the card comes from Tina marketingAgency.image (Main Image).
  // If not set in Tina yet, fall back to the default image from TS content.
  const rawImageSrc =
    (finalContent.image && finalContent.image.src) ||
    defaultContent.image.src;

  const imageSrc = normalizeImageSrc(rawImageSrc);
  const imageAlt = finalContent.image?.alt ?? defaultContent.image.alt;
  const imageSizes = finalContent.image?.sizes ?? defaultContent.image.sizes;

  return (
    <div
      className="bg-none xl:bg-[url('/_ignore_dynamic_bgimage_/')] xl:bg-contain xl:bg-bottom xl:bg-no-repeat"
      style={{
        backgroundImage: undefined,
        ...(finalContent.backgroundImage
          ? { ['--tw-bg-opacity' as any]: undefined, backgroundImage: undefined }
          : {}),
        ...(finalContent.backgroundImage
          ? { ['--bg-image' as any]: `url('${finalContent.backgroundImage}')` }
          : {}),
      }}
    >
      <div className="container mx-auto flex flex-col gap-10 px-4 py-8 lg:px-12">
        {finalContent.title && (
          <RichTextBlock
            as="div"
            content={finalContent.title}
            defaultTag="h2"
            className="mb-4 text-center leading-tight font-bold text-[#1E1F21]"
            style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)' }}
          />
        )}

        <div className="flex w-full flex-col gap-6 sm:mb-4 md:flex-row md:items-start md:gap-6 lg:gap-8">
          <div className="relative aspect-600/370 w-full overflow-hidden rounded-lg md:w-1/2 md:shrink-0">
            <Image
              src={imageSrc}
              seo={(finalContent.image as any)}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes={imageSizes}
            />
          </div>
          {(finalContent.description || finalContent.description2) && (
            <div className="flex w-full flex-col gap-4 md:w-1/2 md:flex-1">
              {finalContent.description && (
                <RichTextBlock
                  as="div"
                  content={finalContent.description}
                  defaultTag="p"
                  className="leading-relaxed text-[#464b58] font-semibold text-left"
                  style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}
                />
              )}
              {finalContent.description2 && (
                Array.isArray(finalContent.description2) ? (
                  <div className="flex flex-col gap-4">
                    {finalContent.description2.map((paragraph, index) => (
                      <RichTextBlock
                        key={index}
                        as="div"
                        content={paragraph}
                        defaultTag="p"
                        className="leading-relaxed text-[#667085] text-left"
                        style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}
                      />
                    ))}
                  </div>
                ) : (
                  <RichTextBlock
                    as="div"
                    content={finalContent.description2}
                    defaultTag="p"
                    className="leading-relaxed text-[#667085] text-left"
                    style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}
                  />
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
