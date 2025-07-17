
// src/app/dashboard/admin/subscription-management/page.tsx
"use client";

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CreditCard, Edit, Trash2, PlusCircle, CheckCircle2, XCircle } from '@/lib/icons';
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { initialDefaultPlans, getSubscriptionPlans, saveSubscriptionPlans, type SubscriptionPlan } from '@/types/subscription';


// Helper function to format price
const formatPlanPrice = (price: number, currency: string, interval: 'month' | 'year' | 'once') => {
    if (price === 0 && interval === 'once') return 'Gratis';
    const intervalText = interval === 'month' ? '/mnd' : interval === 'year' ? '/jaar' : '';
    return `${currency === 'EUR' ? '€' : currency}${price.toFixed(2)}${intervalText}`;
};

export default function SubscriptionManagementPage() {
    const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null);

    useEffect(() => {
        setIsLoading(true);
        // Corrected logic to handle invalid data from localStorage
        let loadedPlans: SubscriptionPlan[];
        try {
            const storedPlansRaw = localStorage.getItem('mindnavigator_subscription_plans');
            // Check if the raw string is not null and is not the string "undefined"
            if (storedPlansRaw && storedPlansRaw !== 'undefined') {
                loadedPlans = JSON.parse(storedPlansRaw);
            } else {
                // If it's null or "undefined", use defaults and save them.
                loadedPlans = initialDefaultPlans;
                saveSubscriptionPlans(initialDefaultPlans);
            }
        } catch (e) {
            console.error("Error parsing plans from localStorage, resetting to defaults", e);
            loadedPlans = initialDefaultPlans;
            saveSubscriptionPlans(initialDefaultPlans);
        }

        const sortedPlans = loadedPlans.sort((a, b) => {
            if (a.price === 0) return -1;
            if (b.price === 0) return 1;
            return a.price - b.price;
        });
        setAvailablePlans(sortedPlans);
        setIsLoading(false);
    }, []);

    const handleDeletePlan = (plan: SubscriptionPlan) => {
        setPlanToDelete(plan);
    };
    
    const confirmDeletePlan = () => {
        if (!planToDelete) return;
        
        const updatedPlans = availablePlans.filter(p => p.id !== planToDelete.id);
        saveSubscriptionPlans(updatedPlans);
        setAvailablePlans(updatedPlans);

        toast({
            title: "Abonnement Verwijderd",
            description: `Het abonnement "${planToDelete.name}" is verwijderd.`
        });
        setPlanToDelete(null);
    };

    const handleRestoreDefaults = () => {
        saveSubscriptionPlans(initialDefaultPlans);
        const sortedDefaults = [...initialDefaultPlans].sort((a,b) => a.price - b.price);
        setAvailablePlans(sortedDefaults);
        toast({
            title: "Standaard Abonnementen Hersteld",
            description: "De originele abonnementen zijn teruggezet."
        });
    };

    if (isLoading) {
        return <div className="p-8 text-center">Abonnementen laden...</div>;
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <CreditCard className="h-6 w-6 text-primary" />
                                Abonnementen Beheer
                            </CardTitle>
                            <CardDescription>
                                Beheer hier de abonnementsplannen die beschikbaar zijn voor gebruikers.
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleRestoreDefaults} variant="outline">Standaard Herstellen</Button>
                            <Button asChild>
                                <Link href="/dashboard/admin/subscription-management/new">
                                    <PlusCircle className="mr-2 h-4 w-4" /> Nieuw Abonnement
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availablePlans.map(plan => (
                            <Card key={plan.id} className="shadow-md flex flex-col">
                                <CardHeader>
                                    <CardTitle>{plan.name}</CardTitle>
                                    <CardDescription className="h-10">{plan.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-3xl font-bold">{formatPlanPrice(plan.price, plan.currency, plan.billingInterval)}</p>
                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            {plan.active ? <CheckCircle2 className="h-4 w-4 text-green-500"/> : <XCircle className="h-4 w-4 text-red-500"/>}
                                            Status: {plan.active ? "Actief" : "Inactief"}
                                        </div>
                                         <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            {plan.isPopular && <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Populair</Badge>}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex gap-2">
                                    <Button size="sm" variant="outline" asChild>
                                        <Link href={`/dashboard/admin/subscription-management/edit/${plan.id}`}>
                                            <Edit className="mr-2 h-4 w-4" /> Bewerken
                                        </Link>
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleDeletePlan(plan)}>
                                        <Trash2 className="mr-2 h-4 w-4" /> Verwijderen
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={!!planToDelete} onOpenChange={(isOpen) => !isOpen && setPlanToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Weet u het zeker?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Deze actie kan niet ongedaan worden gemaakt. Dit zal het abonnement "{planToDelete?.name}" permanent verwijderen. Gebruikers op dit plan behouden hun toegang tot de volgende betaalperiode, maar nieuwe gebruikers kunnen zich niet aanmelden.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuleren</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeletePlan} className="bg-destructive hover:bg-destructive/90">Ja, verwijder</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
