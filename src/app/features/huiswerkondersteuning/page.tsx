// This file is obsolete and can be removed.
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ObsoleteHuiswerkondersteuningPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard/coaching');
  }, [router]);
  return null;
}
