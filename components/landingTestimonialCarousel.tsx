'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Image from '@/components/common/SeoImage';
import { landingTestimonialCarouselContent as defaultContent } from './contents/Landing/content';
import { useContent, ContentPath } from './contents/useContent';
import { RichTextBlock, RichTextInline, richTextToPlainText } from './common/RichTextContent';

interface LandingTestimonialCarouselProps {
  contentPath?: ContentPath;
  content?: typeof defaultContent;
}

export default function LandingTestimonialCarousel({
  contentPath,
  content,
}: LandingTestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const finalContent = useContent(contentPath, content || defaultContent);
  const testimonials = finalContent.testimonials as Array<
    (typeof defaultContent.testimonials)[number] & { stars?: number; image?: string }
  >;

  // Calculate cards per view based on screen size
  useEffect(() => {
    const updateCardsPerView = () => {
      setIsMobile(window.innerWidth < 640);
      if (window.innerWidth >= 1024) {
        setCardsPerView(3); // Desktop: 3 cards
      } else if (window.innerWidth >= 640) {
        setCardsPerView(2); // Tablet: 2 cards
      } else {
        setCardsPerView(1); // Mobile: 1 card
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  // Calculate max index based on cards per view
  const maxIndex = Math.max(0, testimonials.length - cardsPerView);

  // Auto-slide functionality - slide one card at a time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex >= maxIndex) {
          return 0; // Slide back to first when reaching the end
        }
        return prevIndex + 1;
      });
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [maxIndex]);

  const goToSlide = (index: number) => {
    if (index < 0) {
      setCurrentIndex(maxIndex);
    } else if (index > maxIndex) {
      setCurrentIndex(0); // Slide back to first when reaching the end
    } else {
      setCurrentIndex(index);
    }
  };

  const goToNext = () => {
    if (currentIndex >= maxIndex) {
      setCurrentIndex(0); // Slide back to first
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex <= 0) {
      setCurrentIndex(maxIndex);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMobile) return;
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isMobile) return;
    if (!isDragging) return;
    const currentTouch = e.targetTouches[0].clientX;
    const diff = touchStart - currentTouch;
    setDragOffset(diff);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isMobile) return;
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diff = touchStart - endX;
    const swipeThreshold = 50; // Minimum distance for a swipe

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - go to next
        goToNext();
      } else {
        // Swipe right - go to previous
        goToPrev();
      }
    }

    setIsDragging(false);
    setDragOffset(0);
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className="px-[1rem] py-8 sm:px-[2rem]">
      <div className="container mx-auto">
        {/* Header Section */}
        {(finalContent.title || finalContent.subtitle) && (
          <div className="mb-8 flex flex-col items-center gap-2 text-center lg:mb-12">
            {finalContent.title && (
              <RichTextBlock
                as="div"
                content={finalContent.title}
                defaultTag="h2"
                className="leading-tight font-bold text-[#1E1F21]"
                style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)' }}
              />
            )}
            {finalContent.subtitle && (
              <RichTextBlock
                as="div"
                content={finalContent.subtitle}
                defaultTag="p"
                className="leading-relaxed text-[#667085]"
                style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}
              />
            )}

            {/* Mobile Arrows (no overlap) */}
            <div className="mt-2 flex w-full justify-center gap-3 sm:hidden">
              <button
                onClick={goToPrev}
                className="rounded-full bg-white p-2 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5 text-[#1E1F21]" />
              </button>
              <button
                onClick={goToNext}
                className="rounded-full bg-white p-2 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5 text-[#1E1F21]" />
              </button>
            </div>
          </div>
        )}

        {/* Carousel Container */}
        <div className="relative">
          {/* Cards Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(calc(-${(currentIndex * 100) / cardsPerView}% + ${isDragging ? -dragOffset : 0}px))`,
                transitionDuration: isDragging ? '0ms' : '500ms',
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
            >
              {testimonials.map((testimonial) => {
                const stars = Math.max(0, Math.min(5, Number(testimonial?.stars ?? 5)));
                const avatarSrc = testimonial?.image || testimonial?.avatar;

                return (
                  <div
                    key={testimonial.id}
                    className="w-full shrink-0 px-1 py-2 sm:w-1/2 sm:px-4 lg:w-1/3 lg:px-3"
                  >
                    {/* Card Content */}
                    <div className="flex h-full flex-col rounded-lg border border-[#f5f5f5] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                      {/* Quote Icon and Rating */}
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#8C52FF] bg-transparent" aria-hidden="true">
                          <Image
                            src={finalContent.quoteIcon}
                            seo={(finalContent as any).quoteIconSeo}
                            alt=""
                            width={20}
                            height={20}
                            className="h-5 w-5 object-contain"
                          />
                        </div>
                        <div className="flex gap-1">
                          {[...Array(stars)].map((_, i) => (
                            <svg
                              key={i}
                              className="h-5 w-5 fill-yellow-400 text-yellow-400"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                      </div>

                      {/* Testimonial Text */}
                      <RichTextBlock
                        as="div"
                        content={testimonial.text}
                        defaultTag="p"
                        className="mb-6 flex-1 leading-relaxed text-[#667085]"
                        style={{ fontSize: 'clamp(0.95rem, 2vw, 1.125rem)' }}
                      />

                      {/* Client Information */}
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-200">
                          {avatarSrc ? (
                            <Image
                              src={avatarSrc}
                              seo={(testimonial as any).avatarSeo}
                              alt={richTextToPlainText(testimonial.name)}
                              fill
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <div>
                          <div
                            className="font-semibold text-[#1E1F21]"
                            style={{ fontSize: 'clamp(0.95rem, 2vw, 1.125rem)' }}
                          >
                            <RichTextInline content={testimonial.name} />
                          </div>
                          <div
                            className="text-[#667085]"
                            style={{
                              fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                            }}
                          >
                            <RichTextInline content={testimonial.title} />
                            {testimonial.title && testimonial.company ? ', ' : null}
                            <RichTextInline content={testimonial.company} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons - Hidden on mobile */}
          <button
            onClick={goToPrev}
            className="absolute top-1/2 left-0 z-10 hidden -translate-x-4 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl sm:block lg:-translate-x-6"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6 text-[#1E1F21]" />
          </button>
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-0 z-10 hidden translate-x-4 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl sm:block lg:translate-x-6"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6 text-[#1E1F21]" />
          </button>
        </div>

        {/* Dots Indicator - Show all 6 on mobile, 4 on desktop */}
        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-[#8C52FF]'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              } ${index >= 4 ? 'sm:hidden' : ''}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
