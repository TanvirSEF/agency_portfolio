"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { FiAward } from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";
import { MdArrowOutward, MdOutlineSupportAgent } from "react-icons/md";
import { IoFlash, IoFlashOutline, IoPause, IoPlay } from "react-icons/io5";
import ModalPortal from "@/components/ui/ModalPortal";
import type { WebDevContent } from "@/revision-json-content/web-development/useWebDevContent";

const AWARD_ICONS = [FiAward, LuSparkles, MdOutlineSupportAgent, IoFlashOutline];
const GRAPH_BARS = [34, 52, 28, 64, 45, 70, 76, 56, 34, 68, 52, 34] as const;

const wcuKeyframes = `
@keyframes wcuFadeUp {
  0% { opacity: 0; transform: translate3d(0, 20px, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes wcuWordPop {
  0% { opacity: 0; transform: translate3d(0, 12px, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
`;

export default function WebAgencyWhyChooseUs({ content }: { content: WebDevContent["webAgencyWhyChooseUs"] }) {
  const WCU_HEADING_LINE1 = content.headingLine1.split(" ");
  const WCU_HEADING_LINE2 = content.headingLine2.split(" ");
  const WCU_ALL_WORDS = [...WCU_HEADING_LINE1, ...WCU_HEADING_LINE2];
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const heroModalVideoRef = useRef<HTMLVideoElement>(null);
  const whyGridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isHeroPlaying, setIsHeroPlaying] = useState(false);
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [heroModalStartTime, setHeroModalStartTime] = useState(0);
  const [hasWhyGridEnteredView, setHasWhyGridEnteredView] = useState(false);
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

  const wcuAnim = (name: string, delay: number): React.CSSProperties =>
    isSectionVisible
      ? { willChange: "opacity, transform", animation: `${name} 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms forwards`, opacity: 0 }
      : { opacity: 0 };

  const handleHeroPlayToggle = async () => {
    const video = heroVideoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setIsHeroPlaying(true);
      } catch {
        setIsHeroPlaying(false);
      }
      return;
    }

    video.pause();
    setIsHeroPlaying(false);
  };

  const openHeroVideoModal = () => {
    const video = heroVideoRef.current;
    if (video) {
      setHeroModalStartTime(video.currentTime || 0);
      video.pause();
      setIsHeroPlaying(false);
    }
    setIsHeroModalOpen(true);
  };

  const closeHeroVideoModal = () => {
    const modalVideo = heroModalVideoRef.current;
    if (modalVideo) {
      modalVideo.pause();
    }
    setIsHeroModalOpen(false);
  };

  useEffect(() => {
    if (!isHeroModalOpen) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeHeroVideoModal();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isHeroModalOpen]);

  useEffect(() => {
    if (hasWhyGridEnteredView) return;

    const target = whyGridRef.current;
    if (!target || typeof IntersectionObserver === "undefined") {
      setHasWhyGridEnteredView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setHasWhyGridEnteredView(true);
          observer.disconnect();
        });
      },
      { threshold: 0.22 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasWhyGridEnteredView]);

  return (
    <section ref={sectionRef} className="bg-[#F6F6F6] py-14 md:py-20 xl:py-24">
      <style dangerouslySetInnerHTML={{ __html: wcuKeyframes }} />
      <div className="container mx-auto px-4 md:px-8 xl:px-12">
        <div className="mx-auto max-w-[1260px]">
          <div className="mx-auto max-w-[920px] text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#E0F2FE] px-4 py-2 text-sm font-medium text-[#06457F] md:text-base" style={wcuAnim("wcuFadeUp", 0)}>
              <IoFlash className="h-4 w-4" aria-hidden />
              {content.badge}
            </span>

            <h2 className="mt-5 text-[2.15rem] font-semibold leading-[1.15] text-[#20222a] md:mt-6 md:text-[2.9rem] lg:text-[3.2rem]">
              {WCU_HEADING_LINE1.map((word, i) => (
                <span
                  key={i}
                  className="inline-block"
                  style={
                    isSectionVisible
                      ? { willChange: "opacity, transform", animation: `wcuWordPop 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${100 + i * 55}ms forwards`, opacity: 0 }
                      : { opacity: 0 }
                  }
                >
                  {word}{i < WCU_HEADING_LINE1.length - 1 ? "\u00A0" : ""}
                </span>
              ))}
              <br />
              {WCU_HEADING_LINE2.map((word, i) => (
                <span
                  key={i}
                  className="inline-block"
                  style={
                    isSectionVisible
                      ? { willChange: "opacity, transform", animation: `wcuWordPop 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${100 + (WCU_HEADING_LINE1.length + i) * 55}ms forwards`, opacity: 0 }
                      : { opacity: 0 }
                  }
                >
                  {word}{i < WCU_HEADING_LINE2.length - 1 ? "\u00A0" : ""}
                </span>
              ))}
            </h2>

            <p className="mx-auto mt-5 max-w-[880px] text-[1.04rem] leading-[1.62] text-[#66708b] md:mt-6 md:text-[1.2rem]" style={wcuAnim("wcuFadeUp", 100 + WCU_ALL_WORDS.length * 55 + 60)}>
              {content.description}
            </p>
          </div>

          <div className="group relative mt-10 overflow-hidden rounded-[22px] shadow-[0_18px_40px_rgba(0,0,0,0.14)] md:mt-12 md:rounded-[34px]" style={wcuAnim("wcuFadeUp", 100 + WCU_ALL_WORDS.length * 55 + 180)}>
            <video
              ref={heroVideoRef}
              src={content.videoSrc}
              preload="metadata"
              playsInline
              className="relative aspect-[16/6.2] min-h-[250px] w-full object-cover md:min-h-[390px]"
              onPlay={() => setIsHeroPlaying(true)}
              onPause={() => setIsHeroPlaying(false)}
              onEnded={() => setIsHeroPlaying(false)}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/42 via-black/15 to-black/5" />

            {!isHeroPlaying && (
              <button
                type="button"
                aria-label="Play video"
                onClick={handleHeroPlayToggle}
                className="absolute left-1/2 top-1/2 z-20 inline-flex h-[108px] w-[108px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#06457F]/70 bg-[#06457F]/45 text-white shadow-[0_16px_45px_rgba(6, 69, 127,   0.48)] backdrop-blur-[1px] transition hover:scale-[1.02] hover:bg-[#06457F]/62"
              >
                <IoPlay className="h-11 w-11 translate-x-0.5" />
              </button>
            )}

            {isHeroPlaying && (
              <button
                type="button"
                aria-label="Pause video"
                onClick={handleHeroPlayToggle}
                className="pointer-events-none absolute left-1/2 top-1/2 z-20 inline-flex h-[108px] w-[108px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#06457F]/70 bg-[#06457F]/45 text-white opacity-0 shadow-[0_16px_45px_rgba(6, 69, 127,   0.48)] backdrop-blur-[1px] transition group-hover:pointer-events-auto group-hover:opacity-100 hover:bg-[#06457F]/62"
              >
                <IoPause className="h-10 w-10" />
              </button>
            )}

            <button
              type="button"
              aria-label="Open video in modal"
              onClick={openHeroVideoModal}
              className="pointer-events-none absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#06457F]/70 bg-[#06457F]/45 text-white opacity-0 shadow-[0_12px_30px_rgba(6, 69, 127,   0.38)] backdrop-blur-[1px] transition group-hover:pointer-events-auto group-hover:opacity-100 hover:bg-[#06457F]/62"
            >
              <Maximize2 className="h-5 w-5" />
            </button>
          </div>

          <div ref={whyGridRef} className="mt-7 grid gap-4 lg:grid-cols-3 xl:gap-5">
            <article
              className={`${
                hasWhyGridEnteredView ? "whyGrid-card-enter" : "whyGrid-card-base"
              } whySquareCard rounded-[24px] border border-[#dedee4] bg-[#f4f4f5] p-6 md:p-8`}
              style={{ animationDelay: "0.08s" }}
            >
              <h3 className="text-[1.9rem] font-semibold leading-[1.15] text-[#1f2430] md:text-[1.95rem]">
                {content.experienceTitle.split("\n").map((line, i) => (
                  <span key={i}>{line}{i < content.experienceTitle.split("\n").length - 1 && <br />}</span>
                ))}
              </h3>

              <ul className="mt-6 space-y-5">
                {content.awardItems.map((text, i) => {
                  const Icon = AWARD_ICONS[i] ?? IoFlashOutline;
                  return (
                    <li key={text} className="flex items-center gap-4">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#ececef] text-[#1f2635]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-[1.05rem] font-medium leading-[1.4] text-[#273244] md:text-[1.04rem]">
                        {text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </article>

            <article
              className={`${
                hasWhyGridEnteredView ? "whyGrid-card-enter" : "whyGrid-card-base"
              } whySquareCard rounded-[24px] bg-[linear-gradient(180deg,#191c24_0%,#171922_100%)] p-5 md:p-6`}
              style={{ animationDelay: "0.17s" }}
            >
              <div className="flex items-start justify-between gap-4">
                <Image src={content.webblyIconSrc} alt="Zephlo icon" width={48} height={48} className="h-10 w-10 md:h-11 md:w-11" />
                <div className="text-right">
                  <p className="text-[3rem] font-semibold leading-none text-white md:text-[3.35rem]">{content.conversionValue}</p>
                  <p className="mt-1 text-[0.95rem] leading-[1.2] text-[#d8deea] md:text-[1rem]">
                    {content.conversionLabel.split("\n").map((line, i) => (
                      <span key={i}>{line}{i < content.conversionLabel.split("\n").length - 1 && <br />}</span>
                    ))}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex h-[108px] items-end gap-2 select-none pointer-events-none" aria-hidden>
                {GRAPH_BARS.map((height, index) => (
                  <div
                    key={`${height}-${index}`}
                    className={`graphRise block flex-1 rounded-[7px] ${
                      index === 6 ? "bg-[#d3d9e6]" : "bg-[#475163]"
                    }`}
                    style={{ height: `${height}%`, animationDelay: `${0.06 + index * 0.05}s` }}
                  />
                ))}
              </div>

              <p className="mt-5 max-w-[360px] text-[0.92rem] leading-[1.48] text-[#9ca8bc] md:text-[0.95rem]">
                {content.conversionDescription}
              </p>
            </article>

            <div
              className={`${
                hasWhyGridEnteredView ? "whyGrid-card-enter" : "whyGrid-card-base"
              } whySquareCard hostingFlipCard rounded-[24px]`}
              style={{ animationDelay: "0.26s" }}
            >
              <div className="hostingFlipInner">
                <article
                  className="hostingFace hostingFront p-6 md:p-8"
                  style={{
                    backgroundImage: "linear-gradient(135deg,#06457F 0%,#0474C4 100%)",
                  }}
                >
                  <Image
                    src={content.spiralBgSrc}
                    alt=""
                    fill
                    aria-hidden
                    className="pointer-events-none object-cover opacity-42 mix-blend-screen"
                  />
                  <div className="relative z-10 flex h-full flex-col">
                    <h3 className="max-w-[410px] text-[1.95rem] font-semibold leading-[1.24] text-white md:text-[1.95rem]">
                      {content.hostingTitle.split("\n").map((line, i) => (
                        <span key={i}>{line}{i < content.hostingTitle.split("\n").length - 1 && <br />}</span>
                      ))}
                    </h3>

                    <div className="relative mt-auto flex items-end justify-end">
                      <Link
                        href="/domain-hosting"
                        className="absolute bottom-2 left-0 z-30 inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-white px-6 py-3 text-[1rem] font-medium text-[#1f2533] md:bottom-6 md:py-3 md:text-[1rem]"
                      >
                        {content.hostingButtonText}
                        <span className="pointer-events-none inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1b2338] text-white">
                          <MdArrowOutward className="h-4 w-4" />
                        </span>
                      </Link>

                      <div className="relative h-[168px] w-[168px] shrink-0 rounded-full border-[18px] border-[#0474C4] md:h-[206px] md:w-[206px] md:border-[22px]">
                        <div className="relative h-full w-full overflow-hidden rounded-full">
                          <Image
                            src={content.hostingImageSrc}
                            alt="Zephlo host support specialist"
                            fill
                            className="object-cover"
                            sizes="220px"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </article>

                <article
                  className="hostingFace hostingBack p-6 md:p-8"
                  style={{
                    backgroundImage: "linear-gradient(135deg,#06457F 0%,#0474C4 100%)",
                  }}
                >
                  <Image
                    src={content.spiralBgSrc}
                    alt=""
                    fill
                    aria-hidden
                    className="pointer-events-none object-cover opacity-42 mix-blend-screen"
                  />
                  <div className="relative z-10 flex h-full flex-col">
                    <p className="text-[1.02rem] leading-[1.52] text-white md:text-[1rem]">
                      {content.hostingBackText.split("\n").map((line, i) => (
                        <span key={i}>{line}{i < content.hostingBackText.split("\n").length - 1 && <br />}</span>
                      ))}
                    </p>

                    <Link
                      href="/domain-hosting"
                      className="mt-auto inline-flex w-fit items-center gap-3 whitespace-nowrap rounded-full bg-white px-6 py-3 text-[1rem] font-medium text-[#1f2533] md:py-3 md:text-[1rem]"
                    >
                      {content.hostingButtonText}
                      <span className="pointer-events-none inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1b2338] text-white">
                        <MdArrowOutward className="h-4 w-4" />
                      </span>
                    </Link>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isHeroModalOpen && (
        <ModalPortal>
        <div className="fixed inset-0 z-[9999] bg-black/90">
          <button
            type="button"
            onClick={closeHeroVideoModal}
            aria-label="Close video modal backdrop"
            className="absolute inset-0"
          />

          <div className="relative z-10 flex h-full w-full items-center justify-center p-0 md:p-8">
            <div className="relative h-full w-full overflow-hidden bg-black md:h-auto md:max-w-6xl md:rounded-2xl">
              <button
                type="button"
                onClick={closeHeroVideoModal}
                aria-label="Close video modal"
                className="absolute right-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-black/35 text-white backdrop-blur transition hover:bg-black/55 md:right-4"
                style={{ top: "calc(env(safe-area-inset-top, 0px) + 0.75rem)" }}
              >
                <X className="h-5 w-5" />
              </button>

              <video
                ref={heroModalVideoRef}
                src={content.videoSrc}
                controls
                autoPlay
                playsInline
                className="h-full w-full bg-black object-contain md:max-h-[85vh] md:h-auto"
                onLoadedMetadata={() => {
                  const modalVideo = heroModalVideoRef.current;
                  if (!modalVideo) return;
                  const nextTime = Number.isFinite(heroModalStartTime) ? heroModalStartTime : 0;
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
        .whyGrid-card-base {
          opacity: 0;
          transform: translateY(24px) scale(0.82);
          transform-origin: center;
        }

        .whyGrid-card-enter {
          opacity: 0;
          transform: translateY(24px) scale(0.82);
          transform-origin: center;
          animation: whyGridEnter 0.62s cubic-bezier(0.2, 0.78, 0.24, 1) forwards;
          will-change: transform, opacity;
        }

        @keyframes whyGridEnter {
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

        .whySquareCard {
          min-height: 365px;
          height: 100%;
        }

        @media (min-width: 768px) {
          .whySquareCard {
            min-height: 430px;
          }
        }

        @media (min-width: 1024px) {
          .whySquareCard {
            min-height: 0;
            aspect-ratio: 1 / 1;
          }
        }

        .graphRise {
          transform-origin: bottom;
          transform: translateY(28px) scaleY(0.06);
          animation: riseToBar 0.72s cubic-bezier(0.2, 0.76, 0.26, 1) forwards;
        }

        @keyframes riseToBar {
          to {
            transform: translateY(0) scaleY(1);
          }
        }

        .hostingFlipCard {
          perspective: 1400px;
        }

        .hostingFlipInner {
          position: relative;
          height: 100%;
          width: 100%;
          transform-style: preserve-3d;
          transition: transform 0.85s cubic-bezier(0.2, 0.75, 0.2, 1);
        }

        .hostingFlipCard:hover .hostingFlipInner,
        .hostingFlipCard:focus-within .hostingFlipInner {
          transform: rotateY(180deg);
        }

        .hostingFace {
          position: absolute;
          inset: 0;
          border-radius: 24px;
          overflow: hidden;
          backface-visibility: hidden;
          background-size: cover;
          background-position: center;
        }

        .hostingFace::before {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.04);
          pointer-events: none;
        }

        .hostingFront {
          pointer-events: auto;
        }

        .hostingBack {
          transform: rotateY(180deg);
          pointer-events: none;
        }

        .hostingFlipCard:hover .hostingFront,
        .hostingFlipCard:focus-within .hostingFront {
          pointer-events: none;
        }

        .hostingFlipCard:hover .hostingBack,
        .hostingFlipCard:focus-within .hostingBack {
          pointer-events: auto;
        }

        @media (prefers-reduced-motion: reduce) {
          .whyGrid-card-base,
          .whyGrid-card-enter {
            opacity: 1;
            transform: none;
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
