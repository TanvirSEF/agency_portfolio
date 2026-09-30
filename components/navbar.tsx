'use client';

import Link from 'next/link';
import Image from '@/components/common/SeoImage';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';

type MotionLikeProps<T> = T & {
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  transition?: unknown;
  whileInView?: unknown;
  viewport?: unknown;
};

function MotionDiv({
  initial: _initial,
  animate: _animate,
  exit: _exit,
  transition: _transition,
  whileInView: _whileInView,
  viewport: _viewport,
  ...props
}: MotionLikeProps<HTMLAttributes<HTMLDivElement>>) {
  return <div {...props} />;
}

function MotionSpan({
  initial: _initial,
  animate: _animate,
  exit: _exit,
  transition: _transition,
  whileInView: _whileInView,
  viewport: _viewport,
  ...props
}: MotionLikeProps<HTMLAttributes<HTMLSpanElement>>) {
  return <span {...props} />;
}

const motion = {
  div: MotionDiv,
  span: MotionSpan,
};

function AnimatePresence({
  children,
  initial: _initial,
}: {
  children: ReactNode;
  initial?: unknown;
}) {
  return <>{children}</>;
}

const services = [
  { label: 'App Development', href: '/services/app-development' },
  { label: 'Digital Marketing Services', href: '/services/digital-marketing-services' },
  { label: 'Graphic Design', href: '/services/graphic-design' },
  { label: 'PPC & Google Ads', href: '/services/ppc-google-ads-management' },
  { label: 'SEO', href: '/services/seo' },
  { label: 'Social Media Marketing', href: '/services/social-media-marketing-services' },
  { label: 'Web Design', href: '/services/web-design' },
  { label: 'Web Development', href: '/services/web-development' },
  { label: 'WordPress Development', href: '/services/wordpress-development' },
];

const NAV_LOCK_EVENT = 'sticky-section-navbar-lock';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [isStickyNavLocked, setIsStickyNavLocked] = useState(false);
  const lastScrollY = useRef(0);

  // Close mobile menu when clicking outside or on link
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Hide navbar on scroll down past 120px, show on scroll up
  useEffect(() => {
    const handleStickyNavLockChange = (event: Event) => {
      const lockEvent = event as CustomEvent<{ locked?: boolean }>;
      const locked = Boolean(lockEvent.detail?.locked);
      setIsStickyNavLocked(locked);
      if (locked) {
        setNavHidden(true);
      }
    };

    window.addEventListener(NAV_LOCK_EVENT, handleStickyNavLockChange as EventListener);
    return () => window.removeEventListener(NAV_LOCK_EVENT, handleStickyNavLockChange as EventListener);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (isStickyNavLocked) {
        setNavHidden(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (currentScrollY > 120 && currentScrollY > lastScrollY.current) {
        setNavHidden(true);
      } else if (currentScrollY < lastScrollY.current) {
        setNavHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isStickyNavLocked]);

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-transform duration-300 ${
        navHidden && !isMobileMenuOpen ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      {/* Upper Navbar - 60px height */}
      <div className="z-50 flex h-[60px] items-center border-b bg-white">
        <div className="container mx-auto flex w-full items-center justify-between px-4 sm:px-6">
          {/* Left: Logo */}
          <div className="flex shrink-0 items-center">
            <Link
              href="/"
              className="flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Image
                src="/logo-zephlo.png"
                alt="Zephlo Tech Logo"
                width={220}
                height={40}
                className="hidden h-[38px] w-auto object-contain md:block"
                priority
              />
              <Image
                src="/logo-zephlo.png"
                alt="Zephlo Tech Logo"
                width={160}
                height={30}
                className="h-[30px] w-auto object-contain md:hidden"
                priority
              />
            </Link>
          </div>

          {/* Right: Desktop CTA */}
          <div className="hidden items-center gap-4 lg:flex xl:gap-6">
            <Button
              asChild
              magnetDisabled
              className="border-0 bg-[#06457F] whitespace-nowrap text-white hover:bg-[#0474C4]"
              style={{
                fontFamily: 'var(--font-poppins)',
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '160%',
              }}
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>

          {/* Mobile Menu Button — animated hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="flex h-5 w-6 flex-col items-center justify-center">
              <motion.span
                className={`block h-[2px] w-full rounded-full bg-[#1E1F21] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isMobileMenuOpen ? 'translate-y-[2px] rotate-45' : '-translate-y-1'
                }`}
                animate={
                  isMobileMenuOpen
                    ? { rotate: 45, y: 0 }
                    : { rotate: 0, y: -4 }
                }
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span
                className={`block h-[2px] w-full rounded-full bg-[#1E1F21] transition-all duration-200 ease-in-out ${
                  isMobileMenuOpen ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'
                }`}
                animate={
                  isMobileMenuOpen
                    ? { opacity: 0, scaleX: 0 }
                    : { opacity: 1, scaleX: 1 }
                }
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              />
              <motion.span
                className={`block h-[2px] w-full rounded-full bg-[#1E1F21] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isMobileMenuOpen ? '-translate-y-[2px] -rotate-45' : 'translate-y-1'
                }`}
                animate={
                  isMobileMenuOpen
                    ? { rotate: -45, y: 0 }
                    : { rotate: 0, y: 4 }
                }
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Lower Navbar - 57px height - Desktop Only */}
      <div className="hidden h-[57px] items-center border-b shadow bg-white lg:flex">
        <div className="container mx-auto flex w-full items-center justify-between px-4 sm:px-6">
          {/* Left: Navigation Links */}
          <div className="flex items-center gap-4 xl:gap-8">
            <div className="group relative flex cursor-pointer items-center gap-1">
              <span
                className="text-sm leading-[160%] font-medium whitespace-nowrap text-[#1E1F21] transition-opacity hover:opacity-80 xl:text-base"
                style={{
                  fontFamily: 'var(--font-poppins)',
                  fontWeight: 500,
                  lineHeight: '160%',
                }}
              >
                Our Services
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-[#1E1F21] transition-opacity group-hover:opacity-80" />
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 z-50 hidden pt-2 group-hover:block w-64">
                <div className="rounded-lg border bg-white p-2 shadow-lg">
                  {services.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      className="block rounded-md px-4 py-2 text-sm text-[#1E1F21] hover:bg-gray-50 hover:text-[#06457F]"
                    >
                      {service.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link
              href="/domain-hosting"
              className="text-sm leading-[160%] font-medium whitespace-nowrap text-[#1E1F21] transition-opacity hover:opacity-80 xl:text-base"
              style={{
                fontFamily: 'var(--font-poppins)',
                fontWeight: 500,
                lineHeight: '160%',
              }}
            >
              Hosting Consultation
            </Link>
            <Link
              href="/pay-it-forward"
              className="text-sm leading-[160%] font-medium whitespace-nowrap text-[#1E1F21] transition-opacity hover:opacity-80 xl:text-base"
              style={{
                fontFamily: 'var(--font-poppins)',
                fontWeight: 500,
                lineHeight: '160%',
              }}
            >
              Pay It Forward
            </Link>
            <Link
              href="/about-us"
              className="text-sm leading-[160%] font-medium whitespace-nowrap text-[#1E1F21] transition-opacity hover:opacity-80 xl:text-base"
              style={{
                fontFamily: 'var(--font-poppins)',
                fontWeight: 500,
                lineHeight: '160%',
              }}
            >
              About Us
            </Link>
            <Link
              href="/blogs"
              className="text-sm leading-[160%] font-medium whitespace-nowrap text-[#1E1F21] transition-opacity hover:opacity-80 xl:text-base"
              style={{
                fontFamily: 'var(--font-poppins)',
                fontWeight: 500,
                lineHeight: '160%',
              }}
            >
              Blogs
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 top-[60px] z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />

            {/* Mobile Menu */}
            <motion.div
              className="fixed inset-x-0 top-[60px] z-50 max-h-[calc(100vh-60px)] overflow-y-auto bg-white shadow-xl lg:hidden"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="container mx-auto px-5 py-6">
                {/* Navigation Links */}
                <nav className="flex flex-col">
                  {/* Services Accordion */}
                  <motion.div
                    className="border-b border-gray-100"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <button
                      className="flex w-full cursor-pointer items-center justify-between py-4"
                      onClick={() => setIsServicesOpen(!isServicesOpen)}
                    >
                      <span
                        className="text-[15px] font-semibold text-[#1E1F21]"
                        style={{ fontFamily: 'var(--font-poppins)' }}
                      >
                        Our Services
                      </span>
                      <motion.div
                        className={isServicesOpen ? 'rotate-180 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]' : 'rotate-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]'}
                        animate={{ rotate: isServicesOpen ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <ChevronDown className="h-5 w-5 text-[#667085]" />
                      </motion.div>
                    </button>

                    {/* Services Dropdown with smooth height animation */}
                    <AnimatePresence initial={false}>
                      {isServicesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-0.5 pb-3 pl-3">
                            {services.map((service, i) => (
                              <motion.div
                                key={service.href}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.03, duration: 0.25, ease: 'easeOut' }}
                              >
                                <Link
                                  href={service.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block rounded-lg px-3 py-2.5 text-sm text-[#475467] transition-colors hover:bg-[#F0F5FA] hover:text-[#06457F]"
                                  style={{ fontFamily: 'var(--font-poppins)' }}
                                >
                                  {service.label}
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Nav Links — staggered */}
                  {[
                    { label: 'Hosting Consultation', href: '/domain-hosting' },
                    { label: 'Pay It Forward', href: '/pay-it-forward' },
                    { label: 'About Us', href: '/about-us' },
                    { label: 'Blogs', href: '/blogs' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.href}
                      className="border-b border-gray-100"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-4 text-[15px] font-semibold text-[#1E1F21] transition-colors hover:text-[#06457F]"
                        style={{ fontFamily: 'var(--font-poppins)' }}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Bottom section */}
                <motion.div
                  className="mt-6 flex flex-col gap-4"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex justify-center">
                    <Button
                      magnetDisabled
                      asChild
                      className="h-12 w-full justify-center border-0 bg-[#06457F] text-base font-semibold text-white hover:bg-[#0474C4]"
                      style={{ fontFamily: 'var(--font-poppins)' }}
                    >
                      <Link
                        href="/contact"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Contact Us
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
