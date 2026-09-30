'use client';

import Image from '@/components/common/SeoImage';
import { motion } from 'framer-motion';
import ContactSection from '@/components/contactSection';
import LandingFaq from '@/components/landingFaq';
import ScrollReveal from '@/components/common/ScrollReveal';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { scrollToContact } from '@/lib/scrollToContact';

const easeOut = [0.22, 1, 0.36, 1] as const;

const hero = {
  badge: 'Get In Touch',
  title: "Let's Build Something",
  titleHighlight: 'Great Together',
  description: "Have a project in mind or want to learn how Zephlo Tech can grow your brand? Reach out — we'd love to hear from you.",
  buttonText: 'Send Us a Message',
};

const highlights = [
  { title: 'Email Us', description: 'Drop us a line anytime', value: 'info@zephlotech.com', icon: Mail, href: 'mailto:info@zephlotech.com' },
  { title: 'Call Us', description: 'Speak with our team', value: '+1-800-123-4567', icon: Phone, href: 'tel:+18001234567' },
  { title: 'Visit Us', description: 'Come say hello', value: '123 Digital Avenue, Tech City, 10011', icon: MapPin, href: null },
  { title: 'Business Hours', description: 'We are available', value: 'Mon – Fri: 9 AM – 6 PM', icon: Clock, href: null },
];

export default function ContactPage() {
  return (
    <div className="bg-[#F2F3F6]">
      {/* Dark Hero Section */}
      <motion.section
        className="relative overflow-hidden bg-[#06010E]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, ease: easeOut }}
      >
        {/* Background decorative asset */}
        <Image
          src="/assets/images/top-assets.png"
          alt=""
          width={500}
          height={500}
          className="pointer-events-none absolute top-[-100px] right-1/2 z-0 lg:left-[-130px] lg:right-auto"
          style={{ objectFit: 'contain', maxHeight: '120%' }}
          aria-hidden="true"
        />

        {/* Sapphire blue radial glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-[30%] z-0 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12]"
          style={{
            background: 'radial-gradient(circle, #06457F 0%, transparent 70%)',
          }}
        />

        <div className="container relative z-10 mx-auto px-4 pb-20 pt-16 sm:px-6 lg:px-10 lg:pb-28 lg:pt-24">
          {/* Top label */}
          <motion.div
            className="flex justify-center"
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.08, duration: 0.5, ease: easeOut }}
          >
            <span
              className="inline-flex items-center gap-2 rounded-full border border-[#06457F]/30 bg-[#06457F]/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#38BDF8]"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#06457F]" />
              {hero.badge}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="mx-auto mt-8 max-w-4xl text-center font-bold text-white"
            style={{
              fontSize: 'clamp(2.25rem, 6vw, 3.75rem)',
              lineHeight: '1.1',
              fontFamily: 'var(--font-poppins)',
            }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.16, duration: 0.7, ease: easeOut }}
          >
            {hero.title}{' '}
            <span className="bg-gradient-to-r from-[#06457F] to-[#00D2FF] bg-clip-text text-transparent">
              {hero.titleHighlight}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="mx-auto mt-6 max-w-xl text-center leading-relaxed text-[#A0A3B1]"
            style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.125rem)',
              fontFamily: 'var(--font-poppins)',
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.26, duration: 0.55, ease: easeOut }}
          >
            {hero.description}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            className="mt-8 flex justify-center"
            initial={{ y: 14, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            transition={{ delay: 0.34, duration: 0.5, ease: easeOut }}
          >
            <Button
              onClick={scrollToContact}
              className="group h-auto bg-[#06457F] px-8 w-[240px] py-4 text-base font-semibold text-white transition-all hover:bg-[#0474C4] hover:shadow-[0_0_30px_rgba(6, 69, 127,   0.4)]"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              {hero.buttonText}
              <ArrowDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </Button>
          </motion.div>

          {/* Contact Highlight Cards */}
          <h2 className="sr-only">Contact options</h2>
          <motion.div
            className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.44, duration: 0.65, ease: easeOut }}
          >
            {highlights.map((item: any, idx: number) => (
              <motion.div
                key={item.title}
                className="group relative flex flex-col items-center gap-4 rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.06] to-white/[0.02] px-6 py-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#06457F]/30 hover:shadow-[0_8px_32px_rgba(6, 69, 127,   0.12)]"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + idx * 0.08, duration: 0.5, ease: easeOut }}
              >
                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#06457F]/15 ring-1 ring-[#06457F]/20 transition-all duration-300 group-hover:bg-[#06457F]/25 group-hover:ring-[#06457F]/40">
                  <item.icon className="h-6 w-6 text-[#06457F] transition-colors group-hover:text-[#38BDF8]" />
                </div>

                {/* Title */}
                <h3
                  className="text-[15px] font-semibold text-white"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p
                  className="-mt-2 text-xs tracking-wide text-[#667085]"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  {item.description}
                </p>

                {/* Value */}
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-sm font-medium leading-relaxed text-[#38BDF8] transition-colors hover:text-[#06457F]"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    {item.value}
                  </a>
                ) : (
                  <span
                    className="text-sm leading-relaxed text-[#A0A3B1]"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    {item.value}
                  </span>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom curve separator */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 60V30C240 5 480 0 720 10C960 20 1200 45 1440 30V60H0Z"
              fill="#F2F3F6"
            />
          </svg>
        </div>
      </motion.section>

      {/* Contact Form Section */}
      <ScrollReveal>
        <ContactSection contentPath="contactSection" />
      </ScrollReveal>

      {/* FAQ Section */}
      <LandingFaq contentPath="landingFaq" />
    </div>
  );
}
