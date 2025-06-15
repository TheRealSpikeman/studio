// src/app/dashboard/tutor/availability/page.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Removed Checkbox as we're using a full calendar for exceptions
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { ArrowLeft, Clock, Euro, Save, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
// Removed Popover components as Calendar will be directly visible
import { format } from 'date-fns'; // Removed addDays and startOfWeek as they are not directly used in the new logic
import { nl } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface TimeSlot {
  start: string;
  end: string;
}

interface WeeklyAvailability {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

const initialWeeklyAvailability: WeeklyAvailability = {
  monday: [{ start: '09:00', end: '17:00' }],
  tuesday: [{ start: '09:00', end: '17:00' }],
  wednesday: [],
  thursday: [{ start: '13:00', end: '18:00' }],
  friday: [],
  saturday: [],
  sunday: [],
};

const dayLabels: Record<keyof WeeklyAvailability, string> = {
  monday: 'Maandag',
  tuesday: 'Dinsdag',
  wednesday: 'Woensdag',
  thursday: 'Donderdag',
  friday: 'Vrijdag',
  saturday: 'Zaterdag',
  sunday: 'Zondag',
};

export default function TutorAvailabilityPage() {
  const { toast } = useToast();
  const [hourlyRate, setHourlyRate] = useState<number | string>(25);
  const [weeklyAvailability, setWeeklyAvailability] = useState<WeeklyAvailability>(initialWeeklyAvailability);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  // Removed selectedDateForException as the calendar now handles multiple selections directly

  const handleTimeSlotChange = (day: keyof WeeklyAvailability, index: number, field: 'start' | 'end', value: string) => {
    setWeeklyAvailability(prev => {
      const newDaySlots = [...prev[day]];
      newDaySlots[index] = { ...newDaySlots[index], [field]: value };
      return { ...prev, [day]: newDaySlots };
    });
  };

  const addTimeSlot = (day: keyof WeeklyAvailability) => {
    setWeeklyAvailability(prev => ({
      ...prev,
      [day]: [...prev[day], { start: '09:00', end: '17:00' }]
    }));
  };

  const removeTimeSlot = (day: keyof WeeklyAvailability, index: number) => {
    setWeeklyAvailability(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };
  
  const handleToggleUnavailableDate = (date: Date) => {
    // date-fns startOfDay might be useful here if timezones become an issue
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    setUnavailableDates(prev => {
      const isAlreadySelected = prev.some(d => d.getTime() === dateOnly.getTime());
      if (isAlreadySelected) {
        return prev.filter(d => d.getTime() !== dateOnly.getTime());
      } else {
        return [...prev, dateOnly];
      }
    });
  };


  const handleSaveAvailability = () => {
    // TODO: Implement actual save logic to backend
    console.log("Saving availability:", { hourlyRate, weeklyAvailability, unavailableDates });
    toast({
      title: "Beschikbaarheid Opgeslagen",
      description: "Je uurtarief en beschikbaarheid zijn bijgewerkt (simulatie).",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Clock className="h-8 w-8 text-primary" />
          Mijn Beschikbaarheid & Tarief
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/tutor">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Tutor Dashboard
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Euro className="h-5 w-5 text-primary"/>Standaard Uurtarief</CardTitle>
          <CardDescription>Stel hier je standaard uurtarief in. Dit wordt getoond aan leerlingen.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs">
            <Label htmlFor="hourlyRate">Uurtarief (EUR)</Label>
            <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                <Input 
                    id="hourlyRate" 
                    type="number" 
                    min="10" 
                    value={hourlyRate} 
                    onChange={(e) => setHourlyRate(e.target.value ? parseFloat(e.target.value) : '')} 
                    className="pl-7"
                />
            </div>
             <p className="text-xs text-muted-foreground mt-1">MindNavigator rekent 10% servicekosten over dit tarief.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wekelijkse Beschikbaarheid</CardTitle>
          <CardDescription>Stel je reguliere wekelijkse beschikbaarheid in. Leerlingen kunnen binnen deze tijden sessies boeken.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {(Object.keys(weeklyAvailability) as Array<keyof WeeklyAvailability>).map((day) => (
            <div key={day} className="p-4 border rounded-md">
              <Label className="text-md font-semibold">{dayLabels[day]}</Label>
              {weeklyAvailability[day].length === 0 && (
                <p className="text-sm text-muted-foreground mt-1">Niet beschikbaar op {dayLabels[day].toLowerCase()}.</p>
              )}
              {weeklyAvailability[day].map((slot, index) => (
                <div key={index} className="flex items-center gap-2 mt-2">
                  <Input type="time" value={slot.start} onChange={(e) => handleTimeSlotChange(day, index, 'start', e.target.value)} className="w-1/3"/>
                  <span>-</span>
                  <Input type="time" value={slot.end} onChange={(e) => handleTimeSlotChange(day, index, 'end', e.target.value)} className="w-1/3"/>
                  <Button variant="ghost" size="icon" onClick={() => removeTimeSlot(day, index)} aria-label="Verwijder tijdslot">
                    <XCircle className="h-5 w-5 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addTimeSlot(day)} className="mt-3">
                Tijdslot Toevoegen
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Uitzonderingen & Niet Beschikbaar</CardTitle>
            <CardDescription>Markeer specifieke datums waarop je niet beschikbaar bent, ondanks je wekelijkse schema.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
                <Calendar
                    mode="multiple" // Allow multiple dates to be selected
                    selected={unavailableDates}
                    onSelect={(dates) => setUnavailableDates(dates || [])} // Update state with array of selected dates
                    locale={nl}
                    className="rounded-md border self-start shadow-sm"
                    disabled={{ before: new Date() }} // Optionally disable past dates
                />
                <div className="flex-1">
                    <h4 className="font-semibold mb-2">Geselecteerde niet-beschikbare datums:</h4>
                    {unavailableDates.length > 0 ? (
                        <ul className="list-disc list-inside text-sm space-y-1 bg-muted p-3 rounded-md max-h-60 overflow-y-auto">
                            {unavailableDates
                              .sort((a,b) => a.getTime() - b.getTime()) // Sort dates for consistent display
                              .map(date => (
                                <li key={date.toISOString()} className="flex justify-between items-center py-0.5">
                                    {format(date, 'PPP', { locale: nl })}
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-6 w-6" 
                                      onClick={() => handleToggleUnavailableDate(date)} // Use a general toggle function
                                      aria-label={`Verwijder ${format(date, 'PPP', { locale: nl })} van uitzonderingen`}
                                    >
                                        <XCircle className="h-4 w-4 text-destructive"/>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground">Geen uitzonderingen geselecteerd. Klik op de kalender om datums toe te voegen.</p>
                    )}
                </div>
            </div>
             <p className="text-xs text-muted-foreground mt-2">Tip: Klik op een datum in de kalender om deze te selecteren/deselecteren als niet-beschikbaar.</p>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-8">
        <Button onClick={handleSaveAvailability} size="lg">
          <Save className="mr-2 h-4 w-4" />
          Beschikbaarheid Opslaan
        </Button>
      </div>
    </div>
  );
}
