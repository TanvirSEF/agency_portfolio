"use client"

import Link from "next/link";
import { Button } from "../ui/button";
import Image from "@/components/common/SeoImage";
import { CompanyIntroSectionSeo as defaultContent } from '../contents/SEO/content';
import { useContent, ContentPath } from '../contents/useContent';
import { RichTextBlock, RichTextInline } from './RichTextContent';

interface CompanyIntroSectionProps {
  contentPath?: ContentPath;
  content?: typeof defaultContent;
  headingTag?: 'h2' | 'h3';
}

export default function CompanyIntroSection({
  contentPath,
  content,
  headingTag = 'h2',
}: CompanyIntroSectionProps) {
  const finalContent = useContent(contentPath, content || defaultContent);
  const HeadingTag = headingTag;

  // Previous design with two background images (kept for reference):
  //
  // return (
  //   <div className="relative overflow-hidden max-h-max">
  //     {finalContent.blurImage && finalContent.blurImage.src && (
  //       <Image
  //         src={finalContent.blurImage.src}
  //         alt={finalContent.blurImage.alt}
  //         width={finalContent.blurImage.width}
  //         height={finalContent.blurImage.height}
  //         className={finalContent.blurImage.className}
  //         style={{ objectFit: 'contain' as const, maxHeight: '120%' }}
  //       />
  //     )}
  //     <div className="flex flex-col gap-2 h-full min-h-[600px] container mx-auto px-4 xl:px-10 py-10 lg:flex-row lg:gap-8 lg:items-start">
  //       <div className="h-[320px] flex gap-2 [&>div]:rounded-md lg:h-[450px] lg:w-[45%] lg:max-w-[500px] xl:w-[40%] lg:items-start">
  //         {finalContent.images && finalContent.images.image1 && finalContent.images.image1.src && (
  //           <div
  //             className="flex-1 h-[85%] bg-cover bg-center bg-no-repeat"
  //             style={{ backgroundImage: `url('${finalContent.images.image1.src}')` }}
  //           ></div>
  //         )}
  //         {finalContent.images && finalContent.images.image2 && finalContent.images.image2.src && (
  //           <div
  //             className="flex-1/8 bg-cover bg-center bg-no-repeat lg:h-full"
  //             style={{ backgroundImage: `url('${finalContent.images.image2.src}')` }}
  //           ></div>
  //         )}
  //       </div>
  //       <div className="flex-1 lg:w-[55%] xl:w-[60%]">
  //         {finalContent.content && finalContent.content.brandName && (
  //           <p className="text-[#8C52FF] text-[1.25rem]">{finalContent.content.brandName}</p>
  //         )}
  //         {finalContent.content && finalContent.content.title && (
  //           <h1
  //             className="text-[#1E1F21] font-bold mt-2 mb-8"
  //             style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', lineHeight: '1.2' }}
  //           >
  //             {finalContent.content.title}
  //           </h1>
  //         )}
  //         {finalContent.content && finalContent.content.description && (
  //           <p className="mb-6" style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}>
  //             {finalContent.content.description}
  //           </p>
  //         )}
  //         {finalContent.content && finalContent.content.button && finalContent.content.button.text && (
  //           <Button className="rounded-full bg-[#8C52FF] px-8 py-6 text-white">
  //             <Link href={finalContent.content.button.href || '/'} className="uppercase">
  //               {finalContent.content.button.text}
  //             </Link>
  //           </Button>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 xl:px-10">
        <div className="max-w-3xl mx-auto text-center">
          {finalContent.content && finalContent.content.brandName && (
            <RichTextBlock
              as="div"
              content={finalContent.content.brandName}
              defaultTag="p"
              className="text-[#8C52FF] text-sm font-semibold tracking-[0.2em] uppercase mb-3"
            />
          )}
          {finalContent.content && finalContent.content.title && (
            <RichTextBlock
              as="div"
              content={finalContent.content.title}
              defaultTag={HeadingTag}
              className="text-[#1E1F21] font-bold mb-6"
              style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', lineHeight: '1.2' }}
            />
          )}
          {finalContent.content && finalContent.content.description && (
            <RichTextBlock
              as="div"
              content={finalContent.content.description}
              defaultTag="p"
              className="text-[#4B4B4F] mb-8 leading-relaxed"
              style={{ fontSize: 'clamp(0.975rem, 1.9vw, 1.125rem)' }}
            />
          )}
          {finalContent.content && finalContent.content.button && finalContent.content.button.text && (
            <div className="flex justify-center">
              <Button className="rounded-full bg-[#8C52FF] hover:bg-[#7A3BFF] transition-colors px-8 py-5 text-white text-sm font-semibold tracking-wide uppercase">
                <Link href={finalContent.content.button.href || '/'}>
                  <RichTextInline content={finalContent.content.button.text} />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
