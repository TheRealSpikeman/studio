// src/app/dashboard/admin/subscription-management/page.tsx
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CreditCard, Edit, Trash2, PlusCircle, Star, MoreVertical, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getSubscriptionPlans, type SubscriptionPlan, deleteSubscriptionPlan, seedInitialPlans, formatFullPrice } from '@/types/subscription';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount);
};

export default function SubscriptionManagementPage() {
    const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null);

    const fetchPlans = async () => {
        setIsLoading(true);
        try {
            const plans = await getSubscriptionPlans();
            const sortedPlans = plans.sort((a, b) => (a.price || 0) - (b.price || 0));
            setAvailablePlans(sortedPlans);
        } catch(e) {
            toast({ title: "Fout bij laden", description: "Kon abonnementen niet ophalen uit de database.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleDeletePlan = (plan: SubscriptionPlan) => {
        setPlanToDelete(plan);
    };
    
    const confirmDeletePlan = async () => {
        if (!planToDelete) return;
        
        try {
            await deleteSubscriptionPlan(planToDelete.id);
            toast({
                title: "Abonnement Verwijderd",
                description: `Het abonnement "${planToDelete.name}" is verwijderd.`
            });
            setPlanToDelete(null);
            fetchPlans(); // Refresh the list from Firestore
        } catch (error) {
             toast({
                title: "Fout bij verwijderen",
                description: (error as Error).message,
                variant: "destructive"
            });
        }
    };

    const handleRestoreDefaults = async () => {
        try {
            await seedInitialPlans(true); // Force seeding
            toast({
                title: "Standaard Abonnementen Hersteld",
                description: "De originele abonnementen zijn teruggezet in de database."
            });
            fetchPlans(); // Refresh
        } catch (error) {
             toast({
                title: "Herstellen Mislukt",
                description: (error as Error).message,
                variant: "destructive"
            });
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                Huidige Abonnementen
                            </CardTitle>
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
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Plan Naam</TableHead>
                          <TableHead>Kinderen</TableHead>
                          <TableHead>Prijs/Maand</TableHead>
                          <TableHead>Prijs/Jaar</TableHead>
                          <TableHead>Korting</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Populair</TableHead>
                          <TableHead className="text-right">Acties</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {availablePlans.map(plan => {
                            const yearlyPrice = plan.price * 12 * (1 - (plan.yearlyDiscountPercent || 0) / 100);
                            return (
                                <TableRow key={plan.id}>
                                    <TableCell className="font-medium">{plan.name}</TableCell>
                                    <TableCell>{plan.maxChildren ?? 'N/A'}</TableCell>
                                    <TableCell>{formatCurrency(plan.price)}</TableCell>
                                    <TableCell>{formatCurrency(yearlyPrice)}</TableCell>
                                    <TableCell>{plan.yearlyDiscountPercent || 0}%</TableCell>
                                    <TableCell>
                                        <Badge variant={plan.active ? 'default' : 'secondary'} className={cn(plan.active ? "bg-green-100 text-green-700 border-green-300" : "bg-gray-100 text-gray-700 border-gray-300")}>Actief</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {plan.isPopular ? <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-300">Populair</Badge> : '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/dashboard/admin/subscription-management/edit/${plan.id}`}>
                                                Bewerken
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                      </TableBody>
                    </Table>
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