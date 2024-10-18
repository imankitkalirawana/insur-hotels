'use client';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  Accordion,
  AccordionItem,
  Button,
  Divider,
  Input,
  Link as NextLink
} from '@nextui-org/react';
import Link from 'next/link';
import { Image } from '@nextui-org/react';
import { Hotel, Website } from '@/lib/interface';
import { toast } from 'sonner';
import { useFormik } from 'formik';

interface Props {
  website: Website;
  hotels: Hotel[];
}

export default function Footer({ website, hotels }: Props) {
  const formik = useFormik({
    initialValues: {
      email: ''
    },
    onSubmit: async (values) => {
      try {
        await fetch(`/api/newsletter`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        }).then((res) => {
          if (res.ok) {
            toast.success('Subscribed to Newsletter');
          } else {
            toast.error('Already Exists');
          }
        });
      } catch (error: any) {
        toast.error(error.response.data.message);
        console.log(error);
      }
    }
  });

  return (
    <>
      <div className="relative mt-24 flex w-full translate-y-0 flex-col items-center justify-between bg-secondary/30 bg-cover px-4 pb-12">
        <div className="relative mx-auto flex w-full max-w-7xl flex-col justify-between py-12">
          <div className="mb-12 flex w-full items-center justify-between">
            <div className="flex flex-col">
              <p className="text-xl font-semibold">
                Subscribe to our Newsletter
              </p>
              <p className="text-default-700">
                Get the latest news and offers from {website.name}
              </p>
            </div>
            <form
              onSubmit={formik.handleSubmit}
              className="flex items-center gap-4"
            >
              <Input
                name="email"
                type="email"
                placeholder="Enter your email"
                radius="full"
                classNames={{
                  inputWrapper: 'pr-0'
                }}
                size="lg"
                onChange={formik.handleChange}
                value={formik.values.email}
                endContent={
                  <Button
                    color="primary"
                    type="submit"
                    onPress={() => {
                      console.log('pressed');
                    }}
                    size="lg"
                    className="px-8"
                    radius="full"
                    name="submit"
                    isLoading={formik.isSubmitting}
                  >
                    Subscribe
                  </Button>
                }
              />
            </form>
          </div>
          <div className="flex items-center justify-between gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Icon icon="tabler:mail-filled" className="text-xl" />
                <Link
                  href={`mailto:${website?.email}`}
                  className="text-foreground hover:text-primary hover:underline"
                  target="_blank"
                >
                  {website?.email}
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="solar:phone-bold" className="text-xl" />
                <Link
                  href={`tel:${website?.phone}`}
                  className="text-foreground hover:text-primary hover:underline"
                  target="_blank"
                >
                  {website?.phone}
                </Link>
              </div>
              <div className="flex items-start gap-2">
                <Icon icon="mdi:location" className="text-xl" />
                <ul>
                  {hotels.map((hotel) => (
                    <li key={`footer-hotel-${hotel.slug}`}>
                      <Link
                        href={`/${hotel.slug}`}
                        className="text-foreground hover:text-primary hover:underline"
                      >
                        {hotel.location}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Image
                src="/logo.png"
                width={200}
                height={100}
                alt="insur-hotel"
                loading="lazy"
                className="w-48 object-contain"
              />

              <div className="flex flex-col gap-4 sm:flex-row">
                {website?.socials?.slice(0, 4).map((social) => (
                  <NextLink
                    href={social.url}
                    key={social.name}
                    className="hover:underline"
                    target="_blank"
                  >
                    {social.name}
                  </NextLink>
                ))}
              </div>
            </div>
            <Accordion
              aria-label="Insur Hotel Contact"
              isCompact
              className="max-w-sm"
            >
              {hotels.map((hotel) => (
                <AccordionItem
                  key={hotel._id}
                  aria-label={`${hotel.name} contact details`}
                  title={hotel.name}
                >
                  <ul>
                    <li className="flex items-center gap-2">
                      <Icon icon="tabler:mail-filled" className="text-xl" />
                      <Link
                        href={`mailto:${hotel?.email}`}
                        className="hover:text-primary hover:underline"
                        target="_blank"
                      >
                        {hotel?.email}
                      </Link>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon icon="solar:phone-bold" className="text-xl" />
                      <Link
                        href={`tel:${hotel?.phone}`}
                        className="hover:text-primary hover:underline"
                        target="_blank"
                      >
                        {hotel?.phone}
                      </Link>
                    </li>
                  </ul>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <Divider className="my-12" />
          <div className="flex flex-col-reverse items-center justify-between gap-4 lg:flex-row">
            <p className="text-center">
              @copyright {new Date().getFullYear()}, Insur Hotels, All Rights
              Reserved
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-4">
              <li>
                <Link href="/" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#locations" className="hover:underline">
                  Locations
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:underline">
                  Offers
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:underline">
                  Membership
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
