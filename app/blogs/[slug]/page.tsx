import { Link } from '@/i18n/routing';
import Image from '@/components/common/SeoImage';
import { notFound } from 'next/navigation';
import { RichTextBlock, RichTextInline, richTextToPlainText } from '@/components/common/RichTextContent';
import { getBlogBySlug, blogPosts, BlogSection } from '../../../lib/blogs-data';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Metadata } from 'next';
import ScrollReveal from '@/components/common/ScrollReveal';
import { getLocale, getTranslations } from 'next-intl/server';
import { getRouteMetadata } from '@/lib/canonical';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

function asNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = richTextToPlainText(value).trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeDescription(value: string): string {
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length <= 160) return normalized;
  return `${normalized.slice(0, 157).trimEnd()}...`;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const t = await getTranslations('blogs');
  const locale = await getLocale();
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  const blogMetaFallback = getRouteMetadata(locale, 'blogs');

  if (!post) return blogMetaFallback;

  const translatedPost = (() => {
    try {
      return (t.raw(`posts.${slug}`) as Record<string, unknown>) ?? {};
    } catch {
      return {} as Record<string, unknown>;
    }
  })();

  const rawTitle = asNonEmptyString(translatedPost.title) ?? asNonEmptyString(post.title) ?? blogMetaFallback.title;
  const title = rawTitle.includes('Webbly Media') ? rawTitle : `${rawTitle} | Webbly Media`;
  const description = normalizeDescription(
    asNonEmptyString(translatedPost.excerpt) ?? asNonEmptyString(post.excerpt) ?? blogMetaFallback.description
  );

  return {
    title,
    description,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const t = await getTranslations('blogs');
  const locale = await getLocale();
  const { slug } = await params;
  const basePost = getBlogBySlug(slug);
  if (!basePost) notFound();

  // Merge translated content onto base post
  const tp: Record<string, any> = (() => { try { return t.raw(`posts.${slug}`) ?? {}; } catch { return {}; } })();
  const post = {
    ...basePost,
    title: tp.title ?? basePost.title,
    excerpt: tp.excerpt ?? basePost.excerpt,
    category: tp.category ?? basePost.category,
    sections: tp.sections ?? basePost.sections,
    image: tp.image ?? basePost.image,
    imageSeo: tp.imageSeo ?? basePost.imageSeo,
    imageGradient: tp.imageGradient ?? basePost.imageGradient,
  };

  return (
    <div className="bg-[#F2F3F6]">
      {/* Hero */}
      <ScrollReveal>
        <div className="relative bg-[#06010E] px-4 py-12 sm:px-6 lg:py-16">
          <div className="container mx-auto max-w-3xl">
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-[#F9F6FF]/85">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-[#F9F6FF] transition-colors hover:bg-white/20"
                style={{ fontFamily: 'var(--font-poppins)', fontWeight: 500 }}
              >
                <ChevronLeft className="h-4 w-4" />
                {t('allBlogs')}
              </Link>
              <span className="text-[#F9F6FF]/40">/</span>
              <span className="truncate" style={{ fontFamily: 'var(--font-poppins)' }}>
                {post.category}
              </span>
            </nav>
            <span
              className="inline-block rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-[#F9F6FF]"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              <RichTextInline content={post.category} />
            </span>
            <time
              className="mt-2 block text-sm text-[#F9F6FF]/80"
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
              defaultTag="h1"
              className="mt-4 font-bold text-white [&_h1]:m-0 [&_h1]:text-[clamp(1.75rem,4vw,2.5rem)] [&_h1]:leading-[1.2] [&_h2]:m-0 [&_h2]:text-[clamp(1.75rem,4vw,2.5rem)] [&_h2]:leading-[1.2] [&_p]:m-0 [&_p]:text-[clamp(1.75rem,4vw,2.5rem)] [&_p]:leading-[1.2]"
              style={{ fontFamily: 'var(--font-poppins)' }}
            />
          </div>
        </div>
      </ScrollReveal>

      {/* Post content */}
      <article className="px-4 py-12 sm:px-6 lg:py-16">
        <div className="container mx-auto max-w-3xl">
          <ScrollReveal>
            {post.image && (
              <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={post.image}
                  seo={post.imageSeo as any}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                  priority
                />
              </div>
            )}
          </ScrollReveal>
          <ScrollReveal delay={0.06}>
            <div style={{ fontFamily: 'var(--font-poppins)' }}>
              {(post.sections && post.sections.length > 0
                ? post.sections
                : [{ heading: '', text: post.excerpt }] as BlogSection[]
              ).map((section: BlogSection, idx: number) => (
                <div key={idx} className="mb-10">
                  {section.heading && (
                    <RichTextBlock
                      as="div"
                      content={section.heading}
                      defaultTag="h2"
                      className="mb-3 font-bold text-[#1E1F21] [&_h1]:m-0 [&_h1]:text-[clamp(1.15rem,2.5vw,1.35rem)] [&_h1]:leading-[1.3] [&_h2]:m-0 [&_h2]:text-[clamp(1.15rem,2.5vw,1.35rem)] [&_h2]:leading-[1.3] [&_h3]:m-0 [&_h3]:text-[clamp(1.15rem,2.5vw,1.35rem)] [&_h3]:leading-[1.3] [&_p]:m-0 [&_p]:text-[clamp(1.15rem,2.5vw,1.35rem)] [&_p]:leading-[1.3]"
                    />
                  )}
                  <RichTextBlock
                    as="div"
                    content={section.text}
                    defaultTag="p"
                    className="mb-10 text-[#667085] [&_p]:m-0 [&_p]:text-[clamp(0.95rem,2vw,1.05rem)] [&_p]:leading-[1.85] [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-[#8C52FF] [&_blockquote]:pl-4"
                  />
                  {idx < (post.sections?.length ?? 1) - 1 && (
                    <hr className="mt-10 border-[#E4E7EC]" />
                  )}
                </div>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <Button
              asChild
              className="rounded-full bg-[#8C52FF] px-8 text-white hover:bg-[#7941E6]"
              style={{ fontFamily: 'var(--font-poppins)', fontWeight: 500 }}
            >
              <Link href="/blogs">
                <RichTextInline content={t('backToBlogs')} />
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </article>
    </div>
  );
}
