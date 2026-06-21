"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { IoFlash } from "react-icons/io5";
import type { WebDevContent } from "@/revision-json-content/web-development/useWebDevContent";

const hbwKeyframes = `
@keyframes hbwFadeUp {
  0% { opacity: 0; transform: translate3d(0, 20px, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes hbwWordPop {
  0% { opacity: 0; transform: translate3d(0, 12px, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
`;

export default function HelpBuildWeb({ content }: { content: WebDevContent["helpBuildWeb"] }) {
  const PROCESS_CARDS = content.processCards;
  const HBW_HEADING_WORDS = content.heading.split(" ");
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [hasCardsEnteredView, setHasCardsEnteredView] = useState(false);
  const [isSectionVisible, setIsSectionVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsSectionVisible(true); observer.disconnect(); } },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (hasCardsEnteredView) return;

    const target = cardsGridRef.current;
    if (!target || typeof IntersectionObserver === "undefined") {
      setHasCardsEnteredView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setHasCardsEnteredView(true);
          observer.disconnect();
        });
      },
      { threshold: 0.22 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasCardsEnteredView]);

  return (
    <section ref={sectionRef} className="bg-[#F6F6F6] py-12 md:py-16 xl:py-20">
      <style dangerouslySetInnerHTML={{ __html: hbwKeyframes }} />
      <div className="container mx-auto px-4 md:px-8 xl:px-12">
        <div className="mx-auto max-w-[1320px] rounded-[20px] border border-[#b892ff] bg-[#f3f3f6] px-5 py-10 shadow-[0_18px_34px_rgba(17,24,39,0.06)] md:rounded-[24px] md:px-10 md:py-14 xl:px-14 xl:py-16">
          <div className="mx-auto max-w-[1220px] text-center">
            <span
              className="inline-flex items-center gap-2 rounded-full bg-[#ddd8ff] px-4 py-2 text-sm font-medium text-[#7e4dff] md:px-6 md:text-base"
              style={
                isSectionVisible
                  ? { willChange: "opacity, transform", animation: "hbwFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0ms forwards", opacity: 0 }
                  : { opacity: 0 }
              }
            >
              <IoFlash className="h-4 w-4" aria-hidden />
              {content.badge}
            </span>

            <h2 className="mt-5 text-[1.9rem] font-semibold leading-[1.18] text-[#20222a] md:mt-6 md:text-[2.3rem] lg:text-[2.55rem]">
              {HBW_HEADING_WORDS.map((word, i) => (
                <span
                  key={i}
                  className="inline-block"
                  style={
                    isSectionVisible
                      ? { willChange: "opacity, transform", animation: `hbwWordPop 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${100 + i * 50}ms forwards`, opacity: 0 }
                      : { opacity: 0 }
                  }
                >
                  {word}{i < HBW_HEADING_WORDS.length - 1 ? "\u00A0" : ""}
                </span>
              ))}
            </h2>
          </div>

          <div ref={cardsGridRef} className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-6">
            {PROCESS_CARDS.map((card, index) => (
              <article
                key={card.title}
                className={`${
                  hasCardsEnteredView ? "help-card-enter" : "help-card-base"
                } min-h-[220px] rounded-[16px] border border-[#dcc4ff] bg-[#f3f3f6] px-5 pb-6 pt-7 md:min-h-[238px] md:px-7 md:pb-7 md:pt-8`}
                style={{ animationDelay: `${0.08 + index * 0.09}s` }}
              >
                <Image src={card.icon} alt={`${card.title} icon`} width={36} height={36} className="h-9 w-9" />

                <h3 className="mt-5 text-[1.14rem] font-medium leading-[1.3] text-[#20222a] md:text-[1.32rem]">
                  {card.title}
                </h3>

                <p className="mt-4 max-w-[260px] text-[0.98rem] leading-[1.55] text-[#586476] md:text-[1.03rem]">
                  {card.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .help-card-base {
          opacity: 0;
          transform: translateY(24px) scale(0.82);
          transform-origin: center;
        }

        .help-card-enter {
          opacity: 0;
          transform: translateY(24px) scale(0.82);
          transform-origin: center;
          animation: helpCardEnter 0.62s cubic-bezier(0.2, 0.78, 0.24, 1) forwards;
          will-change: transform, opacity;
        }

        @keyframes helpCardEnter {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.82);
          }
          70% {
            opacity: 1;
            transform: translateY(-2px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .help-card-base,
          .help-card-enter {
            opacity: 1;
            transform: none;
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
