'use client';

import { useEffect, useState } from 'react';
import Image from '@/components/common/SeoImage';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { useContent, ContentPath } from './contents/useContent';
import { growthPopupContent as defaultGrowthPopupContent } from './contents/growthPopup/content';
import ContactFormModal from './ContactFormModal';
import { RichTextBlock, RichTextInline } from './common/RichTextContent';

const COOKIE_KEY = 'growth-blocking-popup-shown';
const COOLDOWN_SECONDS = 60 * 60;
const SHOW_DELAY_MS = 30 * 1000;

function hasPopupCooldownCookie() {
  if (typeof document === 'undefined') return false;
  return document.cookie
    .split('; ')
    .some((cookie) => cookie.startsWith(`${COOKIE_KEY}=`));
}

function setPopupCooldownCookie(maxAgeSeconds = COOLDOWN_SECONDS) {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE_KEY}=1; max-age=${maxAgeSeconds}; path=/; samesite=lax`;
}

interface GrowthBlockingPopupModalProps {
  open: boolean;
  onClose: () => void;
  /** When provided, the CTA button closes this popup and calls this (e.g. to open contact modal). */
  onBookSlot?: () => void;
  contentPath?: ContentPath;
}

function GrowthBlockingPopupModal({ open, onClose, onBookSlot, contentPath = 'growthPopup' }: GrowthBlockingPopupModalProps) {
  const content = useContent(contentPath, defaultGrowthPopupContent);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 transition-opacity duration-300 ease-out"
      style={{ opacity: entered ? 1 : 0 }}
    >
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden
        onClick={onClose}
      />
      <div
        className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl shadow-xl transition-all duration-300 ease-out sm:flex-row"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? 'scale(1)' : 'scale(0.96)',
        }}
      >
        {/* Gradient background - spans full modal (TinaCMS-controlled) */}
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src={content.backgroundImage || '/assets/images/popup-images/popup-2-gradienat-background.webp'}
            seo={(content as any).backgroundImageSeo}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 1024px"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex w-full flex-col p-6 sm:flex-row sm:p-8 md:p-10">
          {/* Left: text */}
          <div className="flex flex-1 flex-col justify-center pr-0 sm:pr-6 md:pr-10">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30 sm:right-4 sm:top-4"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div
              className="mt-8 max-w-[14ch] font-bold leading-[1.15] text-white sm:mt-0"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.75rem)' }}
            >
              <RichTextBlock as="div" content={content.titleLine1} defaultTag="h2" />
              <RichTextBlock as="div" content={content.titleLine2} defaultTag="h2" />
            </div>
            <RichTextBlock
              as="div"
              content={content.subheading}
              defaultTag="p"
              className="mt-4 font-semibold text-white"
              style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)' }}
            />
            <RichTextBlock
              as="div"
              content={content.description}
              defaultTag="p"
              className="mt-3 mb-6  max-w-md leading-relaxed text-white/95"
              style={{ fontSize: 'clamp(0.875rem, 1.25vw, 1rem)' }}
            />
            <Button
              type="button"
              magnetDisabled
              className="inline-flex w-fit items-center justify-center rounded-full bg-white px-8 py-6 font-bold uppercase tracking-wide text-[#06457F] transition hover:bg-[#06457F] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              style={{ fontSize: 'clamp(0.875rem, 1.25vw, 1rem)' }}
              onClick={() => {
                onClose();
                onBookSlot?.();
              }}
            >
              <RichTextInline content={content.buttonText} />
            </Button>
          </div>

          {/* Right: illustration (TinaCMS-controlled) */}
          <div className="relative mt-8 flex flex-1 items-center justify-center sm:mt-0 sm:min-h-[320px]" aria-hidden="true">
            <Image
              src={content.illustrationImage || '/assets/images/popup-images/popup-2-background-illustration.svg'}
              seo={(content as any).illustrationImageSeo}
              alt=""
              width={480}
              height={400}
              className="h-auto w-full max-w-[420px] object-contain object-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface GrowthBlockingPopupControllerProps {
  contentPath?: ContentPath;
  delayMs?: number;
}

export default function GrowthBlockingPopupController({
  contentPath = 'growthPopup',
  delayMs = SHOW_DELAY_MS,
}: GrowthBlockingPopupControllerProps) {
  const [popupOpen, setPopupOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (!popupOpen) return;
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, [popupOpen]);

  useEffect(() => {
    if (typeof window === 'undefined' || hasTriggered) return;
    if (hasPopupCooldownCookie()) return;

    const timer = window.setTimeout(() => {
      if (hasPopupCooldownCookie()) return;
      setPopupCooldownCookie();
      setPopupOpen(true);
      setHasTriggered(true);
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [hasTriggered, delayMs]);

  return (
    <>
      <GrowthBlockingPopupModal
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        contentPath={contentPath}
        onBookSlot={() => {
          setPopupOpen(false);
          setContactModalOpen(true);
        }}
      />
      <ContactFormModal
        open={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        selectedServices={[]}
        hideSelectedServices
      />
    </>
  );
}
