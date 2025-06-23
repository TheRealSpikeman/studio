'use client';

import React, { useEffect, useState } from 'react';
import { useQuizCreator } from '@/contexts/QuizCreatorContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Lightbulb, Rocket, BarChart3, Users, User, Briefcase, GraduationCap, HeartHandshake, Cloud, Zap
} from 'lucide-react';
import { LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY, type SubscriptionPlan } from '@/app/dashboard/admin/subscription-management/page';

// Re-defining allCategories here to avoid circular dependencies if moved to context
const allCategories = [
  { id: 'emoties_gevoelens', icon: HeartHandshake, title: 'Emoties & Gevoelens', description: 'Herken en ga om met intense emoties.', tags: ['Gevoelens herkennen', 'Stress signalen', 'Rustig worden'], suggestedTitle: "Ontdek Jouw Gevoelens-Superkracht", suggestedDescription: "Deze quiz helpt je te ontdekken hoe je omgaat met verschillende gevoelens, van blijdschap tot frustratie. Leer je emotionele superkrachten kennen!" },
  { id: 'vriendschappen_sociaal', icon: Users, title: 'Vriendschappen & Sociaal', description: 'Hoe ga je om met groepsdruk en vind je echte vrienden?', tags: ['Vrienden maken', 'Grenzen stellen', 'Groepsdruk'], suggestedTitle: "Jouw Vriendschap-Stijl", suggestedDescription: "Ontdek hoe jij je verhoudt tot anderen, hoe je vrienden maakt en wat voor jou belangrijk is in sociale situaties." },
  { id: 'leren_school', icon: GraduationCap, title: 'Leren & School', description: 'Ontdek hoe jij het beste leert en je concentreert.', tags: ['Concentratie', 'Huiswerk tips', 'Leer-stijl'], suggestedTitle: "Jouw Leer-Superpower", suggestedDescription: "Iedereen leert anders. Ontdek met deze quiz wat voor jou de beste manier is om te leren en je te concentreren op school." },
  { id: 'prikkels_omgeving', icon: Zap, title: 'Prikkels & Omgeving', description: 'Hoe reageer je op geluiden, licht en drukte?', tags: ['Geluidsgevoelig', 'Drukte', 'Rustplekken'], suggestedTitle: "Jouw Prikkels & Energie Meter", suggestedDescription: "Ben jij gevoelig voor geluiden, licht of drukte? Deze quiz helpt je te begrijpen hoe jouw omgeving je energie beïnvloedt." },
  { id: 'wie_ben_ik', icon: User, title: 'Wie ben ik?', description: 'Ontdek je persoonlijkheid en sterke punten.', tags: ['Sterke punten', 'Interesses', 'Waarden'], suggestedTitle: "Ontdek Jouw Unieke Zelf", suggestedDescription: "Wat maakt jou, jou? Ontdek je persoonlijke eigenschappen, je interesses en wat je belangrijk vindt in het leven." },
  { id: 'dromen_toekomst', icon: Cloud, title: 'Dromen & Toekomst', description: 'Verken je toekomstdromen en hoe je die kunt bereiken.', tags: ['Toekomst', 'Doelen stellen', 'Motivatie'], suggestedTitle: "Jouw Toekomst Kompas", suggestedDescription: "Wat wil je later worden? Waar droom je van? Deze quiz helpt je om je toekomst te verkennen en doelen te stellen." }
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
                if (currentLevel[key] === undefined) {
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
                if (currentLevel[key] === undefined) {
                    currentLevel[key] = {};
                }
                currentLevel = currentLevel[key];
            });
            
            const currentArray = currentLevel[path[path.length - 1]] || [];
            const newArray = isChecked
                ? [...currentArray, value]
                : currentArray.filter((item: string) => item !== value);

            currentLevel[path[path.length - 1]] = newArray;
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
    const showADHDAlert = quizData.focusFlags?.includes('adhd-friendly') || quizData.focusFlags?.includes('executive-functions-focus');
    const showADHDCoachOption = quizData.mainCategory?.toLowerCase().includes('adhd') || quizData.focusFlags?.includes('adhd-friendly');
    
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
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">Resultaat Presentatie</CardTitle>
                                    <CardDescription className="text-xs">
                                        {quizData.audienceType === 'parent' ? 'Hoe worden de resultaten aan de ouder getoond?' : 'Hoe worden resultaten getoond (indien gedeeld met ouders)?'}
                                    </CardDescription>
                                </div>
                                <Switch id="resultPresentationSwitch" checked={settings.resultPresentation?.showToParent ?? true} onCheckedChange={(val) => handleSettingChange(['settings', 'resultPresentation', 'showToParent'], val)} />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <Select value={settings.resultPresentation?.format ?? 'visual_report'} onValueChange={(val) => handleSettingChange(['settings', 'resultPresentation', 'format'], val)}>
                               <SelectTrigger><SelectValue/></SelectTrigger>
                               <SelectContent>
                                   <SelectItem value="visual_report">Visueel rapport met tips (Aa)</SelectItem>
                                   <SelectItem value="text_summary">Alleen tekst samenvatting</SelectItem>
                                   <SelectItem value="score_only">Alleen scores</SelectItem>
                               </SelectContent>
                           </Select>
                           {showADHDAlert && (
                                <Alert variant="default" className="bg-green-50 border-green-200 text-green-700">
                                    <Lightbulb className="h-4 w-4 !text-green-600"/>
                                    <AlertTitle className="text-green-700 text-sm font-semibold">Voor ADHD + Executive Functions</AlertTitle>
                                    <AlertDescription className="text-green-800 text-xs">Visuele rapporten werken beter dan lange teksten.</AlertDescription>
                                </Alert>
                           )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-base">Toon Aanbevolen Tools</CardTitle>
                                  <CardDescription className="text-xs">Toon een sectie met aanbevolen tools na de quiz.</CardDescription>
                                </div>
                                <Switch id="showRecommendedToolsSwitch" checked={settings.showRecommendedTools ?? true} onCheckedChange={(val) => handleSettingChange(['settings', 'showRecommendedTools'], val)} />
                            </div>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">Coach Marketplace Integratie</CardTitle>
                                    <CardDescription className="text-xs">Suggereer passende coaches gebaseerd op resultaten.</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-amber-600 border-amber-400">Binnenkort</Badge>
                                  <Switch id="coachIntegrationSwitch" checked={settings.coachIntegration?.enabled ?? true} onCheckedChange={(val) => handleSettingChange(['settings', 'coachIntegration', 'enabled'], val)} />
                                </div>
                            </div>
                        </CardHeader>
                         <CardContent>
                           {showADHDCoachOption && (
                                <div className="flex items-center space-x-2">
                                    <Checkbox 
                                        id="adhd-coach-check" 
                                        checked={settings.coachIntegration?.specializations?.includes('adhd') ?? true} 
                                        onCheckedChange={(val) => handleCheckboxArrayChange(['settings', 'coachIntegration', 'specializations'], 'adhd', val as boolean)}
                                    />
                                    <Label htmlFor="adhd-coach-check" className="font-normal cursor-pointer">ADHD-gespecialiseerde coaches</Label>
                                </div>
                           )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-base">Sla resultaten op in profiel</CardTitle>
                                  <CardDescription className="text-xs">Sla de quizresultaten op onder de 'Resultaten' pagina.</CardDescription>
                                </div>
                                <Switch id="saveResultsSwitch" checked={settings.saveResultsToProfile ?? true} onCheckedChange={(val) => handleSettingChange(['settings', 'saveResultsToProfile'], val)} />
                            </div>
                        </CardHeader>
                    </Card>

                </div>

                {/* Column 2: Toegang & Distributie */}
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2"><Rocket className="h-6 w-6 text-primary"/>Toegang & Distributie</h3>

                    <Card>
                        <CardHeader className="pb-4">
                             <CardTitle className="text-base">Quiz Toegankelijkheid</CardTitle>
                            <CardDescription className="text-xs">Selecteer welke abonnementsplannen toegang hebben tot deze quiz.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {allSubscriptionPlans.length > 0 ? allSubscriptionPlans.map(plan => (
                                    <div key={plan.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`plan-${plan.id}`}
                                            checked={settings.accessibility?.allowedPlans?.includes(plan.id) ?? false}
                                            onCheckedChange={(checked) => handleCheckboxArrayChange(['settings', 'accessibility', 'allowedPlans'], plan.id, checked as boolean)}
                                        />
                                        <Label htmlFor={`plan-${plan.id}`} className="font-normal cursor-pointer">
                                            {plan.name} <span className="text-xs text-muted-foreground">({plan.shortName || plan.id})</span>
                                        </Label>
                                    </div>
                                )) : (
                                    <p className="text-xs text-muted-foreground">Geen actieve abonnementen gevonden. Configureer deze eerst in Abonnementenbeheer.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">School Partnerships</CardTitle>
                                    <CardDescription className="text-xs">Beschikbaar maken voor scholen en docenten.</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-amber-600 border-amber-400">Binnenkort</Badge>
                                    <Switch id="schoolPartnershipsSwitch" checked={settings.schoolPartnerships?.enabled ?? false} onCheckedChange={(val) => handleSettingChange(['settings', 'schoolPartnerships', 'enabled'], val)}/>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                             <div className="flex items-center space-x-2">
                                <Checkbox id="school-vo" checked={settings.schoolPartnerships?.targetGroups?.includes('voortgezet_onderwijs') ?? false} onCheckedChange={(val) => handleCheckboxArrayChange(['settings', 'schoolPartnerships', 'targetGroups'], 'voortgezet_onderwijs', val as boolean)} />
                                <Label htmlFor="school-vo" className="font-normal cursor-pointer">Voortgezet onderwijs (12-18 jaar)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="school-speciaal" checked={settings.schoolPartnerships?.targetGroups?.includes('speciaal_onderwijs') ?? false} onCheckedChange={(val) => handleCheckboxArrayChange(['settings', 'schoolPartnerships', 'targetGroups'], 'speciaal_onderwijs', val as boolean)} />
                                <Label htmlFor="school-speciaal" className="font-normal cursor-pointer">Speciale onderwijsvoorzieningen</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="school-zorg" checked={settings.schoolPartnerships?.targetGroups?.includes('zorgcoordinatoren') ?? false} onCheckedChange={(val) => handleCheckboxArrayChange(['settings', 'schoolPartnerships', 'targetGroups'], 'zorgcoordinatoren', val as boolean)} />
                                <Label htmlFor="school-zorg" className="font-normal cursor-pointer">Zorgcoördinatoren</Label>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                         <CardHeader className="pb-4">
                             <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">Content Moderatie</CardTitle>
                                    <CardDescription className="text-xs">Handmatige review voordat quiz live gaat.</CardDescription>
                                </div>
                                <Switch id="contentModerationSwitch" checked={settings.contentModeration?.required ?? true} onCheckedChange={(val) => handleSettingChange(['settings', 'contentModeration', 'required'], val)} />
                             </div>
                        </CardHeader>
                    </Card>

                </div>
            </div>
        </div>
    );
}
