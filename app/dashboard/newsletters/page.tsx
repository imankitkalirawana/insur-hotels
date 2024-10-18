import Newsletters from '@/components/dashboard/newsletters/newsletters';
import RoomTypes from '@/components/dashboard/room-types/room-types';
import { API_BASE_URL, isCaching } from '@/lib/config';
import { Newsletter } from '@/lib/interface';
import { cookies } from 'next/headers';

async function getNewsletters() {
  const res = await fetch(`${API_BASE_URL}/newsletter`, {
    cache: isCaching ? 'default' : 'no-cache',
    method: 'GET',
    headers: { Cookie: cookies().toString() }
  });
  if (res.ok) {
    const json = await res.json();
    return json;
  }
}
export default async function Page() {
  const newsletters: Newsletter[] = await getNewsletters();
  return (
    <>
      <Newsletters newsletters={newsletters} />
    </>
  );
}
