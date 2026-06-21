"use client"

import BookConsultant from "@/components/common/BookConsultant";
import JoinUsHelping from "@/components/common/JoinUsHelping";
import LeftThreeImage from "@/components/common/LeftThreeImage";
import OtherHero from "@/components/common/OtherHero";
// import PartnersLogo from "@/components/common/partnersLogo";
import RightThreeImage from "@/components/common/RightThreeImage";
import VideoSection from "@/components/common/VideoSection";
import WePayItForward from "@/components/common/WePayItForward";
// import ContactSection from "@/components/contactSection";

export default function PayItForwardPage() {
    return (
        <div>
            <OtherHero contentPath="otherHeroPayItForward" />
            <LeftThreeImage contentPath="leftThreeImagePayItForward" />
            <RightThreeImage contentPath="rightThreeImagePayItForward" />
            <LeftThreeImage contentPath="leftThreeImage2PayItForward" />
            <RightThreeImage contentPath="rightThreeImage2PayItForward" />

            {/* <JoinUsHelping contentPath="joinUsHelpingPayItForward" /> */}
            <WePayItForward contentPath="wePayItForwardPayItForward" />
            <VideoSection contentPath="videoSectionPayItForward" />
            {/* <PartnersLogo contentPath="partnersLogoDMS" /> */}
            <BookConsultant contentPath="bookConsultantPayItForward" />
        </div>
    );
}
