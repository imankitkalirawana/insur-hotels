'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Website } from '@/lib/interface';

interface Props {
  website: Website;
}

export default function Banner({ website }: Props) {
  const images = website?.banner?.images.map((image) => image.src);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images?.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images?.length]);

  const fadeAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 1 }
  };

  return (
    <div>
      <div className="relative flex min-h-screen overflow-y-hidden">
        <AnimatePresence>
          <motion.div
            key={currentIndex}
            className="absolute top-0 h-full w-full"
            {...fadeAnimation} // Spread the animation properties
          >
            <Image
              alt="banner"
              src={images && images[currentIndex]}
              className="absolute top-0 aspect-video min-h-screen w-full object-cover"
              loading="lazy"
              width={1500}
              height={800}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1500px"
            />
          </motion.div>
        </AnimatePresence>

        <div
          className="absolute inset-0 left-0 top-0 min-h-screen object-cover"
          style={{
            background:
              'radial-gradient(circle, rgba(63,94,251,0) 0%, rgba(15,15,15,1) 100%)'
          }}
        ></div>

        <div className="relative flex flex-col items-start justify-center gap-12 px-4 text-white md:px-12 lg:flex-row lg:justify-between">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between lg:flex-row lg:items-center">
            <div className="max-w-4xl md:mt-12">
              <h4
                className="text-secondary"
                dangerouslySetInnerHTML={{
                  __html: website?.banner?.preText
                }}
              />
              <div
                className="text-[50px] font-black leading-[50px] lg:whitespace-nowrap lg:text-[100px] lg:leading-[100px]"
                dangerouslySetInnerHTML={{
                  __html: website?.banner?.heading
                }}
              />

              <p
                className="mt-4 text-lg font-light text-default-50"
                dangerouslySetInnerHTML={{
                  __html: website?.banner?.text
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
