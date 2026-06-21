'use client';

import Image from '@/components/common/SeoImage';
import { RichTextBlock } from '@/components/common/RichTextContent';
import { customWebDevContent as defaultContent } from './contents/Landing/content';
import { useContent, ContentPath } from './contents/useContent';
import { useRouter } from '@/i18n/routing';

interface CustomWebDevProps {
  contentPath?: ContentPath;
  content?: typeof defaultContent;
}

export default function CustomWebDev({
  contentPath,
  content,
}: CustomWebDevProps) {
  const router = useRouter();
  const finalContent = useContent(contentPath, content || defaultContent);
  const services = finalContent.services;

  return (
    <div className="relative overflow-hidden">
      {/* Curve Asset at the top */}
      <div className="absolute top-0 right-0 left-0 z-2 w-full">
        <Image
          src={finalContent.curveImage.src}
          seo={(finalContent.curveImage as any)}
          alt={finalContent.curveImage.alt}
          width={finalContent.curveImage.width}
          height={finalContent.curveImage.height}
          className="hidden h-auto w-full object-cover min-[1288px]:block"
          priority
        />
      </div>

      {/* Top Purple Section with Diagonal Bottom */}
      <div className="relative z-5  py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl text-center">
            {finalContent.title && (
              <RichTextBlock
                as="div"
                content={finalContent.title}
                defaultTag="h2"
                className="mb-6 font-bold text-[#1E1F21] min-[1288px]:text-white [&_h1]:m-0 [&_h1]:text-[clamp(2rem,5vw,2.75rem)] [&_h2]:m-0 [&_h2]:text-[clamp(2rem,5vw,2.75rem)] [&_p]:m-0 [&_p]:text-[clamp(2rem,5vw,2.75rem)]"
              />
            )}
            {finalContent.description && (
              <RichTextBlock
                as="div"
                content={finalContent.description}
                defaultTag="p"
                className="leading-relaxed text-[#1E1F21] min-[1288px]:text-white [&_p]:m-0 [&_p]:text-[clamp(1rem,2vw,1.125rem)] [&_p]:leading-[1.8]"
              />
            )}
          </div>
        </div>
      </div>

      {/* Bottom White Section */}
      <div className="relative">
        <div className="relative container mx-auto px-4 py-12 sm:px-6 lg:px-22 xl:px-25">
          {/* Mobile and Tablet View - Simple Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 xl:hidden">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#B189FF] hover:shadow-md"
              >
                <RichTextBlock
                  as="div"
                  content={service.title}
                  defaultTag="h3"
                  className="mb-3 font-bold text-gray-900 [&_h2]:m-0 [&_h2]:text-[clamp(1.125rem,3vw,1.25rem)] [&_h3]:m-0 [&_h3]:text-[clamp(1.125rem,3vw,1.25rem)] [&_p]:m-0 [&_p]:text-[clamp(1.125rem,3vw,1.25rem)]"
                />
                <RichTextBlock
                  as="div"
                  content={service.description}
                  defaultTag="p"
                  className="leading-relaxed text-gray-600 [&_p]:m-0 [&_p]:text-[clamp(0.95rem,2vw,1.125rem)] [&_p]:leading-[1.8]"
                />
              </div>
            ))}
          </div>

          {/* Desktop View (XL and 2XL) - Cards Around Phone */}
          <div className="relative z-5 hidden min-h-[530px] xl:block">
            {/* Central Phone Image - Only visible on XL and 2XL */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative h-[550px] w-[350px] 2xl:h-[650px] 2xl:w-[420px]">
                <Image
                  src={finalContent.phoneImage.src}
                  seo={(finalContent.phoneImage as any)}
                  alt={finalContent.phoneImage.alt}
                  fill
                  className="object-contain"
                  sizes={finalContent.phoneImage.sizes}
                  priority
                />
              </div>
            </div>

            {/* Top-Left Card - WEB DESIGN */}
            <div className="absolute top-0 left-0 w-[340px] 2xl:w-[400px]">
              <div className="min-h-[240px] rounded-2xl border-2 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[#B189FF] 2xl:min-h-[250px] 2xl:p-6">
              <button
                  onClick={() => router.push("/services/web-design")}
                  aria-label={`Learn more about ${services[2].title}`}
                  className="mb-2 text-lg font-bold text-gray-900 2xl:mb-3 2xl:text-xl appearance-none bg-transparent border-none outline-none p-0 m-0 cursor-pointer text-left focus:underline"
                  style={{ background: 'none', boxShadow: 'none' }}
                  tabIndex={0}
                >
                  <RichTextBlock as="div" content={services[0].title} defaultTag="h3" className="[&_h3]:m-0 [&_p]:m-0" />
                </button>
                <RichTextBlock
                  as="div"
                  content={services[0].description}
                  defaultTag="p"
                  className="text-sm leading-relaxed text-gray-600 2xl:text-base [&_p]:m-0 [&_p]:text-sm [&_p]:leading-relaxed 2xl:[&_p]:text-base"
                />
              </div>
            </div>

            {/* Bottom-Left Card - APP DEVELOPMENT */}
            <div className="absolute bottom-0 left-0 w-[340px] 2xl:w-[400px]">
              <div className="min-h-[240px] rounded-2xl border-2 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[#B189FF] 2xl:min-h-[250px] 2xl:p-6">
              <button
                  onClick={() => router.push("/services/app-development")}
                  aria-label={`Learn more about ${services[2].title}`}
                  className="mb-2 text-lg font-bold text-gray-900 2xl:mb-3 2xl:text-xl appearance-none bg-transparent border-none outline-none p-0 m-0 cursor-pointer text-left focus:underline"
                  style={{ background: 'none', boxShadow: 'none' }}
                  tabIndex={0}
                >
                  <RichTextBlock as="div" content={services[1].title} defaultTag="h3" className="[&_h3]:m-0 [&_p]:m-0" />
                </button>
                <RichTextBlock
                  as="div"
                  content={services[1].description}
                  defaultTag="p"
                  className="text-sm leading-relaxed text-gray-600 2xl:text-base [&_p]:m-0 [&_p]:text-sm [&_p]:leading-relaxed 2xl:[&_p]:text-base"
                />
              </div>
            </div>

            {/* Top-Right Card - WEB DEVELOPMENT */}
            <div className="absolute top-0 right-0 w-[340px] 2xl:w-[400px]">
              <div className="min-h-[240px] rounded-2xl border-2 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[#B189FF] 2xl:min-h-[250px] 2xl:p-6">
                <button
                  onClick={() => router.push("/services/web-development")}
                  aria-label={`Learn more about ${services[2].title}`}
                  className="mb-2 text-lg font-bold text-gray-900 2xl:mb-3 2xl:text-xl appearance-none bg-transparent border-none outline-none p-0 m-0 cursor-pointer text-left focus:underline"
                  style={{ background: 'none', boxShadow: 'none' }}
                  tabIndex={0}
                >
                  <RichTextBlock as="div" content={services[2].title} defaultTag="h3" className="[&_h3]:m-0 [&_p]:m-0" />
                </button>
                <RichTextBlock
                  as="div"
                  content={services[2].description}
                  defaultTag="p"
                  className="text-sm leading-relaxed text-gray-600 2xl:text-base [&_p]:m-0 [&_p]:text-sm [&_p]:leading-relaxed 2xl:[&_p]:text-base"
                />
              </div>
            </div>

            {/* Bottom-Right Card - PLUGIN DEVELOPMENT */}
            <div className="absolute right-0 bottom-0 w-[340px] 2xl:w-[400px]">
              <div className="min-h-[240px] rounded-2xl border-2 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[#B189FF] 2xl:min-h-[250px] 2xl:p-6">
              <button
                  onClick={() => router.push("/services/wordpress-development")}
                  aria-label={`Learn more about ${services[2].title}`}
                  className="mb-2 text-lg font-bold text-gray-900 2xl:mb-3 2xl:text-xl appearance-none bg-transparent border-none outline-none p-0 m-0 cursor-pointer text-left focus:underline"
                  style={{ background: 'none', boxShadow: 'none' }}
                  tabIndex={0}
                >
                  <RichTextBlock as="div" content={services[3].title} defaultTag="h3" className="[&_h3]:m-0 [&_p]:m-0" />
                </button>
                <RichTextBlock
                  as="div"
                  content={services[3].description}
                  defaultTag="p"
                  className="text-sm leading-relaxed text-gray-600 2xl:text-base [&_p]:m-0 [&_p]:text-sm [&_p]:leading-relaxed 2xl:[&_p]:text-base"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
