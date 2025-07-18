// src/components/layout/MaintenanceModeHandler.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from '@/lib/icons';
import { useAuth } from '@/app/contexts/AuthContext';

const MAINTENANCE_MODE_KEY = 'mindnavigator_maintenance_mode';

export function MaintenanceModeHandler({ children }: { children: React.ReactNode }) {
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isClient, setIsClient] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient || isAuthLoading) return;

        try {
            const isMaintenanceActive = localStorage.getItem(MAINTENANCE_MODE_KEY) === 'true';

            // Always allow access to these pages
            const publicAllowedPaths = ['/login', '/signup', '/maintenance', '/forgot-password', '/parental-approval', '/verify-email', '/invest'];
            if (publicAllowedPaths.some(p => pathname.startsWith(p))) {
                setIsChecking(false);
                return;
            }

            const isAdmin = user && user.role === 'admin';
            const isAllowed = !isMaintenanceActive || isAdmin;

            if (isAllowed) {
                if (pathname === '/maintenance' && !isMaintenanceActive) {
                    router.replace('/dashboard');
                } else {
                    setIsChecking(false);
                }
            } else {
                if (pathname !== '/maintenance') {
                    router.replace('/maintenance');
                } else {
                    setIsChecking(false);
                }
            }
        } catch (error) {
            console.error("Maintenance mode check failed:", error);
            setIsChecking(false); // Failsafe to prevent getting stuck
        }
    }, [pathname, isAuthLoading, user, router, isClient]);

    if (isChecking || isAuthLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">Status controleren...</p>
            </div>
        );
    }

    return <>{children}</>;
}
