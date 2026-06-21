"use client"

import GetAQuote from "@/components/revisionComponents/GetAQuote";
import HelpBuildWeb from "@/components/revisionComponents/HelpBuildWeb";
import MarqueeSection from "@/components/revisionComponents/MarqueeSection";
import MediaFeaturesSection from "@/components/revisionComponents/MediaFeaturesSection";
import RevisionFaqSection from "@/components/revisionComponents/RevisionFaqSection";
import ServiceHero from "@/components/revisionComponents/ServiceHero";
import ServiceKeyFacts from "@/components/revisionComponents/ServiceKeyFacts";
import ServicesShowcase from "@/components/revisionComponents/ServicesShowcase";
import StackMarquee from "@/components/revisionComponents/StackMarquee";
import StickySection from "@/components/revisionComponents/StickySection";
import TwoColumnSection from "@/components/revisionComponents/TwoColumnSection";
import WebAgencyWhyChooseUs from "@/components/revisionComponents/WebAgencyWhyChooseUs";
import { useWordPressDevelopmentContent } from "@/revision-json-content/wordpress-development/useWordPressDevelopmentContent";


export default function Page() {
  const content = useWordPressDevelopmentContent();

  return (
    <div>
        <ServiceHero content={content.serviceHero} />
        <TwoColumnSection content={content.twoColumnSection} />
        <MarqueeSection content={content.marqueeSection} />
        <ServicesShowcase content={content.servicesShowcase} />
        <MediaFeaturesSection content={content.mediaFeaturesSection} />
        <StackMarquee content={content.stackMarquee} />
        <HelpBuildWeb content={content.helpBuildWeb} />
        <WebAgencyWhyChooseUs content={content.webAgencyWhyChooseUs} />
        <StickySection content={content.stickySection} />
        <ServiceKeyFacts content={content.serviceKeyFacts} />
        <GetAQuote content={content.getAQuote} />
        <RevisionFaqSection content={content.revisionFaqSection} />
    </div>
  );
}
