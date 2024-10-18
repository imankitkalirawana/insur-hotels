import { auth } from '@/auth';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import UserDashboard from '@/components/dashboard/UserDashboard';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export default async function Dashboard() {
  const session = await auth();
  if (!session) {
    redirect('/auth/login');
  }
  return (
    <>
      {session && session.user && (
        <>
          {session.user.role === 'admin' ? (
            <AdminDashboard />
          ) : session.user.role === 'user' ? (
            <UserDashboard />
          ) : null}
        </>
      )}
    </>
  );
}
