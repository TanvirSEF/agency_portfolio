import { Link } from '@/i18n/routing';
import Image from '@/components/common/SeoImage';
import { RichTextBlock, RichTextInline } from '@/components/common/RichTextContent';
import { blogPosts, BlogPost } from '../../lib/blogs-data';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';
import ScrollReveal from '@/components/common/ScrollReveal';
import { getLocale, getTranslations } from 'next-intl/server';
import { getRouteMetadata } from '@/lib/canonical';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return getRouteMetadata(locale, 'blogs');
}

export default async function BlogsPage() {
  const t = await getTranslations('blogs');
  const locale = await getLocale();

  // Merge translated content onto base posts
  const translatedPosts: Record<string, any> = (() => { try { return t.raw('posts') ?? {}; } catch { return {}; } })();
  const posts: BlogPost[] = blogPosts.map((post) => {
    const tp = translatedPosts[post.slug];
    if (!tp) return post;
    return {
      ...post,
      title: tp.title ?? post.title,
      excerpt: tp.excerpt ?? post.excerpt,
      category: tp.category ?? post.category,
      sections: tp.sections ?? post.sections,
      image: tp.image ?? post.image,
      imageSeo: tp.imageSeo ?? post.imageSeo,
      imageGradient: tp.imageGradient ?? post.imageGradient,
    };
  });

  return (
    <div className="bg-[#F2F3F6]">
      {/* Hero - matches OtherHero dark style */}
      <ScrollReveal>
        <div className="relative bg-[#06010E] px-4 py-12 sm:px-6 lg:py-16">
          <div className="container mx-auto max-w-4xl text-center">
            <RichTextBlock
              as="div"
              content={t('brand')}
              defaultTag="p"
              className="mb-2 text-2xl font-semibold tracking-widest text-[#F0F5FA] uppercase [&_p]:m-0"
              style={{ fontFamily: 'var(--font-poppins)' }}
            />
            <RichTextBlock
              as="div"
              content={t('title')}
              defaultTag="h1"
              className="mb-4 font-bold text-white uppercase [&_h1]:m-0 [&_h1]:text-[clamp(2rem,5vw,2.7rem)] [&_h1]:leading-[1.2] [&_h2]:m-0 [&_h2]:text-[clamp(2rem,5vw,2.7rem)] [&_h2]:leading-[1.2] [&_p]:m-0 [&_p]:text-[clamp(2rem,5vw,2.7rem)] [&_p]:leading-[1.2]"
              style={{ fontFamily: 'var(--font-poppins)' }}
            />
            <RichTextBlock
              as="div"
              content={t('subtitle')}
              defaultTag="p"
              className="mx-auto max-w-2xl text-[#F0F5FA] [&_p]:m-0 [&_p]:text-[clamp(0.875rem,2vw,1.125rem)] [&_p]:leading-[1.8]"
            />
          </div>
        </div>
      </ScrollReveal>

      {/* Blog grid - matches LandingWebblyMediaUpdates / case studies card style */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <ScrollReveal key={post.id} delay={index * 0.05}>
                <article className="group flex flex-col overflow-hidden rounded-lg border border-transparent bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#06457F]/30 hover:shadow-xl">
                {/* Blog card image */}
                <div className="relative h-56 w-full shrink-0 overflow-hidden rounded-t-lg bg-[#1E1F21]">
                  {post.image ? (
                    <Image
                      src={post.image}
                      seo={post.imageSeo as any}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div
                      className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                      style={{
                        background: post.imageGradient || 'linear-gradient(135deg, #06457F 0%, #00D2FF 100%)',
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />
                  <span
                    className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#1E1F21] transition-all duration-300 group-hover:bg-white group-hover:shadow-sm"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    <RichTextInline content={post.category} />
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <time
                    className="mb-2 text-sm text-[#667085]"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                    dateTime={post.date}
                  >
                    {new Date(post.date).toLocaleDateString(locale === 'sv' ? 'sv-SE' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <RichTextBlock
                    as="div"
                    content={post.title}
                    defaultTag="h2"
                    className="mb-3 font-semibold text-[#1E1F21] transition-colors duration-300 group-hover:text-[#06457F] [&_h1]:m-0 [&_h1]:text-[clamp(1.125rem,3vw,1.5rem)] [&_h1]:leading-[1.3] [&_h2]:m-0 [&_h2]:text-[clamp(1.125rem,3vw,1.5rem)] [&_h2]:leading-[1.3] [&_h3]:m-0 [&_h3]:text-[clamp(1.125rem,3vw,1.5rem)] [&_h3]:leading-[1.3] [&_p]:m-0 [&_p]:text-[clamp(1.125rem,3vw,1.5rem)] [&_p]:leading-[1.3]"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  />
                  <RichTextBlock
                    as="div"
                    content={post.excerpt}
                    defaultTag="p"
                    className="line-clamp-4 mb-6 flex-1 text-[#667085] [&_p]:m-0 [&_p]:text-[clamp(0.95rem,2vw,1.125rem)] [&_p]:leading-[1.7]"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  />

                  <Button
                    magnetDisabled
                    asChild
                    className="w-fit rounded-full bg-[#06457F] px-8 text-white hover:bg-[#0474C4]"
                    style={{ fontFamily: 'var(--font-poppins)', fontWeight: 500 }}
                  >
                    <Link href={`/blogs/${post.slug}`}>
                      <RichTextInline content={t('readMore')} />
                    </Link>
                  </Button>
                </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
