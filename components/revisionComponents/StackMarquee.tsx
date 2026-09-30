"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import type { WebDevContent } from "@/revision-json-content/web-development/useWebDevContent";

const smKeyframes = `
@keyframes smWordPop {
  0% { opacity: 0; transform: translate3d(0, 12px, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes smFadeUp {
  0% { opacity: 0; transform: translate3d(0, 20px, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
`;

export default function StackMarquee({ content }: { content: WebDevContent["stackMarquee"] }) {
  const STACKS = content.stacks;
  const SM_HEADING_WORDS = content.heading.split(" ");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.15, rootMargin: "0px 0px -30px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="stack-marquee-section relative overflow-hidden bg-[linear-gradient(90deg,#06457F_0%,#262B40_50%,#0474C4_100%)] py-8 md:py-10">
      <style dangerouslySetInnerHTML={{ __html: smKeyframes }} />
      <div className="relative mx-auto max-w-[1600px] px-3 md:px-4">
        <h2 className="text-center text-[1.55rem] font-semibold leading-tight text-white md:text-[2.8rem]">
          {SM_HEADING_WORDS.map((word, i) => (
            <span
              key={i}
              className="inline-block"
              style={
                isVisible
                  ? { willChange: "opacity, transform", animation: `smWordPop 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${i * 55}ms forwards`, opacity: 0 }
                  : { opacity: 0 }
              }
            >
              {word}{i < SM_HEADING_WORDS.length - 1 ? "\u00A0" : ""}
            </span>
          ))}
        </h2>

        <div
          className="mt-4 overflow-hidden md:mt-6"
          style={
            isVisible
              ? { willChange: "opacity, transform", animation: "smFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 350ms forwards", opacity: 0 }
              : { opacity: 0 }
          }
        >
          <Marquee className="stack-marquee-track" gradient={false} autoFill speed={45} pauseOnHover>
            <div className="flex items-end gap-2 px-2 md:gap-3 md:px-3">
              {STACKS.map((stack) => (
                <div
                  key={stack.name}
                  className="group relative flex h-[92px] w-[88px] shrink-0 items-center justify-center rounded-xl border border-white/0 transition md:h-[118px] md:w-[112px] md:rounded-2xl"
                >
                  <Image
                    src={stack.src}
                    alt={stack.name}
                    width={56}
                    height={56}
                    className="h-9 w-9 select-none object-contain transition duration-300 group-hover:-translate-y-2 md:h-14 md:w-14"
                    draggable={false}
                  />

                  <span className="pointer-events-none absolute bottom-0 translate-y-1 whitespace-nowrap text-[0.52rem] font-semibold tracking-[0.03em] text-white/95 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:text-[0.72rem]">
                    {stack.name}
                  </span>
                </div>
              ))}
            </div>
          </Marquee>
        </div>
      </div>

      <style jsx global>{`
        .stack-marquee-track,
        .stack-marquee-track * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .stack-marquee-track::-webkit-scrollbar,
        .stack-marquee-track *::-webkit-scrollbar {
          width: 0;
          height: 0;
          display: none;
        }
      `}</style>
    </section>
  );
}
