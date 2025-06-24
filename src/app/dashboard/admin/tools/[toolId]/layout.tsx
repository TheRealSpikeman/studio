// src/app/dashboard/admin/tools/[toolId]/layout.tsx
import type { ReactNode } from 'react';

// Deze minimale layout zorgt ervoor dat de tool-pagina
// niet binnen de standaard dashboard-layout wordt geladen.
// Hierdoor kan de studio de component correct en geïsoleerd bewerken.
export default function ToolLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/20 p-4">
      <div className="w-full max-w-4xl">
        {children}
      </div>
    </div>
  );
}
