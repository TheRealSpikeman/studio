// src/app/dashboard/admin/subscription-management/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CreditCard, PlusCircle, Edit, Trash2, MoreVertical, CheckCircle, XCircle, Star } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingInterval: 'month' | 'year' | 'once';
  description: string;
  features: string[];
  active: boolean;
  maxChildren?: number; // Nieuw veld
  isPopular?: boolean;  // Nieuw veld
}

const initialSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free_start',
    name: 'Gratis Start',
    price: 0,
    currency: 'EUR',
    billingInterval: 'once',
    description: 'Basis neurodiversiteit quiz en PDF rapport.',
    features: ['Basis Neurodiversiteit Quiz', 'Uitgebreid PDF Rapport'],
    active: true,
    maxChildren: 1, // Voorbeeld, relevantie kan variëren
    isPopular: false,
  },
  {
    id: 'coaching_tools_monthly',
    name: 'Coaching & Tools - Maandelijks',
    price: 3.99,
    currency: 'EUR',
    billingInterval: 'month',
    description: 'Alle quizzen, coaching hub & huiswerk tools.',
    features: ['Alle Quizzen', 'Coaching Hub', 'Huiswerk Tools', 'Uitgebreid PDF Rapport'],
    active: true,
    maxChildren: 1,
    isPopular: true,
  },
  {
    id: 'coaching_tools_yearly',
    name: 'Coaching & Tools - Jaarlijks',
    price: 40.70, 
    currency: 'EUR',
    billingInterval: 'year',
    description: 'Alle quizzen, coaching hub & huiswerk tools met 15% korting.',
    features: ['Alle Quizzen (15% korting)', 'Coaching Hub', 'Huiswerk Tools', 'Uitgebreid PDF Rapport'],
    active: true,
    maxChildren: 1,
    isPopular: false,
  },
  {
    id: 'family_guide_monthly',
    name: 'Gezins Gids - Maandelijks',
    price: 9.99,
    currency: 'EUR',
    billingInterval: 'month',
    description: 'Alles van Coaching & Tools (max. 3 kinderen) + ouder dashboard en tutor pools.',
    features: ['Alles van Coaching & Tools (3 kinderen)', 'Toegang tot Coaches & Tutors', 'Uitgebreid Ouder Dashboard'],
    active: true,
    maxChildren: 3,
    isPopular: true,
  },
  {
    id: 'family_guide_yearly',
    name: 'Gezins Gids - Jaarlijks',
    price: 101.90,
    currency: 'EUR',
    billingInterval: 'year',
    description: 'Alles van Coaching & Tools (max. 3 kinderen) + ouder dashboard en tutor pools met 15% korting.',
    features: ['Alles van Coaching & Tools (3 kinderen, 15% korting)', 'Toegang tot Coaches & Tutors', 'Uitgebreid Ouder Dashboard'],
    active: true,
    maxChildren: 3,
    isPopular: false,
  },
];

export default function SubscriptionManagementPage() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

  useEffect(() => {
    const storedPlans = localStorage.getItem('subscriptionPlans');
    if (storedPlans) {
      try {
        const parsedPlans: SubscriptionPlan[] = JSON.parse(storedPlans);
        // Voeg default waarden toe voor nieuwe velden als ze ontbreken
        const migratedPlans = parsedPlans.map(plan => ({
          ...plan,
          maxChildren: plan.maxChildren ?? (plan.id.includes('family') ? 3 : 1), // Default voor gezinsplannen
          isPopular: plan.isPopular ?? false,
        }));
        setPlans(migratedPlans);
      } catch (error) {
        console.error("Error parsing subscription plans from localStorage:", error);
        // Fallback to initial if parsing fails
        localStorage.setItem('subscriptionPlans', JSON.stringify(initialSubscriptionPlans));
        setPlans(initialSubscriptionPlans);
      }
    } else {
      localStorage.setItem('subscriptionPlans', JSON.stringify(initialSubscriptionPlans));
      setPlans(initialSubscriptionPlans);
    }
  }, []);

  const handleDeletePlan = (planId: string) => {
    const updatedPlans = plans.filter(plan => plan.id !== planId);
    setPlans(updatedPlans);
    localStorage.setItem('subscriptionPlans', JSON.stringify(updatedPlans));
    toast({ title: "Abonnement Verwijderd", description: `Abonnement met ID ${planId} is verwijderd.` });
  };
  
  const formatPrice = (price: number, currency: string, interval: 'month' | 'year' | 'once') => {
    if (price === 0 && interval === 'once') return 'Gratis';
    const intervalText = interval === 'month' ? '/mnd' : interval === 'year' ? '/jaar' : '';
    return `${currency === 'EUR' ? '€' : currency}${price.toFixed(2)}${intervalText}`;
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-primary" />
                Abonnementenbeheer
              </CardTitle>
              <CardDescription>
                Beheer hier de abonnementsplannen die beschikbaar zijn voor gebruikers.
              </CardDescription>
            </div>
            <Button asChild>
              <Link href="/dashboard/admin/subscription-management/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Nieuw Abonnement Toevoegen
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Naam</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Prijs</TableHead>
                  <TableHead>Interval</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Populair</TableHead>
                  <TableHead className="text-right">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="h-24 text-center">Geen abonnementen geconfigureerd.</TableCell></TableRow>
                )}
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{plan.id}</TableCell>
                    <TableCell>{formatPrice(plan.price, plan.currency, plan.billingInterval)}</TableCell>
                    <TableCell>{plan.billingInterval}</TableCell>
                    <TableCell>
                      <Badge variant={plan.active ? 'default' : 'secondary'} className={plan.active ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-700 border-gray-300'}>
                        {plan.active ? 'Actief' : 'Inactief'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {plan.isPopular && <Star className="h-5 w-5 text-yellow-500 fill-yellow-400" />}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" /><span className="sr-only">Acties</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/admin/subscription-management/edit/${plan.id}`}><Edit className="mr-2 h-4 w-4" />Bewerken</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeletePlan(plan.id)} className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />Verwijderen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
