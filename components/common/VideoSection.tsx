"use client"

import Link from "next/link";
import { Button } from "../ui/button";
import { scrollToContact } from "@/lib/scrollToContact";
import VideoComponent from "./VideoComponent";
import { videoSectionContentAboutUs as defaultContent } from "../contents/about-us/content";
import { ContentPath, useContent } from "../contents/useContent";
import { RichTextBlock, RichTextInline } from "./RichTextContent";

interface VideoSectionProps {
    contentPath?: ContentPath;
    content?: typeof defaultContent;
}

export default function VideoSection({ contentPath, content }: VideoSectionProps) {
    const finalContent = useContent(contentPath, content || defaultContent);
    return (
        <div>
            <div className="container mx-auto flex flex-col gap-8 px-4 py-12 lg:flex-row lg:items-center lg:px-10">
                <div className="flex flex-1 flex-col items-start gap-6">
                    <RichTextBlock
                        as="div"
                        content={finalContent.title}
                        defaultTag="h2"
                        className="font-bold"
                        style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', lineHeight: '1.2' }}
                    />
                    <RichTextBlock
                        as="div"
                        content={finalContent.description}
                        defaultTag="p"
                        className="mt-2 mb-8 max-w-[1200px] text-[#667085]"
                        style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}
                    />
                    {finalContent.buttonLink === '/contact' ? (
                        <Button onClick={scrollToContact} className="mt-2 rounded-full bg-[#8C52FF] px-8 py-6 text-white hover:bg-[#7941E6] transition-colors uppercase">
                            <RichTextInline content={finalContent.buttonText} />
                        </Button>
                    ) : (
                        <Button asChild className="mt-2 rounded-full bg-[#8C52FF] px-8 py-6 text-white hover:bg-[#7941E6] transition-colors">
                            <Link href={finalContent.buttonLink} {...(finalContent.buttonLink.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="uppercase">
                                <RichTextInline content={finalContent.buttonText} />
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="flex-1">
                    <VideoComponent sourcePath={finalContent.videoPath} />
                </div>
            </div>
        </div>
    );
}
