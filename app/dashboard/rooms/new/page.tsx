import NewRoom from '@/components/dashboard/rooms/new';
import { getHotels, getRoomTypes } from '@/functions/get';
import { Hotel, RoomType } from '@/lib/interface';

export default async function Page() {
  const hotels: Hotel[] = await getHotels();
  const roomTypes: RoomType[] = await getRoomTypes();
  return (
    <>
      <NewRoom hotels={hotels} roomType={roomTypes} />
    </>
  );
}
