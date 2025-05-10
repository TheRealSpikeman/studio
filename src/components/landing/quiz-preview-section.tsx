
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

const sampleQuestion = {
  id: 'sample-q1',
  text: 'Hoe voel je je meestal in sociale situaties?',
  options: [
    { id: 'sq-o1a', text: 'Energiek en spraakzaam' },
    { id: 'sq-o1b', text: 'Rustig en observerend' },
    { id: 'sq-o1c', text: 'Afhankelijk van de situatie' },
  ],
};

export function QuizPreviewSection() {
  const [selectedOptionText, setSelectedOptionText] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);

  const handleOptionChange = (value: string) => {
    setSelectedValue(value);
    const selectedOpt = sampleQuestion.options.find(opt => opt.id === value);
    setSelectedOptionText(selectedOpt ? `Jouw selectie: ${selectedOpt.text}` : null);
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto flex flex-col items-center text-center px-4">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Probeer een voorbeeldvraag
        </h2>
        <p className="mb-8 text-muted-foreground max-w-lg">
          Beantwoord één voorbeeldvraag om te zien hoe onze quiz werkt.
        </p>
        <Card className="w-full max-w-lg shadow-xl mb-6" aria-labelledby="sample-question-title" aria-describedby="sample-question-description">
          <CardHeader>
            <CardTitle id="sample-question-title" className="text-xl font-semibold">{sampleQuestion.text}</CardTitle>
            <CardDescription id="sample-question-description">
              Zo ziet een vraag eruit—kies wat het beste bij jou past. (Voorbeeldvraag van 12)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedValue} onValueChange={handleOptionChange} className="space-y-3" aria-label={sampleQuestion.text}>
              {sampleQuestion.options.map((option) => (
                <Label
                  key={option.id}
                  htmlFor={option.id}
                  className={`flex items-center space-x-3 rounded-md border p-4 cursor-pointer transition-colors 
                              hover:bg-primary/10 has-[input:checked]:border-primary has-[input:checked]:bg-primary/5 has-[input:checked]:ring-2 has-[input:checked]:ring-primary/30`}
                >
                  <RadioGroupItem value={option.id} id={option.id} aria-label={option.text} />
                  <span>{option.text}</span>
                </Label>
              ))}
            </RadioGroup>
            {selectedOptionText && (
              <p className="mt-4 text-sm text-primary font-medium animate-pulse">{selectedOptionText}</p>
            )}
            <p className="mt-4 text-xs text-muted-foreground">
              Ontdek hoe jij je verhoudt tot andere jongeren.
            </p>
          </CardContent>
        </Card>
        <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow">
          <Link href="/quizzes">Doe de volledige quiz gratis</Link>
        </Button>
      </div>
    </section>
  );
}

