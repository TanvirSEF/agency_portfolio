'use client';

import { landingLogoScrollerContent as defaultContent } from './contents/Landing/content';
import { useContent, ContentPath } from './contents/useContent';
import LogoScroller from './common/logoScroller';
import { RichTextBlock } from './common/RichTextContent';

interface LandingLogoScrollerProps {
  contentPath?: ContentPath;
  content?: typeof defaultContent;
}

export default function LandingLogoScroller({
  contentPath,
  content,
}: LandingLogoScrollerProps) {
  const finalContent = useContent(contentPath, content || defaultContent);
  return (
    <div>
      <div className="flex flex-col items-center">
        {finalContent.title && (
          <RichTextBlock
            as="div"
            content={finalContent.title}
            defaultTag="h2"
            className="mt-[4.25rem] px-[1rem] text-center font-bold text-[#1E1F21] md:w-[48rem]"
            style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', lineHeight: '1.2' }}
          />
        )}
        {finalContent.description && (
          <RichTextBlock
            as="div"
            content={finalContent.description}
            defaultTag="p"
            className="mt-[3.25rem] text-center"
            style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}
          />
        )}
      </div>

      <div className="mt-[3.25rem] mb-[4.25rem]">
      <LogoScroller />
      </div>
    </div>
  );
}
