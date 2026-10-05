import Link from 'next/link';
import Image from 'next/image';
import {
  Facebook,
  Linkedin,
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const linkClass =
    'text-[13px] font-normal leading-[2.1] text-[#94a3b8] transition-colors hover:text-white';
  const headingClass =
    'mb-4 text-[14px] font-semibold tracking-wide text-white';

  return (
    <footer className="relative mt-auto w-full overflow-hidden bg-[#0f1629]">
      <h2 className="sr-only">Zephlo Tech footer navigation</h2>

      {/* Decorative arc */}
      <div
        className="pointer-events-none absolute -bottom-[280px] -right-[140px] hidden h-[520px] w-[520px] rounded-full border border-[#1e2a45] lg:block"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-[340px] -right-[170px] hidden h-[640px] w-[640px] rounded-full border border-[#1e2a45]/60 lg:block"
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-[1260px] px-6 pb-6 pt-14 sm:px-8 md:pt-16 lg:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:gap-8 lg:gap-0">
          {/* Logo column */}
          <div className="shrink-0 md:w-[200px] lg:w-[240px]">
            <Link href="/">
              <Image
                src="/logo-zephlo-white.png"
                alt="Zephlo Tech Logo"
                width={220}
                height={40}
                className="h-[34px] w-auto object-contain"
              />
            </Link>
          </div>

          {/* Links grid */}
          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-6 lg:gap-10">
            {/* Products / Company */}
            <div>
              <h3 className={headingClass}>Company</h3>
              <ul>
                {[
                  { href: '/domain-hosting', label: 'Hosting Consultation' },
                  { href: '/blogs', label: 'Blogs & Insights' },
                  { href: '/about-us', label: 'About Us' },
                  { href: '/pay-it-forward', label: 'Pay It Forward' },
                  { href: '/privacy-policy', label: 'Privacy Policy' },
                  { href: '/terms-and-conditions', label: 'Terms & Conditions' },
                  { href: '/contact', label: 'Contact Us' },
                ].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our Services */}
            <div>
              <h3 className={headingClass}>Our Services</h3>
              <ul>
                {[
                  { href: '/services/web-development', label: 'Web Development' },
                  { href: '/services/digital-marketing-services', label: 'Digital Marketing' },
                  { href: '/services/social-media-marketing-services', label: 'Social Media Marketing' },
                  { href: '/services/seo', label: 'SEO Consulting' },
                  { href: '/services/web-design', label: 'Web Design' },
                  { href: '/services/app-development', label: 'App Development' },
                ].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className={headingClass}>Contact</h3>
              <ul>
                <li className="flex items-baseline gap-2">
                  <span className="whitespace-nowrap text-[13px] font-normal text-[#94a3b8]">
                    Phone:
                  </span>
                  <Link
                    href="tel:+8801953332460"
                    className={linkClass}
                  >
                    01953332460
                  </Link>
                </li>
                <li className="flex items-baseline gap-2">
                  <span className="whitespace-nowrap text-[13px] font-normal text-[#94a3b8]">
                    Email:
                  </span>
                  <Link
                    href="mailto:info@zephlotech.com"
                    className={linkClass}
                  >
                    info@zephlotech.com
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className={headingClass}>Follow Us</h3>
              <div className="flex items-center gap-3">
                {[
                  { href: 'https://www.facebook.com/zephlotech', icon: Facebook, label: 'Facebook' },
                  {
                    href: 'https://x.com/zephlotech',
                    label: 'X',
                    customIcon: (
                      <svg viewBox="0 0 24 24" className="h-[14px] w-[14px] fill-current">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    ),
                  },
                  { href: 'https://www.linkedin.com/company/zephlo-tech', icon: Linkedin, label: 'LinkedIn' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e2a45] text-[#94a3b8] transition-colors hover:bg-[#2a3a5c] hover:text-white"
                    aria-label={item.label}
                  >
                    {'customIcon' in item ? (
                      item.customIcon
                    ) : (
                      <item.icon className="h-[14px] w-[14px]" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-[#1e2a45]" />

        {/* Copyright */}
        <p className="mt-6 text-center text-[13px] font-normal text-[#94a3b8]/70">
          &copy; {currentYear} Zephlo Tech. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
