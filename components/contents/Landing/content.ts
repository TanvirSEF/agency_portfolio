import { ArrowUpRight } from 'lucide-react';

export const heroContent = {
    mainTitle: 'Zephlo Tech',
    subtitle: 'Custom Software & End-to-End Digital Solutions',
    description: {
        desktop:
            "Zephlo Tech is a full-cycle software and digital solutions agency. From custom software and high-performance web development to creative video editing and data-driven marketing, we deliver end-to-end solutions built to scale your business.",
        mobile:
            "Zephlo Tech is a full-cycle software and digital agency delivering custom software, high-performance websites, creative video editing, and data-driven marketing.",
    },
    buttonText: 'START SCALING TODAY',
    images: {
        heroImage1: '/assets/images/hero-software-team-v2.jpg',
        heroImage1Seo: {
            altText: 'Zephlo Tech software engineering and design team collaborating in a modern warm loft office',
            title: 'Zephlo Tech Software Engineering & Design Team',
        },
        heroImage2: '/assets/images/hero-digital-strategy.jpg',
        heroImage2Seo: {
            altText: 'Zephlo Tech digital strategy presentation and software growth analytics display',
            title: 'Zephlo Tech Digital Strategy & Growth Analytics',
        },
        heroAsset: '/assets/images/hero-asset.png',
    },
    heroAsset: {
        width: 783,
        height: 563,
        alt: 'Hero decoration',
    },
    stats: [
        { value: '2020', label: 'Founded' },
        { value: '$1.5M+', label: 'Revenue Generated' },
        { value: '300+', label: 'Happy Clients' },
        { value: '500+', label: 'Projects Completed' },
        { value: '50+', label: 'Team Members' },
        { value: '15+', label: 'Countries Served' },
    ],
};

export const landingLogoScrollerContent = {
    title: 'We Help You Dominate Everywhere From Google To ChatGPT',
    description:
        'We make you visible wherever customers are searching, swiping, scrolling, streaming, and shopping.',
    logoCounts: [1, 2, 3, 4, 5, 4],
};

export const landingAboutContent = {
    leftSection: {
        title: 'About Zephlo Tech',
        subtitle: 'Zephlo Tech is Your Online Growth Partner',
        description:
            "Founded in 2020 in Bangladesh, Zephlo Tech is a fast-growing software and digital agency delivering world-class technology, creative media, and performance marketing to clients worldwide. Over the years, we have empowered hundreds of startups, businesses, and global brands with scalable custom software, high-converting web solutions, and impactful digital campaigns built for real growth.",
        buttonText: 'LEARN MORE ABOUT US',
    },
    rightSection: {
        title: 'How Can We Help You Grow Online?',
        buttonText: 'LEARN MORE ABOUT US',
        backgroundImage: '/assets/images/home-about-bg.png',
        services: [
            { id: 'seo', label: 'SEO' },
            { id: 'social', label: 'Social Media Marketing' },
            { id: 'ads', label: 'Google Ads' },
            { id: 'design', label: 'Web Design' },
            { id: 'development', label: 'Web Development' },
            { id: 'hosting', label: 'Web Hosting' },
            { id: 'app', label: 'App Development' },
            { id: 'uiux', label: 'UI/UX Design' },
            { id: 'graphics', label: 'Graphic & Video' },
        ],
    },
};

export const landingDigitalServicesContent = {
    mainTitle: "Zephlo Tech's Digital Services",
    mainDescription:
        "At Zephlo Tech, we help you establish a strong online presence. Whether you need a fast-loading website or you want it to be ranked on Google, we can help you simultaneously. Here's what we offer:",
    subtitle: 'Complete Digital Marketing Services',
    subtitleDescription:
        'Our digital marketing services make your brand more visible, attract customers, and increase sales. With our help, your brand stays competitive, and your message reaches the right audience every time.',
    // Default service card content paths
    serviceCardContentPath1: 'digitalServiceCard',
    serviceCardContentPath2: 'digitalServiceCard',
};

export const digitalServiceCardContent = {
    services: [
        {
            id: 1,
            icon: ArrowUpRight,
            title: 'SEARCH ENGINE OPTIMIZATION',
            description:
                'Boost your organic visibility and dominate search rankings with data-driven SEO. We optimize technical site health, target high-converting keywords, and build authoritative backlinks to drive consistent, qualified traffic and sustainable growth.',
            iconBg: 'bg-[#06457F]',
            iconColor: 'text-white',
            href: '/services/seo',
        },
        {
            id: 2,
            icon: ArrowUpRight,
            title: 'SOCIAL MEDIA MARKETING',
            description:
                'Amplify your brand presence and connect with your ideal audience across social channels. We craft compelling visual content, viral short-form videos, and strategic organic campaigns that spark engagement, build loyalty, and turn followers into customers.',
            iconBg: 'bg-white',
            iconColor: 'text-[#1E1F21]',
            href: '/services/social-media-marketing-services',
        },
        {
            id: 3,
            icon: ArrowUpRight,
            title: 'GOOGLE ADS SERVICES',
            description:
                'Capture high-intent buyers ready to convert with laser-focused Google Ads campaigns. From high-converting Search ads to Performance Max and retargeting, we optimize every dollar to maximize your ROAS and deliver scalable revenue.',
            iconBg: 'bg-white',
            iconColor: 'text-[#1E1F21]',
            href: '/services/ppc-google-ads-management',
        },
    ],
};

export const digitalServiceCard1Content = {
    services: [
        {
            id: 1,
            icon: ArrowUpRight,
            title: 'SEARCH ENGINE OPTIMIZATION',
            description:
                'Boost your organic visibility and dominate search rankings with data-driven SEO. We optimize technical site health, target high-converting keywords, and build authoritative backlinks to drive consistent, qualified traffic and sustainable growth.',
            iconBg: 'bg-[#06457F]',
            iconColor: 'text-white',
            href: '/services/seo',
        },
        {
            id: 2,
            icon: ArrowUpRight,
            title: 'SOCIAL MEDIA MARKETING',
            description:
                'Amplify your brand presence and connect with your ideal audience across social channels. We craft compelling visual content, viral short-form videos, and strategic organic campaigns that spark engagement, build loyalty, and turn followers into customers.',
            iconBg: 'bg-white',
            iconColor: 'text-[#1E1F21]',
            href: '/services/social-media-marketing-services',
        },
        {
            id: 3,
            icon: ArrowUpRight,
            title: 'GOOGLE ADS SERVICES',
            description:
                'Capture high-intent buyers ready to convert with laser-focused Google Ads campaigns. From high-converting Search ads to Performance Max and retargeting, we optimize every dollar to maximize your ROAS and deliver scalable revenue.',
            iconBg: 'bg-white',
            iconColor: 'text-[#1E1F21]',
            href: '/services/ppc-google-ads-management',
        },
    ],
};

export const customWebDevContent = {
    title: 'Custom Web Development Services',
    description:
        'As an expert web development agency, we build modern websites, apps, and plugins for businesses. We focus on quality, speed, and results, so you get smart solutions and lasting success. From the initial idea to the final launch, we ensure everything meets your needs.',
    curveImage: {
        src: '/curve-asset-ocean.png',
        alt: 'Curve decoration',
        width: 1920,
        height: 200,
    },
    phoneImage: {
        src: '/web-dev-iphone.png',
        alt: 'Web Development Services',
        sizes: '(max-width: 1536px) 350px, 420px',
    },
    services: [
        {
            id: 1,
            title: 'WEB DESIGN',
            description:
                'We create modern, responsive, and user-friendly websites that perfectly represent your brand. Our web design services focus on engagement and conversion to help you make a strong first impression online.',
        },
        {
            id: 2,
            title: 'APP DEVELOPMENT',
            description:
                'Our app development services make your business accessible anywhere. We create fast and reliable mobile apps that focus on user experience. Each app works smoothly on both Android and iOS.',
        },
        {
            id: 3,
            title: 'WEB DEVELOPMENT',
            description:
                'We build secure, fast-loading, and SEO-friendly websites that support your business goals. Our web development services bring your ideas to life with clean code and smooth performance.',
        },
        {
            id: 4,
            title: 'WORDPRESS SITE',
            description:
                "We develop wordpress site that add new features to improve your Business. Our team creates custom, lightweight, and secure site that fit your business needs and platform requirements.",
        },
    ],
};

export const landingAdditionalServicesContent = {
    leftSection: {
        title: "Is Poor Hosting & Slow Speed Costing You Customers and Revenue?",
        paragraphs: [
            "Did you know that even a 2-second delay or sudden server downtime pushes potential customers straight to your competitors? Countless businesses lose high-value leads every single day simply because their site is hosted on the wrong platform or poorly configured servers.",
            "You don't need another generic hosting plan — you need the right architecture. At Zephlo Tech, we provide expert Hosting Consultation to help you select, configure, and optimize the perfect hosting environment tailored to your traffic, security needs, and budget.",
            "From cloud platforms (AWS, Google Cloud, DigitalOcean) and high-speed VPS to CDN caching, SSL hardening, and seamless migrations, we ensure your website stays blazing fast, ultra-secure, and 99.9% online 24/7.",
        ],
        buttonText: 'GET HOSTING CONSULTATION',
        buttonLink: '/domain-hosting',
    },
    rightSection: {
        title: 'Additional Services We Offer',
        quote: '"Zephlo Tech brings every solution you need right under one roof"',
        services: [
            {
                id: 1,
                title: 'GRAPHIC DESIGN SERVICES',
                description:
                    'We add emotion to your images that speak to your customers.',
                link: '/services/graphic-design',
            },
            {
                id: 2,
                title: 'VIDEO EDITING SERVICES',
                description: 'We shape your videos in a way that engages your audiences.',
                link: '/services/video-editing',
            },
            {
                id: 3,
                title: 'UI/UX DESIGN SERVICES',
                description:
                    'We make navigation easy, which makes your visitors into customers.',
                link: '/services/ui-ux-design',
            },
        ],
        buttonText: 'GET A FREE QUOTE',
        buttonLink: '/contact',
    },
};

export const landingMarketingAgencyContent = {
    title: 'Why We Are The Best Web & Digital Marketing Agency',
    description:
        "At Zephlo Tech, we understand customer behaviour, market trends, and the online landscape. As a professional web and digital marketing company, we handle every project with passion, precision, and creativity. Our clear communication and support ensure a smooth, trustworthy, and satisfying experience. We always listen to your needs, plan every step, and deliver reliable solutions. With certified experts, client-focused approaches, and result-driven strategies, we help businesses achieve real digital growth. That's why Zephlo Tech is considered one of the top-rated digital agencies.",
    description2:
        "",
    image: {
        src: '/assets/images/digital-marketing.png',
        alt: 'Digital Marketing Services',
        sizes: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px',
    },
    backgroundImage: '/assets/images/rectangle1.png',
};

export const landingChooseContent = {
    title: 'Why Choose Zephlo Tech',
    subtitle: 'We Provide World-class Web & Digital Marketing Services',
    benefits: [
        {
            title: '7+ Years of Proven Experience',
            description:
                'With over 7 years in the web & digital marketing industry, we have helped many businesses succeed online. Our knowledge ensures your brand shines with consistent results.',
        },
        {
            title: '5-Star Rated Digital Services',
            description:
                'Clients trust us because we deliver quality work every time. Our five-star rating comes from dedication, clear communication, and results that truly matter for every business.',
        },
        {
            title: '24/7 Dedicated Online Support',
            description:
                'We stay connected so you never feel lost. Our support team works around the clock, offering quick help and clear updates whenever you need us most.',
        },
        {
            title: 'Affordable & Transparent Pricing',
            description:
                'We believe in fairness and clarity. Every service comes with honest pricing, no hidden costs, and complete value so you can invest confidently in growth.',
        },
        {
            title: 'Customer-friendly Behavior',
            description:
                'We treat every client as a partner. Our friendly team listens, understands your goals, and guides you patiently from the first step to the final delivery.',
        },
        {
            title: 'Client Satisfaction Guarantee',
            description:
                'Your success is our priority. We refine and adjust until you are fully satisfied. With Zephlo Tech, you get reliability, support, and results you can trust.',
        },
    ],
    buttonText: 'GET STARTED NOW',
    buttonLink: '/contact',
};

export const workProcessSectionContent = {
    subtitle: '',
    title: 'How Zephlo Tech Works',
    description:
        'Our process is designed for transparency, collaboration, and success. We follow a structured approach to ensure every project meets the deadline and delivers measurable results.',
    steps: [
        {
            id: 1,
            title: 'Discovery & Goal Alignment',
            description:
                'We start by listening to your ideas and business goals. This helps us understand your vision, identify your challenges, and make sure every step aligns with your objectives.',
        },
        {
            id: 2,
            title: 'Proposal & Contract Signing',
            description:
                'We prepare a detailed proposal that outlines the project scope, timeline, deliverables, and investment. Once you approve the proposal, we sign a contract that clearly defines expectations, milestones, and terms. This ensures both parties are aligned before we begin work.',
        },
        {
            id: 3,
            title: 'Work Updates & Communication',
            description:
                'Throughout the project, we maintain open and regular communication. You\'ll receive progress updates, see work-in-progress previews, and have opportunities to provide feedback. We use collaborative tools and scheduled check-ins to keep you informed every step of the way.',
        },
        {
            id: 4,
            title: 'Testing, Optimization, & Delivery',
            description:
                'Before final delivery, we thoroughly test all features, functionality, and performance across different devices and browsers. We optimize for speed, user experience, and search engine visibility. Once everything meets our quality standards, we deliver the completed project to you.',
        },
        {
            id: 5,
            title: 'Maintenance & Dedicated Support',
            description:
                'After delivery, we provide ongoing maintenance and dedicated support to keep your project running smoothly. This includes updates, security patches, performance monitoring, and technical assistance. We\'re here to help whenever you need us, ensuring long-term success.',
        },
    ],
};

export const landingCaseStudiesContent = {
    title: 'Our Case Studies',
    subtitle: "We've Helped Businesses in 100+ Different Industries",
    description:
        'As a top-rated marketing & web development firm, we believe results speak louder than promises. Over the past seven years, we have helped over 300 businesses across 100+ different industries.',
    caseStudies: [
        {
            id: 1,
            label: 'Case 1',
            projectName: 'Prime Nest',
            description: 'User-centric website design for mobile wellness services',
            image: '/assets/images/case-study1.png',
        },
        {
            id: 2,
            label: 'Case 2',
            projectName: 'Divine Home',
            description:
                'Brand & web experience for an all-in-one service marketplace',
            image: '/assets/images/case-study2.png',
        },
        {
            id: 3,
            label: 'Case 3',
            projectName: 'Kannom',
            description: 'SaaS Application Design for Location and Review management',
            image: '/assets/images/case-study3.png',
        },
    ],
};

export const landingTestimonialCarouselContent = {
    title: 'What Clients Say About Zephlo Tech',
    subtitle: '"We take care of our clients like family"',
    quoteIcon: '/assets/icons/quote.png',
    testimonials: [
        {
            id: 1,
            text: "Their social media marketing strategy completely revitalized our brand image. We've seen a 200% increase in engagement and a significant boost in qualified leads. The team is responsive, creative, and truly understands our industry.",
            name: 'Artful Dodger',
            title: 'CEO',
            company: 'Innovate Solutions',
            avatar: '/assets/avatars/avatar-1.png',
        },
        {
            id: 2,
            text: "The UX/UI design they delivered was exceptional. Our app's user engagement has increased by 45% since the redesign. What sets them apart is their deep understanding of user behavior and commitment to creating intuitive experiences.",
            name: 'Victoria Wotton',
            title: 'Product Lead',
            company: 'MobileFirst',
            avatar: '/assets/avatars/avatar-2.png',
        },
        {
            id: 3,
            text: 'Working with this team transformed our entire digital presence. The website they designed not only looks stunning but has significantly improved our conversion rates. Their strategic approach and attention to detail exceeded our expectations.',
            name: 'Robert William',
            title: 'Marketing Director',
            company: 'TechCorp',
            avatar: '/assets/avatars/avatar-3.png',
        },
        {
            id: 4,
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
            name: 'Sarah Johnson',
            title: 'Founder',
            company: 'StartupHub',
            avatar: '/assets/avatars/avatar-1.png',
        },
        {
            id: 5,
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
            name: 'Michael Chen',
            title: 'CTO',
            company: 'Digital Ventures',
            avatar: '/assets/avatars/avatar-1.png',
        },
        {
            id: 6,
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
            name: 'Emily Davis',
            title: 'Operations Manager',
            company: 'Growth Labs',
            avatar: '/assets/avatars/avatar-1.png',
        },
    ],
};

export const landingZephloTechUpdatesContent = {
    title: 'Updates From Zephlo Tech',
    updates: [
        {
            id: 1,
            image: '/assets/images/update-card1.jpg',
            title: 'The Future of SEO: Trends to Watch in 2024',
            description:
                "Stay ahead of the competition with the latest SEO trends: from voice search optimization to AI-driven analytics, discover what's shaping the future of search engine optimization.",
        },
        {
            id: 2,
            image: '/assets/images/update-card2.jpg',
            title: 'Creating Engaging Content: Tips for Captivating Your Audience',
            description:
                'Learn how to create content that resonates with your audience and keeps them coming back for more. Discover the secrets to crafting compelling blog posts, videos, and social media updates.',
        },
        {
            id: 3,
            image: '/assets/images/update-card3.jpg',
            title: "Maximizing company's ROI with PPC Campaigns",
            description:
                'Learn how to create content that resonates with your audience and keeps them coming back for more. Discover the secrets to crafting compelling blog posts, videos, and social media updates.',
        },
    ],
    buttonText: 'GET STARTED NOW',
    buttonLink: '/contact',
};

export const landingWebblyMediaUpdatesContent = landingZephloTechUpdatesContent;

export const contactSectionContent = {
    title: 'Rank Higher and Build Your Brand Authority With Zephlo Tech',
    description:
        'Want to improve your SEO ranking? We are here to take on the duty. Contact us today for professional SEO consulting and management services!',
    contactInfo: {
        title: 'Contact Info',
        email: {
            label: 'Email:',
            value: 'info@zephlotech.com',
            href: 'mailto:info@zephlotech.com',
        },
        phone: {
            label: 'Phone:',
            value: '+1-800-123-4567',
            href: 'tel:+1-800-123-4567',
        },
        socialLinks: [
            {
                name: 'Instagram',
                href: 'https://instagram.com',
                ariaLabel: 'Instagram',
            },
            {
                name: 'Facebook',
                href: 'https://www.facebook.com/zephlotech',
                ariaLabel: 'Facebook',
            },
            {
                name: 'Twitter',
                href: 'https://twitter.com',
                ariaLabel: 'Twitter',
            },
            {
                name: 'YouTube',
                href: 'https://youtube.com',
                ariaLabel: 'YouTube',
            },
        ],
    },
};

export const landingFaqContent = {
    title: 'Frequently Asked Questions',
    subtitle:
        'If you have questions about our web and digital marketing services, look at our FAQs. You can learn about our plans.',
    faqs: [
        {
            id: 1,
            question:
                'What Makes Zephlo Tech the Best Web and Digital Marketing Agency?',
            answer:
                'Zephlo Tech stands out for expert service, proven results, and dedicated support. Our creative team combines innovation, strategy, and technology to help businesses grow successfully online.',
        },
        {
            id: 2,
            question: 'Can Zephlo Tech Develop Custom Websites and Apps?',
            answer:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        },
        {
            id: 3,
            question:
                'Does Zephlo Tech Provide Tailored Digital Marketing Strategies?',
            answer:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        },
        {
            id: 4,
            question: 'How Do You Work From Discovery To Project Launch?',
            answer:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        },
        {
            id: 5,
            question: 'How Do You Ensure The Success of Marketing Campaigns?',
            answer:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        },
    ],
};
