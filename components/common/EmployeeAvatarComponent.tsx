'use client';

import Image from "@/components/common/SeoImage";
import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { RichTextBlock, richTextToPlainText } from "./RichTextContent";

interface PixelTransitionProps {
  firstContent: React.ReactNode | string;
  secondContent: React.ReactNode | string;
  gridSize?: number;
  pixelColor?: string;
  animationStepDuration?: number;
  once?: boolean;
  className?: string;
  style?: CSSProperties;
  aspectRatio?: string;
}

const PixelTransition: React.FC<PixelTransitionProps> = ({
  firstContent,
  secondContent,
  gridSize = 7,
  pixelColor = "currentColor",
  animationStepDuration = 0.35,
  once = false,
  aspectRatio = "100%",
  className = "",
  style = {},
}) => {
  const pixelGridRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLDivElement | null>(null);
  const delayedCallRef = useRef<gsap.core.Tween | null>(null);

  const [isActive, setIsActive] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const touch =
      "ontouchstart" in window ||
      (navigator as any).maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;
    setIsTouchDevice(touch);
  }, []);

  useEffect(() => {
    const pixelGridEl = pixelGridRef.current;
    if (!pixelGridEl) return;

    pixelGridEl.innerHTML = "";

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement("div");
        pixel.classList.add("pixelated-image-card__pixel");
        pixel.classList.add("absolute", "hidden");
        pixel.style.backgroundColor = pixelColor;

        const size = 100 / gridSize;
        pixel.style.width = `${size}%`;
        pixel.style.height = `${size}%`;
        pixel.style.left = `${col * size}%`;
        pixel.style.top = `${row * size}%`;

        pixelGridEl.appendChild(pixel);
      }
    }
  }, [gridSize, pixelColor]);

  const animatePixels = (activate: boolean): void => {
    setIsActive(activate);

    const pixelGridEl = pixelGridRef.current;
    const activeEl = activeRef.current;
    if (!pixelGridEl || !activeEl) return;

    const pixels = pixelGridEl.querySelectorAll<HTMLDivElement>(".pixelated-image-card__pixel");
    if (!pixels.length) return;

    gsap.killTweensOf(pixels);
    if (delayedCallRef.current) {
      delayedCallRef.current.kill();
    }

    gsap.set(pixels, { display: "none" });

    const totalPixels = pixels.length;
    const staggerDuration = animationStepDuration / totalPixels;

    gsap.to(pixels, {
      display: "block",
      duration: 0,
      stagger: {
        each: staggerDuration,
        from: "random",
      },
    });

    delayedCallRef.current = gsap.delayedCall(animationStepDuration, () => {
      activeEl.style.display = activate ? "block" : "none";
      activeEl.style.pointerEvents = activate ? "none" : "";
    });

    gsap.to(pixels, {
      display: "none",
      duration: 0,
      delay: animationStepDuration,
      stagger: {
        each: staggerDuration,
        from: "random",
      },
    });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (isTouchDevice) return;

    const container = event.currentTarget;
    const rect = container.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;

    const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
    const radius = Math.min(rect.width, rect.height) / 2;

    const isInsideCircle = distanceFromCenter <= radius;

    if (isInsideCircle && !isActive) {
      animatePixels(true);
    } else if (!isInsideCircle && isActive && !once) {
      animatePixels(false);
    }
  };

  const handleMouseLeave = (): void => {
    if (!isTouchDevice && isActive && !once) {
      animatePixels(false);
    }
  };

  const handleClick = (): void => {
    if (!isActive) animatePixels(true);
    else if (isActive && !once) animatePixels(false);
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={isTouchDevice ? handleClick : undefined}
      tabIndex={0}
    >
      <div style={{ paddingTop: aspectRatio }} />

      <div className="absolute inset-0 w-full h-full" aria-hidden={isActive}>
        {firstContent}
      </div>

      <div
        ref={activeRef}
        className="absolute inset-0 w-full h-full z-[2]"
        style={{ display: "none" }}
        aria-hidden={!isActive}
      >
        {secondContent}
      </div>

      <div ref={pixelGridRef} className="absolute inset-0 w-full h-full pointer-events-none z-[3]" />
    </div>
  );
};

interface EmployeeAvatarComponentProps {
  name: string;
  title: string;
  imageSrc?: string;
  imageSeo?: unknown;
  hoverImageSrc?: string;
  hoverImageSeo?: unknown;
}

const EmployeeAvatarComponent = ({ name, title, imageSrc, imageSeo, hoverImageSrc, hoverImageSeo }: EmployeeAvatarComponentProps) => {
  const safeImageSrc = typeof imageSrc === "string" && imageSrc.trim().length > 0 ? imageSrc : null;
  const safeHoverSrc = typeof hoverImageSrc === "string" && hoverImageSrc.trim().length > 0 ? hoverImageSrc : null;

  const hasHoverEffect = !!safeImageSrc && !!safeHoverSrc;

  const baseAvatar = safeImageSrc ? (
    <Image
      src={safeImageSrc}
      seo={imageSeo as any}
      alt={richTextToPlainText(name)}
      width={256}
      height={256}
      className="h-full w-full rounded-full object-cover"
    />
  ) : (
    <span className="text-3xl font-semibold text-[#8C52FF]" aria-hidden>
      {name?.trim()?.charAt(0) || "?"}
    </span>
  );

  const hoverAvatar = safeHoverSrc ? (
    <Image
      src={safeHoverSrc}
      seo={hoverImageSeo as any}
      alt={richTextToPlainText(name)}
      width={256}
      height={256}
      className="h-full w-full rounded-full object-cover"
    />
  ) : (
    baseAvatar
  );

  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#e2d3ff7e] sm:h-55 sm:w-55 overflow-hidden border-2 border-white shadow-sm">
        {hasHoverEffect ? (
          <PixelTransition
            firstContent={baseAvatar}
            secondContent={hoverAvatar}
            className="h-full w-full"
            aspectRatio="100%"
            gridSize={18}
            pixelColor="rgba(255, 255, 255,1)"
            animationStepDuration={0.2}
          />
        ) : (
          baseAvatar
        )}
      </div>
      <RichTextBlock
        as="div"
        content={name}
        defaultTag="p"
        className="mt-4 text-base font-semibold text-[#1E1F21] sm:text-lg"
      />
      <RichTextBlock
        as="div"
        content={title}
        defaultTag="p"
        className="text-sm text-[#667085] sm:text-base"
      />
    </div>
  );
};

export default EmployeeAvatarComponent;
