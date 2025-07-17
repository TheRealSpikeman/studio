// src/app/dashboard/admin/subscription-management/page.tsx
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CreditCard, Edit, Trash2, PlusCircle, Star, MoreVertical, Loader2 } from '@/lib/icons';
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getSubscriptionPlans, type SubscriptionPlan, deleteSubscriptionPlan, seedInitialPlans } from '@/types/subscription';

const formatPlanPrice = (plan: SubscriptionPlan) => {
    const parentPrice = plan.pricePerMonthParent ?? 0;
    const childPrice = plan.pricePerMonthChild ?? 0;
    
    if (parentPrice === 0 && childPrice === 0) return 'Gratis';

    const yearlyDiscount = plan.yearlyDiscountPercent || 0;
    const yearlyFactor = 12 * (1 - yearlyDiscount / 100);

    const monthlyPriceText = `${parentPrice > 0 ? `€${parentPrice.toFixed(2)}/ouder` : ''}${parentPrice > 0 && childPrice > 0 ? ' + ' : ''}${childPrice > 0 ? `€${childPrice.toFixed(2)}/kind` : ''}`;
    const yearlyPriceParent = (parentPrice * yearlyFactor).toFixed(2);
    const yearlyPriceChild = (childPrice * yearlyFactor).toFixed(2);
    const yearlyPriceText = `${parentPrice > 0 ? `€${yearlyPriceParent}/ouder` : ''}${parentPrice > 0 && childPrice > 0 ? ' + ' : ''}${childPrice > 0 ? `€${yearlyPriceChild}/kind` : ''}`;

    return `${monthlyPriceText.replace(/\./g, ',')}/mnd (${yearlyDiscount}% korting per jaar)`;
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
            const sortedPlans = plans.sort((a, b) => (a.pricePerMonthParent ?? 0) + (a.pricePerMonthChild ?? 0) - ((b.pricePerMonthParent ?? 0) + (b.pricePerMonthChild ?? 0)));
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
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Status</TableHead>
                          <TableHead>Plannaam</TableHead>
                          <TableHead>Prijs Model</TableHead>
                          <TableHead className="text-right">Acties</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {availablePlans.map(plan => (
                          <TableRow key={plan.id}>
                            <TableCell>
                                <Badge variant={plan.active ? 'default' : 'secondary'} className={cn(plan.active ? "bg-green-100 text-green-700 border-green-300" : "bg-gray-100 text-gray-700 border-gray-300")}>{plan.active ? "Actief" : "Inactief"}</Badge>
                                {plan.isPopular && <Badge variant="secondary" className="ml-1 text-xs bg-yellow-100 text-yellow-700"><Star className="h-3 w-3 inline-block" /></Badge>}
                            </TableCell>
                            <TableCell className="font-medium">{plan.name}</TableCell>
                            <TableCell className="text-xs">{formatPlanPrice(plan)}</TableCell>
                            <TableCell className="text-right">
                               <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreVertical className="h-4 w-4" />
                                      <span className="sr-only">Acties voor {plan.name}</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href={`/dashboard/admin/subscription-management/edit/${plan.id}`}>
                                            <Edit className="mr-2 h-4 w-4" /> Bewerken
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleDeletePlan(plan)}
                                      className="text-destructive focus:text-destructive"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" /> Verwijderen
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
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
