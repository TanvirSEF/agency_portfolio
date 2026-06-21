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
            <OtherHero contentPath="otherHeroWpDevelopment" />
            <ScrollReveal><CompanyIntroSection contentPath="CompanyIntroSectionWpDevelopment" /></ScrollReveal>
            <ScrollReveal><ContentImageSplit contentPath="ContentImageSplitWpDevelopment" /></ScrollReveal>
            <ScrollReveal><LandingDigitalServices
                cardSecCount={2}
                contentPath="landingDigitalServicesWpDevelopment"
                cardContent1="digitalServiceCard1WpDevelopment"
            /></ScrollReveal>
            <ScrollReveal><CardSliderRightToLeft contentPath="cardSliderRightToLeftWpDevelopment" /></ScrollReveal>
            <ScrollReveal><CompanyPotentialsSection contentPath="companyPotentialsSectionWpDevelopment" /></ScrollReveal>
            <ScrollReveal><WorkProcessSection contentPath="workProcessSectionWpDevelopment" /></ScrollReveal>
            <ScrollReveal><BenefitsSection contentPath="benefitsSectionWpDevelopment" /></ScrollReveal>
            <ScrollReveal><ComparisonBetweenCards contentPath="comparisonBetweenCardsWpDevelopment" /></ScrollReveal>
            <ScrollReveal><LandingChoose contentPath="landingChooseWpDevelopment" /></ScrollReveal>
            {/* <ScrollReveal><LandingTestimonialCarousel contentPath="landingTestimonialCarouselWpDevelopment" /></ScrollReveal> */}
            {/* <ScrollReveal><PartnersLogo contentPath="partnersLogoWpDevelopment" /></ScrollReveal> */}
            {/* <ScrollReveal><LandingCaseStudies contentPath="landingCaseStudies2WpDevelopment" /></ScrollReveal> */}
            <ScrollReveal><LandingAdditionalServices contentPath="landingAdditionalServices2WpDevelopment" /></ScrollReveal>
            <ScrollReveal><ContactSection contentPath="contactSectionWpDevelopment" /></ScrollReveal>
            <LandingFaq contentPath="landingFaqWpDevelopment" />
        </div>
    );
}
