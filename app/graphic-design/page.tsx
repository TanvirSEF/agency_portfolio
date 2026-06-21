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
import WeOfferMore from "@/components/common/WeOfferMore";
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
            <OtherHero contentPath="otherHeroGraphicDesign" />
            <ScrollReveal><CompanyIntroSection contentPath="CompanyIntroSectionGraphicDesign" /></ScrollReveal>
            <ScrollReveal><ContentImageSplit contentPath="ContentImageSplitGraphicDesign" /></ScrollReveal>
            <ScrollReveal><LandingDigitalServices
                cardSecCount={2}
                contentPath="landingDigitalServicesGraphicDesign"
                cardContent1="digitalServiceCard1GraphicDesign"
            /></ScrollReveal>
            <ScrollReveal><CardSliderRightToLeft contentPath="cardSliderRightToLeftGraphicDesign" /></ScrollReveal>
            <ScrollReveal><CompanyPotentialsSection contentPath="companyPotentialsSectionGraphicDesign" /></ScrollReveal>
            <ScrollReveal><WorkProcessSection contentPath="workProcessSectionGraphicDesign" /></ScrollReveal>
            <ScrollReveal><BenefitsSection contentPath="benefitsSectionGraphicDesign" /></ScrollReveal>
            <ScrollReveal><ComparisonBetweenCards contentPath="comparisonBetweenCardsGraphicDesign" /></ScrollReveal>
            <ScrollReveal><LandingChoose contentPath="landingChooseGraphicDesign" /></ScrollReveal>
            {/* <ScrollReveal><LandingTestimonialCarousel contentPath="landingTestimonialCarouselGraphicDesign" /></ScrollReveal> */}
            {/* <ScrollReveal><PartnersLogo contentPath="partnersLogoGraphicDesign" /></ScrollReveal> */}
            {/* <ScrollReveal><LandingCaseStudies contentPath="landingCaseStudies2GraphicDesign" /></ScrollReveal> */}
            {/* <ScrollReveal><WeOfferMore contentPath="weOfferMoreGraphicDesign" /></ScrollReveal> */}
            <ScrollReveal><ContactSection contentPath="contactSectionGraphicDesign" /></ScrollReveal>
            <LandingFaq contentPath="landingFaqGraphicDesign" />
        </div>
    );
}
