"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IoFlash } from "react-icons/io5";
import styles from "./ServicesShowcase.module.css";
import type { WebDevContent } from "@/revision-json-content/web-development/useWebDevContent";

function getCenterSlidePercentage(width: number) {
  if (width < 640) return 88;
  if (width < 1024) return 49;
  return 28.5;
}

const DESKTOP_MIN_INDEX = 1;

const showcaseKeyframes = `
@keyframes scFadeUp {
  0% { opacity: 0; transform: translate3d(0, 20px, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes scWordPop {
  0% { opacity: 0; transform: translate3d(0, 12px, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
`;

export default function ServicesShowcase({ content }: { content: WebDevContent["servicesShowcase"] }) {
  const SERVICES = content.services;
  const DESKTOP_MAX_INDEX = Math.max(DESKTOP_MIN_INDEX, SERVICES.length - 2);
  const HEADING_WORDS = content.heading.split(" ");
  const [selectedItem, setSelectedItem] = useState(0);
  const [centerSlidePercentage, setCenterSlidePercentage] = useState(28.5);
  const [desktopTrackMode, setDesktopTrackMode] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const anim = (delay: number): React.CSSProperties =>
    isVisible
      ? { willChange: "opacity, transform", animation: `scFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms forwards`, opacity: 0 }
      : { opacity: 0 };

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      const nextPercentage = getCenterSlidePercentage(width);
      const isDesktop = width >= 1024;

      setCenterSlidePercentage(nextPercentage);
      setDesktopTrackMode(isDesktop);
      setSelectedItem((prev) => {
        if (!isDesktop) return prev;
        if (prev < DESKTOP_MIN_INDEX || prev > DESKTOP_MAX_INDEX) return DESKTOP_MIN_INDEX;
        return prev;
      });
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  const goPrev = () => {
    if (desktopTrackMode) {
      setSelectedItem((prev) => (prev <= DESKTOP_MIN_INDEX ? DESKTOP_MAX_INDEX : prev - 1));
      return;
    }
    setSelectedItem((prev) => (prev - 1 + content.services.length) % content.services.length);
  };

  const goNext = () => {
    if (desktopTrackMode) {
      setSelectedItem((prev) => (prev >= DESKTOP_MAX_INDEX ? DESKTOP_MIN_INDEX : prev + 1));
      return;
    }
    setSelectedItem((prev) => (prev + 1) % content.services.length);
  };

  return (
    <section ref={sectionRef} className="bg-[#020b3a] py-14 md:py-20 xl:py-24">
      <style dangerouslySetInnerHTML={{ __html: showcaseKeyframes }} />
      <div className="mx-auto w-full max-w-[1260px] px-4 md:px-8 xl:px-12">
        <div className="mx-auto max-w-4xl container text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-[#6a40ff]" style={anim(0)}>
            <IoFlash className="h-3.5 w-3.5" aria-hidden />
            {content.badge}
          </span>

          <h2 className="mt-5 text-[30px] font-semibold leading-[1.2] text-[#f3f6ff] md:text-[34px] md:leading-[1.18] lg:text-[42px] lg:leading-[1.16]">
            {HEADING_WORDS.map((word, i) => (
              <span
                key={i}
                className="inline-block"
                style={
                  isVisible
                    ? { willChange: "opacity, transform", animation: `scWordPop 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${120 + i * 60}ms forwards`, opacity: 0 }
                    : { opacity: 0 }
                }
              >
                {word}{i < HEADING_WORDS.length - 1 ? "\u00A0" : ""}
              </span>
            ))}
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-[1rem] leading-relaxed text-white/90" style={anim(240)}>
            {content.description}
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 md:pl-10 lg:pl-14 xl:pl-[7.5rem] md:pr-0">
        <div className={`mt-10 md:mt-12 ${styles.carouselRoot}`} style={anim(380)}>
          <Carousel
            selectedItem={selectedItem}
            onChange={(index) => {
              if (!desktopTrackMode) {
                setSelectedItem(index);
                return;
              }
              if (index < DESKTOP_MIN_INDEX) {
                setSelectedItem(DESKTOP_MIN_INDEX);
                return;
              }
              if (index > DESKTOP_MAX_INDEX) {
                setSelectedItem(DESKTOP_MAX_INDEX);
                return;
              }
              setSelectedItem(index);
            }}
            emulateTouch
            swipeable
            showArrows={false}
            showStatus={false}
            showIndicators={false}
            showThumbs={false}
            centerMode
            centerSlidePercentage={centerSlidePercentage}
            transitionTime={650}
            preventMovementUntilSwipeScrollTolerance
            swipeScrollTolerance={30}
          >
            {SERVICES.map((service, i) => (
              <div
                key={service.title}
                className="px-2 md:px-3"
                style={
                  isVisible
                    ? { willChange: "opacity, transform", animation: `scFadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${480 + i * 80}ms forwards`, opacity: 0 }
                    : { opacity: 0 }
                }
              >
                <article className="h-full">
                  <div className="relative aspect-[1/1] overflow-hidden rounded-[16px] md:rounded-[18px]">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 639px) 88vw, (max-width: 1023px) 49vw, 29vw"
                    />
                  </div>

                  <h3 className="mt-5 px-2 text-center text-[1.65rem] font-semibold leading-[1.18] text-[#d9dc6c] md:text-[1.95rem] lg:text-[1.4rem]">
                    {service.title}
                  </h3>

                  <p className="mt-3 px-2 text-center text-[14px] leading-relaxed text-white/95">
                    {service.description}
                  </p>
                </article>
              </div>
            ))}
          </Carousel>

          <div className="mt-7 flex items-center justify-center gap-3 px-2 md:mt-9 md:justify-start md:px-3">
            <button
              type="button"
              onClick={goPrev}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#2a2f39] text-white transition hover:bg-[#394151]"
              aria-label="Previous service slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#2a2f39] text-white transition hover:bg-[#394151]"
              aria-label="Next service slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
