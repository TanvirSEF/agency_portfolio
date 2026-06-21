import { getCanonicalMetadata } from '@/lib/canonical';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getCanonicalMetadata(locale, 'services/digital-marketing-services');
}

export { default } from '@/app/services/digital-marketing-services/page';
