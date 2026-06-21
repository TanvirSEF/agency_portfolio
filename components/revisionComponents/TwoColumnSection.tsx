"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { IoFlash } from "react-icons/io5";
import { MdArrowOutward } from "react-icons/md";
import type { WebDevContent } from "@/revision-json-content/web-development/useWebDevContent";

const twoColKeyframes = `
@keyframes tcsSlideLeft {
  0% { opacity: 0; transform: translate3d(-30px, 0, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes tcsSlideRight {
  0% { opacity: 0; transform: translate3d(30px, 0, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes tcsFadeUp {
  0% { opacity: 0; transform: translate3d(0, 14px, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
`;

export default function TwoColumnSection({ content }: { content: WebDevContent["twoColumnSection"] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.05, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isModalOpen]);

  const anim = (name: string, delay: number): React.CSSProperties =>
    isVisible
      ? { willChange: "opacity, transform", animation: `${name} 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms forwards`, opacity: 0 }
      : { opacity: 0 };

  return (
    <section className="bg-[#F6F6F6] py-14 md:py-20">
      <style dangerouslySetInnerHTML={{ __html: twoColKeyframes }} />
      <div ref={sectionRef} className="container mx-auto px-4 md:px-12">
        <div className="grid items-start gap-8 md:gap-10 xl:grid-cols-2 xl:gap-14">
          <div style={anim("tcsSlideLeft", 0)}>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e5dcff] px-4 py-2 text-xs font-medium text-[#7c4dff] md:px-5 md:text-sm">
              <IoFlash className="h-4 w-4" aria-hidden />
              {content.badge}
            </span>

            <p className="mt-5 text-[30px] font-semibold leading-[1.2] text-[#22222b]/95 md:hidden">
              {content.previewTextMobile}{" "}
              <span className="text-[#9a9aa1]">{content.previewTail}</span>
            </p>

            <p className="mt-5 hidden text-[34px] font-semibold leading-[1.22] text-[#22222b]/95 md:block lg:hidden">
              {content.previewTextTablet}{" "}
              <span className="text-[#9a9aa1]">{content.previewTail}</span>
            </p>

            <p className="mt-5 hidden text-[42px] font-semibold leading-[1.35] text-[#22222b]/95 lg:block sm:leading-[1.2]">
              {content.previewText}{" "}
              <span className="text-[#9a9aa1]">{content.previewTail}</span>
            </p>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-6 inline-flex items-center gap-2 text-base font-medium text-[#7b4bff] border-b-[2px] border-[#7b4bff] transition hover:text-[#6735ff] md:mt-8 md:text-lg"
              style={anim("tcsFadeUp", 400)}
            >
              {content.viewMoreText}
              <MdArrowOutward />
            </button>
          </div>

          <div className="relative overflow-hidden flex justify-end rounded-[22px]" style={anim("tcsSlideRight", 150)}>
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={content.imageSrc}
                alt={content.imageAlt}
                fill
                className="object-cover rounded-[22px]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[9999] overflow-y-auto overscroll-contain p-4 transition-opacity duration-200 md:p-6 ${
          isModalOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isModalOpen}
      >
        <div
          className="fixed inset-0 bg-[#0f1021]/80"
          onClick={() => setIsModalOpen(false)}
        />

        <div className="relative z-10 mx-auto my-6 w-full max-w-5xl overflow-hidden rounded-3xl border border-white/20 bg-[#f8f8ff] shadow-2xl md:my-8">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            aria-label="Close modal"
            tabIndex={isModalOpen ? 0 : -1}
            className="absolute right-3 top-3 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#2a2a35] shadow-md transition hover:bg-white md:right-4 md:top-4"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid gap-8 p-6 md:grid-cols-[1.1fr_1fr] md:p-10">
            <div className="relative min-h-[250px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#e8e2ff] via-[#f7f5ff] to-[#ebf6ff] p-4 md:min-h-[420px]">
              <div className="relative h-full overflow-hidden rounded-2xl border border-white/50 shadow-lg">
                <Image
                  src={content.imageSrc}
                  alt={content.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#ece5ff] px-4 py-2 text-sm font-semibold text-[#7546ff]">
                <IoFlash className="h-4 w-4" aria-hidden />
                {content.badge}
              </span>

              <h3 className="mt-4 text-2xl font-semibold leading-tight text-[#1f1f29] md:text-3xl">
                {content.modalTitle}
              </h3>

              <div className="mt-4 space-y-4 text-base leading-7 text-[#3a3a4a] md:text-lg">
                {content.fullContent.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
