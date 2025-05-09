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
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container flex flex-col items-center text-center">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Probeer een voorbeeldvraag
        </h2>
        <Card className="w-full max-w-xl shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">{sampleQuestion.text}</CardTitle>
            <CardDescription>
              Dit is een voorbeeld van hoe een vraag eruit ziet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup className="space-y-3">
              {sampleQuestion.options.map((option) => (
                <Label
                  key={option.id}
                  htmlFor={option.id}
                  className="flex items-center space-x-3 rounded-md border p-4 cursor-pointer transition-colors hover:bg-muted/50"
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <span>{option.text}</span>
                </Label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
        <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow">
          <Link href="/quiz/teen-neurodiversity-quiz">Probeer nu gratis de Tienerquiz</Link>
        </Button>
      </div>
    </section>
  );
}
