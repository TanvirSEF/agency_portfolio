import { getCanonicalMetadata } from '@/lib/canonical';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getCanonicalMetadata(locale, 'pay-it-forward');
}

export { default } from '@/app/pay-it-forward/page';
