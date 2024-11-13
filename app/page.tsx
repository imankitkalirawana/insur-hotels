'use client';
import Banner from '@/components/sections/homepage/banner/banner';
import About from '@/components/sections/homepage/hero/about';
import AppleCarousel from '@/components/sections/homepage/hero/apple-carousel';
import Features from '@/components/sections/homepage/hero/features';
import Footer from '@/components/sections/homepage/hero/footer';
import InstagramMoments from '@/components/sections/homepage/hero/instagram-moments';
import Testimonials from '@/components/sections/homepage/hero/testimonials';
import { getHotels, getWebsite } from '@/functions/get';
import { API_BASE_URL, isCaching } from '@/lib/config';
import { Hotel, Website } from '@/lib/interface';
import React, { useEffect } from 'react';

export default function Home() {
  // const hotels: Hotel[] = await getHotels();
  // const website: Website = await getWebsite();
  const [website, setWebsite] = React.useState<Website>({} as Website);
  const [hotels, setHotels] = React.useState<Hotel[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${API_BASE_URL}/website`, {
        cache: isCaching ? 'default' : 'no-cache'
      });
      const website: Website = await res.json();
      setWebsite(website);

      const resHotels = await fetch(`${API_BASE_URL}/hotels`, {
        cache: isCaching ? 'default' : 'no-cache'
      });
      const hotels: Hotel[] = await resHotels.json();
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
