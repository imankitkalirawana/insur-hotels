import Room from '@/components/dashboard/rooms/room';
import { getRoomById, getRoomTypes } from '@/functions/get';
import { Room as RoomInterface, RoomType } from '@/lib/interface';

interface Props {
  params: {
    id: string;
  };
}

export default async function Page({ params }: Props) {
  const room: RoomInterface = await getRoomById(params.id);
  const roomTypes: RoomType[] = await getRoomTypes();
  return (
    <>
      <Room room={room} roomTypes={roomTypes} />
    </>
  );
}
