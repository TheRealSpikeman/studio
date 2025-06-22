'use client';
import { useQuizCreator } from '@/contexts/QuizCreatorContext';
import { WizardStepper } from './WizardStepper';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Rocket, Loader2 } from 'lucide-react';
import { Step1QuizType } from './steps/Step1_QuizType';
import { Step2Audience } from './steps/Step2_Audience';
import { Step3Content } from './steps/Step3_Content';
import { Step4_Settings } from './steps/Step4_Settings';
import { Step5_Preview } from './steps/Step5_Preview';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateAiQuiz } from '@/ai/flows/generate-ai-quiz-flow';
import type { QuizAudience } from '@/types/quiz-admin';

export const QuizCreatorWizard = () => {
  const { currentStep, setCurrentStep, completedSteps, setCompletedStep, quizData, setQuizData } = useQuizCreator();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const TOTAL_STEPS = 5;

  const nextStep = async () => {
    // If moving from step 3 and type is AI or adaptive, generate questions
    if (currentStep === 3 && (quizData.creationType === 'ai' || quizData.creationType === 'adaptive')) {
      setIsGenerating(true);
      toast({ title: "AI is aan het werk...", description: "De quizvragen worden nu gegenereerd." });
      try {
        let topic: string;
        let numQuestions: number;
        let category: string;
        let quizPurpose: 'onboarding' | 'general' | 'deep_dive' | 'reflection' | 'goal_setting';
        
        if (quizData.creationType === 'adaptive') {
            topic = `Adaptieve Onboarding Quiz (${quizData.targetAgeGroup} jr)`;
            numQuestions = 18; // Default for Phase 1 of adaptive quiz
            category = 'Basis'; // Adaptive quiz is a base quiz
            quizPurpose = 'onboarding';
            // Also set it in the main state so it's available in the preview
            setQuizData(prev => ({
              ...prev,
              title: topic,
              description: `Een adaptieve quiz die zich aanpast aan de gebruiker om een eerste neurodiversiteitsprofiel op te stellen.`
            }));
        } else { // 'ai'
            topic = quizData.title!;
            const durationMap: Record<string, number> = {
              '2-3 minuten (2-3 vragen)': 3,
              '3-5 minuten (4-6 vragen)': 5,
              '5-8 minuten (7-10 vragen)': 8,
              '8-12 minuten (11-15 vragen)': 12,
            };
            numQuestions = durationMap[quizData.estimatedDuration || '5-8 minuten (7-10 vragen)'] || 8;
            category = quizData.mainCategory!;
            quizPurpose = quizData.resultType === 'personality-4-types' ? 'onboarding' : 'general';
        }

        let audience: QuizAudience;
        switch (quizData.audienceType) {
            case 'teen':
                audience = `Tiener (${quizData.targetAgeGroup} jr, voor zichzelf)`;
                break;
            case 'parent':
                audience = `Ouder (over kind ${quizData.targetAgeGroup} jr)`;
                break;
            case 'adult':
                if (quizData.targetAgeGroup === 'all') {
                    audience = 'Algemeen (alle leeftijden, voor zichzelf)';
                } else {
                    audience = `Volwassene (18+, voor zichzelf)`;
                }
                break;
            default:
                audience = 'Algemeen (alle leeftijden, voor zichzelf)';
        }

        const aiInput = {
          topic: topic,
          audience: audience,
          category: category,
          numQuestions: numQuestions,
          difficulty: quizData.difficulty || 'gemiddeld',
          quizPurpose: quizPurpose,
        };

        const result = await generateAiQuiz(aiInput);
        setQuizData(prev => ({...prev, questions: result.questions }));
        toast({ title: "Vragen gegenereerd!", description: `${result.questions.length} vragen zijn succesvol aangemaakt.` });
        
      } catch (error) {
        console.error("AI Quiz Generation Failed:", error);
        toast({ title: "Fout bij genereren", description: "Kon de AI vragen niet genereren. Probeer het opnieuw.", variant: "destructive" });
        setIsGenerating(false);
        return; // Don't proceed to next step if generation fails
      } finally {
        setIsGenerating(false);
      }
    }


    setCompletedStep(currentStep, true);
    setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const isNextDisabled = () => {
    switch (currentStep) {
      case 1:
        if (!quizData.creationType) return true;
        if (quizData.creationType === 'template' && !quizData.selectedTemplateId) return true;
        return false;
      case 2:
        if (!quizData.audienceType || !quizData.targetAgeGroup) return true;
        return false;
      case 3:
        if (quizData.creationType === 'adaptive') {
            return false;
        }
        if (!quizData.title || (quizData.title.length < 5) || !quizData.description || (quizData.description.length < 10)) return true;
        if (quizData.creationType === 'ai' && !quizData.mainCategory) return true;
        return false;
      default:
        // For steps 4 and 5, the button is enabled by default for now.
        return false;
    }
  };
  
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return <Step1QuizType />;
      case 2:
        return <Step2Audience />;
      case 3:
        return <Step3Content />;
      case 4:
        return <Step4_Settings />;
      case 5: // <-- Add case for Step 5
        return <Step5_Preview />;
      default:
        return <div className="p-8 text-center text-muted-foreground">Stap {currentStep} is in ontwikkeling.</div>;
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-md border">
      <WizardStepper />
      <div className="p-8 min-h-[500px]">
        {renderStepContent()}
      </div>
      <div className="flex justify-between items-center p-6 border-t bg-muted/30 rounded-b-lg">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Vorige
        </Button>
        <span className="text-sm text-muted-foreground">Stap {currentStep} van {TOTAL_STEPS} - {currentStep < 5 ? "Volgende stap: " + (currentStep + 1) : "Klaar voor publicatie!"}</span>
        <div className="flex gap-2">
          {currentStep < TOTAL_STEPS ? (
            <Button onClick={nextStep} disabled={isNextDisabled() || isGenerating}>
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {currentStep === 3 && (quizData.creationType === 'ai' || quizData.creationType === 'adaptive') ? (isGenerating ? 'Vragen genereren...' : 'Genereer & Ga Verder') : 'Volgende'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            // De publicatieknop zit nu in Step 5 zelf, dus hier tonen we niets.
            // Dit kan een disabled "Klaar" knop zijn indien gewenst.
            <div className="w-[107px]"></div> // Placeholder om layout gelijk te houden
          )}
        </div>
      </div>
    </div>
  );
};
