'use client';

import { ParallaxGallery } from '@/components/ui/parallax-gallery';
import { Hotel } from '@/lib/interface';
import { Accordion, AccordionItem, ScrollShadow } from '@nextui-org/react';

interface Props {
  hotel: Hotel;
}

export default function Gallery({ hotel }: Props) {
  const images = hotel.gallery.map((image) => image.src);

  return (
    <div className="relative mx-auto flex max-w-7xl flex-col p-4">
      <div className="mb-4 flex flex-col items-center justify-between gap-4">
        <div className="flex max-w-3xl flex-col gap-4">
          <h2 className="text-center text-3xl font-bold md:text-start">
            Some glimpse of <span className="text-primary">{hotel.name}</span>
          </h2>
        </div>
      </div>
      {/* <ScrollShadow className="h-[40rem]"> */}
      <ParallaxGallery images={images} />
      {/* </ScrollShadow> */}
    </div>
  );
}
