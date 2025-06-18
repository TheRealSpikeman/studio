"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, UserPlus, Settings, BarChart3, CreditCard, Edit, Mail, School, Info, Cake, GraduationCap, Trash2, TrendingUp, Target, Users, Share2, Link2, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AddChildForm, type AddChildFormData } from '@/components/ouder/AddChildForm';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription as AlertDescUi, AlertTitle as AlertTitleUi } from "@/components/ui/alert";
import type { User } from '@/types/user';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


interface Child extends Pick<User, 'id' | 'name' | 'ageGroup' | 'avatarUrl' | 'hulpvraagType' > { 
  firstName: string;
  lastName: string;
  age?: number;
  childEmail?: string;
  schoolType?: string;
  otherSchoolType?: string; // Nieuw
  className?: string;
  helpSubjects?: string[];
  subscriptionStatus: 'actief' | 'geen' | 'verlopen' | 'uitgenodigd';
  lastActivity?: string;
  leerdoelen?: string;
  voorkeurTutor?: string; 
  deelResultatenMetTutor?: boolean; 
  linkedTutorIds?: string[]; 
}


const dummyChildren: Child[] = [
  {
    id: 'child1',
    firstName: 'Sofie',
    lastName: 'de Tester',
    name: 'Sofie de Tester',
    age: 13,
    ageGroup: '12-14',
    avatarUrl: 'https://picsum.photos/seed/sofiechild/80/80',
    subscriptionStatus: 'actief',
    lastActivity: 'Quiz "Basis Neuroprofiel" voltooid',
    childEmail: 'sofie.tester@example.com',
    schoolType: 'HAVO',
    className: '2B',
    helpSubjects: ['wiskunde', 'nederlands'],
    hulpvraagType: ['tutor'],
    leerdoelen: 'Geselecteerd: Beter leren plannen voor toetsen, Omgaan met faalangst. Overig: Kind heeft moeite met beginnen aan taken.',
    voorkeurTutor: 'Geselecteerde voorkeuren: Ervaring met HSP, Geduldig. Overig: Iemand met ervaring met visueel ingestelde leerlingen.',
    deelResultatenMetTutor: true,
    linkedTutorIds: ['tutor1'],
  },
  {
    id: 'child2',
    firstName: 'Max',
    lastName: 'de Tester',
    name: 'Max de Tester',
    age: 16,
    ageGroup: '15-18',
    avatarUrl: 'https://picsum.photos/seed/maxchild/80/80',
    subscriptionStatus: 'actief',
    lastActivity: 'Laatste les: Engels (1 dag geleden)',
    childEmail: 'max.tester@example.com',
    schoolType: 'VWO',
    helpSubjects: ['engels', 'geschiedenis'],
    hulpvraagType: ['tutor', 'coach'],
    leerdoelen: 'Geselecteerd: Concentratie verbeteren tijdens de les. Overig: Verbeteren van spreekvaardigheid Engels en essay schrijven.',
    voorkeurTutor: 'Geselecteerde voorkeuren: Man. Overig: Tutor die ook kan helpen met motivatie.',
    deelResultatenMetTutor: false,
    linkedTutorIds: [],
  },
  {
    id: 'child3',
    firstName: 'Lisa',
    lastName: 'Voorbeeld',
    name: 'Lisa Voorbeeld',
    age: 12,
    ageGroup: '12-14',
    subscriptionStatus: 'geen', // Updated
    lastActivity: 'Coaching tip van gisteren bekeken',
    childEmail: 'lisa.voorbeeld@example.com',
    schoolType: 'Anders',
    otherSchoolType: 'Internationale School',
    helpSubjects: [],
    hulpvraagType: ['coach'],
    leerdoelen: 'Geselecteerd: Zelfvertrouwen vergroten.',
    voorkeurTutor: 'Geselecteerde voorkeuren: Vrouw, Ervaring met faalangst.',
    deelResultatenMetTutor: true,
    linkedTutorIds: ['tutor2', 'tutor3'],
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [childToDelete, setChildToDelete] = useState<Child | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';

  const handleSaveChild = (data: AddChildFormData) => {
    const childAge = parseInt(data.age, 10);
    let derivedAgeGroup: '12-14' | '15-18' | 'adult' = '12-14';
    if (childAge >= 10 && childAge <= 11) derivedAgeGroup = 'adult'; 
    else if (childAge >= 12 && childAge <= 14) derivedAgeGroup = '12-14';
    else if (childAge >= 15 && childAge <= 18) derivedAgeGroup = '15-18';
    else if (childAge >= 19 && childAge <= 20) derivedAgeGroup = 'adult'; 
    else derivedAgeGroup = 'adult'; 

    let leerdoelenString = "";
    if (data.selectedLeerdoelen && data.selectedLeerdoelen.length > 0) {
      leerdoelenString += `Geselecteerd: ${data.selectedLeerdoelen.join(', ')}. `;
    }
    if (data.otherLeerdoelen) {
      leerdoelenString += `Overig: ${data.otherLeerdoelen}`;
    }

    let tutorPreferencesString = "";
    if (data.selectedTutorPreferences && data.selectedTutorPreferences.length > 0) {
      tutorPreferencesString += `Geselecteerde voorkeuren: ${data.selectedTutorPreferences.join(', ')}. `;
    }
    if (data.otherTutorPreference) {
      tutorPreferencesString += `Overig: ${data.otherTutorPreference}`;
    }

    const newChild: Child = {
      id: `child-${Date.now()}`,
      name: `${data.firstName} ${data.lastName}`,
      firstName: data.firstName,
      lastName: data.lastName,
      age: childAge,
      ageGroup: derivedAgeGroup,
      childEmail: data.childEmail,
      schoolType: data.schoolType,
      otherSchoolType: data.schoolType === "Anders" ? data.otherSchoolType : undefined,
      className: data.className,
      subscriptionStatus: 'uitgenodigd',
      avatarUrl: `https://placehold.co/80x80.png?text=${data.firstName[0]}${data.lastName[0]}`,
      helpSubjects: data.helpSubjects || [],
      hulpvraagType: data.hulpvraagType || [],
      leerdoelen: leerdoelenString.trim() || undefined,
      voorkeurTutor: tutorPreferencesString.trim() || undefined,
      deelResultatenMetTutor: data.deelResultatenMetTutor,
      linkedTutorIds: [],
    };
    setChildren(prev => [newChild, ...prev]);
    setIsAddingChildMode(false);
    toast({
      title: "Kind Toegevoegd & Uitgenodigd",
      description: `${data.firstName} ${data.lastName} is toegevoegd. Een uitnodigingsmail is (gesimuleerd) verstuurd naar ${data.childEmail} om het account te activeren. Zodra het account actief is, kunt u hier de voortgang volgen en een begeleider koppelen.`,
      duration: 8000,
    });
    console.log("Simulating invitation email to:", data.childEmail, "with data:", newChild);
  };

  const openDeleteDialog = (child: Child) => {
    setChildToDelete(child);
    setDeleteConfirmationText('');
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteChild = () => {
    if (childToDelete && deleteConfirmationText === "VERWIJDER") {
      setChildren(prev => prev.filter(c => c.id !== childToDelete.id));
      toast({
        title: "Kind Verwijderd",
        description: `${childToDelete.firstName} ${childToDelete.lastName} is succesvol verwijderd (simulatie).`,
        variant: "default"
      });
      setChildToDelete(null);
      setIsDeleteDialogOpen(false);
      setDeleteConfirmationText('');
    } else {
      toast({
        title: "Verwijdering mislukt",
        description: 'Typ "VERWIJDER" correct in om te bevestigen.',
        variant: "destructive"
      });
    }
  };


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mijn Kinderen</h1>
          <p className="text-muted-foreground">
            Beheer de profielen en voortgang van uw kinderen. Na activatie door uw kind kunt u het profiel eventueel anoniem aanbieden aan begeleiders.
          </p>
        </div>
        {!isAddingChildMode && (
            <div className="flex gap-2 w-full sm:w-auto">
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
                  <span className="text-xs font-medium text-muted-foreground">Status Account: </span>
                  <Badge
                    variant={getSubscriptionBadgeVariant(child.subscriptionStatus)}
                    className={getSubscriptionBadgeClasses(child.subscriptionStatus)}
                  >
                    {child.subscriptionStatus.charAt(0).toUpperCase() + child.subscriptionStatus.slice(1)}
                  </Badge>
                </div>
                {child.hulpvraagType && child.hulpvraagType.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium flex items-center gap-1"><HelpCircle className="h-3.5 w-3.5"/> Hulpvraag:</span> 
                    {child.hulpvraagType.map(type => type === 'tutor' ? 'Huiswerk (Tutor)' : 'Coaching (Coach)').join(', ')}
                  </p>
                )}
                {child.childEmail && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5"/> {child.childEmail}
                    </p>
                )}
                {(child.schoolType || child.className) && (
                     <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <School className="h-3.5 w-3.5"/>
                        {child.schoolType === "Anders" ? `Anders: ${child.otherSchoolType || 'Niet gespecificeerd'}` : child.schoolType}
                        {child.schoolType && child.className && child.schoolType !== "Anders" ? ', ' : ''}
                        {child.className && child.schoolType !== "Anders" ? child.className : ''}
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
                   <Alert variant="default" className="mt-2 p-3 text-xs bg-blue-50/70 border-blue-200">
                      <Info className="h-4 w-4 !text-blue-600" />
                      <AlertDescUi className="!text-blue-700 pl-0">
                        Wacht op account activatie door kind.
                      </AlertDescUi>
                    </Alert>
                )}
              </CardContent>
              <CardFooter className="grid grid-cols-2 gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" asChild>
                   <Link href={`/dashboard/ouder/kinderen/${child.id}/profiel`}>
                     <Edit className="mr-2 h-3.5 w-3.5" /> Profiel
                   </Link>
                </Button>
                <Button variant="outline" size="sm" disabled={child.subscriptionStatus === 'uitgenodigd'} asChild>
                   <Link href={`/dashboard/ouder/kinderen/${child.id}/voortgang`}>
                     <TrendingUp className="mr-2 h-3.5 w-3.5" /> Voortgang
                   </Link>
                </Button>
                 <Button
                    variant="default"
                    size="sm"
                    className="col-span-2"
                    disabled={child.subscriptionStatus === 'uitgenodigd'}
                    asChild
                >
                  <Link href={`/dashboard/ouder/zoek-professional?kindId=${child.id}`}>
                    <Link2 className="mr-2 h-3.5 w-3.5" /> Zoek Begeleiding
                  </Link>
                </Button>
                 <Button
                    variant="destructive"
                    size="sm"
                    className="col-span-2"
                    onClick={() => openDeleteDialog(child)}
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" /> Kind Verwijderen
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={(open) => { setIsDeleteDialogOpen(open); if (!open) setDeleteConfirmationText(''); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Kind Verwijderen?</AlertDialogTitle>
              <AlertDialogDescription>
                Weet u zeker dat u <strong>{childToDelete?.firstName} {childToDelete?.lastName}</strong> wilt verwijderen?
                Alle gekoppelde gegevens en eventuele abonnementen worden (gesimuleerd) beëindigd. Deze actie kan niet ongedaan worden gemaakt.
                <br /><br />
                Typ "<strong>VERWIJDER</strong>" in het onderstaande veld om te bevestigen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-2">
              <Label htmlFor="deleteConfirmInput" className="sr-only">Typ VERWIJDER</Label>
              <Input
                id="deleteConfirmInput"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                placeholder='Typ hier "VERWIJDER"'
                className="border-destructive focus-visible:ring-destructive"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteConfirmationText('')}>Annuleren</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteChild}
                disabled={deleteConfirmationText !== "VERWIJDER"}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Ja, verwijder kind
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

    </div>
  );
}

