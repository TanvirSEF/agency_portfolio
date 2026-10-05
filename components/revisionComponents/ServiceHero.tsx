"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Maximize2, X } from "lucide-react";
import { IoArrowForward, IoFlash, IoPause, IoPlay } from "react-icons/io5";
import LightRays from "@/components/ui/LightRays";
import ModalPortal from "@/components/ui/ModalPortal";
import type { WebDevContent } from "@/revision-json-content/web-development/useWebDevContent";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
});

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

class SplineErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("Spline WebGL error caught by boundary:", error);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function LazySpline({
  className,
  sceneUrl,
  filter,
}: {
  className?: string;
  sceneUrl: string;
  filter?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const splineRef = useRef<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const app = splineRef.current;
    if (!app) return;
    if (isVisible) {
      app.play?.();
    } else {
      app.stop?.();
    }
  }, [isVisible]);

  const onLoad = useCallback((splineApp: any) => {
    splineRef.current = splineApp;
    setHasLoaded(true);
  }, []);

  const shouldMount = isVisible || hasLoaded;

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none ${className ?? ""}`}
      style={{
        willChange: "transform",
        ...(filter ? { filter } : {}),
      }}
    >
      {shouldMount && (
        <SplineErrorBoundary>
          <Spline scene={sceneUrl} onLoad={onLoad} />
        </SplineErrorBoundary>
      )}
    </div>
  );
}

interface HeroVideoPlayerProps {
  containerClassName: string;
  videoSrc: string;
}

function HeroVideoPlayer({ containerClassName, videoSrc }: HeroVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStartTime, setModalStartTime] = useState(0);

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

  return (
    <>
      <div
        className={`group relative overflow-hidden rounded-[14px] border border-white/10 bg-black/40 shadow-[0_24px_55px_rgba(0,0,0,0.65)] backdrop-blur-[1.5px] ${containerClassName}`.trim()}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          preload="metadata"
          playsInline
          className="aspect-[16/10] h-full w-full object-cover"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/52 via-black/24 to-black/12" />

        {!isPlaying && (
          <button
            type="button"
            aria-label="Play video"
            onClick={handlePlayToggle}
            className="absolute left-1/2 top-1/2 z-20 inline-flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#06457F]/70 bg-[#06457F]/45 text-white shadow-[0_16px_45px_rgba(6, 69, 127,   0.48)] backdrop-blur-[1px] transition hover:scale-[1.02] hover:bg-[#06457F]/62 md:h-[84px] md:w-[84px]"
          >
            <IoPlay className="h-9 w-9 translate-x-0.5 md:h-10 md:w-10" />
          </button>
        )}

        {isPlaying && (
          <button
            type="button"
            aria-label="Pause video"
            onClick={handlePlayToggle}
            className="pointer-events-none absolute left-1/2 top-1/2 z-20 inline-flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#06457F]/70 bg-[#06457F]/45 text-white opacity-0 shadow-[0_16px_45px_rgba(6, 69, 127,   0.48)] backdrop-blur-[1px] transition group-hover:pointer-events-auto group-hover:opacity-100 hover:bg-[#06457F]/62 md:h-[84px] md:w-[84px]"
          >
            <IoPause className="h-8 w-8 md:h-9 md:w-9" />
          </button>
        )}

        <button
          type="button"
          aria-label="Open video in modal"
          onClick={openVideoModal}
          className="pointer-events-none absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#06457F]/70 bg-[#06457F]/45 text-white opacity-0 shadow-[0_12px_30px_rgba(6, 69, 127,   0.38)] backdrop-blur-[1px] transition group-hover:pointer-events-auto group-hover:opacity-100 hover:bg-[#06457F]/62 md:right-4 md:top-4 md:h-11 md:w-11"
        >
          <Maximize2 className="h-5 w-5" />
        </button>
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
                src={videoSrc}
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
    </>
  );
}

const heroRevealKeyframes = `
@keyframes heroFadeUp {
  0% {
    opacity: 0;
    transform: translate3d(0, 18px, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
@keyframes btnCircleSlide {
  0% {
    transform: translate3d(-192px, 0, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}
@keyframes btnTextReveal {
  0% {
    opacity: 0;
    transform: translate3d(-14px, 0, 0);
  }
  50% {
    opacity: 0;
    transform: translate3d(-8px, 0, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
`;

const heroAnimStyle = (delay: number): React.CSSProperties => ({
  opacity: 0,
  willChange: "opacity, transform",
  animation: `heroFadeUp 0.7s cubic-bezier(0.25, 1, 0.5, 1) ${delay}ms forwards`,
});

export interface ServiceHeroContent {
  badge: string;
  headingMobile: string[];
  headingDesktop: string;
  description: string;
  buttonText: string;
  videoSrc: string;
  splineUrl: string;
  splineFilter?: string;
}

export interface ServiceHeroProps {
  content: ServiceHeroContent | WebDevContent["serviceHero"];
  splineFilter?: string;
}

export default function ServiceHero({
  content,
  splineFilter = "hue-rotate(-65deg) saturate(1.2)",
}: ServiceHeroProps) {
  const isDesktop = useIsDesktop();
  const [webglKey, setWebglKey] = useState(0);
  const activeSplineFilter = (content as any)?.splineFilter ?? splineFilter;

  useEffect(() => {
    const bump = () => setWebglKey((k) => k + 1);
    window.addEventListener("webgl-context-lost", bump);
    return () => window.removeEventListener("webgl-context-lost", bump);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-[#050508] pb-6 pt-8 md:pb-8 md:pt-14 xl:pb-10 xl:pt-16">
      <style dangerouslySetInnerHTML={{ __html: heroRevealKeyframes }} />
      <div className="absolute inset-0 z-0">
        <LightRays
          key={`lightrays-${webglKey}`}
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={1}
          lightSpread={0.6}
          rayLength={3}
          followMouse
          mouseInfluence={0.2}
          noiseAmount={0.1}
          distortion={0}
          pulsating={false}
          fadeDistance={2}
          saturation={1}
          className="opacity-90"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(72%_56%_at_50%_0%,rgba(4,116,196,0.35)_0%,rgba(4,116,196,0.06)_44%,rgba(0,0,0,0)_70%)]" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(180deg,rgba(4,4,8,0.05)_0%,rgba(4,4,8,0.2)_36%,rgba(4,4,8,0.8)_100%)]" />

      <div className="container relative z-10 mx-auto px-4 md:px-8 xl:px-12">
        <div className="relative md:hidden">
          <div className="relative z-30 mx-auto max-w-[390px] text-center text-white">
            <h1
              className="text-[clamp(52px,12vw,66px)] font-semibold leading-[1.15] tracking-[-0.02em] text-white"
              style={heroAnimStyle(100)}
            >
              {content.headingMobile.map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h1>

            <p
              className="mx-auto mt-5 max-w-[345px] text-[clamp(13px,4.1vw,16px)] leading-[1.52] text-white/87"
              style={heroAnimStyle(300)}
            >
              {content.description}
            </p>

            <button
              type="button"
              className="mx-auto mt-8 inline-flex h-[60px] min-w-[247px] w-auto items-center justify-between gap-3 overflow-hidden rounded-full bg-[linear-gradient(90deg,#06457F_0%,#0474C4_100%)] pl-[34px] pr-[5px] text-[15px] font-semibold uppercase tracking-[0.01em] text-white shadow-[0_18px_45px_rgba(6, 69, 127, 0.5)] transition hover:brightness-105"
              style={heroAnimStyle(500)}
            >
              <span
                className="whitespace-nowrap"
                style={{ opacity: 0, willChange: "opacity, transform", animation: "btnTextReveal 0.7s cubic-bezier(0.25, 1, 0.5, 1) 700ms forwards" }}
              >{content.buttonText}</span>
              <span
                className="inline-flex h-[50px] w-[50px] flex-shrink-0 items-center justify-center rounded-full bg-white text-[#06457F]"
                style={{ willChange: "transform", animation: "btnCircleSlide 0.8s cubic-bezier(0.25, 1, 0.5, 1) 550ms forwards", transform: "translate3d(-192px, 0, 0)" }}
              >
                <IoArrowForward className="h-6 w-6 -rotate-45" aria-hidden />
              </span>
            </button>
          </div>

          <div className="relative mx-auto mt-8 w-full max-w-[390px]" style={heroAnimStyle(350)}>
            {!isDesktop && (
              <LazySpline
                key={`spline-mobile-${webglKey}`}
                sceneUrl={content.splineUrl}
                filter={activeSplineFilter}
                className="pointer-events-none absolute -right-[48%] top-[-250px] z-10 h-[520px] w-[520px]"
              />
            )}

            <HeroVideoPlayer containerClassName="relative z-20 mx-auto mt-[136px] w-[calc(100%-0.35rem)]" videoSrc={content.videoSrc} />
          </div>
        </div>

        <div className="hidden items-start gap-10 md:grid xl:grid-cols-[1fr_1.12fr] xl:gap-0">
          <div className="max-w-[680px] text-left text-white">
            <span
              className="inline-flex items-center gap-2 text-[clamp(13px,1.2vw,29px)] font-medium tracking-[0.01em] text-white/95"
              style={heroAnimStyle(0)}
            >
              <IoFlash className="h-4 w-4 text-white md:h-5 md:w-5" aria-hidden />
              {content.badge}
            </span>

            <h1
              className="mt-7 text-[clamp(32px,4.2vw,60px)] font-semibold leading-[1.12] tracking-[-0.02em] text-white"
              style={heroAnimStyle(150)}
            >
              {content.headingDesktop}
            </h1>

            <p
              className="mt-8 max-w-[820px] text-[clamp(15px,1.3vw,37px)] leading-[1.55] text-white/85"
              style={heroAnimStyle(350)}
            >
              {content.description}
            </p>

            <button
              type="button"
              className="mt-6 xl:mt-10 inline-flex h-[60px] min-w-[247px] w-auto items-center justify-between gap-3 overflow-hidden rounded-full bg-[linear-gradient(90deg,#06457F_0%,#0474C4_100%)] pl-[34px] pr-[5px] text-[15px] font-semibold uppercase tracking-[0.01em] text-white shadow-[0_18px_45px_rgba(6, 69, 127, 0.5)] transition hover:brightness-105"
              style={heroAnimStyle(550)}
            >
              <span
                className="whitespace-nowrap"
                style={{ opacity: 0, willChange: "opacity, transform", animation: "btnTextReveal 0.7s cubic-bezier(0.25, 1, 0.5, 1) 750ms forwards" }}
              >{content.buttonText}</span>
              <span
                className="inline-flex h-[50px] w-[50px] flex-shrink-0 items-center justify-center rounded-full bg-white text-[#06457F]"
                style={{ willChange: "transform", animation: "btnCircleSlide 0.8s cubic-bezier(0.25, 1, 0.5, 1) 600ms forwards", transform: "translate3d(-192px, 0, 0)" }}
              >
                <IoArrowForward className="h-6 w-6 -rotate-45" aria-hidden />
              </span>
            </button>
          </div>

          <div className="relative mx-auto w-full max-w-[1060px]" style={heroAnimStyle(400)}>
            <div className="relative ml-auto aspect-[1/0.75] w-full max-w-[820px] overflow-visible">
              {isDesktop && (
                <LazySpline
                  key={`spline-desktop-${webglKey}`}
                  sceneUrl={content.splineUrl}
                  filter={activeSplineFilter}
                  className="absolute -inset-[35%] -top-[55%]"
                />
              )}

              <HeroVideoPlayer containerClassName="absolute left-[75%] top-[68%] z-30 w-[43%] min-w-[270px] max-w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-[16px]" videoSrc={content.videoSrc} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
