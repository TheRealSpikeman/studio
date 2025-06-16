// src/app/dashboard/ouder/kinderen/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, UserPlus, Settings, BarChart3, CreditCard, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Child {
  id: string;
  name: string;
  ageGroup: string;
  avatarUrl?: string;
  subscriptionStatus: 'actief' | 'geen' | 'verlopen';
  lastActivity?: string; // e.g., "Quiz 'Focus' voltooid" or "Laatste les: Wiskunde"
}

// Dummy data - in a real app, this would be fetched based on the logged-in parent
const dummyChildren: Child[] = [
  {
    id: 'child1',
    name: 'Sofie de Tester',
    ageGroup: '12-14 jaar',
    avatarUrl: 'https://picsum.photos/seed/sofiechild/80/80',
    subscriptionStatus: 'actief',
    lastActivity: 'Quiz "Basis Neuroprofiel" voltooid',
  },
  {
    id: 'child2',
    name: 'Max de Tester',
    ageGroup: '15-18 jaar',
    avatarUrl: 'https://picsum.photos/seed/maxchild/80/80',
    subscriptionStatus: 'geen',
    lastActivity: 'Laatste les: Engels (1 dag geleden)',
  },
  {
    id: 'child3',
    name: 'Lisa Voorbeeld',
    ageGroup: '12-14 jaar',
    // No avatar to test fallback
    subscriptionStatus: 'verlopen',
    lastActivity: 'Coaching tip van gisteren bekeken',
  },
];

const getSubscriptionBadgeVariant = (status: Child['subscriptionStatus']): "default" | "secondary" | "destructive" => {
  if (status === 'actief') return 'default';
  if (status === 'geen') return 'secondary';
  return 'destructive';
};
const getSubscriptionBadgeClasses = (status: Child['subscriptionStatus']): string => {
  if (status === 'actief') return 'bg-green-100 text-green-700 border-green-300';
  if (status === 'geen') return 'bg-gray-100 text-gray-700 border-gray-300';
  return 'bg-red-100 text-red-700 border-red-300';
};


export default function BeheerKinderenPage() {
  const [children, setChildren] = useState<Child[]>(dummyChildren);

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mijn Kinderen</h1>
          <p className="text-muted-foreground">
            Beheer de profielen, abonnementen en voortgang van uw kinderen.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/dashboard/ouder">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Ouder Dashboard
                </Link>
            </Button>
            <Button className="w-full sm:w-auto">
                <UserPlus className="mr-2 h-4 w-4" /> Nieuw Kind Toevoegen
            </Button>
        </div>
      </div>

      {children.length === 0 ? (
        <Card className="text-center py-10">
          <CardContent>
            <p className="text-muted-foreground">U heeft nog geen kinderen toegevoegd aan uw account.</p>
            <Button className="mt-4">Nieuw Kind Toevoegen</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => (
            <Card key={child.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4 pb-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={child.avatarUrl} alt={child.name} data-ai-hint="child portrait" />
                  <AvatarFallback className="text-2xl bg-muted">{getInitials(child.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl font-semibold">{child.name}</CardTitle>
                  <CardDescription>{child.ageGroup}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Abonnement: </span>
                  <Badge 
                    variant={getSubscriptionBadgeVariant(child.subscriptionStatus)}
                    className={getSubscriptionBadgeClasses(child.subscriptionStatus)}
                  >
                    {child.subscriptionStatus.charAt(0).toUpperCase() + child.subscriptionStatus.slice(1)}
                  </Badge>
                </div>
                {child.lastActivity && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Laatste activiteit:</span> {child.lastActivity}
                  </p>
                )}
              </CardContent>
              <CardFooter className="grid grid-cols-2 gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" disabled>
                  <Edit className="mr-2 h-3.5 w-3.5" /> Profiel
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <BarChart3 className="mr-2 h-3.5 w-3.5" /> Resultaten
                </Button>
                <Button variant="outline" size="sm" disabled className="col-span-2">
                  <CreditCard className="mr-2 h-3.5 w-3.5" /> Beheer Abonnement
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
