// src/app/dashboard/ouder/kinderen/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, UserPlus, Settings, BarChart3, CreditCard, Edit, Mail, School, Info, Cake, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AddChildForm, type AddChildFormData } from '@/components/ouder/AddChildForm';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription as AlertDescUi, AlertTitle as AlertTitleUi } from "@/components/ui/alert";
import type { User } from '@/types/user'; // Import the main User type

interface Child extends Pick<User, 'id' | 'firstName' | 'lastName' | 'age' | 'ageGroup' | 'avatarUrl' | 'subscriptionStatus' | 'childEmail' | 'schoolType' | 'className' | 'helpSubjects'> {
  // Specific Child fields if any, otherwise it's a subset of User
  lastActivity?: string; // Example of a child-specific field not on User
}


// Dummy data - in a real app, this would be fetched based on the logged-in parent
const dummyChildren: Child[] = [
  {
    id: 'child1',
    firstName: 'Sofie',
    lastName: 'de Tester',
    age: 13,
    ageGroup: '12-14 jaar',
    avatarUrl: 'https://picsum.photos/seed/sofiechild/80/80',
    subscriptionStatus: 'actief',
    lastActivity: 'Quiz "Basis Neuroprofiel" voltooid',
    childEmail: 'sofie.tester@example.com',
    schoolType: 'HAVO',
    className: '2B',
    helpSubjects: ['wiskunde', 'nederlands'],
  },
  {
    id: 'child2',
    firstName: 'Max',
    lastName: 'de Tester',
    age: 16,
    ageGroup: '15-18 jaar',
    avatarUrl: 'https://picsum.photos/seed/maxchild/80/80',
    subscriptionStatus: 'geen',
    lastActivity: 'Laatste les: Engels (1 dag geleden)',
    childEmail: 'max.tester@example.com',
    schoolType: 'VWO',
    helpSubjects: ['engels'],
  },
  {
    id: 'child3',
    firstName: 'Lisa',
    lastName: 'Voorbeeld',
    age: 12,
    ageGroup: '12-14 jaar',
    subscriptionStatus: 'verlopen',
    lastActivity: 'Coaching tip van gisteren bekeken',
    helpSubjects: [],
  },
];

const getSubscriptionBadgeVariant = (status: Child['subscriptionStatus']): "default" | "secondary" | "destructive" | "outline" => {
  if (status === 'actief') return 'default';
  if (status === 'geen') return 'secondary';
  if (status === 'uitgenodigd') return 'outline';
  return 'destructive'; // verlopen
};
const getSubscriptionBadgeClasses = (status: Child['subscriptionStatus']): string => {
  if (status === 'actief') return 'bg-green-100 text-green-700 border-green-300';
  if (status === 'geen') return 'bg-gray-100 text-gray-700 border-gray-300';
  if (status === 'uitgenodigd') return 'bg-blue-100 text-blue-700 border-blue-300';
  return 'bg-red-100 text-red-700 border-red-300'; // verlopen
};


export default function BeheerKinderenPage() {
  const [children, setChildren] = useState<Child[]>(dummyChildren);
  const [isAddingChildMode, setIsAddingChildMode] = useState(false);
  const { toast } = useToast();

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';

  const handleSaveChild = (data: AddChildFormData) => {
    const childAge = parseInt(data.age, 10);
    let derivedAgeGroup: '12-14 jaar' | '15-18 jaar' = '12-14 jaar'; // Default
    if (childAge >= 12 && childAge <= 14) {
        derivedAgeGroup = '12-14 jaar';
    } else if (childAge >= 15 && childAge <= 18) {
        derivedAgeGroup = '15-18 jaar';
    }

    const newChild: Child = {
      id: `child-${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      age: childAge,
      ageGroup: derivedAgeGroup,
      childEmail: data.childEmail,
      schoolType: data.schoolType,
      className: data.className,
      subscriptionStatus: 'uitgenodigd', // New children start as 'uitgenodigd'
      avatarUrl: `https://placehold.co/80x80.png?text=${data.firstName[0]}${data.lastName[0]}`,
      helpSubjects: data.helpSubjects || [],
    };
    setChildren(prev => [newChild, ...prev]);
    setIsAddingChildMode(false);
    toast({
      title: "Kind Toegevoegd & Uitgenodigd",
      description: `${data.firstName} ${data.lastName} is succesvol toegevoegd. Een uitnodigingsmail is (gesimuleerd) verstuurd naar ${data.childEmail} om het account te activeren.`,
    });
    console.log("Simulating invitation email to:", data.childEmail, "with data:", newChild);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mijn Kinderen</h1>
          <p className="text-muted-foreground">
            Beheer de profielen, abonnementen en voortgang van uw kinderen.
          </p>
        </div>
        {!isAddingChildMode && (
            <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" asChild className="w-full sm:w-auto">
                    <Link href="/dashboard/ouder">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Ouder Dashboard
                    </Link>
                </Button>
                <Button className="w-full sm:w-auto" onClick={() => setIsAddingChildMode(true)}>
                    <UserPlus className="mr-2 h-4 w-4" /> Nieuw Kind Toevoegen
                </Button>
            </div>
        )}
      </div>

      {isAddingChildMode ? (
         <AddChildForm
            onSave={handleSaveChild}
            onCancel={() => setIsAddingChildMode(false)}
        />
      ) : children.length === 0 ? (
        <Card className="text-center py-10">
          <CardContent>
            <p className="text-muted-foreground">U heeft nog geen kinderen toegevoegd aan uw account.</p>
            <Button className="mt-4" onClick={() => setIsAddingChildMode(true)}>Nieuw Kind Toevoegen</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => (
            <Card key={child.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4 pb-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={child.avatarUrl} alt={`${child.firstName} ${child.lastName}`} data-ai-hint="child person" />
                  <AvatarFallback className="text-2xl bg-muted">{getInitials(`${child.firstName} ${child.lastName}`)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl font-semibold">{`${child.firstName} ${child.lastName}`}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Cake className="h-4 w-4 text-muted-foreground"/> {child.age ? `${child.age} jaar` : (child.ageGroup || 'N.v.t.')}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Status: </span>
                  <Badge
                    variant={getSubscriptionBadgeVariant(child.subscriptionStatus)}
                    className={getSubscriptionBadgeClasses(child.subscriptionStatus)}
                  >
                    {child.subscriptionStatus.charAt(0).toUpperCase() + child.subscriptionStatus.slice(1)}
                  </Badge>
                </div>
                {child.childEmail && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5"/> {child.childEmail}
                    </p>
                )}
                {(child.schoolType || child.className) && (
                     <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <School className="h-3.5 w-3.5"/>
                        {child.schoolType}{child.schoolType && child.className ? ', ' : ''}{child.className}
                    </p>
                )}
                {child.helpSubjects && child.helpSubjects.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                      <span className="font-medium flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5"/> Hulp nodig bij:</span> {child.helpSubjects.join(', ')}
                  </p>
                )}
                {child.lastActivity && child.subscriptionStatus !== 'uitgenodigd' && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Laatste activiteit:</span> {child.lastActivity}
                  </p>
                )}
                 {child.subscriptionStatus === 'uitgenodigd' && (
                   <Alert variant="default" className="mt-2 p-3 text-xs bg-blue-50 border-blue-200">
                      <Info className="h-4 w-4 !text-blue-600" />
                      <AlertDescUi className="!text-blue-700 pl-0">
                        Wacht op account activatie door kind.
                      </AlertDescUi>
                    </Alert>
                )}
              </CardContent>
              <CardFooter className="grid grid-cols-2 gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" disabled>
                  <Edit className="mr-2 h-3.5 w-3.5" /> Profiel
                </Button>
                <Button variant="outline" size="sm" disabled={child.subscriptionStatus === 'uitgenodigd'}>
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
