// src/app/for-parents/ouderrichtlijnen/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ObsoleteRichtlijnenPage() {
  const router = useRouter();
  useEffect(() => {
    // Redirect to the new location within the dashboard
    router.replace('/dashboard/ouder/ouderrichtlijnen');
  }, [router]);

  return <div className="flex h-screen items-center justify-center"><p>U wordt doorgestuurd...</p></div>;
}
