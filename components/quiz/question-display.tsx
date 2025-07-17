"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "@/lib/icons";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface QuizOption {
  id: string;
  text: string;
  value: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
}

interface QuestionDisplayProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onNext: (selectedOptionValue: string) => void;
  onBack: () => void;
  isFirstQuestion: boolean;
}

export function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
  onNext,
  onBack,
  isFirstQuestion,
}: QuestionDisplayProps) {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);

  const handleNext = () => {
    if (selectedOption) {
      onNext(selectedOption);
      setSelectedOption(undefined); // Reset for next question
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">{question.text}</CardTitle>
        <CardDescription>
          Vraag {questionNumber} van {totalQuestions}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="space-y-3">
          {question.options.map((option) => (
            <Label
              key={option.id}
              htmlFor={option.id}
              className={cn(
                "flex items-center space-x-3 rounded-md border p-4 cursor-pointer transition-colors hover:bg-muted/50",
                selectedOption === option.value && "border-primary bg-primary/5 ring-1 ring-primary"
              )}
            >
              <RadioGroupItem value={option.value} id={option.id} />
              <span>{option.text}</span>
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {isFirstQuestion ? 'Terug naar intro' : 'Vorige'}
        </Button>
        <Button onClick={handleNext} disabled={!selectedOption}>
          Volgende
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
