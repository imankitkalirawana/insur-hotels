import { SwipeCarousel } from '@/components/ui/swipe-carousel';
import { formatPrice } from '@/functions/utility';
import { Room } from '@/lib/interface';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  Button,
  Card,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Props {
  rooms: Room[];
}

export default function Rooms({ rooms }: Props) {
  const [selected, setSelected] = React.useState<Room | null>(null);
  const [index, setIndex] = React.useState(0);
  const deleteModal = useDisclosure();

  return (
    <>
      {rooms.length > 0 && (
        <div
          id="rooms"
          className="relative mx-auto my-24 flex w-full max-w-7xl translate-y-0 flex-col items-center justify-between bg-cover px-4"
        >
          <div className="relative flex h-full w-full max-w-7xl flex-col items-center justify-center gap-12">
            <div className="flex w-full flex-col items-center justify-between gap-4">
              <h2 className="w-full text-center text-4xl font-medium md:text-7xl">
                The Best <span className="text-primary">Rooms</span> For You
              </h2>
              <p className="max-w-3xl text-center font-light">
                These are some of the hotels that we highly recommend for you,
                we guarantee the quality of the service, the food, the hotel
                area and various other aspects.
              </p>
            </div>
          </div>
          <div
            className={cn(
              `mt-8 grid w-full grid-cols-1 justify-center gap-4 sm:grid-cols-2 md:grid-cols-3`,
              rooms.length === 1
                ? 'max-w-xl sm:grid-cols-1 md:grid-cols-1'
                : rooms.length === 2
                  ? 'sm:grid-cols-2 md:grid-cols-2'
                  : rooms.length === 3
                    ? 'sm:grid-cols-3 md:grid-cols-3'
                    : rooms.length === 4
                      ? 'max-w-4xl sm:grid-cols-2 md:grid-cols-2'
                      : ''
            )}
          >
            {rooms.map((item) => (
              <Card
                key={item._id}
                className="flex flex-col rounded-[32px] border border-transparent bg-primary/10 p-4 transition-all hover:border-primary"
                isPressable
                // isHoverable
                onClick={() => {
                  setSelected(item);
                  deleteModal.onOpenChange();
                }}
              >
                <Image
                  src={item.images[0].src}
                  className={cn(
                    'aspect-[5/4] w-full rounded-3xl object-cover',
                    rooms.length === 1 ? 'aspect-[16/9]' : ''
                  )}
                  alt="hotel"
                  width={300}
                  height={230}
                />
                <div className="mt-2 flex w-full flex-wrap items-center justify-between">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm font-light leading-tight text-[#414243]">
                    starts from {formatPrice(item.price)}/night
                  </p>
                </div>
                <div className="mt-4 w-full">
                  <Button
                    color="primary"
                    size="lg"
                    className="border-2 border-primary hover:bg-white hover:text-primary"
                    fullWidth
                    radius="full"
                    as={Link}
                    href="/contact"
                  >
                    Book Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Modal
        backdrop="blur"
        size="5xl"
        isOpen={deleteModal.isOpen}
        onOpenChange={deleteModal.onOpenChange}
        radius="lg"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col items-center justify-center">
                <h3>{selected?.title}</h3>
                <p className="text-sm font-normal">
                  in <span className="capitalize">{selected?.hotelId}</span>
                </p>
              </ModalHeader>
              <ModalBody className="flex flex-col p-4">
                <div>
                  <SwipeCarousel imgs={selected?.images as any} />
                </div>
                <div className="grid grid-cols-2 gap-2 rounded-xl border border-default p-4 text-default-500">
                  <div className="flex items-center gap-2">
                    <Icon icon="tabler:resize" fontSize={24} />
                    {selected?.size} sq.ft (
                    {parseInt(((selected?.size as number) * 0.092903) as any)}
                    sq.mt){' '}
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon icon="ic:outline-bed" fontSize={24} />
                    <span className="capitalize">
                      {selected?.type.split('-').join(' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon icon="tabler:user" fontSize={24} />
                    <span className="capitalize">
                      Max {selected?.maxGuests} Guests
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="mt-4 font-semibold">Description</h3>
                  <p className="text-default-500">{selected?.description}</p>
                </div>
                <Divider className="my-4" />
                <div>
                  <h3 className="font-semibold">Amenities</h3>
                  <div>
                    {(selected?.popularWithGuests?.length as any) > 0 && (
                      <>
                        <h4 className="mt-8 font-medium">
                          Popular with Guests
                        </h4>
                        <ul className="grid gap-1 text-default-500 xs:grid-cols-2 md:grid-cols-3">
                          {selected?.popularWithGuests.map((item) => (
                            <li key={item} className="flex items-center gap-2">
                              <Icon icon="tabler:check" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {(selected?.roomFeatures?.length as any) > 0 && (
                      <>
                        <h4 className="mt-8 font-medium">Room Features</h4>
                        <ul className="grid gap-1 text-default-500 xs:grid-cols-2 md:grid-cols-3">
                          {selected?.roomFeatures.map((item) => (
                            <li key={item} className="flex items-center gap-2">
                              <Icon icon="tabler:check" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {(selected?.safetyFeatures?.length as any) > 0 && (
                      <>
                        <h4 className="mt-8 font-medium">Safety Features</h4>
                        <ul className="grid gap-1 text-default-500 xs:grid-cols-2 md:grid-cols-3">
                          {selected?.safetyFeatures.map((item) => (
                            <li key={item} className="flex items-center gap-2">
                              <Icon icon="tabler:check" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {(selected?.popularWithGuests?.length as any) > 0 && (
                      <>
                        <h4 className="mt-8 font-medium">Bathroom Features</h4>
                        <ul className="grid gap-1 text-default-500 xs:grid-cols-2 md:grid-cols-3">
                          {selected?.bathroomFeatures.map((item) => (
                            <li key={item} className="flex items-center gap-2">
                              <Icon icon="tabler:check" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {(selected?.popularWithGuests?.length as any) > 0 && (
                      <>
                        <h4 className="mt-8 font-medium">Other Features</h4>
                        <ul className="grid gap-1 text-default-500 xs:grid-cols-2 md:grid-cols-3">
                          {selected?.otherFeatures.map((item) => (
                            <li key={item} className="flex items-center gap-2">
                              <Icon icon="tabler:check" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="flex justify-end">
                <Button
                  color="primary"
                  className="w-full sm:w-fit"
                  as={Link}
                  href="/contact"
                >
                  Book Now
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
