// src/app/dashboard/ouder/privacy-instellingen/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ShieldCheck, User, Eye, Users as UsersIcon, Bell, Save, Info, CalendarPlus, Share2 } from 'lucide-react'; // Added Share2
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle as AlertTitleUi } from "@/components/ui/alert";

// Dummy data - in a real app, this would come from a user's profile
const dummyChildren = [
  { id: 'child1', name: 'Sofie de Tester' },
  { id: 'child2', name: 'Max de Tester' },
];

interface PrivacySettings {
  shareResultsWithTutors: boolean;
  allowChildToControlSharing: boolean;
  allowChildToScheduleLessons: boolean; 
  allowCommunityAccess: boolean;
  communityProfileVisibility: 'anonymous' | 'firstName' | 'fullName';
  allowCommunityMessaging: boolean;
  notifyOnQuizCompletion: boolean;
  notifyOnLessonReport: boolean;
}

const initialPrivacySettings: PrivacySettings = {
  shareResultsWithTutors: true,
  allowChildToControlSharing: false,
  allowChildToScheduleLessons: false, 
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

  useEffect(() => {
    if (selectedChildId) {
      console.log(`Instellingen laden voor kind: ${selectedChildId} (simulatie)`);
      setSettings(initialPrivacySettings); 
    }
  }, [selectedChildId]);

  const handleSettingChange = (key: keyof PrivacySettings, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    console.log("Opslaan van privacy-instellingen voor kind:", selectedChildId, settings);
    toast({
      title: "Instellingen Opgeslagen",
      description: `De privacy-instellingen voor ${dummyChildren.find(c => c.id === selectedChildId)?.name || 'het kind'} zijn bijgewerkt (simulatie). De wijzigingen zijn direct actief.`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            Privacy & Toestemming
          </h1>
          <p className="text-muted-foreground">
            Beheer hier de deelinstellingen en privacyvoorkeuren voor uw kind.
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
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedChildId && (
        <>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5 text-primary"/>Zichtbaarheid & Delen</CardTitle>
              <CardDescription>Bepaal wat er gedeeld mag worden van de resultaten en het profiel van uw kind.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-3 rounded-md border">
                <div className="flex items-center justify-between">
                    <Label htmlFor="shareResultsWithTutors" className="text-base flex items-center gap-2">
                        <Share2 className="h-4 w-4 text-muted-foreground" /> Resultaten van zelfreflectie-instrumenten delen met gekoppelde tutors en/of coaches?
                    </Label>
                    <Switch
                    id="shareResultsWithTutors"
                    checked={settings.shareResultsWithTutors}
                    onCheckedChange={(checked) => handleSettingChange('shareResultsWithTutors', checked)}
                    />
                </div>
                <p className="text-xs text-muted-foreground mt-1 pl-6">Hiermee kunnen tutors en coaches beter afgestemde ondersteuning bieden.</p>
              </div>
              <div className="p-3 rounded-md border">
                <div className="flex items-center justify-between">
                    <Label htmlFor="allowChildToControlSharing" className="text-base flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" /> Kind toestaan zelf te bepalen of resultaten met tutors en/of coaches gedeeld worden?
                    </Label>
                    <Switch
                    id="allowChildToControlSharing"
                    checked={settings.allowChildToControlSharing}
                    onCheckedChange={(checked) => handleSettingChange('allowChildToControlSharing', checked)}
                    />
                </div>
                 <p className="text-xs text-muted-foreground mt-1 pl-6">Dit geeft uw kind meer autonomie over de eigen gegevens.</p>
              </div>
              <div className="p-3 rounded-md border">
                <div className="flex items-center justify-between">
                    <Label htmlFor="allowChildToScheduleLessons" className="text-base flex items-center gap-2">
                        <CalendarPlus className="h-4 w-4 text-muted-foreground" /> Kind toestaan zelfstandig 1-op-1 lessen (met tutors) of sessies (met coaches) te plannen?
                    </Label>
                    <Switch
                    id="allowChildToScheduleLessons"
                    checked={settings.allowChildToScheduleLessons}
                    onCheckedChange={(checked) => handleSettingChange('allowChildToScheduleLessons', checked)}
                    />
                </div>
                <p className="text-xs text-muted-foreground mt-1 pl-6">Geeft uw kind meer verantwoordelijkheid en flexibiliteit in het plannen van ondersteuning met tutors of coaches. Indien uitgeschakeld, moet u als ouder deze inplannen.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UsersIcon className="h-5 w-5 text-primary"/>Community & Interactie</CardTitle>
              <CardDescription>Beheer de toegang en zichtbaarheid van uw kind binnen de MindNavigator community (binnenkort beschikbaar).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-3 rounded-md border">
                <div className="flex items-center justify-between">
                    <Label htmlFor="allowCommunityAccess" className="text-base flex items-center gap-2">
                        <UsersIcon className="h-4 w-4 text-muted-foreground" /> Kind toestaan deel te nemen aan het community forum?
                    </Label>
                    <Switch
                    id="allowCommunityAccess"
                    checked={settings.allowCommunityAccess}
                    onCheckedChange={(checked) => handleSettingChange('allowCommunityAccess', checked)}
                    disabled // Functionaliteit is nog niet live
                    />
                </div>
                 <p className="text-xs text-muted-foreground mt-1 pl-6">De community biedt een platform voor uitwisseling en steun (functionaliteit binnenkort).</p>
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
                        disabled // Functionaliteit is nog niet live
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
                    <p className="text-xs text-muted-foreground mt-1">Bepaalt hoe uw kind wordt weergegeven aan andere communityleden.</p>
                  </div>
                  <div className="p-3 rounded-md border">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="allowCommunityMessaging" className="text-base flex items-center gap-2">
                        <Share2 className="h-4 w-4 text-muted-foreground" /> Kind toestaan privéberichten te sturen/ontvangen van andere (goedgekeurde) gebruikers?
                      </Label>
                      <Switch
                        id="allowCommunityMessaging"
                        checked={settings.allowCommunityMessaging}
                        onCheckedChange={(checked) => handleSettingChange('allowCommunityMessaging', checked)}
                        disabled // Functionaliteit is nog niet live
                      />
                    </div>
                     <p className="text-xs text-muted-foreground mt-1 pl-6">Regelt 1-op-1 communicatie binnen de community (functionaliteit binnenkort).</p>
                  </div>
                </>
               )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary"/>Notificatievoorkeuren (Ouder)</CardTitle>
              <CardDescription>Kies welke e-mailnotificaties u wilt ontvangen over de activiteiten van uw kind.</CardDescription>
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
                    <p className="text-xs text-muted-foreground mt-1 pl-6">U ontvangt een notificatie als uw kind een tool heeft afgerond.</p>
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
                     <p className="text-xs text-muted-foreground mt-1 pl-6">U wordt op de hoogte gebracht van nieuwe feedback van begeleiders.</p>
                </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md bg-blue-50 border-blue-200">
            <CardHeader>
                <CardTitle className="text-blue-700 text-lg flex items-center gap-2"><Info className="h-5 w-5"/>Tips voor Ouders</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-600 space-y-2">
                <p><strong>Respecteer Autonomie:</strong> Bespreek deze instellingen met uw kind. Geef hen ruimte om zelf keuzes te maken, passend bij hun leeftijd en ontwikkeling.</p>
                <p><strong>Open Communicatie:</strong> Gebruik de inzichten van MindNavigator als startpunt voor gesprekken, niet als definitief label. Vraag hoe uw kind zich voelt en wat het nodig heeft.</p>
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

