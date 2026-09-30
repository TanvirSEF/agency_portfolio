import type { MetadataRoute } from 'next';
import { blogPosts } from '@/lib/blogs-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zephlotech.com').replace(/\/$/, '');

  const staticRoutes = [
    '',
    '/about-us',
    '/blogs',
    '/contact',
    '/pay-it-forward',
    '/privacy-policy',
    '/terms-and-conditions',
    '/cookie-policy',
    '/domain-hosting',
    '/services/app-development',
    '/services/digital-marketing-services',
    '/services/graphic-design',
    '/services/ppc-google-ads-management',
    '/services/seo',
    '/services/social-media-marketing-services',
    '/services/web-design',
    '/services/web-development',
    '/services/wordpress-development',
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: new Date(post.date || Date.now()),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}
