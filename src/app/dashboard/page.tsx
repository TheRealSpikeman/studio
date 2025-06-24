// src/app/dashboard/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardRole } from '@/contexts/DashboardRoleContext';
import { Skeleton } from '@/components/ui/skeleton';

// This page now acts as a smart router.
// It determines the current role and redirects to the appropriate dashboard.
export default function DashboardRedirectPage() {
    const { currentDashboardRole } = useDashboardRole();
    const router = useRouter();

    useEffect(() => {
        // Redirect to the specific dashboard based on the current role.
        router.replace(`/dashboard/${currentDashboardRole}`);
    }, [currentDashboardRole, router]);

    // Show a loading skeleton while redirecting.
    return (
        <div className="space-y-8">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-8 w-2/3" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
            </div>
        </div>
    );
}