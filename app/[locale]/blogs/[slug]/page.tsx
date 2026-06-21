import { getBlogBySlug } from '@/lib/blogs-data';
import { richTextToPlainText } from '@/components/common/RichTextContent';
import { getTranslations } from 'next-intl/server';
import { withCanonical, getRouteMetadata } from '@/lib/canonical';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
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

export { default, generateStaticParams } from '@/app/blogs/[slug]/page';

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations('blogs');
  const post = getBlogBySlug(slug);
  const blogMetaFallback = getRouteMetadata(locale, 'blogs');
  if (!post) {
    return withCanonical(locale, `blogs/${slug}`, blogMetaFallback);
  }

  const translatedPost = (() => {
    try {
      return (t.raw(`posts.${slug}`) as Record<string, unknown>) ?? {};
    } catch {
      return {};
    }
  })();

  const rawTitle = asNonEmptyString(translatedPost.title) ?? asNonEmptyString(post.title) ?? blogMetaFallback.title;
  const title = rawTitle.includes('Webbly Media') ? rawTitle : `${rawTitle} | Webbly Media`;
  const description = normalizeDescription(
    asNonEmptyString(translatedPost.excerpt) ?? asNonEmptyString(post.excerpt) ?? blogMetaFallback.description
  );

  return withCanonical(locale, `blogs/${slug}`, { title, description });
}
