"use client"

import { useCallback, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { benefitsSectionContent as defaultContent } from '../contents/SEO/content';
import { useContent, ContentPath } from '../contents/useContent';
import { RichTextBlock, RichTextInline } from './RichTextContent';

interface BenefitsSectionProps {
    contentPath?: ContentPath;
    content?: typeof defaultContent;
}

export default function BenefitsSection({
    contentPath,
    content,
}: BenefitsSectionProps) {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const finalContent = useContent(contentPath, content || defaultContent);
    const { title, subtitle, benefits } = finalContent;
    const queryKey = 'benefit';

    const syncUrl = useCallback((index: number, historyMode: 'push' | 'replace' = 'push') => {
        if (typeof window === 'undefined') return;
        const nextParams = new URLSearchParams(window.location.search);
        if (index <= 0) {
            nextParams.delete(queryKey);
        } else {
            nextParams.set(queryKey, String(benefits[index]?.id ?? index + 1));
        }

        const nextSearch = nextParams.toString();
        const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}${window.location.hash}`;
        const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        if (nextUrl === currentUrl) return;

        window.history[historyMode === 'replace' ? 'replaceState' : 'pushState'](
            window.history.state,
            '',
            nextUrl
        );
    }, [benefits]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const applyStateFromUrl = () => {
            const params = new URLSearchParams(window.location.search);
            const rawValue = params.get(queryKey);

            if (!rawValue) {
                setActiveIndex((prev) => (prev === 0 ? prev : 0));
                return;
            }

            let nextIndex = benefits.findIndex((benefit) => String(benefit.id) === rawValue);
            if (nextIndex < 0) {
                const asNumber = Number(rawValue);
                if (Number.isInteger(asNumber)) {
                    const normalizedIndex = asNumber - 1;
                    if (normalizedIndex >= 0 && normalizedIndex < benefits.length) {
                        nextIndex = normalizedIndex;
                    }
                }
            }

            if (nextIndex < 0) {
                setActiveIndex((prev) => (prev === 0 ? prev : 0));
                syncUrl(0, 'replace');
                return;
            }

            setActiveIndex((prev) => (prev === nextIndex ? prev : nextIndex));
        };

        applyStateFromUrl();
        window.addEventListener('popstate', applyStateFromUrl);
        return () => window.removeEventListener('popstate', applyStateFromUrl);
    }, [benefits, syncUrl]);

    const handleBenefitSelect = (index: number) => {
        setActiveIndex(index);
        syncUrl(index, 'push');
    };

    return (
        <div className="container mx-auto px-4 xl:px-10 py-10">
            <div className="flex flex-col gap-12">
                {/* Header Section */}
                <div>
                    {title && (
                        <RichTextBlock
                            as="div"
                            content={title}
                            defaultTag="h2"
                            className="text-[#1E1F21] mx-auto text-center px-4 font-bold mt-2 mb-8"
                            style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', lineHeight: '1.2' }}
                        />
                    )}
                    {subtitle && (
                        <RichTextBlock
                            as="div"
                            content={subtitle}
                            defaultTag="p"
                            className="text-center text-gray-500 max-w-2xl mx-auto"
                            style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}
                        />
                    )}
                </div>

                {/* Tabs and Content Section */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Left Column - Tabs */}
                    <div className="shrink-0 lg:w-[40%]">
                        <div className="flex flex-col border-gray-200 border-gray-200 lg:pr-8">
                            {benefits.map((benefit, index) => (
                                <button
                                    key={benefit.id}
                                    onClick={() => handleBenefitSelect(index)}
                                    className={`group relative p-2 border-gray-200 flex items-center justify-between gap-4 py-4 text-left transition-all duration-300 ${index < benefits.length - 1
                                        ? 'border-b border-gray-200'
                                        : ''
                                        } ${activeIndex === index
                                            ? 'text-[#8C52FF]'
                                            : 'text-[#1E1F21] hover:text-[#8C52FF]'
                                        }`}
                                >
                                    <span
                                        className={`font-medium transition-all duration-300 ${activeIndex === index ? 'text-[#8C52FF]' : 'text-[#1E1F21]'
                                            }`}
                                        style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
                                    >
                                        <RichTextInline content={benefit.title} />
                                    </span>
                                    <ArrowRight
                                        className={`h-5 w-5 shrink-0 transition-all duration-300 ${activeIndex === index
                                            ? 'translate-x-0 text-[#8C52FF] opacity-100'
                                            : 'translate-x-[-8px] opacity-0 group-hover:translate-x-0 group-hover:opacity-50'
                                            }`}
                                    />
                                    {/* Active indicator line */}
                                    {activeIndex === index && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8C52FF] lg:left-auto lg:-right-8 lg:top-0 lg:bottom-auto lg:w-auto lg:h-1" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Content */}
                    <div className="flex-1 lg:w-[60%]">
                        <div className="relative min-h-[200px]">
                            {benefits.map((benefit, index) => (
                                <div
                                    key={benefit.id}
                                    className={`transition-all duration-500 ease-in-out ${activeIndex === index
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'
                                        }`}
                                >
                                    {Array.isArray(benefit.description) ? (
                                        benefit.description.map((desc, descIndex) => (
                                            <RichTextBlock
                                                key={descIndex}
                                                as="div"
                                                content={desc}
                                                defaultTag="p"
                                                className="leading-relaxed text-[#667085]"
                                                style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}
                                            />
                                        ))
                                    ) : (
                                        <RichTextBlock
                                            as="div"
                                            content={benefit.description}
                                            defaultTag="p"
                                            className="leading-relaxed text-[#667085]"
                                            style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
