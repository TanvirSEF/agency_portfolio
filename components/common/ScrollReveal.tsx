"use client";

import { ReactNode, useRef, useState, useEffect } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [hasBeenSeen, setHasBeenSeen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (inView) setHasBeenSeen(true);
  }, [inView]);

  useEffect(() => {
    if (!ref.current || isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.18 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isMobile]);

  const visible = hasBeenSeen || inView;

  if (isMobile) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(28px)",
        transition: `opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${visible ? delay : 0}s, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${visible ? delay : 0}s`,
      }}
    >
      {children}
    </div>
  );
}
