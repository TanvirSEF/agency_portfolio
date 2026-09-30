'use client';

import Link from 'next/link';
import { RichTextBlock, RichTextInline } from '@/components/common/RichTextContent';
import { Button } from './ui/button';
import { scrollToContact } from '@/lib/scrollToContact';
import { landingChooseContent as defaultContent } from './contents/Landing/content';
import { useContent, ContentPath } from './contents/useContent';

interface LandingChooseProps {
  contentPath?: ContentPath;
  content?: typeof defaultContent;
}

export default function LandingChoose({
  contentPath,
  content,
}: LandingChooseProps) {
  const finalContent = useContent(contentPath, content || defaultContent);

  return (
    <div className="px-[1rem] py-8 sm:px-[2rem]">
      <div className="container mx-auto">
        {/* Header Section */}
        {(finalContent.title || finalContent.subtitle) && (
          <div className="mb-10 text-center lg:mb-12">
            {finalContent.title && (
              <RichTextBlock
                as="div"
                content={finalContent.title}
                defaultTag="h2"
                className="mb-6 leading-tight font-bold text-[#1E1F21] [&_h1]:m-0 [&_h1]:text-[clamp(2rem,5vw,2.75rem)] [&_h2]:m-0 [&_h2]:text-[clamp(2rem,5vw,2.75rem)] [&_p]:m-0 [&_p]:text-[clamp(2rem,5vw,2.75rem)]"
              />
            )}
            {finalContent.subtitle && (
              <RichTextBlock
                as="div"
                content={finalContent.subtitle}
                defaultTag="p"
                className="mx-auto leading-relaxed text-[#1E1F21] lg:max-w-2xl [&_p]:m-0 [&_p]:text-[clamp(1rem,2.5vw,1.25rem)] [&_p]:leading-relaxed"
              />
            )}
          </div>
        )}

        {/* Benefits Grid - Two Columns on Desktop, Single Column on Mobile */}
        <div className="mb-14 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:mb-12 lg:gap-10">
          {finalContent.benefits.map((benefit, index) => (
            <div key={index} className="flex gap-4 sm:gap-5">
              {/* Purple Checkmark Icon */}
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#06457F]">
                <svg
                  className="h-[1rem] w-[1rem] text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              </div>

              {/* Content */}
              <div className="flex-1">
                <RichTextBlock
                  as="div"
                  content={benefit.title}
                  defaultTag="h3"
                  className="mb-2 leading-tight font-bold text-[#1E1F21] [&_h2]:m-0 [&_h2]:text-[clamp(1.125rem,3vw,1.25rem)] [&_h3]:m-0 [&_h3]:text-[clamp(1.125rem,3vw,1.25rem)] [&_p]:m-0 [&_p]:text-[clamp(1.125rem,3vw,1.25rem)]"
                />
                <RichTextBlock
                  as="div"
                  content={benefit.description}
                  defaultTag="p"
                  className="leading-relaxed text-[#667085] [&_p]:m-0 [&_p]:text-[clamp(0.95rem,2vw,1.125rem)] [&_p]:leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Button */}
        <div className="flex justify-center">
          {finalContent.buttonLink === '/contact' ? (
            <Button onClick={scrollToContact} className="rounded-full bg-[#06457F] px-8 py-6 text-white">
              <RichTextInline content={finalContent.buttonText} />
            </Button>
          ) : (
            <Button asChild className="rounded-full bg-[#06457F] px-8 py-6 text-white">
              <Link href={finalContent.buttonLink}>
                <RichTextInline content={finalContent.buttonText} />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
