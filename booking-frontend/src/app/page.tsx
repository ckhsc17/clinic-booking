// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const userId = searchParams.get('user_id');
    if (userId) {
      localStorage.setItem('user_id', userId);
      console.log('User ID set in local storage:', userId);
    }
    router.replace('/consult');
  }, [searchParams, router]);

  return <div>Redirecting...</div>;
}

