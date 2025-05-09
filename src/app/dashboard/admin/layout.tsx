// src/app/dashboard/admin/layout.tsx
import type { ReactNode } from 'react';

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  // This layout can be expanded with admin-specific elements if needed,
  // but for now, it simply renders its children within the main dashboard layout.
  return <>{children}</>;
}
