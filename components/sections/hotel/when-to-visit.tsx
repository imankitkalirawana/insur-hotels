'use client';

import WeatherCard from '@/components/animata/weather-widget';
import { Hotel } from '@/lib/interface';
import { Weather } from '@/lib/weather';
import { Accordion, AccordionItem } from '@nextui-org/react';

interface Props {
  hotel: Hotel;
  weather: Weather;
}

export default function WhenToVisit({ hotel, weather }: Props) {
  return (
    <div className="no-tailwind relative mx-auto flex max-w-7xl flex-col p-4">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row-reverse">
        <WeatherCard weather={weather} />
        <div className="flex max-w-3xl flex-col gap-4">
          <h2 className="text-center text-3xl font-bold md:text-start">
            When to Visit <span className="text-primary">{hotel.name}</span>
          </h2>
          <p
            className="no-tailwind text-default-700"
            dangerouslySetInnerHTML={{ __html: hotel.whenToVisit?.text }}
          />
        </div>
      </div>
      <Accordion className="mt-8">
        {hotel.whenToVisit.timing.map((item) => (
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
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
