
'use client';

import React, { useMemo } from 'react';
import { Brain, Check, GraduationCap, Sparkles, User, Users, HeartHandshake, BookHeart, Award, ClipboardList, Puzzle, Smile, Lightbulb, AlertTriangle } from 'lucide-react';

import { useQuizCreator } from '@/contexts/QuizCreatorContext';
import type { QuizCreationState } from '@/contexts/QuizCreatorContext';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const quizTakerOptions = [
    { id: 'teen', icon: User, title: 'Tiener (voor zichzelf)', description: 'Jongere doet de quiz over zichzelf.', tags: ['Zelfrapportage', 'Empowerment'] },
    { id: 'parent', icon: Users, title: 'Ouder (over kind)', description: 'Ouder beantwoordt vragen over hun kind.', tags: ['Observatie', 'Familie Inzicht'] },
    { id: 'adult', icon: GraduationCap, title: 'Volwassene (18+)', description: 'Volwassene doet de quiz over zichzelf.', tags: ['Zelfstandig'] }
];

// This object now defines which age groups are valid for each audience type.
// This is the new single source of truth for this logic within this component.
const availableAgeGroupsForType: Record<NonNullable<QuizCreationState['audienceType']>, { id: NonNullable<QuizCreationState['targetAgeGroup']>, label: string }[]> = {
    teen: [
        { id: '12-14', label: '12-14 jaar' },
        { id: '15-18', label: '15-18 jaar' },
    ],
    parent: [
        // '6-11' is permanently removed from here.
        { id: '12-14', label: '12-14 jaar' },
        { id: '15-18', label: '15-18 jaar' },
    ],
    adult: [
        { id: '18+', label: '18+ jaar' },
        { id: 'all', label: 'Alle leeftijden' },
    ]
};


const focusOptions = [
    { id: 'general', icon: Sparkles, title: 'Algemeen', description: 'Voor alle jongeren, geen specifieke focus.', badge: "Basis" },
    { id: 'adhd-friendly', icon: Brain, title: 'ADHD-Vriendelijk', description: 'Kortere vragen, meer visuals, pauze-opties.', badge: "Populair" },
    { id: 'autism-friendly', icon: Brain, title: 'Autisme-Vriendelijk', description: 'Duidelijke instructies, voorspelbare structuur.', badge: "Combineert goed" },
    { id: 'hsp-friendly', icon: HeartHandshake, title: 'HSP-Vriendelijk', description: 'Rekening houdend met prikkelgevoeligheid.', badge: "Populair" },
    { id: 'dyslexia-friendly', icon: BookHeart, title: 'Dyslexie-Vriendelijk', description: 'Opties voor voorlezen, minder tekst-zwaar.' },
    { id: 'giftedness-focus', icon: Award, title: 'Hoogbegaafdheid Focus', description: 'Uitdagende vragen, minder herhaling.' },
    { id: 'executive-functions-focus', icon: ClipboardList, title: 'Executieve Functies Focus', description: 'Gericht op planning, organisatie en zelfregulatie.', badge: "Kernvaardigheid" },
    { id: 'sensory-processing-focus', icon: Puzzle, title: 'Sensorische Verwerking Focus', description: 'Aandacht voor sensorische voorkeuren.', badge: "Combineert goed" },
    { id: 'emotion-regulation-focus', icon: Smile, title: 'Emotieregulatie Focus', description: 'Gericht op herkennen en omgaan met emoties.', badge: "Populair" },
];

const focusLogic: Record<string, { suggests?: string[], conflicts?: string[] }> = {
    'general': {
        conflicts: ['adhd-friendly', 'autism-friendly', 'hsp-friendly', 'dyslexia-friendly', 'giftedness-focus', 'executive-functions-focus', 'sensory-processing-focus', 'emotion-regulation-focus']
    },
    'adhd-friendly': {
        suggests: ['executive-functions-focus']
    },
    'autism-friendly': {
        suggests: ['sensory-processing-focus']
    },
    'hsp-friendly': {
        suggests: ['sensory-processing-focus', 'emotion-regulation-focus']
    },
    'executive-functions-focus': {
        suggests: ['adhd-friendly']
    }
};

export const Step2Audience = () => {
    const { quizData, setQuizData } = useQuizCreator();
    const selectedFlags = quizData.focusFlags || [];

    const handleSelectAudienceType = (type: NonNullable<QuizCreationState['audienceType']>) => {
        setQuizData(prev => ({
            ...prev,
            audienceType: type,
            targetAgeGroup: undefined, 
        }));
    };

    const handleSelectAgeGroup = (ageGroupId: NonNullable<QuizCreationState['targetAgeGroup']>) => {
        setQuizData(prev => ({ ...prev, targetAgeGroup: ageGroupId }));
    };

    const handleToggleFocusFlag = (flagId: NonNullable<QuizCreationState['focusFlags']>[number]) => {
        setQuizData(prev => {
            const currentFlags = prev.focusFlags || [];
            const newFlags = currentFlags.includes(flagId)
                ? currentFlags.filter(f => f !== flagId)
                : [...currentFlags, flagId];
            return { ...prev, focusFlags: newFlags };
        });
    };

    const handleAddSuggestion = (flagId: string) => {
        setQuizData(prev => {
            const currentFlags = prev.focusFlags || [];
            if (!currentFlags.includes(flagId as any)) {
                return { ...prev, focusFlags: [...currentFlags, flagId as any] };
            }
            return prev;
        });
    };

    const availableAgeGroups = quizData.audienceType ? availableAgeGroupsForType[quizData.audienceType] : [];

    const hasGeneralConflict = selectedFlags.includes('general') && selectedFlags.length > 1;

    const suggestions = useMemo(() => {
        const newSuggestions = new Set<string>();
        selectedFlags.forEach(selected => {
            focusLogic[selected]?.suggests?.forEach(sugg => newSuggestions.add(sugg));
        });
        return Array.from(newSuggestions);
    }, [selectedFlags]);

    return (
        <TooltipProvider>
            <div>
                <h2 className="text-2xl font-semibold mb-2">Doelgroep Selectie</h2>
                <p className="text-muted-foreground mb-6">Voor wie is deze quiz bedoeld? Deze keuzes bepalen de toon en inhoud.</p>

                <div className="space-y-8">
                    <section>
                        <h3 className="text-lg font-medium text-foreground mb-3">1. Wie vult de quiz in?</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            {quizTakerOptions.map(({ id, icon: Icon, title, description, tags }) => (
                                <Card
                                    key={id}
                                    id={`audience-type-${id}`}
                                    className={cn(
                                        "p-4 cursor-pointer transition-all border-2 flex flex-col",
                                        quizData.audienceType === id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                                    )}
                                    onClick={() => handleSelectAudienceType(id as NonNullable<QuizCreationState['audienceType']>)}
                                >
                                    <Icon className="h-8 w-8 mb-3 text-primary" />
                                    <h4 className="font-semibold text-md mb-1">{title}</h4>
                                    <p className="text-sm text-muted-foreground mb-3 flex-grow">{description}</p>
                                    <div className="flex flex-wrap gap-1 mt-auto">
                                        {tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {quizData.audienceType && (
                        <section>
                            <h3 className="text-lg font-medium text-foreground mb-3">2. Selecteer de leeftijdsgroep {quizData.audienceType === 'parent' ? "van het kind" : ""}*</h3>
                            <div className="flex flex-wrap gap-3">
                                {availableAgeGroups.map(ageOpt => (
                                    <Button
                                        key={ageOpt.id}
                                        id={`age-group-${ageOpt.id}`}
                                        variant={quizData.targetAgeGroup === ageOpt.id ? 'default' : 'outline'}
                                        onClick={() => handleSelectAgeGroup(ageOpt.id)}
                                        className="rounded-full px-4 py-2 text-sm h-auto"
                                    >
                                        {quizData.targetAgeGroup === ageOpt.id && <Check className="mr-2 h-4 w-4" />}
                                        {ageOpt.label}
                                    </Button>
                                ))}
                            </div>
                        </section>
                    )}

                    {quizData.creationType !== 'adaptive' && (
                        <section>
                            <h3 className="text-lg font-medium text-foreground mb-3">3. Specifieke Focus (optioneel, meerdere keuzes mogelijk)</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                {focusOptions.map(({ id, icon: Icon, title, description, badge }) => {
                                    const isSelected = selectedFlags.includes(id as any);
                                    const isSuggested = suggestions.includes(id) && !isSelected;
                                    const isConflicting = hasGeneralConflict && id === 'general';

                                    return (
                                        <Tooltip key={id} delayDuration={300}>
                                            <TooltipTrigger asChild>
                                                <Card
                                                    id={`focus-flag-${id}`}
                                                    className={cn(
                                                        "p-4 cursor-pointer transition-all border-2 flex flex-col relative",
                                                        isSelected && 'border-primary bg-primary/5 ring-2 ring-primary/20',
                                                        !isSelected && 'hover:border-primary/50',
                                                        isSuggested && 'border-dashed border-teal-500 bg-teal-50',
                                                        isConflicting && 'border-destructive bg-red-50 ring-2 ring-destructive/20'
                                                    )}
                                                    onClick={() => handleToggleFocusFlag(id as any)}
                                                >
                                                    {isSelected && !isConflicting && <div className="absolute top-2 right-2 h-5 w-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center"><Check className="h-4 w-4"/></div>}
                                                    {isConflicting && <AlertTriangle className="absolute top-2 left-2 h-5 w-5 text-destructive" />}

                                                    <Icon className="h-8 w-8 mb-3 text-primary" />
                                                    <h4 className="font-semibold text-md mb-1">{title}</h4>
                                                    {badge && <Badge variant="secondary" className="mb-2 text-xs w-fit">{badge}</Badge>}
                                                    <p className="text-sm text-muted-foreground flex-grow">{description}</p>
                                                    
                                                    {isSuggested && (
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            className="mt-3 bg-teal-500 hover:bg-teal-600 text-white"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleAddSuggestion(id);
                                                            }}
                                                        >
                                                            <Lightbulb className="mr-2 h-4 w-4"/> Voeg Suggestie Toe
                                                        </Button>
                                                    )}
                                                </Card>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{description}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    )
                                })}
                            </div>
                        </section>
                    )}
                    
                    {hasGeneralConflict && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Conflicterende Selecties</AlertTitle>
                            <AlertDescription>
                              Je hebt "Algemeen" geselecteerd samen met een of meerdere specifieke focusgebieden. Dit kan leiden tot een onduidelijke of onlogische quiz. Deselecteer "Algemeen" om specifieke focusgebieden te gebruiken.
                            </AlertDescription>
                        </Alert>
                    )}

                </div>
            </div>
        </TooltipProvider>
    );
};
