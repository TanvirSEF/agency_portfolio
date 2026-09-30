import { NextResponse } from 'next/server';

const LLMS_TEXT = `# Webbly Media
> Digital Marketing & Web Development Agency

Webbly Media helps brands grow with web design, web development, SEO, PPC, social media, and creative digital marketing built for results.

## Key Services
- Web Design & UI/UX: https://webblymedia.com/services/web-design
- Full-Stack Web Development: https://webblymedia.com/services/web-development
- Mobile App Development: https://webblymedia.com/services/app-development
- WordPress Development: https://webblymedia.com/services/wordpress-development
- Data-Driven SEO: https://webblymedia.com/services/seo
- PPC & Google Ads: https://webblymedia.com/services/ppc-google-ads-management
- Social Media Marketing: https://webblymedia.com/services/social-media-marketing-services
- Creative Graphic Design: https://webblymedia.com/services/graphic-design

## Pages
- About Us: https://webblymedia.com/about-us
- Blog & Insights: https://webblymedia.com/blogs
- Contact: https://webblymedia.com/contact
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
