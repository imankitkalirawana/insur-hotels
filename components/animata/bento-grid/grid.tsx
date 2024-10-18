'use client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const items = [
  {
    id: 1,
    title: 'Prime location',
    description:
      'Experience the ultimate luxury in our exclusive resorts, where you can unwind with your loved ones and truly immerse yourself in our beautiful rooms.',
    image: '/1.png',
    className: 'md:col-span-4',
    backgroundTextClassName:
      'absolute bottom-[5%] translate-y-[-50%] text-2xl lg:text-4xl'
  },
  {
    id: 2,
    title: 'Close to Nature',
    description:
      'Experience the ultimate luxury in our exclusive resorts, where you can unwind with your loved ones and truly immerse yourself in our beautiful rooms.',
    image: '/2.png',
    className: 'md:row-span-2 md:col-span-2',
    backgroundTextClassName:
      'absolute bottom-[0%] left-[50%] translate-x-[-50%] translate-y-[-50%] whitespace-nowrap text-2xl lg:text-4xl'
  },
  {
    id: 3,
    title: 'Luxurious',
    description:
      'Experience the ultimate luxury in our exclusive resorts, where you can unwind with your loved ones and truly immerse yourself in our beautiful rooms.',
    image: '/3.png',
    backgroundTextClassName:
      'absolute bottom-[0%] left-[50%] translate-x-[-50%] translate-y-[-50%] whitespace-nowrap text-2xl lg:text-3xl'
  },
  {
    id: 4,
    title: 'Food & Flavor',
    description:
      'Experience the ultimate luxury in our exclusive resorts, where you can unwind with your loved ones and truly immerse yourself in our beautiful rooms.',
    image: '/4.png',
    className: 'md:row-span-2',
    backgroundTextClassName:
      'absolute text-center left-[50%] translate-x-[-50%] md:text-3xl text-2xl'
  },
  {
    id: 5,
    title: 'Wildlife Photography',
    description:
      'Experience the ultimate luxury in our exclusive resorts, where you can unwind with your loved ones and truly immerse yourself in our beautiful rooms.',
    image: '/5.png',
    className: 'md:row-span-2',
    backgroundTextClassName: 'absolute right-1 text-end !text-base bottom-2'
  },
  {
    id: 6,
    description:
      'Experience the ultimate luxury in our exclusive resorts, where you can unwind with your loved ones and truly immerse yourself in our beautiful rooms.',
    image: '/6.png'
  },
  {
    id: 7,
    description:
      'Experience the ultimate luxury in our exclusive resorts, where you can unwind with your loved ones and truly immerse yourself in our beautiful rooms.',
    image: '/7.png'
  },
  {
    id: 8,
    title: 'Hospitality',
    description:
      'Experience the ultimate luxury in our exclusive resorts, where you can unwind with your loved ones and truly immerse yourself in our beautiful rooms.',
    image: '/8.png',
    className: 'md:col-span-3',
    backgroundTextClassName:
      'absolute top-[50%] translate-y-[-50%] md:text-3xl text-2xl'
  }
];

function BentoCard({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden rounded-2xl p-4',
        className
      )}
    >
      {children}
    </div>
  );
}

interface FeatureProps {
  className?: string;
  backgroundImage?: string;
  text?: string;
  backgroundTextClassName?: string;
}

function Feature({
  className,
  backgroundImage = '/hotel-1.jpeg',
  text,
  backgroundTextClassName
}: FeatureProps) {
  return (
    <BentoCard
      className={cn(
        'transition-all] flex min-h-36 flex-col font-lovelace',
        className
      )}
    >
      <motion.div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`
        }}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 15 }}
        variants={{
          hidden: { scale: 1.25 },
          visible: { scale: 1 }
        }}
        whileHover={{ scale: 1.1 }}
      >
        <div className="absolute inset-0 z-10 bg-black opacity-20"></div>
      </motion.div>
      <div
        className={cn(
          'relative text-white md:text-xl',
          backgroundTextClassName
        )}
      >
        {text}
      </div>
    </BentoCard>
  );
}

export default function Grid() {
  return (
    <div className="grid min-h-[70vh] w-full gap-2 sm:grid-cols-2 sm:grid-rows-2 md:grid-cols-6 md:gap-4">
      {items.map((item) => (
        <Feature
          key={item.id}
          backgroundImage={item.image}
          text={item.title}
          backgroundTextClassName={item.backgroundTextClassName}
          className={item.className}
        />
      ))}
    </div>
  );
}
