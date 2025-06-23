// This page is now obsolete as the tool recommendations are integrated into the quiz results.
// This file can be safely removed or kept as a redirect in a real-world scenario.

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ObsoleteHuiswerkondersteuningPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to a more relevant page, e.g., the main coaching dashboard
    router.replace('/dashboard/coaching');
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p>U wordt doorgestuurd...</p>
    </div>
  );
}
