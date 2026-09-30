'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Magnet from '@/components/Magnet';
import { Home, ArrowLeft } from 'lucide-react';

const MagicRings = dynamic(() => import('@/components/MagicRings'), { ssr: false });

const easeOut = [0.22, 1, 0.36, 1] as const;

interface NotFoundContentProps {
  /** When inside [locale], pass e.g. "/en" so "Back to home" keeps the locale */
  homeHref?: string;
}

export default function NotFoundContent({ homeHref = '/' }: NotFoundContentProps) {
  const router = useRouter();

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#06010E] px-6 py-24 sm:py-32">
      {/* MagicRings background */}
      <div className="absolute inset-0 z-0">
        <MagicRings
          color="#fc42ff"
          colorTwo="#42fcff"
          ringCount={6}
          speed={1}
          attenuation={10}
          lineThickness={2}
          baseRadius={0.35}
          radiusStep={0.1}
          scaleRate={0.1}
          opacity={1}
          blur={0}
          noiseAmount={0.1}
          rotation={0}
          ringGap={1.5}
          fadeIn={0.7}
          fadeOut={0.5}
          followMouse={false}
          mouseInfluence={0.2}
          hoverScale={1.2}
          parallax={0.05}
          clickBurst={false}
        />
      </div>

      <div className="container relative z-1 mx-auto flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="flex flex-col items-center gap-6"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="text-8xl font-bold uppercase tracking-tighter sm:text-9xl md:text-[10rem]"
            style={{
              fontFamily: 'var(--font-poppins)',
              background: 'linear-gradient(135deg, #fc42ff 0%, #42fcff 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              filter: 'drop-shadow(0 0 30px rgba(252, 66, 255, 0.4))',
            }}
          >
            404
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: easeOut }}
            className="text-2xl font-semibold uppercase tracking-wide text-white sm:text-3xl md:text-4xl"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Page not found
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: easeOut }}
            className="max-w-md text-base text-white/80 sm:text-lg"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
          >
            The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: easeOut }}
            className="mt-4 flex flex-wrap items-center justify-center gap-4"
          >
            <Magnet magnetStrength={4} padding={80}>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                asChild
                magnetDisabled
                className="h-max rounded-full bg-[#06457F] px-6 py-4 text-white hover:bg-[#00D2FF] hover:text-white"
              >
                <Link href={homeHref} className="inline-flex items-center gap-2">
                  <Home className="size-5" aria-hidden />
                  Back to home
                </Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                magnetDisabled
                onClick={() => router.back()}
                className="h-max rounded-full border-white/30 bg-transparent px-6 py-4 text-white hover:bg-white/10 hover:text-white"
              >
                <span className="inline-flex items-center gap-2">
                  <ArrowLeft className="size-5" aria-hidden />
                  Go back
                </span>
              </Button>
              </div>
            </Magnet>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
