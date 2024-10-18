import React from 'react';
import { Hotel } from '@/lib/interface';
import Image from 'next/image';
import { Accordion, AccordionItem } from '@nextui-org/react';

interface Props {
  hotel: Hotel;
}

export default function ThingsToDo({ hotel }: Props) {
  return (
    <>
      <div className="no-tailwind relative mx-auto flex max-w-7xl flex-col p-4">
        <div className="flex flex-row-reverse items-center justify-between">
          <Image
            alt=""
            width={224}
            height={224}
            src="/things-to-do.png"
            className="hidden w-56 md:flex"
          />
          <div className="flex max-w-3xl flex-col gap-4">
            <h2 className="text-center text-3xl font-bold md:text-start">
              Things to do in{' '}
              <span className="text-primary">{hotel.location}</span>
            </h2>
            <p
              className="text-center text-default-700 md:text-start"
              dangerouslySetInnerHTML={{ __html: hotel.thingsToDo?.text }}
            />
          </div>
        </div>
        <Accordion className="mt-8">
          {hotel.thingsToDo.activities.map((item) => (
            <AccordionItem
              key={item._id}
              aria-label={item.title}
              title={
                <>
                  <p
                    className="flex items-center gap-2"
                    dangerouslySetInnerHTML={{ __html: item.title }}
                  />
                </>
              }
            >
              <p
                className="text-center text-default-500 md:text-start"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />

              {item.src && (
                <img width={500} className="mx-auto" src={item.src} />
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
}
