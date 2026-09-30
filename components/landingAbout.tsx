'use client';

import { useState } from 'react';
import Image from '@/components/common/SeoImage';
import { RichTextBlock, RichTextInline } from '@/components/common/RichTextContent';
import Link from 'next/link';
import { Button } from './ui/button';
import ContactFormModal from './ContactFormModal';
import { landingAboutContent as defaultContent } from './contents/Landing/content';
import { useContent, ContentPath } from './contents/useContent';

interface LandingAboutProps {
  contentPath?: ContentPath;
  content?: typeof defaultContent;
}

export default function LandingAbout({
  contentPath,
  content,
}: LandingAboutProps) {
  const finalContent = useContent(contentPath, content || defaultContent);
  const [selected, setSelected] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleService = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="relative w-full overflow-x-hidden overflow-y-visible">
      {/* Blur decoration: hidden on small screens, visible from md with responsive positioning */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-140px] top-1/2 z-0 hidden h-[650px] w-[500px] -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(4,116,196,0.18)_0%,rgba(6,69,127,0.06)_45%,transparent_70%)] blur-2xl md:block"
      />
      <div className="container relative z-10 mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10 md:gap-12 min-[1250px]:flex-row min-[1250px]:items-stretch min-[1250px]:justify-between min-[1250px]:gap-12 min-[1250px]:px-8 min-[1250px]:py-12 xl:gap-16 xl:py-14">
        {/* Left section: text + CTA */}
        <div className="flex min-w-0 shrink-0 flex-col items-center min-[1250px]:max-w-[min(50%,750px)] min-[1250px]:items-start min-[1250px]:justify-center">
          <RichTextBlock
            as="div"
            content={finalContent.leftSection.title}
            defaultTag="h2"
            className="mb-3 text-center font-bold text-[#1E1F21] sm:mb-4 min-[1250px]:mb-4 min-[1250px]:text-left xl:mb-6 [&_h1]:m-0 [&_h1]:text-[clamp(1.75rem,4.5vw,2.75rem)] [&_h1]:leading-[1.2] [&_h2]:m-0 [&_h2]:text-[clamp(1.75rem,4.5vw,2.75rem)] [&_h2]:leading-[1.2] [&_p]:m-0 [&_p]:text-[clamp(1.75rem,4.5vw,2.75rem)] [&_p]:leading-[1.2]"
          />
          <RichTextBlock
            as="div"
            content={finalContent.leftSection.subtitle}
            defaultTag="h3"
            className="mb-2 w-full max-w-[20rem] text-center font-semibold text-[#1E1F21] sm:max-w-none min-[1250px]:mb-4 min-[1250px]:w-[640px] min-[1250px]:text-left [&_h2]:m-0 [&_h2]:text-[clamp(1.25rem,3vw,2rem)] [&_h2]:leading-[1.3] [&_h3]:m-0 [&_h3]:text-[clamp(1.25rem,3vw,2rem)] [&_h3]:leading-[1.3] [&_p]:m-0 [&_p]:text-[clamp(1.25rem,3vw,2rem)] [&_p]:leading-[1.3]"
          />
          <RichTextBlock
            as="div"
            content={finalContent.leftSection.description}
            defaultTag="p"
            className="mt-4 mb-5 max-w-88 text-center text-[#667085] sm:mb-6 sm:max-w-md min-[1250px]:mt-0 min-[1250px]:min-w-150 min-[1250px]:text-left min-[1250px]:leading-relaxed [&_p]:m-0 [&_p]:text-[clamp(0.8125rem,1.8vw,1.125rem)] [&_p]:leading-[1.8]"
          />

          <Button asChild className="w-full rounded-full bg-[#06457F] px-6 py-4 text-white sm:w-auto sm:px-8 sm:py-5 min-[1250px]:py-6">
            <Link href="/about-us">
              <RichTextInline content={finalContent.leftSection.buttonText} />
            </Link>
          </Button>
        </div>

        {/* Right section: services card */}
        <div
          className="relative flex w-full min-h-[320px] min-w-0 flex-1 flex-col items-center overflow-hidden rounded-xl p-4 py-6 sm:min-h-[360px] sm:p-5 sm:py-8 md:min-h-0 min-[1250px]:max-w-[650px]"
          style={{ background: 'linear-gradient(135deg, #06457F 0%, #0474C4 50%, #0A192F 100%)' }}
        >

          <div className="relative z-10 flex w-full max-w-full flex-col items-center gap-4 sm:gap-6 md:gap-6">
            <RichTextBlock
              as="div"
              content={finalContent.rightSection.title}
              defaultTag="h3"
              className="px-2 text-center font-bold text-white [&_h2]:m-0 [&_h2]:text-[clamp(1.5rem,4vw,2.75rem)] [&_h3]:m-0 [&_h3]:text-[clamp(1.5rem,4vw,2.75rem)] [&_p]:m-0 [&_p]:text-[clamp(1.5rem,4vw,2.75rem)]"
            />

            <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3">
              {finalContent.rightSection.services.map((service) => {
                const isSelected = selected.includes(service.id);
                return (
                  <button
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`flex min-w-0 items-center gap-2 rounded-[0.375rem] px-3 py-3 text-left text-xs font-medium transition-all duration-200 sm:gap-3 sm:px-4 sm:py-4 sm:text-sm md:text-base ${
                      isSelected
                        ? 'bg-white text-[#06457F] shadow-lg'
                        : 'bg-white/20 text-[#ffffff] hover:bg-white/30'
                    }`}
                  >
                    <div
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-all duration-200 sm:h-5 sm:w-5 ${
                        isSelected
                          ? 'border-[#06457F] bg-[#06457F]'
                          : 'border-[#B9B9B9] bg-transparent'
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="h-2.5 w-2.5 text-white sm:h-3 sm:w-3"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </div>
                    <span className="min-w-0 flex-1 truncate">
                      <RichTextInline content={service.label} />
                    </span>
                  </button>
                );
              })}
            </div>

            <Button
              type="button"
              onClick={() => setModalOpen(true)}
              className="w-full rounded-full bg-[#06457F] px-6 py-4 text-white sm:w-auto sm:px-8 sm:py-5 min-[1250px]:py-6"
            >
              <RichTextInline content={finalContent.rightSection.buttonText} />
            </Button>
          </div>
        </div>
      </div>

      <ContactFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedServices={finalContent.rightSection.services.filter((s) =>
          selected.includes(s.id)
        )}
      />
    </div>
  );
}
