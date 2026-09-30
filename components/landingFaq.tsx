'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { landingFaqContent as defaultContent } from './contents/Landing/content';
import { useContent, ContentPath } from './contents/useContent';
import { RichTextBlock, RichTextInline } from './common/RichTextContent';

interface LandingFaqProps {
  contentPath?: ContentPath;
  content?: typeof defaultContent;
  headingTag?: 'h2' | 'h3';
}

export default function LandingFaq({
  contentPath,
  content,
  headingTag = 'h2',
}: LandingFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const queryKey = 'faq';
  const closedToken = 'none';

  const finalContent = useContent(contentPath, content || defaultContent);
  const faqs = finalContent.faqs;
  const HeadingTag = headingTag;

  const syncUrl = useCallback((index: number | null, historyMode: 'push' | 'replace' = 'push') => {
    if (typeof window === 'undefined') return;
    const nextParams = new URLSearchParams(window.location.search);
    if (index === null) {
      nextParams.set(queryKey, closedToken);
    } else if (index === 0) {
      nextParams.delete(queryKey);
    } else {
      nextParams.set(queryKey, String(faqs[index]?.id ?? index + 1));
    }

    const nextSearch = nextParams.toString();
    const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}${window.location.hash}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (nextUrl === currentUrl) return;

    window.history[historyMode === 'replace' ? 'replaceState' : 'pushState'](
      window.history.state,
      '',
      nextUrl
    );
  }, [faqs]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const applyStateFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const rawValue = params.get(queryKey);

      if (!rawValue) {
        setOpenIndex((prev) => (prev === 0 ? prev : 0));
        return;
      }

      if (rawValue === closedToken) {
        setOpenIndex((prev) => (prev === null ? prev : null));
        return;
      }

      let nextIndex = faqs.findIndex((faq) => String(faq.id) === rawValue);
      if (nextIndex < 0) {
        const asNumber = Number(rawValue);
        if (Number.isInteger(asNumber)) {
          const normalizedIndex = asNumber - 1;
          if (normalizedIndex >= 0 && normalizedIndex < faqs.length) {
            nextIndex = normalizedIndex;
          }
        }
      }

      if (nextIndex < 0) {
        setOpenIndex((prev) => (prev === 0 ? prev : 0));
        syncUrl(0, 'replace');
        return;
      }

      setOpenIndex((prev) => (prev === nextIndex ? prev : nextIndex));
    };

    applyStateFromUrl();
    window.addEventListener('popstate', applyStateFromUrl);
    return () => window.removeEventListener('popstate', applyStateFromUrl);
  }, [faqs, syncUrl]);

  const toggleFaq = (index: number) => {
    const nextIndex = openIndex === index ? null : index;
    setOpenIndex(nextIndex);
    syncUrl(nextIndex, 'push');
  };

  return (
    <div className="px-[1rem] py-8 sm:px-[2rem]">
      <div className="container mx-auto max-w-4xl">
        {/* Header Section */}
        {(finalContent.title || finalContent.subtitle) && (
          <div className="mb-8 flex flex-col items-center gap-4 text-center lg:mb-12">
            {finalContent.title && (
              <RichTextBlock
                as="div"
                content={finalContent.title}
                defaultTag={HeadingTag}
                className="leading-tight font-bold text-[#1E1F21]"
                style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)' }}
              />
            )}
            {finalContent.subtitle && (
              <RichTextBlock
                as="div"
                content={finalContent.subtitle}
                defaultTag="p"
                className="max-w-2xl leading-relaxed text-[#667085]"
                style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}
              />
            )}
          </div>
        )}

        {/* FAQ Accordion */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleFaq(index)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-gray-50 sm:p-6"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${faq.id}`}
              >
                <h3
                  className="flex-1 font-semibold text-[#1E1F21]"
                  style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)' }}
                >
                  <RichTextInline content={faq.question} />
                </h3>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[#06457F] transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              {/* Answer Content */}
              <div
                id={`faq-answer-${faq.id}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? 'max-h-[500px] opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                  <RichTextBlock
                    as="div"
                    content={faq.answer}
                    defaultTag="p"
                    className="border-t-2 border-t-[#F0F5FA] pt-2 leading-relaxed text-[#667085]"
                    style={{ fontSize: 'clamp(0.95rem, 2vw, 1.125rem)' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
