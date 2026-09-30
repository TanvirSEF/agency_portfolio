"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { scrollToContact } from "@/lib/scrollToContact";
import { useContent, ContentPath } from "../contents/useContent";
import { weOfferMoreContentGraphicDesign as defaultContent } from "../contents/graphic-design/content";
import { RichTextBlock, RichTextInline } from "./RichTextContent";

interface WeOfferMoreProps {
    contentPath?: ContentPath;
    content?: typeof defaultContent;
}

export default function WeOfferMore({ contentPath, content }: WeOfferMoreProps) {
    const finalContent = useContent(contentPath, content || defaultContent);
    const { title, description, services, buttonText, buttonLink } = finalContent;

    return (
        <div className="py-8 px-4 xl:px-10">
            <div className="container mx-auto">
                <div className="flex flex-col items-center text-center gap-4">
                    {title && (
                        <RichTextBlock
                            as="div"
                            content={title}
                            defaultTag="h2"
                            className="text-[#1E1F21] font-bold"
                            style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', lineHeight: '1.2' }}
                        />
                    )}
                    {description && (
                        <RichTextBlock
                            as="div"
                            content={description}
                            defaultTag="p"
                            className="text-[#667085] text-center max-w-3xl leading-relaxed"
                            style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
                        />
                    )}
                </div>

                <div className="mt-10 flex flex-col items-center gap-6">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="max-w-[720px] rounded-xl shadow-sm border border-[#EAECF0] px-6 py-8 text-center"
                        >
                            <RichTextBlock
                                as="div"
                                content={service.title}
                                defaultTag="h3"
                                className="text-[#1E1F21] font-bold uppercase tracking-wide"
                                style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)', lineHeight: '1.3' }}
                            />
                            <RichTextBlock
                                as="div"
                                content={service.description}
                                defaultTag="p"
                                className="mt-3 text-[#667085] leading-relaxed"
                                style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
                            />
                        </div>
                    ))}
                </div>

                {buttonText && buttonLink && (
                    <div className="mt-10 flex justify-center">
                        {buttonLink === '/contact' ? (
                            <Button onClick={scrollToContact} className="bg-[#06457F] hover:bg-[#06457F] text-white px-8 py-6 rounded-full">
                                <RichTextInline content={buttonText} />
                            </Button>
                        ) : (
                            <Button asChild className="bg-[#06457F] hover:bg-[#06457F] text-white px-8 py-6 rounded-full">
                                <Link href={buttonLink} {...(buttonLink.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                                    <RichTextInline content={buttonText} />
                                </Link>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
