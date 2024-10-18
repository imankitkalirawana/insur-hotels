import React from 'react';
import { Hotel } from '@/lib/interface';
import Image from 'next/image';

interface Props {
  hotel: Hotel;
}

export default function HowToGetThere({ hotel }: Props) {
  return (
    <>
      <div className="relative mx-auto flex max-w-7xl flex-col p-4">
        <div className="flex flex-row-reverse items-center justify-between">
          <Image
            alt=""
            width={224}
            height={224}
            src="/how-to-get-there.png"
            className="hidden w-56 md:flex"
          />
          <div className="flex max-w-3xl flex-col gap-4">
            <h2 className="text-center text-3xl font-bold md:text-start">
              How to get to <span className="text-primary">{hotel.name}</span>
            </h2>
            <p
              className="no-tailwind text-default-700"
              dangerouslySetInnerHTML={{ __html: hotel.howToGetThere?.text }}
            />
          </div>
        </div>
        {hotel.howToGetThere?.location && (
          <iframe
            className="mx-auto mt-8 aspect-square w-full max-w-[700px] rounded-3xl object-cover"
            src={hotel.howToGetThere.location}
            loading="lazy"
          ></iframe>
        )}
      </div>
    </>
  );
}
