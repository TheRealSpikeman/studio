// src/app/dashboard/ouder/abonnementen/page.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Euro, CreditCard, PlusCircle, Settings, LifeBuoy, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Dummy data - in a real app, this would be fetched
const dummySubscriptions = [
  { 
    id: 'sub1', 
    childName: 'Sofie de Tester', 
    planName: 'Coaching Maandelijks', 
    status: 'actief', 
    nextBillingDate: '2024-07-15', 
    price: '€2,50/mnd' 
  },
  { 
    id: 'sub2', 
    childName: 'Max de Tester', 
    planName: 'Nog geen abonnement', 
    status: 'geen', 
    nextBillingDate: null, 
    price: null 
  },
    { 
    id: 'sub3', 
    childName: 'Lisa Voorbeeld', 
    planName: 'Coaching Jaarlijks', 
    status: 'verlopen', 
    nextBillingDate: '2024-01-10', 
    price: '€25/jaar' 
  },
];

const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  if (status === 'actief') return 'default';
  if (status === 'geen') return 'secondary';
  return 'destructive'; // verlopen or others
};

const getStatusBadgeClasses = (status: string): string => {
  if (status === 'actief') return 'bg-green-100 text-green-700 border-green-300';
  if (status === 'geen') return 'bg-gray-100 text-gray-700 border-gray-300';
  return 'bg-red-100 text-red-700 border-red-300'; // verlopen
};

export default function AbonnementenPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Euro className="h-8 w-8 text-primary" />
            Mijn Abonnementen
          </h1>
          <p className="text-muted-foreground">
            Beheer hier de abonnementen en betalingsgegevens voor uw gezin.
          </p>
        </div>
        {/* Removed "Terug naar Ouder Dashboard" button */}
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Overzicht Abonnementen per Kind</CardTitle>
          <CardDescription>Bekijk de status van de MindNavigator abonnementen voor uw kinderen.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {dummySubscriptions.map(sub => (
            <Card key={sub.id} className="p-4 bg-muted/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="font-semibold">{sub.childName} - <span className="text-primary">{sub.planName}</span></h3>
                <p className="text-sm text-muted-foreground">
                  Status: {' '}
                  <Badge variant={getStatusBadgeVariant(sub.status)} className={getStatusBadgeClasses(sub.status)}>
                    {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                  </Badge>
                </p>
                {sub.nextBillingDate && sub.status === 'actief' && (
                  <p className="text-xs text-muted-foreground">Volgende betaling: {sub.nextBillingDate} ({sub.price})</p>
                )}
                 {sub.status === 'geen' && (
                    <p className="text-xs text-muted-foreground">Dit kind heeft nog geen actief MindNavigator abonnement.</p>
                )}
                 {sub.status === 'verlopen' && (
                    <p className="text-xs text-destructive">Abonnement verlopen op: {sub.nextBillingDate}</p>
                )}
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                {sub.status === 'geen' || sub.status === 'verlopen' ? (
                    <Button size="sm" className="w-full sm:w-auto" asChild>
                        <Link href="/#pricing">
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
          ))}
        </CardContent>
         <CardFooter className="border-t pt-6">
             <Button asChild>
                <Link href="/#pricing">
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
                <Link href="/for-parents#faq-payment">Bekijk FAQ over betalingen</Link>
            </Button>
        </CardContent>
      </Card>

    </div>
  );
}
