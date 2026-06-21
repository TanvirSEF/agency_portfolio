'use client';

import { useMessages } from 'next-intl';
import { contentRegistry, ContentPath } from './contentRegistry';

// Deep merge: overlays translated JSON onto static TS content
// Objects: recursively merge (JSON values override TS values)
// Arrays: merge per-item by index (preserves id, image, icon etc. from TS base)
// Primitives: JSON value wins
function deepMerge(base: any, overlay: any): any {
  if (overlay === null || overlay === undefined) return base;
  if (base === null || base === undefined) return overlay;

  if (Array.isArray(overlay)) {
    if (Array.isArray(base)) {
      return overlay.map((item, i) => {
        if (
          i < base.length &&
          typeof item === 'object' && item !== null &&
          typeof base[i] === 'object' && base[i] !== null &&
          !Array.isArray(item)
        ) {
          return deepMerge(base[i], item);
        }
        return item;
      });
    }
    return overlay;
  }

  if (typeof overlay === 'object' && typeof base === 'object') {
    const result = { ...base };
    for (const key of Object.keys(overlay)) {
      result[key] = deepMerge(base[key], overlay[key]);
    }
    return result;
  }

  return overlay;
}

function mapSeoFields(seo: any) {
  if (!seo || typeof seo !== 'object') return {};

  const result: Record<string, string> = {};
  if (typeof seo.altText === 'string' && seo.altText.trim().length > 0) result.alt = seo.altText;
  if (typeof seo.title === 'string' && seo.title.trim().length > 0) result.title = seo.title;
  if (typeof seo.caption === 'string' && seo.caption.trim().length > 0) result.caption = seo.caption;
  if (typeof seo.description === 'string' && seo.description.trim().length > 0) result.description = seo.description;

  return result;
}

// --- Adapters: transform JSON structure → TS structure for mismatched sections ---

const adapters: Record<string, (json: any) => any> = {
  otherHero: (json) => {
    const {
      buttonText,
      floatingImageSrc,
      floatingImageAlt,
      floatingImageTitle,
      floatingImageCaption,
      floatingImageDescription,
      ...rest
    } = json;

    const result: any = {
      ...rest,
      ...(buttonText ? { button: { text: buttonText } } : {}),
    };

    // If Tina provides a floating image, merge it into the existing floatingImage
    if (floatingImageSrc) {
      result.floatingImage = {
        ...(result.floatingImage || {}),
        src: floatingImageSrc,
        ...(floatingImageAlt ? { alt: floatingImageAlt } : {}),
        ...(floatingImageTitle ? { title: floatingImageTitle } : {}),
        ...(floatingImageCaption ? { caption: floatingImageCaption } : {}),
        ...(floatingImageDescription ? { description: floatingImageDescription } : {}),
      };
    }

    return result;
  },

  companyIntro: (json) => {
    const { brandName, title, description, buttonText, image1, image1Seo, image2, image2Seo, ...rest } = json;

    const result: any = {
      ...rest,
      content: {
        brandName,
        title,
        description,
        ...(buttonText ? { button: { text: buttonText } } : {}),
      },
    };

    // Map Tina image strings into the nested images.image1 / images.image2 objects
    if (image1) {
      result.images = {
        ...(result.images || {}),
        image1: {
          ...(result.images?.image1 || {}),
          src: image1,
          ...mapSeoFields(image1Seo),
        },
      };
    }
    if (image2) {
      result.images = {
        ...(result.images || {}),
        ...(result.images?.image1 ? { image1: result.images.image1 } : {}),
        image2: {
          ...(result.images?.image2 || {}),
          src: image2,
          ...mapSeoFields(image2Seo),
        },
      };
    }

    return result;
  },

  contact: (json) => {
    const result: any = {};
    if (json.title) result.title = json.title;
    if (json.description) result.description = json.description;
    if (json.contactInfo) {
      result.contactInfo = {
        title: json.contactInfo.title,
        email: {
          label: json.contactInfo.emailLabel,
          value: json.contactInfo.emailValue,
        },
        phone: {
          label: json.contactInfo.phoneLabel,
          value: json.contactInfo.phoneValue,
        },
      };
    }
    return result;
  },

  caseStudies: (json) => {
    const { cases, ...rest } = json;
    return { ...rest, ...(cases ? { caseStudies: cases } : {}) };
  },

  serviceCards: (json) => {
    if (Array.isArray(json)) {
      return { services: json };
    }
    return json;
  },

  legal: (json) => {
    return json;
  },

  // Map Pay It Forward / other three-image JSON (with images list) to TS shape (imagePaths[])
  threeImage: (json) => {
    const { badge, title, description, images, ...rest } = json || {};
    const result: any = { ...rest };

    if (badge !== undefined) result.badge = badge;
    if (title !== undefined) result.title = title;
    if (description !== undefined) result.description = description;

    if (Array.isArray(images)) {
      result.imagePaths = images
        .map((item: any) => {
          if (!item) return null;
          if (typeof item === 'string') return item;
          if (typeof item === 'object' && typeof item.src === 'string') return item.src;
          return null;
        })
        .filter((src): src is string => typeof src === 'string' && src.length > 0);
      result.imageEntries = images
        .map((item: any) => {
          if (!item) return null;
          if (typeof item === 'string') return { src: item };
          if (typeof item === 'object' && typeof item.src === 'string') return item;
          return null;
        })
        .filter((item: { src?: string } | null): item is { src: string } => typeof item?.src === 'string' && item.src.length > 0);
    }

    return result;
  },
};

// --- Mapping: ContentPath → { namespace, key, adapter? } ---

type I18nMapping = { namespace: string; key: string; adapter?: string };

const contentPathToI18n: Partial<Record<ContentPath, I18nMapping>> = {
  // ===== Landing =====
  hero: { namespace: 'landing', key: 'hero' },
  landingLogoScroller: { namespace: 'landing', key: 'logoScroller' },
  landingAbout: { namespace: 'landing', key: 'about' },
  landingDigitalServices: { namespace: 'landing', key: 'digitalServices' },
  digitalServiceCard: { namespace: 'landing', key: 'serviceCards', adapter: 'serviceCards' },
  digitalServiceCard1: { namespace: 'landing', key: 'serviceCards', adapter: 'serviceCards' },
  customWebDev: { namespace: 'landing', key: 'customWebDev' },
  landingAdditionalServices: { namespace: 'landing', key: 'additionalServices' },
  landingMarketingAgency: { namespace: 'landing', key: 'marketingAgency' },
  landingChoose: { namespace: 'landing', key: 'whyChooseUs' },
  workProcessSection: { namespace: 'landing', key: 'workProcess' },
  landingCaseStudies: { namespace: 'landing', key: 'caseStudies', adapter: 'caseStudies' },
  landingTestimonialCarousel: { namespace: 'landing', key: 'testimonials' },
  landingWebblyMediaUpdates: { namespace: 'landing', key: 'updates' },
  contactSection: { namespace: 'landing', key: 'contact', adapter: 'contact' },
  landingFaq: { namespace: 'landing', key: 'faq' },

  // ===== SEO =====
  otherHero: { namespace: 'seo', key: 'otherHero', adapter: 'otherHero' },
  CompanyIntroSectionSeo: { namespace: 'seo', key: 'companyIntro', adapter: 'companyIntro' },
  ContentImageSplitSeo: { namespace: 'seo', key: 'contentImageSplit' },
  landingDigitalServicesSeo: { namespace: 'seo', key: 'digitalServices' },
  digitalServiceCard1Seo: { namespace: 'seo', key: 'serviceCards1', adapter: 'serviceCards' },
  digitalServiceCard2Seo: { namespace: 'seo', key: 'serviceCards2', adapter: 'serviceCards' },
  cardSliderRightToLeft: { namespace: 'seo', key: 'cardSlider' },
  workProcessSectionSeo: { namespace: 'seo', key: 'workProcess' },
  benefitsSection: { namespace: 'seo', key: 'benefits' },
  landingMarketingAgencySeo: { namespace: 'seo', key: 'marketingAgency' },
  landingTestimonialCarouselSeo: { namespace: 'seo', key: 'testimonials' },
  landingCaseStudies2: { namespace: 'seo', key: 'caseStudies', adapter: 'caseStudies' },
  landingAdditionalServices2: { namespace: 'seo', key: 'additionalServices' },

  // ===== Social Media Marketing =====
  otherHeroSMMS: { namespace: 'social-media-marketing-services', key: 'otherHero', adapter: 'otherHero' },
  CompanyIntroSectionSMMS: { namespace: 'social-media-marketing-services', key: 'companyIntro', adapter: 'companyIntro' },
  ContentImageSplitSMMS: { namespace: 'social-media-marketing-services', key: 'contentImageSplit' },
  landingDigitalServicesSMMS: { namespace: 'social-media-marketing-services', key: 'digitalServices' },
  digitalServiceCard1SMMS: { namespace: 'social-media-marketing-services', key: 'serviceCards1', adapter: 'serviceCards' },
  digitalServiceCard2SMMS: { namespace: 'social-media-marketing-services', key: 'serviceCards2', adapter: 'serviceCards' },
  cardSliderRightToLeftSMMS: { namespace: 'social-media-marketing-services', key: 'cardSlider' },
  workProcessSectionSMMS: { namespace: 'social-media-marketing-services', key: 'workProcess' },
  benefitsSectionSMMS: { namespace: 'social-media-marketing-services', key: 'benefits' },
  landingMarketingAgencySMMS: { namespace: 'social-media-marketing-services', key: 'marketingAgency' },
  landingChooseSMMS: { namespace: 'social-media-marketing-services', key: 'whyChooseUs' },
  landingTestimonialCarouselSMMS: { namespace: 'social-media-marketing-services', key: 'testimonials' },
  partnersLogoSMMS: { namespace: 'social-media-marketing-services', key: 'partners' },
  landingCaseStudies2SMMS: { namespace: 'social-media-marketing-services', key: 'caseStudies', adapter: 'caseStudies' },
  landingAdditionalServices2SMMS: { namespace: 'social-media-marketing-services', key: 'additionalServices' },
  contactSectionSMMS: { namespace: 'social-media-marketing-services', key: 'contact', adapter: 'contact' },
  landingFaqSMMS: { namespace: 'social-media-marketing-services', key: 'faq' },

  // ===== PPC / Google Ads =====
  otherHeroPPC: { namespace: 'ppc-google-ads-management', key: 'otherHero', adapter: 'otherHero' },
  CompanyIntroSectionPPC: { namespace: 'ppc-google-ads-management', key: 'companyIntro', adapter: 'companyIntro' },
  ContentImageSplitPPC: { namespace: 'ppc-google-ads-management', key: 'contentImageSplit' },
  landingDigitalServicesPPC: { namespace: 'ppc-google-ads-management', key: 'digitalServices' },
  digitalServiceCard1PPC: { namespace: 'ppc-google-ads-management', key: 'serviceCards1', adapter: 'serviceCards' },
  digitalServiceCard2PPC: { namespace: 'ppc-google-ads-management', key: 'serviceCards2', adapter: 'serviceCards' },
  cardSliderRightToLeftPPC: { namespace: 'ppc-google-ads-management', key: 'cardSlider' },
  workProcessSectionPPC: { namespace: 'ppc-google-ads-management', key: 'workProcess' },
  benefitsSectionPPC: { namespace: 'ppc-google-ads-management', key: 'benefits' },
  landingMarketingAgencyPPC: { namespace: 'ppc-google-ads-management', key: 'marketingAgency' },
  landingChoosePPC: { namespace: 'ppc-google-ads-management', key: 'whyChooseUs' },
  landingTestimonialCarouselPPC: { namespace: 'ppc-google-ads-management', key: 'testimonials' },
  partnersLogoPPC: { namespace: 'ppc-google-ads-management', key: 'partners' },
  landingCaseStudies2PPC: { namespace: 'ppc-google-ads-management', key: 'caseStudies', adapter: 'caseStudies' },
  landingAdditionalServices2PPC: { namespace: 'ppc-google-ads-management', key: 'additionalServices' },
  contactSectionPPC: { namespace: 'ppc-google-ads-management', key: 'contact', adapter: 'contact' },
  landingFaqPPC: { namespace: 'ppc-google-ads-management', key: 'faq' },

  // ===== Digital Marketing Services =====
  otherHeroDMS: { namespace: 'digital-marketing-services', key: 'otherHero', adapter: 'otherHero' },
  CompanyIntroSectionDMS: { namespace: 'digital-marketing-services', key: 'companyIntro', adapter: 'companyIntro' },
  ContentImageSplitDMS: { namespace: 'digital-marketing-services', key: 'contentImageSplit' },
  landingDigitalServicesDMS: { namespace: 'digital-marketing-services', key: 'digitalServices' },
  digitalServiceCard1DMS: { namespace: 'digital-marketing-services', key: 'serviceCards1', adapter: 'serviceCards' },
  cardSliderRightToLeftDMS: { namespace: 'digital-marketing-services', key: 'cardSlider' },
  workProcessSectionDMS: { namespace: 'digital-marketing-services', key: 'workProcess' },
  landingMarketingAgencyDMS: { namespace: 'digital-marketing-services', key: 'marketingAgency' },
  comparisonBetweenCardsDMS: { namespace: 'digital-marketing-services', key: 'comparison' },
  landingChooseDMS: { namespace: 'digital-marketing-services', key: 'whyChooseUs' },
  landingTestimonialCarouselDMS: { namespace: 'digital-marketing-services', key: 'testimonials' },
  partnersLogoDMS: { namespace: 'digital-marketing-services', key: 'partners' },
  landingCaseStudies2DMS: { namespace: 'digital-marketing-services', key: 'caseStudies', adapter: 'caseStudies' },
  landingAdditionalServices2DMS: { namespace: 'digital-marketing-services', key: 'additionalServices' },
  contactSectionDMS: { namespace: 'digital-marketing-services', key: 'contact', adapter: 'contact' },
  landingFaqDMS: { namespace: 'digital-marketing-services', key: 'faq' },

  // ===== Web Design =====
  otherHeroWebDesign: { namespace: 'web-design', key: 'otherHero', adapter: 'otherHero' },
  CompanyIntroSectionWebDesign: { namespace: 'web-design', key: 'companyIntro', adapter: 'companyIntro' },
  ContentImageSplitWebDesign: { namespace: 'web-design', key: 'contentImageSplit' },
  landingDigitalServicesWebDesign: { namespace: 'web-design', key: 'digitalServices' },
  digitalServiceCard1WebDesign: { namespace: 'web-design', key: 'serviceCards', adapter: 'serviceCards' },
  cardSliderRightToLeftWebDesign: { namespace: 'web-design', key: 'cardSlider' },
  workProcessSectionWebDesign: { namespace: 'web-design', key: 'workProcess' },
  benefitsSectionWebDesign: { namespace: 'web-design', key: 'benefits' },
  landingChooseWebDesign: { namespace: 'web-design', key: 'whyChooseUs' },
  landingTestimonialCarouselWebDesign: { namespace: 'web-design', key: 'testimonials' },
  partnersLogoWebDesign: { namespace: 'web-design', key: 'partners' },
  landingCaseStudies2WebDesign: { namespace: 'web-design', key: 'caseStudies', adapter: 'caseStudies' },
  landingAdditionalServices2WebDesign: { namespace: 'web-design', key: 'additionalServices' },
  contactSectionWebDesign: { namespace: 'web-design', key: 'contact', adapter: 'contact' },
  landingFaqWebDesign: { namespace: 'web-design', key: 'faq' },
  companyPotentialsSectionWebDesign: { namespace: 'web-design', key: 'companyPotentials' },
  comparisonBetweenCardsWebDesign: { namespace: 'web-design', key: 'comparison' },

  // ===== Graphic Design =====
  otherHeroGraphicDesign: { namespace: 'graphic-design', key: 'otherHero', adapter: 'otherHero' },
  CompanyIntroSectionGraphicDesign: { namespace: 'graphic-design', key: 'companyIntro', adapter: 'companyIntro' },
  ContentImageSplitGraphicDesign: { namespace: 'graphic-design', key: 'contentImageSplit' },
  landingDigitalServicesGraphicDesign: { namespace: 'graphic-design', key: 'digitalServices' },
  digitalServiceCard1GraphicDesign: { namespace: 'graphic-design', key: 'serviceCards', adapter: 'serviceCards' },
  cardSliderRightToLeftGraphicDesign: { namespace: 'graphic-design', key: 'cardSlider' },
  workProcessSectionGraphicDesign: { namespace: 'graphic-design', key: 'workProcess' },
  benefitsSectionGraphicDesign: { namespace: 'graphic-design', key: 'benefits' },
  landingChooseGraphicDesign: { namespace: 'graphic-design', key: 'whyChooseUs' },
  landingTestimonialCarouselGraphicDesign: { namespace: 'graphic-design', key: 'testimonials' },
  partnersLogoGraphicDesign: { namespace: 'graphic-design', key: 'partners' },
  landingCaseStudies2GraphicDesign: { namespace: 'graphic-design', key: 'caseStudies', adapter: 'caseStudies' },
  contactSectionGraphicDesign: { namespace: 'graphic-design', key: 'contact', adapter: 'contact' },
  landingFaqGraphicDesign: { namespace: 'graphic-design', key: 'faq' },
  weOfferMoreGraphicDesign: { namespace: 'graphic-design', key: 'weOfferMore' },
  comparisonBetweenCardsGraphicDesign: { namespace: 'graphic-design', key: 'comparison' },
  companyPotentialsSectionGraphicDesign: { namespace: 'graphic-design', key: 'companyPotentials' },

  // ===== App Development =====
  otherHeroAPPDEV: { namespace: 'app-development', key: 'otherHero', adapter: 'otherHero' },
  CompanyIntroSectionAPPDEV: { namespace: 'app-development', key: 'companyIntro', adapter: 'companyIntro' },
  ContentImageSplitAPPDEV: { namespace: 'app-development', key: 'contentImageSplit' },
  landingDigitalServicesAPPDEV: { namespace: 'app-development', key: 'digitalServices' },
  digitalServiceCard1APPDEV: { namespace: 'app-development', key: 'serviceCards', adapter: 'serviceCards' },
  cardSliderRightToLeftAPPDEV: { namespace: 'app-development', key: 'cardSlider' },
  workProcessSectionAPPDEV: { namespace: 'app-development', key: 'workProcess' },
  benefitsSectionAPPDEV: { namespace: 'app-development', key: 'benefits' },
  landingChooseAPPDEV: { namespace: 'app-development', key: 'whyChooseUs' },
  landingTestimonialCarouselAPPDEV: { namespace: 'app-development', key: 'testimonials' },
  partnersLogoAPPDEV: { namespace: 'app-development', key: 'partners' },
  landingCaseStudies2APPDEV: { namespace: 'app-development', key: 'caseStudies', adapter: 'caseStudies' },
  landingAdditionalServices2APPDEV: { namespace: 'app-development', key: 'additionalServices' },
  contactSectionAPPDEV: { namespace: 'app-development', key: 'contact', adapter: 'contact' },
  landingFaqAPPDEV: { namespace: 'app-development', key: 'faq' },
  comparisonBetweenCardsAPPDEV: { namespace: 'app-development', key: 'comparison' },
  companyPotentialsSectionAPPDEV: { namespace: 'app-development', key: 'companyPotentials' },

  // ===== Web Development =====
  otherHeroWebDevelopment: { namespace: 'web-development', key: 'otherHero', adapter: 'otherHero' },
  CompanyIntroSectionWebDevelopment: { namespace: 'web-development', key: 'companyIntro', adapter: 'companyIntro' },
  ContentImageSplitWebDevelopment: { namespace: 'web-development', key: 'contentImageSplit' },
  landingDigitalServicesWebDevelopment: { namespace: 'web-development', key: 'digitalServices' },
  digitalServiceCard1WebDevelopment: { namespace: 'web-development', key: 'serviceCards', adapter: 'serviceCards' },
  cardSliderRightToLeftWebDevelopment: { namespace: 'web-development', key: 'cardSlider' },
  workProcessSectionWebDevelopment: { namespace: 'web-development', key: 'workProcess' },
  benefitsSectionWebDevelopment: { namespace: 'web-development', key: 'benefits' },
  landingChooseWebDevelopment: { namespace: 'web-development', key: 'whyChooseUs' },
  landingTestimonialCarouselWebDevelopment: { namespace: 'web-development', key: 'testimonials' },
  partnersLogoWebDevelopment: { namespace: 'web-development', key: 'partners' },
  landingCaseStudies2WebDevelopment: { namespace: 'web-development', key: 'caseStudies', adapter: 'caseStudies' },
  landingAdditionalServices2WebDevelopment: { namespace: 'web-development', key: 'additionalServices' },
  contactSectionWebDevelopment: { namespace: 'web-development', key: 'contact', adapter: 'contact' },
  landingFaqWebDevelopment: { namespace: 'web-development', key: 'faq' },
  companyPotentialsSectionWebDevelopment: { namespace: 'web-development', key: 'companyPotentials' },
  comparisonBetweenCardsWebDevelopment: { namespace: 'web-development', key: 'comparison' },

  // ===== WordPress Development =====
  otherHeroWpDevelopment: { namespace: 'wordpress-development', key: 'otherHero', adapter: 'otherHero' },
  CompanyIntroSectionWpDevelopment: { namespace: 'wordpress-development', key: 'companyIntro', adapter: 'companyIntro' },
  ContentImageSplitWpDevelopment: { namespace: 'wordpress-development', key: 'contentImageSplit' },
  landingDigitalServicesWpDevelopment: { namespace: 'wordpress-development', key: 'digitalServices' },
  digitalServiceCard1WpDevelopment: { namespace: 'wordpress-development', key: 'serviceCards', adapter: 'serviceCards' },
  cardSliderRightToLeftWpDevelopment: { namespace: 'wordpress-development', key: 'cardSlider' },
  workProcessSectionWpDevelopment: { namespace: 'wordpress-development', key: 'workProcess' },
  benefitsSectionWpDevelopment: { namespace: 'wordpress-development', key: 'benefits' },
  landingChooseWpDevelopment: { namespace: 'wordpress-development', key: 'whyChooseUs' },
  landingTestimonialCarouselWpDevelopment: { namespace: 'wordpress-development', key: 'testimonials' },
  partnersLogoWpDevelopment: { namespace: 'wordpress-development', key: 'partners' },
  landingCaseStudies2WpDevelopment: { namespace: 'wordpress-development', key: 'caseStudies', adapter: 'caseStudies' },
  landingAdditionalServices2WpDevelopment: { namespace: 'wordpress-development', key: 'additionalServices' },
  contactSectionWpDevelopment: { namespace: 'wordpress-development', key: 'contact', adapter: 'contact' },
  landingFaqWpDevelopment: { namespace: 'wordpress-development', key: 'faq' },
  companyPotentialsSectionWpDevelopment: { namespace: 'wordpress-development', key: 'companyPotentials' },
  comparisonBetweenCardsWpDevelopment: { namespace: 'wordpress-development', key: 'comparison' },

  // ===== About Us =====
  otherHeroAboutUs: { namespace: 'about-us', key: 'otherHero', adapter: 'otherHero' },
  founderMessageAboutUs: { namespace: 'about-us', key: 'founderMessage' },
  coveredAreaAboutUs: { namespace: 'about-us', key: 'coveredArea' },
  whatWeDoAboutUs: { namespace: 'about-us', key: 'whatWeDo' },
  digitalPercentageAboutUs: { namespace: 'about-us', key: 'digitalPercentage' },
  conceptAndVisionAboutUs: { namespace: 'about-us', key: 'conceptAndVision' },
  videoSectionAboutUs: { namespace: 'about-us', key: 'videoSection' },
  leftThreeImageAboutUs: { namespace: 'about-us', key: 'leftThreeImage', adapter: 'threeImage' },
  allEmployeesSectionAboutUs: { namespace: 'about-us', key: 'allEmployeesSection' },

  // ===== Pay It Forward =====
  otherHeroPayItForward: { namespace: 'pay-it-forward', key: 'otherHero', adapter: 'otherHero' },
  leftThreeImagePayItForward: { namespace: 'pay-it-forward', key: 'leftThreeImage', adapter: 'threeImage' },
  rightThreeImagePayItForward: { namespace: 'pay-it-forward', key: 'rightThreeImage', adapter: 'threeImage' },
  leftThreeImage2PayItForward: { namespace: 'pay-it-forward', key: 'leftThreeImage2', adapter: 'threeImage' },
  rightThreeImage2PayItForward: { namespace: 'pay-it-forward', key: 'rightThreeImage2', adapter: 'threeImage' },
  joinUsHelpingPayItForward: { namespace: 'pay-it-forward', key: 'joinUsHelping' },
  wePayItForwardPayItForward: { namespace: 'pay-it-forward', key: 'wePayItForward' },
  videoSectionPayItForward: { namespace: 'pay-it-forward', key: 'videoSection' },
  bookConsultantPayItForward: { namespace: 'pay-it-forward', key: 'bookConsultant' },

  // ===== Legal Pages =====
  termsAndConditions: { namespace: 'terms-and-conditions', key: '_root', adapter: 'legal' },
  privacyPolicy: { namespace: 'privacy-policy', key: '_root', adapter: 'legal' },
  cookiePolicy: { namespace: 'cookie-policy', key: '_root', adapter: 'legal' },

  // ===== Contact Modal =====
  contactModal: { namespace: 'contact-modal', key: '_root' },

  // ===== Growth Popup =====
  growthPopup: { namespace: 'growth-popup', key: '_root' },
};

// --- Hook ---

export function useSafeMessages(): Record<string, any> | null {
  try {
    return useMessages() as Record<string, any>;
  } catch {
    // NextIntlClientProvider not available (e.g. non-locale routes during SSG)
    return null;
  }
}

export function useContent<T = any>(contentPath?: ContentPath, fallback?: T): T {
  const messages = useSafeMessages();

  if (!contentPath) {
    return (fallback ?? {}) as T;
  }

  const baseContent = contentRegistry[contentPath] ?? fallback ?? {};

  if (!messages) {
    return baseContent as T;
  }

  const mapping = contentPathToI18n[contentPath];

  if (!mapping) {
    return baseContent as T;
  }

  const nsMessages = messages[mapping.namespace];
  if (!nsMessages) {
    return baseContent as T;
  }

  // For legal pages, use the whole namespace as the JSON content
  const jsonContent = mapping.key === '_root' ? nsMessages : nsMessages[mapping.key];
  if (!jsonContent) {
    return baseContent as T;
  }

  const adapted = mapping.adapter && adapters[mapping.adapter]
    ? adapters[mapping.adapter](jsonContent)
    : jsonContent;

  return deepMerge(baseContent, adapted) as T;
}

export type { ContentPath };
