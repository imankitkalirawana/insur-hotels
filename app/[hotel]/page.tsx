import React from 'react';
import { Hotel, Room, Website } from '@/lib/interface';
import Error from '@/app/error';
import { isCaching } from '@/lib/config';
import Banner from '@/components/sections/hotel/banner';
import Footer from '@/components/sections/homepage/hero/footer';
import Main from '@/components/sections/hotel/main';
import {
  getHotels,
  getRooms,
  getRoomsWithHotelId,
  getWeather,
  getWebsite
} from '@/functions/get';
import { Weather } from '@/lib/weather';
import { Metadata } from 'next';

interface PageProps {
  params: {
    hotel: string;
  };
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/hotels/name/${params.hotel}`,
    {
      cache: isCaching ? 'default' : 'no-cache'
    }
  );

  if (res.ok) {
    const hotel: Hotel = await res.json();

    return {
      title: hotel.pageTitle,
      description: hotel.metaDescription,
      keywords: hotel.keywords,
      openGraph: {
        title: hotel.pageTitle,
        description: hotel.metaDescription,
        images: hotel.og
      },
      twitter: {
        card: 'summary_large_image',
        images: hotel.og
      }
    };
  } else {
    return {
      title: 'Hotel Not Found',
      description: 'The requested hotel could not be found.'
    };
  }
}

export default async function Page({ params }: PageProps) {
  const hotels: Hotel[] = await getHotels();
  const website: Website = await getWebsite();
  const rooms: Room[] = await getRoomsWithHotelId(params.hotel);

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/hotels/name/${params.hotel}`,
    {
      cache: isCaching ? 'default' : 'no-cache'
    }
  );

  if (res.ok) {
    const hotel: Hotel = await res.json();
    // const weather: Weather = await getWeather(
    //   hotel.coordinates.latitude,
    //   hotel.coordinates.longitude
    // );
    // @ts-ignore
    const weather: Weather = null as Weather;

    return (
      <>
        <Banner hotel={hotel} weather={weather} />
        <div className="mx-auto flex flex-col">
          <Main hotel={hotel} weather={weather} rooms={rooms} />
        </div>
        <Footer website={website} hotels={hotels} />
      </>
    );
  } else {
    return <Error />;
  }
}
