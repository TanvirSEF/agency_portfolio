"use client"

import BenefitsSection from "@/components/common/BenefitsSection";
import CardSliderRightToLeft from "@/components/common/CardSliderRightToLeft";
import CompanyIntroSection from "@/components/common/CompanyIntroSection";
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
import LandingMarketingAgency from "@/components/landingMarketingAgency";
// import LandingTestimonialCarousel from "@/components/landingTestimonialCarousel";
import WorkProcessSection from "@/components/workProcessSection";

export default function Page() {
    return (
        <div>
            <OtherHero contentPath="otherHeroDMS" />
            <ScrollReveal><CompanyIntroSection contentPath="CompanyIntroSectionDMS" /></ScrollReveal>
            <ScrollReveal><ContentImageSplit contentPath="ContentImageSplitDMS" /></ScrollReveal>
            <ScrollReveal><LandingDigitalServices
                contentPath="landingDigitalServicesDMS"
                cardContent1="digitalServiceCard1DMS"
            /></ScrollReveal>
            <ScrollReveal><CardSliderRightToLeft contentPath="cardSliderRightToLeftDMS" /></ScrollReveal>
            <ScrollReveal><WorkProcessSection contentPath="workProcessSectionDMS" /></ScrollReveal>
            <ScrollReveal><LandingMarketingAgency contentPath="landingMarketingAgencyDMS" /></ScrollReveal>
            <ScrollReveal><ComparisonBetweenCards contentPath="comparisonBetweenCardsDMS" /></ScrollReveal>
            <ScrollReveal><LandingChoose contentPath="landingChooseDMS" /></ScrollReveal>
            <ScrollReveal><ContentImageSplit contentPath="ContentImageSplitDMS" /></ScrollReveal>
            {/* <ScrollReveal><LandingTestimonialCarousel contentPath="landingTestimonialCarouselDMS" /></ScrollReveal> */}
            {/* <ScrollReveal><PartnersLogo contentPath="partnersLogoDMS" /></ScrollReveal> */}
            {/* <ScrollReveal><LandingCaseStudies contentPath="landingCaseStudies2DMS" /></ScrollReveal> */}
            <ScrollReveal><LandingAdditionalServices contentPath="landingAdditionalServices2DMS" /></ScrollReveal>
            <ScrollReveal><ContactSection contentPath="contactSectionDMS" /></ScrollReveal>
            <LandingFaq contentPath="landingFaqDMS" />
        </div>
    );
}
