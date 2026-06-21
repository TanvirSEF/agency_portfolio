"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IoFlash } from "react-icons/io5";
import styles from "./ServicesShowcase.module.css";

const SERVICES = [
  {
    image: "/revision-images/seo/ServicesShowcaseV2/slide-image-1.webp",
    title: "Local SEO",
    description:
      "Our social media marketing services help your brand connect with the right audience.",
  },
  {
    image: "/revision-images/seo/ServicesShowcaseV2/slide-image-2.webp",
    title: "National SEO",
    description:
      "We boost your search rankings with modern, data-driven SEO strategies.",
  },
  {
    image: "/revision-images/seo/ServicesShowcaseV2/slide-image-3.webp",
    title: "Multilingual & International SEO",
    description:
      "Our PPC and Google Ads management services help you get instant traffic.",
  },
  {
    image: "/revision-images/seo/ServicesShowcaseV2/slide-image-4.webp",
    title: "Startup & Enterprise SEO",
    description:
      "Our PPC and Google Ads management services help you get instant traffic.",
  },
  {
    image: "/revision-images/seo/ServicesShowcaseV2/slide-image-5.webp",
    title: "E-commerce SEO",
    description:
      "Our PPC and Google Ads management services help you get instant traffic.",
  },
  {
    image: "/revision-images/seo/ServicesShowcaseV2/slide-image-6.webp",
    title: "B2B SaaS SEO",
    description:
      "Our PPC and Google Ads management services help you get instant traffic.",
  },
];

const keyframes = `
@keyframes scv2FadeUp {
  0% { opacity: 0; transform: translate3d(0, 24px, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes scv2CardUp {
  0% { opacity: 0; transform: translate3d(0, 32px, 0) scale(0.97); }
  100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
}
`;

export default function ServicesShowcaseV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);

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
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const goPrev = () =>
    setSelectedItem((prev) => (prev - 1 + SERVICES.length) % SERVICES.length);
  const goNext = () =>
    setSelectedItem((prev) => (prev + 1) % SERVICES.length);

  const anim = (delay: number): React.CSSProperties =>
    isVisible
      ? {
          willChange: "opacity, transform",
          animation: `scv2FadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms forwards`,
          opacity: 0,
        }
      : { opacity: 0 };

  const cardAnim = (delay: number): React.CSSProperties =>
    isVisible
      ? {
          willChange: "opacity, transform",
          animation: `scv2CardUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms forwards`,
          opacity: 0,
        }
      : { opacity: 0 };

  const renderCard = (service: (typeof SERVICES)[number], i: number, inCarousel = false) => (
    <article
      key={service.title}
      className={`group text-center ${inCarousel ? "px-2" : ""}`}
      style={inCarousel ? undefined : cardAnim(300 + i * 90)}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] md:rounded-[16px]">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={inCarousel ? "88vw" : "(max-width: 1023px) 50vw, 33vw"}
        />
      </div>

      <h3 className="mt-5 text-[1.1rem] font-semibold leading-[1.3] text-[#c8d96a] md:text-[1.2rem]">
        {service.title}
      </h3>

      <p className="mx-auto mt-2 max-w-[320px] text-[0.88rem] leading-[1.65] text-white/80 md:text-[0.92rem]">
        {service.description}
      </p>
    </article>
  );

  return (
    <section ref={sectionRef} className="bg-[#020b3a] py-14 md:py-20 xl:py-24">
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />

      <div className="mx-auto w-full max-w-[1260px] px-4 md:px-8 xl:px-12">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full border border-[#c8d96a]/30 bg-[#0d1a4a] px-4 py-1.5 text-sm font-semibold text-[#c8d96a]"
            style={anim(0)}
          >
            <IoFlash className="h-3.5 w-3.5" aria-hidden />
            Our Services
          </span>

          <h2
            className="mt-5 text-[28px] font-semibold leading-[1.2] text-[#f3f6ff] sm:text-[32px] md:text-[36px] lg:text-[42px]"
            style={anim(100)}
          >
            Webbly Media&apos;s SEO Services Include
          </h2>

          <p
            className="mx-auto mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-white/75 md:text-[1rem]"
            style={anim(200)}
          >
            As a professional SEO agency, we offer complete SEO solutions for all
            types of businesses. Learn how we can help you stand out on search
            engines.
          </p>
        </div>
      </div>

      {/* Mobile Carousel */}
      {isMobile && (
        <div className="mt-10 px-4" style={anim(300)}>
          <div className={styles.carouselRoot}>
            <Carousel
              selectedItem={selectedItem}
              onChange={setSelectedItem}
              emulateTouch
              swipeable
              showArrows={false}
              showStatus={false}
              showIndicators={false}
              showThumbs={false}
              centerMode
              centerSlidePercentage={88}
              transitionTime={650}
              preventMovementUntilSwipeScrollTolerance
              swipeScrollTolerance={30}
            >
              {SERVICES.map((service, i) => (
                <div key={service.title}>
                  {renderCard(service, i, true)}
                </div>
              ))}
            </Carousel>

            <div className="mt-7 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={goPrev}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#2a2f39] text-white transition hover:bg-[#394151]"
                aria-label="Previous service"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#2a2f39] text-white transition hover:bg-[#394151]"
                aria-label="Next service"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop / Tablet Grid */}
      {!isMobile && (
        <div className="mx-auto mt-10 w-full max-w-[1260px] px-4 md:mt-12 md:px-8 xl:px-12">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-3 lg:gap-7 xl:gap-8">
            {SERVICES.map((service, i) => renderCard(service, i))}
          </div>
        </div>
      )}
    </section>
  );
}
