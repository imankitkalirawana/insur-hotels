'use client';
import React from 'react';
import { Tabs, Tab } from '@nextui-org/react';
import Facilities from './facilities';
import Rooms from './rooms';
import WhenToVisit from './when-to-visit';
import HowToGetThere from './how-to-get-there';
import { Hotel, Room } from '@/lib/interface';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Offer from './offer';
import { Weather } from '@/lib/weather';
import ThingsToDo from './things-to-do';
import Gallery from './gallery';

interface Props {
  hotel: Hotel;
  weather: Weather;
  rooms: Room[];
}

export default function Main({ hotel, weather, rooms }: Props) {
  const [currentTab, setCurrentTab] = useState('overview');
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  useEffect(() => {
    if (tab) {
      setCurrentTab(tab);
    } else {
      setCurrentTab('destination');
    }
  }, [tab]);

  let tabs = [
    {
      id: 'destination',
      label: 'Destination',
      content: (
        <>
          {hotel.offers.length > 0 && <Offer hotel={hotel} />}
          <Facilities hotel={hotel} />
          <Rooms rooms={rooms} />
        </>
      )
    },
    {
      id: 'gallery',
      label: 'Gallery',
      content: <Gallery hotel={hotel} />
    },
    {
      id: 'when-to-visit',
      label: 'When to Visit',
      content: <WhenToVisit hotel={hotel} weather={weather} />
    },

    {
      id: 'how-to-get-there',
      label: 'How to get there',
      content: <HowToGetThere hotel={hotel} />
    },
    {
      id: 'things-to-do',
      label: 'Things to Do',
      content: <ThingsToDo hotel={hotel} />
    }
  ];
  return (
    <>
      <Tabs
        aria-label="Options"
        className="mx-auto max-w-[392px] pt-12 min-[340px]:max-w-full"
        items={tabs}
        selectedKey={currentTab}
        id="hotel-tabs"
        radius="full"
        color="primary"
      >
        {(item) => (
          <Tab
            key={item.id}
            title={item.label}
            href={`/${hotel.slug}?tab=${item.id}#hotel-tabs`}
            as={Link}
          >
            {item.content}
          </Tab>
        )}
      </Tabs>
    </>
  );
}
