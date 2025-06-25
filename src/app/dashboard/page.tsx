// src/app/dashboard/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

// This page now acts as a smart router.
// It determines the current role and redirects to the appropriate dashboard.
export default function DashboardRedirectPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user) {
            router.replace(`/dashboard/${user.role}`);
        } else if (!isLoading && !user) {
            // Not authenticated, redirect to login
            router.replace('/login');
        }
    }, [user, isLoading, router]);

    // Show a loading skeleton while redirecting.
    return (
        <div className="flex h-full items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
}
