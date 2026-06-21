"use client"

import { digitalPercentageContentAboutUs as defaultContent } from "../contents/about-us/content";
import { ContentPath, useContent } from "../contents/useContent";
import { RichTextBlock, RichTextInline } from "./RichTextContent";

interface DigitalPercentageInOnePlaceProps {
    contentPath?: ContentPath;
    content?: typeof defaultContent;
}

export default function DigitalPercentageInOnePlace({ contentPath, content }: DigitalPercentageInOnePlaceProps) {
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


                <div className="grid w-full max-w-[1100px] grid-cols-2 gap-2 sm:grid-cols-4 ">
                    {finalContent.services.map((label, index) => {
                        const mobileRounding =
                            index === 0
                                ? 'rounded-tl-lg'
                                : index === 1
                                    ? 'rounded-tr-lg'
                                    : index === 6
                                        ? 'rounded-bl-lg'
                                        : index === 7
                                            ? 'rounded-br-lg'
                                            : 'rounded-none';
                        const smRounding =
                            index === 0
                                ? 'sm:rounded-tl-lg'
                                : index === 3
                                    ? 'sm:rounded-tr-lg'
                                    : index === 4
                                        ? 'sm:rounded-bl-lg'
                                        : index === 7
                                            ? 'sm:rounded-br-lg'
                                            : 'sm:rounded-none';
                        return (
                            <div
                                key={label}
                                className={`flex min-h-[80px] items-center justify-center border border-white/20 bg-[#8C52FF] px-4 py-5 text-center text-sm font-medium text-white sm:min-h-[120px] sm:text-base ${mobileRounding} ${smRounding}`}
                            >
                                <RichTextInline content={label} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
