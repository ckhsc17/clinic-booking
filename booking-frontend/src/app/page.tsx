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
      router.push(`/consult?user_id=${userId}`);
    } else {
      router.push('/consult');
    }
  }, [searchParams, router]);

  return <div>Redirecting...</div>;
}

