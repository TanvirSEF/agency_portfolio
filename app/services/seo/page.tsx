"use client"

import GetAQuote from "@/components/revisionComponents/GetAQuote";
import GetAQuoteV2 from "@/components/revisionComponents/GetAQuoteV2";
import HelpBuildWeb from "@/components/revisionComponents/HelpBuildWeb";
import MarqueeSection from "@/components/revisionComponents/MarqueeSection";
import MediaFeaturesSection from "@/components/revisionComponents/MediaFeaturesSection";
import RevisionFaqSection from "@/components/revisionComponents/RevisionFaqSection";
import ServiceHero from "@/components/revisionComponents/ServiceHero";
import ServiceKeyFacts from "@/components/revisionComponents/ServiceKeyFacts";
import ServicesShowcase from "@/components/revisionComponents/ServicesShowcase";
import ServicesShowcaseV2 from "@/components/revisionComponents/ServicesShowcaseV2";
import ServiceWorkflowProcess from "@/components/revisionComponents/ServiceWorkflowProcess";
import StackMarquee from "@/components/revisionComponents/StackMarquee";
import StickySection from "@/components/revisionComponents/StickySection";
import TwoColumnSection from "@/components/revisionComponents/TwoColumnSection";
import WebAgencyWhyChooseUs from "@/components/revisionComponents/WebAgencyWhyChooseUs";
import { useWebDevContent } from "@/revision-json-content/web-development/useWebDevContent";


export default function Page() {
  const content = useWebDevContent();

  return (
    <div>
        <ServiceHero content={content.serviceHero} />
        <TwoColumnSection content={content.twoColumnSection} />
        <MarqueeSection content={content.marqueeSection} />
        <ServicesShowcaseV2 />
        <WebAgencyWhyChooseUs content={content.webAgencyWhyChooseUs} />
        <HelpBuildWeb content={content.helpBuildWeb} />
        <ServiceWorkflowProcess />   
        <ServiceKeyFacts content={content.serviceKeyFacts} />
        <GetAQuoteV2 />
        <RevisionFaqSection content={content.revisionFaqSection} />
    </div>
  );
}
