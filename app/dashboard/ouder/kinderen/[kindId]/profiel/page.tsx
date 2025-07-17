// src/app/dashboard/ouder/kinderen/[kindId]/profiel/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from '@/lib/icons';
import { useToast } from '@/hooks/use-toast';
import type { Child, EditableChildData } from '@/types/dashboard';
import { KindProfielView } from '@/components/ouder/profiel/KindProfielView';
import { KindProfielEditForm } from '@/components/ouder/profiel/KindProfielEditForm';
import { getSubscriptionPlans } from '@/types/subscription';

// Dummy data for now. In a real app, this would be fetched from Firestore.
const dummyChildren: Child[] = [
   { id: 'child1', firstName: 'Sofie', lastName: 'de Tester', name: 'Sofie de Tester', age: 13, ageGroup: '12-14', avatarUrl: 'https://picsum.photos/seed/sofiechild/80/80', subscriptionStatus: 'actief', planId: '1_kind_maand', planName: '1 Kind - Maandelijks', lastActivity: 'Quiz "Basis Neuroprofiel" voltooid', childEmail: 'sofie.tester@example.com', schoolType: 'HAVO', className: '2B', helpSubjects: ['wiskunde', 'nederlands'], hulpvraagType: ['tutor', 'coach'], leerdoelen: 'Geselecteerd: Beter leren plannen voor toetsen, Omgaan met faalangst. Overig: Kind heeft moeite met beginnen aan taken.', voorkeurTutor: 'Geselecteerde voorkeuren: Ervaring met faalangst, Geduldig. Overig: Iemand met ervaring met visueel ingestelde leerlingen.', deelResultatenMetTutor: true, linkedTutorIds: ['tutor1'], },
   { id: 'child2', firstName: 'Max', lastName: 'de Tester', name: 'Max de Tester', age: 16, ageGroup: '15-18', avatarUrl: 'https://picsum.photos/seed/maxchild/80/80', subscriptionStatus: 'actief', planId: '2_kinderen_maand', planName: '2 Kinderen - Maandelijks', lastActivity: 'Laatste les: Engels (1 dag geleden)', childEmail: 'max.tester@example.com', schoolType: 'VWO', helpSubjects: ['engels', 'geschiedenis'], hulpvraagType: ['tutor', 'coach'], leerdoelen: 'Geselecteerd: Concentratie verbeteren tijdens de les. Overig: Verbeteren van spreekvaardigheid Engels en essay schrijven.', voorkeurTutor: 'Geselecteerde voorkeuren: Man. Overig: Tutor die ook kan helpen met motivatie.', deelResultatenMetTutor: false, linkedTutorIds: [], },
   { id: 'child3', firstName: 'Lisa', lastName: 'Voorbeeld', name: 'Lisa Voorbeeld', age: 12, ageGroup: '12-14', subscriptionStatus: 'geen', planId: undefined, planName: undefined, lastActivity: 'Coaching tip van gisteren bekeken', childEmail: 'lisa.voorbeeld@example.com', schoolType: 'Anders', otherSchoolType: 'Internationale School', helpSubjects: [], hulpvraagType: ['coach'], leerdoelen: 'Geselecteerd: Zelfvertrouwen vergroten.', voorkeurTutor: 'Geselecteerde voorkeuren: Vrouw, Ervaring met faalangst.', deelResultatenMetTutor: true, linkedTutorIds: ['tutor2', 'tutor3'], },
];

export default function KindProfielPage() {
  const params = useParams();
  const { toast } = useToast();
  const kindId = params.kindId as string;
  const [childData, setChildData] = useState<Child | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    let dataToSet: Child | null = null;
    try {
      const storedChildrenRaw = localStorage.getItem('ouderDashboard_kinderen');
      const allChildren: Child[] = storedChildrenRaw ? JSON.parse(storedChildrenRaw) : dummyChildren;
      const allPlans = getSubscriptionPlans();
      
      const foundChild = allChildren.find(c => c.id === kindId);
      
      if (foundChild) {
        const planDetails = allPlans.find(p => p.id === foundChild.planId);
        dataToSet = {
            ...foundChild,
            planName: planDetails?.name || (foundChild.subscriptionStatus === 'geen' ? 'Geen' : 'Onbekend'),
        };
      } else {
        dataToSet = null;
      }
      
    } catch (error) {
      console.error("Error parsing children from localStorage, falling back to dummy:", error);
      dataToSet = dummyChildren.find(c => c.id === kindId) || null;
    }
    setChildData(dataToSet);
    setIsLoading(false);
  }, [kindId]);

  const handleSaveProfile = (data: EditableChildData) => {
    if (!childData) return;
    let leerdoelenString = "";
    if (data.selectedLeerdoelen && data.selectedLeerdoelen.length > 0) leerdoelenString += `Geselecteerd: ${data.selectedLeerdoelen.join(', ')}. `;
    if (data.otherLeerdoelen) leerdoelenString += `Overig: ${data.otherLeerdoelen}`;
    let tutorPreferencesString = "";
    if (data.selectedTutorPreferences && data.selectedTutorPreferences.length > 0) tutorPreferencesString += `Geselecteerde voorkeuren: ${data.selectedTutorPreferences.join(', ')}. `;
    if (data.otherTutorPreference) tutorPreferencesString += `Overig: ${data.otherTutorPreference}`;
    
    // Create the updated child data without the 'deelResultatenMetTutor' property
    const updatedChildData: Omit<Child, 'deelResultatenMetTutor'> & { deelResultatenMetTutor?: boolean } = {
        ...childData,
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.firstName} ${data.lastName}`,
        ageGroup: data.ageGroup,
        childEmail: data.childEmail,
        schoolType: data.schoolType,
        otherSchoolType: data.schoolType === "Anders" ? data.otherSchoolType : undefined,
        className: data.className,
        helpSubjects: data.helpSubjects,
        hulpvraagType: data.hulpvraagType,
        leerdoelen: leerdoelenString.trim() || undefined,
        voorkeurTutor: tutorPreferencesString.trim() || undefined,
        avatarUrl: data.avatarUrl || childData.avatarUrl,
        age: childData.age,
    };
    
    // Remove the property before setting state and saving
    delete updatedChildData.deelResultatenMetTutor;

    setChildData(updatedChildData as Child);

    try {
      const storedChildrenRaw = localStorage.getItem('ouderDashboard_kinderen');
      let allChildrenStored: Child[] = storedChildrenRaw ? JSON.parse(storedChildrenRaw) : dummyChildren;
      const updatedAllChildren = allChildrenStored.map(c => {
        if (c.id === kindId) {
          const finalDataForStorage = { ...updatedChildData };
          delete finalDataForStorage.deelResultatenMetTutor; // Ensure it's not saved
          return finalDataForStorage as Child;
        }
        return c;
      });
      localStorage.setItem('ouderDashboard_kinderen', JSON.stringify(updatedAllChildren));
    } catch (e) { console.error("Error updating localStorage", e); }
    toast({ title: "Profiel Opgeslagen", description: `Gegevens voor ${updatedChildData.name} zijn bijgewerkt.` });
    setIsEditing(false);
  };

  if (isLoading) return <div className="p-8 text-center">Profielgegevens laden...</div>;
  if (!childData) return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center p-4">
      <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
      <h1 className="text-2xl font-bold text-destructive mb-2">Profiel Niet Gevonden</h1>
      <p className="text-muted-foreground mb-6">De gegevens voor dit kind konden niet worden geladen.</p>
      <Button asChild variant="outline"><Link href="/dashboard/ouder/kinderen"><ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Mijn Kinderen</Link></Button>
    </div>
  );

  return (
    <div className="space-y-8">
      {isEditing ? (
        <KindProfielEditForm initialData={childData} onSave={handleSaveProfile} onCancel={() => setIsEditing(false)} />
      ) : (
        <KindProfielView childData={childData} onStartEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
}
