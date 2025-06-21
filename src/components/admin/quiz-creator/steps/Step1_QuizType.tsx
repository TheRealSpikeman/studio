'use client';
import { useQuizCreator } from '@/contexts/QuizCreatorContext';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FileText, Wand2, Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// I'll define templates directly here for now.
const popularTemplates = [
    { id: 'leer-superpower', title: 'Leer-Superpower', description: 'Ontdek hoe jongeren het beste leren: visueel, auditief, kinesthetisch of tekstueel.', stats: "📊 8 vragen - ⏱️ 5 min - 🎯 12-18 jaar", badge: "Populair"},
    { id: 'stress-management', title: 'Stress Management', description: 'Ontdek persoonlijke strategieën om met stress en druk om te gaan.', stats: "📊 10 vragen - ⏱️ 7 min - 🎯 15-18 jaar", badge: "Nieuw"},
    { id: 'ouder-observatie', title: 'Ken Je Kind', description: 'Help ouders hun kind beter begrijpen door observaties.', stats: "📊 12 vragen - ⏱️ 10 min - 🎯 Ouders", badge: "Voor Ouders"},
];

export const Step1QuizType = () => {
    const { quizData, setQuizData, setCompletedStep, setCurrentStep } = useQuizCreator();

    const handleSelectQuizType = (type: 'template' | 'scratch' | 'ai') => {
        setQuizData(prev => ({ ...prev, creationType: type, selectedTemplateId: undefined }));
    };

    const handleSelectTemplate = (templateId: string) => {
        setQuizData(prev => ({...prev, selectedTemplateId: templateId }));
        setCompletedStep(1, true);
        setTimeout(() => setCurrentStep(2), 300);
    }
    
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-2">Kies je Quiz Type</h2>
            <p className="text-muted-foreground mb-6">Start met een template, vanaf nul, of laat AI je helpen.</p>
            
            <div className="grid md:grid-cols-3 gap-6">
                <Card 
                    className={cn(
                        "p-6 text-center cursor-pointer transition-all border-2",
                        quizData.creationType === 'scratch' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                    )}
                    onClick={() => handleSelectQuizType('scratch')}
                >
                    <FileText className="h-10 w-10 mx-auto mb-3 text-primary"/>
                    <h3 className="font-semibold text-lg">Helemaal Nieuw</h3>
                    <p className="text-sm text-muted-foreground">Maak een quiz vanaf een leeg canvas.</p>
                </Card>
                <Card 
                    className={cn(
                        "p-6 text-center cursor-pointer transition-all border-2",
                        quizData.creationType === 'template' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                    )}
                    onClick={() => handleSelectQuizType('template')}
                >
                    <Wand2 className="h-10 w-10 mx-auto mb-3 text-primary"/>
                    <h3 className="font-semibold text-lg">Template Gebruiken</h3>
                    <p className="text-sm text-muted-foreground">Start met een bestaande, beproefde quiz.</p>
                </Card>
                <Card 
                    className={cn(
                        "p-6 text-center cursor-pointer transition-all border-2",
                        quizData.creationType === 'ai' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                    )}
                    onClick={() => handleSelectQuizType('ai')}
                >
                    <Bot className="h-10 w-10 mx-auto mb-3 text-primary"/>
                    <h3 className="font-semibold text-lg">AI Quiz Generator</h3>
                    <p className="text-sm text-muted-foreground">Laat AI een conceptquiz voor je maken.</p>
                </Card>
            </div>

            {quizData.creationType === 'template' && (
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Populaire Templates</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {popularTemplates.map(template => (
                             <Card 
                                key={template.id}
                                className={cn(
                                    "p-4 cursor-pointer hover:shadow-md transition-shadow flex flex-col border-2",
                                    quizData.selectedTemplateId === template.id ? 'border-primary bg-primary/5' : ''
                                )}
                                onClick={() => handleSelectTemplate(template.id)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold">{template.title}</h4>
                                    {template.badge && <Badge variant="secondary" className="text-xs">{template.badge}</Badge>}
                                </div>
                                <p className="text-xs text-muted-foreground mb-2 flex-grow">{template.description}</p>
                                <p className="text-xs text-primary font-medium">{template.stats}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
