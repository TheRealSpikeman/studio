
// src/app/dashboard/tools/[toolId]/page.tsx
"use client";

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

// This component acts as a redirect to the new, correct location within the admin dashboard.
export default function ToolRedirectPage() {
  const router = useRouter();
  const params = useParams();
  const toolId = params.toolId as string;

  useEffect(() => {
    if (toolId) {
      router.replace(`/dashboard/admin/tools/${toolId}`);
    }
  }, [router, toolId]);

  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <p>Tool pagina wordt verplaatst...</p>
    </div>
  );
}
