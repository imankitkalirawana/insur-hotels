'use client';
import { ParallaxScroll } from '@/components/ui/parallax-scroll';
import { Website } from '@/lib/interface';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

interface Props {
  website: Website;
}

export default function Testimonials({ website }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <section id="projects" className="relative mx-auto w-full max-w-7xl">
      <div className="flex flex-col items-start overflow-hidden pb-8">
        <div className="pt-12">
          <h2 className="text-4xl font-medium md:text-7xl">
            What our {/* <br className="hidden md:block" /> */}
            <span className="text-primary">Clients</span> Says
          </h2>
        </div>
        <motion.div className="mx-auto flex flex-col gap-24 p-4 md:p-12">
          <ParallaxScroll
            items={
              isMobile
                ? website?.testimonials?.slice(0, 6)
                : website?.testimonials?.slice(0, 15)
            }
          />
        </motion.div>
      </div>
    </section>
  );
}
