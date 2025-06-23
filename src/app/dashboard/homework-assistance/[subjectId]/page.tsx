// src/app/dashboard/homework-assistance/[subjectId]/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ObsoleteHuiswerkAssistancePage() {
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
