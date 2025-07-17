
'use client';

import React from 'react';
import { useQuizCreator } from '@/contexts/QuizCreatorContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Lightbulb, Rocket, Users as UsersIcon, GraduationCap, HeartHandshake, Zap,
  Bot, Info, Sparkles, User, Puzzle, Pencil
} from '@/lib/icons';
import { Textarea } from '@/components/ui/textarea';
import type { ElementType } from 'react';

interface Question {
  id: string;
  text: string;
}

interface Phase2Question extends Question {
  spectrum: string;
}

interface CategoryInfo {
  id: string;
  icon: ElementType;
  title: string;
  description: string;
  tags: string[];
  suggestedTitle?: string;
  suggestedDescription?: string;
  suggestedDescriptionForParent?: string;
}

const allCategories: CategoryInfo[] = [
  { id: 'emoties_gevoelens', icon: HeartHandshake, title: 'Emoties & Gevoelens', description: 'Herken en ga om met intense emoties.', tags: ['Gevoelens herkennen', 'Stress signalen', 'Rustig worden'], suggestedTitle: "Ontdek Jouw Gevoelens-Superkracht", suggestedDescription: "Deze quiz helpt je te ontdekken hoe je omgaat met verschillende gevoelens, van blijdschap tot frustratie. Leer je emotionele superkrachten kennen!", suggestedDescriptionForParent: "Deze vragenlijst helpt u de emotionele wereld van uw kind beter te begrijpen en hoe zij omgaan met gevoelens." },
  { id: 'vriendschappen_sociaal', icon: UsersIcon, title: 'Vriendschappen & Sociaal', description: 'Hoe ga je om met groepsdruk en vind je echte vrienden?', tags: ['Vrienden maken', 'Grenzen stellen', 'Groepsdruk'], suggestedTitle: "Jouw Vriendschap-Stijl", suggestedDescription: "Ontdek hoe jij je verhoudt tot anderen, hoe je vrienden maakt en wat voor jou belangrijk is in sociale situaties.", suggestedDescriptionForParent: "Verkrijg inzicht in hoe uw kind sociale situaties ervaart en vriendschappen aangaat." },
  { id: 'leren_school', icon: GraduationCap, title: 'Leren & School', description: 'Ontdek hoe jij het beste leert en je concentreert.', tags: ['Concentratie', 'Huiswerk tips', 'Leer-stijl'], suggestedTitle: "Jouw Leer-Superpower", suggestedDescription: "Iedereen leert anders. Ontdek met deze quiz wat voor jou de beste manier is om te leren en je te concentreren op school.", suggestedDescriptionForParent: "Ontdek met deze vragenlijst wat voor uw kind de beste manier is om te leren en zich te concentreren op school, zodat u beter kunt ondersteunen." },
  { id: 'prikkels_omgeving', icon: Zap, title: 'Prikkels & Omgeving', description: 'Hoe reageer je op geluiden, licht en drukte?', tags: ['Geluidsgevoelig', 'Drukte', 'Rustplekken'], suggestedTitle: "Jouw Prikkels & Energie Meter", suggestedDescription: "Ben jij gevoelig voor geluiden, licht of drukte? Deze quiz helpt je te begrijpen hoe jouw omgeving je energie beïnvloedt.", suggestedDescriptionForParent: "Krijg inzicht in hoe uw kind reageert op zintuiglijke prikkels zoals geluid, licht en drukte, en hoe u overprikkeling kunt helpen voorkomen." },
  { id: 'wie_ben_ik', icon: User, title: 'Wie ben ik?', description: 'Ontdek je persoonlijkheid en sterke punten.', tags: ['Sterke punten', 'Interesses', 'Waarden'], suggestedTitle: "Ontdek Jouw Unieke Zelf", suggestedDescription: "Wat maakt jou, jou? Ontdek je persoonlijke eigenschappen, je interesses en wat je belangrijk vindt in het leven.", suggestedDescriptionForParent: "Help uw kind zijn of haar unieke persoonlijkheid, sterke punten en interesses te ontdekken." },
  { id: 'dromen_toekomst', icon: Rocket, title: 'Dromen & Toekomst', description: 'Verken je toekomstdromen en hoe je die kunt bereiken.', tags: ['Toekomst', 'Doelen stellen', 'Motivatie'], suggestedTitle: "Jouw Toekomst Kompas", suggestedDescription: "Wat wil je later worden? Waar droom je van? Deze quiz helpt je om je toekomst te verkennen en doelen te stellen.", suggestedDescriptionForParent: "Krijg een beeld van de dromen en toekomstplannen van uw kind en hoe u hen hierin kunt motiveren en ondersteunen." }
];

// Re-using the adaptive content setup from before, as it's a special case
const Step3_AdaptiveContent = React.lazy(() => import('./adaptive/Step3_AdaptiveContent'));

const CreationSummary = () => {
    const { quizData } = useQuizCreator();
    
    const creationTypeLabels = {
        scratch: 'Vanaf Nul',
        template: 'Template',
        ai: 'AI Gegenereerd',
        adaptive: 'Adaptieve Quiz'
    };
    const creationTypeLabel = quizData.creationType ? creationTypeLabels[quizData.creationType] : 'Onbekend';

    let audienceLabel: string;
    switch(quizData.audienceType) {
        case 'teen': audienceLabel = 'Tiener (zelf)'; break;
        case 'parent': audienceLabel = 'Ouder over kind'; break;
        case 'adult': audienceLabel = 'Volwassene (zelf)'; break;
        default: audienceLabel = 'Onbekend';
    }

    return (
        <Card className="bg-blue-50 border-blue-200 mb-8 p-4">
            <CardHeader className="p-0 pb-2">
                <CardTitle className="text-sm font-semibold text-blue-700">Je selecties:</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="flex flex-wrap gap-2">
                    {quizData.creationType && <Badge variant="default" className="bg-purple-500 hover:bg-purple-600">Type: {creationTypeLabel}</Badge>}
                    {quizData.targetAgeGroup && <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">{quizData.targetAgeGroup} jaar</Badge>}
                    {quizData.audienceType && <Badge variant="secondary" className="bg-indigo-200 text-indigo-800">{audienceLabel}</Badge>}
                    {quizData.focusFlags?.map(flag => flag !== 'general' && <Badge key={flag} variant="outline" className="capitalize">{flag.replace(/-friendly|-focus/g, '').replace(/(^\w)/, c => c.toUpperCase())}</Badge>)}
                </div>
            </CardContent>
        </Card>
    );
};


// Main Component for Step 3
export const Step3Content = () => {
  const { quizData, setQuizData } = useQuizCreator();

  if (quizData.creationType === 'adaptive') {
    return <React.Suspense fallback={<div>Laden...</div>}><Step3_AdaptiveContent /></React.Suspense>;
  }

  const handleCategorySelect = (category: CategoryInfo) => {
    const isForParent = quizData.audienceType === 'parent';
    const descriptionText = isForParent
      ? (category.suggestedDescriptionForParent || category.description)
      : (category.suggestedDescription || category.description);

    setQuizData(prev => ({
      ...prev,
      mainCategory: category.id,
      title: category.suggestedTitle || category.title,
      description: descriptionText,
    }));
  };

  const getSmartSuggestions = (): { text: string; badges: { id: string; label: string; perfect: boolean }[] } | null => {
    const isHSP = quizData.focusFlags?.includes('hsp-friendly');
    if (isHSP) {
      return {
        text: `Op basis van je selecties raden we onderwerpen aan die goed werken voor hoogSensitieve jongeren in de brugklas (${quizData.targetAgeGroup} jaar). Focus op zelfinzicht en praktische tips, met aandacht voor emotionele intensiteit en prikkelgevoeligheid.`,
        badges: [
          { id: 'emoties_gevoelens', label: 'Aanbevolen', perfect: false },
          { id: 'vriendschappen_sociaal', label: 'Aanbevolen', perfect: false },
          { id: 'prikkels_omgeving', label: 'HSP Perfect', perfect: true },
        ]
      };
    }
    return null;
  };

  const smartSuggestions = getSmartSuggestions();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">3. Content & Onderwerp</h2>
        <p className="text-muted-foreground">Kies een hoofdcategorie en geef je quiz een duidelijke titel en omschrijving. De andere instellingen volgen in de volgende stap.</p>
      </div>

      <CreationSummary />

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Pencil className="h-5 w-5 text-primary"/> Basis Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="quiz-title">Quiz Titel</Label>
              <Input id="quiz-title" value={quizData.title || ''} onChange={(e) => setQuizData(prev => ({...prev, title: e.target.value}))} placeholder="Titel van de quiz"/>
              <p className="text-xs text-muted-foreground mt-1">Maak het aantrekkelijk voor de doelgroep.</p>
            </div>
            <div>
              <Label htmlFor="quiz-description">Quiz Beschrijving</Label>
              <Textarea id="quiz-description" value={quizData.description || ''} onChange={(e) => setQuizData(prev => ({...prev, description: e.target.value}))} placeholder="Leg uit wat de gebruiker kan verwachten..." rows={3}/>
              <p className="text-xs text-muted-foreground mt-1">Gebruik eenvoudige taal en maak het spannend.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Puzzle className="h-5 w-5 text-primary"/> Hoofdcategorie</CardTitle>
            <CardDescription>Kies de categorie die het beste bij de inhoud van je quiz past. Dit helpt bij het organiseren en bij het genereren van de juiste AI-vragen.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             {smartSuggestions && (
                <Alert variant="default" className="mb-4 bg-green-50 border-green-200 text-green-700">
                    <Lightbulb className="h-5 w-5 !text-green-600" />
                    <AlertTitle className="text-green-700 font-semibold">Slimme Suggesties</AlertTitle>
                    <AlertDescription className="text-green-800">
                        {smartSuggestions.text}
                    </AlertDescription>
                </Alert>
            )}
            {allCategories.map(cat => {
              const suggestion = smartSuggestions?.badges.find(b => b.id === cat.id);
              const IconComponent = cat.icon;
              return (
                <Card
                  key={cat.id}
                  className={cn(
                    "p-4 cursor-pointer transition-all border-2 flex items-start gap-4",
                    quizData.mainCategory === cat.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50',
                    suggestion && 'border-green-400 bg-green-50/50'
                  )}
                  onClick={() => handleCategorySelect(cat)}
                >
                  <IconComponent className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-md">{cat.title}</h4>
                      {suggestion && <Badge className={suggestion.perfect ? 'bg-teal-500' : 'bg-green-500'}>{suggestion.label}</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{cat.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {cat.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
                    </div>
                  </div>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
