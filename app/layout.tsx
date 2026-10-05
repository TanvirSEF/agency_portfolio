import type { Metadata } from 'next';
import { Geist, Geist_Mono, Poppins, DM_Sans, Nunito } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import ClickSparkProvider from '@/components/common/ClickSparkProvider';
import CrispChat from '@/components/CrispChat';
import { getRouteMetadata } from '@/lib/canonical';
import { getImageSeoSchemaGraph } from '@/lib/image-seo.server';
import { getOrganizationSchema } from '@/lib/organization-seo';

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
  const metadata = getRouteMetadata('');
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zephlotech.com')
    .replace(/meida\.com/gi, 'media.com');

  return {
    metadataBase: new URL(baseUrl),
    title: metadata.title,
    description: metadata.description,
    icons: {
      icon: [
        { url: '/assets/icons/favicon.svg', type: 'image/svg+xml' },
        { url: '/assets/icons/favicon.png', type: 'image/png' },
      ],
      shortcut: ['/assets/icons/favicon.svg'],
      apple: ['/assets/icons/favicon.png'],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zephlotech.com').replace(/\/$/, '');
  const organizationSchema = getOrganizationSchema(baseUrl);
  const organizationJsonLd = JSON.stringify(organizationSchema);
  const imageSeoGraph = getImageSeoSchemaGraph(baseUrl, 'en');
  const imageSeoJsonLd = imageSeoGraph.length > 0
    ? JSON.stringify({ '@context': 'https://schema.org', '@graph': imageSeoGraph })
    : null;

  return (
    <html
      lang="en"
      dir="ltr"
      className="notranslate"
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${dmSans.variable} ${nunito.variable} flex min-h-screen flex-col antialiased`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: organizationJsonLd }}
        />
        {imageSeoJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: imageSeoJsonLd }}
          />
        )}
        <Navbar />
        <main className="flex-1">
          <ClickSparkProvider>
            {children}
          </ClickSparkProvider>
        </main>
        <Footer />
        <CrispChat />
      </body>
    </html>
  );
}
