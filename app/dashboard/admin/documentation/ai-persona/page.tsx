
// src/app/dashboard/admin/documentation/ai-persona/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ObsoletePersonaDocumentationPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new, correct location for persona management
    router.replace('/dashboard/admin/settings/personas');
  }, [router]);

  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <p>Deze pagina is verplaatst. U wordt doorgestuurd...</p>
    </div>
  );
}
