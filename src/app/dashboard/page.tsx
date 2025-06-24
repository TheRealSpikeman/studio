
// src/app/dashboard/page.tsx
"use client"; 

import { useDashboardRole } from '@/contexts/DashboardRoleContext';
import AdminDashboardOverviewPage from './admin/page';
import OuderDashboardPage from './ouder/page';
import TutorDashboardPage from './tutor/page';
import CoachDashboardPage from './coach/page';
import { LeerlingDashboardPage } from '@/components/dashboard/leerling-dashboard-page';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const ONBOARDING_KEY_LEERLING = 'onboardingCompleted_leerling_v1';

export default function DashboardPage() {
    const { currentDashboardRole } = useDashboardRole();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient && currentDashboardRole === 'leerling') {
            const onboardingCompleted = localStorage.getItem(ONBOARDING_KEY_LEERLING);
            if (!onboardingCompleted) {
                router.replace('/dashboard/leerling/welcome');
            }
        }
    }, [isClient, currentDashboardRole, router]);

    if (!isClient) {
        // Toon een skeleton loader tijdens de server render en de eerste client render
        // om een lege pagina te voorkomen voordat de rol is vastgesteld.
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
            </div>
        );
    }
    
    // Voorkom dat de leerling-dashboard (en de redirect) wordt getoond als de onboarding nog niet is voltooid.
    if (currentDashboardRole === 'leerling' && (typeof window !== 'undefined' && !localStorage.getItem(ONBOARDING_KEY_LEERLING))) {
        return <div className="flex h-full w-full items-center justify-center p-8">Welkomstpagina laden...</div>;
    }

    switch(currentDashboardRole) {
        case 'admin':
            return <AdminDashboardOverviewPage />;
        case 'ouder':
            return <OuderDashboardPage />;
        case 'tutor':
            return <TutorDashboardPage />;
        case 'coach':
            return <CoachDashboardPage />;
        case 'leerling':
        default:
            return <LeerlingDashboardPage />;
    }
}
