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
            <OtherHero contentPath="otherHeroSMMS" />
            <ScrollReveal><CompanyIntroSection contentPath="CompanyIntroSectionSMMS" /></ScrollReveal>
            <ScrollReveal><ContentImageSplit contentPath="ContentImageSplitSMMS" /></ScrollReveal>
            <ScrollReveal><LandingDigitalServices
                cardSecCount={2}
                contentPath="landingDigitalServicesSMMS"
                cardContent1="digitalServiceCard1SMMS"
                cardContent2="digitalServiceCard2SMMS"
            /></ScrollReveal>
            <ScrollReveal><CardSliderRightToLeft contentPath="cardSliderRightToLeftSMMS" /></ScrollReveal>
            <ScrollReveal><WorkProcessSection contentPath="workProcessSectionSMMS" /></ScrollReveal>
            <ScrollReveal><BenefitsSection contentPath="benefitsSectionSMMS" /></ScrollReveal>
            <ScrollReveal><LandingMarketingAgency contentPath="landingMarketingAgencySMMS" /></ScrollReveal>
            <ScrollReveal><LandingChoose contentPath="landingChooseSMMS" /></ScrollReveal>
            {/* <ScrollReveal><LandingTestimonialCarousel contentPath="landingTestimonialCarouselSMMS" /></ScrollReveal> */}
            {/* <ScrollReveal><PartnersLogo contentPath="partnersLogoSMMS" /></ScrollReveal> */}
            {/* <ScrollReveal><LandingCaseStudies contentPath="landingCaseStudies2SMMS" /></ScrollReveal> */}
            <ScrollReveal><LandingAdditionalServices contentPath="landingAdditionalServices2SMMS" /></ScrollReveal>
            <ScrollReveal><ContactSection contentPath="contactSectionSMMS" /></ScrollReveal>
            <LandingFaq contentPath="landingFaqSMMS" />
        </div>
    );
}
