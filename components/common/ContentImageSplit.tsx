"use client"

import Image from "@/components/common/SeoImage";
import { contentImageSplitSeoContent as defaultContent } from '../contents/SEO/content';
import { useContent, ContentPath } from '../contents/useContent';
import { RichTextBlock } from './RichTextContent';

interface ContentImageSplitProps {
    contentPath?: ContentPath;
    content?: typeof defaultContent;
    headingTag?: 'h2' | 'h3';
}

export default function ContentImageSplit({
    contentPath,
    content,
    headingTag = 'h2',
}: ContentImageSplitProps) {
    const finalContent = useContent(contentPath, content || defaultContent);
    const HeadingTag = headingTag;

    return (
        <div className="px-4 py-8 .sm:px-6 lg:px-10">
            <div className="container mx-auto">
                <div className="flex flex-col gap-6 lg:flex-row  lg:gap-8">
                    {/* Text Content - Left Column (60-65% on desktop) */}
                    <div className="flex flex-col gap-4 lg:flex-[0_0_62%] lg:text-left">
                        {finalContent.title && (
                            <RichTextBlock
                                as="div"
                                content={finalContent.title}
                                defaultTag={HeadingTag}
                                style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)' }}
                                className="font-bold text-[#1E1F21] text-center lg:text-left"
                            />
                        )}
                        {finalContent.paragraphs && finalContent.paragraphs.length > 0 && (
                            <div className="flex flex-col gap-4" style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}>
                                {finalContent.paragraphs.map((paragraph, index) => (
                                    <RichTextBlock
                                        key={index}
                                        as="div"
                                        content={paragraph}
                                        defaultTag="p"
                                        className="leading-relaxed text-[#667085] text-center lg:text-left"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Image - Right Column (35-40% on desktop) */}
                    {finalContent.image && finalContent.image.src && (
                        <div className="relative flex-1 order-[-1] lg:order-1 lg:flex-[0_0_35%] aspect-[5/4] xl:aspect-auto 2xl:h-[480px] xl:h-[600px] overflow-hidden rounded-md">
                            <Image
                                src={finalContent.image.src}
                                seo={(finalContent.image as any)}
                                alt={finalContent.image.alt || 'Content Image Split'}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
