"use client"

import EmployeeAvatar from "./EmployeeAvatar";
import { founderMessageContentAboutUs as defaultContent } from "../contents/about-us/content";
import { ContentPath, useContent } from "../contents/useContent";
import { RichTextBlock } from "./RichTextContent";

interface FounderMessageProps {
    contentPath?: ContentPath;
    content?: typeof defaultContent;
}

export default function FounderMessage({ contentPath, content }: FounderMessageProps) {
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
                <EmployeeAvatar
                    imageSrc={finalContent.avatarImageSrc}
                    imageSeo={(finalContent as any).avatarImageSeo}
                    name={finalContent.avatarName}
                    title={finalContent.avatarTitle}
                />
                <RichTextBlock
                    as="div"
                    content={finalContent.message}
                    defaultTag="p"
                    className="max-w-[830px] text-[#667085] mx-auto text-center"
                    style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}
                />
            </div>
        </div>
    );
}
