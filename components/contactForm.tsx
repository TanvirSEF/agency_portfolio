'use client';

import * as React from 'react';
import { Button } from './ui/button';

export interface FormLabels {
  nameLabel?: string;
  firstNamePlaceholder?: string;
  lastNamePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  submitButton?: string;
  sendingButton?: string;
  successMessage?: string;
  errorMessage?: string;
}

const defaultLabels: Required<FormLabels> = {
  nameLabel: 'Name',
  firstNamePlaceholder: 'First Name',
  lastNamePlaceholder: 'Last Name',
  emailLabel: 'Email',
  emailPlaceholder: 'your.email@example.com',
  messageLabel: 'Message',
  messagePlaceholder: 'Your message here...',
  submitButton: 'Submit',
  sendingButton: 'Sending...',
  successMessage: 'Message sent successfully!',
  errorMessage: 'Failed to send. Please try again.',
};

export default function ContactForm({ labels }: { labels?: FormLabels }) {
  const l = { ...defaultLabels, ...labels };
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-resize textarea
    if (name === 'message' && textareaRef.current) {
      const textarea = textareaRef.current;
      // Reset height to get the correct scrollHeight
      textarea.style.height = 'auto';
      // Set max height (approximately 200px, adjust as needed)
      const maxHeight = 200;
      // Set height based on content, but cap at maxHeight
      if (textarea.scrollHeight <= maxHeight) {
        textarea.style.height = `${textarea.scrollHeight}px`;
      } else {
        textarea.style.height = `${maxHeight}px`;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: typeof window !== 'undefined' ? window.location.href : '',
        }),
      });

      if (!res.ok) throw new Error('Failed to send');

      setStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      // Reset status after 4 seconds
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-6">
        {/* Name Fields */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">
            {l.nameLabel}<span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder={l.firstNamePlaceholder}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-[#06457F] focus:outline-none"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder={l.lastNamePlaceholder}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-[#06457F] focus:outline-none"
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">
            {l.emailLabel}<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={l.emailPlaceholder}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-[#06457F] focus:outline-none"
          />
        </div>

        {/* Message Field */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">
            {l.messageLabel}<span className="text-red-500">*</span>
          </label>
          <textarea
            ref={textareaRef}
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={l.messagePlaceholder}
            required
            rows={3}
            style={{ minHeight: '80px', maxHeight: '200px' }}
            className="custom-scrollbar w-full resize-none overflow-y-auto rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-[#06457F] focus:outline-none"
          />
        </div>

        {/* Status Message */}
        {status === 'success' && (
          <p className="text-center text-sm font-medium text-green-600">{l.successMessage}</p>
        )}
        {status === 'error' && (
          <p className="text-center text-sm font-medium text-red-600">{l.errorMessage}</p>
        )}

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            disabled={status === 'loading'}
            className="font-dm-sans h-[45px] w-[300px] rounded-full bg-[#06457F] px-6 text-[16px] font-semibold text-white transition-all duration-300 hover:bg-[#0474C4] hover:shadow-[0_4px_15px_rgba(6, 69, 127,   0.35)] disabled:opacity-60"
          >
            {status === 'loading' ? l.sendingButton : l.submitButton}
          </Button>
        </div>
      </div>
    </form>
  );
}
