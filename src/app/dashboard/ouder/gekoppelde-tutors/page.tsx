// src/app/dashboard/ouder/gekoppelde-tutors/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, UserCheck, CalendarPlus, MessageSquare, Link2Off, Info, GraduationCap, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { allHomeworkSubjects } from '@/lib/quiz-data/subject-data'; // Om vaknamen te tonen

// Definities voor data - in een echte app komen deze uit een store of API
interface ChildBase {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface TutorBase {
  id: string;
  name: string;
  avatarUrl?: string;
  specializations: string[]; // Array van vak-IDs
}

// Voorbeeld Kinderen (alleen ID en naam nodig voor deze pagina, plus avatar)
const dummyChildrenData: ChildBase[] = [
  { id: 'child1', name: 'Sofie de Tester', avatarUrl: 'https://picsum.photos/seed/sofiechild/80/80' },
  { id: 'child2', name: 'Max de Tester', avatarUrl: 'https://picsum.photos/seed/maxchild/80/80' },
  { id: 'child3', name: 'Lisa Voorbeeld' },
];

// Voorbeeld Tutors (ID, naam, avatar, specialisaties)
const dummyTutorsData: TutorBase[] = [
  { id: 'tutor1', name: 'Mevr. A. Jansen', avatarUrl: 'https://picsum.photos/seed/tutorJansen/80/80', specializations: ['wiskunde', 'natuurkunde'] },
  { id: 'tutor2', name: 'Dhr. B. de Vries', avatarUrl: 'https://picsum.photos/seed/tutorDeVries/80/80', specializations: ['nederlands', 'engels'] },
  { id: 'tutor3', name: 'Dr. C. El Amrani', avatarUrl: 'https://picsum.photos/seed/tutorElAmrani/80/80', specializations: ['biologie', 'scheikunde'] },
];

const LOCAL_STORAGE_LINKED_TUTORS_KEY = 'linkedTutorsByChild'; // Key voor localStorage

export default function GekoppeldeTutorsPage() {
  const { toast } = useToast();
  const [linkedTutorsMap, setLinkedTutorsMap] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedMap = localStorage.getItem(LOCAL_STORAGE_LINKED_TUTORS_KEY);
      if (storedMap) {
        setLinkedTutorsMap(JSON.parse(storedMap));
      }
    } catch (error) {
      console.error("Error loading linked tutors from localStorage:", error);
      toast({ title: "Fout", description: "Kon gekoppelde tutors niet laden.", variant: "destructive" });
    }
    setIsLoading(false);
  }, [toast]);

  const handleOntkoppelTutor = (kindId: string, tutorId: string) => {
    setLinkedTutorsMap(prevMap => {
      const updatedMap = { ...prevMap };
      if (updatedMap[kindId]) {
        updatedMap[kindId] = updatedMap[kindId].filter(id => id !== tutorId);
        if (updatedMap[kindId].length === 0) {
          delete updatedMap[kindId]; // Verwijder kind als er geen tutors meer gekoppeld zijn
        }
      }
      localStorage.setItem(LOCAL_STORAGE_LINKED_TUTORS_KEY, JSON.stringify(updatedMap));
      toast({ title: "Tutor Ontkoppeld", description: "De tutor is succesvol ontkoppeld van dit kind." });
      return updatedMap;
    });
  };

  const getInitials = (name?: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';

  if (isLoading) {
    return <div className="p-8 text-center">Gekoppelde tutors laden...</div>;
  }

  const childrenWithLinkedTutors = dummyChildrenData.filter(child => linkedTutorsMap[child.id] && linkedTutorsMap[child.id].length > 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <UserCheck className="h-8 w-8 text-primary" />
            Mijn Gekoppelde Tutors
          </h1>
          <p className="text-muted-foreground">
            Een overzicht van alle tutors die aan uw kinderen gekoppeld zijn.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/ouder">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Ouder Dashboard
          </Link>
        </Button>
      </div>

      {childrenWithLinkedTutors.length === 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-8 text-center">
            <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">U heeft nog geen tutors aan uw kinderen gekoppeld.</p>
            <Button asChild className="mt-6">
              <Link href="/dashboard/ouder/tutor-koppelen">
                Ga naar Tutor Zoeken & Koppelen
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        childrenWithLinkedTutors.map(child => (
          <Card key={child.id} className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={child.avatarUrl} alt={child.name} data-ai-hint="child person"/>
                  <AvatarFallback>{getInitials(child.name)}</AvatarFallback>
                </Avatar>
                Gekoppelde Tutors voor {child.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {linkedTutorsMap[child.id]?.map(tutorId => {
                const tutor = dummyTutorsData.find(t => t.id === tutorId);
                if (!tutor) return <p key={tutorId} className="text-sm text-destructive">Tutor met ID {tutorId} niet gevonden.</p>;
                
                const tutorSubjects = tutor.specializations.map(subId => allHomeworkSubjects.find(s => s.id === subId)?.name || subId).join(', ');

                return (
                  <Card key={tutor.id} className="p-4 bg-muted/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={tutor.avatarUrl} alt={tutor.name} data-ai-hint="tutor person" />
                        <AvatarFallback>{getInitials(tutor.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-primary">{tutor.name}</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <GraduationCap className="h-3.5 w-3.5"/>Vakken: {tutorSubjects || 'N.v.t.'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto pt-2 sm:pt-0">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/dashboard/ouder/lessen/plannen?kindId=${child.id}&tutorId=${tutor.id}`}>
                          <CalendarPlus className="mr-2 h-4 w-4" /> Plan Les
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" disabled>
                        <MessageSquare className="mr-2 h-4 w-4" /> Stuur Bericht
                      </Button>
                       <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleOntkoppelTutor(child.id, tutor.id)}
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
```