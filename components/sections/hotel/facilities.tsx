import { Hotel } from '@/lib/interface';
import { cn } from '@nextui-org/react';
import Image from 'next/image';

interface Props {
  hotel: Hotel;
}

export default function Facilities({ hotel }: Props) {
  // hotel.premiumFacilities = hotel.premiumFacilities.slice(0, 1);
  return (
    <>
      <div className="relative mx-auto flex w-full max-w-7xl translate-y-0 flex-col items-center justify-between bg-cover px-4">
        <div className="relative flex h-full w-full max-w-7xl flex-col items-center justify-between gap-12">
          <div className="flex w-full flex-col items-start justify-between gap-12 md:self-start">
            <h2 className="text-4xl font-medium md:text-7xl">
              Exclusive <span className="text-primary">Premium</span> Facilities
            </h2>
            <p className="max-w-sm justify-end font-light">
              Our exclusive amenities include a luxurious swimming pool and
              breathtaking integrated views. Every corner is meticulously
              designed to create an exceptional ambiance
            </p>
          </div>
        </div>
        <div
          className={cn(
            `mt-8 grid w-full grid-cols-1 justify-center gap-4 sm:grid-cols-2 md:grid-cols-3`,
            hotel.premiumFacilities.length === 1
              ? 'max-w-xl sm:grid-cols-1 md:grid-cols-1'
              : hotel.premiumFacilities.length === 2
                ? 'sm:grid-cols-2 md:grid-cols-2'
                : hotel.premiumFacilities.length === 3
                  ? 'sm:grid-cols-3 md:grid-cols-3'
                  : hotel.premiumFacilities.length === 4
                    ? 'max-w-4xl sm:grid-cols-2 md:grid-cols-2'
                    : ''
          )}
        >
          {hotel.premiumFacilities.map((item) => (
            <div key={item.name} className="flex flex-col">
              <Image
                alt="hotel"
                src={item.src}
                className="aspect-video w-full rounded-3xl object-cover"
                width={300}
                height={180}
              />
              <div className="mt-4">
                <h3 className="text-xl capitalize">{item.name}</h3>
                <p
                  title={item.description}
                  className="h-[3.75rem] overflow-hidden overflow-ellipsis text-sm font-light text-default-500"
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* other facilities */}
        <div className="relative mt-24 flex h-full w-full max-w-7xl flex-col items-start justify-between gap-12">
          <div className="flex w-full flex-col items-center justify-between gap-12 md:flex-row md:items-start">
            <h2 className="text-4xl font-medium md:text-7xl">
              Other <span className="text-primary">Existing</span> Facilities
            </h2>
            <div className="grid grid-cols-3 gap-8">
              {hotel.otherFacilities.map((item) => (
                <div key={item.name} className="flex w-28 flex-col">
                  <Image
                    alt="hotel"
                    src={item.src}
                    className="aspect-square rounded-full object-cover"
                    width={150}
                    height={150}
                  />
                  <p className="mt-2 text-center text-sm font-light capitalize leading-tight text-[#414243]">
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
