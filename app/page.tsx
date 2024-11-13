'use client';
import Banner from '@/components/sections/homepage/banner/banner';
import About from '@/components/sections/homepage/hero/about';
import AppleCarousel from '@/components/sections/homepage/hero/apple-carousel';
import Features from '@/components/sections/homepage/hero/features';
import Footer from '@/components/sections/homepage/hero/footer';
import InstagramMoments from '@/components/sections/homepage/hero/instagram-moments';
import Testimonials from '@/components/sections/homepage/hero/testimonials';
import { getHotels, getWebsite } from '@/functions/get';
import { Hotel, Website } from '@/lib/interface';
import React, { useEffect } from 'react';

export default function Home() {
  // const hotels: Hotel[] = await getHotels();
  // const website: Website = await getWebsite();
  const [website, setWebsite] = React.useState<Website>({} as Website);
  const [hotels, setHotels] = React.useState<Hotel[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const website: Website = await getWebsite();
      const hotels: Hotel[] = await getHotels();
      setWebsite(website);
      setHotels(hotels);
    };
    fetchData();
  }, []);

  return (
    <>
      <Banner website={website} />
      <AppleCarousel items={hotels} />
      <About website={website} />
      <Features website={website} />
      <InstagramMoments website={website} hotels={hotels} />
      <Testimonials website={website} />
      {/* <SocialMedia /> */}
      <Footer website={website} hotels={hotels} />
    </>
  );
}
