'use client';
import { useQuizCreator } from '@/contexts/QuizCreatorContext';
import { WizardStepper } from './WizardStepper';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Rocket } from 'lucide-react';
import { Step1QuizType } from './steps/Step1_QuizType';
// Import other steps here as they are created
// import { Step2Audience } from './steps/Step2_Audience'; 

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
    if (currentStep === 1 && !quizData.creationType) {
      return true;
    }
    if (quizData.creationType === 'template' && !quizData.selectedTemplateId) {
        return true;
    }
    // TODO: Add more validation for other steps as they are built
    return false;
  };
  
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return <Step1QuizType />;
      // case 2:
      //   return <Step2Audience />;
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
        <span className="text-sm text-muted-foreground">Stap {currentStep} van {TOTAL_STEPS}</span>
        <div className="flex gap-2">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Vorige
          </Button>
          {currentStep < TOTAL_STEPS ? (
            <Button onClick={nextStep} disabled={isNextDisabled()}>
              Volgende <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button>
              <Rocket className="mr-2 h-4 w-4" /> Publiceren
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
