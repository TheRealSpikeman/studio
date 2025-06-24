// This file is now obsolete.
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function ObsoleteRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    // Redirect to the main tool management page as this URL is no longer in use.
    router.replace('/dashboard/admin/tool-management');
  }, [router]);
  return <p>U wordt doorgestuurd naar de tool beheerpagina...</p>;
}
