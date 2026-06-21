"use client"

import Marquee from "react-fast-marquee";
import ScrollLogo from "../scrollLogo";

export default function LogoScroller() {
  return (
    <div>
        <Marquee>
            <ScrollLogo count={1} />
            <ScrollLogo count={2} />
            <ScrollLogo count={3} />
            <ScrollLogo count={4} />
            <ScrollLogo count={5} />
            <ScrollLogo count={4} />
        </Marquee>
    </div>
  );
}
