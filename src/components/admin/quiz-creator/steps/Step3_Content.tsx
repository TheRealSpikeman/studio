'use client';

import React, { useMemo } from 'react';
import type { ElementType } from 'react';
import { useQuizCreator } from '@/contexts/QuizCreatorContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Lightbulb, User as UserIcon, Sparkles, HeartHandshake, Users, GraduationCap,
  Zap, Smile, Cloud, BookOpen
} from 'lucide-react';

interface CategoryInfo {
  id: string;
  icon: ElementType;
  title: string;
  description: string;
  tags: string[];
  suggestedTitle?: string;
  suggestedDescription?: string;
}

const allCategories: CategoryInfo[] = [
  { id: 'emoties_gevoelens', icon: HeartHandshake, title: 'Emoties & Gevoelens', description: 'Herken en ga om met intense emoties.', tags: ['Gevoelens herkennen', 'Stress signalen', 'Rustig worden'], suggestedTitle: "Ontdek Jouw Gevoelens-Superkracht", suggestedDescription: "Deze quiz helpt je te ontdekken hoe je omgaat met verschillende gevoelens, van blijdschap tot frustratie. Leer je emotionele superkrachten kennen!" },
  { id: 'vriendschappen_sociaal', icon: Users, title: 'Vriendschappen & Sociaal', description: 'Hoe ga je om met groepsdruk en vind je echte vrienden?', tags: ['Vrienden maken', 'Grenzen stellen', 'Groepsdruk'], suggestedTitle: "Jouw Vriendschap-Stijl", suggestedDescription: "Ontdek hoe jij je verhoudt tot anderen, hoe je vrienden maakt en wat voor jou belangrijk is in sociale situaties." },
  { id: 'leren_school', icon: GraduationCap, title: 'Leren & School', description: 'Ontdek hoe jij het beste leert en je concentreert.', tags: ['Concentratie', 'Huiswerk tips', 'Leer-stijl'], suggestedTitle: "Jouw Leer-Superpower", suggestedDescription: "Iedereen leert anders. Ontdek met deze quiz wat voor jou de beste manier is om te leren en je te concentreren op school." },
  { id: 'prikkels_omgeving', icon: Zap, title: 'Prikkels & Omgeving', description: 'Hoe reageer je op geluiden, licht en drukte?', tags: ['Geluidsgevoelig', 'Drukte', 'Rustplekken'], suggestedTitle: "Jouw Prikkels & Energie Meter", suggestedDescription: "Ben jij gevoelig voor geluiden, licht of drukte? Deze quiz helpt je te begrijpen hoe jouw omgeving je energie beïnvloedt." },
  { id: 'wie_ben_ik', icon: UserIcon, title: 'Wie ben ik?', description: 'Ontdek je persoonlijkheid en sterke punten.', tags: ['Sterke punten', 'Interesses', 'Waarden'], suggestedTitle: "Ontdek Jouw Unieke Zelf", suggestedDescription: "Wat maakt jou, jou? Ontdek je persoonlijke eigenschappen, je interesses en wat je belangrijk vindt in het leven." },
  { id: 'dromen_toekomst', icon: Cloud, title: 'Dromen & Toekomst', description: 'Verken je toekomstdromen en hoe je die kunt bereiken.', tags: ['Toekomst', 'Doelen stellen', 'Motivatie'], suggestedTitle: "Jouw Toekomst Kompas", suggestedDescription: "Wat wil je later worden? Waar droom je van? Deze quiz helpt je om je toekomst te verkennen en doelen te stellen." }
];

export const Step3Content = () => {
  const { quizData, setQuizData } = useQuizCreator();

  const handleCategorySelect = (category: CategoryInfo) => {
    setQuizData(prev => ({
      ...prev,
      mainCategory: category.id,
      title: category.suggestedTitle || category.title,
      description: category.suggestedDescription || category.description,
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
        <p className="text-muted-foreground">Bepaal wat je quiz gaat meten en welke vorm het krijgt.</p>
      </div>

      <div className="mb-4">
        <span className="text-sm font-medium text-muted-foreground mr-2">Je selecties tot nu toe:</span>
        <Badge variant="secondary" className="mr-1">{quizData.targetAgeGroup} jaar</Badge>
        <Badge variant="secondary" className="mr-1">{quizData.audienceType === 'parent' ? 'Ouder over kind' : 'Voor zichzelf'}</Badge>
        {quizData.focusFlags?.map(flag => <Badge key={flag} variant="secondary" className="mr-1 capitalize">{flag.replace('-friendly', '')}</Badge>)}
      </div>
      
      {smartSuggestions && (
        <Alert variant="default" className="mb-4 bg-green-50 border-green-200 text-green-700">
          <Lightbulb className="h-5 w-5 !text-green-600" />
          <AlertTitle className="text-green-700 font-semibold">Slimme Suggesties voor {quizData.focusFlags?.find(f => f.includes('hsp'))?.replace('-', ' ')} Quiz ({quizData.targetAgeGroup} jaar)</AlertTitle>
          <AlertDescription className="text-green-800">
            {smartSuggestions.text}
          </AlertDescription>
        </Alert>
      )}

      {quizData.targetAgeGroup === '12-14' && (
         <Alert variant="default" className="mb-6 bg-blue-50 border-blue-200 text-blue-700">
          <UserIcon className="h-5 w-5 !text-blue-600" />
          <AlertTitle className="text-blue-700 font-semibold">{quizData.targetAgeGroup} jaar aanpassingen actief</AlertTitle>
          <AlertDescription className="text-blue-800">
            Vragen worden aangepast aan brugklas niveau, met herkenbare schoolsituaties en alledaagse voorbeelden. Taalgebruik wordt vereenvoudigd.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Categories */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-lg font-medium text-foreground">Kies je Hoofdcategorie</h3>
          {allCategories.map(cat => {
            const suggestion = smartSuggestions?.badges.find(b => b.id === cat.id);
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
                    <cat.icon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
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
        </div>

        {/* Right Column: Settings */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 p-6 shadow-md border">
            <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary"/>Quiz Instellingen</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="quiz-title">Quiz Titel</Label>
                <Input id="quiz-title" value={quizData.title || ''} onChange={(e) => setQuizData(prev => ({...prev, title: e.target.value}))} placeholder="Titel van de quiz"/>
                <p className="text-xs text-muted-foreground mt-1">Maak het aantrekkelijk voor {quizData.targetAgeGroup} jarigen</p>
              </div>
              <div>
                <Label htmlFor="quiz-duration">Geschatte Duur</Label>
                <Select value={quizData.estimatedDuration} onValueChange={(val) => setQuizData(prev => ({...prev, estimatedDuration: val}))}>
                  <SelectTrigger id="quiz-duration"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2-3">2-3 minuten (2-3 vragen)</SelectItem>
                    <SelectItem value="3-5">3-5 minuten (4-6 vragen)</SelectItem>
                    <SelectItem value="5-8">5-8 minuten (7-10 vragen)</SelectItem>
                    <SelectItem value="8-12">8-12 minuten (11-15 vragen)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quiz-description">Quiz Beschrijving</Label>
                <Textarea id="quiz-description" value={quizData.description || ''} onChange={(e) => setQuizData(prev => ({...prev, description: e.target.value}))} placeholder="Leg uit wat jongeren kunnen verwachten..." rows={4}/>
                <p className="text-xs text-muted-foreground mt-1">Gebruik eenvoudige taal en maak het spannend.</p>
              </div>
              <div>
                <Label htmlFor="quiz-result-type">Resultaat Type</Label>
                <Select value={quizData.resultType} onValueChange={(val) => setQuizData(prev => ({...prev, resultType: val}))}>
                   <SelectTrigger id="quiz-result-type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personality-4-types">Persoonlijkheidstype (4 types)</SelectItem>
                    <SelectItem value="score-based">Score-gebaseerd (bijv. 8/10)</SelectItem>
                    <SelectItem value="ai-summary">AI Samenvatting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div>
                <Label htmlFor="quiz-difficulty">Vraag Moeilijkheid</Label>
                <Select value={quizData.difficulty} onValueChange={(val) => setQuizData(prev => ({...prev, difficulty: val}))}>
                   <SelectTrigger id="quiz-difficulty"><SelectValue placeholder="Selecteer moeilijkheid" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basisschool-groep-8">Basisschool Groep 8</SelectItem>
                    <SelectItem value="brugklas">Brugklas niveau (12-14 jaar)</SelectItem>
                    <SelectItem value="bovenbouw">Bovenbouw niveau (15-18 jaar)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
