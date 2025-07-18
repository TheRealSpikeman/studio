// src/components/admin/subscription-management/SubscriptionTable.tsx
'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { SubscriptionPlan } from '@/types/subscription';

interface SubscriptionTableProps {
    initialPlans: SubscriptionPlan[];
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount);
};

export function SubscriptionTable({ initialPlans }: SubscriptionTableProps) {
    const [plans, setPlans] = useState<SubscriptionPlan[]>(initialPlans);

    return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan Naam</TableHead>
              <TableHead>Prijs</TableHead>
              <TableHead>Interval</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Populair</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map(plan => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.name}</TableCell>
                <TableCell>{formatCurrency(plan.price)}</TableCell>
                <TableCell className="capitalize">{plan.billingInterval}</TableCell>
                <TableCell>
                    <Badge variant={plan.active ? 'default' : 'secondary'} className={cn(plan.active ? "bg-green-100 text-green-700 border-green-300" : "bg-gray-100 text-gray-700 border-gray-300")}>{plan.active ? 'Actief' : 'Inactief'}</Badge>
                </TableCell>
                <TableCell>
                    {plan.isPopular ? <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-300">Populair</Badge> : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    );
}