"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Maximize2, X } from "lucide-react";
import { IoPause, IoPlay } from "react-icons/io5";
import ModalPortal from "@/components/ui/ModalPortal";
import type { WebDevContent } from "@/revision-json-content/web-development/useWebDevContent";

const skfKeyframes = `
@keyframes skfFadeUp {
  0% { opacity: 0; transform: translate3d(0, 20px, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes skfWordPop {
  0% { opacity: 0; transform: translate3d(0, 12px, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes skfTabSlide {
  0% { opacity: 0; transform: translate3d(-18px, 0, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
`;


export default function ServiceKeyFacts({ content }: { content: WebDevContent["serviceKeyFacts"] }) {
  const KEY_FACTS = content.keyFacts;
  const SKF_LINE1 = content.headingLine1.split(" ");
  const SKF_LINE2 = content.headingLine2.split(" ");
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStartTime, setModalStartTime] = useState(0);

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

  const skfAnim = (name: string, delay: number): React.CSSProperties =>
    isVisible
      ? { willChange: "opacity, transform", animation: `${name} 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms forwards`, opacity: 0 }
      : { opacity: 0 };

  const queryKey = "keyfact";

  const syncUrl = useCallback((index: number, historyMode: "push" | "replace" = "push") => {
    if (typeof window === "undefined") return;
    const nextParams = new URLSearchParams(window.location.search);
    if (index <= 0) {
      nextParams.delete(queryKey);
    } else {
      nextParams.set(queryKey, String(KEY_FACTS[index]?.id ?? index + 1));
    }
    const nextSearch = nextParams.toString();
    const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}${window.location.hash}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (nextUrl === currentUrl) return;
    window.history[historyMode === "replace" ? "replaceState" : "pushState"](window.history.state, "", nextUrl);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const applyStateFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const rawValue = params.get(queryKey);

      if (!rawValue) {
        setActiveIndex((prev) => (prev === 0 ? prev : 0));
        return;
      }

      let nextIndex = KEY_FACTS.findIndex((f) => String(f.id) === rawValue);
      if (nextIndex < 0) {
        const asNumber = Number(rawValue);
        if (Number.isInteger(asNumber)) {
          const normalizedIndex = asNumber - 1;
          if (normalizedIndex >= 0 && normalizedIndex < KEY_FACTS.length) {
            nextIndex = normalizedIndex;
          }
        }
      }

      if (nextIndex < 0) {
        setActiveIndex((prev) => (prev === 0 ? prev : 0));
        syncUrl(0, "replace");
        return;
      }

      setActiveIndex((prev) => (prev === nextIndex ? prev : nextIndex));
    };

    applyStateFromUrl();
    window.addEventListener("popstate", applyStateFromUrl);
    return () => window.removeEventListener("popstate", applyStateFromUrl);
  }, [syncUrl]);

  const handleSelect = (index: number) => {
    setActiveIndex(index);
    syncUrl(index, "push");
  };

  const VIDEO_SRC = content.videoSrc;

  const handlePlayToggle = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }
    video.pause();
    setIsPlaying(false);
  };

  const openVideoModal = () => {
    const video = videoRef.current;
    if (video) {
      setModalStartTime(video.currentTime || 0);
      video.pause();
      setIsPlaying(false);
    }
    setIsModalOpen(true);
  };

  const closeVideoModal = () => {
    const modalVideo = modalVideoRef.current;
    if (modalVideo) modalVideo.pause();
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!isModalOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeVideoModal();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isModalOpen]);

  const activeFact = KEY_FACTS[activeIndex];

  return (
    <section ref={sectionRef} className="bg-[#F6F6F6] py-14 md:py-20 xl:py-24">
      <style dangerouslySetInnerHTML={{ __html: skfKeyframes }} />
      <div className="container mx-auto px-4 md:px-8 xl:px-12">
        <div className="mx-auto max-w-[1260px]">
          {/* Header */}
          <div className="mx-auto max-w-[860px] text-center">
            <h2
              className="font-bold text-[#1E1F21]"
              style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)", lineHeight: "1.2" }}
            >
              {SKF_LINE1.map((word, i) => (
                <span
                  key={i}
                  className="inline-block"
                  style={
                    isVisible
                      ? { willChange: "opacity, transform", animation: `skfWordPop 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${i * 55}ms forwards`, opacity: 0 }
                      : { opacity: 0 }
                  }
                >
                  {word}{i < SKF_LINE1.length - 1 ? "\u00A0" : ""}
                </span>
              ))}
              <br />
              {SKF_LINE2.map((word, i) => (
                <span
                  key={i}
                  className="inline-block"
                  style={
                    isVisible
                      ? { willChange: "opacity, transform", animation: `skfWordPop 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${(SKF_LINE1.length + i) * 55}ms forwards`, opacity: 0 }
                      : { opacity: 0 }
                  }
                >
                  {word}{i < SKF_LINE2.length - 1 ? "\u00A0" : ""}
                </span>
              ))}
            </h2>
            <p
              className="mx-auto mt-4 max-w-2xl text-gray-500"
              style={{ fontSize: "clamp(0.875rem, 2vw, 1.125rem)", ...skfAnim("skfFadeUp", (SKF_LINE1.length + SKF_LINE2.length) * 55 + 60) }}
            >
              {content.subtitle}
            </p>
          </div>

          {/* Tabs + Content */}
          <div className="mt-10 flex flex-col gap-8 lg:mt-12 lg:flex-row lg:gap-12" style={skfAnim("skfFadeUp", (SKF_LINE1.length + SKF_LINE2.length) * 55 + 180)}>
            {/* Left – Tab list */}
            <div className="shrink-0 lg:w-[40%]">
              <div className="flex flex-col lg:pr-8">
                {KEY_FACTS.map((fact, index) => (
                  <button
                    key={fact.id}
                    type="button"
                    onClick={() => handleSelect(index)}
                    className={`group relative flex items-center justify-between gap-4 p-2 py-4 text-left transition-all duration-300 ${
                      index < KEY_FACTS.length - 1 ? "border-b border-gray-200" : ""
                    } ${activeIndex === index ? "text-[#8C52FF]" : "text-[#1E1F21] hover:text-[#8C52FF]"}`}
                    style={skfAnim("skfTabSlide", (SKF_LINE1.length + SKF_LINE2.length) * 55 + 250 + index * 70)}
                  >
                    <span
                      className={`font-medium transition-all duration-300 ${
                        activeIndex === index ? "text-[#8C52FF]" : "text-[#1E1F21]"
                      }`}
                      style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)" }}
                    >
                      {fact.title}
                    </span>
                    <ArrowRight
                      className={`h-5 w-5 shrink-0 transition-all duration-300 ${
                        activeIndex === index
                          ? "translate-x-0 text-[#8C52FF] opacity-100"
                          : "translate-x-[-8px] opacity-0 group-hover:translate-x-0 group-hover:opacity-50"
                      }`}
                    />
                    {activeIndex === index && (
                      <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#8C52FF] lg:bottom-auto lg:left-auto lg:-right-8 lg:top-0 lg:h-1 lg:w-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Right – Content */}
            <div className="flex-1 lg:w-[60%]">
              <div className="relative min-h-[200px]">
                {KEY_FACTS.map((fact, index) => (
                  <div
                    key={fact.id}
                    className={`transition-all duration-500 ease-in-out ${
                      activeIndex === index
                        ? "translate-y-0 opacity-100"
                        : "pointer-events-none absolute inset-0 translate-y-4 opacity-0"
                    }`}
                  >
                    <p
                      className="leading-relaxed text-[#667085]"
                      style={{ fontSize: "clamp(0.875rem, 2vw, 1.125rem)" }}
                      dangerouslySetInnerHTML={{ __html: fact.description }}
                    />

                    {fact.hasVideo && (
                      <div className="group relative mt-6 overflow-hidden rounded-[16px] shadow-[0_12px_30px_rgba(0,0,0,0.12)] md:rounded-[22px]">
                        <video
                          ref={videoRef}
                          src={VIDEO_SRC}
                          preload="metadata"
                          playsInline
                          className="relative aspect-video w-full object-cover"
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                          onEnded={() => setIsPlaying(false)}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/12 to-black/5" />

                        {!isPlaying && (
                          <button
                            type="button"
                            aria-label="Play video"
                            onClick={handlePlayToggle}
                            className="absolute left-1/2 top-1/2 z-20 inline-flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#8c52ff]/70 bg-[#7c4dff]/45 text-white shadow-[0_16px_45px_rgba(124,77,255,0.48)] backdrop-blur-[1px] transition hover:scale-[1.02] hover:bg-[#7c4dff]/62"
                          >
                            <IoPlay className="h-9 w-9 translate-x-0.5" />
                          </button>
                        )}

                        {isPlaying && (
                          <button
                            type="button"
                            aria-label="Pause video"
                            onClick={handlePlayToggle}
                            className="pointer-events-none absolute left-1/2 top-1/2 z-20 inline-flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#8c52ff]/70 bg-[#7c4dff]/45 text-white opacity-0 shadow-[0_16px_45px_rgba(124,77,255,0.48)] backdrop-blur-[1px] transition group-hover:pointer-events-auto group-hover:opacity-100 hover:bg-[#7c4dff]/62"
                          >
                            <IoPause className="h-8 w-8" />
                          </button>
                        )}

                        <button
                          type="button"
                          aria-label="Open video in modal"
                          onClick={openVideoModal}
                          className="pointer-events-none absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#8c52ff]/70 bg-[#7c4dff]/45 text-white opacity-0 shadow-[0_12px_30px_rgba(124,77,255,0.38)] backdrop-blur-[1px] transition group-hover:pointer-events-auto group-hover:opacity-100 hover:bg-[#7c4dff]/62"
                        >
                          <Maximize2 className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isModalOpen && (
        <ModalPortal>
          <div className="fixed inset-0 z-[9999] bg-black/90">
            <button
              type="button"
              onClick={closeVideoModal}
              aria-label="Close video modal backdrop"
              className="absolute inset-0"
            />

            <div className="relative z-10 flex h-full w-full items-center justify-center p-0 md:p-8">
              <div className="relative h-full w-full overflow-hidden bg-black md:h-auto md:max-w-6xl md:rounded-2xl">
                <button
                  type="button"
                  onClick={closeVideoModal}
                  aria-label="Close video modal"
                  className="absolute right-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-black/35 text-white backdrop-blur transition hover:bg-black/55 md:right-4"
                  style={{ top: "calc(env(safe-area-inset-top, 0px) + 0.75rem)" }}
                >
                  <X className="h-5 w-5" />
                </button>

                <video
                  ref={modalVideoRef}
                  src={VIDEO_SRC}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full bg-black object-contain md:h-auto md:max-h-[85vh]"
                  onLoadedMetadata={() => {
                    const modalVideo = modalVideoRef.current;
                    if (!modalVideo) return;
                    const nextTime = Number.isFinite(modalStartTime) ? modalStartTime : 0;
                    modalVideo.currentTime = Math.max(0, Math.min(nextTime, modalVideo.duration || nextTime));
                    void modalVideo.play().catch(() => undefined);
                  }}
                />
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </section>
  );
}
