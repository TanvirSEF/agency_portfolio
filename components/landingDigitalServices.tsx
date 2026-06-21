'use client';

import { useContent, ContentPath } from './contents/useContent';
import DigitalServiceCard from './common/digitalServiceCard';
import { landingDigitalServicesContent as defaultContent, digitalServiceCardContent as defaultServiceCardContent } from './contents/Landing/content';
import { RichTextBlock } from './common/RichTextContent';

interface LandingDigitalServicesProps {
  contentPath: ContentPath;
  content?: typeof defaultContent;
  cardSecCount?: number;
  cardContent1?: ContentPath;
  cardContent2?: ContentPath;
}

export default function LandingDigitalServices({
  contentPath,
  content,
  cardSecCount = 1,
  cardContent1,
  cardContent2,
}: LandingDigitalServicesProps) {
  const finalContent = useContent(contentPath, content || defaultContent);

  // Determine which content paths to use for service cards
  const serviceCardPath1 = cardContent1 || finalContent.serviceCardContentPath1;
  const serviceCardPath2 = cardContent2 || finalContent.serviceCardContentPath2;

  // Get services for each section (only if path is provided)
  const serviceCardContent1 = useContent<typeof defaultServiceCardContent>(serviceCardPath1 as ContentPath | undefined);
  const serviceCardContent2 = useContent<typeof defaultServiceCardContent>(serviceCardPath2 as ContentPath | undefined);
  const services1 = serviceCardContent1?.services ?? [];
  const services2 = serviceCardContent2?.services ?? [];

  return (
    <div className="px-[1rem] py-8">
      <div className="container mx-auto flex flex-col items-center gap-6">
        {/* Main Title */}
        {(finalContent.mainTitle || finalContent.mainDescription) && (
          <div className="flex flex-col items-center gap-6">
            {finalContent.mainTitle && (
              <RichTextBlock
                as="div"
                content={finalContent.mainTitle}
                defaultTag="h2"
                className="text-center leading-tight font-bold text-[#1E1F21]"
                style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)' }}
              />
            )}

            {/* Introductory Paragraph */}
            {finalContent.mainDescription && (
              <RichTextBlock
                as="div"
                content={finalContent.mainDescription}
                defaultTag="p"
                className="max-w-3xl text-center leading-relaxed text-[#667085]"
                style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}
              />
            )}
          </div>
        )}
        {/* Subtitle - commented out
        {(finalContent.subtitle || finalContent.subtitleDescription) && (
          <div className="flex flex-col items-center gap-6">
            {finalContent.subtitle && (
              <h2
                className="mt-4 text-center leading-tight font-bold text-[#1E1F21]"
                style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)' }}
              >
                {finalContent.subtitle}
              </h2>
            )}

            Descriptive Paragraph:
            {finalContent.subtitleDescription && (
              <p
                className="max-w-3xl text-center leading-relaxed text-[#667085]"
                style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}
              >
                {finalContent.subtitleDescription}
              </p>
            )}
          </div>
        )}
        */}
        {/* Service Cards Grid */}
        {Array.from({ length: cardSecCount }).map((_, sectionIndex) => {
          // Use services1 for first section (index 0), services2 for second section (index 1), etc.
          const services = sectionIndex === 0 ? services1 : (sectionIndex === 1 ? services2 : services1);

          return (
            <div
              key={sectionIndex}
              className="grid w-full grid-cols-1 justify-items-center gap-6 md:w-[640px] lg:w-[960px] xl:w-[1150px] min-[700px]:grid-cols-2 lg:grid-cols-3"
            >
              {services.map((service) => (
                <DigitalServiceCard key={`${sectionIndex}-${service.id}`} service={service} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
