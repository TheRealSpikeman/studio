// src/components/dashboard/coaching/JournalSection.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { NotebookPen, ImageIcon, Mic } from '@/lib/icons';
import { storageService } from '@/services/storageService';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

interface JournalSectionProps {
  selectedDate: Date | undefined;
  onSave: (options: { title: string, description: string }) => void;
}

export const JournalSection = ({ selectedDate, onSave }: JournalSectionProps) => {
  const [journalText, setJournalText] = useState("");
  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;

  useEffect(() => {
    if (formattedDate) {
      const savedEntry = storageService.getJournalEntry(formattedDate);
      setJournalText(savedEntry || "");
    }
  }, [formattedDate]);

  const handleSave = useCallback(() => {
    if (formattedDate) {
      storageService.setJournalEntry(formattedDate, journalText);
      onSave({ 
        title: "Dagboek opgeslagen", 
        description: `Je reflectie voor ${format(new Date(formattedDate + 'T00:00:00'), 'PPP', { locale: nl })} is bewaard.` 
      });
    }
  }, [formattedDate, journalText, onSave]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <NotebookPen className="h-6 w-6 text-primary" />
          Dagboek Reflectie {selectedDate ? `voor ${format(selectedDate, 'PPP', { locale: nl })}` : ''}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea 
          placeholder="Hoe voel je je vandaag? Wat heb je geleerd? Waar ben je dankbaar voor?" 
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          rows={5}
          disabled={!selectedDate}
        />
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" disabled>
            <ImageIcon className="mr-2 h-4 w-4" /> Foto (binnenkort)
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Mic className="mr-2 h-4 w-4" /> Audio (binnenkort)
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className="w-full" disabled={!selectedDate}>Reflectie Opslaan</Button>
      </CardFooter>
    </Card>
  );
};
