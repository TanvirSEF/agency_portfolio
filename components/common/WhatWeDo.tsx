"use client"

import Image from "@/components/common/SeoImage";
import { whatWeDoContentAboutUs as defaultContent } from "../contents/about-us/content";
import { ContentPath, useContent } from "../contents/useContent";
import { RichTextBlock, RichTextInline, richTextToPlainText } from "./RichTextContent";

interface WhatWeDoProps {
    contentPath?: ContentPath;
    content?: typeof defaultContent;
}

export default function WhatWeDo({ contentPath, content }: WhatWeDoProps) {
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

                <div className="grid w-full gap-10 py-10 md:grid-cols-2 lg:grid-cols-6 lg:gap-y-14">
                    {finalContent.highlights.map((item, index) => (
                        <div
                            key={item.id}
                            className={`flex flex-col items-center text-center lg:col-span-2 ${index === 3 ? "lg:col-start-2" : ""}`}
                        >
                            <div className="mb-4 flex h-16 w-16 items-center justify-center">
                                <Image src={item.icon} seo={(item as any).iconSeo} alt={richTextToPlainText(item.title)} width={64} height={64} />
                            </div>
                            <h3 className="text-lg font-semibold tracking-wide text-[#1E1F21]"><RichTextInline content={item.title} /></h3>
                            <RichTextBlock as="div" content={item.description} defaultTag="p" className="mt-3 max-w-[360px] text-sm text-[#667085] sm:text-base" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
