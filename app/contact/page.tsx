import Contact from '@/components/sections/contact/contact';
import { getHotels } from '@/functions/get';
import { Hotel } from '@/lib/interface';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Insur Hotels',
  description:
    'Insur Hotels offers a unique blend of luxury and nature in Bhimtal, Jim Corbett, and Ranthambore. Enjoy premium hospitality and breathtaking scenic beauty, making your stay an unforgettable experience.'
};

export default async function Page() {
  const hotels: Hotel[] = await getHotels();
  return (
    <>
      <div className="mx-auto flex flex-col gap-4">
        <Contact hotels={hotels} />
      </div>
    </>
  );
}
