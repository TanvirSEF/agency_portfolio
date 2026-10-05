import { NextResponse } from 'next/server';

const LLMS_TEXT = `# Zephlo Tech
> Digital Marketing, UI/UX Design & Web Development Agency
> Full documentation: https://zephlotech.com/llms-full.txt

Zephlo Tech helps brands grow with web design, full-stack web development, mobile apps, SEO, PPC, social media, and creative digital marketing built for results.

## Key Services
- Web Design & UI/UX: https://zephlotech.com/services/web-design
- Full-Stack Web Development: https://zephlotech.com/services/web-development
- Mobile App Development: https://zephlotech.com/services/app-development
- WordPress Development: https://zephlotech.com/services/wordpress-development
- Data-Driven SEO: https://zephlotech.com/services/seo
- PPC & Google Ads: https://zephlotech.com/services/ppc-google-ads-management
- Social Media Marketing: https://zephlotech.com/services/social-media-marketing-services
- Creative Graphic Design: https://zephlotech.com/services/graphic-design
- Domain & Hosting Consultation: https://zephlotech.com/domain-hosting

## Key Pages
- About Us: https://zephlotech.com/about-us
- Portfolio: https://zephlotech.com/portfolio
- Blog & Insights: https://zephlotech.com/blogs
- Pay It Forward: https://zephlotech.com/pay-it-forward
- Contact: https://zephlotech.com/contact

## Social Profiles
- Facebook: https://www.facebook.com/zephlotech
- X: https://x.com/zephlotech
- LinkedIn: https://www.linkedin.com/company/zephlo-tech
`;

export function GET() {
  return new NextResponse(LLMS_TEXT, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
