'use client';

import { Website as WebsiteInterface } from '@/lib/interface';
import { Tabs, Tab } from '@nextui-org/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Overview from './overview';
import Banner from './banner';
import About from './about';
import Facilities from './facilities';
import Testimonials from './testimonials';
import Socials from './socials';
import InstagrammableMoments from './instagrammable-moments';

interface Props {
  website: WebsiteInterface;
}

export default function Website({ website }: Props) {
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
      content: <Overview website={website} />
    },
    {
      id: 'banner',
      label: 'Banner',
      content: <Banner website={website} />
    },
    {
      id: 'about',
      label: 'About',
      content: <About website={website} />
    },
    {
      id: 'facilities',
      label: 'Facilities',
      content: <Facilities website={website} />
    },
    {
      id: 'socials',
      label: 'Socials',
      content: <Socials website={website} />
    },
    {
      id: 'instagram',
      label: 'Instagrammable Moments',
      content: <InstagrammableMoments website={website} />
    },
    {
      id: 'testimonials',
      label: 'Testimonials',
      content: <Testimonials website={website} />
    }
  ];

  return (
    <>
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
              href={`/dashboard/website?tab=${item.id}`}
              as={Link}
              aria-label="Website Tab"
            >
              {item.content}
            </Tab>
          )}
        </Tabs>
      </div>
    </>
  );
}
