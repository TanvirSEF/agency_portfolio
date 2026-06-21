"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import { IoFlash } from "react-icons/io5";
import type { WebDevContent } from "@/revision-json-content/web-development/useWebDevContent";

interface RibbonProps {
  className: string;
  direction: "left" | "right";
  speed: number;
  style?: React.CSSProperties;
  logoOrder: number[];
  logoMap: Record<number, { src: string; alt: string; width: number }>;
}

function Ribbon({ className, direction, speed, style, logoOrder, logoMap }: RibbonProps) {
  return (
    <div className={className} style={style}>
      <Marquee gradient={false} autoFill speed={speed} direction={direction}>
        <div className="flex items-center container gap-5 px-6 py-4 md:gap-7 md:px-8">
          {logoOrder.map((logoId, index) => {
            const logo = logoMap[logoId];
            if (!logo) return null;
            return (
              <Fragment key={`${logoId}-${index}`}>
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={44}
                  className="h-8 w-auto -rotate-[4.61deg] select-none md:h-10"
                  draggable={false}
                />
                <IoFlash className="h-5 w-5 shrink-0 text-white md:h-6 md:w-6" aria-hidden />
              </Fragment>
            );
          })}
        </div>
      </Marquee>
    </div>
  );
}

const marqueeKeyframes = `
@keyframes mqOpenTop {
  0% { opacity: 0; transform: rotate(-5deg) translateY(8px); }
  100% { opacity: 1; transform: rotate(0deg) translateY(0); }
}
@keyframes mqOpenBottom {
  0% { opacity: 0; transform: rotate(5deg) translateY(-8px); }
  100% { opacity: 1; transform: rotate(0deg) translateY(0); }
}
@media (min-width: 768px) {
  @keyframes mqOpenTop {
    0% { opacity: 0; transform: rotate(-4deg) translateY(8px); }
    100% { opacity: 1; transform: rotate(0deg) translateY(0); }
  }
  @keyframes mqOpenBottom {
    0% { opacity: 0; transform: rotate(4deg) translateY(-8px); }
    100% { opacity: 1; transform: rotate(0deg) translateY(0); }
  }
}
`;

export default function MarqueeSection({ content }: { content: WebDevContent["marqueeSection"] }) {
  const logoMap: Record<number, { src: string; alt: string; width: number }> = {};
  for (const logo of content.logos) {
    logoMap[logo.id] = { src: logo.src, alt: logo.alt, width: logo.width };
  }
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const anim = (name: string, delay: number): React.CSSProperties =>
    isVisible
      ? { willChange: "opacity, transform", animation: `${name} 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms forwards`, opacity: 0 }
      : { opacity: 0 };

  return (
    <section className="relative overflow-hidden bg-[#F6F6F6] py-10 md:py-14">
      <style dangerouslySetInnerHTML={{ __html: marqueeKeyframes }} />
      <div ref={sectionRef} className="relative mx-auto h-[200px] w-full md:h-[190px] lg:h-[220px]">
        <Ribbon
          className="absolute left-1/2 top-[44%] w-[170vw] -translate-x-1/2 -translate-y-1/2 rotate-[5deg] bg-[#151720] text-white shadow-[0_16px_36px_rgba(0,0,0,0.28)] md:top-1/2 md:w-[145vw] md:rotate-[4deg]"
          direction="right"
          speed={50}
          style={anim("mqOpenTop", 0)}
          logoOrder={content.logoOrder}
          logoMap={logoMap}
        />
        <Ribbon
          className="absolute left-1/2 top-[56%] z-10 w-[170vw] -translate-x-1/2 -translate-y-1/2 -rotate-[5deg] bg-[linear-gradient(90deg,#6E3BFF_0%,#8E62FF_52%,#6E3BFF_100%)] text-white shadow-[0_18px_40px_rgba(92,52,255,0.32)] md:top-1/2 md:w-[145vw] md:-rotate-[4deg]"
          direction="left"
          speed={56}
          style={anim("mqOpenBottom", 120)}
          logoOrder={content.logoOrder}
          logoMap={logoMap}
        />
      </div>
    </section>
  );
}
