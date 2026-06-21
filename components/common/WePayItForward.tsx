"use client";

import { wePayItForwardContentPayItForward as defaultContent } from "../contents/pay-it-forward/content";
import { ContentPath, useContent } from "../contents/useContent";
import { RichTextBlock } from "./RichTextContent";

interface WePayItForwardProps {
    contentPath?: ContentPath;
    content?: typeof defaultContent;
}

export default function WePayItForward({ contentPath, content }: WePayItForwardProps) {
    const finalContent = useContent(contentPath, content || defaultContent);
    return (
        <div>
            <div className="px-4 pt-16 container flex flex-col items-center gap-6 mx-auto lg:px-10">
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
                    className="max-w-[1100px] text-[#667085] mt-2 mb-8 mx-auto text-center"
                    style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}
                />
            </div>
        </div>
    );
}
