import { Progress } from '@/components/ui/progress';

interface QuizProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepNames: string[]; // e.g., ["Basisvragen", "Subquiz", "Resultaten"]
}

export function QuizProgressBar({ currentStep, totalSteps, stepNames }: QuizProgressBarProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-sm text-muted-foreground mb-2">
        {stepNames.map((name, index) => (
          <div
            key={index}
            className={`flex-1 text-center ${
              index + 1 < currentStep ? 'font-semibold text-primary' : ''
            } ${index + 1 === currentStep ? 'font-bold text-primary' : ''} ${
              index + 1 > currentStep ? 'text-muted-foreground' : ''
            }`}
          >
            Stap {index + 1}: {name}
          </div>
        ))}
      </div>
      <Progress value={progressPercentage} aria-label={`Quiz voortgang: stap ${currentStep} van ${totalSteps}`} />
    </div>
  );
}
