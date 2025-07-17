
// src/app/dashboard/ouder/privacy-instellingen/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ShieldCheck, User, Eye, Users as UsersIcon, Bell, Save, Info, CalendarPlus, Share2, GraduationCap, Handshake, ImageUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle as AlertTitleUi } from "@/components/ui/alert";

// Dummy data - in a real app, this would come from a user's profile
const dummyChildren = [
  { id: 'child1', name: 'Sofie de Tester' },
  { id: 'child2', name: 'Max de Tester' },
];

interface PrivacySettings {
  shareResultsWithActualTutors: boolean;
  shareResultsWithActualCoaches: boolean;
  allowChildToControlSharingTutors: boolean;
  allowChildToControlSharingCoaches: boolean;
  allowChildToScheduleLessonsWithTutors: boolean;
  allowChildToScheduleSessionsWithCoaches: boolean;
  allowChildToChooseAvatar: boolean; // Nieuwe instelling
  allowCommunityAccess: boolean;
  communityProfileVisibility: 'anonymous' | 'firstName' | 'fullName';
  allowCommunityMessaging: boolean;
  notifyOnQuizCompletion: boolean;
  notifyOnLessonReport: boolean;
}

const initialPrivacySettings: PrivacySettings = {
  shareResultsWithActualTutors: true,
  shareResultsWithActualCoaches: true,
  allowChildToControlSharingTutors: false,
  allowChildToControlSharingCoaches: false,
  allowChildToScheduleLessonsWithTutors: false,
  allowChildToScheduleSessionsWithCoaches: false,
  allowChildToChooseAvatar: false, // Standaard uit
  allowCommunityAccess: true,
  communityProfileVisibility: 'firstName',
  allowCommunityMessaging: false,
  notifyOnQuizCompletion: true,
  notifyOnLessonReport: true,
};

export default function PrivacyInstellingenPage() {
  const { toast } = useToast();
  const [selectedChildId, setSelectedChildId] = useState<string>(dummyChildren[0]?.id || '');
  const [settings, setSettings] = useState<PrivacySettings>(initialPrivacySettings);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  const selectedChild = dummyChildren.find(c => c.id === selectedChildId);
  const selectedChildName = selectedChild ? selectedChild.name.split(' ')[0] : 'Uw kind';


  useEffect(() => {
    if (selectedChildId) {
      setIsLoadingSettings(true);
      console.log(`Privacy-instellingen laden voor kind: ${selectedChildId} (simulatie)`);
      try {
        const storedSettingsRaw = localStorage.getItem(`privacySettings_${selectedChildId}`);
        if (storedSettingsRaw) {
          const storedSettings = JSON.parse(storedSettingsRaw);
          setSettings(prev => ({ ...initialPrivacySettings, ...storedSettings })); // Zorg dat nieuwe defaults worden meegenomen
        } else {
          // Geen opgeslagen instellingen, gebruik defaults
          setSettings(initialPrivacySettings);
        }
      } catch (error) {
        console.error("Fout bij laden privacy-instellingen uit localStorage:", error);
        setSettings(initialPrivacySettings); // Fallback naar defaults bij error
      }
      setIsLoadingSettings(false);
    }
  }, [selectedChildId]);

  const handleSettingChange = (key: keyof PrivacySettings, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    if (!selectedChildId) {
      toast({ title: "Fout", description: "Selecteer eerst een kind.", variant: "destructive" });
      return;
    }
    console.log("Opslaan van privacy-instellingen voor kind:", selectedChildId, settings);
    
    try {
      localStorage.setItem(`privacySettings_${selectedChildId}`, JSON.stringify(settings));
      
      toast({
        title: "Instellingen Opgeslagen",
        description: `De privacy-instellingen voor ${selectedChildName} zijn bijgewerkt. De wijzigingen zijn direct actief.`,
      });
    } catch (error) {
      toast({
        title: "Opslagfout",
        description: "Kon de instellingen niet lokaal opslaan.",
        variant: "destructive",
      });
      console.error("Fout bij opslaan privacy-instellingen in localStorage:", error);
    }
  };
  
  if (isLoadingSettings && selectedChildId) {
    return <div className="p-8 text-center">Privacy-instellingen voor {selectedChildName} laden...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            Privacy & Toestemming
          </h1>
          <p className="text-muted-foreground">
            Beheer hier de deelinstellingen en privacyvoorkeuren voor {selectedChildName}.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/ouder">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Ouder Dashboard
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary"/>Selecteer Kind</CardTitle>
          <CardDescription>Kies het kind voor wie u de instellingen wilt beheren.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedChildId} onValueChange={setSelectedChildId}>
            <SelectTrigger className="w-full md:w-[280px]">
              <SelectValue placeholder="Selecteer een kind" />
            </SelectTrigger>
            <SelectContent>
              {dummyChildren.map(child => (
                <SelectItem key={child.id} value={child.id}>{child.name}</SelectItem>
              ))}
              {dummyChildren.length === 0 && <SelectItem value="no-children" disabled>Voeg eerst een kind toe</SelectItem>}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedChildId && !isLoadingSettings && (
        <>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5 text-primary"/>Zichtbaarheid & Delen van Resultaten</CardTitle>
              <CardDescription>Bepaal wat er gedeeld mag worden van de resultaten en voortgang van {selectedChildName}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Delen met Tutors */}
              <div className="p-3 rounded-md border">
                <div className="flex items-center justify-between">
                    <Label htmlFor="shareResultsWithActualTutors" className="text-base flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" /> Resultaten delen met gekoppelde tutors (huiswerkbegeleiding)?
                    </Label>
                    <Switch
                    id="shareResultsWithActualTutors"
                    checked={settings.shareResultsWithActualTutors}
                    onCheckedChange={(checked) => handleSettingChange('shareResultsWithActualTutors', checked)}
                    />
                </div>
                <p className="text-xs text-muted-foreground mt-1 pl-6">Hiermee kunnen tutors beter afgestemde huiswerkbegeleiding bieden aan {selectedChildName}.</p>
              </div>
              {/* Delen met Coaches */}
              <div className="p-3 rounded-md border">
                <div className="flex items-center justify-between">
                    <Label htmlFor="shareResultsWithActualCoaches" className="text-base flex items-center gap-2">
                        <Handshake className="h-4 w-4 text-muted-foreground" /> Resultaten delen met gekoppelde coaches (persoonlijke begeleiding)?
                    </Label>
                    <Switch
                    id="shareResultsWithActualCoaches"
                    checked={settings.shareResultsWithActualCoaches}
                    onCheckedChange={(checked) => handleSettingChange('shareResultsWithActualCoaches', checked)}
                    />
                </div>
                <p className="text-xs text-muted-foreground mt-1 pl-6">Hiermee kunnen coaches beter afgestemde persoonlijke begeleiding bieden aan {selectedChildName}.</p>
              </div>
              
              <hr className="my-2 border-border/50"/>
              
              {/* Kind bepaalt delen Tutors */}
              <div className="p-3 rounded-md border">
                <div className="flex items-center justify-between">
                    <Label htmlFor="allowChildToControlSharingTutors" className="text-base flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" /> {selectedChildName} toestaan zelf te bepalen of resultaten met tutors gedeeld worden?
                    </Label>
                    <Switch
                    id="allowChildToControlSharingTutors"
                    checked={settings.allowChildToControlSharingTutors}
                    onCheckedChange={(checked) => handleSettingChange('allowChildToControlSharingTutors', checked)}
                    />
                </div>
                 <p className="text-xs text-muted-foreground mt-1 pl-6">Dit geeft {selectedChildName} meer autonomie over de eigen gegevens m.b.t. huiswerkbegeleiding.</p>
              </div>
              {/* Kind bepaalt delen Coaches */}
               <div className="p-3 rounded-md border">
                <div className="flex items-center justify-between">
                    <Label htmlFor="allowChildToControlSharingCoaches" className="text-base flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" /> {selectedChildName} toestaan zelf te bepalen of resultaten met coaches gedeeld worden?
                    </Label>
                    <Switch
                    id="allowChildToControlSharingCoaches"
                    checked={settings.allowChildToControlSharingCoaches}
                    onCheckedChange={(checked) => handleSettingChange('allowChildToControlSharingCoaches', checked)}
                    />
                </div>
                 <p className="text-xs text-muted-foreground mt-1 pl-6">Dit geeft {selectedChildName} meer autonomie over de eigen gegevens m.b.t. persoonlijke begeleiding.</p>
              </div>

              <hr className="my-2 border-border/50"/>

              {/* Kind plant lessen Tutors */}
              <div className="p-3 rounded-md border">
                <div className="flex items-center justify-between">
                    <Label htmlFor="allowChildToScheduleLessonsWithTutors" className="text-base flex items-center gap-2">
                        <CalendarPlus className="h-4 w-4 text-muted-foreground" /> {selectedChildName} toestaan zelfstandig lessen met tutors te plannen?
                    </Label>
                    <Switch
                    id="allowChildToScheduleLessonsWithTutors"
                    checked={settings.allowChildToScheduleLessonsWithTutors}
                    onCheckedChange={(checked) => handleSettingChange('allowChildToScheduleLessonsWithTutors', checked)}
                    />
                </div>
                <p className="text-xs text-muted-foreground mt-1 pl-6">Geeft {selectedChildName} meer verantwoordelijkheid in het plannen van huiswerkbegeleiding. U ontvangt een notificatie.</p>
              </div>
              {/* Kind plant sessies Coaches */}
               <div className="p-3 rounded-md border">
                <div className="flex items-center justify-between">
                    <Label htmlFor="allowChildToScheduleSessionsWithCoaches" className="text-base flex items-center gap-2">
                        <CalendarPlus className="h-4 w-4 text-muted-foreground" /> {selectedChildName} toestaan zelfstandig sessies met coaches te plannen?
                    </Label>
                    <Switch
                    id="allowChildToScheduleSessionsWithCoaches"
                    checked={settings.allowChildToScheduleSessionsWithCoaches}
                    onCheckedChange={(checked) => handleSettingChange('allowChildToScheduleSessionsWithCoaches', checked)}
                    />
                </div>
                <p className="text-xs text-muted-foreground mt-1 pl-6">Geeft {selectedChildName} meer verantwoordelijkheid in het plannen van persoonlijke begeleiding. U ontvangt een notificatie.</p>
              </div>

              <hr className="my-2 border-border/50"/>
              {/* Kind mag avatar kiezen */}
               <div className="p-3 rounded-md border">
                <div className="flex items-center justify-between">
                    <Label htmlFor="allowChildToChooseAvatar" className="text-base flex items-center gap-2">
                        <ImageUp className="h-4 w-4 text-muted-foreground" /> {selectedChildName} toestaan zelf een profielafbeelding/avatar te kiezen?
                    </Label>
                    <Switch
                    id="allowChildToChooseAvatar"
                    checked={settings.allowChildToChooseAvatar}
                    onCheckedChange={(checked) => handleSettingChange('allowChildToChooseAvatar', checked)}
                    />
                </div>
                <p className="text-xs text-muted-foreground mt-1 pl-6">Hiermee kan {selectedChildName} het eigen profiel personaliseren. U behoudt de mogelijkheid om een avatar te overschrijven indien nodig.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UsersIcon className="h-5 w-5 text-primary"/>Community &amp; Interactie</CardTitle>
              <CardDescription>Beheer de toegang en zichtbaarheid van {selectedChildName} binnen de MindNavigator community.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-3 rounded-md border">
                <div className="flex items-center justify-between">
                    <Label htmlFor="allowCommunityAccess" className="text-base flex items-center gap-2">
                        <UsersIcon className="h-4 w-4 text-muted-foreground" /> {selectedChildName} toestaan deel te nemen aan het community forum?
                    </Label>
                    <Switch
                    id="allowCommunityAccess"
                    checked={settings.allowCommunityAccess}
                    onCheckedChange={(checked) => handleSettingChange('allowCommunityAccess', checked)}
                    />
                </div>
                 <p className="text-xs text-muted-foreground mt-1 pl-6">De community biedt een platform voor uitwisseling en steun. Deelname is optioneel.</p>
              </div>
               {settings.allowCommunityAccess && (
                <>
                  <div className="p-3 rounded-md border">
                    <Label htmlFor="communityProfileVisibility" className="text-base mb-1 block flex items-center gap-2">
                        <Eye className="h-4 w-4 text-muted-foreground" /> Zichtbaarheid profiel in community
                    </Label>
                     <Select 
                        value={settings.communityProfileVisibility} 
                        onValueChange={(value: PrivacySettings['communityProfileVisibility']) => handleSettingChange('communityProfileVisibility', value)}
                    >
                        <SelectTrigger id="communityProfileVisibility">
                        <SelectValue placeholder="Kies zichtbaarheid" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="anonymous">Anoniem (geen naam zichtbaar)</SelectItem>
                            <SelectItem value="firstName">Alleen Voornaam</SelectItem>
                            <SelectItem value="fullName">Volledige Naam</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">Bepaalt hoe {selectedChildName} wordt weergegeven aan andere communityleden.</p>
                  </div>
                  <div className="p-3 rounded-md border">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="allowCommunityMessaging" className="text-base flex items-center gap-2">
                        <Share2 className="h-4 w-4 text-muted-foreground" /> {selectedChildName} toestaan privéberichten te sturen/ontvangen?
                      </Label>
                      <Switch
                        id="allowCommunityMessaging"
                        checked={settings.allowCommunityMessaging}
                        onCheckedChange={(checked) => handleSettingChange('allowCommunityMessaging', checked)}
                      />
                    </div>
                     <p className="text-xs text-muted-foreground mt-1 pl-6">Regelt 1-op-1 communicatie binnen de community (onderhevig aan moderatie).</p>
                  </div>
                </>
               )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary"/>Notificatievoorkeuren (Ouder)</CardTitle>
              <CardDescription>Kies welke e-mailnotificaties u wilt ontvangen over de activiteiten van {selectedChildName}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="p-3 rounded-md border">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="notifyOnQuizCompletion" className="text-base flex items-center gap-2">
                            <Bell className="h-4 w-4 text-muted-foreground" /> E-mail bij voltooiing van een zelfreflectie-instrument?
                        </Label>
                        <Switch
                            id="notifyOnQuizCompletion"
                            checked={settings.notifyOnQuizCompletion}
                            onCheckedChange={(checked) => handleSettingChange('notifyOnQuizCompletion', checked)}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 pl-6">U ontvangt een notificatie als {selectedChildName} een tool heeft afgerond.</p>
                </div>
                <div className="p-3 rounded-md border">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="notifyOnLessonReport" className="text-base flex items-center gap-2">
                            <Bell className="h-4 w-4 text-muted-foreground" /> E-mail bij ontvangst van een nieuw lesverslag van een begeleider?
                        </Label>
                        <Switch
                            id="notifyOnLessonReport"
                            checked={settings.notifyOnLessonReport}
                            onCheckedChange={(checked) => handleSettingChange('notifyOnLessonReport', checked)}
                        />
                    </div>
                     <p className="text-xs text-muted-foreground mt-1 pl-6">U wordt op de hoogte gebracht van nieuwe feedback van begeleiders over {selectedChildName}.</p>
                </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md bg-blue-50 border-blue-200">
            <CardHeader>
                <CardTitle className="text-blue-700 text-lg flex items-center gap-2"><Info className="h-5 w-5"/>Tips voor Ouders</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-600 space-y-2">
                <p><strong>Respecteer Autonomie:</strong> Bespreek deze instellingen met {selectedChildName}. Geef {selectedChildName.toLowerCase()} ruimte om zelf keuzes te maken, passend bij de leeftijd en ontwikkeling.</p>
                <p><strong>Open Communicatie:</strong> Gebruik de inzichten van MindNavigator als startpunt voor gesprekken, niet als definitief label. Vraag hoe {selectedChildName} zich voelt en wat het nodig heeft.</p>
                <p><strong>Veiligheid Voorop:</strong> Leg uit waarom bepaalde instellingen (zoals anoniem blijven in een community) belangrijk kunnen zijn voor online veiligheid.</p>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveSettings} size="lg">
              <Save className="mr-2 h-4 w-4" /> Instellingen Opslaan
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
