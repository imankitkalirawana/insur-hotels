'use client';
import React from 'react';
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from '@nextui-org/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { IconChevronDown } from '@tabler/icons-react';
import { Hotel } from '@/lib/interface';
import { Icon } from '@iconify/react/dist/iconify.js';
import Image from 'next/image';

interface Props {
  hotels: Hotel[];
  session: any;
}

export default function Navbar({ hotels, session }: Props) {
  const pathname = usePathname();
  if (pathname.includes('/auth') || pathname.includes('/dashboard'))
    return null;

  return (
    <div className="mx-auto flex max-w-7xl items-center justify-between bg-background p-4">
      <div className="flex items-center gap-4 lg:gap-12">
        <Link href={'/'}>
          <Image
            width={100}
            height={50}
            src="/logo.png"
            alt="insur-hotel"
            className="w-[100px]"
          />
        </Link>
        <ul className="hidden items-center gap-8 md:flex">
          <li>
            <Dropdown className="cursor-pointer backdrop-blur-sm">
              <DropdownTrigger>
                <span className="flex cursor-pointer items-center">
                  Locations <IconChevronDown size={20} className="ml-1" />
                </span>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Hotels Selection"
                className="bg-transparent"
              >
                {hotels?.map((hotel) => (
                  <DropdownItem key={hotel.slug} as={Link} href={hotel.slug}>
                    {hotel.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </li>
          <li>
            <Link href={'#'}>About Us</Link>
          </li>
          <li>
            <Link href={'#'}>Offers</Link>
          </li>
          <li>
            <Link href={'#'}>Membership</Link>
          </li>
          <li>
            <Link href={'/contact'}>Contact</Link>
          </li>
        </ul>
      </div>
      <div className="flex items-center gap-4">
        {session ? (
          <>
            <Button
              radius="full"
              as={Link}
              href="/contact"
              color="primary"
              variant="flat"
            >
              Book Now
            </Button>
            <Dropdown>
              <DropdownTrigger>
                <Avatar
                  name={session.user?.name || ''}
                  as={Button}
                  isIconOnly
                  src={session.user?.image || ''}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Menu">
                <DropdownItem
                  key="dashboard"
                  as={Link}
                  href="/dashboard/hotels"
                >
                  Dashboard
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  className="text-danger"
                  color="danger"
                  onPress={() => signOut()}
                >
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        ) : (
          <>
            <Button
              radius="full"
              variant="bordered"
              as={Link}
              className="hidden md:flex"
              href="/auth/login"
            >
              Login
            </Button>
            <Button
              radius="full"
              color="primary"
              as={Link}
              href="/auth/register"
              className="hidden md:flex"
            >
              Register
            </Button>
          </>
        )}
        <div className="md:hidden">
          <Dropdown aria-label="Locations">
            <DropdownTrigger>
              <Button isIconOnly variant="light">
                <Icon
                  icon="solar:hamburger-menu-line-duotone"
                  fontSize={24}
                  stroke="2"
                />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key="location" as={Link} href="/#locations">
                Locations
              </DropdownItem>
              <DropdownItem key="about" as={Link} href="/about">
                About Us
              </DropdownItem>
              <DropdownItem key="offers" as={Link} href="/offers">
                Offers
              </DropdownItem>
              <DropdownItem key="membership" as={Link} href="/membership">
                Membership
              </DropdownItem>
              <DropdownItem key="contact" as={Link} href="/contact">
                Contact
              </DropdownItem>
              <DropdownItem key="contact" as={Link} href="/auth/login">
                Login
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
