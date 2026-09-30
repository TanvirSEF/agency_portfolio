'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RichTextBlock, RichTextInline } from '@/components/common/RichTextContent';
import { Button } from '@/components/ui/button';
import { scrollToContact } from '@/lib/scrollToContact';
import { landingAdditionalServicesContent as defaultContent } from './contents/Landing/content';
import { useContent, ContentPath } from './contents/useContent';
import Image from '@/components/common/SeoImage';

interface LandingAdditionalServicesProps {
  contentPath?: ContentPath;
  content?: typeof defaultContent;
}

export default function LandingAdditionalServices({
  contentPath,
  content,
}: LandingAdditionalServicesProps) {
  const router = useRouter();
  const finalContent = useContent(contentPath, content || defaultContent);
  return (
    <div className="relative overflow-hidden px-[1rem] py-8">
      <Image
        src="/assets/images/right-blur.png"
        alt=""
        width={400}
        height={973}
        className="absolute right-[-130px] top-1/2 -translate-y-1/2 z-0 pointer-events-none"
        style={{ objectFit: 'contain', maxHeight: '120%' }}
        aria-hidden="true"
      />
      <div className="container relative z-10 mx-auto min-[560px]:px-[2rem]">
        <div className="flex flex-col gap-18 lg:flex-row lg:gap-12 xl:gap-16">
          <div className="flex flex-1 flex-col gap-6">
            <RichTextBlock
              as="div"
              content={finalContent.leftSection.title}
              defaultTag="h2"
              className="text-center leading-tight font-bold text-[#1E1F21] lg:text-left [&_h1]:m-0 [&_h1]:text-[clamp(2rem,5vw,2.75rem)] [&_h2]:m-0 [&_h2]:text-[clamp(2rem,5vw,2.75rem)] [&_p]:m-0 [&_p]:text-[clamp(2rem,5vw,2.75rem)]"
            />

          <div className="flex flex-col gap-6">
            {finalContent.leftSection.paragraphs.map((paragraph, index) => (
              <RichTextBlock
                key={index}
                as="div"
                content={paragraph}
                defaultTag="p"
                className="text-center leading-relaxed text-[#667085] lg:text-left [&_p]:m-0 [&_p]:text-[clamp(0.875rem,2vw,1.125rem)] [&_p]:leading-relaxed [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6"
              />
            ))}
          </div>

          <div className="mt-4 flex justify-center lg:justify-start">
            {finalContent.leftSection.buttonLink === '/contact' ? (
              <Button onClick={scrollToContact} className="rounded-full bg-[#06457F] px-8 py-6 text-white">
                <RichTextInline content={finalContent.leftSection.buttonText} />
              </Button>
            ) : (
              <Button asChild className="rounded-full bg-[#06457F] px-8 py-6 text-white">
                <Link href={finalContent.leftSection.buttonLink} {...(finalContent.leftSection.buttonLink.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  <RichTextInline content={finalContent.leftSection.buttonText} />
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6">
          <RichTextBlock
            as="div"
            content={finalContent.rightSection.title}
            defaultTag="h2"
            className="w-[80%] self-center text-center leading-tight font-bold lg:text-left lg:self-start [&_h1]:m-0 [&_h1]:text-[clamp(2rem,5vw,2.75rem)] [&_h2]:m-0 [&_h2]:text-[clamp(2rem,5vw,2.75rem)] [&_p]:m-0 [&_p]:text-[clamp(2rem,5vw,2.75rem)]"
          />

          <RichTextBlock
            as="div"
            content={finalContent.rightSection.quote}
            defaultTag="p"
            className="leading-relaxed text-[#667085] italic [&_p]:m-0 [&_p]:text-[clamp(0.875rem,2vw,1.125rem)] [&_p]:leading-relaxed"
          />

          <div className="mt-2 flex flex-col gap-6">
            {finalContent.rightSection.services.map((service) => (
                <div
                  key={service.id ?? service.title}
                  className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  {service.link ? (
                    <div
                      className="mb-2 text-lg font-bold text-gray-900 2xl:mb-3 2xl:text-xl text-left uppercase"
                      style={{ fontSize: 'clamp(1.125rem, 3vw, 1.25rem)' }}
                    >
                      <button
                        type="button"
                        onClick={() => router.push(service.link!)}
                        aria-label={`Learn more about ${service.title}`}
                        className="appearance-none bg-transparent border-none outline-none p-0 m-0 cursor-pointer text-left hover:underline focus:underline"
                        style={{ background: 'none', boxShadow: 'none' }}
                      >
                        <RichTextInline content={service.title} />
                      </button>
                    </div>
                  ) : (
                    <RichTextBlock
                      as="div"
                      content={service.title}
                      defaultTag="h3"
                      className="mb-2 block text-lg font-bold text-gray-900 2xl:mb-3 2xl:text-xl text-left uppercase [&_h2]:m-0 [&_h3]:m-0 [&_p]:m-0"
                      style={{ fontSize: 'clamp(1.125rem, 3vw, 1.25rem)' }}
                    />
                  )}
                  <RichTextBlock
                    as="div"
                    content={service.description}
                    defaultTag="p"
                    className="leading-relaxed text-[#667085] [&_p]:m-0 [&_p]:text-[clamp(0.875rem,2vw,0.9375rem)] [&_p]:leading-relaxed"
                  />
                </div>
              ))}
            </div>

          <div className="mt-4 flex justify-center lg:justify-start">
            {finalContent.rightSection.buttonLink === '/contact' ? (
              <Button onClick={scrollToContact} className="rounded-full bg-[#06457F] px-8 py-6 text-white">
                <RichTextInline content={finalContent.rightSection.buttonText} />
              </Button>
            ) : (
              <Button asChild className="rounded-full bg-[#06457F] px-8 py-6 text-white">
                <Link href={finalContent.rightSection.buttonLink}>
                  <RichTextInline content={finalContent.rightSection.buttonText} />
                </Link>
              </Button>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
