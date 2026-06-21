import { getCanonicalMetadata } from '@/lib/canonical';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getCanonicalMetadata(locale, 'services/social-media-marketing-services');
}

export { default } from '@/app/services/social-media-marketing-services/page';
