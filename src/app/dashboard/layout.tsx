import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { Header } from '@/components/layout/header'; // A simplified header for dashboard if needed, or none
import { ReactNode } from 'react';

// This header is a placeholder for a potential dashboard-specific header (e.g. with user menu, notifications)
// For now, we might not need a separate header if sidebar handles branding.
function DashboardHeader() {
  // Example: User menu, notifications bell, etc.
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      {/* Placeholder for dashboard header content */}
      <div className="ml-auto flex items-center gap-4">
        <p className="text-sm font-medium">Welkom, Gebruiker!</p> 
        {/* Add User Avatar and Dropdown here */}
      </div>
    </header>
  );
}


export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col pl-64"> {/* Adjust pl to match sidebar width */}
        <DashboardHeader />
        <main className="flex-1 p-6 md:p-8 lg:p-10 bg-secondary/30">
          {children}
        </main>
      </div>
    </div>
  );
}
