'use client';

import React, { useEffect, useState } from 'react';
import { useQuizCreator } from '@/contexts/QuizCreatorContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Lightbulb, Rocket, BarChart3, Users as UsersIcon, Briefcase, GraduationCap, HeartHandshake, Zap, Info, Star, User, BookOpenCheck
} from '@/lib/icons';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY, type SubscriptionPlan } from '@/types/subscription';
import { ImageUploader } from '@/components/common/ImageUploader';
import { audienceOptions, categoryOptions } from '@/types/quiz-admin';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const allCategories = [
  { id: 'emoties_gevoelens', icon: HeartHandshake, title: 'Emoties & Gevoelens' },
  { id: 'vriendschappen_sociaal', icon: UsersIcon, title: 'Vriendschappen & Sociaal' },
  { id: 'leren_school', icon: GraduationCap, title: 'Leren & School' },
  { id: 'prikkels_omgeving', icon: Zap, title: 'Prikkels & Omgeving' },
  { id: 'wie_ben_ik', icon: User, title: 'Wie ben ik?' },
  { id: 'dromen_toekomst', icon: Rocket, title: 'Dromen & Toekomst' }
];

export const Step4_Settings = () => {
    const { quizData, setQuizData } = useQuizCreator();
    const [allSubscriptionPlans, setAllSubscriptionPlans] = useState<SubscriptionPlan[]>([]);

    useEffect(() => {
        const storedPlansRaw = localStorage.getItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY);
        if (storedPlansRaw) {
            try {
                const plans: SubscriptionPlan[] = JSON.parse(storedPlansRaw);
                setAllSubscriptionPlans(plans.filter(p => p.active));
            } catch (error) {
                console.error("Error loading subscription plans from localStorage:", error);
            }
        }
    }, []);

    const handleSettingChange = (path: (string | number)[], value: any) => {
        setQuizData(prev => {
            const newState = { ...prev };
            let currentLevel: any = newState;
            path.slice(0, -1).forEach(key => {
                if (currentLevel[key] === undefined || typeof currentLevel[key] !== 'object') {
                    currentLevel[key] = {};
                }
                currentLevel = currentLevel[key];
            });
            currentLevel[path[path.length - 1]] = value;
            return newState;
        });
    };
    
    const handleCheckboxArrayChange = (path: (string | number)[], value: string, isChecked: boolean) => {
         setQuizData(prev => {
            const newState = { ...prev };
            let currentLevel: any = newState;
            path.slice(0, -1).forEach(key => {
                if (currentLevel[key] === undefined || typeof currentLevel[key] !== 'object') {
                    currentLevel[key] = {};
                }
                currentLevel = currentLevel[key];
            });
            
            const arrayKey = path[path.length - 1];
            const currentArray = currentLevel[arrayKey] || [];
            const newArray = isChecked
                ? [...currentArray, value]
                : currentArray.filter((item: string) => item !== value);

            currentLevel[arrayKey] = newArray;
            return newState;
        });
    }

    const creationTypeLabels = {
        scratch: 'Vanaf Nul',
        template: 'Template',
        ai: 'AI Gegenereerd',
        adaptive: 'Adaptieve Quiz'
    };
    const creationTypeLabel = quizData.creationType ? creationTypeLabels[quizData.creationType] : 'Onbekend';
    
    const settings = quizData.settings || {};
    const isParentAudienceSelected = quizData.audienceType === 'parent';

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-2">4. Instellingen</h2>
            <p className="text-muted-foreground mb-6">Configureer hoe je quiz werkt en wat er gebeurt na afloop.</p>
            
            <Card className="bg-blue-50 border-blue-200 mb-8 p-4">
                <CardHeader className="p-0 pb-2">
                    <CardTitle className="text-sm font-semibold text-blue-700">Je selecties:</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="flex flex-wrap gap-2">
                        {quizData.creationType && <Badge variant="default" className="bg-purple-500 hover:bg-purple-600">Type: {creationTypeLabel}</Badge>}
                        {quizData.targetAgeGroup && <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">{quizData.targetAgeGroup} jaar</Badge>}
                        {quizData.audienceType === 'parent' && <Badge variant="secondary" className="bg-indigo-200 text-indigo-800">Ouder over kind</Badge>}
                        {quizData.audienceType === 'teen' && <Badge variant="secondary" className="bg-indigo-200 text-indigo-800">Tiener (zelf)</Badge>}
                        {quizData.audienceType === 'adult' && <Badge variant="secondary" className="bg-indigo-200 text-indigo-800">Volwassene (zelf)</Badge>}
                        {quizData.focusFlags?.map(flag => flag !== 'general' && <Badge key={flag} variant="outline" className="capitalize">{flag.replace(/-friendly|-focus/g, '').replace(/(^\w)/, c => c.toUpperCase())}</Badge>)}
                        {quizData.mainCategory && <Badge variant="outline">{allCategories.find(c => c.id === quizData.mainCategory)?.title || quizData.mainCategory}</Badge>}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Column 1: Resultaat & Follow-up */}
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2"><BarChart3 className="h-6 w-6 text-primary"/>Resultaat & Follow-up</h3>
                     <Card>
                        <CardHeader className="pb-4">
                           <CardTitle className="text-base">Rapport Componenten</CardTitle>
                           <CardDescription className="text-xs">Selecteer welke onderdelen getoond worden op de resultatenpagina.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-background">
                                <div className="space-y-0.5 w-full">
                                    <Label>Resultaat Presentatie</Label>
                                    <Select value={settings.resultPresentation?.format} onValueChange={(val) => handleSettingChange(['settings', 'resultPresentation', 'format'], val)}>
                                        <SelectTrigger id="result-format">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="visual_report">Visueel rapport met tips (standaard)</SelectItem>
                                            <SelectItem value="text_summary">Alleen tekst samenvatting</SelectItem>
                                            <SelectItem value="score_only">Alleen scores</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-background">
                              <div className="space-y-0.5">
                                  <Label htmlFor="showChartSwitch">Toon visuele grafiek</Label>
                                  <p className="text-xs text-muted-foreground">Toont een spinnenweb-grafiek (bij 3+ scores) of schaal (bij 1-2 scores).</p>
                              </div>
                              <Switch
                                  id="showChartSwitch"
                                  checked={settings.resultPresentation?.showChart ?? true}
                                  onCheckedChange={(checked) => handleSettingChange(['settings', 'resultPresentation', 'showChart'], checked)}
                              />
                            </div>
                           {isParentAudienceSelected && (
                              <div className="flex items-center justify-between rounded-lg border p-4 bg-background">
                                  <div className="space-y-0.5">
                                      <Label htmlFor="showParentalCtaSwitch" className="flex items-center gap-2">
                                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-400"/>
                                          Toon "Gezins Gids" Promotie
                                      </Label>
                                      <p className="text-xs text-muted-foreground">Voeg een sales pitch toe aan het rapport voor ouders.</p>
                                  </div>
                                  <Switch
                                      id="showParentalCtaSwitch"
                                      checked={settings.resultPresentation?.showParentalCta ?? false}
                                      onCheckedChange={(checked) => handleSettingChange(['settings', 'resultPresentation', 'showParentalCta'], checked)}
                                  />
                              </div>
                           )}
                           <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-background">
                              <div className="space-y-0.5">
                                  <Label htmlFor="showRecommendedToolsSwitch">Toon Aanbevolen Tools</Label>
                                  <p className="text-xs text-muted-foreground">Toon een sectie met aanbevolen tools na het voltooien van deze quiz.</p>
                              </div>
                              <Switch
                                  id="showRecommendedToolsSwitch"
                                  checked={settings.showRecommendedTools ?? true}
                                  onCheckedChange={(checked) => handleSettingChange(['settings', 'showRecommendedTools'], checked)}
                              />
                           </div>
                           <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-background">
                                <div className="space-y-0.5">
                                    <Label htmlFor="saveResultsToProfileSwitch">Sla resultaten op in profiel</Label>
                                    <p className="text-xs text-muted-foreground">Sla de quizresultaten op onder de 'Resultaten' pagina van de gebruiker.</p>
                                </div>
                                <Switch
                                    id="saveResultsToProfileSwitch"
                                    checked={settings.saveResultsToProfile ?? true}
                                    onCheckedChange={(checked) => handleSettingChange(['settings', 'saveResultsToProfile'], checked)}
                                />
                            </div>
                        </CardContent>
                     </Card>
                </div>

                {/* Column 2: Toegang & Eigenschappen */}
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2"><Rocket className="h-6 w-6 text-primary"/>Quiz Eigenschappen</h3>
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base">Eigenschappen</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="quiz-duration">Geschatte Duur</Label>
                                <Select value={quizData.estimatedDuration} onValueChange={(val) => handleSettingChange(['estimatedDuration'], val)}>
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
                                <Label htmlFor="quiz-result-type">Resultaat Type</Label>
                                <Select value={quizData.resultType} onValueChange={(val) => handleSettingChange(['resultType'], val)}>
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
                                <Select value={quizData.difficulty} onValueChange={(val) => handleSettingChange(['difficulty'], val)}>
                                   <SelectTrigger id="quiz-difficulty"><SelectValue placeholder="Selecteer moeilijkheid" /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="laag">Laag / Eenvoudig</SelectItem>
                                    <SelectItem value="gemiddeld">Gemiddeld</SelectItem>
                                    <SelectItem value="hoog">Hoog / Complex</SelectItem>
                                  </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                     <Card><CardHeader><CardTitle className="text-base">Quiz Toegankelijkheid</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                           <div className="flex items-center justify-between rounded-lg border p-3 bg-background">
                                <div className="space-y-0.5">
                                    <Label htmlFor="isPublicSwitch" className="font-semibold cursor-pointer">Publiek Toegankelijk</Label>
                                    <p className="text-xs text-muted-foreground">Indien ingeschakeld, is deze quiz voor iedereen toegankelijk.</p>
                                </div>
                                <Switch
                                    id="isPublicSwitch"
                                    checked={settings.accessibility?.isPublic ?? false}
                                    onCheckedChange={(checked) => handleSettingChange(['settings', 'accessibility', 'isPublic'], checked)}
                                />
                           </div>
                            <Separator/>
                            <div className={cn("space-y-2 transition-opacity", settings.accessibility?.isPublic && "opacity-50 pointer-events-none")}>
                                <Label className={cn(!settings.accessibility?.isPublic && "text-foreground")}>Selecteer welke abonnementen toegang hebben (als niet publiek):</Label>
                                <div className="space-y-1">
                                  {allSubscriptionPlans.length > 0 ? allSubscriptionPlans.map(plan => (
                                    <div key={plan.id} className="flex flex-row items-center space-x-2">
                                      <Checkbox
                                          id={`plan-${plan.id}`}
                                          checked={settings.accessibility?.allowedPlans?.includes(plan.id) ?? false}
                                          onCheckedChange={(checked) => handleCheckboxArrayChange(['settings', 'accessibility', 'allowedPlans'], plan.id, !!checked)}
                                      />
                                      <Label htmlFor={`plan-${plan.id}`} className="text-sm font-normal">
                                          {plan.name}
                                      </Label>
                                    </div>
                                  )) : (<p className="text-xs text-muted-foreground">Geen actieve abonnementen gevonden. Configureer deze eerst in Abonnementenbeheer.</p>)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Quiz Afbeelding</CardTitle>
                            <CardDescription className="text-xs">Voeg een visuele thumbnail toe voor deze quiz.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ImageUploader
                                onUploadComplete={(url) => handleSettingChange(['thumbnailUrl'], url)}
                                initialImageUrl={quizData.thumbnailUrl}
                                uploadPath="images/quizzes"
                                aspectRatio="aspect-[16/9]"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
