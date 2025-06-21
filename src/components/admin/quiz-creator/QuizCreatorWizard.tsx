'use client';
import { useQuizCreator } from '@/contexts/QuizCreatorContext';
import { WizardStepper } from './WizardStepper';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Rocket } from 'lucide-react';
import { Step1QuizType } from './steps/Step1_QuizType';
import { Step2Audience } from './steps/Step2_Audience';
import { Step3Content } from './steps/Step3_Content';
import { Step4_Settings } from './steps/Step4_Settings';
import { Step5_Preview } from './steps/Step5_Preview'; // <-- Import Step 5

export const QuizCreatorWizard = () => {
  const { currentStep, setCurrentStep, completedSteps, setCompletedStep, quizData } = useQuizCreator();
  const TOTAL_STEPS = 5;

  const nextStep = () => {
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
        if (!quizData.mainCategory || !quizData.title || (quizData.title.length < 5) || !quizData.description || (quizData.description.length < 10)) return true;
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
            <Button onClick={nextStep} disabled={isNextDisabled()}>
              Volgende <ArrowRight className="ml-2 h-4 w-4" />
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
