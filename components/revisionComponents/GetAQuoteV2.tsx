"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiArrowUpRight } from "react-icons/hi2";
import { Button } from "@/components/ui/button";

const gaqV2Keyframes = `
@keyframes gaqV2FadeUp {
  0% { opacity: 0; transform: translate3d(0, 20px, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes gaqV2WordPop {
  0% { opacity: 0; transform: translate3d(0, 12px, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes gaqV2BtnCircleSlide {
  0% { transform: translate3d(-192px, 0, 0); }
  100% { transform: translate3d(0, 0, 0); }
}
@keyframes gaqV2BtnTextReveal {
  0% { opacity: 0; transform: translate3d(-14px, 0, 0); }
  50% { opacity: 0; transform: translate3d(-8px, 0, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
`;

const headingLines = [
  ["Build", "High-Performance"],
  ["Websites", "With", "Webbly"],
  ["Media"],
];

const headingOffsets = headingLines.reduce<number[]>((offsets, line, index) => {
  if (index === 0) {
    offsets.push(0);
    return offsets;
  }

  offsets.push(offsets[index - 1] + headingLines[index - 1].length);
  return offsets;
}, []);

const totalHeadingWords = headingLines.flat().length;

export default function GetAQuoteV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const fadeUpStyle = (delay: number): React.CSSProperties =>
    isVisible
      ? {
          willChange: "opacity, transform",
          animation: `gaqV2FadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms forwards`,
          opacity: 0,
        }
      : { opacity: 0 };

  return (
    <section ref={sectionRef} className="bg-[#F6F6F6] py-12 md:py-16 xl:py-20">
      <style dangerouslySetInnerHTML={{ __html: gaqV2Keyframes }} />
      <div className="container mx-auto px-4 md:px-8 xl:px-12">
        <div className="mx-auto max-w-[1320px]">
          <div className="relative isolate overflow-hidden rounded-[22px] bg-white shadow-[0_18px_48px_rgba(15,24,53,0.08)] ring-1 ring-black/5 md:rounded-[30px] lg:aspect-[1360/512]">
            <div className="grid lg:h-full lg:grid-cols-[0.92fr_1.08fr]">
              <div className="relative overflow-hidden bg-[#071744]">
                <div className="relative mx-auto flex min-h-[320px] max-w-[640px] flex-col items-center justify-center px-6 py-10 text-center sm:px-10 md:min-h-[390px] md:px-12 md:py-12 lg:h-full lg:min-h-0 lg:px-14 lg:py-10">
                  <h2 className="text-balance text-[1.95rem] font-semibold leading-[1.12] tracking-[-0.035em] text-white sm:text-[2.35rem] md:text-[2.9rem] lg:text-[3.35rem]">
                    {headingLines.map((line, lineIndex) => (
                      <span key={line.join("-")} className="block lg:whitespace-nowrap">
                        {line.map((word, wordIndex) => {
                          const delay = (headingOffsets[lineIndex] + wordIndex) * 55;

                          return (
                            <span
                              key={`${word}-${lineIndex}-${wordIndex}`}
                              className="inline-block"
                              style={
                                isVisible
                                  ? {
                                      willChange: "opacity, transform",
                                      animation: `gaqV2WordPop 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms forwards`,
                                      opacity: 0,
                                    }
                                  : { opacity: 0 }
                              }
                            >
                              {word}
                              {wordIndex < line.length - 1 ? "\u00A0" : ""}
                            </span>
                          );
                        })}
                      </span>
                    ))}
                  </h2>

                  <p
                    className="mb-7 mt-5 max-w-[500px] text-[1rem] leading-[1.6] text-white/80 md:mt-6 md:text-[1.15rem]"
                    style={fadeUpStyle(totalHeadingWords * 55 + 60)}
                  >
                    Whether you&apos;re a startup or an enterprise, we help you design,
                    develop, and scale powerful digital products that drive growth.
                  </p>

                  <Button
                    asChild
                    glareDisabled
                    className="h-auto overflow-hidden rounded-full bg-white py-1.5 pl-5 pr-1.5 text-[0.84rem] font-semibold uppercase tracking-[0.02em] text-[#7340f4] hover:bg-white hover:text-[#7340f4] sm:pl-6 sm:text-[0.9rem]"
                    style={fadeUpStyle(totalHeadingWords * 55 + 180)}
                  >
                    <Link href="/contact" aria-label="Get a quote from Webbly Media">
                      <span
                        className="whitespace-nowrap"
                        style={
                          isVisible
                            ? {
                                opacity: 0,
                                willChange: "opacity, transform",
                                animation: `gaqV2BtnTextReveal 0.7s cubic-bezier(0.25, 1, 0.5, 1) ${totalHeadingWords * 55 + 380}ms forwards`,
                              }
                            : { opacity: 0 }
                        }
                      >
                        GET A QUOTE
                      </span>
                      <span
                        className="ml-4 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#7c48f7] text-white shadow-[0_0_0_rgba(124,72,247,0)] transition-all duration-300 group-hover:bg-[#6f3df3] group-hover:shadow-[0_10px_22px_rgba(124,72,247,0.45)]"
                        style={
                          isVisible
                            ? {
                                willChange: "transform",
                                animation: `gaqV2BtnCircleSlide 0.8s cubic-bezier(0.25, 1, 0.5, 1) ${totalHeadingWords * 55 + 230}ms forwards`,
                                transform: "translate3d(-192px, 0, 0)",
                              }
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

              <div className="relative min-h-[280px] overflow-hidden sm:min-h-[340px] lg:h-full lg:min-h-0">
                <Image
                  src="/revision-images/seo/GetAQuoteV2/CTA.webp"
                  alt="Team collaboration meeting at Webbly Media"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 720px"
                />

                <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-white/14" />
                <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#071744]/40 to-transparent md:w-28" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,23,68,0)_58%,rgba(7,23,68,0.58)_100%)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
