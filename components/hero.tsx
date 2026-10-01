'use client';

import Link from 'next/link';
import Image from '@/components/common/SeoImage';
import { RichTextBlock, RichTextInline } from '@/components/common/RichTextContent';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { type HTMLAttributes } from 'react';
import { heroContent as defaultContent } from './contents/Landing/content';
import { useContent, ContentPath } from './contents/useContent';
import CounterUp from '@/components/common/CounterUp';
import { scrollToContact } from '@/lib/scrollToContact';

type MotionLikeProps<T> = T & {
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  transition?: unknown;
  whileInView?: unknown;
  viewport?: unknown;
};

function MotionSection({
  initial: _initial,
  animate: _animate,
  exit: _exit,
  transition: _transition,
  whileInView: _whileInView,
  viewport: _viewport,
  ...props
}: MotionLikeProps<HTMLAttributes<HTMLElement>>) {
  return <section {...props} />;
}

function MotionDiv({
  initial: _initial,
  animate: _animate,
  exit: _exit,
  transition: _transition,
  whileInView: _whileInView,
  viewport: _viewport,
  ...props
}: MotionLikeProps<HTMLAttributes<HTMLDivElement>>) {
  return <div {...props} />;
}

function MotionParagraph({
  initial: _initial,
  animate: _animate,
  exit: _exit,
  transition: _transition,
  whileInView: _whileInView,
  viewport: _viewport,
  ...props
}: MotionLikeProps<HTMLAttributes<HTMLParagraphElement>>) {
  return <p {...props} />;
}

const motion = {
  section: MotionSection,
  div: MotionDiv,
  p: MotionParagraph,
};

interface HeroProps {
  contentPath?: ContentPath;
  content?: typeof defaultContent;
  titleTag?: 'h1' | 'h2' | 'h3';
  subtitleTag?: 'p' | 'h2' | 'h3' | 'h4';
}

export default function Hero({
  contentPath,
  content,
  titleTag = 'h1',
  subtitleTag = 'h2',
}: HeroProps) {
  const finalContent = useContent(contentPath, content || defaultContent);
  const easeOut = [0.22, 1, 0.36, 1] as const;

  return (
    <motion.section
      className="relative h-[max-content] bg-[#0A192F] pb-[3rem]"
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55, ease: easeOut }}
    >
      <div className="relative z-10 container mx-auto flex flex-col gap-18 px-6 pt-8 sm:pt-10 lg:pt-12">
        <div className="flex w-full flex-col items-center justify-between gap-8 lg:flex-row lg:items-center">
          <motion.div
            className="flex flex-1 flex-col items-center gap-4 lg:items-start xl:flex-5"
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: easeOut }}
          >
            <motion.div
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6, ease: easeOut }}
            >
              {finalContent.mainTitle && (
                <RichTextBlock
                  as="div"
                  content={finalContent.mainTitle}
                  defaultTag={titleTag}
                  className="text-center font-bold text-white uppercase lg:text-left [&_h1]:m-0 [&_h1]:text-[2.5rem] [&_h1]:leading-14 sm:[&_h1]:text-[3rem] lg:[&_h1]:leading-20 xl:[&_h1]:text-[4rem] [&_h2]:m-0 [&_h2]:text-[2.5rem] [&_h2]:leading-14 sm:[&_h2]:text-[3rem] lg:[&_h2]:leading-20 xl:[&_h2]:text-[4rem] [&_h3]:m-0 [&_h3]:text-[2.5rem] [&_h3]:leading-14 sm:[&_h3]:text-[3rem] lg:[&_h3]:leading-20 xl:[&_h3]:text-[4rem] [&_p]:m-0 [&_p]:text-[2.5rem] [&_p]:leading-14 sm:[&_p]:text-[3rem] lg:[&_p]:leading-20 xl:[&_p]:text-[4rem]"
                />
              )}

              {finalContent.subtitle && (
                <RichTextBlock
                  as="div"
                  content={finalContent.subtitle}
                  defaultTag={subtitleTag}
                  className="w-[330px] text-center font-semibold text-white uppercase min-[420px]:text-[1.6rem] md:text-[1.85rem] lg:w-full lg:text-left [&_h1]:m-0 [&_h1]:text-[1.4rem] [&_h1]:leading-8 lg:[&_h1]:leading-9 [&_h2]:m-0 [&_h2]:text-[1.4rem] [&_h2]:leading-8 lg:[&_h2]:leading-9 [&_h3]:m-0 [&_h3]:text-[1.4rem] [&_h3]:leading-8 lg:[&_h3]:leading-9 [&_h4]:m-0 [&_h4]:text-[1.4rem] [&_h4]:leading-8 lg:[&_h4]:leading-9 [&_p]:m-0 [&_p]:text-[1.4rem] [&_p]:leading-8 lg:[&_p]:leading-9"
                />
              )}
            </motion.div>
            {finalContent.description.desktop && (
              <motion.div
                className="my-3.5 hidden text-center leading-7 text-white sm:block md:w-[490px] lg:w-full lg:text-left lg:leading-relaxed xl:text-[1.15rem]"
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.55, ease: easeOut }}
              >
                <RichTextBlock
                  as="div"
                  content={finalContent.description.desktop}
                  defaultTag="p"
                  className="[&_p]:m-0 [&_p]:leading-relaxed"
                />
              </motion.div>
            )}

            {finalContent.description.mobile && (
              <motion.div
                className="my-6 block text-center text-[16px] leading-8 text-white uppercase min-[420px]:w-[390px] min-[420px]:text-[1rem] sm:hidden"
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.55, ease: easeOut }}
              >
                <RichTextBlock
                  as="div"
                  content={finalContent.description.mobile}
                  defaultTag="p"
                  className="[&_p]:m-0 [&_p]:leading-8"
                />
              </motion.div>
            )}
            <motion.div
              initial={{ y: 12, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: easeOut }}
            >
              <Button onClick={scrollToContact} className="h-[max-content] w-[max-content] rounded-full bg-[#06457F] px-5 py-4 text-white hover:bg-[#0474C4] hover:text-white">
                <RichTextInline content={finalContent.buttonText} />
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            className="relative hidden flex-1 items-center justify-center lg:flex xl:flex-4"
            initial={{ x: 36, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.22, duration: 0.75, ease: easeOut }}
          >
            <motion.div
              className="group relative aspect-[3/2] w-full max-w-[540px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-sm transition-all duration-300 hover:border-[#0474C4]/50"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: easeOut }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-xl">
                {finalContent.images.heroImage1 && (
                  <Image
                    src={finalContent.images.heroImage1}
                    seo={((finalContent.images as any).heroImage1Seo)}
                    alt={((finalContent.images as any).heroImage1Seo?.altText as string) || ''}
                    fill
                    priority
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 45vw, 540px"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* <CounterUp stats={finalContent.stats} color="#ffffff" /> */}
      </div>
      <motion.div
        className="pointer-events-none absolute right-0 bottom-0 z-[1]"
        initial={false}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: easeOut }}
      >
        <Image
          src={finalContent.images.heroAsset}
          seo={(finalContent.heroAsset as any)}
          alt={finalContent.heroAsset.alt}
          width={finalContent.heroAsset.width}
          height={finalContent.heroAsset.height}
          priority
          fetchPriority="high"
          sizes="(max-width: 1024px) 70vw, 783px"
        />
      </motion.div>
    </motion.section>
  );
}
