import { getCanonicalMetadata } from '@/lib/canonical';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getCanonicalMetadata(locale, 'services/ppc-google-ads-management');
}

export { default } from '@/app/services/ppc-google-ads-management/page';
