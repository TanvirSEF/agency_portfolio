"use client"

import Marquee from "react-fast-marquee";
import SlideCards from "./SlideCards";
import { cardSliderRightToLeftContent as defaultContent } from '../contents/SEO/content';
import { useContent, ContentPath } from '../contents/useContent';
import { RichTextBlock } from './RichTextContent';

interface CardSliderRightToLeftProps {
    contentPath?: ContentPath;
    content?: typeof defaultContent;
    headingTag?: 'h2' | 'h3';
}

export default function CardSliderRightToLeft({
    contentPath,
    content,
    headingTag = 'h2',
}: CardSliderRightToLeftProps) {
    const finalContent = useContent(contentPath, content || defaultContent);
    const cards = finalContent.cards;
    const subtitle = 'subtitle' in finalContent && typeof finalContent.subtitle === 'string' ? finalContent.subtitle : undefined;
    const title = finalContent.title;
    const description = finalContent.description;
    const HeadingTag = headingTag;

    // Duplicate cards for seamless infinite scroll with unique keys
    const duplicatedCards = [...cards, ...cards].map((card, index) => ({
        ...card,
        uniqueKey: `${card.id}-${index}`,
    }));

    return (
        <div className="container mx-auto px-4 xl:px-10 py-10">
            <div className="flex flex-col gap-8">
                <div>
                    {subtitle && (
                        <RichTextBlock
                            as="div"
                            content={subtitle}
                            defaultTag="p"
                            className="text-[#06457F] text-[1.25rem] font-medium mb-3 text-center"
                        />
                    )}
                    {title && (
                        <RichTextBlock
                            as="div"
                            content={title}
                            defaultTag={HeadingTag}
                            className="text-[#1E1F21] mx-auto text-center px-4 font-bold mt-2 mb-8"
                            style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', lineHeight: '1.2' }}
                        />
                    )}
                    {description && (
                        <RichTextBlock
                            as="div"
                            content={description}
                            defaultTag="p"
                            className="text-center text-gray-500"
                            style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}
                        />
                    )}
                </div>
                <div className="mt-8">
                    <Marquee direction="left" speed={50} pauseOnHover={true} gradient={false} gradientColor="#F2F3F6" gradientWidth={100}>
                        <SlideCards cards={duplicatedCards} />
                    </Marquee>
                </div>
            </div>
        </div>
    );
}
