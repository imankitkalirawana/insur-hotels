import Hotels from '@/components/dashboard/hotels/hotels';
import { getHotels } from '@/functions/get';
import { Hotel } from '@/lib/interface';

export default async function Page() {
  const hotels: Hotel[] = await getHotels();

  return (
    <>
      <Hotels hotels={hotels} />
    </>
  );
}
