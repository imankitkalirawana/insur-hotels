import { CircleArrowUp, CloudSunRain } from 'lucide-react';
import Counter from './text/counter';
import { Card } from '@nextui-org/react';
import Link from 'next/link';
import { Weather } from '@/lib/weather';

interface Props {
  weather: Weather;
}

export default function WeatherCard({ weather }: Props) {
  return (
    <Card
      as={Link}
      href={`https://weather.com/weather/today/l/${weather?.location?.lat},${weather?.location?.lon}?par=apple`}
      target="_blank"
      isHoverable
      isPressable
      //   className="relative flex aspect-square size-52 min-w-48 flex-col rounded-3xl bg-opacity-10 bg-gradient-to-r from-gray-200 to-gray-300 bg-clip-padding p-4 backdrop-blur-sm backdrop-filter dark:from-gray-700 dark:to-gray-900"
      className="relative flex aspect-square size-52 min-w-48 flex-col rounded-3xl border border-default bg-transparent bg-clip-padding p-4 shadow-none backdrop-blur-sm backdrop-filter dark:from-gray-700 dark:to-gray-900"
    >
      <div className="flex flex-1 flex-col gap-2">
        <p
          title={weather?.location?.name}
          className="city overflow-hidden text-ellipsis whitespace-nowrap opacity-70"
        >
          {weather?.location?.name}
        </p>
        <div className="flex items-center">
          <CloudSunRain className="h-10 w-10" />
          <p className="text-5xl font-black">
            <Counter
              className="text-5xl font-black"
              targetValue={weather?.current?.temp_c || 0}
            />
            &deg;
          </p>
        </div>
        <p className="feels-like opacity-70">
          Feels like{' '}
          <Counter
            className="text-base font-normal"
            targetValue={weather?.current?.feelslike_c || 0}
          />
          &deg;
        </p>{' '}
      </div>
      <div className="flex justify-between rounded-xl bg-default-400 bg-opacity-30 bg-clip-padding py-1 backdrop-blur-lg backdrop-filter">
        <div className="flex items-center gap-1 px-2 text-orange-500 dark:text-orange-200">
          <CircleArrowUp className="h-5 w-5" />
          <p>
            <Counter
              targetValue={
                weather?.forecast?.forecastday[0]?.day?.maxtemp_c || 0
              }
              className="text-base font-normal text-orange-500 dark:text-green-200"
            />
            &deg;
          </p>
        </div>
        <p className="text-black opacity-50">|</p>
        <div className="flex items-center gap-1 px-3 text-green-800 dark:text-green-200">
          <CircleArrowUp className="h-5 w-5 rotate-180" />
          <p>
            <Counter
              targetValue={
                weather?.forecast?.forecastday[0]?.day?.mintemp_c || 0
              }
              className="text-base font-normal text-green-800 dark:text-green-200"
              direction="up"
            />
            &deg;
          </p>
        </div>
      </div>
    </Card>
  );
}
