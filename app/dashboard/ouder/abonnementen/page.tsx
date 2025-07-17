// src/app/dashboard/ouder/abonnementen/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Euro, CreditCard, PlusCircle, Settings, LifeBuoy, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import type { SubscriptionPlan } from '@/types/subscription';
import { getSubscriptionPlans, formatPrice as formatPlanPrice } from '@/types/subscription';

interface ChildSubscription {
  id: string; // Unique ID for the child's subscription entry
  childName: string;
  planId: string | null; // ID linking to a SubscriptionPlan, or null if no plan
  status: 'actief' | 'geen' | 'verlopen';
  nextBillingDate?: string; // ISO string
  endDate?: string; // ISO string, for verlopen status
}

// Initial dummy child subscriptions linked by planId
const initialChildSubscriptions: ChildSubscription[] = [
  {
    id: 'cs_sofie',
    childName: 'Sofie de Tester',
    planId: '1_kind_maand', // Matches new planId
    status: 'actief',
    nextBillingDate: new Date(Date.now() + 20 * 86400000).toISOString(), // Approx 20 days from now
  },
  {
    id: 'cs_max',
    childName: 'Max de Tester',
    planId: null,
    status: 'geen',
  },
  {
    id: 'cs_lisa',
    childName: 'Lisa Voorbeeld',
    planId: 'gezin_maand', // Matches new planId
    status: 'verlopen',
    endDate: new Date(Date.now() - 30 * 86400000).toISOString(), // Approx 30 days ago
  },
];

const getStatusBadgeVariant = (status: ChildSubscription['status']): "default" | "secondary" | "destructive" | "outline" => {
  if (status === 'actief') return 'default';
  if (status === 'geen') return 'secondary';
  return 'destructive'; // verlopen or others
};

const getStatusBadgeClasses = (status: ChildSubscription['status']): string => {
  if (status === 'actief') return 'bg-green-100 text-green-700 border-green-300';
  if (status === 'geen') return 'bg-gray-100 text-gray-700 border-gray-300';
  return 'bg-red-100 text-red-700 border-red-300'; // verlopen
};

export default function AbonnementenPage() {
  const [allSubscriptionPlans, setAllSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [childSubscriptions, setChildSubscriptions] = useState<ChildSubscription[]>(initialChildSubscriptions);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setAllSubscriptionPlans(getSubscriptionPlans());
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Abonnementen laden...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Euro className="h-8 w-8 text-primary" />
            Mijn Abonnementen
          </h1>
          <p className="text-muted-foreground">
            Beheer hier de abonnementen voor de coaching-hub en bijlessen voor uw gezin. Bekijk factuurhistorie en pas betaalmethoden aan.
          </p>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Overzicht Abonnementen per Kind</CardTitle>
          <CardDescription>Bekijk de status van de MindNavigator abonnementen voor uw kinderen.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {childSubscriptions.map(sub => {
            const planDetails = sub.planId ? allSubscriptionPlans.find(p => p.id === sub.planId) : null;
            const planName = planDetails ? planDetails.name : 'Nog geen abonnement';
            const planPriceDisplay = planDetails ? formatPlanPrice(planDetails.price, planDetails.currency, planDetails.billingInterval) : null;

            return (
              <Card key={sub.id} className="p-4 bg-muted/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="font-semibold">{sub.childName} - <span className="text-primary">{planName}</span></h3>
                  <p className="text-sm text-muted-foreground">
                    Status: {' '}
                    <Badge variant={getStatusBadgeVariant(sub.status)} className={getStatusBadgeClasses(sub.status)}>
                      {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                    </Badge>
                  </p>
                  {sub.nextBillingDate && sub.status === 'actief' && planPriceDisplay &&(
                    <p className="text-xs text-muted-foreground">
                      Volgende betaling: {format(parseISO(sub.nextBillingDate), 'PPP', { locale: nl })} ({planPriceDisplay})
                    </p>
                  )}
                  {sub.status === 'geen' && (
                      <p className="text-xs text-muted-foreground">Dit kind heeft nog geen actief MindNavigator abonnement.</p>
                  )}
                  {sub.status === 'verlopen' && sub.endDate && (
                      <p className="text-xs text-destructive">
                        Abonnement verlopen op: {format(parseISO(sub.endDate), 'PPP', { locale: nl })}
                      </p>
                  )}
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  {sub.status === 'geen' || sub.status === 'verlopen' ? (
                      <Button size="sm" className="w-full sm:w-auto" asChild>
                          <Link href="/pricing">
                              <PlusCircle className="mr-2 h-4 w-4" /> Nieuw Abonnement
                          </Link>
                      </Button>
                  ) : (
                      <Button variant="outline" size="sm" disabled className="w-full sm:w-auto">
                          <Settings className="mr-2 h-4 w-4" /> Beheren (binnenkort)
                      </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </CardContent>
         <CardFooter className="border-t pt-6">
             <Button asChild>
                <Link href="/pricing">
                    <ShoppingCart className="mr-2 h-4 w-4" /> Bekijk alle abonnementen
                </Link>
             </Button>
        </CardFooter>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary"/>Betaalmethoden</CardTitle>
          <CardDescription>Beheer uw opgeslagen betaalmethoden.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Uw primaire betaalmethode: Visa **** **** **** 1234 (Vervalt 12/25)</p>
          <Button variant="outline" className="mt-3" disabled>Betaalmethode Wijzigen (binnenkort)</Button>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><LifeBuoy className="h-5 w-5 text-primary"/>Hulp & Veelgestelde Vragen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
                Heeft u vragen over uw abonnementen of betalingen? 
                <Button variant="link" className="p-0 h-auto ml-1" asChild>
                    <Link href="/contact">Neem contact op met support</Link>
                </Button>
            </p>
            <Button variant="link" className="p-0 h-auto" asChild>
                <Link href="/faq#faq-payment">Bekijk FAQ over betalingen</Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
