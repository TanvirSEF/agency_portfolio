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
            <OtherHero contentPath="otherHeroAPPDEV" />
            <ScrollReveal><CompanyIntroSection contentPath="CompanyIntroSectionAPPDEV" /></ScrollReveal>
            <ScrollReveal><ContentImageSplit contentPath="ContentImageSplitAPPDEV" /></ScrollReveal>
            <ScrollReveal><LandingDigitalServices
                cardSecCount={2}
                contentPath="landingDigitalServicesAPPDEV"
                cardContent1="digitalServiceCard1APPDEV"
            /></ScrollReveal>
            <ScrollReveal><CardSliderRightToLeft contentPath="cardSliderRightToLeftAPPDEV" /></ScrollReveal>
            <ScrollReveal><CompanyPotentialsSection contentPath="companyPotentialsSectionAPPDEV" /></ScrollReveal>
            <ScrollReveal><WorkProcessSection contentPath="workProcessSectionAPPDEV" /></ScrollReveal>
            <ScrollReveal><BenefitsSection contentPath="benefitsSectionAPPDEV" /></ScrollReveal>
            <ScrollReveal><ComparisonBetweenCards contentPath="comparisonBetweenCardsAPPDEV" /></ScrollReveal>
            <ScrollReveal><LandingChoose contentPath="landingChooseAPPDEV" /></ScrollReveal>
            {/* <ScrollReveal><LandingTestimonialCarousel contentPath="landingTestimonialCarouselAPPDEV" /></ScrollReveal> */}
            {/* <ScrollReveal><PartnersLogo contentPath="partnersLogoAPPDEV" /></ScrollReveal> */}
            {/* <ScrollReveal><LandingCaseStudies contentPath="landingCaseStudies2APPDEV" /></ScrollReveal> */}
            <ScrollReveal><LandingAdditionalServices contentPath="landingAdditionalServices2APPDEV" /></ScrollReveal>
            <ScrollReveal><ContactSection contentPath="contactSectionAPPDEV" /></ScrollReveal>
            <LandingFaq contentPath="landingFaqAPPDEV" />
        </div>
    );
}
