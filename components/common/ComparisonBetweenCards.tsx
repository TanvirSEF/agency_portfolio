"use client"

import { Check, X } from 'lucide-react';
import { comparisonBetweenCardsContent as defaultContent } from '../contents/comparison-between-cards/content';
import { useContent, ContentPath } from '../contents/useContent';
import { RichTextBlock, RichTextInline } from './RichTextContent';

interface ComparisonBetweenCardsProps {
    contentPath?: ContentPath;
    content?: typeof defaultContent;
}

export default function ComparisonBetweenCards({
    contentPath,
    content,
}: ComparisonBetweenCardsProps) {
    const finalContent = useContent(contentPath, content || defaultContent);
    const { title, agencyData, freelancerData } = finalContent;

    return (
        <div className="container mx-auto px-4 xl:px-10 py-8">
            <div className="flex flex-col gap-12">
                {/* Title */}
                <RichTextBlock
                    as="div"
                    content={title}
                    defaultTag="h2"
                    className="text-[#1E1F21] mx-auto text-center px-4 font-bold"
                    style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: '1.2' }}
                />

                {/* Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {/* Digital Marketing Firm Card */}
                    <div className="group relative justify-self-end rounded-lg border-2 border-[#E5E7EB] lg:w-[480px] p-6 lg:p-8 shadow-sm transition-all duration-300 hover:border-[#06457F] hover:shadow-lg">
                        <RichTextBlock
                            as="div"
                            content={agencyData.title}
                            defaultTag="h3"
                            className="mb-6 font-bold text-[#1E1F21] uppercase"
                            style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)' }}
                        />

                        {/* Pros Section */}
                        <div className="mb-6">
                            <ul className="space-y-3">
                                {agencyData.pros.map((pro, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <Check className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#16C60C' }} />
                                        <span
                                            className="leading-relaxed text-[#1E1F21]"
                                            style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
                                        >
                                            <RichTextInline content={pro} />
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Cons Section */}
                        <div>
                            <ul className="space-y-3">
                                {agencyData.cons.map((con, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <X className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#F03A17' }} />
                                        <span
                                            className="leading-relaxed text-[#1E1F21]"
                                            style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
                                        >
                                            <RichTextInline content={con} />
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Individual Digital Marketer Card */}
                    <div className="group justify-self-start lg:w-[480px] relative rounded-lg border-2 border-[#E5E7EB] bg-white p-6 lg:p-8 shadow-sm transition-all duration-300 hover:border-[#06457F] hover:shadow-lg">
                        <RichTextBlock
                            as="div"
                            content={freelancerData.title}
                            defaultTag="h3"
                            className="mb-6 font-bold text-[#1E1F21] uppercase"
                            style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)' }}
                        />

                        {/* Pros Section */}
                        <div className="mb-6">
                            <ul className="space-y-3">
                                {freelancerData.pros.map((pro, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <Check className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#16C60C' }} />
                                        <span
                                            className="leading-relaxed text-[#1E1F21]"
                                            style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
                                        >
                                            <RichTextInline content={pro} />
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Cons Section */}
                        <div>
                            <ul className="space-y-3">
                                {freelancerData.cons.map((con, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <X className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#F03A17' }} />
                                        <span
                                            className="leading-relaxed text-[#1E1F21]"
                                            style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
                                        >
                                            <RichTextInline content={con} />
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
