'use client';

import Link from 'next/link';
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  Phone,
} from 'lucide-react';
import ContactForm, { FormLabels } from './contactForm';
import { contactSectionContent as defaultContent } from './contents/Landing/content';
import { useContent, ContentPath } from './contents/useContent';
import Image from '@/components/common/SeoImage';
import { RichTextBlock, RichTextInline } from './common/RichTextContent';

interface ContactSectionProps {
  contentPath?: ContentPath;
  content?: typeof defaultContent;
}

export default function ContactSection({
  contentPath,
  content,
}: ContactSectionProps) {
  const finalContent = useContent(contentPath, content || defaultContent);

  return (
    <div id="contact-section" className="relative overflow-hidden py-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-140px] top-1/2 z-0 h-[650px] w-[500px] -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(4,116,196,0.18)_0%,rgba(6,69,127,0.06)_45%,transparent_70%)] blur-2xl"
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        {(finalContent.title || finalContent.description) && (
          <div className="mb-12 text-center">
            {finalContent.title && (
              <RichTextBlock
                as="div"
                content={finalContent.title}
                defaultTag="h2"
                className="mx-auto mb-8 text-center font-bold text-gray-900 xl:w-[950px]"
                style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)' }}
              />
            )}
            {finalContent.description && (
              <RichTextBlock
                as="div"
                content={finalContent.description}
                defaultTag="p"
                className="mx-auto max-w-2xl text-gray-600"
                style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}
              />
            )}
          </div>
        )}

        {/* Main Content Flex */}
        <div className="flex flex-col justify-center lg:flex-row lg:gap-12 2xl:px-25">
          {/* Contact Info Section - Left Side */}
          <div className="order-2 mt-[2rem] lg:order-1 lg:mt-0 lg:flex-2">
            <RichTextBlock
              as="div"
              content={finalContent.contactInfo.title}
              defaultTag="h3"
              className="mb-6 font-bold text-gray-900"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)' }}
            />

            <div className="space-y-6">
              {/* Email */}
              {finalContent.contactInfo.email?.value && (
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Mail className="h-5 w-5 text-[#06457F]" />
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-semibold text-gray-700 uppercase">
                      <RichTextInline content={finalContent.contactInfo.email.label} />
                    </p>
                    <a
                      href={finalContent.contactInfo.email.href}
                      className="text-[#06457F] transition-colors hover:text-[#262B40]"
                    >
                      {finalContent.contactInfo.email.value}
                    </a>
                  </div>
                </div>
              )}

              {/* Phone */}
              {finalContent.contactInfo.phone?.value && (
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Phone className="h-5 w-5 text-[#06457F]" />
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-semibold text-gray-700 uppercase">
                      <RichTextInline content={finalContent.contactInfo.phone.label} />
                    </p>
                    <a
                      href={finalContent.contactInfo.phone.href}
                      className="text-[#06457F] transition-colors hover:text-[#262B40]"
                    >
                      {finalContent.contactInfo.phone.value}
                    </a>
                  </div>
                </div>
              )}

              {/* Social Media Icons */}
              <div className="pt-4">
                <div className="flex items-center gap-4">
                  {finalContent.contactInfo.socialLinks.map((social) => {
                    const IconComponent =
                      social.name === 'Instagram'
                        ? Instagram
                        : social.name === 'Facebook'
                          ? Facebook
                          : social.name === 'Twitter'
                            ? Twitter
                            : social.name === 'LinkedIn'
                              ? Linkedin
                              : Youtube;
                    return (
                      <Link
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 transition-all hover:bg-[#06457F] hover:text-white"
                        aria-label={social.ariaLabel}
                      >
                        <IconComponent className="h-5 w-5" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Section - Right Side */}
          <div className="order-1 lg:order-2 lg:flex-3">
            <div className="rounded-lg bg-white p-6 shadow-sm md:p-8 relative z-10">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
