'use client';
import { useQuizCreator } from '@/contexts/QuizCreatorContext';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { User, Users, GraduationCap, Sparkles, Brain, Check } from 'lucide-react';
import type { QuizCreationState } from '@/contexts/QuizCreatorContext';
import { Badge } from '@/components/ui/badge';
import React from 'react';
import { Button } from '@/components/ui/button';

const quizTakerOptions = [
    { id: 'teen', icon: User, title: 'Tiener (voor zichzelf)', description: 'Jongere doet de quiz over zichzelf.', tags: ['Zelfrapportage', 'Empowerment'] },
    { id: 'parent', icon: Users, title: 'Ouder (over kind)', description: 'Ouder beantwoordt vragen over hun kind.', tags: ['Observatie', 'Familie Inzicht'] },
    { id: 'adult', icon: GraduationCap, title: 'Volwassene (18+)', description: 'Volwassene doet de quiz over zichzelf.', tags: ['Zelfstandig'] }
];

const ageGroupOptions: Record<NonNullable<QuizCreationState['audienceType']>, { id: NonNullable<QuizCreationState['targetAgeGroup']>, label: string }[]> = {
    teen: [
        { id: '12-14', label: '12-14 jaar' },
        { id: '15-18', label: '15-18 jaar' },
    ],
    parent: [
        { id: '6-11', label: '6-11 jaar' },
        { id: '12-14', label: '12-14 jaar' },
        { id: '15-18', label: '15-18 jaar' },
    ],
    adult: [
        { id: '18+', label: '18+ jaar' },
        { id: 'all', label: 'Alle leeftijden' },
    ]
};

const focusOptions = [
    { id: 'general', icon: Sparkles, title: 'Algemeen', description: 'Voor alle jongeren, geen specifieke focus.' },
    { id: 'adhd-friendly', icon: Brain, title: 'ADHD-Vriendelijk', description: 'Kortere vragen, meer visuals, pauze-opties.' },
    { id: 'autism-friendly', icon: Brain, title: 'Autisme-Vriendelijk', description: 'Duidelijke instructies, voorspelbare structuur.' }
]

export const Step2Audience = () => {
    const { quizData, setQuizData } = useQuizCreator();

    const handleSelectAudienceType = (type: NonNullable<QuizCreationState['audienceType']>) => {
        setQuizData(prev => ({
            ...prev,
            audienceType: type,
            targetAgeGroup: undefined, // Reset age group when type changes
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

    const availableAgeGroups = quizData.audienceType ? ageGroupOptions[quizData.audienceType] : [];

    return (
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

                <section>
                    <h3 className="text-lg font-medium text-foreground mb-3">3. Specifieke Focus (optioneel)</h3>
                     <div className="grid md:grid-cols-3 gap-4">
                        {focusOptions.map(({ id, icon: Icon, title, description }) => (
                            <Card
                                key={id}
                                className={cn(
                                    "p-4 cursor-pointer transition-all border-2 flex flex-col",
                                    quizData.focusFlags?.includes(id as any) ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                                )}
                                onClick={() => handleToggleFocusFlag(id as any)}
                            >
                                <Icon className="h-8 w-8 mb-3 text-primary" />
                                <h4 className="font-semibold text-md mb-1">{title}</h4>
                                <p className="text-sm text-muted-foreground flex-grow">{description}</p>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};