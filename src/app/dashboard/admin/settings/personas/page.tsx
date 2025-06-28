// src/app/dashboard/admin/settings/personas/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Linkedin, ExternalLink, PlusCircle, Edit } from 'lucide-react';
import { initialAiPersonas, type AiPersona } from '@/ai/personas';
import { PersonaFormDialog, type PersonaFormData } from '@/components/admin/settings/PersonaFormDialog';
import { useToast } from '@/hooks/use-toast';

const LOCAL_STORAGE_KEY = 'mindnavigator_ai_personas_v1';

export default function AiPersonaManagementPage() {
  const [personas, setPersonas] = useState<AiPersona[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPersona, setEditingPersona] = useState<AiPersona | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedPersonasRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedPersonasRaw) {
        setPersonas(JSON.parse(storedPersonasRaw));
      } else {
        setPersonas(initialAiPersonas);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialAiPersonas));
      }
    } catch (error) {
      console.error("Error loading personas from localStorage, falling back to initial data.", error);
      setPersonas(initialAiPersonas);
    }
    setIsLoading(false);
  }, []);

  const handleOpenDialog = (persona: AiPersona | null) => {
    setEditingPersona(persona);
    setIsDialogOpen(true);
  };

  const handleSavePersona = (data: PersonaFormData) => {
    let updatedPersonas: AiPersona[];
    
    if (editingPersona) { // Editing existing persona
      updatedPersonas = personas.map(p => (p.id === editingPersona.id ? { ...p, ...data } : p));
      toast({ title: "Persona bijgewerkt", description: `De gegevens voor "${data.name}" zijn opgeslagen.` });
    } else { // Adding new persona
      if (personas.some(p => p.id === data.id)) {
        toast({ title: "ID bestaat al", description: "Kies een uniek ID voor de nieuwe persona.", variant: "destructive" });
        return;
      }
      updatedPersonas = [...personas, { ...data }];
      toast({ title: "Persona aangemaakt", description: `"${data.name}" is succesvol toegevoegd.` });
    }

    setPersonas(updatedPersonas);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedPersonas));
    setIsDialogOpen(false);
    setEditingPersona(null);
  };


  if (isLoading) {
    return <div>Personas laden...</div>
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Bot className="h-8 w-8 text-primary" />
              AI Persona Beheer
            </h1>
            <p className="text-muted-foreground">
              Een overzicht van alle AI persona's die gebruikt worden voor content creatie en interactie.
            </p>
          </div>
          <Button onClick={() => handleOpenDialog(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Nieuwe Persona
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {personas.map((persona: AiPersona) => (
              <Card key={persona.id} className="shadow-lg overflow-hidden flex flex-col">
                  <CardHeader>
                      <div className="flex items-start gap-4">
                          <div className="relative h-20 w-20 rounded-full overflow-hidden flex-shrink-0">
                              <Image
                                  src={persona.imageUrl}
                                  alt={`Foto van ${persona.name}`}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                  data-ai-hint={persona.imageHint}
                              />
                          </div>
                          <div>
                              <CardTitle className="text-xl font-bold text-primary">{persona.name}</CardTitle>
                              <CardDescription className="font-semibold text-muted-foreground">{persona.title}</CardDescription>
                          </div>
                      </div>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm flex-grow">
                      <div>
                          <h4 className="font-semibold text-foreground mb-1">Biografie</h4>
                          <p className="text-muted-foreground leading-relaxed">{persona.bio}</p>
                      </div>
                      <div>
                          <h4 className="font-semibold text-foreground mb-1">Bijdrage aan Platform</h4>
                          <p className="text-muted-foreground leading-relaxed">{persona.contribution}</p>
                      </div>
                      <div>
                          <h4 className="font-semibold text-foreground mb-1">AI Prompt Instructie</h4>
                          <blockquote className="border-l-2 border-primary/30 pl-3 italic text-xs text-muted-foreground">
                              "{persona.description}"
                          </blockquote>
                      </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 p-3 flex justify-between items-center mt-auto">
                      <div className="flex items-center gap-3">
                          {persona.linkedinUrl && (
                              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-primary h-auto p-1">
                                  <Link href={persona.linkedinUrl} target="_blank" rel="noopener noreferrer"><Linkedin className="mr-1.5 h-4 w-4" /> LinkedIn</Link>
                              </Button>
                          )}
                          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-primary h-auto p-1">
                              <Link href="#" target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-1.5 h-4 w-4" /> Website</Link>
                          </Button>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog(persona)}>
                          <Edit className="mr-2 h-4 w-4" /> Bewerken
                      </Button>
                  </CardFooter>
              </Card>
          ))}
        </div>
      </div>
      
      <PersonaFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        persona={editingPersona}
        onSave={handleSavePersona}
      />
    </>
  );
}
