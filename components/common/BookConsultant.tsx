"use client";

import { useRef } from "react";
import Image from "@/components/common/SeoImage";
import {
  ParticleCard,
  GlobalSpotlight,
  useMobileDetection,
  DEFAULT_PARTICLE_COUNT,
  DEFAULT_SPOTLIGHT_RADIUS,
  DEFAULT_GLOW_COLOR,
} from "../MagicBento";
import DarkVeil from "../DarkVeil";
import { Button } from "../ui/button";
import Link from "next/link";
import { scrollToContact } from "@/lib/scrollToContact";
import { ContentPath, useContent } from "../contents/useContent";
import { bookConsultantContentPayItForward as defaultContent } from "../contents/pay-it-forward/content";
import { RichTextBlock, RichTextInline } from "./RichTextContent";

interface BookConsultantProps {
  contentPath?: ContentPath;
}

export default function BookConsultant({ contentPath }: BookConsultantProps = {}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  
  // Configuration - optimized for performance
  const glowColor = DEFAULT_GLOW_COLOR;
  const spotlightRadius = isMobile ? 200 : DEFAULT_SPOTLIGHT_RADIUS; // Smaller radius on mobile
  const particleCount = isMobile ? 5 : DEFAULT_PARTICLE_COUNT; // Reduced particles on mobile
  const enableSpotlight = !isMobile; // Disable spotlight on mobile for performance
  const enableStars = true; // Keep stars but with reduced count on mobile
  const disableAnimations = isMobile;

  // Get content
  const content = useContent(contentPath, defaultContent);

  const getImageEntry = (index: number) => {
    const value = content.images?.[index] as any;
    if (!value) return null;
    if (typeof value === "string") return { src: value };
    if (typeof value === "object" && typeof value.src === "string") return value;
    return null;
  };

  const cardStyle = {
    backgroundColor: '#0A192F',
    borderColor: 'rgba(6, 69, 127,    0.2)',
    '--glow-x': '50%',
    '--glow-y': '50%',
    '--glow-intensity': '0',
    '--glow-radius': '200px'
  } as React.CSSProperties;

  // Helper to wrap content in ParticleCard or just div depending on enableStars
  const Wrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const baseClassName = `card relative overflow-hidden transition-colors duration-300 ease-in-out hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] card--border-glow will-change-transform ${className || ''}`;

    if (enableStars) {
        return (
            <ParticleCard
                className={baseClassName}
                style={cardStyle}
                disableAnimations={disableAnimations}
                particleCount={particleCount}
                glowColor={glowColor}
                enableTilt={false}
                clickEffect={!isMobile} // Disable click effect on mobile
                enableMagnetism={!isMobile} // Disable magnetism on mobile
            >
                {children}
            </ParticleCard>
        );
    }
    
    return <div className={baseClassName} style={cardStyle}>{children}</div>;
  };

  return (
    <div className="relative bg-[#0A192F]">
        <div className="absolute inset-0 h-full w-full opacity-40 md:opacity-40">
            <DarkVeil 
              speed={2} 
              warpAmount={2} 
              resolutionScale={isMobile ? 0.5 : 1} // Lower resolution on mobile for performance
            />
        </div>
        <style>
        {`
          .bento-section {
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-intensity: 0;
            --glow-radius: 200px;
            --glow-color: ${glowColor};
            --border-color: rgba(6, 69, 127,    0.2);
            --background-dark: #0A192F;
            --white: hsl(0, 0%, 100%);
            --blue-primary: rgba(6, 69, 127,    1);
            --blue-glow: rgba(6, 69, 127,    0.2);
            --blue-border: rgba(6, 69, 127,    0.8);
          }
          
          .card--border-glow::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 2px; /* Thinner border for images? or keep 6px */
            background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.8)) 0%,
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.4)) 30%,
                transparent 60%);
            border-radius: inherit;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: exclude;
            pointer-events: none;
            opacity: 1;
            transition: opacity 0.3s ease;
            z-index: 10; /* Ensure glow is above image */
          }
        `}
      </style>
        <div className="px-4 py-8 container flex flex-col items-center gap-6 mx-auto lg:px-10">
                <div className="relative flex flex-col items-center gap-4">
                    <RichTextBlock
                      as="div"
                      content={content.title}
                      defaultTag="h2"
                      className="text-white font-bold text-center mx-auto"
                      style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', lineHeight: '1.2' }}
                    />
                    <RichTextBlock
                      as="div"
                      content={content.description}
                      defaultTag="p"
                      className="max-w-[800px] text-[#7a7f8b] my-2 mb-8 mx-auto text-center"
                      style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}
                    />
                    {content.buttonLink === '/contact' ? (
                        <Button onClick={scrollToContact} className="rounded-full bg-[#06457F] px-8 py-6 text-white hover:bg-[#0474C4] transition-colors uppercase">
                            <RichTextInline content={content.buttonText} />
                        </Button>
                    ) : (
                        <Button asChild className="rounded-full bg-[#06457F] px-8 py-6 text-white hover:bg-[#0474C4] transition-colors">
                            <Link href={content.buttonLink} {...(content.buttonLink.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="uppercase">
                              <RichTextInline content={content.buttonText} />
                            </Link>
                        </Button>
                    )}
                </div>

            <div>
            </div>
            
            {enableSpotlight && (
                <GlobalSpotlight
                    gridRef={gridRef}
                    disableAnimations={disableAnimations}
                    enabled={enableSpotlight}
                    spotlightRadius={spotlightRadius}
                    glowColor={glowColor}
                />
            )}

            <div 
                className="w-full bento-section" 
                ref={gridRef}
            >
                 {/* Mobile: 2 images on top, 1 below. Desktop: 3 in a row */}
                 <div className="grid grid-cols-2 lg:flex lg:flex-row h-auto lg:h-[520px] w-full gap-4">
                    {/* First image - top left on mobile, left on desktop */}
                    <Wrapper className="rounded-md h-[200px] md:h-[280px] lg:flex-1 lg:h-auto">
                        <div className="absolute bottom-0 left-0 right-0 h-full w-full duration-300 ease-in-out hover:shadow-[inset_0_0_60px_rgba(0,0,0,1)]" />
                        {(() => {
                          const image = getImageEntry(0);
                          return (
                            <Image
                              src={image?.src || "/assets/images/placeholder.png"}
                              seo={image || undefined}
                              style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)", zIndex: -1 }}
                              alt=""
                              width={500}
                              height={500}
                              aria-hidden="true"
                            />
                          );
                        })()}
                    </Wrapper>
                    
                    {/* Second image - top right on mobile, middle on desktop */}
                    <Wrapper className="rounded-md h-[200px] md:h-[280px] lg:h-[320px] lg:self-end lg:flex-[2]">
                         <div style={{width: '100%', height: '100%'}}>
                            <div className="absolute bottom-0 left-0 right-0 h-full w-full duration-300 ease-in-out hover:shadow-[inset_0_0_60px_rgba(0,0,0,1)]" />
                            {(() => {
                              const image = getImageEntry(1);
                              return (
                                <Image
                                  src={image?.src || "/assets/images/placeholder.png"}
                                  seo={image || undefined}
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                  alt=""
                                  width={500}
                                  height={500}
                                  aria-hidden="true"
                                />
                              );
                            })()}
                         </div>
                    </Wrapper>
                    
                    {/* Third image - full width bottom on mobile, right on desktop */}
                    <Wrapper className="relative rounded-md col-span-2 lg:col-span-1 h-[200px] md:h-[280px] lg:flex-1 lg:h-auto">
                        <div className="absolute bottom-0 left-0 right-0 h-full w-full duration-300 ease-in-out hover:shadow-[inset_0_0_60px_rgba(0,0,0,1)]" />
                        {(() => {
                          const image = getImageEntry(2);
                          return (
                            <Image
                              src={image?.src || "/assets/images/placeholder.png"}
                              seo={image || undefined}
                              style={{ width: "100%", height: "100%", backgroundColor: "#fff", objectFit: "cover" }}
                              alt=""
                              width={500}
                              height={500}
                              aria-hidden="true"
                            />
                          );
                        })()}
                    </Wrapper>
                </div>
            </div>
        </div>
    </div>
  );
}
