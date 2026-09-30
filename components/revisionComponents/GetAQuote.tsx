"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiArrowUpRight } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import type { WebDevContent } from "@/revision-json-content/web-development/useWebDevContent";

const gaqKeyframes = `
@keyframes gaqFadeUp {
  0% { opacity: 0; transform: translate3d(0, 20px, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes gaqWordPop {
  0% { opacity: 0; transform: translate3d(0, 12px, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes gaqBtnCircleSlide {
  0% { transform: translate3d(-192px, 0, 0); }
  100% { transform: translate3d(0, 0, 0); }
}
@keyframes gaqBtnTextReveal {
  0% { opacity: 0; transform: translate3d(-14px, 0, 0); }
  50% { opacity: 0; transform: translate3d(-8px, 0, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
`;

export default function GetAQuote({ content }: { content: WebDevContent["getAQuote"] }) {
  const GAQ_LINE1 = content.headingLine1.split(" ");
  const GAQ_LINE2 = content.headingLine2.split(" ");
  const GAQ_ALL_WORDS = [...GAQ_LINE1, ...GAQ_LINE2];
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const gaqAnim = (delay: number): React.CSSProperties =>
    isVisible
      ? { willChange: "opacity, transform", animation: `gaqFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms forwards`, opacity: 0 }
      : { opacity: 0 };

  return (
    <section ref={sectionRef} className="bg-[#F6F6F6] pb-14 pt-6 md:pb-20 xl:pb-24">
      <style dangerouslySetInnerHTML={{ __html: gaqKeyframes }} />
      <div className="container mx-auto px-4 md:px-8 xl:px-12">
        <div className="mx-auto max-w-[1320px]">
          <div className="relative isolate overflow-hidden rounded-[22px] md:rounded-[30px]">
            <Image
              src={content.backgroundImage}
              alt={content.backgroundImageAlt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 92vw, 1320px"
            />

            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(0deg, rgba(0, 0, 0, 0.92) 2%, rgba(0, 0, 0, 0.65) 35%, rgba(255, 255, 255, 0) 100%)",
              }}
            />

            <div
              className="pointer-events-none absolute bottom-0 left-1/2 h-[308px] w-[308px] -translate-x-1/2 translate-y-[60%] rounded-full border border-white/10 sm:h-[412px] sm:w-[412px] lg:h-[556px] lg:w-[556px]"
              style={{
                background:
                  "radial-gradient(circle at center, transparent 0 43%, rgba(255,255,255,0.22) 45%, rgba(226,233,248,0.16) 63%, rgba(182,196,224,0.08) 76%, rgba(121,140,184,0) 86%)",
              }}
            />

            <div className="relative mx-auto flex min-h-[360px] max-w-[920px] flex-col items-center justify-center px-5 py-10 text-center sm:min-h-[420px] sm:px-8 md:min-h-[460px] md:px-12 lg:min-h-[490px]">
              <h2 className="text-balance text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em] text-white sm:text-[2.4rem] md:text-[3.1rem]">
                {GAQ_LINE1.map((word, i) => (
                  <span
                    key={i}
                    className="inline-block"
                    style={
                      isVisible
                        ? { willChange: "opacity, transform", animation: `gaqWordPop 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${i * 55}ms forwards`, opacity: 0 }
                        : { opacity: 0 }
                    }
                  >
                    {word}{i < GAQ_LINE1.length - 1 ? "\u00A0" : ""}
                  </span>
                ))}
                <br />
                {GAQ_LINE2.map((word, i) => (
                  <span
                    key={i}
                    className="inline-block"
                    style={
                      isVisible
                        ? { willChange: "opacity, transform", animation: `gaqWordPop 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${(GAQ_LINE1.length + i) * 55}ms forwards`, opacity: 0 }
                        : { opacity: 0 }
                    }
                  >
                    {word}{i < GAQ_LINE2.length - 1 ? "\u00A0" : ""}
                  </span>
                ))}
              </h2>

              <p className="mt-5 max-w-[760px] mb-8 text-[1.06rem] leading-[1.6] text-white/80 md:mt-6 md:text-[1.15rem]" style={gaqAnim(GAQ_ALL_WORDS.length * 55 + 60)}>
                {content.description}
              </p>

              <Button
                asChild
                glareDisabled
                className="h-auto overflow-hidden rounded-full bg-white py-1.5 pl-6 pr-1.5 text-[1.08rem] font-semibold tracking-[0.02em] text-[#06457F] hover:bg-white hover:text-[#06457F]"
                style={gaqAnim(GAQ_ALL_WORDS.length * 55 + 180)}
              >
                <Link href="/contact">
                  <span
                    className="whitespace-nowrap"
                    style={
                      isVisible
                        ? { opacity: 0, willChange: "opacity, transform", animation: `gaqBtnTextReveal 0.7s cubic-bezier(0.25, 1, 0.5, 1) ${GAQ_ALL_WORDS.length * 55 + 380}ms forwards` }
                        : { opacity: 0 }
                    }
                  >{content.buttonText}</span>
                  <span
                    className="ml-4 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#06457F] text-white shadow-[0_0_0_rgba(6, 69, 127, 0.45)] transition-all duration-300 group-hover:bg-[#0474C4] group-hover:shadow-[0_10px_22px_rgba(6, 69, 127, 0.45)]"
                    style={
                      isVisible
                        ? { willChange: "transform", animation: `gaqBtnCircleSlide 0.8s cubic-bezier(0.25, 1, 0.5, 1) ${GAQ_ALL_WORDS.length * 55 + 230}ms forwards`, transform: "translate3d(-192px, 0, 0)" }
                        : { transform: "translate3d(-192px, 0, 0)" }
                    }
                  >
                    <HiArrowUpRight
                      className="h-6 w-6 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:rotate-12"
                      aria-hidden
                    />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
