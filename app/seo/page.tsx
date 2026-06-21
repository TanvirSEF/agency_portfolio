"use client"

import BenefitsSection from "@/components/common/BenefitsSection";
import CardSliderRightToLeft from "@/components/common/CardSliderRightToLeft";
import CompanyIntroSection from "@/components/common/CompanyIntroSection";
import ContentImageSplit from "@/components/common/ContentImageSplit";
import OtherHero from "@/components/common/OtherHero";
// import PartnersLogo from "@/components/common/partnersLogo";
import ScrollReveal from "@/components/common/ScrollReveal";
import ContactSection from "@/components/contactSection";
import LandingAdditionalServices from "@/components/landingAdditionalServices";
// import LandingCaseStudies from "@/components/landingCaseStudies";
import LandingChoose from "@/components/landingChoose";
import LandingDigitalServices from "@/components/landingDigitalServices";
import LandingFaq from "@/components/landingFaq";
import LandingMarketingAgency from "@/components/landingMarketingAgency";
// import LandingTestimonialCarousel from "@/components/landingTestimonialCarousel";
import WorkProcessSection from "@/components/workProcessSection";

export default function Page() {
  return (
    <div>
      <OtherHero contentPath="otherHero" />
      <ScrollReveal><CompanyIntroSection contentPath="CompanyIntroSectionSeo" /></ScrollReveal>
      <ScrollReveal><ContentImageSplit contentPath="ContentImageSplitSeo" /></ScrollReveal>
      <ScrollReveal><LandingDigitalServices
        cardSecCount={2}
        contentPath="landingDigitalServicesSeo"
        cardContent1="digitalServiceCard1Seo"
        cardContent2="digitalServiceCard2Seo"
      /></ScrollReveal>
      <ScrollReveal><CardSliderRightToLeft contentPath="cardSliderRightToLeft" /></ScrollReveal>
      <ScrollReveal><WorkProcessSection contentPath="workProcessSectionSeo" /></ScrollReveal>
      <ScrollReveal><BenefitsSection contentPath="benefitsSection" /></ScrollReveal>
      <ScrollReveal><LandingMarketingAgency contentPath="landingMarketingAgencySeo" /></ScrollReveal>
      <ScrollReveal><LandingChoose contentPath="landingChoose" /></ScrollReveal>
      {/* <ScrollReveal><LandingTestimonialCarousel contentPath="landingTestimonialCarouselSeo" /></ScrollReveal> */}
      {/* <ScrollReveal><PartnersLogo /></ScrollReveal> */}
      {/* <ScrollReveal><LandingCaseStudies contentPath="landingCaseStudies2" /></ScrollReveal> */}
      <ScrollReveal><LandingAdditionalServices contentPath="landingAdditionalServices2" /></ScrollReveal>
      <ScrollReveal><ContactSection contentPath="contactSection" /></ScrollReveal>
      <LandingFaq contentPath="landingFaq" />
    </div>
  );
}
