'use client';
import { useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar } from '@nextui-org/react';
import Image from 'next/image';

interface items {
  _id: string;
  src: string;
  name: string;
  comment: string;
}

export const ParallaxScroll = ({
  className,
  items
}: {
  className?: string;
  items: items[];
}) => {
  const gridRef = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    container: gridRef,
    offset: ['start start', 'end start']
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(
    scrollYProgress,
    [0, 1],
    [isMobile ? 0 : 50, 200]
  );
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const third = Math.ceil(items.length / 3);

  const firstPart = items.slice(0, third);
  const secondPart = items.slice(third, 2 * third);
  const thirdPart = items.slice(2 * third);
  // const fourthPart = items.slice(3 * third);

  return (
    <div
      className={cn(
        'relative mt-12 w-full items-start overflow-hidden',
        className
      )}
      ref={gridRef}
    >
      {/* <div className="absolute inset-0 top-0 z-10 bg-gradient-to-b from-white to-transparent to-20%"></div> */}
      <div className="absolute inset-0 bottom-0 z-10 bg-gradient-to-t from-white to-transparent to-20%"></div>
      <div
        className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-4 px-10 sm:grid-cols-2 md:gap-10 lg:grid-cols-3"
        ref={gridRef}
      >
        <div className="grid gap-4 md:gap-10">
          {firstPart.map((el, idx) => (
            <motion.div
              style={{ y: translateFirst }}
              key={'grid-1' + idx}
              className="flex w-full flex-col gap-4 rounded-3xl border border-default bg-white/40 p-4 backdrop-blur-sm"
            >
              <div className="flex items-start gap-2">
                {/* <Avatar src={el.src} /> */}
                <Image
                  src={el.src}
                  alt={el.name}
                  className="aspect-square rounded-full object-cover"
                  width={40}
                  height={40}
                  loading="lazy"
                />
                <h3 className="font-semibold">{el.name}</h3>
              </div>
              <p className="text-foreground/70">{el.comment}</p>
            </motion.div>
          ))}
        </div>
        <div className="grid gap-4 md:grid md:gap-10">
          {secondPart.map((el, idx) => (
            <motion.div
              style={{ y: translateSecond }}
              key={'grid-2' + idx}
              className="flex w-full flex-col gap-4 rounded-3xl border border-default bg-white/40 p-4 backdrop-blur-sm"
            >
              <div className="flex items-start gap-2">
                <Image
                  src={el.src}
                  alt={el.name}
                  className="aspect-square rounded-full object-cover"
                  width={40}
                  height={40}
                  loading="lazy"
                />{' '}
                <h3 className="font-semibold">{el.name}</h3>
              </div>
              <p className="text-foreground/70">{el.comment}</p>
            </motion.div>
          ))}
        </div>
        <div className="hidden gap-4 md:gap-10 lg:grid">
          {thirdPart.map((el, idx) => (
            <motion.div
              style={{ y: translateThird }}
              key={'grid-3' + idx}
              className="flex w-full flex-col gap-4 rounded-3xl border border-default bg-white/40 p-4 backdrop-blur-sm"
            >
              <div className="flex items-start gap-2">
                <Image
                  src={el.src}
                  alt={el.name}
                  className="aspect-square rounded-full object-cover"
                  width={40}
                  height={40}
                  loading="lazy"
                />{' '}
                <h3 className="font-semibold">{el.name}</h3>
              </div>
              <p className="text-foreground/70">{el.comment}</p>
            </motion.div>
          ))}
        </div>
        {/* <div className="hidden gap-4 md:gap-10 xl:grid">
          {fourthPart.map((el, idx) => (
            <motion.div
              style={{ y: translateSecond }}
              key={'grid-3' + idx}
              className="flex w-full flex-col gap-4 rounded-3xl border border-default bg-white/40 p-4 backdrop-blur-sm"
            >
              <div className="flex items-start gap-2">
                <Avatar src={el.src} />
                <h3 className="font-semibold">{el.name}</h3>
              </div>
              <p className="text-foreground/70">{el.comment}</p>
            </motion.div>
          ))}
        </div> */}
      </div>
    </div>
  );
};
