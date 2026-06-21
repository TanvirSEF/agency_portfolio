'use client';

import { useLocale } from 'next-intl';
import NotFoundContent from '@/components/NotFoundContent';

export default function LocaleNotFoundWrapper() {
  const locale = useLocale();
  return <NotFoundContent homeHref={`/${locale}`} />;
}
