import type { Metadata } from 'next';
import { Geist, Geist_Mono, Poppins, DM_Sans, Nunito } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import './globals.css';
import ClickSparkProvider from '@/components/common/ClickSparkProvider';
import CrispChat from '@/components/CrispChat';
import GrowthBlockingPopupController from '@/components/GrowthBlockingPopup';
import { getRouteMetadata } from '@/lib/canonical';
import { getImageSeoSchemaGraph } from '@/lib/image-seo.server';

/** Map app locale to full BCP 47 lang attribute for SEO (language-region). */
const localeToLang: Record<string, string> = {
  en: 'en-GB',
  sv: 'sv-SE',
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const metadata = getRouteMetadata(locale, '');
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://webblymedia.com')
    .replace(/meida\.com/gi, 'media.com');

  return {
    metadataBase: new URL(baseUrl),
    title: metadata.title,
    description: metadata.description,
    icons: {
      icon: [{ url: '/assets/icons/favicon.svg', type: 'image/svg+xml' }],
      shortcut: ['/assets/icons/favicon.svg'],
    },
    // Hreflang and canonical are set per-page via getHreflangMetadata in each [locale] page.
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const lang = localeToLang[locale] ?? localeToLang.en;
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://webblymedia.com').replace(/\/$/, '');
  const imageSeoGraph = getImageSeoSchemaGraph(baseUrl, locale);
  const imageSeoJsonLd = imageSeoGraph.length > 0
    ? JSON.stringify({ '@context': 'https://schema.org', '@graph': imageSeoGraph })
    : null;

  return (
    <html
      lang={lang}
      dir="ltr"
      className="notranslate"
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${dmSans.variable} ${nunito.variable} flex min-h-screen flex-col antialiased`}
        suppressHydrationWarning
      >
        {imageSeoJsonLd && (
          <script
            type="application/ld+json"
            // JSON-LD is SEO metadata only; it does not alter visuals.
            dangerouslySetInnerHTML={{ __html: imageSeoJsonLd }}
          />
        )}
        <CrispChat />
        <ClickSparkProvider>
          {children}
          <GrowthBlockingPopupController />
        </ClickSparkProvider>
      </body>
    </html>
  );
}
