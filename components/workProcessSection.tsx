'use client';

import * as React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { workProcessSectionContent as defaultContent } from './contents/Landing/content';
import { useContent, ContentPath } from './contents/useContent';
import Image from '@/components/common/SeoImage';
import { RichTextBlock, RichTextInline } from './common/RichTextContent';

type MotionLikeProps<T> = T & {
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  transition?: unknown;
  whileInView?: unknown;
  viewport?: unknown;
};

function MotionDiv({
  initial: _initial,
  animate: _animate,
  exit: _exit,
  transition: _transition,
  whileInView: _whileInView,
  viewport: _viewport,
  ...props
}: MotionLikeProps<React.HTMLAttributes<HTMLDivElement>>) {
  return <div {...props} />;
}

function MotionParagraph({
  initial: _initial,
  animate: _animate,
  exit: _exit,
  transition: _transition,
  whileInView: _whileInView,
  viewport: _viewport,
  ...props
}: MotionLikeProps<React.HTMLAttributes<HTMLParagraphElement>>) {
  return <p {...props} />;
}

function MotionHeading({
  initial: _initial,
  animate: _animate,
  exit: _exit,
  transition: _transition,
  whileInView: _whileInView,
  viewport: _viewport,
  ...props
}: MotionLikeProps<React.HTMLAttributes<HTMLHeadingElement>>) {
  return <h2 {...props} />;
}

const motion = {
  div: MotionDiv,
  p: MotionParagraph,
  h2: MotionHeading,
};

function AnimatePresence({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

interface WorkProcessSectionProps {
  contentPath?: ContentPath;
  content?: typeof defaultContent;
}

export default function WorkProcessSection({
  contentPath,
  content,
}: WorkProcessSectionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);
  const queryKey = 'step';
  const closedToken = 'none';

  const finalContent = useContent(contentPath, content || defaultContent);
  const steps = finalContent.steps;

  const syncUrl = React.useCallback((index: number | null, historyMode: 'push' | 'replace' = 'push') => {
    if (typeof window === 'undefined') return;
    const nextParams = new URLSearchParams(window.location.search);
    if (index === null) {
      nextParams.set(queryKey, closedToken);
    } else if (index === 0) {
      nextParams.delete(queryKey);
    } else {
      nextParams.set(queryKey, String(steps[index]?.id ?? index + 1));
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
  }, [steps]);

  React.useEffect(() => {
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

      let nextIndex = steps.findIndex((step) => String(step.id) === rawValue);
      if (nextIndex < 0) {
        const asNumber = Number(rawValue);
        if (Number.isInteger(asNumber)) {
          const normalizedIndex = asNumber - 1;
          if (normalizedIndex >= 0 && normalizedIndex < steps.length) {
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
  }, [steps, syncUrl]);

  const toggleStep = (index: number) => {
    const nextIndex = openIndex === index ? null : index;
    setOpenIndex(nextIndex);
    syncUrl(nextIndex, 'push');
  };

  return (
    <div className="relative overflow-hidden py-8">
      <Image
        src="/assets/images/left-blur.png"
        alt=""
        width={400}
        height={973}
        className="absolute left-[-130px] top-[500px] -translate-y-1/2 z-0 pointer-events-none"
        style={{ objectFit: 'contain', maxHeight: '120%' }}
        aria-hidden="true"
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* Left Column - Heading and Description */}
          <div className="text-center lg:flex-1 lg:text-left">

            {finalContent.subtitle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-[#06457F] text-[1.25rem] font-medium"
              >
                <RichTextBlock as="div" content={finalContent.subtitle} defaultTag="p" />
              </motion.div>
            )}

            {finalContent.title && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-6 font-bold text-gray-900"
                style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)' }}
              >
                <RichTextBlock as="div" content={finalContent.title} defaultTag="h2" />
              </motion.div>
            )}
            {finalContent.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="leading-relaxed text-gray-600"
                style={{ fontSize: 'clamp(0.95rem, 2vw, 1.125rem)' }}
              >
                <RichTextBlock as="div" content={finalContent.description} defaultTag="p" />
              </motion.div>
            )}
          </div>

          {/* Right Column - Process Steps Accordion */}
          <div className="lg:flex-1">
            <div className="space-y-0">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <button
                    onClick={() => toggleStep(index)}
                    className="flex w-full px-2 items-center justify-between gap-4 py-6 text-left transition-colors hover:bg-gray-50"
                    aria-expanded={openIndex === index}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-2xl font-bold transition-colors ${
                          openIndex === index
                            ? 'text-[#06457F]'
                            : 'text-gray-400'
                        }`}
                      >
                        {String(step.id).padStart(2, '0')}
                      </span>
                      <h3
                        className={`font-semibold  transition-colors ${
                          openIndex === index
                            ? 'text-gray-900'
                            : 'text-gray-600'
                        }`}
                        style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)' }}
                      >
                        <RichTextInline content={step.title} />
                      </h3>
                    </div>
                    {openIndex === index ? (
                      <ChevronUp className="h-5 w-5 shrink-0 text-[#06457F]" />
                    ) : (
                      <ChevronDown className="h-5 w-5 shrink-0 text-[#06457F]" />
                    )}
                  </button>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pr-12 pb-6 pl-16">
                          <RichTextBlock
                            as="div"
                            content={step.description}
                            defaultTag="p"
                            className="leading-relaxed text-gray-600"
                            style={{
                              fontSize: 'clamp(0.95rem, 2vw, 1.125rem)',
                            }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
