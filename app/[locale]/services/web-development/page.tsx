import { getCanonicalMetadata } from '@/lib/canonical';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getCanonicalMetadata(locale, 'services/web-development');
}

export { default } from '@/app/services/web-development/page';
