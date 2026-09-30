'use client';

import Image from '@/components/common/SeoImage';
import { RichTextBlock, RichTextInline } from '@/components/common/RichTextContent';
import { landingCaseStudiesContent as defaultContent } from './contents/Landing/content';
import { useContent, ContentPath } from './contents/useContent';

interface LandingCaseStudiesProps {
  contentPath?: ContentPath;
  content?: typeof defaultContent;
}

export default function LandingCaseStudies({
  contentPath,
  content,
}: LandingCaseStudiesProps) {
  const finalContent = useContent(contentPath, content || defaultContent);
  const caseStudies = finalContent.caseStudies;

  return (
    <div className="relative overflow-hidden px-[1rem] py-8 sm:px-[2rem]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-140px] top-[-155px] z-0 h-[650px] w-[500px] -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(4,116,196,0.18)_0%,rgba(6,69,127,0.06)_45%,transparent_70%)] blur-2xl"
      />
      <div className="container mx-auto">
        {/* Header Section */}
        {(finalContent.title || finalContent.subtitle || finalContent.description) && (
          <div className="mb-6 flex flex-col items-center gap-2 text-center lg:mb-12">
            {finalContent.title && (
              <RichTextBlock
                as="div"
                content={finalContent.title}
                defaultTag="h2"
                className="mb-3 leading-tight font-bold text-[#1E1F21] [&_h1]:m-0 [&_h1]:text-[clamp(2rem,5vw,2.75rem)] [&_h2]:m-0 [&_h2]:text-[clamp(2rem,5vw,2.75rem)] [&_p]:m-0 [&_p]:text-[clamp(2rem,5vw,2.75rem)]"
              />
            )}
            {finalContent.subtitle && (
              <RichTextBlock
                as="div"
                content={finalContent.subtitle}
                defaultTag="h3"
                className="mb-4 leading-tight font-bold text-[#1E1F21] [&_h2]:m-0 [&_h2]:text-[clamp(1.5rem,3.5vw,2rem)] [&_h3]:m-0 [&_h3]:text-[clamp(1.5rem,3.5vw,2rem)] [&_p]:m-0 [&_p]:text-[clamp(1.5rem,3.5vw,2rem)]"
              />
            )}
            {finalContent.description && (
              <RichTextBlock
                as="div"
                content={finalContent.description}
                defaultTag="p"
                className="mx-auto leading-relaxed text-[#667085] lg:max-w-6xl [&_p]:m-0 [&_p]:text-[clamp(0.875rem,2vw,1.125rem)] [&_p]:leading-relaxed"
              />
            )}
          </div>
        )}

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {caseStudies.map((caseStudy) => (
            <div key={caseStudy.id} className="hover-3d">
              {/* Card Content */}
              <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-md">
                {/* Image */}
                <div className="relative aspect-[60/37] w-full overflow-hidden rounded-lg">
                  <Image
                    src={caseStudy.image}
                    seo={(caseStudy as any).imageSeo}
                    alt={caseStudy.projectName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-4 p-3 sm:p-5 lg:p-6">
                  <span className="text-[1.2rem] font-semibold text-[#1E1F21] sm:text-[1.5rem]">
                    <RichTextInline content={caseStudy.label} />
                  </span>
                  <div>
                    <RichTextBlock
                      as="div"
                      content={caseStudy.projectName}
                      defaultTag="h3"
                      className="leading-tight font-bold text-[#1E1F21] [&_h2]:m-0 [&_h2]:text-[clamp(1.125rem,3vw,1.5rem)] [&_h3]:m-0 [&_h3]:text-[clamp(1.125rem,3vw,1.5rem)] [&_p]:m-0 [&_p]:text-[clamp(1.125rem,3vw,1.5rem)]"
                    />
                    <RichTextBlock
                      as="div"
                      content={caseStudy.description}
                      defaultTag="p"
                      className="leading-relaxed text-[#667085] [&_p]:m-0 [&_p]:text-[clamp(0.95rem,2vw,1.125rem)] [&_p]:leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* 8 empty divs needed for the 3D effect */}
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
