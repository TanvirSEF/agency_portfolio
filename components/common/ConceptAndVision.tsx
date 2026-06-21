"use client"

import ConceptCard from "./ConceptCard";
import { conceptAndVisionContentAboutUs as defaultContent } from "../contents/about-us/content";
import { ContentPath, useContent } from "../contents/useContent";
import { RichTextBlock } from "./RichTextContent";

interface ConceptAndVisionProps {
    contentPath?: ContentPath;
    content?: typeof defaultContent;
}

export default function ConceptAndVision({ contentPath, content }: ConceptAndVisionProps) {
    const finalContent = useContent(contentPath, content || defaultContent);
    return (
        <div>
            <div className="px-4 py-8 container flex flex-col items-center gap-6 mx-auto lg:px-10">
                <RichTextBlock
                    as="div"
                    content={finalContent.title}
                    defaultTag="h2"
                    className="font-bold text-center mx-auto"
                    style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', lineHeight: '1.2' }}
                />
                <RichTextBlock
                    as="div"
                    content={finalContent.description}
                    defaultTag="p"
                    className="max-w-[1200px] text-[#667085] mt-2 mb-8 mx-auto text-center"
                    style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}
                />

                <div className="grid w-full items-start gap-8 lg:grid-cols-3">
                    {finalContent.cards.map((card) => (
                        <ConceptCard
                            key={card.id}
                            imageSrc={card.imageSrc}
                            imageSeo={(card as any).imageSeo}
                            title={card.title}
                            description={card.description}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
