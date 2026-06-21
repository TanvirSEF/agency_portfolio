"use client";

import { gsap } from "gsap";
import {
  useRef,
  useEffect,
  useCallback,
  type CSSProperties,
} from "react";

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words";
  from?: { opacity?: number; y?: number; x?: number };
  to?: { opacity?: number; y?: number; x?: number };
  threshold?: number;
  rootMargin?: string;
  textAlign?: "left" | "center" | "right";
  onLetterAnimationComplete?: () => void;
  showCallback?: boolean;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  style?: CSSProperties;
}

export default function SplitText({
  text,
  className = "",
  delay = 5,
  duration = 1,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "0px",
  textAlign = "left",
  onLetterAnimationComplete,
  showCallback = false,
  as: Component = "span",
  style: styleProp,
}: SplitTextProps) {
  const containerRef = useRef<HTMLSpanElement | HTMLHeadingElement | HTMLParagraphElement>(null);
  const hasAnimated = useRef(false);

  const runAnimation = useCallback(() => {
    const el = containerRef.current;
    if (!el || hasAnimated.current) return;
    hasAnimated.current = true;

    const units = el.querySelectorAll<HTMLElement>("[data-split-unit]");
    if (units.length === 0) {
      onLetterAnimationComplete?.();
      return;
    }

    const fromVars: Record<string, number> = {
      opacity: from?.opacity ?? 0,
      y: from?.y ?? 40,
    };
    if (from?.x != null) fromVars.x = from.x;

    const toVars: Record<string, unknown> = {
      opacity: to?.opacity ?? 1,
      y: to?.y ?? 0,
      duration,
      ease,
    };
    if (to?.x != null) (toVars as Record<string, number>).x = to.x;

    gsap.fromTo(units, fromVars, {
      ...toVars,
      stagger: delay / 1000,
      onComplete: onLetterAnimationComplete,
    });
  }, [
    delay,
    duration,
    ease,
    from?.opacity,
    from?.x,
    from?.y,
    to?.opacity,
    to?.x,
    to?.y,
    onLetterAnimationComplete,
  ]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (showCallback) (entry.target as HTMLElement).dataset.visible = "true";
            runAnimation();
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, runAnimation, showCallback]);

  const chunks =
    splitType === "chars"
      ? text.split("")
      : text.split(/(\s+)/).filter(Boolean);

  // Set initial state so letters are hidden before animation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const units = el.querySelectorAll<HTMLElement>("[data-split-unit]");
    gsap.set(units, {
      opacity: from?.opacity ?? 0,
      y: from?.y ?? 40,
      ...(from?.x != null && { x: from.x }),
    });
  }, [from?.opacity, from?.x, from?.y, text]);

  const style: CSSProperties = {
    textAlign,
    display: "block",
    ...styleProp,
  };

  return (
    <Component
      ref={containerRef as React.RefObject<HTMLHeadingElement & HTMLParagraphElement & HTMLSpanElement>}
      className={className}
      style={style}
      aria-label={text}
    >
      {chunks.map((chunk, i) => (
        <span
          key={i}
          data-split-unit
          style={{ display: "inline-block", whiteSpace: chunk.match(/\s/) ? "pre" : "normal" }}
        >
          {chunk}
        </span>
      ))}
    </Component>
  );
}
