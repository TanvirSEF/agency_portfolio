"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { IoFlash, IoPause, IoPlay } from "react-icons/io5";
import ModalPortal from "@/components/ui/ModalPortal";
import type { WebDevContent } from "@/revision-json-content/web-development/useWebDevContent";

const mfKeyframes = `
@keyframes mfSlideLeft {
  0% { opacity: 0; transform: translate3d(-30px, 0, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes mfFadeUp {
  0% { opacity: 0; transform: translate3d(0, 20px, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes mfWordPop {
  0% { opacity: 0; transform: translate3d(0, 12px, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
`;

export default function MediaFeaturesSection({ content }: { content: WebDevContent["mediaFeaturesSection"] }) {
  const FEATURE_CARDS = content.featureCards;
  const MF_HEADING_WORDS = content.heading.split(" ");
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const featureGridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStartTime, setModalStartTime] = useState(0);
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

  const mfAnim = (name: string, delay: number): React.CSSProperties =>
    isSectionVisible
      ? { willChange: "opacity, transform", animation: `${name} 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms forwards`, opacity: 0 }
      : { opacity: 0 };

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
    if (modalVideo) {
      modalVideo.pause();
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!isModalOpen) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeVideoModal();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (hasCardsEnteredView) return;

    const target = featureGridRef.current;
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
    <section ref={sectionRef} className="bg-[#F6F6F6] py-14 md:py-20 xl:py-24">
      <style dangerouslySetInnerHTML={{ __html: mfKeyframes }} />
      <div className="container mx-auto px-4 md:px-8 xl:px-12">
        <div className="grid items-stretch gap-8 xl:grid-cols-[0.95fr_1.1fr] xl:gap-10">
          <article className="group relative min-h-[430px] overflow-hidden rounded-[26px] md:min-h-[620px]" style={mfAnim("mfSlideLeft", 0)}>
            <video
              ref={videoRef}
              src={content.videoSrc}
              preload="metadata"
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/15" />

            {!isPlaying && (
              <button
                type="button"
                aria-label="Play video"
                onClick={handlePlayToggle}
                className="absolute left-1/2 top-1/2 z-20 inline-flex h-[108px] w-[108px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#06457F]/70 bg-[#06457F]/45 text-white shadow-[0_16px_45px_rgba(6, 69, 127,   0.48)] backdrop-blur-[1px] transition hover:scale-[1.02] hover:bg-[#06457F]/62"
              >
                <IoPlay className="h-11 w-11 translate-x-0.5" />
              </button>
            )}

            {isPlaying && (
              <button
                type="button"
                aria-label="Pause video"
                onClick={handlePlayToggle}
                className="pointer-events-none absolute left-1/2 top-1/2 z-20 inline-flex h-[108px] w-[108px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#06457F]/70 bg-[#06457F]/45 text-white opacity-0 shadow-[0_16px_45px_rgba(6, 69, 127,   0.48)] backdrop-blur-[1px] transition group-hover:pointer-events-auto group-hover:opacity-100 hover:bg-[#06457F]/62"
              >
                <IoPause className="h-10 w-10" />
              </button>
            )}

            <button
              type="button"
              aria-label="Open video in modal"
              onClick={openVideoModal}
              className="pointer-events-none absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#06457F]/70 bg-[#06457F]/45 text-white opacity-0 shadow-[0_12px_30px_rgba(6, 69, 127,   0.38)] backdrop-blur-[1px] transition group-hover:pointer-events-auto group-hover:opacity-100 hover:bg-[#06457F]/62"
            >
              <Maximize2 className="h-5 w-5" />
            </button>

            <div className="absolute inset-x-0 bottom-0 z-10 p-6 text-white md:p-8">
              <h3 className="text-[2rem] font-medium leading-[1.18] md:text-[2.45rem]">
                {content.videoOverlayTitle}
              </h3>
              <p className="mt-2 max-w-[420px] text-[1.2rem] leading-[1.4] text-white/95 md:text-[1.28rem]">
                {content.videoOverlayDescription}
              </p>
            </div>
          </article>

          <div className="xl:pt-1">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#E0F2FE] px-4 py-2 text-sm font-medium text-[#06457F] md:px-5 md:text-[1.05rem]" style={mfAnim("mfFadeUp", 100)}>
              <IoFlash className="h-4 w-4" aria-hidden />
              {content.badge}
            </span>

            <h2 className="mt-6 max-w-[640px] text-[2.2rem] font-semibold leading-[1.22] text-[#22242a] md:text-[2.95rem]">
              {MF_HEADING_WORDS.map((word, i) => (
                <span
                  key={i}
                  className="inline-block"
                  style={
                    isSectionVisible
                      ? { willChange: "opacity, transform", animation: `mfWordPop 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${200 + i * 55}ms forwards`, opacity: 0 }
                      : { opacity: 0 }
                  }
                >
                  {word}{i < MF_HEADING_WORDS.length - 1 ? "\u00A0" : ""}
                </span>
              ))}
            </h2>

            <p className="mt-6 max-w-[690px] text-[1.06rem] leading-[1.55] text-[#66708b] md:text-[1.18rem]" style={mfAnim("mfFadeUp", 580)}>
              {content.description}
            </p>

            <div
              ref={featureGridRef}
              className="mt-7 grid gap-3 min-[520px]:grid-cols-2 xl:mt-9 xl:grid-cols-6 xl:gap-4"
            >
              {FEATURE_CARDS.map((feature, index) => (
                <article
                  key={feature.title}
                  className={`${
                    hasCardsEnteredView ? "feature-card-enter" : "feature-card-base"
                  } rounded-[18px] bg-[#e8e8eb] p-4 md:rounded-[22px] md:p-7 ${
                    index === FEATURE_CARDS.length - 1 ? "min-[520px]:col-span-2" : ""
                  } ${
                    (feature as any).wide ? "xl:col-span-3" : "xl:col-span-2"
                  }`}
                  style={{ animationDelay: `${0.08 + index * 0.09}s` }}
                >
                  <Image
                    src={feature.icon}
                    alt={`${feature.title} icon`}
                    width={44}
                    height={44}
                    className="h-9 w-9 md:h-11 md:w-11"
                  />

                  <h3 className="mt-3 text-[1.15rem] font-medium leading-[1.3] text-[#212329] md:mt-4 md:text-[1.62rem] md:leading-[1.35]">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-[0.97rem] leading-[1.42] text-[#7a7a82] md:mt-3 md:text-[1.18rem] md:leading-[1.5]">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

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
                src={content.videoSrc}
                controls
                autoPlay
                playsInline
                className="h-full w-full bg-black object-contain md:max-h-[85vh] md:h-auto"
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

      <style jsx>{`
        .feature-card-base {
          opacity: 0;
          transform: translateY(24px) scale(0.82);
          transform-origin: center;
        }

        .feature-card-enter {
          opacity: 0;
          transform: translateY(24px) scale(0.82);
          transform-origin: center;
          animation: featureCardEnter 0.62s cubic-bezier(0.2, 0.78, 0.24, 1) forwards;
          will-change: transform, opacity;
        }

        @keyframes featureCardEnter {
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
          .feature-card-base,
          .feature-card-enter {
            opacity: 1;
            transform: none;
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
