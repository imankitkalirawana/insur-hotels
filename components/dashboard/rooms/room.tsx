'use client';

import { Room as RoomInterface, RoomType } from '@/lib/interface';
import { Tabs, Tab } from '@nextui-org/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Overview from './overview';
import Features from './features';
import Images from './images';

interface Props {
  room: RoomInterface;
  roomTypes: RoomType[];
}

export default function Room({ room, roomTypes }: Props) {
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
      content: <Overview room={room} roomType={roomTypes} />
    },
    {
      id: 'features',
      label: 'Features',
      content: <Features room={room} />
    },
    {
      id: 'images',
      label: 'Images',
      content: <Images room={room} />
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
            href={`/dashboard/rooms/${room._id}?tab=${item.id}`}
            as={Link}
          >
            {item.content}
          </Tab>
        )}
      </Tabs>
    </div>
  );
}
