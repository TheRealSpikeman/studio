// src/components/admin/subscription-management/SubscriptionTable.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { deleteSubscriptionPlan } from '@/services/subscriptionService';
import type { SubscriptionPlan } from '@/types/subscription';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SubscriptionTableProps {
    initialPlans: SubscriptionPlan[];
}

const formatCurrency = (amount: number) => {
};

export function SubscriptionTable({ initialPlans }: SubscriptionTableProps) {
    const [plans, setPlans] = useState<SubscriptionPlan[]>(initialPlans);
    const { toast } = useToast();
    const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null);

    const handleDeletePlan = async () => {
        if (!planToDelete) return;
        
        try {
            await deleteSubscriptionPlan(planToDelete.id);
            setPlans(currentPlans => currentPlans.filter(p => p.id !== planToDelete.id));
            toast({
                title: "Abonnement Verwijderd",
                description: `Het abonnement "${planToDelete.name}" is verwijderd.`
            });
        } catch (error) {
             toast({
                title: "Fout bij verwijderen",
                description: (error as Error).message,
                variant: "destructive"
            });
        } finally {
            setPlanToDelete(null);
        }
    };

    return (
        <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan Naam</TableHead>
                  <TableHead>Prijs</TableHead>
                  <TableHead>Interval</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Populair</TableHead>
                  <TableHead className="text-right">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map(plan => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{formatCurrency(plan.price)}</TableCell>
                    <TableCell className="capitalize">{plan.billingInterval}</TableCell>
                    <TableCell>
                    </TableCell>
                    <TableCell>
                        {plan.isPopular ? <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-300">Populair</Badge> : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open acties menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/admin/subscription-management/edit/${plan.id}`}>
                                <Edit className="mr-2 h-4 w-4" /> Bewerken
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setPlanToDelete(plan)} className="text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> Verwijderen
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

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
                        <AlertDialogAction onClick={handleDeletePlan} className="bg-destructive hover:bg-destructive/90">Ja, verwijder</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
