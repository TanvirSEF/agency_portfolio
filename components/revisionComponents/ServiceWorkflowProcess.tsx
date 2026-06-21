"use client";

import { useEffect, useRef, useState } from "react";
import { TbAnalyze, TbFileTextSpark } from "react-icons/tb";
import { RiSeoLine } from "react-icons/ri";
import { MdOutlineMonitorHeart } from "react-icons/md";
import { SlSpeedometer } from "react-icons/sl";
import { GrDocumentUpdate } from "react-icons/gr";
import type { IconType } from "react-icons";
import BorderGlow from "@/components/ui/BorderGlow";

interface Step {
  icon: IconType;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    icon: TbAnalyze,
    title: "Website Check and Analysis",
    description:
      "But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences",
  },
  {
    icon: RiSeoLine,
    title: "SEO Strategy Making",
    description:
      "Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain",
  },
  {
    icon: TbFileTextSpark,
    title: "Content Optimization",
    description:
      "In certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur",
  },
  {
    icon: MdOutlineMonitorHeart,
    title: "Monitoring with GSC & GA4",
    description:
      "Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain",
  },
  {
    icon: SlSpeedometer,
    title: "Reporting & Updates",
    description:
      "In certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur",
  },
];

const wfKeyframes = `
@keyframes wfFadeUp {
  0% { opacity: 0; transform: translate3d(0, 28px, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
`;

export default function ServiceWorkflowProcess() {
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
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const anim = (delay: number): React.CSSProperties =>
    isVisible
      ? {
          willChange: "opacity, transform",
          animation: `wfFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms forwards`,
          opacity: 0,
        }
      : { opacity: 0 };

  return (
    <section ref={sectionRef} className="bg-[#0a0f2c] py-14 md:py-20 xl:py-24">
      <style dangerouslySetInnerHTML={{ __html: wfKeyframes }} />

      <div className="mx-auto w-full max-w-[1260px] px-4 md:px-8 xl:px-12">
        {/* Header */}
        <div className="max-w-2xl" style={anim(0)}>
          <h2 className="text-[28px] font-semibold leading-[1.2] text-[#f3f6ff] sm:text-[32px] md:text-[36px] lg:text-[42px]">
            Our SEO Workflow Process
          </h2>
          <p className="mt-4 max-w-xl text-[0.95rem] leading-[1.7] text-white/65 md:text-[1rem]">
            At Webbly Media, we create a clear and simple SEO plan to help your
            business grow online over time. We start by understanding your
            business goals, then we improve your website in every way possible.
          </p>
        </div>

        {/* Cards grid */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-12 lg:grid-cols-3 lg:gap-6">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.title} style={anim(150 + i * 100)}>
                <BorderGlow
                  edgeSensitivity={15}
                  glowColor="250 60 70"
                  backgroundColor="#0a0f2c"
                  borderRadius={14}
                  glowRadius={39}
                  glowIntensity={0.5}
                  coneSpread={22}
                  animated={isVisible}
                  colors={[
                    ["#7c3aed", "#a78bfa", "#38bdf8"],
                    ["#6366f1", "#818cf8", "#c084fc"],
                    ["#38bdf8", "#22d3ee", "#6366f1"],
                    ["#a78bfa", "#f472b6", "#38bdf8"],
                    ["#c084fc", "#6366f1", "#22d3ee"],
                  ][i]}
                >
                  <div className="px-6 py-7 md:px-7 md:py-8">
                    <Icon className="h-8 w-8 text-white/80" aria-hidden />

                    <h3 className="mt-5 text-[1.05rem] font-semibold leading-[1.35] text-[#f3f6ff] md:text-[1.12rem]">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-[0.88rem] leading-[1.7] text-white/55 md:text-[0.92rem]">
                      {step.description}
                    </p>
                  </div>
                </BorderGlow>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
