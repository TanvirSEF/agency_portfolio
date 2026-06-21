"use client"

import Image from "@/components/common/SeoImage";
import { Button } from "../ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { otherHeroContent as defaultContent } from '../contents/SEO/content';
import { useContent, ContentPath } from '../contents/useContent';
import { scrollToContact } from '@/lib/scrollToContact';
import { usePathname } from "next/navigation";
import { RichTextBlock, RichTextInline } from './RichTextContent';

interface OtherHeroProps {
  contentPath?: ContentPath;
  content?: typeof defaultContent;
  titleTag?: 'h1' | 'h2';
  pageNameTag?: 'p' | 'h2' | 'h3';
}

export default function OtherHero({
  contentPath,
  content,
  titleTag = 'h1',
  pageNameTag = 'p',
}: OtherHeroProps) {
  const finalContent = useContent(contentPath, content || defaultContent);
  const pathname = usePathname();
  const easeOut = [0.22, 1, 0.36, 1] as const;

  const pathSegments = (pathname || '').split('/').filter(Boolean);
  const locale = pathSegments[0] === 'en' || pathSegments[0] === 'sv' ? pathSegments[0] : null;
  const pathWithoutLocale = locale ? pathSegments.slice(1) : pathSegments;
  const humanizePathSegment = (segment: string) => segment
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
  const breadcrumbHomeLabel = locale === 'sv' ? 'Hem' : 'Home';
  const breadcrumbServicesLabel = locale === 'sv' ? 'Tjanster' : 'Services';
  const localePrefix = locale ? `/${locale}` : '';
  const homeHref = localePrefix || '/';
  const breadcrumbItems = [
    { label: breadcrumbHomeLabel, href: homeHref },
    ...pathWithoutLocale.map((segment, index) => {
      const isLast = index === pathWithoutLocale.length - 1;
      const isServicesSegment = segment === 'services';
      const fallbackLabel = humanizePathSegment(segment);
      const label = isServicesSegment
        ? breadcrumbServicesLabel
        : isLast
          ? finalContent.pageName || fallbackLabel
          : fallbackLabel;
      const segmentHref = `${localePrefix}/${pathWithoutLocale.slice(0, index + 1).join('/')}`.replace(/\/+/g, '/');
      const href = isLast ? undefined : isServicesSegment ? homeHref : segmentHref;

      return { label, href };
    }),
  ];

  return (
    <motion.div
      className="relative lg:h-[650px] bg-[#06010E] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55, ease: easeOut }}
    >
      {/* Background decorations */}
      {finalContent.backgroundDecoration?.src && (
        <motion.div
          initial={{ x: -24, y: -12, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.7, ease: easeOut }}
          aria-hidden="true"
        >
          <Image
            src={finalContent.backgroundDecoration.src}
            alt=""
            width={finalContent.backgroundDecoration.width || 500}
            height={finalContent.backgroundDecoration.height || 500}
            className={finalContent.backgroundDecoration.className}
            style={{ objectFit: 'contain', maxHeight: '120%' }}
          />
        </motion.div>
      )}

      {/* Container with responsive layout */}
      <div className="px-4 py-8 container  mx-auto flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-12 lg:py-16 lg:px-10 xl:gap-16">

        {/* Mobile: Image first (order-1), Desktop: Content first (lg:order-1) */}
        <motion.div
          className="mt-8 flex-1 2xl:min-w-[810px] order-2 z-10 lg:order-1 lg:mt-0"
          initial={{ y: 28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.7, ease: easeOut }}
        >
          {breadcrumbItems.length > 1 && (
            <motion.nav
              aria-label="Breadcrumb"
              className="mb-4 text-[#F9F6FF]/80 text-sm"
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.14, duration: 0.45, ease: easeOut }}
            >
              <ol className="flex flex-wrap items-center gap-2">
                {breadcrumbItems.map((item, index) => (
                  <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                    {item.href ? (
                      <Link href={item.href} className="transition-colors hover:text-white">
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-white">{item.label}</span>
                    )}
                    {index < breadcrumbItems.length - 1 && <span aria-hidden="true">/</span>}
                  </li>
                ))}
              </ol>
            </motion.nav>
          )}
          {finalContent.pageName && (
            <motion.div
              className="text-[#F9F6FF] uppercase tracking-widest font-semibold text-2xl"
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.18, duration: 0.55, ease: easeOut }}
            >
              <RichTextBlock as="div" content={finalContent.pageName} defaultTag={pageNameTag} />
            </motion.div>
          )}
          {finalContent.title && (
            <motion.div
              className="text-white uppercase font-bold mt-2 mb-8 max-w-[530px] lg:mb-6"
              style={{ fontSize: 'clamp(2rem, 5vw, 2.7rem)', lineHeight: '1.2' }}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.55, ease: easeOut }}
            >
              <RichTextBlock as="div" content={finalContent.title} defaultTag={titleTag} />
            </motion.div>
          )}
          {finalContent.description && (
            <motion.div
              className="text-[#F9F6FF] mb-8 lg:mb-14"
              style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.22, duration: 0.55, ease: easeOut }}
            >
              <RichTextBlock as="div" content={finalContent.description} defaultTag="p" />
            </motion.div>
          )}
          {finalContent.button?.text && (
            <motion.div
              initial={{ y: 12, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: easeOut }}
            >
              {finalContent.button.href === '/contact' ? (
                <Button onClick={scrollToContact} className="rounded-full bg-[#8C52FF] px-8 py-6 text-white hover:bg-[#7941E6] transition-colors uppercase">
                  <RichTextInline content={finalContent.button.text} />
                </Button>
              ) : (
                <Button asChild className="rounded-full bg-[#8C52FF] px-8 py-6 text-white hover:bg-[#7941E6] transition-colors">
                  <Link href={finalContent.button.href || '/'} className="uppercase">
                    <RichTextInline content={finalContent.button.text} />
                  </Link>
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Mobile: Content second (order-2), Desktop: Image second (lg:order-2) */}
        <motion.div
          className="w-full flex justify-center lg:justify-end items-start order-1 self-start lg:order-2 lg:flex-1"
          initial={{ x: 34, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.75, ease: easeOut }}
        >
          <div
            className="w-full self-center relative min-[540px]:aspect-auto lg:aspect-480/330 lg:h-auto min-[540px]:h-[180px] md:h-[220px] aspect-480/330 overflow-visible lg:max-w-[500px]"
            aria-label={finalContent.mainImage?.alt || 'Hero image'}
          >
            {finalContent.mainImage?.src && (
              <div className="relative h-full w-full overflow-hidden rounded-md">
                <Image
                  src={finalContent.mainImage.src}
                  seo={(finalContent.mainImage as any)}
                  alt={finalContent.mainImage.alt || 'Hero image'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 500px"
                />
              </div>
            )}
            {finalContent.floatingImage?.src && (
              <>
                <style>{`
                  @keyframes other-hero-float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                  }
                  .other-hero-float { animation: other-hero-float 4s ease-in-out infinite; }
                `}</style>
                <div
                  className={
                    finalContent.floatingImage.className
                      ? `other-hero-float ${finalContent.floatingImage.className} z-30`
                      : 'other-hero-float absolute right-0 bottom-[-40px] z-30'
                  }
                  aria-hidden="true"
                >
                  <Image
                    src={finalContent.floatingImage.src}
                    seo={(finalContent.floatingImage as any)}
                    alt=""
                    width={finalContent.floatingImage.width || 90}
                    height={finalContent.floatingImage.height || 90}
                    className="h-full w-full"
                    style={{ objectFit: 'contain', maxHeight: '120%' }}
                  />
                </div>
              </>
            )}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
