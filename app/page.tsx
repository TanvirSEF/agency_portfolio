import ContactSection from '@/components/contactSection';
import CustomWebDev from '@/components/customWebDev';
import Hero from '@/components/hero';
import LandingAbout from '@/components/landingAbout';
import LandingAdditionalServices from '@/components/landingAdditionalServices';
// import LandingCaseStudies from '@/components/landingCaseStudies';
import LandingChoose from '@/components/landingChoose';
import ScrollReveal from '@/components/common/ScrollReveal';
import LandingDigitalServices from '@/components/landingDigitalServices';
import LandingFaq from '@/components/landingFaq';
import LandingLogoScroller from '@/components/landingLogoScroller';
import LandingMarketingAgency from '@/components/landingMarketingAgency';
// import LandingTestimonialCarousel from '@/components/landingTestimonialCarousel';
import LandingWebblyMediaUpdates from '@/components/landingWebblyMediaUpdates';
import WorkProcessSection from '@/components/workProcessSection';
import Image from '@/components/common/SeoImage';

export default function Home() {
  return (
    <div className="bg-[#F2F3F6]">
      {/* Preload growth popup background image so it’s cached before popup opens */}
      <Image
        src="/assets/images/popup-images/popup-2-gradienat-background.webp"
        alt=""
        width={1}
        height={1}
        priority
        className="pointer-events-none absolute h-px w-px opacity-0"
        aria-hidden
      />
      <Hero contentPath="hero" />
      {/* <LandingLogoScroller contentPath="landingLogoScroller" /> */}
      <ScrollReveal><LandingAbout contentPath="landingAbout" /></ScrollReveal>
      <ScrollReveal><LandingDigitalServices contentPath="landingDigitalServices" /></ScrollReveal>
      <ScrollReveal><CustomWebDev contentPath="customWebDev" /></ScrollReveal>
      <ScrollReveal><LandingAdditionalServices contentPath="landingAdditionalServices" /></ScrollReveal>
      <ScrollReveal><LandingMarketingAgency contentPath="landingMarketingAgency" /></ScrollReveal>
      <ScrollReveal><LandingChoose contentPath="landingChoose" /></ScrollReveal>
      <ScrollReveal>
        <WorkProcessSection contentPath="workProcessSection" />
      </ScrollReveal>
      {/* <ScrollReveal><LandingCaseStudies contentPath="landingCaseStudies" /></ScrollReveal> */}
      {/* <ScrollReveal><LandingTestimonialCarousel contentPath="landingTestimonialCarousel" /></ScrollReveal> */}
      <ScrollReveal><LandingWebblyMediaUpdates /></ScrollReveal>
      <ScrollReveal><ContactSection contentPath="contactSection" /></ScrollReveal>
      <LandingFaq contentPath="landingFaq" />
    </div>
  );
}
