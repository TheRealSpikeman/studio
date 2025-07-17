// src/app/dashboard/admin/documentation/ai-validation/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from '@/lib/icons';

export default function ObsoleteAiValidationPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new, public location for this information
    router.replace('/methodologie/ai-validatie');
  }, [router]);

  return (
    <div className="flex h-full w-full items-center justify-center p-8">
       <Loader2 className="h-6 w-6 animate-spin mr-3" />
      <p>Deze pagina is verplaatst. U wordt doorgestuurd...</p>
    </div>
  );
}
