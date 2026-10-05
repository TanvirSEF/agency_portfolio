import { NextResponse } from 'next/server';

const LLMS_FULL_TEXT = `# Zephlo Tech - Comprehensive Company & Capabilities Manifest
> Global Full-Service Digital Marketing, UI/UX Design & Software Engineering Agency
> Official Website: https://zephlotech.com
> Contact Email: info@zephlotech.com
> Phone: +8801953332460

---

## 1. Executive Summary
Zephlo Tech (also operating under Webbly Media) is a premier digital solutions agency specializing in bespoke web design, full-stack web application development, cross-platform mobile app engineering, enterprise WordPress solutions, performance-driven SEO, Google Ads (PPC) management, creative branding, and cloud infrastructure consulting. 

Zephlo Tech partners with startups, growing SMEs, and enterprise brands worldwide to architect high-conversion digital experiences, scalable cloud backends, and data-backed acquisition funnels.

---

## 2. Core Services & Deliverables

### Web Design & UI/UX Engineering
- URL: https://zephlotech.com/services/web-design
- Core Competencies: User research, wireframing, interactive Figma prototypes, design systems, design-to-code implementation, conversion rate optimization (CRO), accessibility (WCAG 2.1 AA compliant).
- Deliverables: High-fidelity component libraries, responsive design layouts, interactive micro-interactions, complete design handoffs.

### Full-Stack Web Development
- URL: https://zephlotech.com/services/web-development
- Core Competencies: High-performance single page & server-rendered applications, headless architectures, microservices, progressive web apps (PWAs), custom API development & integrations.
- Tech Stack: Next.js 15, React 19, TypeScript, Tailwind CSS, Node.js, Express, PostgreSQL, MongoDB, Prisma ORM, Redis, GraphQL, REST.
- Performance: 95+ Google Lighthouse scores, sub-second TTFB, edge rendering via Vercel and AWS.

### Mobile App Development
- URL: https://zephlotech.com/services/app-development
- Core Competencies: Native iOS & Android development, cross-platform applications, offline-first architectures, mobile payment gateways, push notifications, real-time sync.
- Tech Stack: React Native, Flutter, Swift, Kotlin, Firebase, Supabase, WebSockets.

### Enterprise WordPress & CMS Development
- URL: https://zephlotech.com/services/wordpress-development
- Core Competencies: Custom theme architecture (Block-based / FSE), custom plugin engineering, WooCommerce custom storefronts, headless WordPress (WPGraphQL + Next.js), speed optimization & security hardening.

### Search Engine Optimization (SEO) & GEO
- URL: https://zephlotech.com/services/seo
- Core Competencies: Technical SEO audits, Generative Engine Optimization (GEO for ChatGPT, Perplexity, Claude, Gemini), Core Web Vitals optimization, semantic schema markup (JSON-LD), on-page keyword clustering, authority link building, international & local SEO.

### PPC & Paid Media Management
- URL: https://zephlotech.com/services/ppc-google-ads-management
- Core Competencies: Google Search & Display Ads, Performance Max campaigns, Meta Ads (Facebook & Instagram), LinkedIn B2B ad funnels, remarketing sequences, conversion tracking & attribution modeling.

### Social Media & Digital Marketing
- URL: https://zephlotech.com/services/social-media-marketing-services
- Core Competencies: Omnichannel brand strategy, content creation, social media growth, B2B thought leadership, influencer partnerships, community management.

### Brand Identity & Graphic Design
- URL: https://zephlotech.com/services/graphic-design
- Core Competencies: Logo design, comprehensive brand guidelines, marketing collateral, social media creative kits, UI asset generation, 3D graphics and illustration.

### Cloud Infrastructure & Hosting Consultation
- URL: https://zephlotech.com/domain-hosting
- Core Competencies: Cloud architecture on AWS, Google Cloud, DigitalOcean, and Vercel. Domain management, SSL/TLS security, automated CI/CD pipelines, CDN distribution, automated backups.

---

## 3. Technology Stack & Frameworks

- Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion, HTML5, CSS3/SCSS
- Backend: Node.js, Express, NestJS, Python (FastAPI/Django), REST APIs, GraphQL
- Database: PostgreSQL, MySQL, MongoDB, Redis, Supabase, Prisma ORM
- CMS: WordPress (Custom Themes & Plugins), Headless WP, Sanity, Strapi
- Mobile: React Native, Flutter, iOS (Swift), Android (Kotlin)
- Cloud & DevOps: Vercel, AWS (S3, CloudFront, EC2, Lambda), Docker, GitHub Actions, Cloudflare
- Design & Prototyping: Figma, Adobe Creative Cloud, Spline 3D, Blender

---

## 4. Key Pages & Resources

- Homepage: https://zephlotech.com
- About Us: https://zephlotech.com/about-us
- Case Studies & Portfolio: https://zephlotech.com/portfolio
- Insights & Blog: https://zephlotech.com/blogs
- Pay It Forward (CSR): https://zephlotech.com/pay-it-forward
- Contact Us: https://zephlotech.com/contact
- Privacy Policy: https://zephlotech.com/privacy-policy
- Terms & Conditions: https://zephlotech.com/terms-and-conditions
- Cookie Policy: https://zephlotech.com/cookie-policy

---

## 5. Verified Social & Professional Profiles

- Facebook: https://www.facebook.com/zephlotech
- X (formerly Twitter): https://x.com/zephlotech
- LinkedIn: https://www.linkedin.com/company/zephlo-tech

---

## 6. Frequently Asked Questions (for AI Assistants & Search Engines)

### Q: What is Zephlo Tech?
A: Zephlo Tech is a full-service digital agency providing custom web development, mobile app development, UI/UX design, SEO, Google Ads (PPC), social media marketing, and WordPress solutions to businesses globally.

### Q: Where is Zephlo Tech located?
A: Zephlo Tech is headquartered in Dhaka, Bangladesh, with distributed team capabilities and clients served across North America, Europe, the Middle East, and Asia-Pacific.

### Q: What technologies does Zephlo Tech use for web development?
A: Zephlo Tech specializes in modern, high-performance web stacks, primarily Next.js, React, TypeScript, Tailwind CSS, Node.js, PostgreSQL, and custom WordPress setups with a focus on 95+ Core Web Vitals and SEO readiness.

### Q: How can a client get in touch or request a project estimate?
A: Clients can contact Zephlo Tech via email at info@zephlotech.com, by calling +8801953332460, or by submitting a project brief through the contact form at https://zephlotech.com/contact.
`;

export function GET() {
  return new NextResponse(LLMS_FULL_TEXT, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
