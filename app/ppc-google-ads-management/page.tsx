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
            <OtherHero contentPath="otherHeroPPC" />
            <ScrollReveal><CompanyIntroSection contentPath="CompanyIntroSectionPPC" /></ScrollReveal>
            <ScrollReveal><ContentImageSplit contentPath="ContentImageSplitPPC" /></ScrollReveal>
            <ScrollReveal><LandingDigitalServices
                cardSecCount={2}
                contentPath="landingDigitalServicesPPC"
                cardContent1="digitalServiceCard1PPC"
                cardContent2="digitalServiceCard2PPC"
            /></ScrollReveal>
            <ScrollReveal><CardSliderRightToLeft contentPath="cardSliderRightToLeftPPC" /></ScrollReveal>
            <ScrollReveal><WorkProcessSection contentPath="workProcessSectionPPC" /></ScrollReveal>
            <ScrollReveal><BenefitsSection contentPath="benefitsSectionPPC" /></ScrollReveal>
            <ScrollReveal><LandingMarketingAgency contentPath="landingMarketingAgencyPPC" /></ScrollReveal>
            <ScrollReveal><LandingChoose contentPath="landingChoosePPC" /></ScrollReveal>
            {/* <ScrollReveal><LandingTestimonialCarousel contentPath="landingTestimonialCarouselPPC" /></ScrollReveal> */}
            {/* <ScrollReveal><PartnersLogo contentPath="partnersLogoPPC" /></ScrollReveal> */}
            {/* <ScrollReveal><LandingCaseStudies contentPath="landingCaseStudies2PPC" /></ScrollReveal> */}
            <ScrollReveal><LandingAdditionalServices contentPath="landingAdditionalServices2PPC" /></ScrollReveal>
            <ScrollReveal><ContactSection contentPath="contactSectionPPC" /></ScrollReveal>
            <LandingFaq contentPath="landingFaqPPC" />
        </div>
    );
}
