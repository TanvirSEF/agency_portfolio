export function getOrganizationSchema(baseUrl: string) {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '');

  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    '@id': `${normalizedBaseUrl}/#organization`,
    name: 'Zephlo Tech',
    alternateName: ['Zephlo', 'Webbly Media'],
    url: normalizedBaseUrl,
    logo: `${normalizedBaseUrl}/logo-zephlo-white.png`,
    image: `${normalizedBaseUrl}/logo-zephlo-white.png`,
    description:
      'Zephlo Tech is a full-service digital agency specializing in custom web design, full-stack web development, mobile apps, enterprise WordPress, data-driven SEO, Google Ads (PPC), and creative branding.',
    email: 'info@zephlotech.com',
    telephone: '+8801953332460',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dhaka',
      addressCountry: 'BD',
    },
    sameAs: [
      'https://www.facebook.com/zephlotech',
      'https://x.com/zephlotech',
      'https://www.linkedin.com/company/zephlo-tech',
    ],
    knowsAbout: [
      'Web Design',
      'UI/UX Design',
      'Full-Stack Web Development',
      'Next.js',
      'React',
      'TypeScript',
      'Node.js',
      'Mobile App Development',
      'React Native',
      'Flutter',
      'WordPress Development',
      'Search Engine Optimization (SEO)',
      'Generative Engine Optimization (GEO)',
      'PPC Google Ads Management',
      'Social Media Marketing',
      'Graphic Design & Branding',
      'Cloud Hosting Architecture',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Zephlo Tech Digital Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Web Design & UI/UX',
            url: `${normalizedBaseUrl}/services/web-design`,
            description:
              'Conversion-focused UI/UX design, wireframing, Figma design systems, and responsive user interfaces.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Full-Stack Web Development',
            url: `${normalizedBaseUrl}/services/web-development`,
            description:
              'Modern, scalable web applications built with Next.js, React, TypeScript, Node.js, and high-speed APIs.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Mobile App Development',
            url: `${normalizedBaseUrl}/services/app-development`,
            description:
              'Cross-platform iOS and Android applications engineered with React Native and Flutter.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Enterprise WordPress Development',
            url: `${normalizedBaseUrl}/services/wordpress-development`,
            description:
              'Bespoke WordPress theme and plugin development, headless CMS setups, and WooCommerce performance engineering.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Search Engine Optimization (SEO)',
            url: `${normalizedBaseUrl}/services/seo`,
            description:
              'Technical SEO, Core Web Vitals optimization, structured data schemas, and Generative Engine Optimization (GEO).',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'PPC & Google Ads Management',
            url: `${normalizedBaseUrl}/services/ppc-google-ads-management`,
            description:
              'Data-driven Google Search, Display, and Performance Max campaigns managed for measurable ROI.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Social Media Marketing',
            url: `${normalizedBaseUrl}/services/social-media-marketing-services`,
            description:
              'Strategic social media management, organic audience growth, and paid acquisition funnels.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Creative Graphic Design & Branding',
            url: `${normalizedBaseUrl}/services/graphic-design`,
            description:
              'Comprehensive brand identity, logos, vector typography, and digital marketing collateral.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Domain & Hosting Consultation',
            url: `${normalizedBaseUrl}/domain-hosting`,
            description:
              'Cloud server architecture, domain registration, SSL certificates, and enterprise uptime management.',
          },
        },
      ],
    },
  };
}
