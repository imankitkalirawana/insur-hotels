import { humanReadableDate } from '@/functions/utility';
import { Hotel } from '@/lib/interface';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react/dist/iconify.js';
import Image from 'next/image';

interface Props {
  hotel: Hotel;
}

export default function Offer({ hotel }: Props) {
  return (
    <>
      <div className="mx-auto my-24 flex max-w-7xl flex-col items-center justify-between gap-4 px-4">
        <div className="relative flex h-full w-full max-w-7xl flex-col items-center justify-between gap-12">
          <div className="flex w-full flex-col items-start justify-between gap-12 md:self-start">
            <h2 className="text-4xl font-medium md:text-7xl">
              Get <span className="text-primary">Promo</span> For A Cheaper
              Price
            </h2>
          </div>
        </div>
        <div
          className={cn(
            'mt-8 grid w-full items-center justify-center gap-4 md:grid-cols-2'
            // items.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
          )}
        >
          {hotel.offers.slice(0, 2).map((item) => (
            <div
              key={item._id}
              className="relative col-span-1 flex justify-between overflow-hidden rounded-3xl"
            >
              <Image
                src={item.src}
                width={400}
                height={200}
                alt=""
                className="absolute h-full w-full rounded-3xl object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 left-0 top-0 bg-gradient-to-tr from-black/50 via-black/50 to-black/30 object-cover" />

              <div className="relative flex h-full w-full items-start justify-between p-4">
                <div className="flex h-full flex-col justify-between">
                  <span className="flex size-8 items-center justify-center rounded-full bg-[#fabf4c]">
                    <Icon
                      icon="mynaui:percentage-waves"
                      fontSize={20}
                      stroke="2"
                    />
                  </span>
                  <div className="flex flex-col">
                    <h3 className="mt-4 text-xl text-white">{item.title}</h3>
                    <p className="text-6xl text-white">{item.discount}</p>
                  </div>
                  <p className="text-xs font-light text-white">
                    *with Terms and Conditions
                  </p>
                </div>
                <p className="rounded-full bg-black/20 px-4 py-1 text-center text-xs font-light text-white backdrop-blur-sm">
                  Valid only on {humanReadableDate(item.startDate, 'day-month')}{' '}
                  - {humanReadableDate(item.endDate)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
