// src/components/quiz/teen-quiz-progress-bar.tsx
"use client";

import { cn } from "@/lib/utils";

interface TeenQuizProgressBarProps {
  currentStep: number; // 1, 2, or 3
  stepNames: string[]; // ["Basisvragen", "Verdieping", "Resultaten"]
}

export function TeenQuizProgressBar({ currentStep, stepNames }: TeenQuizProgressBarProps) {
  return (
    <div className="mb-12 mt-4 flex h-[70px] w-full items-start justify-between relative">
      {/* Background line */}
      <div className="absolute top-[14px] left-0 right-0 h-0.5 bg-muted z-0"></div>
      
      {/* Foreground line (completed part) */}
      <div
        className="absolute top-[14px] left-0 h-0.5 bg-primary z-[1] transition-all duration-300 ease-in-out"
        style={{ width: `${((currentStep -1) / (stepNames.length -1)) * 100}%` }}
      ></div>

      {stepNames.map((name, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={stepNumber} className="relative z-[2] flex flex-col items-center w-1/3">
            <div
              className={cn(
                "flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 bg-background text-sm font-medium",
                isCompleted ? "border-primary bg-primary text-primary-foreground" : "border-muted",
                isActive ? "border-primary text-primary font-bold" : "text-muted-foreground"
              )}
            >
              {stepNumber}
            </div>
            <div
              className={cn(
                "mt-1 text-center text-xs w-[80px] whitespace-nowrap",
                isCompleted ? "text-primary font-semibold" : "",
                isActive ? "text-primary font-bold" : "text-muted-foreground"
              )}
            >
              {name}
            </div>
          </div>
        );
      })}
    </div>
  );
}
