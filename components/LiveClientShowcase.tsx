'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import Image from '@/components/common/SeoImage';
import Magnet from '@/components/Magnet';
import { clientProjects, portfolioCategories, type ClientProject } from '@/lib/portfolio-data';

/** One row on lg (3 cols) visible initially */
const INITIAL_VISIBLE = 3;

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

function ProjectCard({ project }: { project: ClientProject }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(6,69,127,0.35)]">
      {/* Thumbnail */}
      <a
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${project.clientName} live website`}
        className="relative block aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-xl bg-[#F2F3F6]"
      >
        <Image
          src={project.image}
          alt={`${project.title} website screenshot`}
          fill
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-[#06457F]/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="translate-y-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#06457F] transition-transform duration-300 group-hover:translate-y-0">
            View Live Site
          </span>
        </div>

        {/* Category pill */}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-[#06457F] shadow-sm">
          {project.categoryLabel}
        </span>
      </a>

      {/* Content */}
      <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
        <h3
          className="font-semibold leading-snug text-[#1E1F21] transition-colors group-hover:text-[#06457F]"
          style={{ fontSize: 'clamp(1.125rem, 2.2vw, 1.3rem)' }}
        >
          {project.clientName}
        </h3>
        <p className="mt-2 line-clamp-2 text-[0.95rem] leading-relaxed text-[#667085]">
          {project.description}
        </p>

        {/* Tags */}
        <div className="mb-5 mt-4 flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#F2F3F6] px-3 py-1 text-xs font-medium text-[#475467]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="truncate text-sm font-medium text-[#475467]">
            {getDomain(project.liveUrl)}
          </span>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.clientName}`}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#06457F] text-white transition-all duration-300 hover:bg-[#0474C4] group-hover:rotate-45"
          >
            <ArrowUpRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </article>
  );
}

export default function LiveClientShowcase() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return clientProjects;
    return clientProjects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const firstProjects = filteredProjects.slice(0, INITIAL_VISIBLE);
  const restProjects = filteredProjects.slice(INITIAL_VISIBLE);
  const hasMore = filteredProjects.length > INITIAL_VISIBLE;

  const handleCategoryChange = (key: string) => {
    setActiveCategory(key);
    setIsExpanded(false);
  };

  return (
    <section className="w-full py-16 sm:py-20">
      <div className="container mx-auto px-4 lg:px-10">
        {/* Header */}
        <div className="mb-10 flex flex-col items-center gap-3 text-center lg:mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#06457F]">Our Work</p>
          <h2
            className="font-bold text-[#1E1F21]"
            style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', lineHeight: '1.2' }}
          >
            Live Client Projects
          </h2>
          <p
            className="max-w-2xl leading-relaxed text-[#667085]"
            style={{ fontSize: 'clamp(0.95rem, 2vw, 1.125rem)' }}
          >
            Real websites and platforms we have designed, built and launched for our clients.
          </p>

          {/* Category Filter (segmented) */}
          <div className="mt-5 inline-flex max-w-full flex-wrap justify-center gap-1 rounded-full bg-white p-1.5 shadow-sm ring-1 ring-black/[0.04]">
            {portfolioCategories.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  id={`showcase-filter-${cat.key}`}
                  type="button"
                  onClick={() => handleCategoryChange(cat.key)}
                  className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 sm:px-5 ${
                    isActive ? 'bg-[#06457F] text-white' : 'text-[#475467] hover:text-[#06457F]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* First row */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {firstProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Remaining (expandable) */}
        {hasMore && (
          <motion.div
            initial={false}
            animate={{
              maxHeight: isExpanded ? 5000 : 0,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="-mx-2 overflow-hidden px-2"
          >
            <div className="grid grid-cols-1 gap-6 pb-2 pt-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 lg:pt-8">
              {restProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Expand / collapse button (same style as About > Team) */}
      {hasMore && (
        <div className="container mx-auto mt-12 flex w-full max-w-2xl items-center gap-4 px-4 lg:px-10">
          <hr className="h-px flex-1 border-0 bg-[#06457F]/40" aria-hidden />
          <Magnet padding={48} magnetStrength={4} wrapperClassName="flex items-center justify-center">
            <button
              id="showcase-toggle-more"
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#F2F3F6] p-2 text-[#06457F] ring-2 ring-[#06457F]/40 transition-colors hover:bg-[#06457F]/10 hover:ring-[#06457F] focus:outline-none focus:ring-2 focus:ring-[#06457F] focus:ring-offset-2 focus:ring-offset-[#F2F3F6]"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Show fewer projects' : 'Show all projects'}
            >
              <Magnet padding={48} magnetStrength={6} wrapperClassName="flex items-center justify-center">
                <ChevronDown
                  className={`h-6 w-6 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                />
              </Magnet>
            </button>
          </Magnet>
          <hr className="h-px flex-1 border-0 bg-[#06457F]/40" aria-hidden />
        </div>
      )}
    </section>
  );
}
