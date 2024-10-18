import Users from '@/components/dashboard/users/users';
import { API_BASE_URL, isCaching } from '@/lib/config';
import { cookies } from 'next/headers';

async function getUsers() {
  const res = await fetch(`${API_BASE_URL}/users`, {
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
  const users = await getUsers();
  return (
    <>
      <Users users={users} />
    </>
  );
}
