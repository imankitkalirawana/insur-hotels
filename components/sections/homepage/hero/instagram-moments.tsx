'use client';

import Iphone15Pro from '@/components/magicui/iphone-15-pro';
import { Hotel, Website } from '@/lib/interface';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Card } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

interface Props {
  website: Website;
  hotels: Hotel[];
}

export default function InstagramMoments({ website, hotels }: Props) {
  if (!website || !hotels) return null;
  return (
    <>
      <div className="relative flex min-h-screen w-full translate-y-0 flex-col items-center justify-between bg-cover px-2 py-12">
        <div className="relative flex h-full w-full max-w-7xl flex-col items-center justify-between gap-12">
          <div className="md:self-start">
            <h2 className="text-4xl font-medium md:text-7xl">
              <span className="text-primary">Instagramable</span>{' '}
              {/* <br className="hidden md:block" /> */}
              Moments
            </h2>
          </div>
        </div>
        <div className="mt-12 flex w-full flex-col-reverse items-center justify-center gap-4 md:flex-row md:items-stretch lg:gap-12">
          <div className="grid h-[50%] grid-cols-6 grid-rows-2 gap-8 md:max-w-[33%] md:self-end">
            {hotels.slice(0, 4).map((item, index) => (
              <Card
                key={item._id}
                className={cn(
                  'group col-span-full flex aspect-[5/2] h-36 flex-row gap-4 rounded-3xl border border-default md:col-span-5 md:h-28 lg:h-36',
                  index % 2 === 0 ? 'xl:col-start-1' : 'xl:col-start-2'
                )}
              >
                <Image
                  alt="hotel"
                  width={200}
                  height={200}
                  src={item.src}
                  className="aspect-square h-full rounded-l-2xl object-cover transition-all duration-500 group-hover:scale-105"
                />
                <div className="flex flex-col justify-between gap-2 py-2 pr-4">
                  <div>
                    <h3 className="text-lg font-medium leading-tight">
                      {item.name}
                    </h3>
                    <p className="h-10 overflow-hidden text-ellipsis text-sm font-light text-[#787373]">
                      {item.description}
                    </p>
                  </div>
                  <Button
                    className="bg-[#0095f6] font-medium text-white"
                    size="sm"
                    as={'a'}
                    href={`https://instagram.com/${item.instagram}`}
                    target="_blank"
                  >
                    Follow
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <Iphone15Pro>
            <Suspense fallback={<div>Loading...</div>}>
              <video
                src={website?.instagrammableMoment?.video?.src}
                className="flex h-full object-cover"
                muted
                autoPlay
                loop
                controls={false}
                playsInline
                height={600}
                width={300}
                preload="auto"
              ></video>
            </Suspense>
          </Iphone15Pro>
          <div className="mt-12 hidden flex-col justify-between md:flex md:max-w-[23%]">
            <div className="flex flex-col items-center gap-4 md:items-start">
              <p className="text-[#787373]">
                {website?.instagrammableMoment?.text}
              </p>
              <Button
                color="primary"
                size="lg"
                endContent={<Icon icon="tabler:arrow-right" fontSize={20} />}
                as={Link}
                href={`https://${website?.instagrammableMoment?.url}`}
                target="_blank"
                radius="full"
              >
                Follow us
              </Button>
            </div>
            <div className="mt-8 flex flex-col items-center gap-2 self-center rounded-xl bg-default p-4 pt-2 md:self-end">
              <span>Scan Here</span>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${website?.instagrammableMoment?.url} `}
                alt=""
                width={100}
                height={100}
                className="mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

interface CardProps {
  _id: string;
  title: string;
  url: string;
  src: string;
  description: string;
  className?: string;
}

const items: CardProps[] = [
  {
    _id: '1',
    title: 'Seraibagh',
    url: '/instagram.jpg',
    src: '/4.png',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum, error nemo ad libero consectetur laudantium vel temporibus?'
  },
  {
    _id: '2',
    title: 'Winged Villa',
    url: '/instagram.jpg',
    src: '/hotel-1.jpeg',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum, error nemo ad libero consectetur laudantium vel temporibus?'
  },
  {
    _id: '3',
    title: 'Riverwalk',
    url: '/instagram.jpg',
    src: '/3.png',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum, error nemo ad libero consectetur laudantium vel temporibus?'
  }
];
