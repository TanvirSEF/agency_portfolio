'use client';

import Image from '@/components/common/SeoImage';
import { Button } from './ui/button';
import Link from 'next/link';
import { blogPosts } from '@/lib/blogs-data';
import { useSafeMessages } from './contents/useContent';

function normalizeImageSrc(src: string | undefined): string | undefined {
  if (!src || typeof src !== 'string') return undefined;
  return src.startsWith('/') || src.startsWith('http') ? src : `/${src}`;
}

interface LandingWebblyMediaUpdatesProps {
  title?: string;
  maxPosts?: number;
}

export default function LandingWebblyMediaUpdates({
  title = 'Latest Updates',
  maxPosts = 3,
}: LandingWebblyMediaUpdatesProps) {
  const messages = useSafeMessages();
  const landingMessages = messages?.landing as Record<string, any> | undefined;
  const blogsMessages = messages?.blogs as Record<string, any> | undefined;

  const resolvedTitle = landingMessages?.updates?.title ?? title;
  const readMoreLabel = blogsMessages?.readMore ?? 'Read More';
  const translatedPosts = blogsMessages?.posts ?? {};
  const updateItems = landingMessages?.updates?.updates as Array<{ title?: string; description?: string; image?: string; imageSeo?: unknown }> | undefined;

  const posts = blogPosts.slice(0, maxPosts).map((post, index) => {
    const tp = translatedPosts[post.slug] as Partial<typeof post> | undefined;
    const tinaUpdate = updateItems?.[index];
    const imageFromTina = normalizeImageSrc(tinaUpdate?.image);
    return {
      ...post,
      title: tp?.title ?? tinaUpdate?.title ?? post.title,
      excerpt: tp?.excerpt ?? tinaUpdate?.description ?? post.excerpt,
      category: tp?.category ?? post.category,
      image: imageFromTina ?? post.image,
      imageSeo: (tp as any)?.imageSeo ?? tinaUpdate?.imageSeo ?? post.imageSeo,
    };
  });

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        {resolvedTitle && (
          <h2
            className="mb-12 text-center font-bold text-[#1E1F21]"
            style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)' }}
          >
            {resolvedTitle}
          </h2>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.id} className="overflow-hidden">
              {/* Image */}
              <div className="relative h-56 w-full">
                {post.image ? (
                  <Image
                    src={post.image}
                    seo={post.imageSeo as any}
                    alt={post.title}
                    fill
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div
                    className="h-full w-full rounded-lg"
                    style={{ background: post.imageGradient || 'linear-gradient(135deg, #7936FF 0%, #B189FF 100%)' }}
                  />
                )}
              </div>

              {/* Content */}
              <div>
                <p
                  className="mt-4 mb-1 text-xs font-semibold uppercase tracking-widest text-[#8C52FF]"
                >
                  {post.category}
                </p>
                <h3
                  className="mb-2 min-h-[3.5rem] font-semibold text-[#1E1F21]"
                  style={{ fontSize: 'clamp(1.125rem, 3vw, 1.5rem)' }}
                >
                  {post.title}
                </h3>
                <p
                  className="line-clamp-4 text-[#667085] mb-12"
                  style={{ fontSize: 'clamp(0.95rem, 2vw, 1.125rem)' }}
                >
                  {post.excerpt}
                </p>

                {/* Read More Button */}
                <Button asChild magnetDisabled className="rounded-full bg-[#8C52FF] px-8 py-6 text-white">
                  <Link href={`/blogs/${post.slug}`}>{readMoreLabel}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
