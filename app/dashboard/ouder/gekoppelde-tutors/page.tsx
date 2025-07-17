// src/app/dashboard/ouder/gekoppelde-professionals/page.tsx (Voorheen gekoppelde-tutors)
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, UserCheck, CalendarPlus, MessageSquare, Link2Off, Info, GraduationCap, User, Users as UsersIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { allHomeworkSubjects } from '@/lib/quiz-data/subject-data';
import { Badge } from '@/components/ui/badge';

interface ChildBase {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface ProfessionalBase {
  id: string;
  name: string;
  type: 'tutor' | 'coach';
  avatarUrl?: string;
  specializations: string[]; 
}

const dummyChildrenData: ChildBase[] = [
  { id: 'child1', name: 'Sofie de Tester', avatarUrl: 'https://picsum.photos/seed/sofiechild/80/80' },
  { id: 'child2', name: 'Max de Tester', avatarUrl: 'https://picsum.photos/seed/maxchild/80/80' },
  { id: 'child3', name: 'Lisa Voorbeeld' },
];

const dummyProfessionalsData: ProfessionalBase[] = [
  { id: 'tutor1', name: 'Mevr. A. Jansen', type: 'tutor', avatarUrl: 'https://picsum.photos/seed/tutorJansen/80/80', specializations: ['wiskunde', 'natuurkunde'] },
  { id: 'tutor2', name: 'Dhr. B. de Vries', type: 'tutor', avatarUrl: 'https://picsum.photos/seed/tutorDeVries/80/80', specializations: ['nederlands', 'engels'] },
  { id: 'tutor3', name: 'Dr. C. El Amrani', type: 'tutor', avatarUrl: 'https://picsum.photos/seed/tutorElAmrani/80/80', specializations: ['biologie', 'scheikunde'] },
  // Voeg hier later dummy coaches toe
  // { id: 'coach1', name: 'Coach X', type: 'coach', avatarUrl: '...', specializations: ['ADHD begeleiding', 'Faalangst reductie'] },
];

const LOCAL_STORAGE_LINKED_PROFESSIONALS_KEY = 'linkedProfessionalsByChild';

export default function GekoppeldeProfessionalsPage() {
  const { toast } = useToast();
  const [linkedProfessionalsMap, setLinkedProfessionalsMap] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedMap = localStorage.getItem(LOCAL_STORAGE_LINKED_PROFESSIONALS_KEY);
      if (storedMap) {
        setLinkedProfessionalsMap(JSON.parse(storedMap));
      }
    } catch (error) {
      console.error("Error loading linked professionals from localStorage:", error);
      toast({ title: "Fout", description: "Kon gekoppelde begeleiders niet laden.", variant: "destructive" });
    }
    setIsLoading(false);
  }, [toast]);

  const handleOntkoppelProfessional = (kindId: string, profId: string) => {
    setLinkedProfessionalsMap(prevMap => {
      const updatedMap = { ...prevMap };
      if (updatedMap[kindId]) {
        updatedMap[kindId] = updatedMap[kindId].filter(id => id !== profId);
        if (updatedMap[kindId].length === 0) {
          delete updatedMap[kindId];
        }
      }
      localStorage.setItem(LOCAL_STORAGE_LINKED_PROFESSIONALS_KEY, JSON.stringify(updatedMap));
      const professional = dummyProfessionalsData.find(p => p.id === profId);
      toast({ title: `${professional?.type === 'tutor' ? 'Tutor' : 'Coach'} Ontkoppeld`, description: `De begeleider is succesvol ontkoppeld van dit kind.` });
      return updatedMap;
    });
  };

  const getInitials = (name?: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';

  if (isLoading) {
    return <div className="p-8 text-center">Gekoppelde begeleiders laden...</div>;
  }

  const childrenWithLinkedProfessionals = dummyChildrenData.filter(child => linkedProfessionalsMap[child.id] && linkedProfessionalsMap[child.id].length > 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <UserCheck className="h-8 w-8 text-primary" />
            Mijn Gekoppelde Begeleiders
          </h1>
          <p className="text-muted-foreground">
            Een overzicht van alle tutors en coaches die aan uw kinderen gekoppeld zijn.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/ouder">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Ouder Dashboard
          </Link>
        </Button>
      </div>

      {childrenWithLinkedProfessionals.length === 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-8 text-center">
            <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">U heeft nog geen begeleiders (tutors/coaches) aan uw kinderen gekoppeld.</p>
            <Button asChild className="mt-6">
              <Link href="/dashboard/ouder/zoek-professional">
                Ga naar Begeleider Zoeken & Koppelen
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        childrenWithLinkedProfessionals.map(child => (
          <Card key={child.id} className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={child.avatarUrl} alt={child.name} data-ai-hint="child person"/>
                  <AvatarFallback>{getInitials(child.name)}</AvatarFallback>
                </Avatar>
                Gekoppelde Begeleiders voor {child.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {linkedProfessionalsMap[child.id]?.map(profId => {
                const professional = dummyProfessionalsData.find(p => p.id === profId);
                if (!professional) return <p key={profId} className="text-sm text-destructive">Begeleider met ID {profId} niet gevonden.</p>;
                
                const professionalSubjectsOrExpertise = professional.type === 'tutor' 
                    ? professional.specializations.map(subId => allHomeworkSubjects.find(s => s.id === subId)?.name || subId).join(', ')
                    : professional.specializations.join(', ');

                return (
                  <Card key={professional.id} className="p-4 bg-muted/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={professional.avatarUrl} alt={professional.name} data-ai-hint="professional person" />
                        <AvatarFallback>{getInitials(professional.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-primary">{professional.name} <Badge variant="outline" className="ml-1 text-xs">{professional.type === 'tutor' ? 'Tutor' : 'Coach'}</Badge></h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <GraduationCap className="h-3.5 w-3.5"/>{professional.type === 'tutor' ? 'Vakken:' : 'Expertise:'} {professionalSubjectsOrExpertise || 'N.v.t.'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto pt-2 sm:pt-0">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/dashboard/ouder/lessen/plannen?kindId=${child.id}&professionalId=${professional.id}`}>
                          <CalendarPlus className="mr-2 h-4 w-4" /> Plan {professional.type === 'tutor' ? 'Les' : 'Sessie'}
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" disabled>
                        <MessageSquare className="mr-2 h-4 w-4" /> Stuur Bericht
                      </Button>
                       <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleOntkoppelProfessional(child.id, professional.id)}
                        >
                          <Link2Off className="mr-2 h-4 w-4" /> Ontkoppel
                        </Button>
                    </div>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
