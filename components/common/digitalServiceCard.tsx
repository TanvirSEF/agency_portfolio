'use client';

import Link from 'next/link';
import { ArrowUpRight, LucideIcon } from 'lucide-react';
import { RichTextBlock } from './RichTextContent';

interface Service {
  id: number;
  icon?: LucideIcon;
  title: string;
  description: string;
  href?: string;
}

interface DigitalServiceCardProps {
  service: Service;
}

export default function DigitalServiceCard({ service }: DigitalServiceCardProps) {
  const IconComponent = service.icon ?? ArrowUpRight;

  return (
    <div
      className="group relative flex min-h-[max-content] max-w-[320px] xl:max-w-[370px] flex-col justify-between rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#00D2FF] hover:shadow-xl hover:shadow-[#00D2FF]/30"
    >
      {/* Icon */}
      <Link
        href={service.href ?? '#'}
        className="relative mb-10 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-[#E5E7EB] bg-white transition-all duration-300 group-hover:scale-110"
      >
        {/* Water fill animation overlay */}
        <div className="absolute inset-0 origin-bottom scale-y-0 transform rounded-full bg-[#06457F] transition-transform duration-500 ease-out group-hover:scale-y-100"></div>
        {/* Icon with z-index to stay on top */}
        <IconComponent className="relative z-10 h-6 w-6 text-[#1E1F21] transition-colors duration-300 group-hover:text-white" />
      </Link>

      {/* Title */}
      <div>
        <RichTextBlock
          as="div"
          content={service.title}
          defaultTag="h3"
          className="mb-3 w-[200px] leading-relaxed font-semibold text-[#1E1F21] uppercase"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)' }}
        />

        {/* Description */}
        <RichTextBlock
          as="div"
          content={service.description}
          defaultTag="p"
          className="leading-relaxed text-[#667085]"
          style={{ fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)' }}
        />
      </div>

      {/* Hover Effect Overlay */}
    </div>
  );
}

