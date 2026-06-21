"use client";

import { useRef, useState, useEffect, memo } from "react";
import Image from "@/components/common/SeoImage";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

type ThreeImageEntry =
  | string
  | {
      src: string;
      alt?: string;
      altText?: string;
      title?: string;
      caption?: string;
      description?: string;
    };

interface ThreeImageProps {
  imagePaths?: string[];
  imageEntries?: ThreeImageEntry[];
}

function resolveImageEntry(entry?: ThreeImageEntry, fallbackPath?: string): ThreeImageEntry | undefined {
  if (entry) return entry;
  if (typeof fallbackPath === "string" && fallbackPath.length > 0) return fallbackPath;
  return undefined;
}

function getImageSrc(entry?: ThreeImageEntry): string {
  if (!entry) return "";
  return typeof entry === "string" ? entry : entry.src;
}

function ThreeImage({ imagePaths = [], imageEntries = [] }: ThreeImageProps) {
  const [backImage, middleImage, frontImage] = [
    resolveImageEntry(imageEntries[0], imagePaths[0]),
    resolveImageEntry(imageEntries[1], imagePaths[1]),
    resolveImageEntry(imageEntries[2], imagePaths[2]),
  ];
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile for performance optimization with debouncing
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    
    let timeoutId: NodeJS.Timeout;
    const debouncedCheck = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };
    
    window.addEventListener('resize', debouncedCheck);
    return () => {
      window.removeEventListener('resize', debouncedCheck);
      clearTimeout(timeoutId);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Optimized spring config for better performance
  const springConfig = { 
    stiffness: isMobile ? 30 : 50, 
    damping: isMobile ? 40 : 20, 
    bounce: 0 
  };
  
  // Parallax values - completely disabled on mobile for best performance
  const backY = useSpring(
    useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [-50, 50]), 
    springConfig
  );
  const frontY = useSpring(
    useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [40, -40]), 
    springConfig
  );
  const middleY = useSpring(
    useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [-20, 20]), 
    springConfig
  );

  return (
    <div ref={containerRef} className="relative mx-auto flex w-full max-w-[520px] items-center justify-center py-8 sm:py-10">
      <motion.div 
        style={{ y: backY }}
        className="absolute overflow-hidden left-[-20px] top-[-50px] w-[26%] -translate-x-2 z-0 will-change-transform"
      >
        <Image
          src={getImageSrc(backImage)}
          seo={typeof backImage === "object" ? backImage : undefined}
          alt=""
          width={260}
          height={200}
          className="aspect-[167/232] h-auto w-full rounded-md object-cover shadow-[0_20px_40px_rgba(15,23,42,0.2)]"
          sizes="(max-width: 640px) 40vw, 200px"
          loading="lazy"
          aria-hidden="true"
        />
      </motion.div>

      <motion.div 
        style={{ y: middleY }}
        className="relative w-[85%] z-10 will-change-transform"
      >
        <Image
          src={getImageSrc(middleImage)}
          seo={typeof middleImage === "object" ? middleImage : undefined}
          alt=""
          width={520}
          height={340}
          className="aspect-[581/364] h-auto w-full rounded-md object-cover shadow-[0_30px_60px_rgba(15,23,42,0.25)]"
          sizes="(max-width: 640px) 80vw, 420px"
          priority
          aria-hidden="true"
        />
      </motion.div>

      <motion.div 
        style={{ y: frontY }}
        className="absolute bottom-[-15%] right-0 w-[32%] translate-x-2 z-20 will-change-transform"
      >
        <Image
          src={getImageSrc(frontImage)}
          seo={typeof frontImage === "object" ? frontImage : undefined}
          alt=""
          width={200}
          height={200}
          className="aspect-[198/220] h-auto w-full rounded-md object-cover shadow-[0_20px_40px_rgba(15,23,42,0.2)]"
          sizes="(max-width: 640px) 34vw, 180px"
          loading="lazy"
          aria-hidden="true"
        />
      </motion.div>
    </div>
  );
}

export default memo(ThreeImage);
