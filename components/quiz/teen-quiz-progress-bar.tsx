// src/components/quiz/teen-quiz-progress-bar.tsx
"use client";

import { cn } from "@/lib/utils";
import { Check } from 'lucide-react';

interface TeenQuizProgressBarProps {
  currentStep: number;
  stepNames: string[];
  progressWithinStep?: number;
}

export function TeenQuizProgressBar({
  currentStep,
  stepNames,
  progressWithinStep = 0,
}: TeenQuizProgressBarProps) {
  if (stepNames.length !== 3) {
    return null;
  }

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'active';
    return 'upcoming';
  };

  const Step = ({ stepNumber, label }: { stepNumber: number; label: string }) => {
    const status = getStepStatus(stepNumber);
    return (
      <div className="flex flex-col items-center gap-1.5 z-10">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-all duration-300 bg-background",
            status === 'completed' && "border-primary bg-primary text-primary-foreground",
            status === 'active' && "border-primary text-primary font-bold scale-110 shadow-lg",
            status === 'upcoming' && "border-border text-muted-foreground bg-card"
          )}
        >
          {status === 'completed' ? <Check className="h-4 w-4" /> : stepNumber}
        </div>
        <span
          className={cn(
            "text-xs font-medium transition-colors duration-300 text-center",
            status === 'active' ? "text-primary" : "text-muted-foreground"
          )}
        >
          {label}
        </span>
      </div>
    );
  };
  
  const progressPercent =
    currentStep === 1
      ? (progressWithinStep / 100) * 50
      : currentStep === 2
      ? 50 + (progressWithinStep / 100) * 50
      : currentStep >= 3
      ? 100
      : 0;

  return (
    <div className="w-full max-w-xs mx-auto mb-8 mt-4">
      <div className="relative">
        <div className="flex justify-between items-start">
            <Step stepNumber={1} label={stepNames[0]} />
            <Step stepNumber={2} label={stepNames[1]} />
            <Step stepNumber={3} label={stepNames[2]} />
        </div>
        
        <div className="absolute top-0 left-0 right-0 h-8 flex items-center -z-10 px-8">
            <div className="w-full h-px bg-muted rounded-full">
                 <div
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>
        </div>
      </div>
    </div>
  );
}
