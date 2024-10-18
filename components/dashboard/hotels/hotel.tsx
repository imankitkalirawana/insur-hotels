'use client';

import Overview from '@/components/dashboard/hotels/Overview';
import { Hotel as HotelInterface } from '@/lib/interface';
import { Tabs, Tab } from '@nextui-org/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Banner from './features/banner';
import PremiumFacility from './features/premium-facility';
import OtherFacility from './features/other-facility';
import Offers from './features/offers';
import WhenToVisit from './features/when-to-visit';
import HowToGetThere from './features/how-to-get-there';
import ThingsToDo from './features/things-to-do';
import Gallery from './features/gallery';

interface Props {
  hotel: HotelInterface;
}

export default function Hotel({ hotel }: Props) {
  const [currentTab, setCurrentTab] = useState('overview');
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  useEffect(() => {
    if (tab) {
      setCurrentTab(tab);
    }
  }, [tab]);

  let tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: <Overview hotel={hotel} />
    },
    {
      id: 'banner',
      label: 'Banner',
      content: <Banner hotel={hotel} />
    },
    {
      id: 'gallery',
      label: 'Gallery',
      content: <Gallery hotel={hotel} />
    },
    {
      id: 'premium-facilities',
      label: 'Premium Facilities',
      content: <PremiumFacility hotel={hotel} />
    },
    {
      id: 'other-facilities',
      label: 'Other Facilities',
      content: <OtherFacility hotel={hotel} />
    },
    {
      id: 'offers',
      label: 'Offers',
      content: <Offers hotel={hotel} />
    },
    {
      id: 'when-to-visit',
      label: 'When to Visit',
      content: <WhenToVisit hotel={hotel} />
    },
    {
      id: 'how-to-get-there',
      label: 'How to get there',
      content: <HowToGetThere hotel={hotel} />
    },
    {
      id: 'things-to-do',
      label: 'Things To Do',
      content: <ThingsToDo hotel={hotel} />
    }
  ];

  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        radius="full"
        items={tabs}
        selectedKey={currentTab}
        color="primary"
      >
        {(item) => (
          <Tab
            key={item.id}
            title={item.label}
            href={`/dashboard/hotels/${hotel.slug}?tab=${item.id}`}
            as={Link}
          >
            {item.content}
          </Tab>
        )}
      </Tabs>
    </div>
  );
}
