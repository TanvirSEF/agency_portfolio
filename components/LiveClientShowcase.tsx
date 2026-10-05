'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import Image from '@/components/common/SeoImage';
import Magnet from '@/components/Magnet';
import { clientProjects, portfolioCategories, type ClientProject } from '@/lib/portfolio-data';

/** Exactly 3 items visible initially */
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
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white p-3 sm:p-3.5 shadow-sm ring-1 ring-black/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(6,69,127,0.35)]">
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

        {/* Hover overlay - desktop only */}
        <div className="absolute inset-0 hidden sm:flex items-center justify-center bg-[#06457F]/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="translate-y-2 rounded-full bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#06457F] shadow-lg transition-transform duration-300 group-hover:translate-y-0">
            View Live Site
          </span>
        </div>

        {/* Category pill */}
        <span className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3 rounded-full bg-white/95 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-medium text-[#06457F] shadow-sm backdrop-blur-sm">
          {project.categoryLabel}
        </span>
      </a>

      {/* Content */}
      <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-3.5 sm:px-2.5 sm:pb-2.5 sm:pt-4">
        <h3 className="font-semibold leading-snug text-[#1E1F21] transition-colors group-hover:text-[#06457F]">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[1.05rem] sm:text-[1.18rem] hover:underline"
          >
            {project.clientName}
          </a>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs sm:text-[0.9rem] leading-relaxed text-[#667085]">
          {project.description}
        </p>

        {/* Tags */}
        <div className="mb-4 mt-3 flex flex-wrap gap-1.5 sm:gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#F2F3F6] px-2.5 py-0.5 text-[11px] sm:text-xs font-medium text-[#475467]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3 sm:pt-3.5">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-xs sm:text-sm font-medium text-[#475467] hover:text-[#06457F]"
          >
            {getDomain(project.liveUrl)}
          </a>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.clientName}`}
            className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#06457F] text-white transition-all duration-300 hover:bg-[#0474C4] group-hover:rotate-45"
          >
            <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
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
    <section className="w-full py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center gap-2.5 text-center sm:gap-3 lg:mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#06457F]">Our Work</p>
          <h2
            className="font-bold text-[#1E1F21] text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] leading-tight"
          >
            Live Client Projects
          </h2>
          <p
            className="max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed text-[#667085]"
          >
            Real websites and platforms we have designed, built and launched for our clients.
          </p>

          {/* Category Filter: Swipeable on mobile (<sm), centered segmented pill on tablet/desktop */}
          <div className="mt-4 flex w-full max-w-full justify-start overflow-x-auto pb-2 pt-1 sm:justify-center sm:overflow-visible sm:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white p-1.5 shadow-sm ring-1 ring-black/[0.04] sm:flex-wrap sm:justify-center">
              {portfolioCategories.map((cat) => {
                const isActive = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    id={`showcase-filter-${cat.key}`}
                    type="button"
                    onClick={() => handleCategoryChange(cat.key)}
                    className={`cursor-pointer whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200 sm:px-5 sm:py-2 ${
                      isActive
                        ? 'bg-[#06457F] text-white shadow-sm'
                        : 'text-[#475467] hover:text-[#06457F] hover:bg-gray-50'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* First row / initial projects */}
        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {firstProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Remaining (expandable) with buttery-smooth accordion height animation */}
        {hasMore && (
          <motion.div
            initial={false}
            animate={{
              height: isExpanded ? 'auto' : 0,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-5 pt-5 sm:gap-6 sm:pt-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 lg:pt-8">
              {restProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Expand / collapse button */}
      {hasMore && (
        <div className="container mx-auto mt-10 sm:mt-12 flex w-full max-w-2xl items-center gap-3 sm:gap-4 px-4 lg:px-10">
          <hr className="h-px flex-1 border-0 bg-[#06457F]/25" aria-hidden />
          <Magnet padding={40} magnetStrength={4} wrapperClassName="flex items-center justify-center">
            <button
              id="showcase-toggle-more"
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#06457F] shadow-sm ring-1 ring-black/[0.08] transition-all hover:bg-[#F2F3F6] hover:ring-[#06457F]/40 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#06457F]"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Show fewer projects' : `Show all ${filteredProjects.length} projects`}
            >
              <span>
                {isExpanded
                  ? 'Show Fewer'
                  : `View More Projects (${restProjects.length})`}
              </span>
              <ChevronDown
                className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
          </Magnet>
          <hr className="h-px flex-1 border-0 bg-[#06457F]/25" aria-hidden />
        </div>
      )}
    </section>
  );
}
