"use client"

import BenefitsSection from "@/components/common/BenefitsSection";
import CardSliderRightToLeft from "@/components/common/CardSliderRightToLeft";
import CompanyIntroSection from "@/components/common/CompanyIntroSection";
import CompanyPotentialsSection from "@/components/common/CompanyPotentialsSection";
import ComparisonBetweenCards from "@/components/common/ComparisonBetweenCards";
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
// import LandingTestimonialCarousel from "@/components/landingTestimonialCarousel";
import WorkProcessSection from "@/components/workProcessSection";

export default function Page() {
    return (
        <div>
            <OtherHero contentPath="otherHeroWebDesign" />
            <ScrollReveal><CompanyIntroSection contentPath="CompanyIntroSectionWebDesign" /></ScrollReveal>
            <ScrollReveal><ContentImageSplit contentPath="ContentImageSplitWebDesign" /></ScrollReveal>
            <ScrollReveal><LandingDigitalServices
                cardSecCount={2}
                contentPath="landingDigitalServicesWebDesign"
                cardContent1="digitalServiceCard1WebDesign"
            /></ScrollReveal>
            <ScrollReveal><CardSliderRightToLeft contentPath="cardSliderRightToLeftWebDesign" /></ScrollReveal>
            <ScrollReveal><CompanyPotentialsSection contentPath="companyPotentialsSectionWebDesign" /></ScrollReveal>
            <ScrollReveal><WorkProcessSection contentPath="workProcessSectionWebDesign" /></ScrollReveal>
            <ScrollReveal><BenefitsSection contentPath="benefitsSectionWebDesign" /></ScrollReveal>
            <ScrollReveal><ComparisonBetweenCards contentPath="comparisonBetweenCardsWebDesign" /></ScrollReveal>
            <ScrollReveal><LandingChoose contentPath="landingChooseWebDesign" /></ScrollReveal>
            {/* <ScrollReveal><LandingTestimonialCarousel contentPath="landingTestimonialCarouselWebDesign" /></ScrollReveal> */}
            {/* <ScrollReveal><PartnersLogo contentPath="partnersLogoWebDesign" /></ScrollReveal> */}
            {/* <ScrollReveal><LandingCaseStudies contentPath="landingCaseStudies2WebDesign" /></ScrollReveal> */}
            <ScrollReveal><LandingAdditionalServices contentPath="landingAdditionalServices2WebDesign" /></ScrollReveal>
            <ScrollReveal><ContactSection contentPath="contactSectionWebDesign" /></ScrollReveal>
            <LandingFaq contentPath="landingFaqWebDesign" />
        </div>
    );
}
