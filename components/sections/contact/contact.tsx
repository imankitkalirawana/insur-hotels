'use client';
import hotel from '@/components/dashboard/hotels/hotel';
import { Hotel } from '@/lib/interface';
import { Weather } from '@/lib/weather';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Tab,
  Tabs
} from '@nextui-org/react';
import { useFormik } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import HotelCard from './hotel-card';

interface Props {
  hotels: Hotel[];
}

export default function Contact({ hotels }: Props) {
  const [currentTab, setCurrentTab] = useState('seriabagh');
  const searchParams = useSearchParams();
  const tab = searchParams.get('hotel');

  useEffect(() => {
    if (tab) {
      setCurrentTab(tab);
    } else {
      setCurrentTab('seraibagh');
    }
  }, [tab]);
  return (
    <>
      <Tabs
        aria-label="Options"
        className="mx-auto max-w-[392px] min-[340px]:max-w-full"
        items={hotels}
        selectedKey={currentTab}
        id="hotel-tabs"
        radius="full"
        color="primary"
      >
        {(item) => (
          <Tab
            key={item.slug}
            title={item.name}
            href={`/contact?hotel=${item.slug}`}
            as={Link}
          >
            <HotelCard hotel={item.slug} />
          </Tab>
        )}
      </Tabs>
    </>
  );
}
