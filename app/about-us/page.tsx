"use client"

import AllEmployeesSection from "@/components/common/AllEmployeesSection";
import ConceptAndVision from "@/components/common/ConceptAndVision";
import CoveredArea from "@/components/common/CoveredArea";
import DigitalPercentageInOnePlace from "@/components/common/DigitalPercentageInOnePlace";
import FounderMessage from "@/components/common/FounderMessage";
import LeftThreeImage from "@/components/common/LeftThreeImage";
import OtherHero from "@/components/common/OtherHero";
import PartnersLogo from "@/components/common/partnersLogo";
import ScrollReveal from "@/components/common/ScrollReveal";
import VideoSection from "@/components/common/VideoSection";
import WhatWeDo from "@/components/common/WhatWeDo";
import ContactSection from "@/components/contactSection";

export default function AboutUsPage() {
    return (
        <div className="bg-[#F2F3F6]">
            <OtherHero contentPath="otherHeroAboutUs" />
            <ScrollReveal><FounderMessage contentPath="founderMessageAboutUs" /></ScrollReveal>
            <ScrollReveal><CoveredArea contentPath="coveredAreaAboutUs" /></ScrollReveal>
            <ScrollReveal><WhatWeDo contentPath="whatWeDoAboutUs" /></ScrollReveal>
            <ScrollReveal><DigitalPercentageInOnePlace contentPath="digitalPercentageAboutUs" /></ScrollReveal>
            <ScrollReveal><ConceptAndVision contentPath="conceptAndVisionAboutUs" /></ScrollReveal>
            <ScrollReveal><VideoSection contentPath="videoSectionAboutUs" /></ScrollReveal>
            <ScrollReveal><LeftThreeImage contentPath="leftThreeImageAboutUs" /></ScrollReveal>
            <ScrollReveal><AllEmployeesSection contentPath="allEmployeesSectionAboutUs" /></ScrollReveal>
            {/* <PartnersLogo contentPath="partnersLogoDMS" /> */}
            <ContactSection contentPath="contactSectionDMS" />

        </div>
    );
}
