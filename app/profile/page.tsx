import { auth } from '@/auth';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import UserDashboard from '@/components/dashboard/UserDashboard';
import Profile from '@/components/sections/profile/profile';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth();
  if (!session) {
    redirect('/auth/login');
  }
  return (
    <>
      <Profile />
    </>
  );
}
