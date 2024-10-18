import Marquee from '@/components/magicui/Marquee';
import { Icon } from '@iconify/react/dist/iconify.js';

const items = [
  {
    id: 'instagram',
    title: 'Instagram',
    url: 'https://www.instagram.com/',
    icon: <Icon icon="skill-icons:instagram" className="size-12" />
  },
  {
    id: 'twitter',
    title: 'Twitter',
    url: 'https://www.twitter.com/',
    icon: (
      <Icon icon="prime:twitter" className="size-12 bg-black p-2 text-white" />
    )
  },
  {
    id: 'facebook',
    title: 'Facebook',
    url: 'https://www.facebook.com/',
    icon: <Icon icon="logos:facebook" className="size-12" />
  },
  {
    id: 'youtube',
    title: 'Youtube',
    url: 'https://www.youtube.com/',
    icon: <Icon icon="logos:youtube-icon" className="size-12 p-1" />
  },
  {
    id: 'linkedin',
    title: 'LinkedIn',
    url: 'https://www.linked.com/in/',
    icon: <Icon icon="skill-icons:linkedin" className="size-12" />
  }
];

export default function SocialMedia() {
  return (
    <>
      <div className="mt-12 space-y-4 py-12">
        <Marquee
          pauseOnHover={false}
          className="flex items-center text-default [--duration:50s]"
          repeat={5}
        >
          {items.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              className="ml-6 flex items-center gap-2 text-black"
            >
              <span className="overflow-hidden rounded-xl border border-[#f3f3f3] bg-white">
                {item.icon}
              </span>
              <span className="text-4xl font-bold">{item.title}</span>
            </a>
          ))}
        </Marquee>
      </div>
    </>
  );
}
