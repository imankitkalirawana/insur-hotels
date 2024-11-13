import { Website } from '@/lib/interface';
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  website: Website;
}

export default function About({ website }: Props) {
  return (
    <>
      <div
        className="flex min-h-screen w-full translate-y-0 flex-col items-center justify-between px-4 py-24 sm:px-8"
        style={{
          backgroundImage: `url('/hero-1.png')`
        }}
      >
        <div className="flex h-full max-w-6xl flex-col items-center justify-between gap-12">
          <div>
            <Image
              alt="logo"
              width={100}
              height={50}
              src="/logo.png"
              className="w-48"
            />
          </div>
          <div>
            <p
              className="font-light md:text-2xl"
              dangerouslySetInnerHTML={{
                __html: website?.about?.shortDescription
              }}
            />
          </div>
          <div>
            <Button
              variant="bordered"
              color="primary"
              size="lg"
              as={Link}
              href="/about"
              radius="full"
            >
              Know More
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
