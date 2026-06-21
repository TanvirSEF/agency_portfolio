import { defineConfig } from 'tinacms';
import { BlockHtmlRichTextField, InlineHtmlRichTextField } from './fields/HtmlRichTextField';

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'main';

const localeMatch = { include: '{en,sv}' } as const;
const readonlyFilename = { filename: { readonly: true } } as const;
const generateEmployeeId = () => `employee-${Math.random().toString(36).slice(2, 12)}`;

const PLAIN_TEXT_NAME_PATTERN =
  /(id|path|slug|url|href|src|alt|sizes|width|height|top|left|value|placeholder|imageGradient|lastModified|changeFrequency|buttonLink|fileUrl|logoDesktop|logoMobile|className)$/i;

function shouldUseRichText(name: string): boolean {
  return !PLAIN_TEXT_NAME_PATTERN.test(name);
}

const f = {
  plainString: (name: string, label: string) => ({ type: 'string' as const, name, label }),
  plainTextarea: (name: string, label: string) => ({ type: 'string' as const, name, label, ui: { component: 'textarea' as const } }),
  string: (name: string, label: string) => ({
    type: 'string' as const,
    name,
    label,
    ...(shouldUseRichText(name) ? { ui: { component: InlineHtmlRichTextField } } : {}),
  }),
  textarea: (name: string, label: string) => ({ type: 'string' as const, name, label, ui: { component: BlockHtmlRichTextField } }),
  stringList: (name: string, label: string) => ({
    type: 'string' as const,
    name,
    label,
    list: true,
    ...(shouldUseRichText(name) ? { ui: { component: InlineHtmlRichTextField } } : {}),
  }),
  textareaList: (name: string, label: string) => ({
    type: 'string' as const,
    name,
    label,
    list: true,
    ui: { component: BlockHtmlRichTextField },
  }),
  object: (name: string, label: string, fields: any[]) => ({ type: 'object' as const, name, label, fields }),
  objectList: (name: string, label: string, fields: any[]) => ({
    type: 'object' as const,
    name,
    label,
    list: true,
    fields,
  }),
  image: (name: string, label: string) => ({ type: 'image' as const, name, label }),
  number: (name: string, label: string) => ({ type: 'number' as const, name, label }),
};

const imageSeoFields = [
  f.plainString('altText', 'Alt Text'),
  f.plainString('title', 'Title'),
  f.plainTextarea('caption', 'Caption'),
  f.plainTextarea('description', 'Description'),
];
const imageAssetSeoFields = [
  f.plainString('alt', 'Alt Text'),
  f.plainString('title', 'Title'),
  f.plainTextarea('caption', 'Caption'),
  f.plainTextarea('description', 'Description'),
];
const standaloneImageWithSeoFields = (
  fieldName: string,
  fieldLabel: string,
  seoFieldName = `${fieldName}Seo`,
  seoFieldLabel = `${fieldLabel} SEO`
) => [f.image(fieldName, fieldLabel), f.object(seoFieldName, seoFieldLabel, imageSeoFields)];
const imageAssetFields = (
  srcName: string,
  srcLabel: string,
  options?: { includeSizes?: boolean; includeDimensions?: boolean }
) => [
  f.image(srcName, srcLabel),
  ...imageAssetSeoFields,
  ...(options?.includeSizes ? [f.string('sizes', 'Sizes Attribute')] : []),
  ...(options?.includeDimensions ? [f.number('width', 'Width'), f.number('height', 'Height')] : []),
];

const titleDescription = [f.string('title', 'Title'), f.textarea('description', 'Description')];
const titleDescriptionImage = [...titleDescription, ...standaloneImageWithSeoFields('image', 'Image', 'imageSeo', 'Image SEO')];
const faqFields = [f.string('question', 'Question'), f.textarea('answer', 'Answer')];
const caseFields = [f.string('label', 'Label'), f.string('projectName', 'Project Name'), f.textarea('description', 'Description')];
const blogSectionFields = [f.string('heading', 'Heading'), f.textarea('text', 'Text')];
const blogPostFields = [
  f.string('title', 'Title'),
  f.textarea('excerpt', 'Excerpt'),
  f.string('category', 'Category'),
  ...standaloneImageWithSeoFields('image', 'Image', 'imageSeo', 'Image SEO'),
  f.string('imageGradient', 'Image Gradient'),
  {
    ...f.plainTextarea('schemaMarkupCode', 'Schema Markup Code (HTML / JSON-LD)'),
    ui: {
      component: 'textarea' as const,
      description: 'Optional. Paste full schema markup HTML (for example, a <script type="application/ld+json"> block) or raw JSON-LD.',
    },
  },
  f.objectList('sections', 'Sections', blogSectionFields),
];
const testimonialFields = [
  f.textarea('text', 'Text'),
  {
    ...f.number('stars', 'Stars'),
  },
  {
    type: 'image',
    name: 'image',
    label: 'Image',
  },
  f.string('name', 'Name'),
  f.string('title', 'Title'),
  f.string('company', 'Company'),
];

const contactInfo = f.object('contactInfo', 'Contact Info', [
  f.string('title', 'Title'),
  f.string('emailLabel', 'Email Label'),
  f.string('emailValue', 'Email Value'),
  f.string('phoneLabel', 'Phone Label'),
  f.string('phoneValue', 'Phone Value'),
]);

const pageMetadataFields = [
  {
    type: 'object' as const,
    name: 'routeSlugs',
    label: 'Route Slugs',
    list: true,
    ui: {
      itemProps: (item: { path?: string; slug?: string }) => ({
        label:
          typeof item?.path === 'string'
            ? `${item.path || '/'} -> ${item?.slug || item.path || '/'}`
            : 'Route Slug Item',
      }),
    },
    fields: [
      f.string('path', 'Canonical Route Path'),
      f.string('slug', 'Localized Slug'),
    ],
  },
  {
    type: 'object' as const,
    name: 'routeMetadata',
    label: 'Route Metadata',
    list: true,
    ui: {
      itemProps: (item: { title?: string; path?: string }) => ({
        label: item?.title || item?.path || 'Route Metadata Item',
      }),
    },
    fields: [
      f.string('path', 'Canonical Route Path'),
      f.string('title', 'Title'),
      f.textarea('description', 'Description'),
      {
        ...f.plainTextarea('schemaMarkupCode', 'Schema Markup Code (HTML / JSON-LD)'),
        ui: {
          component: 'textarea' as const,
          description: 'Optional. Paste full schema markup HTML (for example, a <script type="application/ld+json"> block) or raw JSON-LD for this route.',
        },
      },
    ],
  },
];
const pageMetadataSection = f.object('pageMetadata', 'Page Metadata', pageMetadataFields);

const baseServiceFields = [
  f.object('otherHero', 'Other Hero', [
    f.string('pageName', 'Page Name'),
    f.string('title', 'Title'),
    f.textarea('description', 'Description'),
    f.string('buttonText', 'Button Text'),
    f.object('mainImage', 'Main Image', imageAssetFields('src', 'Image')),
    f.image('floatingImageSrc', 'Floating Image'),
    f.string('floatingImageAlt', 'Floating Image Alt'),
    f.plainString('floatingImageTitle', 'Floating Image Title'),
    f.plainTextarea('floatingImageCaption', 'Floating Image Caption'),
    f.plainTextarea('floatingImageDescription', 'Floating Image Description'),
  ]),
  f.object('companyIntro', 'Company Intro', [
    f.string('brandName', 'Brand Name'),
    f.string('title', 'Title'),
    f.textarea('description', 'Description'),
    f.string('buttonText', 'Button Text'),
    ...standaloneImageWithSeoFields('image1', 'Left Image', 'image1Seo', 'Left Image SEO'),
    ...standaloneImageWithSeoFields('image2', 'Right Image', 'image2Seo', 'Right Image SEO'),
  ]),
  f.object('contentImageSplit', 'Content Image Split', [
    f.string('title', 'Title'),
    f.textareaList('paragraphs', 'Paragraphs'),
    f.object('image', 'Image', imageAssetFields('src', 'Image')),
  ]),
  f.object('digitalServices', 'Digital Services', [
    f.string('mainTitle', 'Main Title'),
    f.textarea('mainDescription', 'Main Description'),
  ]),
  f.object('cardSlider', 'Card Slider', [
    f.string('subtitle', 'Subtitle'),
    f.string('title', 'Title'),
    f.textarea('description', 'Description'),
    f.objectList('cards', 'Cards', titleDescriptionImage),
  ]),
  f.object('caseStudies', 'Case Studies', [
    f.string('title', 'Title'),
    f.string('subtitle', 'Subtitle'),
    f.textarea('description', 'Description'),
    f.objectList('cases', 'Cases', [
      f.string('label', 'Label'),
      f.string('projectName', 'Project Name'),
      f.textarea('description', 'Description'),
      ...standaloneImageWithSeoFields('image', 'Image', 'imageSeo', 'Image SEO'),
    ]),
  ]),
  f.object('testimonials', 'Testimonials', [
    f.string('title', 'Title'),
    f.string('subtitle', 'Subtitle'),
    ...standaloneImageWithSeoFields('quoteIcon', 'Quote Icon', 'quoteIconSeo', 'Quote Icon SEO'),
    f.objectList('testimonials', 'Testimonials', [
      f.textarea('text', 'Text'),
      ...standaloneImageWithSeoFields('avatar', 'Avatar', 'avatarSeo', 'Avatar SEO'),
      f.string('name', 'Name'),
      f.string('title', 'Title'),
      f.string('company', 'Company'),
    ]),
  ]),
  f.object('workProcess', 'Work Process', [
    f.string('subtitle', 'Subtitle'),
    f.string('title', 'Title'),
    f.textarea('description', 'Description'),
    f.objectList('steps', 'Steps', titleDescription),
  ]),
  f.object('whyChooseUs', 'Why Choose Us', [
    f.string('title', 'Title'),
    f.string('subtitle', 'Subtitle'),
    f.objectList('benefits', 'Benefits', titleDescription),
    f.string('buttonText', 'Button Text'),
  ]),
  f.object('partners', 'Partners', [f.string('title', 'Title')]),
  f.object('additionalServices', 'Additional Services', [
    f.object('leftSection', 'Left Section', [
      f.string('title', 'Title'),
      f.textareaList('paragraphs', 'Paragraphs'),
      f.string('buttonText', 'Button Text'),
    ]),
    f.object('rightSection', 'Right Section', [
      f.string('title', 'Title'),
      f.textarea('quote', 'Quote'),
      f.objectList('services', 'Services', titleDescription),
      f.string('buttonText', 'Button Text'),
    ]),
  ]),
  f.object('contact', 'Contact', [f.string('title', 'Title'), f.textarea('description', 'Description'), contactInfo]),
  f.object('faq', 'FAQ', [f.string('title', 'Title'), f.string('subtitle', 'Subtitle'), f.objectList('faqs', 'FAQs', faqFields)]),
];

const collection = (name: string, label: string, path: string, fields: any[], nameOverride?: string, description?: string) => ({
  name,
  ...(nameOverride ? { nameOverride } : {}),
  label,
  path,
  format: 'json' as const,
  match: localeMatch,
  ui: { ...readonlyFilename, ...(description ? { description } : {}) },
  fields,
});

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: 'tina-admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: '',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      {
        name: 'robots_txt',
        label: 'robots.txt',
        path: 'jsonContent/system',
        format: 'json',
        match: { include: 'robots' },
        ui: {
          ...readonlyFilename,
        },
        fields: [
          f.plainTextarea('content', 'Content'),
        ],
      },
      {
        name: 'llms_txt',
        label: 'llms.txt',
        path: 'jsonContent/system',
        format: 'json',
        match: { include: 'llms' },
        ui: {
          ...readonlyFilename,
        },
        fields: [
          f.plainTextarea('content', 'Content'),
        ],
      },
      collection(
        'sitemap_xml',
        'sitemap.xml',
        'jsonContent/system/sitemap',
        [
          {
            type: 'object',
            name: 'links',
            label: 'Links',
            list: true,
            ui: {
              itemProps: (item: { url?: string }) => ({
                label: item?.url || 'Sitemap Link',
              }),
            },
            fields: [
              f.string('url', 'URL or Path'),
              f.string('lastModified', 'Last Modified (optional)'),
              f.string('changeFrequency', 'Change Frequency (optional)'),
              {
                type: 'number',
                name: 'priority',
                label: 'Priority (optional)',
              },
            ],
          } as any,
        ],
        undefined,
        'Locale sitemap entries. en.json powers /en/sitemap.xml and sv.json powers /sv/sitemap.xml.'
      ),
      collection('navbar', 'Navbar', 'jsonContent/navbar', [
        f.string('languageShort', 'Language Short'),
        f.string('contactUs', 'Contact Us'),
        f.string('ourServices', 'Our Services'),
        f.string('domainHosting', 'Domain Hosting'),
        f.string('payItForward', 'Pay It Forward'),
        f.string('aboutUs', 'About Us'),
        f.string('blogs', 'Blogs'),
        f.string('language', 'Language'),
        f.string('languageEnglish', 'Language English'),
        f.string('languageSwedish', 'Language Swedish'),
        f.image('logoDesktop', 'Logo (Desktop)'),
        f.object('logoDesktopSeo', 'Logo (Desktop) SEO', imageSeoFields),
        f.image('logoMobile', 'Logo (Mobile)'),
        f.object('logoMobileSeo', 'Logo (Mobile) SEO', imageSeoFields),
        f.object('services', 'Services', [
          f.string('appDevelopment', 'App Development'),
          f.string('digitalMarketing', 'Digital Marketing'),
          f.string('graphicDesign', 'Graphic Design'),
          f.string('ppcGoogleAds', 'PPC Google Ads'),
          f.string('seo', 'SEO'),
          f.string('socialMediaMarketing', 'Social Media Marketing'),
          f.string('webDesign', 'Web Design'),
          f.string('webDevelopment', 'Web Development'),
          f.string('wordpressDevelopment', 'WordPress Development'),
        ]),
      ]),
      collection('footer', 'Footer', 'jsonContent/footer', [
        f.string('products', 'Products'),
        f.string('ourServices', 'Our Services'),
        f.string('contactInformation', 'Contact Information'),
        f.string('quickLinks', 'Quick Links'),
        f.string('domainHosting', 'Domain Hosting'),
        f.string('aboutUs', 'About Us'),
        f.string('blogs', 'Blogs'),
        f.string('payItForward', 'Pay It Forward'),
        f.string('webDevelopment', 'Web Development'),
        f.string('webDesign', 'Web Design'),
        f.string('appDevelopment', 'App Development'),
        f.string('digitalMarketing', 'Digital Marketing'),
        f.string('seo', 'SEO'),
        f.string('socialMediaMarketing', 'Social Media Marketing'),
        f.string('ppcGoogleAds', 'PPC Google Ads'),
        f.string('graphicDesign', 'Graphic Design'),
        f.string('wordpressDevelopment', 'WordPress Development'),
        f.string('address', 'Address'),
        f.string('home', 'Home'),
        f.string('copyright', 'Copyright'),
        f.string('privacyPolicy', 'Privacy Policy'),
        f.string('termsAndConditions', 'Terms and Conditions'),
        f.string('cookiePolicy', 'Cookie Policy'),
        f.string('companyName', 'Company Name'),
        f.string('email', 'Email'),
        f.string('phone', 'Phone'),
      ]),
      collection('landing', 'Landing', 'jsonContent/landing', [
        pageMetadataSection,
        f.object('hero', 'Hero', [
          f.string('mainTitle', 'Main Title'),
          f.string('subtitle', 'Subtitle'),
          f.object('description', 'Description', [f.textarea('desktop', 'Desktop'), f.textarea('mobile', 'Mobile')]),
          f.string('buttonText', 'Button Text'),
          f.object('images', 'Images', [
            ...standaloneImageWithSeoFields('heroImage1', 'Hero Image 1', 'heroImage1Seo', 'Hero Image 1 SEO'),
            ...standaloneImageWithSeoFields('heroImage2', 'Hero Image 2', 'heroImage2Seo', 'Hero Image 2 SEO'),
            f.image('heroAsset', 'Hero Asset Image'),
          ]),
          f.object('heroAsset', 'Hero Asset Meta', [
            f.string('alt', 'Alt Text'),
            f.plainString('title', 'Title'),
            f.plainTextarea('caption', 'Caption'),
            f.plainTextarea('description', 'Description'),
            f.number('width', 'Width'),
            f.number('height', 'Height'),
          ]),
        ]),
        f.object('about', 'About', [
          f.object('leftSection', 'Left Section', [f.string('title', 'Title'), f.string('subtitle', 'Subtitle'), f.textarea('description', 'Description'), f.string('buttonText', 'Button Text')]),
          f.object('rightSection', 'Right Section', [
            f.string('title', 'Title'),
            f.string('buttonText', 'Button Text'),
            ...standaloneImageWithSeoFields('backgroundImage', 'Background Image', 'backgroundImageSeo', 'Background Image SEO'),
            f.objectList('services', 'Services', [f.string('id', 'Id'), f.string('label', 'Label')]),
          ]),
        ]),
        f.object('digitalServices', 'Digital Services', [f.string('mainTitle', 'Main Title'), f.textarea('mainDescription', 'Main Description')]),
        f.objectList('serviceCards', 'Service Cards', titleDescription),
        f.object('customWebDev', 'Custom Web Dev', [
          f.string('title', 'Title'),
          f.textarea('description', 'Description'),
          f.object('curveImage', 'Curve Image', imageAssetFields('src', 'Image', { includeDimensions: true })),
          f.object('phoneImage', 'Phone Image', imageAssetFields('src', 'Image', { includeSizes: true })),
          f.objectList('services', 'Services', titleDescription),
        ]),
        f.object('additionalServices', 'Additional Services', [
          f.object('leftSection', 'Left Section', [f.string('title', 'Title'), f.textareaList('paragraphs', 'Paragraphs'), f.string('buttonText', 'Button Text')]),
          f.object('rightSection', 'Right Section', [f.string('title', 'Title'), f.textarea('quote', 'Quote'), f.objectList('services', 'Services', [...titleDescription, f.string('link', 'Link')]), f.string('buttonText', 'Button Text')]),
        ]),
        f.object('marketingAgency', 'Marketing Agency', [
          f.string('title', 'Title'),
          f.textarea('description', 'Description'),
          f.textarea('description2', 'Description 2'),
          f.object('image', 'Main Image', imageAssetFields('src', 'Image', { includeSizes: true })),
          ...standaloneImageWithSeoFields('backgroundImage', 'Background Image', 'backgroundImageSeo', 'Background Image SEO'),
        ]),
        f.object('caseStudies', 'Case Studies', [
          f.string('title', 'Title'),
          f.string('subtitle', 'Subtitle'),
          f.textarea('description', 'Description'),
          f.objectList('cases', 'Cases', [
            f.string('label', 'Label'),
            f.string('projectName', 'Project Name'),
            f.textarea('description', 'Description'),
            ...standaloneImageWithSeoFields('image', 'Image', 'imageSeo', 'Image SEO'),
          ]),
        ]),
        f.object('testimonials', 'Testimonials', [
          f.string('title', 'Title'),
          f.string('subtitle', 'Subtitle'),
          ...standaloneImageWithSeoFields('quoteIcon', 'Quote Icon', 'quoteIconSeo', 'Quote Icon SEO'),
          f.objectList('testimonials', 'Testimonials', [
            f.textarea('text', 'Text'),
            ...standaloneImageWithSeoFields('avatar', 'Avatar', 'avatarSeo', 'Avatar SEO'),
            f.string('name', 'Name'),
            f.string('title', 'Title'),
            f.string('company', 'Company'),
          ]),
        ]),
        f.object('whyChooseUs', 'Why Choose Us', [f.string('title', 'Title'), f.string('subtitle', 'Subtitle'), f.objectList('benefits', 'Benefits', titleDescription), f.string('buttonText', 'Button Text')]),
        f.object('workProcess', 'Work Process', [f.string('title', 'Title'), f.textarea('description', 'Description'), f.objectList('steps', 'Steps', titleDescription)]),
        f.object('updates', 'Updates', [
          f.string('title', 'Title'),
          f.objectList('updates', 'Updates', [...titleDescription, ...standaloneImageWithSeoFields('image', 'Card Image', 'imageSeo', 'Card Image SEO')]),
          f.string('buttonText', 'Button Text'),
        ]),
        f.object('contact', 'Contact', [f.string('title', 'Title'), f.textarea('description', 'Description'), contactInfo]),
        f.object('faq', 'FAQ', [f.string('title', 'Title'), f.string('subtitle', 'Subtitle'), f.objectList('faqs', 'FAQs', faqFields)]),
      ]),
      collection('blogs', 'Blogs', 'jsonContent/blogs', [
        pageMetadataSection,
        f.string('brand', 'Brand'),
        f.string('title', 'Title'),
        f.textarea('subtitle', 'Subtitle'),
        f.string('readMore', 'Read More'),
        f.string('allBlogs', 'All Blogs'),
        f.string('backToBlogs', 'Back To Blogs'),
        f.object('metadata', 'Metadata', [
          f.string('title', 'Title'),
          f.textarea('description', 'Description'),
        ]),
        // Blog posts content (one nested object per slug)
        {
          type: 'object',
          name: 'posts',
          label: 'Posts',
          fields: [
            {
              type: 'object',
              name: 'why_responsive_web_design_matters_in_2025',
              nameOverride: 'why-responsive-web-design-matters-in-2025',
              label: 'Post: Responsive Web Design',
              fields: blogPostFields,
            },
            {
              type: 'object',
              name: 'seo_trends_that_will_shape_your_strategy',
              nameOverride: 'seo-trends-that-will-shape-your-strategy',
              label: 'Post: SEO Trends',
              fields: blogPostFields,
            },
            {
              type: 'object',
              name: 'how_social_media_drives_brand_growth',
              nameOverride: 'how-social-media-drives-brand-growth',
              label: 'Post: Social Media Growth',
              fields: blogPostFields,
            },
            {
              type: 'object',
              name: 'getting_started_with_google_ads',
              nameOverride: 'getting-started-with-google-ads',
              label: 'Post: Google Ads',
              fields: blogPostFields,
            },
            {
              type: 'object',
              name: 'building_a_website_that_converts',
              nameOverride: 'building-a-website-that-converts',
              label: 'Post: Website That Converts',
              fields: blogPostFields,
            },
            {
              type: 'object',
              name: 'brand_identity_and_visual_consistency',
              nameOverride: 'brand-identity-and-visual-consistency',
              label: 'Post: Brand Identity',
              fields: blogPostFields,
            },
          ],
        },
      ]),
      collection('about_us', 'About Us', 'jsonContent/about-us', [
        pageMetadataSection,
        // Hero with main + floating images
        f.object('otherHero', 'Other Hero', [
          f.string('pageName', 'Page Name'),
          f.string('title', 'Title'),
          f.textarea('description', 'Description'),
          f.string('buttonText', 'Button Text'),
          f.object('mainImage', 'Main Image', imageAssetFields('src', 'Image')),
          f.image('floatingImageSrc', 'Floating Image'),
          f.string('floatingImageAlt', 'Floating Image Alt'),
          f.plainString('floatingImageTitle', 'Floating Image Title'),
          f.plainTextarea('floatingImageCaption', 'Floating Image Caption'),
          f.plainTextarea('floatingImageDescription', 'Floating Image Description'),
        ]),
        // Founder message (with avatar image & text)
        f.object('founderMessage', 'Founder Message', [
          f.string('title', 'Title'),
          f.textarea('message', 'Message'),
          f.image('avatarImageSrc', 'Avatar Image'),
          f.object('avatarImageSeo', 'Avatar Image SEO', imageSeoFields),
          f.string('avatarName', 'Avatar Name'),
          f.string('avatarTitle', 'Avatar Title'),
        ]),
        // Covered area stats + locations with flag images
        f.object('coveredArea', 'Covered Area', [
          f.string('title', 'Title'),
          f.textarea('description', 'Description'),
          f.objectList('locations', 'Locations', [
            f.string('id', 'Id'),
            f.string('country', 'Country'),
            f.string('line1', 'Address Line 1'),
            f.string('line2', 'Address Line 2'),
            f.image('imagePath', 'Flag Image'),
            f.object('imageSeo', 'Flag Image SEO', imageSeoFields),
            f.string('top', 'Top (CSS %)'),
            f.string('left', 'Left (CSS %)'),
          ]),
          f.objectList('stats', 'Stats', [
            f.string('value', 'Value'),
            f.string('label', 'Label'),
          ]),
        ]),
        // What we do, including icon images for highlights
        f.object('whatWeDo', 'What We Do', [
          f.string('title', 'Title'),
          f.textarea('description', 'Description'),
          f.objectList('highlights', 'Highlights', [
            f.string('id', 'Id'),
            f.string('title', 'Title'),
            f.textarea('description', 'Description'),
            f.image('icon', 'Icon Image'),
            f.object('iconSeo', 'Icon Image SEO', imageSeoFields),
          ]),
        ]),
        // Digital percentage section
        f.object('digitalPercentage', 'Digital Percentage', [
          f.string('title', 'Title'),
          f.textarea('description', 'Description'),
          f.stringList('services', 'Services'),
        ]),
        // Concept & vision with card images
        f.object('conceptAndVision', 'Concept & Vision', [
          f.string('title', 'Title'),
          f.textarea('description', 'Description'),
          f.objectList('cards', 'Cards', [
            f.string('id', 'Id'),
            f.string('title', 'Title'),
            f.textarea('description', 'Description'),
            f.image('imageSrc', 'Card Image'),
            f.object('imageSeo', 'Card Image SEO', imageSeoFields),
          ]),
        ]),
        // About-us video section with video file
        f.object('videoSection', 'Video Section', [
          f.string('title', 'Title'),
          f.textarea('description', 'Description'),
          f.string('buttonText', 'Button Text'),
          f.string('buttonLink', 'Button Link'),
          {
            type: 'image',
            name: 'videoPath',
            label: 'Video File',
          },
        ]),
        // Left three-image section (reuses threeImage adapter)
        f.object('leftThreeImage', 'Left Three Image', [
          f.string('badge', 'Badge'),
          f.string('title', 'Title'),
          f.textarea('description', 'Description'),
          f.objectList('images', 'Images', [
            ...imageAssetFields('src', 'Image'),
          ]),
        ]),
        // All employees grid with avatar images
        f.object('allEmployeesSection', 'All Employees Section', [
          f.string('eyebrow', 'Eyebrow'),
          f.string('title', 'Title'),
          {
            type: 'object',
            name: 'employees',
            label: 'Employees',
            list: true,
            ui: {
              defaultItem: () => ({
                id: generateEmployeeId(),
              }),
              // Narrow type here isn't important; this is only for CMS labels.
              itemProps: (item: { name?: string; title?: string; id?: string }) => ({
                label: item?.name || item?.title || item?.id || 'Employee',
              }),
            },
            fields: [
              {
                type: 'string',
                name: 'id',
                label: 'Id',
                ui: {
                  description: 'Auto-generated for new employees.',
                },
              },
              f.string('name', 'Name'),
              f.string('title', 'Title'),
              f.image('imageSrc', 'Avatar Image'),
              f.object('imageSeo', 'Avatar Image SEO', imageSeoFields),
              f.image('hoverImageSrc', 'Hover Avatar Image'),
              f.object('hoverImageSeo', 'Hover Avatar Image SEO', imageSeoFields),
            ],
          },
        ]),
      ]),
      collection('pay_it_forward', 'Pay It Forward', 'jsonContent/pay-it-forward', [
        pageMetadataSection,
        // Hero with main + floating images
        f.object('otherHero', 'Other Hero', [
          f.string('pageName', 'Page Name'),
          f.string('title', 'Title'),
          f.textarea('description', 'Description'),
          f.string('buttonText', 'Button Text'),
          f.object('mainImage', 'Main Image', imageAssetFields('src', 'Image')),
          f.image('floatingImageSrc', 'Floating Image'),
          f.string('floatingImageAlt', 'Floating Image Alt'),
          f.plainString('floatingImageTitle', 'Floating Image Title'),
          f.plainTextarea('floatingImageCaption', 'Floating Image Caption'),
          f.plainTextarea('floatingImageDescription', 'Floating Image Description'),
        ]),
        // First left/right three image sections
        f.object('leftThreeImage', 'Left Three Image', [
          f.string('title', 'Title'),
          f.textareaList('description', 'Description'),
          f.objectList('images', 'Images', [
            ...imageAssetFields('src', 'Image'),
          ]),
        ]),
        f.object('rightThreeImage', 'Right Three Image', [
          f.string('title', 'Title'),
          f.textareaList('description', 'Description'),
          f.objectList('images', 'Images', [
            ...imageAssetFields('src', 'Image'),
          ]),
        ]),
        // Second left/right three image sections
        f.object('leftThreeImage2', 'Left Three Image 2', [
          f.string('title', 'Title'),
          f.textarea('description', 'Description'),
          f.objectList('images', 'Images', [
            ...imageAssetFields('src', 'Image'),
          ]),
        ]),
        f.object('rightThreeImage2', 'Right Three Image 2', [
          f.string('title', 'Title'),
          f.textareaList('description', 'Description'),
          f.objectList('images', 'Images', [
            ...imageAssetFields('src', 'Image'),
          ]),
        ]),
        // JoinUsHelping with image
        f.object('joinUsHelping', 'Join Us Helping', [
          f.string('title', 'Title'),
          f.textarea('description', 'Description'),
          f.textarea('contactText', 'Contact Text'),
          f.object('image', 'Image', imageAssetFields('src', 'Image')),
        ]),
        // WePayItForward simple text section
        f.object('wePayItForward', 'We Pay It Forward', [
          f.string('title', 'Title'),
          f.textarea('description', 'Description'),
        ]),
        // Video section with video + button
        f.object('videoSection', 'Video Section', [
          f.string('title', 'Title'),
          f.textarea('description', 'Description'),
          f.string('buttonText', 'Button Text'),
          f.string('buttonLink', 'Button Link'),
          {
            type: 'image',
            name: 'videoPath',
            label: 'Video File',
          },
        ]),
        // Book consultant CTA with three images
        f.object('bookConsultant', 'Book Consultant', [
          f.string('title', 'Title'),
          f.textarea('description', 'Description'),
          f.string('buttonText', 'Button Text'),
          f.string('buttonLink', 'Button Link'),
          f.objectList('images', 'Images', [
            ...imageAssetFields('src', 'Image'),
          ]),
        ]),
      ]),
      collection('contact_page', 'Contact Page', 'jsonContent/contact', [
        pageMetadataSection,
        f.object('hero', 'Hero', [f.string('badge', 'Badge'), f.string('title', 'Title'), f.string('titleHighlight', 'Title Highlight'), f.textarea('description', 'Description'), f.string('buttonText', 'Button Text')]),
        f.objectList('highlights', 'Highlights', titleDescription.concat([f.string('value', 'Value')])),
        f.object('form', 'Form', [
          f.string('nameLabel', 'Name Label'),
          f.string('firstNamePlaceholder', 'First Name Placeholder'),
          f.string('lastNamePlaceholder', 'Last Name Placeholder'),
          f.string('emailLabel', 'Email Label'),
          f.string('emailPlaceholder', 'Email Placeholder'),
          f.string('messageLabel', 'Message Label'),
          f.string('messagePlaceholder', 'Message Placeholder'),
          f.string('submitButton', 'Submit Button'),
          f.string('sendingButton', 'Sending Button'),
          f.string('successMessage', 'Success Message'),
          f.string('errorMessage', 'Error Message'),
        ]),
      ]),
      collection('legal_privacy', 'Privacy Policy', 'jsonContent/privacy-policy', [
        pageMetadataSection,
        f.object('header', 'Header', [f.string('title', 'Title'), f.string('lastUpdated', 'Last Updated'), f.object('welcome', 'Welcome', [f.string('title', 'Title'), f.textarea('text', 'Text')])]),
        f.objectList('toc', 'Table of Contents', [f.string('id', 'Id'), f.string('label', 'Label')]),
        f.objectList('sections', 'Sections', [f.string('id', 'Id'), f.string('title', 'Title'), f.textareaList('content', 'Content')]),
      ]),
      collection('legal_terms', 'Terms & Conditions', 'jsonContent/terms-and-conditions', [
        pageMetadataSection,
        f.object('header', 'Header', [f.string('title', 'Title'), f.string('lastUpdated', 'Last Updated'), f.object('welcome', 'Welcome', [f.string('title', 'Title'), f.textarea('text', 'Text')])]),
        f.objectList('toc', 'Table of Contents', [f.string('id', 'Id'), f.string('label', 'Label')]),
        f.objectList('sections', 'Sections', [f.string('id', 'Id'), f.string('title', 'Title'), f.textareaList('content', 'Content')]),
      ]),
      collection('legal_cookie', 'Cookie Policy', 'jsonContent/cookie-policy', [
        pageMetadataSection,
        f.object('header', 'Header', [f.string('title', 'Title'), f.string('lastUpdated', 'Last Updated'), f.object('welcome', 'Welcome', [f.string('title', 'Title'), f.textarea('text', 'Text')])]),
        f.objectList('toc', 'Table of Contents', [f.string('id', 'Id'), f.string('label', 'Label')]),
        f.objectList('sections', 'Sections', [f.string('id', 'Id'), f.string('title', 'Title'), f.textareaList('content', 'Content')]),
      ]),
      collection('contact_modal', 'Contact Modal', 'jsonContent/contact-modal', [
        f.string('title', 'Title'),
        f.string('nameLabel', 'Name Label'),
        f.string('firstNamePlaceholder', 'First Name Placeholder'),
        f.string('lastNamePlaceholder', 'Last Name Placeholder'),
        f.string('emailLabel', 'Email Label'),
        f.string('emailPlaceholder', 'Email Placeholder'),
        f.string('messageLabel', 'Message Label'),
        f.string('messagePlaceholder', 'Message Placeholder'),
        f.string('selectedServicesLabel', 'Selected Services Label'),
        f.string('emptyServicesMessage', 'Empty Services Message'),
        f.string('submitButtonText', 'Submit Button Text'),
        f.image('image', 'Modal Image'),
        f.string('imageAlt', 'Image Alt'),
        f.plainString('imageTitle', 'Image Title'),
        f.plainTextarea('imageCaption', 'Image Caption'),
        f.plainTextarea('imageDescription', 'Image Description'),
      ]),
      collection('growth_popup', 'Growth Popup', 'jsonContent/growth-popup', [
      f.string('titleLine1', 'Title Line 1'),
      f.string('titleLine2', 'Title Line 2'),
      f.string('subheading', 'Subheading'),
      f.textarea('description', 'Description'),
      f.string('buttonText', 'Button Text'),
      ...standaloneImageWithSeoFields('backgroundImage', 'Background Image', 'backgroundImageSeo', 'Background Image SEO'),
      ...standaloneImageWithSeoFields('illustrationImage', 'Illustration Image', 'illustrationImageSeo', 'Illustration Image SEO'),
      ], undefined, 'Popup shown when users scroll to the Work Process section. Edit per locale (en / sv).'),
      // SEO services page (uses LandingMarketingAgencySeo)
      collection('seo', 'SEO', 'jsonContent/seo', [
        pageMetadataSection,
        f.objectList('serviceCards1', 'Service Cards 1', titleDescription),
        f.objectList('serviceCards2', 'Service Cards 2', titleDescription),
        f.object('marketingAgency', 'Marketing Agency', [
          f.string('title', 'Title'),
          f.textarea('description', 'Description'),
          f.textarea('description2', 'Description 2'),
          f.object('image', 'Main Image', imageAssetFields('src', 'Image', { includeSizes: true })),
          ...standaloneImageWithSeoFields('backgroundImage', 'Background Image', 'backgroundImageSeo', 'Background Image SEO'),
        ]),
        ...baseServiceFields,
      ]),
      // Social Media Marketing services page (uses LandingMarketingAgencySMMS)
      collection('social_media_marketing_services', 'Social Media Marketing', 'jsonContent/social-media-marketing-services', [
        pageMetadataSection,
        f.objectList('serviceCards1', 'Service Cards 1', titleDescription),
        f.objectList('serviceCards2', 'Service Cards 2', titleDescription),
        f.object('marketingAgency', 'Marketing Agency', [
          f.string('title', 'Title'),
          f.textarea('description', 'Description'),
          f.textarea('description2', 'Description 2'),
          f.object('image', 'Main Image', imageAssetFields('src', 'Image', { includeSizes: true })),
          ...standaloneImageWithSeoFields('backgroundImage', 'Background Image', 'backgroundImageSeo', 'Background Image SEO'),
        ]),
        ...baseServiceFields,
      ]),
      // PPC / Google Ads services page (uses LandingMarketingAgencyPPC)
      collection('ppc_google_ads_management', 'PPC Google Ads', 'jsonContent/ppc-google-ads-management', [
        pageMetadataSection,
        f.objectList('serviceCards1', 'Service Cards 1', titleDescription),
        f.objectList('serviceCards2', 'Service Cards 2', titleDescription),
        f.object('marketingAgency', 'Marketing Agency', [
          f.string('title', 'Title'),
          f.textarea('description', 'Description'),
          f.textarea('description2', 'Description 2'),
          f.object('image', 'Main Image', imageAssetFields('src', 'Image', { includeSizes: true })),
          ...standaloneImageWithSeoFields('backgroundImage', 'Background Image', 'backgroundImageSeo', 'Background Image SEO'),
        ]),
        ...baseServiceFields,
      ]),
      // Digital Marketing services page (uses LandingMarketingAgencyDMS)
      collection('digital_marketing_services', 'Digital Marketing', 'jsonContent/digital-marketing-services', [
        pageMetadataSection,
        f.objectList('serviceCards1', 'Service Cards 1', titleDescription),
        f.object('marketingAgency', 'Marketing Agency', [
          f.string('title', 'Title'),
          f.textarea('description', 'Description'),
          // description2 is an array of paragraphs in JSON; keep list to match,
          // while still mapping into the TS content via useContent adapter.
          f.textareaList('description2', 'Description 2'),
          f.object('image', 'Main Image', imageAssetFields('src', 'Image', { includeSizes: true })),
          ...standaloneImageWithSeoFields('backgroundImage', 'Background Image', 'backgroundImageSeo', 'Background Image SEO'),
        ]),
        ...baseServiceFields,
      ]),
      collection('app_development', 'App Development', 'jsonContent/app-development', [pageMetadataSection, f.objectList('serviceCards', 'Service Cards', titleDescription), f.object('companyPotentials', 'Company Potentials', [f.string('subtitle', 'Subtitle'), f.string('title', 'Title'), f.objectList('features', 'Features', titleDescription)]), f.object('benefits', 'Benefits', [f.string('title', 'Title'), f.objectList('benefits', 'Benefits', titleDescription)]), f.object('comparison', 'Comparison', [f.string('title', 'Title'), f.object('agencyData', 'Agency Data', [f.string('title', 'Title'), f.textareaList('pros', 'Pros'), f.textareaList('cons', 'Cons')]), f.object('freelancerData', 'Freelancer Data', [f.string('title', 'Title'), f.textareaList('pros', 'Pros'), f.textareaList('cons', 'Cons')])]), ...baseServiceFields]),
      collection('web_development', 'Web Development', 'jsonContent/web-development', [pageMetadataSection, f.objectList('serviceCards', 'Service Cards', titleDescription), f.object('companyPotentials', 'Company Potentials', [f.string('subtitle', 'Subtitle'), f.string('title', 'Title'), f.objectList('features', 'Features', titleDescription)]), f.object('benefits', 'Benefits', [f.string('title', 'Title'), f.string('subtitle', 'Subtitle'), f.objectList('benefits', 'Benefits', titleDescription)]), f.object('comparison', 'Comparison', [f.string('title', 'Title'), f.object('agencyData', 'Agency Data', [f.string('title', 'Title'), f.textareaList('pros', 'Pros'), f.textareaList('cons', 'Cons')]), f.object('freelancerData', 'Freelancer Data', [f.string('title', 'Title'), f.textareaList('pros', 'Pros'), f.textareaList('cons', 'Cons')])]), ...baseServiceFields]),
      collection('web_design', 'Web Design', 'jsonContent/web-design', [pageMetadataSection, f.objectList('serviceCards', 'Service Cards', titleDescription), f.object('companyPotentials', 'Company Potentials', [f.string('subtitle', 'Subtitle'), f.string('title', 'Title'), f.objectList('features', 'Features', titleDescription)]), f.object('benefits', 'Benefits', [f.string('title', 'Title'), f.string('subtitle', 'Subtitle'), f.objectList('benefits', 'Benefits', titleDescription)]), f.object('comparison', 'Comparison', [f.string('title', 'Title'), f.object('agencyData', 'Agency Data', [f.string('title', 'Title'), f.textareaList('pros', 'Pros'), f.textareaList('cons', 'Cons')]), f.object('freelancerData', 'Freelancer Data', [f.string('title', 'Title'), f.textareaList('pros', 'Pros'), f.textareaList('cons', 'Cons')])]), ...baseServiceFields]),
      collection('wordpress_development', 'WordPress Development', 'jsonContent/wordpress-development', [pageMetadataSection, f.objectList('serviceCards', 'Service Cards', titleDescription), f.object('companyPotentials', 'Company Potentials', [f.string('subtitle', 'Subtitle'), f.string('title', 'Title'), f.objectList('features', 'Features', titleDescription)]), f.object('benefits', 'Benefits', [f.string('title', 'Title'), f.string('subtitle', 'Subtitle'), f.objectList('benefits', 'Benefits', titleDescription)]), f.object('comparison', 'Comparison', [f.string('title', 'Title'), f.object('agencyData', 'Agency Data', [f.string('title', 'Title'), f.textareaList('pros', 'Pros'), f.textareaList('cons', 'Cons')]), f.object('freelancerData', 'Freelancer Data', [f.string('title', 'Title'), f.textareaList('pros', 'Pros'), f.textareaList('cons', 'Cons')])]), ...baseServiceFields]),
      collection('graphic_design', 'Graphic Design', 'jsonContent/graphic-design', [pageMetadataSection, f.objectList('serviceCards', 'Service Cards', titleDescription), f.object('companyPotentials', 'Company Potentials', [f.string('subtitle', 'Subtitle'), f.string('title', 'Title'), f.objectList('features', 'Features', titleDescription)]), f.object('benefits', 'Benefits', [f.string('title', 'Title'), f.string('subtitle', 'Subtitle'), f.objectList('benefits', 'Benefits', titleDescription)]), f.object('comparison', 'Comparison', [f.string('title', 'Title'), f.object('agencyData', 'Agency Data', [f.string('title', 'Title'), f.textareaList('pros', 'Pros'), f.textareaList('cons', 'Cons')]), f.object('freelancerData', 'Freelancer Data', [f.string('title', 'Title'), f.textareaList('pros', 'Pros'), f.textareaList('cons', 'Cons')])]), ...baseServiceFields]),
    ],
  },
});
