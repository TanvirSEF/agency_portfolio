'use client';

import { useState, useEffect } from 'react';
import Image from '@/components/common/SeoImage';
import { X, Check } from 'lucide-react';
import { Button } from './ui/button';
import { useContent, ContentPath } from './contents/useContent';
import { contactModalContent as defaultModalContent } from './contents/contactModal/content';
import { RichTextBlock, RichTextInline } from './common/RichTextContent';

export interface ContactFormModalService {
  id: string;
  label: string;
}

export interface ContactFormModalProps {
  open: boolean;
  onClose: () => void;
  selectedServices: ContactFormModalService[];
  onSubmit?: () => void;
  /** Optional content path (defaults to 'contactModal' for JSON + Tina). */
  contentPath?: ContentPath;
  /** Image path for the left side. Defaults to TinaCMS / content image. */
  imageSrc?: string;
  /** Override image alt (otherwise from content). */
  imageAlt?: string;
  /** Override modal heading (otherwise from content). */
  title?: string;
  /** Override submit button label (otherwise from content). */
  submitButtonText?: string;
  /** Override empty services message (otherwise from content). */
  emptyServicesMessage?: string;
  /** When true, the "Selected services" block is hidden (e.g. when opened from growth popup). */
  hideSelectedServices?: boolean;
}

export default function ContactFormModal({
  open,
  onClose,
  selectedServices,
  onSubmit,
  contentPath = 'contactModal',
  imageSrc,
  imageAlt: imageAltProp,
  title: titleProp,
  submitButtonText: submitButtonTextProp,
  emptyServicesMessage: emptyServicesMessageProp,
  hideSelectedServices = false,
}: ContactFormModalProps) {
  const content = useContent(contentPath, defaultModalContent);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const title = titleProp ?? content.title;
  const nameLabel = content.nameLabel;
  const firstNamePlaceholder = content.firstNamePlaceholder;
  const lastNamePlaceholder = content.lastNamePlaceholder;
  const emailLabel = content.emailLabel;
  const emailPlaceholder = content.emailPlaceholder;
  const messageLabel = content.messageLabel;
  const messagePlaceholder = content.messagePlaceholder;
  const selectedServicesLabel = content.selectedServicesLabel;
  const emptyServicesMessage = emptyServicesMessageProp ?? content.emptyServicesMessage;
  const submitButtonText = submitButtonTextProp ?? content.submitButtonText;
  const imageAlt = imageAltProp ?? content.imageAlt;
  const resolvedImageSrc = imageSrc ?? content.image ?? '/assets/images/popup-images/popup-1-meeting-room.jpg';
  const inlineImageSeo = {
    altText: imageAlt,
    ...(typeof (content as any).imageTitle === 'string' ? { title: (content as any).imageTitle } : {}),
    ...(typeof (content as any).imageCaption === 'string' ? { caption: (content as any).imageCaption } : {}),
    ...(typeof (content as any).imageDescription === 'string' ? { description: (content as any).imageDescription } : {}),
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!open) return;
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
  }, [open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status === 'error') setStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact-modal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          selectedServices: selectedServices.map((s) => s.label),
          source: typeof window !== 'undefined' ? window.location.href : '',
        }),
      });
      if (!res.ok) throw new Error('Failed to send');
      setStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
      onSubmit?.();
    } catch {
      setStatus('error');
    }
  };

  const handleClose = () => {
    if (status === 'loading') return;
    setStatus('idle');
    setFormData({ firstName: '', lastName: '', email: '', message: '' });
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes contactModalScaleIn { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); } } .contact-modal-success-icon { animation: contactModalScaleIn 0.4s ease-out; }`,
        }}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/50"
          aria-hidden
          onClick={handleClose}
        />
        <div className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl sm:flex-row">
          {/* Image: top on mobile, left on desktop */}
          <div className="relative h-40 w-full shrink-0 sm:h-auto sm:min-h-[380px] sm:w-[45%]">
            <Image
              src={resolvedImageSrc}
              seo={inlineImageSeo}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 45vw"
            />
          </div>
          {/* Right: form or success */}
          <div className="flex flex-1 flex-col p-6 sm:p-8">
            <button
              type="button"
              onClick={handleClose}
              disabled={status === 'loading'}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#06457F] text-white transition hover:opacity-90 disabled:opacity-60"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-8 text-center sm:py-12">
                <div className="contact-modal-success-icon flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-white">
                  <Check className="h-10 w-10" strokeWidth={3} />
                </div>
                <p className="mt-6 text-xl font-semibold text-[#1E1F21]">
                  Message sent successfully!
                </p>
                <p className="mt-2 text-sm text-[#667085]">
                  We&apos;ll reach out to you soon.
                </p>
              </div>
            ) : (
              <>
                <RichTextBlock
                  as="div"
                  content={title}
                  defaultTag="h2"
                  className="mb-6 mt-2 pr-12 text-xl font-bold leading-tight text-[#1E1F21] sm:text-2xl"
                />

                <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
                  <div className="mb-6 flex flex-col gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#667085]">
                        <RichTextInline content={nameLabel} />
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder={firstNamePlaceholder}
                          required
                          disabled={status === 'loading'}
                          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-[#1E1F21] placeholder:text-gray-400 focus:border-[#06457F] focus:outline-none focus:ring-1 focus:ring-[#06457F] disabled:opacity-60"
                        />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder={lastNamePlaceholder}
                          required
                          disabled={status === 'loading'}
                          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-[#1E1F21] placeholder:text-gray-400 focus:border-[#06457F] focus:outline-none focus:ring-1 focus:ring-[#06457F] disabled:opacity-60"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#667085]">
                        <RichTextInline content={emailLabel} />
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={emailPlaceholder}
                        required
                        disabled={status === 'loading'}
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-[#1E1F21] placeholder:text-gray-400 focus:border-[#06457F] focus:outline-none focus:ring-1 focus:ring-[#06457F] disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#667085]">
                        <RichTextInline content={messageLabel} />
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={messagePlaceholder}
                        required
                        rows={4}
                        disabled={status === 'loading'}
                        className="w-full resize-y rounded-lg border border-gray-200 px-4 py-3 text-[#1E1F21] placeholder:text-gray-400 focus:border-[#06457F] focus:outline-none focus:ring-1 focus:ring-[#06457F] disabled:opacity-60"
                      />
                    </div>
                    {!hideSelectedServices && (
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-[#667085]">
                        <RichTextInline content={selectedServicesLabel} />
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {selectedServices.map((service) => (
                          <span
                            key={service.id}
                            className="inline-flex rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-[#1E1F21]"
                          >
                            <RichTextInline content={service.label} />
                          </span>
                        ))}
                        {selectedServices.length === 0 && (
                          <span className="text-sm text-[#667085]">
                            <RichTextInline content={emptyServicesMessage} />
                          </span>
                        )}
                      </div>
                    </div>
                    )}
                  </div>

                  {status === 'error' && (
                    <p className="mb-4 text-sm text-red-600">
                      Failed to send. Please try again.
                    </p>
                  )}

                  <div className="w-full">
                    <Button
                      type="submit"
                      magnetDisabled
                      disabled={status === 'loading'}
                      className="font-dm-sans h-[45px] rounded-full bg-[#06457F] px-16 text-[16px] font-semibold text-white transition-all duration-300 hover:bg-[#0474C4] hover:shadow-[0_4px_15px_rgba(6, 69, 127,   0.35)] disabled:opacity-60"
                    >
                      {status === 'loading' ? 'Sending...' : <RichTextInline content={submitButtonText} />}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
