import Hotel from '@/components/dashboard/hotels/hotel';
import { getHotelsWithName } from '@/functions/get';
import { Hotel as HotelInterface } from '@/lib/interface';

interface Props {
  params: {
    name: string;
  };
}

export default async function Page({ params }: Props) {
  const hotel: HotelInterface = await getHotelsWithName(params.name);
  return (
    <>
      <Hotel hotel={hotel} />
    </>
  );
}
