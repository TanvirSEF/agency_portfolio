"use client"

import LogoScroller from "./logoScroller";
import { partnersLogoContent as defaultContent } from '../contents/partnersLogo/content';
import { useContent, ContentPath } from '../contents/useContent';
import { RichTextBlock } from './RichTextContent';

interface PartnersLogoProps {
  contentPath?: ContentPath;
  content?: typeof defaultContent;
}

export default function PartnersLogo({
  contentPath,
  content,
}: PartnersLogoProps) {
  const finalContent = useContent(contentPath, content || defaultContent);
  
  return (
    <div className="h-[343px] overflow-hidden bg-[#8C52FF] flex flex-col items-center gap-8 justify-center">
        {finalContent.title && (
          <RichTextBlock
            as="div"
            content={finalContent.title}
            defaultTag="h2"
            className="font-bold px-4 text-white text-center"
            style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)' }}
          />
        )}
        <LogoScroller />
    </div>
  );
}
