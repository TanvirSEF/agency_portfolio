'use client';

import Image from '@/components/common/SeoImage';

export default function ScrollLogo({ count }: { count: number }) {
  return (
    <div>
      <Image
        src={`/assets/images/scroll-logos/gray/scroll-logo${count}.png`}
        alt="Client logo"
        width={260}
        height={30}
        className="px-8"
      />
    </div>
  );
}
