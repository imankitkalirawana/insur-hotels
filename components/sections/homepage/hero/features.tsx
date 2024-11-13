import { Website } from '@/lib/interface';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Props {
  website: Website;
}

export default function Features({ website }: Props) {
  return (
    <>
      <div className="relative flex min-h-screen w-full translate-y-0 flex-col items-center justify-between bg-cover px-2 py-12">
        <div className="relative flex h-full w-full max-w-7xl flex-col items-center justify-between gap-12">
          <div className="md:self-start">
            <h2 className="text-4xl font-medium md:text-7xl">
              What set {/* <br className="hidden md:block" /> */}
              <span className="text-primary">Insur</span> Apart?
            </h2>
          </div>
        </div>
        <div className="relative mx-auto mt-12 grid w-full max-w-5xl gap-2 xs:grid-cols-2 xs:gap-4">
          <div className="absolute left-[50%] top-[50%] hidden translate-x-[-50%] translate-y-[-50%] items-center justify-center rounded-full bg-primary text-xl text-white xs:flex xs:size-28 sm:size-36">
            Insur Hotels
          </div>
          {website?.facilities?.slice(0, 4).map((item, index) => (
            <div
              key={item.name}
              className={cn(
                'group relative aspect-video w-full overflow-hidden rounded-3xl xs:aspect-[4/3]',
                index === 0
                  ? 'xs:rounded-br-[150px] sm:rounded-br-[200px]'
                  : index === 1
                    ? 'xs:rounded-bl-[150px] sm:rounded-bl-[200px]'
                    : index === 2
                      ? 'xs:rounded-tr-[150px] sm:rounded-tr-[200px]'
                      : index === 3
                        ? 'xs:rounded-tl-[150px] sm:rounded-tl-[200px]'
                        : ''
              )}
            >
              <Image
                src={item.src}
                width={400}
                height={400}
                alt=""
                className="absolute h-full w-full object-cover transition-all duration-1000 group-hover:scale-105"
              />

              <div
                className={cn(
                  'absolute inset-0 left-0 top-0 from-black/50 to-black/30 object-cover',
                  index === 0
                    ? 'bg-gradient-to-br'
                    : index === 1
                      ? 'bg-gradient-to-bl'
                      : index === 2
                        ? 'bg-gradient-to-br'
                        : index === 3
                          ? 'bg-gradient-to-bl'
                          : ''
                )}
              />

              <h3
                className={cn(
                  'absolute max-w-[70%] p-2 text-3xl italic text-white xs:text-xl sm:p-6 sm:text-2xl md:text-4xl',
                  index % 2 === 0 ? 'left-0 text-start' : 'right-0 text-end'
                )}
              >
                {item.name}
              </h3>
              <p
                className={cn(
                  'absolute bottom-5 h-[48px] max-w-[70%] overflow-hidden text-base font-light text-white',
                  index % 2 === 0
                    ? 'left-2 text-start sm:left-5'
                    : 'right-2 text-end sm:right-5'
                )}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

interface ItemProps {
  _id: string;
  title: string;
  description: string;
  image: string;
}

const items: ItemProps[] = [
  {
    _id: '1',
    title: 'Prime Location',
    description:
      'Located in the heart of the nature, with easy access to all major attractions.',
    image: '/3.png'
  },
  {
    _id: '2',
    title: 'Closure to Nature',
    description:
      'Experience the ultimate luxury in our exclusive resorts, where you can unwind with your loved ones and truly immerse yourself in our beautiful rooms.',
    image: '/2.png'
  },
  {
    _id: '3',
    title: 'Food & Flavor',
    description:
      'Delight your taste buds with our exquisite dining options with our world-class chefs.',
    image: '/4.png'
  },
  {
    _id: '4',
    title: 'Wildlife Photography',
    description: 'Capture the beauty of nature with our guided wildlife tours.',
    image: '/7.png'
  }
];
