"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Stack from "@/components/Stack";
import type { WebDevContent } from "@/revision-json-content/web-development/useWebDevContent";

type StackDirection = "forward" | "backward";
const NAV_LOCK_EVENT = "sticky-section-navbar-lock";
const INDEX_HYSTERESIS = 0.08;

const ssKeyframes = `
@keyframes ssWordPop {
  0% { opacity: 0; transform: translate3d(0, 12px, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
`;

export default function StickySection({ content }: { content: WebDevContent["stickySection"] }) {
  const STICKY_ITEMS = content.items;
  const STICKY_IMAGES = content.images;
  const SS_HEADING_LINE1 = content.headingLine1.split(" ");
  const SS_HEADING_LINE2 = content.headingLine2.split(" ");
  const sectionRef = useRef<HTMLElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const cardsListRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);
  const hasMeasuredScrollRef = useRef(false);
  const navLockRef = useRef(false);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [stackDirection, setStackDirection] = useState<StackDirection>("forward");
  const [hasServiceCardsEnteredView, setHasServiceCardsEnteredView] = useState(false);
  const [isSectionVisible, setIsSectionVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsSectionVisible(true); observer.disconnect(); } },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let rafId: number | null = null;

    const setNavbarLock = (locked: boolean) => {
      if (navLockRef.current === locked) return;
      navLockRef.current = locked;
      window.dispatchEvent(new CustomEvent(NAV_LOCK_EVENT, { detail: { locked } }));
    };

    const updateActiveCard = () => {
      const applyIndex = (nextIndex: number) => {
        const previousIndex = activeIndexRef.current;
        if (nextIndex === previousIndex) return;
        setStackDirection(nextIndex > previousIndex ? "forward" : "backward");
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
      };

      const scrollTrack = scrollTrackRef.current;
      if (!scrollTrack) {
        setNavbarLock(false);
        return;
      }

      const currentScrollY = window.scrollY;
      const isScrollingUp = hasMeasuredScrollRef.current && currentScrollY < lastScrollYRef.current;
      hasMeasuredScrollRef.current = true;
      lastScrollYRef.current = currentScrollY;

      if (window.innerWidth < 1024) {
        applyIndex(0);
        setNavbarLock(false);
        return;
      }

      const rect = scrollTrack.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const sectionHeight = scrollTrack.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollRange = sectionHeight - viewportHeight;

      if (scrollRange <= 0) {
        applyIndex(0);
        setNavbarLock(false);
        return;
      }

      const sectionEnd = sectionTop + scrollRange;
      const isWithinStickyRange = currentScrollY >= sectionTop && currentScrollY <= sectionEnd;
      setNavbarLock(isWithinStickyRange && isScrollingUp);

      const scrolledWithinSection = currentScrollY - sectionTop;
      const progress = Math.min(Math.max(scrolledWithinSection / scrollRange, 0), 1);
      const rawIndexFloat = progress * STICKY_ITEMS.length;
      const rawIndex = Math.min(STICKY_ITEMS.length - 1, Math.floor(rawIndexFloat));
      const previousIndex = activeIndexRef.current;
      let nextIndex = rawIndex;

      if (rawIndex > previousIndex && rawIndexFloat < previousIndex + 1 + INDEX_HYSTERESIS) {
        nextIndex = previousIndex;
      } else if (rawIndex < previousIndex && rawIndexFloat > previousIndex - INDEX_HYSTERESIS) {
        nextIndex = previousIndex;
      }

      applyIndex(nextIndex);
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        updateActiveCard();
      });
    };

    updateActiveCard();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      setNavbarLock(false);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (hasServiceCardsEnteredView) return;

    const target = cardsListRef.current;
    if (!target || typeof IntersectionObserver === "undefined") {
      setHasServiceCardsEnteredView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setHasServiceCardsEnteredView(true);
          observer.disconnect();
        });
      },
      { threshold: 0.18 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasServiceCardsEnteredView]);

  const stackCards = useMemo(
    () =>
      STICKY_IMAGES.map((src, index) => (
        <div key={src} className="relative h-full w-full">
          <Image
            src={src}
            alt={STICKY_ITEMS[index].title}
            fill
            style={{ objectFit: "cover", objectPosition: "left center" }}
            sizes="(max-width: 1024px) 100vw, 35vw"
            priority={index === 0}
          />
        </div>
      )),
    [],
  );

  return (
    <section ref={sectionRef} className="bg-[#F6F6F6] py-14 md:py-20 xl:py-24">
      <style dangerouslySetInnerHTML={{ __html: ssKeyframes }} />
      <div className="container mx-auto px-4 md:px-8 xl:px-12">
        <div className="mx-auto max-w-[1260px]">
          <h2 className="max-w-[760px] text-[2.05rem] font-semibold leading-[1.18] text-[#1f2229] md:text-[2.8rem] lg:text-[3.35rem]">
            {SS_HEADING_LINE1.map((word, i) => (
              <span
                key={i}
                className="inline-block"
                style={
                  isSectionVisible
                    ? { willChange: "opacity, transform", animation: `ssWordPop 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${i * 55}ms forwards`, opacity: 0 }
                    : { opacity: 0 }
                }
              >
                {word}{i < SS_HEADING_LINE1.length - 1 ? "\u00A0" : ""}
              </span>
            ))}
            <br />
            {SS_HEADING_LINE2.map((word, i) => (
              <span
                key={i}
                className="inline-block"
                style={
                  isSectionVisible
                    ? { willChange: "opacity, transform", animation: `ssWordPop 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${(SS_HEADING_LINE1.length + i) * 55}ms forwards`, opacity: 0 }
                    : { opacity: 0 }
                }
              >
                {word}{i < SS_HEADING_LINE2.length - 1 ? "\u00A0" : ""}
              </span>
            ))}
          </h2>

          <div className="mt-8 lg:mt-10">
            <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-3 lg:hidden">
              {STICKY_IMAGES.map((src, index) => (
                <div
                  key={`mobile-top-image-${src}`}
                  className="relative h-[98px] overflow-hidden rounded-[16px] border border-[#dde1e8] bg-[#d6d6da] sm:h-[120px]"
                >
                  <Image
                    src={src}
                    alt={STICKY_ITEMS[index].title}
                    fill
                    style={{ objectFit: "cover", objectPosition: "left center" }}
                    sizes="(max-width: 640px) 33vw, 30vw"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>

            <div ref={scrollTrackRef} className="relative lg:h-[245vh]">
              <div className="grid gap-6 lg:sticky lg:top-8 lg:grid-cols-[1.62fr_1fr] xl:gap-6">
                <div ref={cardsListRef} className="space-y-4 md:space-y-5">
                  {STICKY_ITEMS.map((item, index) => {
                    const isActive = index === activeIndex;

                    return (
                      <article
                        key={item.title}
                        className={`${hasServiceCardsEnteredView ? "sticky-service-card-enter" : "sticky-service-card-base"} rounded-[30px] border border-[#e4e6ea] bg-[#f8f8f9] px-5 py-6 text-[#20242f] transition-all duration-500 md:px-7 md:py-7 ${
                          isActive
                            ? "lg:border-transparent lg:bg-[#020f3d] lg:text-white lg:shadow-[0_22px_44px_rgba(3,17,67,0.24)]"
                            : "lg:border lg:border-[#e4e6ea] lg:bg-[#f8f8f9] lg:text-[#20242f]"
                        }`}
                        style={{ animationDelay: `${0.06 + index * 0.085}s` }}
                      >
                        <div className="grid gap-4 md:grid-cols-[auto_minmax(170px,1fr)_minmax(250px,1.3fr)] md:items-start md:gap-6">
                          <span
                            className={`pt-1 text-sm font-medium tracking-[0.12em] ${
                              isActive ? "text-[#b0b4bc] lg:text-white/55" : "text-[#b0b4bc] lg:text-[#b0b4bc]"
                            }`}
                          >
                            {item.number}
                          </span>

                          <h3
                            className={`text-[2rem] font-semibold leading-[1.1] text-[#171c27] md:text-[2.45rem] ${
                              isActive ? "lg:text-white" : "lg:text-[#171c27]"
                            }`}
                          >
                            {item.title}
                          </h3>

                          <div>
                            <p
                              className={`text-[1.02rem] leading-[1.58] md:text-[1.06rem] md:leading-[1.6] ${
                                isActive ? "text-[#697487] lg:text-[#d4dcf2]" : "text-[#697487] lg:text-[#697487]"
                              }`}
                            >
                              {item.description}
                            </p>

                            <div className="mt-5 flex flex-wrap gap-2 md:mt-6">
                              {item.tags.map((tag) => (
                                <span
                                  key={`${item.title}-${tag}`}
                                  className={`inline-flex rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                                    isActive
                                      ? "border-[#cfd3da] text-[#333846] lg:border-white/24 lg:text-white/95"
                                      : "border-[#cfd3da] text-[#333846] lg:border-[#cfd3da] lg:text-[#333846]"
                                  }`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className={`${hasServiceCardsEnteredView ? "sticky-image-stack-enter" : "sticky-image-stack-base"} relative hidden overflow-visible rounded-[30px] bg-[#d6d6da] lg:block lg:min-h-[660px]`}>
                  <div className="relative h-[420px] w-full overflow-visible md:h-[520px] lg:h-full">
                    <Stack
                      cards={stackCards}
                      randomRotation={false}
                      controlledByScroll
                      scrollIndex={activeIndex}
                      scrollDirection={stackDirection}
                      cardClassName="border border-[#d0d4dd] bg-[#d6d6da] shadow-[0_20px_38px_rgba(15,23,42,0.2)]"
                      animationConfig={{ stiffness: 220, damping: 30 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sticky-service-card-base {
          opacity: 0;
          transform: translateY(-42px) scale(0.92);
          filter: blur(4px);
        }

        .sticky-service-card-enter {
          opacity: 0;
          transform: translateY(-42px) scale(0.92);
          filter: blur(4px);
          animation: stickyServiceCardDrop 0.78s cubic-bezier(0.2, 0.84, 0.24, 1) forwards;
          will-change: transform, opacity, filter;
        }

        @keyframes stickyServiceCardDrop {
          0% {
            opacity: 0;
            transform: translateY(-42px) scale(0.92);
            filter: blur(4px);
          }
          45% {
            opacity: 1;
            transform: translateY(-7px) scale(0.985);
            filter: blur(1px);
          }
          72% {
            opacity: 1;
            transform: translateY(12px) scale(1.015);
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        .sticky-image-stack-base {
          opacity: 0;
          transform: translateY(-42px) scale(0.92);
          filter: blur(4px);
        }

        .sticky-image-stack-enter {
          opacity: 0;
          transform: translateY(-42px) scale(0.92);
          filter: blur(4px);
          animation: stickyImageStackDrop 0.78s cubic-bezier(0.2, 0.84, 0.24, 1) 0.32s forwards;
          will-change: transform, opacity, filter;
        }

        @keyframes stickyImageStackDrop {
          0% {
            opacity: 0;
            transform: translateY(-42px) scale(0.92);
            filter: blur(4px);
          }
          45% {
            opacity: 1;
            transform: translateY(-7px) scale(0.985);
            filter: blur(1px);
          }
          72% {
            opacity: 1;
            transform: translateY(12px) scale(1.015);
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sticky-service-card-base,
          .sticky-service-card-enter {
            opacity: 1;
            transform: none;
            filter: none;
            animation: none;
          }

          .sticky-image-stack-base,
          .sticky-image-stack-enter {
            opacity: 1;
            transform: none;
            filter: none;
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
