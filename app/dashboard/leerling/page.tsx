// src/app/dashboard/leerling/page.tsx
"use client";

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Loading skeleton component to provide a better user experience
function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-6 w-3/4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-72 rounded-lg" />
                <Skeleton className="h-72 rounded-lg" />
            </div>
             <div className="grid gap-6 lg:grid-cols-3">
                <Skeleton className="h-64 rounded-lg lg:col-span-2" />
                <Skeleton className="h-64 rounded-lg" />
            </div>
        </div>
    )
}

// Dynamically import the dashboard component with SSR turned off to prevent hydration errors.
// The dashboard relies on localStorage, which is only available on the client.
const LeerlingDashboard = dynamic(
  () => import('@/components/dashboard/leerling-dashboard-page'),
  { 
    ssr: false,
    loading: () => <DashboardSkeleton />
  }
);

export default function LeerlingDashboardPage() {
  return <LeerlingDashboard />;
}
