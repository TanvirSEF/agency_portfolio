"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoChevronDown } from "react-icons/io5";
import { HiArrowUpRight } from "react-icons/hi2";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import type { WebDevContent } from "@/revision-json-content/web-development/useWebDevContent";

const SOCIAL_LINKS = [
  {
    href: "https://instagram.com",
    label: "Instagram",
    icon: FaInstagram,
  },
  {
    href: "https://www.facebook.com/zephlotech",
    label: "Facebook",
    icon: FaFacebookF,
  },
  {
    href: "https://x.com",
    label: "X (Twitter)",
    icon: FaXTwitter,
  },
  {
    href: "https://youtube.com",
    label: "YouTube",
    icon: FaYoutube,
  },
] as const;

export default function RevisionFaqSection({ content }: { content: WebDevContent["revisionFaqSection"] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqListRef = useRef<HTMLDivElement>(null);
  const [hasFaqCardsEnteredView, setHasFaqCardsEnteredView] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenIndex((previous) => (previous === index ? null : index));
  };

  useEffect(() => {
    if (hasFaqCardsEnteredView) return;

    const target = faqListRef.current;
    if (!target || typeof IntersectionObserver === "undefined") {
      setHasFaqCardsEnteredView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setHasFaqCardsEnteredView(true);
          observer.disconnect();
        });
      },
      { threshold: 0.18 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasFaqCardsEnteredView]);

  return (
    <section className="bg-[#F6F6F6] py-14 md:py-20 xl:py-24">
      <div className="container mx-auto px-4 md:px-8 xl:px-12">
        <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[minmax(320px,0.4fr)_minmax(0,0.6fr)] lg:justify-between lg:items-start xl:grid-cols-[minmax(340px,0.38fr)_minmax(0,0.62fr)] xl:gap-5">
          <div className="lg:max-w-[390px] xl:max-w-[430px]">
            <div className="mx-auto w-full max-w-[520px] text-center lg:mx-0 lg:max-w-[380px] lg:text-left xl:max-w-[410px]">
              <h2 className="mx-auto max-w-full text-[2rem] font-semibold leading-[1.14] tracking-[-0.025em] text-[#20232b] sm:max-w-[15ch] sm:text-[2.35rem] md:text-[3rem] lg:mx-0 lg:max-w-[12ch] xl:max-w-[13ch] xl:text-[3.2rem]">
                {content.title}
              </h2>
              <p className="mx-auto mt-5 max-w-[350px] text-[1rem] leading-[1.7] text-[#677588] md:text-[1.04rem] lg:mx-0 xl:max-w-[390px]">
                {content.subtitle}
              </p>
            </div>

            <aside
              className={`${hasFaqCardsEnteredView ? "contact-card-enter" : "contact-card-base"} mt-8 rounded-[18px] bg-[linear-gradient(150deg,#06457F_0%,#262B40_54%,#0474C4_100%)] px-6 py-7 text-white shadow-[0_20px_38px_rgba(6, 69, 127, 0.35)] md:px-7 md:py-8 lg:self-start`}
            >
              <div
                className="contact-item relative h-12 w-12 overflow-hidden rounded-full border border-white/55 bg-white/25"
                style={{ animationDelay: "0.06s" }}
              >
                <Image
                  src={content.profileImage}
                  alt="Profile"
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>

              <h3
                className="contact-item mt-7 max-w-[320px] text-[2rem] font-semibold leading-[1.28] tracking-[-0.01em] text-white sm:max-w-[360px] lg:max-w-[240px]"
                style={{ animationDelay: "0.14s" }}
              >
                {content.contactHeading.split("\n").map((line, i) => (
                  <span key={i}>{line}{i < content.contactHeading.split("\n").length - 1 && <br />}</span>
                ))}
              </h3>

              <div className="contact-item mt-7 space-y-3" style={{ animationDelay: "0.22s" }}>
                <p className="text-[1.02rem] leading-[1.45] text-white/90 md:text-[1.08rem]">
                  <span className="font-semibold uppercase text-white">Email:</span> {content.email}
                </p>
                <p className="text-[1.02rem] leading-[1.45] text-white/90 md:text-[1.08rem]">
                  <span className="font-semibold uppercase text-white">Phone:</span> {content.phone}
                </p>
              </div>

              <div className="contact-item mt-6 flex items-center gap-3" style={{ animationDelay: "0.3s" }}>
                {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/12 text-[1.1rem] text-white transition-colors hover:bg-white/20"
                  >
                    <Icon aria-hidden />
                  </Link>
                ))}
              </div>

              <Link
                href="/contact"
                className="contact-item group mt-8 inline-flex items-center rounded-full bg-white px-3 py-2 text-[0.88rem] font-semibold text-[#1f2430]"
                style={{ animationDelay: "0.38s" }}
              >
                <span className="px-2">{content.askQuestionButton}</span>
                <span className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#131723] text-white">
                  <HiArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </aside>
          </div>

          <div ref={faqListRef} className="space-y-4 lg:max-w-full lg:pt-1 xl:min-w-0">
            {content.faqs.map((faq, index) => (
              <article
                key={faq.id}
                className={`${hasFaqCardsEnteredView ? "faq-card-enter" : "faq-card-base"} overflow-hidden rounded-[16px] border bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-all duration-300 ${
                  openIndex === index
                    ? "border-[#ececf3] shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
                    : "border-[#f0f1f5]"
                }`}
                style={{ animationDelay: `${0.06 + index * 0.085}s` }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`revision-faq-answer-${faq.id}`}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-7 md:py-6"
                >
                  <h3 className="text-[1rem] font-semibold leading-[1.45] text-[#232630] md:text-[1.08rem]">
                    {faq.question}
                  </h3>
                  <span
                    className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F0F5FA] text-[#06457F] transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  >
                    <IoChevronDown className="h-5 w-5" aria-hidden />
                  </span>
                </button>

                <div
                  id={`revision-faq-answer-${faq.id}`}
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    openIndex === index ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-5 pb-5 md:px-7 md:pb-6">
                    <p className="max-w-[94%] text-[0.97rem] leading-[1.72] text-[#667588] md:text-[1rem]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-card-base {
          opacity: 0;
          transform: translateY(-34px) scale(0.95);
          filter: blur(4px);
        }

        .contact-card-enter {
          opacity: 0;
          transform: translateY(-34px) scale(0.95);
          filter: blur(4px);
          animation: contactCardDrop 0.82s cubic-bezier(0.2, 0.84, 0.24, 1) forwards;
          will-change: transform, opacity, filter;
        }

        .contact-item {
          opacity: 0;
          transform: translateY(14px);
          filter: blur(2px);
          will-change: transform, opacity, filter;
        }

        .contact-card-enter .contact-item {
          animation: contactItemRise 0.56s cubic-bezier(0.2, 0.84, 0.24, 1) forwards;
        }

        @keyframes contactCardDrop {
          0% {
            opacity: 0;
            transform: translateY(-34px) scale(0.95);
            filter: blur(4px);
          }
          45% {
            opacity: 1;
            transform: translateY(-5px) scale(0.99);
            filter: blur(1px);
          }
          72% {
            opacity: 1;
            transform: translateY(8px) scale(1.01);
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes contactItemRise {
          0% {
            opacity: 0;
            transform: translateY(14px);
            filter: blur(2px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        .faq-card-base {
          opacity: 0;
          transform: translateY(-42px) scale(0.92);
          filter: blur(4px);
        }

        .faq-card-enter {
          opacity: 0;
          transform: translateY(-42px) scale(0.92);
          filter: blur(4px);
          animation: faqNotificationDrop 0.78s cubic-bezier(0.2, 0.84, 0.24, 1) forwards;
          will-change: transform, opacity, filter;
        }

        @keyframes faqNotificationDrop {
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
          .contact-card-base,
          .contact-card-enter,
          .contact-item {
            opacity: 1;
            transform: none;
            filter: none;
            animation: none;
          }

          .faq-card-base,
          .faq-card-enter {
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
