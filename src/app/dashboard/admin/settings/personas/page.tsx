// src/app/dashboard/admin/settings/personas/page.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, PlusCircle, Edit, Trash2 } from '@/lib/icons';
import { aiPersonas, type AiPersona } from '@/ai/personas';

export default function AiPersonasPage() {
  const [personas, setPersonas] = useState<AiPersona[]>(aiPersonas);

  // In a real app, you would have functions to handle add, edit, delete
  // const handleAddPersona = () => { ... };
  // const handleEditPersona = (id: string) => { ... };
  // const handleDeletePersona = (id: string) => { ... };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Bot className="h-8 w-8 text-primary" />
            AI Persona Beheer
          </h1>
          <p className="text-muted-foreground">
            Beheer hier de verschillende AI-persoonlijkheden die op het platform worden gebruikt.
          </p>
        </div>
        <Button disabled>
            <PlusCircle className="mr-2 h-4 w-4" /> Nieuwe Persona (binnenkort)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {personas.map((persona) => (
          <Card key={persona.id} className="shadow-lg flex flex-col">
            <CardHeader>
              <CardTitle>{persona.name}</CardTitle>
              <CardDescription>ID: <code className="text-xs bg-muted px-1 py-0.5 rounded-sm">{persona.id}</code></CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground italic">"{persona.description}"</p>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  <Edit className="mr-2 h-4 w-4" /> Bewerken
                </Button>
                 <Button variant="destructive" size="sm" disabled>
                  <Trash2 className="mr-2 h-4 w-4" /> Verwijderen
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
