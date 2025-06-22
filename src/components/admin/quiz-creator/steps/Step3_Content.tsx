
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { ElementType } from 'react';
import { useQuizCreator } from '@/contexts/QuizCreatorContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Lightbulb, Rocket, BarChart3, CheckCircle2, User as UserIcon, Search, Settings, Download, Users, Briefcase, GraduationCap, HeartHandshake, Cloud, BookOpen, Zap,
  GitBranch, ArrowRight, Plus, Pencil, Trash, AlertCircle, Brain, Puzzle, Check, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';


// Component for Adaptive Onboarding
const Step3_AdaptiveContent = () => {
    // Local state to manage settings for a live preview
    const [previewSettings, setPreviewSettings] = useState({
      phase1Questions: 18,
      phase1Threshold: 60,
      phase2MaxPerSpectrum: 12,
      phase2MaxTotal: 20,
      spectrums: [
        { id: 'adhd', name: 'ADHD', threshold: 65 },
        { id: 'ass', name: 'Autisme', threshold: 60 },
        { id: 'hsp', name: 'HSP', threshold: 55 },
        { id: 'executive', name: 'Executieve Functies', threshold: 60 },
        { id: 'sensory', name: 'Sensorische Verwerking', threshold: 58 },
        { id: 'emotion', name: 'Emotieregulatie', threshold: 50 },
      ]
    });

    // State to hold the calculated preview output
    const [previewOutput, setPreviewOutput] = useState<{ name: string; score: number; triggered: boolean }[]>([]);
    const [totalPhase2Questions, setTotalPhase2Questions] = useState(0);
    const [isOverLimit, setIsOverLimit] = useState(false);

    // Update handler for all inputs and sliders
    const handleSettingChange = (field: keyof typeof previewSettings, value: any) => {
      setPreviewSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSpectrumThresholdChange = (id: string, newThreshold: number) => {
      setPreviewSettings(prev => ({
        ...prev,
        spectrums: prev.spectrums.map(spec =>
          spec.id === id ? { ...spec, threshold: newThreshold } : spec
        ),
      }));
    };
    
    const runSimulation = useCallback(() => {
        let questionCount = 0;
        const newOutput = previewSettings.spectrums.map(spec => {
            // Use Math.random for a new result each time
            const score = Math.floor(Math.random() * 71) + 30; // Random score between 30 and 100
            const triggered = score >= spec.threshold;
            if (triggered) {
                questionCount += previewSettings.phase2MaxPerSpectrum;
            }
            return { name: spec.name, score, triggered };
        });

        setPreviewOutput(newOutput);
        setTotalPhase2Questions(questionCount);
        setIsOverLimit(questionCount > previewSettings.phase2MaxTotal);
    }, [previewSettings]);

    // Run the simulation once on initial mount to populate the preview
    useEffect(() => {
        runSimulation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array ensures this runs only once

    return (
        <div className="space-y-6">
            <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-700">
                <GitBranch className="h-5 w-5 !text-blue-600" />
                <AlertTitle className="text-blue-700 font-semibold">Adaptive Onboarding Quiz Setup</AlertTitle>
                <AlertDescription className="text-blue-800">
                    <strong>Geen handmatige focus selectie nodig!</strong> Deze quiz detecteert automatisch welke neurodiversiteit spectrums relevant zijn.
                    Hieronder configureer je hoe de detectie werkt en welke vragen gebruikt worden.
                </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Detection Algorithm</CardTitle>
                        <CardDescription>Configureer hier hoe de quiz automatisch relevante spectrums detecteert.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-3 border rounded-md bg-muted/50">
                           <h4 className="font-semibold text-sm mb-2 text-primary">Fase 1: Spectrum Detectie</h4>
                           <div className="grid grid-cols-2 gap-3">
                               <div className="config-group">
                                    <Label htmlFor="phase1-questions" className="text-xs font-medium text-muted-foreground mb-1 block">Aantal Vragen</Label>
                                    <Input id="phase1-questions" type="number" value={previewSettings.phase1Questions} onChange={(e) => handleSettingChange('phase1Questions', parseInt(e.target.value, 10) || 0)} />
                                    <p className="text-xs text-muted-foreground mt-1">Optimaal: 15-20 voor accuracy vs completion</p>
                               </div>
                               <div className="config-group">
                                    <Label htmlFor="phase1-threshold" className="text-xs font-medium text-muted-foreground mb-1 block">Min. Score (%)</Label>
                                    <Input id="phase1-threshold" type="number" value={previewSettings.phase1Threshold} onChange={(e) => handleSettingChange('phase1Threshold', parseInt(e.target.value, 10) || 0)} />
                                    <p className="text-xs text-muted-foreground mt-1">Threshold om Fase 2 vragen te triggeren</p>
                               </div>
                           </div>
                        </div>
                         <div className="p-3 border rounded-md bg-muted/50">
                           <h4 className="font-semibold text-sm mb-2 text-primary">Fase 2: Gerichte Verdieping</h4>
                           <div className="grid grid-cols-2 gap-3">
                               <div className="config-group">
                                    <Label htmlFor="phase2-max-per" className="text-xs font-medium text-muted-foreground mb-1 block">Max Vragen / Spectrum</Label>
                                    <Input id="phase2-max-per" type="number" value={previewSettings.phase2MaxPerSpectrum} onChange={(e) => handleSettingChange('phase2MaxPerSpectrum', parseInt(e.target.value, 10) || 0)} />
                                     <p className="text-xs text-muted-foreground mt-1">Max vragen per gedetecteerd spectrum.</p>
                               </div>
                               <div className="config-group">
                                    <Label htmlFor="phase2-max-total" className="text-xs font-medium text-muted-foreground mb-1 block">Totaal Max Fase 2</Label>
                                    <Input id="phase2-max-total" type="number" value={previewSettings.phase2MaxTotal} onChange={(e) => handleSettingChange('phase2MaxTotal', parseInt(e.target.value, 10) || 0)} />
                                    <p className="text-xs text-muted-foreground mt-1">Garandeert voorspelbare quizlengte.</p>
                               </div>
                           </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                       <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Algorithm Preview</CardTitle>
                                <CardDescription>Live simulatie van de detectie.</CardDescription>
                            </div>
                            <Button onClick={runSimulation} variant="outline" size="sm">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Run Simulatie
                            </Button>
                       </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono bg-muted px-2 py-1 rounded">
                            <span>Fase 1 Vragen</span><ArrowRight className="h-4 w-4 text-muted-foreground"/><ArrowRight className="h-4 w-4 text-muted-foreground"/>
                            <span>Scores</span><ArrowRight className="h-4 w-4 text-muted-foreground"/><ArrowRight className="h-4 w-4 text-muted-foreground"/>
                            <span>Thresholds</span>
                        </div>
                        <div className="p-3 border rounded-md bg-background text-sm">
                            <p className="font-semibold">Voorbeeld Output:</p>
                            {previewOutput.length > 0 ? previewOutput.map((item, index) => {
                                const currentSpectrum = previewSettings.spectrums[index];
                                return (
                                <p key={item.name} className={cn("text-xs", item.triggered ? "text-green-600 font-medium" : "text-muted-foreground")}>
                                    {item.name}: {item.score}% {item.triggered ? `(>${currentSpectrum.threshold}% ✓)` : `(<${currentSpectrum.threshold}% ✗)`} → {item.triggered ? `${previewSettings.phase2MaxPerSpectrum} vragen` : 'Skip'}
                                </p>
                                )
                            }) : <p className="text-xs text-muted-foreground">Klik op "Run Simulatie" om een voorbeeld te zien.</p>}
                             <p className="font-semibold mt-1">Totaal Fase 2: {totalPhase2Questions} vragen</p>
                        </div>
                        {isOverLimit && (
                            <Alert variant="default" className="bg-yellow-50 border-yellow-200 text-yellow-700">
                                 <AlertCircle className="h-4 w-4 !text-yellow-600"/>
                                 <AlertDescription className="text-xs text-yellow-800">
                                   Waarschuwing: Het totaal ({totalPhase2Questions}) overschrijdt het ingestelde maximum ({previewSettings.phase2MaxTotal}).
                                 </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div>
                <h3 className="text-lg font-medium text-foreground">Spectrum Detection Thresholds (%)</h3>
                <p className="text-sm text-muted-foreground -mt-1 mb-3">Stel hier de drempelwaarde in om een verdiepende vragenlijst te activeren.</p>
                <Card className="p-4">
                    <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 p-0">
                        {previewSettings.spectrums.map(spec => (
                            <div key={spec.id}>
                                <Label htmlFor={`threshold-${spec.id}`} className="text-sm font-medium">{spec.name}</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Slider
                                        value={[spec.threshold]}
                                        onValueChange={(val) => handleSpectrumThresholdChange(spec.id, val[0])}
                                        max={100}
                                        step={1}
                                        id={`threshold-${spec.id}`}
                                    />
                                    <span className="text-sm font-semibold w-10 text-right">{spec.threshold}%</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                   <div>
                    <CardTitle>Question Bank Management</CardTitle>
                    <CardDescription>Beheer hier de vragen die gebruikt worden in de detectie- en verdiepingsfases.</CardDescription>
                   </div>
                    <Button><Plus className="mr-2 h-4 w-4"/>Nieuwe Vraag</Button>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-md bg-muted/30">
                        <h4 className="font-semibold mb-2 flex justify-between">Fase 1: Detectie Vragen <Badge variant="secondary">24</Badge></h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                             <div className="text-xs flex justify-between items-center bg-card p-2 rounded border"><span>Hoe reageer je op veel prikkels tegelijk?</span><div className="space-x-1"><Button size="icon" variant="ghost" className="h-6 w-6"><Pencil className="h-3 w-3"/></Button><Button size="icon" variant="ghost" className="h-6 w-6"><Trash className="h-3 w-3"/></Button></div></div>
                             <div className="text-xs flex justify-between items-center bg-card p-2 rounded border"><span>Hoe ga je om met routineveranderingen?</span><div className="space-x-1"><Button size="icon" variant="ghost" className="h-6 w-6"><Pencil className="h-3 w-3"/></Button><Button size="icon" variant="ghost" className="h-6 w-6"><Trash className="h-3 w-3"/></Button></div></div>
                             <p className="text-xs text-center text-muted-foreground pt-1">+ 22 meer vragen...</p>
                        </div>
                    </div>
                     <div className="p-4 border rounded-md bg-muted/30">
                        <h4 className="font-semibold mb-2 flex justify-between">Fase 2: Verdiepingsvragen <Badge variant="secondary">67</Badge></h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                             <div className="text-xs flex justify-between items-center bg-card p-2 rounded border"><span>[ADHD] Welke strategieën helpen bij focus?</span><div className="space-x-1"><Button size="icon" variant="ghost" className="h-6 w-6"><Pencil className="h-3 w-3"/></Button><Button size="icon" variant="ghost" className="h-6 w-6"><Trash className="h-3 w-3"/></Button></div></div>
                             <div className="text-xs flex justify-between items-center bg-card p-2 rounded border"><span>[HSP] Hoe herken je overstimulatie?</span><div className="space-x-1"><Button size="icon" variant="ghost" className="h-6 w-6"><Pencil className="h-3 w-3"/></Button><Button size="icon" variant="ghost" className="h-6 w-6"><Trash className="h-3 w-3"/></Button></div></div>
                             <p className="text-xs text-center text-muted-foreground pt-1">+ 65 meer spectrum-specifieke vragen...</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Alert variant="default" className="bg-yellow-50 border-yellow-200 text-yellow-700">
                <AlertCircle className="h-5 w-5 !text-yellow-600"/>
                <AlertTitle className="text-yellow-700 font-semibold">Quiz Validation Status</AlertTitle>
                <AlertDescription className="grid grid-cols-2 gap-x-4 gap-y-1 text-yellow-800 text-sm">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-600"/>Minimaal 15 Fase 1 vragen</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-600"/>Algorithm gecalibreerd</span>
                    <span className="flex items-center gap-1.5"><AlertCircle className="h-4 w-4 text-orange-600"/>HSP threshold mogelijk te laag</span>
                    <span className="flex items-center gap-1.5"><AlertCircle className="h-4 w-4 text-red-600"/>Expert review pending</span>
                </AlertDescription>
            </Alert>
        </div>
    );
};


// Main Component for Step 3
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

  if (quizData.creationType === 'adaptive') {
    return <Step3_AdaptiveContent />;
  }

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
        {quizData.focusFlags?.map(flag => flag !== 'general' && <Badge key={flag} variant="secondary" className="mr-1 capitalize">{flag.replace('-friendly', '').replace('-focus', '').replace(/(^\w)/, c => c.toUpperCase())}</Badge>)}
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
                  <SelectTrigger id="quiz-duration"><SelectValue placeholder="Selecteer duur"/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2-3 minuten (2-3 vragen)">2-3 minuten (2-3 vragen)</SelectItem>
                    <SelectItem value="3-5 minuten (4-6 vragen)">3-5 minuten (4-6 vragen)</SelectItem>
                    <SelectItem value="5-8 minuten (7-10 vragen)">5-8 minuten (7-10 vragen)</SelectItem>
                    <SelectItem value="8-12 minuten (11-15 vragen)">8-12 minuten (11-15 vragen)</SelectItem>
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
                   <SelectTrigger id="quiz-result-type"><SelectValue placeholder="Selecteer resultaat type" /></SelectTrigger>
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
                    <SelectItem value="laag">Laag / Eenvoudig</SelectItem>
                    <SelectItem value="gemiddeld">Gemiddeld</SelectItem>
                    <SelectItem value="hoog">Hoog / Complex</SelectItem>
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
