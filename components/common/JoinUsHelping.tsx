"use client";

import Image from "@/components/common/SeoImage";
import { joinUsHelpingContentPayItForward as defaultContent } from "../contents/pay-it-forward/content";
import { ContentPath, useContent } from "../contents/useContent";
import { RichTextBlock } from "./RichTextContent";

interface JoinUsHelpingProps {
    contentPath?: ContentPath;
    content?: typeof defaultContent;
}

export default function JoinUsHelping({ contentPath, content }: JoinUsHelpingProps) {
    const finalContent = useContent(contentPath, content || defaultContent);
    const imageContent = finalContent.image as typeof finalContent.image & { alt?: string };
    return (
        <section>
            <div className="container mx-auto px-4 py-8 lg:px-10">
                <div
                    className="relative aspect-[1360/456] w-full overflow-hidden rounded-3xl bg-[#06457F]"
                    aria-label="Join us helping"
                >
                    {imageContent?.src && (
                        <Image
                            src={imageContent.src}
                            seo={imageContent as any}
                            alt={imageContent.alt || 'Join us helping'}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 1360px"
                        />
                    )}
                    <div className="absolute inset-0 flex flex-col justify-center px-6 py-8 text-white sm:px-10 lg:px-16">
                        <div className="max-w-[540px] space-y-4">
                            <RichTextBlock
                                as="div"
                                content={finalContent.title}
                                defaultTag="h2"
                                className="text-2xl font-semibold sm:text-3xl lg:text-[2.5rem]"
                            />
                            <RichTextBlock
                                as="div"
                                content={finalContent.description}
                                defaultTag="p"
                                className="text-sm text-white/90 sm:text-base"
                            />
                        </div>
                    </div>

                    <div className="absolute bottom-6 right-6 w-[220px] rounded-2xl bg-white p-4 text-sm text-[#1E1F21] shadow-[0_20px_50px_rgba(17,24,39,0.2)] sm:w-[240px]">
                        <RichTextBlock as="div" content={finalContent.contactText} defaultTag="p" />
                    </div>
                </div>
            </div>
        </section>
    );
}
