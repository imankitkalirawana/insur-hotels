import RoomTypes from '@/components/dashboard/room-types/room-types';
import { getRoomTypes } from '@/functions/get';
import { RoomType } from '@/lib/interface';

export default async function Page() {
  const roomTypes: RoomType[] = await getRoomTypes();

  return (
    <>
      <RoomTypes roomTypes={roomTypes} />
    </>
  );
}
