'use client';
import { useQuizCreator } from '@/contexts/QuizCreatorContext';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export const WizardStepper = () => {
  const { currentStep, completedSteps, setCurrentStep } = useQuizCreator();
  const steps = [
    { number: 1, name: "1. Quiz Type" },
    { number: 2, name: "2. Doelgroep" },
    { number: 3, name: "3. Content" },
    { number: 4, name: "4. Instellingen" },
    { number: 5, name: "5. Preview & Publiceer" },
  ];

  return (
    <div className="flex border-b border-border bg-muted/30 rounded-t-lg">
      {steps.map((step) => {
        const isCompleted = completedSteps[step.number] || step.number < currentStep;
        const isActive = step.number === currentStep;
        const canNavigateTo = isCompleted && !isActive;

        return (
          <button
            key={step.number}
            onClick={() => {
              if (canNavigateTo) {
                setCurrentStep(step.number);
              }
            }}
            disabled={!isCompleted && !isActive}
            className={cn(
              "flex-1 py-4 px-2 text-center text-sm font-medium border-b-4 transition-colors",
              isActive ? "border-primary text-primary" : "border-transparent text-muted-foreground",
              canNavigateTo ? "hover:bg-muted" : "",
              !isCompleted && !isActive ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            )}
          >
            <div className="flex items-center justify-center gap-2">
                <div className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-xs shrink-0",
                    isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/30 text-muted-foreground',
                    isActive && 'bg-primary text-primary-foreground ring-2 ring-primary/50 ring-offset-2'
                )}>
                   {isCompleted ? <Check className="h-3 w-3"/> : step.number}
                </div>
                <span className="hidden md:inline">{step.name.split('. ')[1]}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
