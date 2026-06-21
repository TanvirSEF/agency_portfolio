"use client"

import Image from '@/components/common/SeoImage';
import { RichTextBlock } from './RichTextContent';

interface Card {
    id: number;
    title: string;
    description: string;
    image: string;
    imageSeo?: unknown;
}

interface SlideCardsProps {
    cards: Card[];
}

export default function SlideCards({ cards }: SlideCardsProps) {
    return (
        <div className="flex">
            {cards.map((card, index) => {
                const uniqueKey = (card as any).uniqueKey || `${card.id}-${index}`;

                return (
                    <div
                        key={uniqueKey}
                        className="mx-3 flex min-w-[320px] max-w-[365px] shrink-0 flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#B189FF] hover:shadow-md md:min-w-[366px] lg:min-w-[365px]"
                    >
                        {/* SVG Image */}
                        <div className="mb-4 flex h-14 w-14 items-center justify-center">
                            <Image
                                src={card.image}
                                seo={card.imageSeo as any}
                                alt={card.title}
                                width={56}
                                height={56}
                                className="object-contain"
                            />
                        </div>

                        {/* Title */}
                        <RichTextBlock
                            as="div"
                            content={card.title}
                            defaultTag="h3"
                            className="mb-3 font-bold uppercase text-[#1E1F21]"
                            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)' }}
                        />

                        {/* Description */}
                        <RichTextBlock
                            as="div"
                            content={card.description}
                            defaultTag="p"
                            className="leading-relaxed text-[#667085]"
                            style={{ fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)' }}
                        />
                    </div>
                );
            })}
        </div>
    );
}
