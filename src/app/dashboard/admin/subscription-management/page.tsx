
// src/app/dashboard/admin/subscription-management/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CreditCard, PlusCircle, Edit, Trash2, MoreVertical, CheckCircle, XCircle, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export interface SubscriptionPlan {
  id: string; // uniek, bijv. 'free_start', 'family_guide_monthly'
  name: string; // Publieke naam
  description: string;
  price: number; // Numerieke prijs
  currency: string; // bijv. "EUR"
  billingInterval: 'month' | 'year' | 'once';
  features: string[]; // Array van feature strings
  active: boolean; // Is het plan selecteerbaar?
  trialPeriodDays?: number; // Aantal dagen gratis proefperiode
  maxChildren?: number; // Maximaal aantal kinderen (0 of undefined voor ongelimiteerd/niet van toepassing)
  isPopular?: boolean; // Voor highlighting
}

const initialSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free_start',
    name: 'Gratis Ontdekking',
    description: 'Basis zelfreflectie tool & PDF overzicht.',
    price: 0,
    currency: 'EUR',
    billingInterval: 'once',
    features: ['Start-assessment', 'Wekelijkse motivatie-email', 'Basis zelfreflectie tool (beperkt)', 'Sample coaching content (5 voorbeeldberichten)', 'Basis PDF overzicht van sterke punten', 'Browse coaches & tutors (profielen bekijken)', 'Tarieven en specialisaties zien', 'Geen sessies boeken', 'Account beheer en basisinstellingen', 'Geen voortgangsanalytics'],
    active: true,
    trialPeriodDays: 0,
    maxChildren: 1, 
    isPopular: false,
  },
  {
    id: 'family_guide_monthly',
    name: 'Familie Coaching - Maandelijks',
    description: 'Coaching, alle tools, en tot 3 kinderen.',
    price: 19.99,
    currency: 'EUR',
    billingInterval: 'month',
    features: ['Start-assessment inbegrepen', 'Dagelijkse coaching berichten (gepersonaliseerd)', 'Alle zelfreflectie instrumenten (unlimited)', 'Interactieve dagboek en reflectie-oefeningen', 'Huiswerk planner en focus tools (Pomodoro)', 'Motivatie tracking met voortgangsvisualisatie', 'Uitgebreide PDF overzichten met diepgaande insights', 'Sessies boeken en betalen bij coaches & tutors', 'Direct contact en communicatie met professionals', 'Review en rating systeem', 'Sessie planning met automatische herinneringen', 'Voortgangsvolging en trends van uw kind', 'Familie insights en gepersonaliseerde aanbevelingen', 'Tot 3 kinderen inbegrepen', 'Communicatie met gekoppelde coaches en tutors'],
    active: true,
    trialPeriodDays: 14,
    maxChildren: 3,
    isPopular: true,
  },
  {
    id: 'family_guide_yearly',
    name: 'Familie Coaching - Jaarlijks',
    description: 'Coaching, alle tools, tot 3 kinderen met 15% jaarkorting.',
    price: (19.99 * 12 * 0.85), // Circa 203.88
    currency: 'EUR',
    billingInterval: 'year',
    features: ['Alle features van Familie Coaching - Maandelijks', '15% korting bij jaarlijkse betaling'],
    active: true,
    trialPeriodDays: 14,
    maxChildren: 3,
    isPopular: false,
  },
  {
    id: 'premium_family_monthly',
    name: 'Premium Familie - Maandelijks',
    description: 'Alles van Familie Coaching, plus premium features en onbeperkt kinderen.',
    price: 39.99,
    currency: 'EUR',
    billingInterval: 'month',
    features: ['Start-assessment inbegrepen', 'Uitgebreide assessment analyse & rapportage', 'Alles van Familie Coaching PLUS:', 'AI-powered insights en gepersonaliseerde aanbevelingen', 'Advanced analytics en trendanalyse', 'Exclusieve coaching modules en premium content', 'Prioriteit algoritme voor beste coach matching', 'Prioriteit booking bij populaire coaches & tutors', 'Extended zoekfilters en matching criteria', 'Bulk session planning voor gemak', 'Premium support (24u response tijd)', 'Unlimited kinderen (geen limiet meer)', 'Maandelijkse familie coaching calls (30 min)', 'School integratie tools en rapportage', 'Advanced ouder training modules'],
    active: true,
    trialPeriodDays: 14,
    maxChildren: 0, // 0 for unlimited
    isPopular: false,
  },
  {
    id: 'premium_family_yearly',
    name: 'Premium Familie - Jaarlijks',
    description: 'Alles van Premium Familie met 15% jaarkorting.',
    price: (39.99 * 12 * 0.85), // Circa 407.88
    currency: 'EUR',
    billingInterval: 'year',
    features: ['Alle features van Premium Familie - Maandelijks', '15% korting bij jaarlijkse betaling'],
    active: true,
    trialPeriodDays: 14,
    maxChildren: 0, // 0 for unlimited
    isPopular: false,
  },
];

export default function SubscriptionManagementPage() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

  useEffect(() => {
    const storedPlansRaw = localStorage.getItem('subscriptionPlans');
    if (storedPlansRaw) {
      try {
        const parsedPlans: SubscriptionPlan[] = JSON.parse(storedPlansRaw);
        // Migrate old plans: add new fields with defaults if missing
        const migratedPlans = parsedPlans.map(plan => ({
            ...plan,
            trialPeriodDays: plan.trialPeriodDays ?? (plan.price === 0 ? 0 : 14),
            maxChildren: plan.maxChildren ?? (plan.id.includes('family') || plan.id.includes('gezin') ? 3 : (plan.price === 0 ? 1 : 0)),
            isPopular: plan.isPopular ?? false,
        }));
        setPlans(migratedPlans);
        if (JSON.stringify(parsedPlans) !== JSON.stringify(migratedPlans)) {
            localStorage.setItem('subscriptionPlans', JSON.stringify(migratedPlans));
        }
      } catch (error) {
        console.error("Error parsing subscription plans from localStorage:", error);
        setPlans(initialSubscriptionPlans);
        localStorage.setItem('subscriptionPlans', JSON.stringify(initialSubscriptionPlans));
      }
    } else {
      setPlans(initialSubscriptionPlans);
      localStorage.setItem('subscriptionPlans', JSON.stringify(initialSubscriptionPlans));
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
                  <TableHead>Proefperiode</TableHead>
                  <TableHead>Max. Kinderen</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Populair</TableHead>
                  <TableHead className="text-right">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.length === 0 && (
                  <TableRow><TableCell colSpan={9} className="h-24 text-center">Geen abonnementen geconfigureerd.</TableCell></TableRow>
                )}
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{plan.id}</TableCell>
                    <TableCell>{formatPrice(plan.price, plan.currency, plan.billingInterval)}</TableCell>
                    <TableCell>{plan.billingInterval}</TableCell>
                    <TableCell>{plan.trialPeriodDays ? `${plan.trialPeriodDays} dagen` : 'N.v.t.'}</TableCell>
                    <TableCell>{plan.maxChildren === 0 ? 'Onbeperkt' : (plan.maxChildren || 'N.v.t.')}</TableCell>
                    <TableCell>
                      <Badge variant={plan.active ? 'default' : 'secondary'} className={plan.active ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-700 border-gray-300'}>
                        {plan.active ? <CheckCircle className="mr-1 h-3 w-3"/> : <XCircle className="mr-1 h-3 w-3"/>}
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
    