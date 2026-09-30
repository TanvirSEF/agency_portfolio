"use client"

import { memo } from "react";

import ThreeImage from "./ThreeImage";
import { leftThreeImageContentAboutUs as defaultContent } from "../contents/about-us/content";
import { ContentPath, useContent } from "../contents/useContent";
import { RichTextBlock } from "./RichTextContent";

interface LeftThreeImageProps {
    contentPath?: ContentPath;
    content?: typeof defaultContent;
    imagePaths?: string[];
    imageEntries?: Array<string | { src: string; alt?: string; altText?: string; title?: string; caption?: string; description?: string }>;
}

function LeftThreeImage({ contentPath, content, imagePaths, imageEntries }: LeftThreeImageProps) {
    const finalContent = useContent(contentPath, content || defaultContent);
    const resolvedImagePaths = imagePaths ?? finalContent.imagePaths;
    const resolvedImageEntries = imageEntries ?? (finalContent as any).imageEntries;
    return (
        <div>
            <div className="container mx-auto flex flex-col gap-8 px-4 py-8 lg:flex-row lg:items-center lg:px-10">

                <div className="flex lg:flex-1 items-center justify-center h-[350px] lg:h-[500px]">
                    <ThreeImage imagePaths={resolvedImagePaths} imageEntries={resolvedImageEntries} />
                </div>

                <div className="flex flex-1 flex-col items-start gap-4">

                    <RichTextBlock
                        as="div"
                        content={finalContent.badge}
                        defaultTag="p"
                        className="text-[#06457F] text-[1.25rem]"
                    />

                    <RichTextBlock
                        as="div"
                        content={finalContent.title}
                        defaultTag="h2"
                        className="text-[#1E1F21] font-bold"
                        style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', lineHeight: '1.2' }}
                    />

                    {Array.isArray(finalContent.description) ? (
                        <div className="flex flex-col gap-4" style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}>
                            {finalContent.description.map((paragraph, index) => (
                                <RichTextBlock key={index} as="div" content={paragraph} defaultTag="p" />
                            ))}
                        </div>
                    ) : (
                        <RichTextBlock
                            as="div"
                            content={finalContent.description}
                            defaultTag="p"
                            style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}
                        />
                    )}


                </div>


            </div>
        </div>
    );
}

export default memo(LeftThreeImage);
