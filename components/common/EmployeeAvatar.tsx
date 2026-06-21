"use client"

import Image from "@/components/common/SeoImage";
import { RichTextBlock, richTextToPlainText } from "./RichTextContent";

interface EmployeeAvatarProps {
  imageSrc?: string;
  imageSeo?: unknown;
  name?: string;
  title?: string;
}

export default function EmployeeAvatar({
  imageSrc = 'https://avatars.githubusercontent.com/u/257024568?v=4',
  imageSeo,
  name = 'Marchello Josefsson & Farima Alimi',
  title = 'Founder & CEO',
}: EmployeeAvatarProps) {
  return (
    <div className="p-2 overflow-hidden">
      <div className="w-[250px] flex flex-col items-center gap-2">
        <div className="bg-blue-300 rounded-full overflow-hidden border-10 border-white w-[250px] aspect-square">
          <Image src={imageSrc} seo={imageSeo as any} alt={richTextToPlainText(name)} width={250} height={250} />
        </div>
        <RichTextBlock
          as="div"
          content={name}
          defaultTag="h3"
          className="text-center font-bold uppercase text-[#1E1F21]"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)' }}
        />
        <RichTextBlock
          as="div"
          content={title}
          defaultTag="p"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)' }}
        />
      </div>
    </div>
  );
}
