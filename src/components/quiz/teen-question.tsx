// src/components/quiz/teen-question.tsx
"use client";

import type { QuizOption } from "@/lib/quiz-data/teen-neurodiversity-quiz";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TeenQuestionProps {
  questionText: string;
  questionIndex: number; // 0-based index for unique ID generation
  options: QuizOption[];
  selectedValue: string | undefined;
  onValueChange: (value: string) => void;
}

export function TeenQuestion({
  questionText,
  questionIndex,
  options,
  selectedValue,
  onValueChange,
}: TeenQuestionProps) {
  const selectId = `teen-q-${questionIndex}`;

  return (
    <div className="mb-4 rounded-md border border-border p-4 shadow-sm hover:shadow-md transition-shadow">
      <Label htmlFor={selectId} className="mb-2 block text-base font-medium text-foreground">
        {questionIndex + 1}. {questionText}
      </Label>
      <Select value={selectedValue} onValueChange={onValueChange}>
        <SelectTrigger id={selectId} className="w-full text-base">
          <SelectValue placeholder="Kies een antwoord" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-base">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
