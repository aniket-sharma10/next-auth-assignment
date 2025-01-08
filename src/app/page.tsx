"use client";

import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  if (status === 'loading') {
    return <div className='flex justify-center mt-10'>Loading...</div>;
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {session.user?.name}</h1>
      <p>Email: {session.user?.email}</p>
      <p>Role: {session.user?.role || 'user'}</p>
      <Button 
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="mt-4"
      >
        Sign Out
      </Button>
    </div>
  );
}