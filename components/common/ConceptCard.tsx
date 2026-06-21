"use client"

import Image from "@/components/common/SeoImage";
import GlareHover from "../GlareHover";
import { RichTextBlock } from "./RichTextContent";

interface ConceptCardProps {
    imageSrc: string;
    imageSeo?: unknown;
    title: string;
    description: string;
}

export default function ConceptCard({ imageSrc, imageSeo, title, description }: ConceptCardProps) {
    return (
        <GlareHover
            width="100%"
            height="auto"
            background="#ffffff"
            borderRadius="1.5rem"
            borderColor="#E5E7EB"
            glareColor="#ffffff"
            glareOpacity={0.3}
            glareAngle={-30}
            glareSize={220}
            transitionDuration={800}
            playOnce={false}
            className="h-auto w-full self-start shadow-[0_20px_50px_rgba(17,24,39,0.08)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(17,24,39,0.16)]"
        >
            <div className="flex w-full flex-col">
                <div className="p-4">
                    <div className="overflow-hidden rounded-2xl">
                        <Image
                            src={imageSrc}
                            seo={imageSeo as any}
                            alt={title}
                            width={520}
                            height={320}
                            className="h-auto w-full object-cover"
                            sizes="(max-width: 1024px) 100vw, 520px"
                        />
                    </div>
                </div>
                <div className="flex flex-col items-center gap-3 px-6 pb-8 text-center">
                    <RichTextBlock
                        as="div"
                        content={title}
                        defaultTag="h3"
                        style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)' }}
                        className="font-bold uppercase tracking-wide text-[#1E1F21] sm:text-xl"
                    />
                    <RichTextBlock
                        as="div"
                        content={description}
                        defaultTag="p"
                        className="text-sm text-[#667085] sm:text-base"
                    />
                </div>
            </div>
        </GlareHover>
    );
}
