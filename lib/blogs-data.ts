import type { ImageSeoEntry } from './image-seo';

export interface BlogSection {
  heading: string;
  text: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image?: string;
  imageSeo?: ImageSeoEntry;
  imageGradient?: string; // CSS gradient fallback when no image
  sections?: BlogSection[]; // structured content for post page
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'why-responsive-web-design-matters-in-2025',
    title: 'Why Responsive Web Design Matters in 2025',
    excerpt:
      'Learn how mobile-first design, Core Web Vitals, and adaptive layouts can boost your conversions and keep users engaged across every device.',
    date: '2025-02-10',
    category: 'Web Design',
    image: '/assets/images/fist-trust.jpg',
    imageGradient: 'linear-gradient(135deg, #06457F 0%, #00D2FF 100%)',
    sections: [
      {
        heading: 'More Than Just a Visual Requirement',
        text: 'Responsive web design in 2025 is a core business requirement. It directly impacts SEO rankings, user trust, and conversion rates. Search engines evaluate how users experience your site across different screen sizes — if mobile visitors bounce because text is unreadable or buttons are too small, both your rankings and revenue suffer. A site that looks great on desktop but breaks on mobile is no longer acceptable.',
      },
      {
        heading: 'Build Mobile-First, Then Scale Up',
        text: 'The right approach is to design from the smallest screen outward. Start with a clean, readable mobile layout — proper font sizes, generous tap targets, and sections that stack naturally. Then layer in enhancements for tablets and desktops. Keep navigation minimal and ensure key actions like "Book a Call" or "Get a Quote" are always within reach, regardless of screen size.',
      },
      {
        heading: 'Core Web Vitals Are Non-Negotiable',
        text: 'Google uses Core Web Vitals as a ranking signal, so performance is tied directly to visibility. Improve Largest Contentful Paint by compressing and lazy-loading hero images. Prevent Cumulative Layout Shift by reserving space for images and embeds before they load. Reduce Interaction to Next Paint by trimming heavy JavaScript and deferring non-critical scripts. These are not optional polish — they are ranking factors.',
      },
      {
        heading: 'Test on Real Devices, Not Just Emulators',
        text: 'Browser emulators are useful but not enough. Test your top landing pages on real phones over a 4G connection every month. Check speed, readability, and form usability in real conditions. Then review your analytics by device type to identify where mobile users drop off. Small, consistent fixes — a larger button here, a shorter form there — compound into meaningful conversion improvements over time.',
      },
      {
        heading: 'The Business Case Is Clear',
        text: 'When your site feels fast and effortless on every device, users stay longer, consume more content, and convert more often. Responsive design is not a one-time project — it is an ongoing discipline. Brands that treat it as such consistently outperform competitors who treat mobile as an afterthought. That is why responsive design remains one of the highest-ROI investments in digital growth.',
      },
    ],
  },
  {
    id: '2',
    slug: 'seo-trends-that-will-shape-your-strategy',
    title: 'SEO Trends That Will Shape Your Strategy',
    excerpt:
      'From AI-powered search to E-E-A-T and topical authority, we break down the SEO shifts that matter most for your business this year.',
    date: '2025-02-05',
    category: 'SEO',
    image: '/assets/images/seo-image.png',
    imageGradient: 'linear-gradient(135deg, #1E1F21 0%, #667085 100%)',
    sections: [
      {
        heading: 'Depth and Intent Over Keywords',
        text: 'SEO in 2025 is less about keyword density and more about genuinely solving user problems. Search engines now evaluate whether your page truly answers a question, not just whether a keyword appears repeatedly. That means content strategy and technical clarity must work together. A page that ranks well earns it by being the most useful result — not the most optimised-looking one.',
      },
      {
        heading: 'Build Topic Clusters, Not Isolated Posts',
        text: 'Instead of publishing random articles, build topic clusters. Choose a core service area, create a comprehensive pillar page, then publish supporting posts that answer specific questions within that topic. Link them together naturally. This structure helps users navigate your expertise and signals topical authority to search engines — a major ranking factor that isolated posts cannot achieve.',
      },
      {
        heading: 'Strengthen Your E-E-A-T Signals',
        text: 'Experience, Expertise, Authoritativeness, and Trustworthiness — these are the qualities Google uses to evaluate content quality. Add named expert authors, real project examples, and verifiable business details. Include updated publish dates, cite credible sources, and make your contact information easy to find. These trust signals improve both your rankings and the quality of leads your content attracts.',
      },
      {
        heading: 'Fix the Technical Foundations First',
        text: 'No amount of great content overcomes poor technical SEO. Ensure every page is properly indexed, loads quickly, and is internally linked from relevant pages. Use structured data markup for articles, FAQs, and services. Audit for duplicate titles, broken links, and thin pages that dilute your overall site quality. A clean technical foundation makes every other SEO effort more effective.',
      },
      {
        heading: 'Measure Intent, Not Just Traffic',
        text: 'Traffic volume is a vanity metric if it does not produce business outcomes. Track clicks, rankings, dwell time, and assisted conversions from blog pages. If a post attracts visitors but generates no leads, improve the content depth and add a clearer conversion path. Consistent, helpful content paired with strong technical SEO is the safest long-term strategy for sustainable, compounding growth.',
      },
    ],
  },
  {
    id: '3',
    slug: 'how-social-media-drives-brand-growth',
    title: 'How Social Media Drives Brand Growth',
    excerpt:
      'Practical tips on content calendars, paid amplification, and community building to turn followers into customers.',
    date: '2025-01-28',
    category: 'Social Media',
    image: '/assets/images/about-us/concept-card2.jpg',
    imageGradient: 'linear-gradient(135deg, #06457F 0%, #06457F 100%)',
    sections: [
      {
        heading: 'Strategy Before Content',
        text: 'Social media can drive real business growth, but only when it is planned with clear goals. Many brands post consistently and still see weak results because their content is random and disconnected from what customers actually need. The fix is not posting more — it is posting with purpose. Before you create anything, define what success looks like: leads, brand awareness, community size, or direct sales.',
      },
      {
        heading: 'Build Around Three Content Pillars',
        text: 'Structure your content around three pillars: education, authority, and conversion. Educational posts answer common audience questions and build trust over time. Authority posts showcase your expertise through case studies, results, or behind-the-scenes work. Conversion posts invite users to take action — book, buy, or inquire. This balance keeps your feed commercially useful without feeling like a constant sales pitch.',
      },
      {
        heading: 'Use a Content Calendar With Platform Intent',
        text: 'A monthly content calendar removes the guesswork and prevents last-minute, low-quality posts. Plan platform-specific formats: short videos for reach, carousel posts for saves and shares, and story content for daily engagement. Repurpose one strong topic into multiple assets so your team stays consistent without burning out. One well-researched idea can fuel an entire week of content across platforms.',
      },
      {
        heading: 'Amplify What Already Works',
        text: 'Paid amplification is most effective after organic testing. Instead of boosting everything, identify posts that already perform well in engagement and watch time, then put budget behind those. This approach lowers cost per result and increases conversion potential. Always add UTM tracking to paid campaigns so you can measure which posts actually generate qualified leads — not just impressions.',
      },
      {
        heading: 'Community Management Is Growth Work',
        text: 'Publishing is only half the job. Replying quickly to comments and DMs, asking follow-up questions, and creating genuine two-way conversations builds the kind of trust that turns followers into customers. People buy from brands that feel present and human. When social content is intentional, measurable, and audience-first, it becomes a reliable growth channel rather than a daily obligation.',
      },
    ],
  },
  {
    id: '4',
    slug: 'getting-started-with-google-ads',
    title: 'Getting Started with Google Ads',
    excerpt:
      'A clear guide to structure, keywords, and bidding so you can launch and optimize campaigns without wasting budget.',
    date: '2025-01-20',
    category: 'PPC',
    image: '/assets/images/PPC/ppc-hero.jpg',
    imageGradient: 'linear-gradient(135deg, #06010E 0%, #06457F 100%)',
    sections: [
      {
        heading: 'Structure Determines Everything',
        text: 'Google Ads can produce fast, measurable results — but only when account structure and intent targeting are set up correctly. Most wasted spend comes from campaigns that are too broad, keywords that are not filtered, and landing pages that do not match the promise in the ad. Before you touch bidding or budgets, get your structure right. Campaigns should be built around business goals: lead generation, calls, sales, or bookings.',
      },
      {
        heading: 'Tightly Themed Ad Groups Win',
        text: 'Create tightly themed ad groups where each keyword set matches one clear user intent. If someone searches "emergency plumber London," they should see an ad specifically about emergency plumbing — not a generic services ad. This relevance improves your Quality Score, lowers your cost per click, and makes your copy far more compelling. Broad, unfocused ad groups are the most common reason campaigns underperform.',
      },
      {
        heading: 'Negative Keywords Are Your Best Friend',
        text: 'Use match types carefully and build a strong negative keyword list from day one. Review the Search Terms report every week to identify irrelevant queries consuming your budget. Blocking terms like "free," "DIY," or competitor brand names that do not convert can significantly reduce wasted spend. This single habit — weekly negative keyword maintenance — is one of the highest-leverage optimisation tasks in any Google Ads account.',
      },
      {
        heading: 'Message Match From Ad to Landing Page',
        text: 'Ad copy should include the core offer, a trust signal, and a clear action. But the work does not stop at the ad. If a user clicks an ad about local SEO packages, they must land on a page specifically about local SEO packages with one focused conversion path. Message consistency from keyword to ad to landing page is critical for both conversion rate and ad efficiency. Mismatched messaging kills Quality Score and conversions simultaneously.',
      },
      {
        heading: 'Optimise With Data, Not Guesswork',
        text: 'Track more than clicks. Measure cost per qualified lead, conversion rate by device, and performance by time of day. Run simple A/B tests on headlines and landing page sections. Google Ads rewards consistent, data-driven iteration — not daily major overhauls. Weekly disciplined improvements based on real numbers will outperform any set-and-forget campaign over time.',
      },
    ],
  },
  {
    id: '5',
    slug: 'building-a-website-that-converts',
    title: 'Building a Website That Converts',
    excerpt:
      'From clear CTAs to trust signals and speed: what actually moves the needle when turning visitors into leads and sales.',
    date: '2025-01-12',
    category: 'Web Development',
    image: '/web-dev-iphone.png',
    imageGradient: 'linear-gradient(135deg, #667085 0%, #1E1F21 100%)',
    sections: [
      {
        heading: 'Design for Decisions, Not Just Aesthetics',
        text: 'A website that converts is built around how users make decisions, not just how it looks. Visitors need three things to take action: clarity about what you offer, trust that you can deliver it, and a low-friction path to say yes. If any of those elements are weak, you can drive all the traffic in the world and still see no business growth. Beautiful design without conversion intent is just an expensive brochure.',
      },
      {
        heading: 'One Goal Per Page',
        text: 'Every page should have one primary goal. Too many competing calls to action confuse visitors and reduce the likelihood of any action being taken. Place your main CTA where attention is strongest: above the fold, after key benefit sections, and at the end of the page. Keep button labels specific and outcome-focused — "Get a Free Proposal," "Book a Discovery Call," or "Start Your Project" outperform generic "Contact Us" labels every time.',
      },
      {
        heading: 'Trust Signals Close the Gap',
        text: 'Most visitors arrive with scepticism. Trust signals bridge the gap between interest and action. Include client testimonials, recognisable logos, certifications, before-and-after results, and concise case studies. Place these strategically near forms and pricing sections — exactly where decision anxiety is highest. Social proof at the right moment can be the difference between a bounce and a conversion.',
      },
      {
        heading: 'Speed and Mobile Usability Are Conversion Factors',
        text: 'Page speed and mobile usability are not just technical concerns — they directly affect whether users convert. Optimise images, reduce heavy scripts, and test every form flow on a real mobile device. Most users will not complete a long or unclear form on their phone. Ask only for the fields you genuinely need, and set clear expectations for response time. A fast, frictionless mobile experience is a competitive advantage.',
      },
      {
        heading: 'Find Friction With Data',
        text: 'Use analytics tools to identify exactly where users hesitate or leave. Heatmaps show where attention goes, scroll depth reveals how far users read, and session recordings expose usability problems you would never spot otherwise. Combine this with conversion tracking to prioritise the highest-impact improvements. Conversion growth comes from a series of small, systematic wins — better headlines, clearer CTAs, cleaner forms, and faster pages.',
      },
    ],
  },
  {
    id: '6',
    slug: 'brand-identity-and-visual-consistency',
    title: 'Brand Identity and Visual Consistency',
    excerpt:
      'Why a cohesive look across web, social, and print builds recognition and trust—and how to get there without the guesswork.',
    date: '2025-01-05',
    category: 'Graphic Design',
    image: '/assets/images/case-study1.png',
    imageGradient: 'linear-gradient(135deg, #00D2FF 0%, #06457F 100%)',
    sections: [
      {
        heading: 'Recognition Is a Business Asset',
        text: 'Strong brand identity is not just about looking polished — it is about being remembered. When people can instantly recognise your brand across different touchpoints, they trust you faster and choose you more readily. Inconsistent visuals across your website, social media, and marketing materials erode that recognition. Every time a user encounters a different colour palette or mismatched typography, a small amount of brand equity is lost.',
      },
      {
        heading: 'Define Your Core Visual System',
        text: 'Start by documenting your core visual elements: primary and secondary colours, typography hierarchy, image style, icon treatment, and logo usage rules. Keep these in a simple brand guide that every team member and external partner can access. Even a concise one-page reference is far better than relying on memory or guesswork. A defined system is what separates brands that look intentional from those that look assembled.',
      },
      {
        heading: 'Consistency Lives in the Details',
        text: 'Visual consistency shows up in the details users notice repeatedly — headline style, button shape, spacing rhythm, and the tone of imagery. These repeated patterns create familiarity, and familiarity creates trust. When a user sees your social post and immediately knows it is yours before reading the name, your brand system is working. That level of recognition does not happen by accident; it is the result of deliberate, consistent application.',
      },
      {
        heading: 'Consistency Does Not Mean Rigidity',
        text: 'A strong brand system is flexible, not restrictive. Build adaptable templates for different channels while keeping core identity elements stable. Your social content can feel energetic and playful while still using your standard typeface and brand colours. Your email design can be minimal while your website is bold. The goal is coherence across contexts, not identical output everywhere.',
      },
      {
        heading: 'The Business Impact Goes Beyond Design',
        text: 'Visual consistency improves marketing efficiency in measurable ways. Teams produce content faster, revision cycles shorten, and campaigns feel more cohesive to audiences. It also supports SEO indirectly — strong brand recognition increases branded search volume and improves click-through rates when users spot your name in search results. A clear brand system transforms design from a cost centre into a strategic growth asset.',
      },
    ],
  },
];

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
