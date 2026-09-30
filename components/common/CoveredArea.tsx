"use client"

import Image from "@/components/common/SeoImage";
import CounterUp from "./CounterUp";
import { coveredAreaContentAboutUs as defaultContent } from "../contents/about-us/content";
import { ContentPath, useContent } from "../contents/useContent";
import { RichTextBlock, RichTextInline, richTextToPlainText } from "./RichTextContent";

interface CoveredAreaProps {
    contentPath?: ContentPath;
    content?: typeof defaultContent;
}

export default function CoveredArea({ contentPath, content }: CoveredAreaProps) {
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
                    className="max-w-[830px] text-[#667085] mt-2 mb-8 mx-auto text-center"
                    style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}
                />

                <div className="relative w-full max-w-[1100px] overflow-hidden">
                    <Image
                        src="/assets/images/about-us/about-us-map.svg"
                        alt="Map of Zephlo Tech client locations"
                        width={1100}
                        height={650}
                        className="h-auto w-full"
                        sizes="(max-width: 768px) 100vw, 1100px"
                        priority
                    />
                    {finalContent.locations.map((location) => (
                        <div
                            key={location.id}
                            className="absolute"
                            style={{ top: location.top, left: location.left }}
                        >
                            <div className="group relative flex items-center justify-center">
                                <span
                                    className="absolute inline-flex h-5 w-5 rounded-full bg-[#00D2FF]/40 animate-ping"
                                    style={{
                                        animationDuration: '1.5s', // Change this value to control ping speed. e.g. '2s', '750ms'
                                    }}
                                />
                                <span className="relative inline-flex h-3 w-3 rounded-full bg-[#06457F] shadow-[0_0_12px_rgba(6, 69, 127, 0.7)]" />
                                <div className="pointer-events-none absolute bottom-full left-1/2 mb-4 w-[230px] -translate-x-1/2 opacity-0 transition duration-200 group-hover:opacity-100">
                                    <div className="rounded-2xl bg-white px-4 py-3 text-center text-slate-700 shadow-[0_20px_50px_rgba(17,24,39,0.25)]">
                                        <div className="flex items-center justify-center gap-2 text-base font-semibold">
                                            <Image
                                                src={location.imagePath}
                                                seo={(location as any).imageSeo}
                                                alt={`${richTextToPlainText(location.country)} flag`}
                                                width={24}
                                                height={24}
                                                className="h-6 w-6 rounded-full object-cover"
                                            />
                                            <span><RichTextInline content={location.country} /></span>
                                        </div>
                                        <div className="text-sm text-slate-500"><RichTextInline content={location.line1} /></div>
                                        <div className="text-sm text-slate-500"><RichTextInline content={location.line2} /></div>
                                    </div>
                                    <div className="mx-auto h-0 w-0 border-x-8 border-x-transparent border-t-8 border-t-white drop-shadow-[0_10px_20px_rgba(17,24,39,0.25)]" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <CounterUp className="mt-8" color="#06457F" stats={finalContent.stats} />
            </div>
        </div>
    );
}
