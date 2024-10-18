interface Iphone15ProProps {
  children: React.ReactNode;
  className?: string;
  width?: string;
  height?: string;
}
import { cn } from '@/lib/utils';

export default function Iphone15Pro({
  children,
  className,
  width = 'w-[300px]',
  height = 'h-[600px]'
}: Iphone15ProProps) {
  return (
    <>
      <div className={cn('relative overflow-hidden', width, height, className)}>
        <img
          src="/iphone-15-pro.png"
          alt=""
          className="absolute z-10 h-full w-full"
        />
        <div className="absolute left-[4%] top-[1.5%] h-[97%] w-[92%] overflow-hidden rounded-[35px]">
          {children}
        </div>
      </div>
    </>
  );
}
