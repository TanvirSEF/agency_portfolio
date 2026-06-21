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
            <OtherHero contentPath="otherHeroWebDevelopment" />
            <ScrollReveal><CompanyIntroSection contentPath="CompanyIntroSectionWebDevelopment" /></ScrollReveal>
            <ScrollReveal><ContentImageSplit contentPath="ContentImageSplitWebDevelopment" /></ScrollReveal>
            <ScrollReveal><LandingDigitalServices
                contentPath="landingDigitalServicesWebDevelopment"
                cardContent1="digitalServiceCard1WebDevelopment"
            /></ScrollReveal>
            <ScrollReveal><CardSliderRightToLeft contentPath="cardSliderRightToLeftWebDevelopment" /></ScrollReveal>
            <ScrollReveal><WorkProcessSection contentPath="workProcessSectionWebDevelopment" /></ScrollReveal>
            <ScrollReveal><BenefitsSection contentPath="benefitsSectionWebDevelopment" /></ScrollReveal>
            <ScrollReveal><LandingMarketingAgency contentPath="landingMarketingAgencyDMS" /></ScrollReveal>
            <ScrollReveal><LandingChoose contentPath="landingChooseWebDevelopment" /></ScrollReveal>
            {/* <ScrollReveal><LandingTestimonialCarousel contentPath="landingTestimonialCarouselWebDevelopment" /></ScrollReveal> */}
            {/* <ScrollReveal><PartnersLogo contentPath="partnersLogoWebDevelopment" /></ScrollReveal> */}
            {/* <ScrollReveal><LandingCaseStudies contentPath="landingCaseStudies2WebDevelopment" /></ScrollReveal> */}
            <ScrollReveal><LandingAdditionalServices contentPath="landingAdditionalServices2WebDevelopment" /></ScrollReveal>
            <ScrollReveal><ContactSection contentPath="contactSectionWebDevelopment" /></ScrollReveal>
            <LandingFaq contentPath="landingFaqWebDevelopment" />
        </div>
    );
}
