"use client"

import { companyPotentialsSectionContentWebDevelopment as defaultContent } from '../contents/web-development/content';
import { useContent, ContentPath } from '../contents/useContent';
import { RichTextBlock } from './RichTextContent';

interface CompanyPotentialsSectionProps {
    contentPath?: ContentPath;
    content?: typeof defaultContent;
}

export default function CompanyPotentialsSection({
    contentPath,
    content,
}: CompanyPotentialsSectionProps) {
    const finalContent = useContent(contentPath, content || defaultContent);
    const { subtitle, title, features } = finalContent;

    return (
        <div className="px-4 py-8 container mx-auto lg:px-10">
            <div className="flex flex-col gap-8 lg:gap-12">
                {/* Header Section */}
                <div className="text-center">
                    {subtitle && (
                        <RichTextBlock
                            as="div"
                            content={subtitle}
                            defaultTag="p"
                            className="text-[#06457F] text-[1.25rem] font-medium mb-3"
                        />
                    )}
                    {title && (
                        <RichTextBlock
                            as="div"
                            content={title}
                            defaultTag="h2"
                            className="text-[#1E1F21] font-bold"
                            style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', lineHeight: '1.2' }}
                        />
                    )}
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={feature.id}
                            className="flex flex-col gap-4"
                        >
                            {/* Number */}
                            <div className="flex items-center gap-4">
                                <span
                                    className="text-[#06457F] flex w-full text-center justify-center items-center text-[1.25rem] font-medium"
                                >
                                    {String(feature.id).padStart(2, '0')}
                                </span>
                            </div>

                            {/* Title */}
                            <RichTextBlock
                                as="div"
                                content={feature.title}
                                defaultTag="h3"
                                className="text-[#1E1F21] text-center uppercase text-[1.125rem] font-bold"
                                style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)', lineHeight: '1.3' }}
                            />

                            {/* Description */}
                            <RichTextBlock
                                as="div"
                                content={feature.description}
                                defaultTag="p"
                                className="text-[#667085] text-center leading-relaxed"
                                style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
