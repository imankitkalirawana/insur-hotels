import Hotels from '@/components/dashboard/hotels/hotels';
import Rooms from '@/components/dashboard/rooms/rooms';
import { getRooms } from '@/functions/get';
import { Hotel, Room } from '@/lib/interface';

export default async function Page() {
  const rooms: Room[] = await getRooms();

  return (
    <>
      <Rooms rooms={rooms} />
    </>
  );
}
