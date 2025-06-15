// src/app/dashboard/tutor/availability/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { ArrowLeft, Clock, Euro, Save, XCircle, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { format, isEqual, startOfDay } from 'date-fns';
import { nl } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface TimeSlot {
  id?: string; // Optional ID for keying in UI lists
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

interface SpecificDateAvailability {
  [dateKey: string]: TimeSlot[]; // dateKey format: "yyyy-MM-dd"
}

const initialWeeklyAvailability: WeeklyAvailability = {
  monday: [{ id: Date.now().toString(), start: '09:00', end: '17:00' }],
  tuesday: [{ id: Date.now().toString(), start: '09:00', end: '17:00' }],
  wednesday: [],
  thursday: [{ id: Date.now().toString(), start: '13:00', end: '18:00' }],
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
  const [isClient, setIsClient] = useState(false);

  // State for specific date overrides
  const [specificDateAvailability, setSpecificDateAvailability] = useState<SpecificDateAvailability>({});
  const [selectedDateForOverride, setSelectedDateForOverride] = useState<Date | undefined>(undefined);
  const [currentSpecificSlots, setCurrentSpecificSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load slots for selected override date
  useEffect(() => {
    if (selectedDateForOverride) {
      const dateKey = format(selectedDateForOverride, 'yyyy-MM-dd');
      setCurrentSpecificSlots(specificDateAvailability[dateKey]?.map(slot => ({...slot, id: slot.id || Date.now().toString() + Math.random() })) || []);
    } else {
      setCurrentSpecificSlots([]);
    }
  }, [selectedDateForOverride, specificDateAvailability]);

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
      [day]: [...prev[day], { id: Date.now().toString(), start: '09:00', end: '17:00' }]
    }));
  };

  const removeTimeSlot = (day: keyof WeeklyAvailability, index: number) => {
    setWeeklyAvailability(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };
  
  const handleToggleUnavailableDate = (date: Date) => {
    const dateOnly = startOfDay(date);
    setUnavailableDates(prev => {
      const isAlreadySelected = prev.some(d => isEqual(startOfDay(d), dateOnly));
      if (isAlreadySelected) {
        return prev.filter(d => !isEqual(startOfDay(d), dateOnly));
      } else {
        return [...prev, dateOnly];
      }
    });
  };

  // Functions for specific date overrides
  const handleSpecificSlotChange = (index: number, field: 'start' | 'end', value: string) => {
    setCurrentSpecificSlots(prev => {
      const newSlots = [...prev];
      newSlots[index] = { ...newSlots[index], [field]: value };
      return newSlots;
    });
  };

  const addSpecificSlot = () => {
    setCurrentSpecificSlots(prev => [...prev, { id: Date.now().toString(), start: '09:00', end: '17:00' }]);
  };

  const removeSpecificSlot = (index: number) => {
    setCurrentSpecificSlots(prev => prev.filter((_, i) => i !== index));
  };

  const saveSpecificDateSlots = () => {
    if (selectedDateForOverride) {
      const dateKey = format(selectedDateForOverride, 'yyyy-MM-dd');
      // Filter out slots where start or end might be empty if user cleared them
      const validSlots = currentSpecificSlots.filter(slot => slot.start && slot.end);
      setSpecificDateAvailability(prev => ({
        ...prev,
        [dateKey]: validSlots,
      }));
      toast({
        title: "Specifieke tijden opgeslagen",
        description: `Beschikbaarheid voor ${format(selectedDateForOverride, 'PPP', { locale: nl })} is bijgewerkt.`,
      });
    }
  };
  
  const clearSpecificDateSlots = () => {
    if (selectedDateForOverride) {
        const dateKey = format(selectedDateForOverride, 'yyyy-MM-dd');
        setSpecificDateAvailability(prev => {
            const newState = {...prev};
            delete newState[dateKey];
            return newState;
        });
        setCurrentSpecificSlots([]);
        toast({
            title: "Specifieke tijden gewist",
            description: `Alle afwijkende tijden voor ${format(selectedDateForOverride, 'PPP', { locale: nl })} zijn verwijderd.`,
        });
    }
  };


  const handleSaveAvailability = () => {
    // Here you would also save specificDateAvailability
    console.log("Saving availability:", { hourlyRate, weeklyAvailability, unavailableDates, specificDateAvailability });
    toast({
      title: "Beschikbaarheid Opgeslagen",
      description: "Je uurtarief, wekelijkse beschikbaarheid en specifieke datum aanpassingen zijn bijgewerkt (simulatie).",
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
                <div key={slot.id || index} className="flex items-center gap-2 mt-2">
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
            <CardTitle>Uitzonderingen: Hele Dagen Niet Beschikbaar</CardTitle>
            <CardDescription>Markeer specifieke datums waarop je de <span className="font-semibold">gehele dag niet</span> beschikbaar bent, ondanks je wekelijkse schema.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {!isClient ? (
                  <Skeleton className="h-[290px] w-[280px] rounded-md border self-start shadow-sm" />
              ) : (
                <Calendar
                    mode="multiple"
                    selected={unavailableDates}
                    onSelect={(dates) => setUnavailableDates(dates || [])} 
                    locale={nl}
                    className="rounded-md border self-start shadow-sm"
                    disabled={{ before: new Date() }} // Only disable past dates
                />
              )}
                <div className="flex-1">
                    <h4 className="font-semibold mb-2">Geselecteerde niet-beschikbare datums:</h4>
                    {unavailableDates.length > 0 ? (
                        <ul className="list-disc list-inside text-sm space-y-1 bg-muted p-3 rounded-md max-h-60 overflow-y-auto">
                            {unavailableDates
                              .sort((a,b) => a.getTime() - b.getTime())
                              .map(date => (
                                <li key={date.toISOString()} className="flex justify-between items-center py-0.5">
                                    {format(date, 'PPP', { locale: nl })}
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-6 w-6" 
                                      onClick={() => handleToggleUnavailableDate(date)}
                                      aria-label={`Verwijder ${format(date, 'PPP', { locale: nl })} van uitzonderingen`}
                                    >
                                        <XCircle className="h-4 w-4 text-destructive"/>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground">Geen hele dagen als niet-beschikbaar gemarkeerd.</p>
                    )}
                </div>
            </div>
             <p className="text-xs text-muted-foreground mt-2">Tip: Klik op een datum in de kalender om deze te selecteren/deselecteren als een volledig niet-beschikbare dag.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Specifieke Beschikbaarheid per Datum</CardTitle>
          <CardDescription>Stel afwijkende beschikbare tijden in voor specifieke datums. Deze overschrijven je wekelijkse rooster en "hele dag niet beschikbaar" voor die dag.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <Label>Kies een datum om aan te passen:</Label>
              {!isClient ? (
                <Skeleton className="h-[290px] w-full rounded-md border mt-1" />
              ) : (
                <Calendar
                  mode="single"
                  selected={selectedDateForOverride}
                  onSelect={setSelectedDateForOverride}
                  locale={nl}
                  className="rounded-md border mt-1 shadow-sm"
                  disabled={{ before: new Date() }}
                />
              )}
            </div>
            {selectedDateForOverride && (
              <div className="md:w-1/2 space-y-4">
                <h4 className="font-semibold text-lg">
                  Beschikbare tijden voor: {format(selectedDateForOverride, 'PPP', { locale: nl })}
                </h4>
                {currentSpecificSlots.length === 0 && (
                  <p className="text-sm text-muted-foreground">Nog geen specifieke tijden ingesteld voor deze datum.</p>
                )}
                {currentSpecificSlots.map((slot, index) => (
                  <div key={slot.id || index} className="flex items-center gap-2">
                    <Input type="time" value={slot.start} onChange={(e) => handleSpecificSlotChange(index, 'start', e.target.value)} className="w-2/5" />
                    <span>-</span>
                    <Input type="time" value={slot.end} onChange={(e) => handleSpecificSlotChange(index, 'end', e.target.value)} className="w-2/5" />
                    <Button variant="ghost" size="icon" onClick={() => removeSpecificSlot(index)} aria-label="Verwijder tijdslot">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={addSpecificSlot}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Tijdslot Toevoegen
                  </Button>
                  <Button size="sm" onClick={saveSpecificDateSlots}>
                    Tijden Opslaan
                  </Button>
                </div>
                {specificDateAvailability[format(selectedDateForOverride, 'yyyy-MM-dd')] && (
                    <Button variant="link" size="sm" onClick={clearSpecificDateSlots} className="text-destructive p-0 h-auto">
                        Wis specifieke tijden voor deze datum
                    </Button>
                )}
              </div>
            )}
          </div>
           <div className="mt-4 pt-4 border-t">
            <h4 className="font-semibold mb-2">Datums met afwijkende beschikbaarheid:</h4>
            {Object.keys(specificDateAvailability).filter(key => specificDateAvailability[key].length > 0).length > 0 ? (
                <ul className="list-disc list-inside text-sm space-y-1">
                    {Object.entries(specificDateAvailability)
                        .filter(([_, slots]) => slots.length > 0)
                        .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
                        .map(([dateKey, slots]) => (
                            <li key={dateKey}>
                                {format(new Date(dateKey + 'T00:00:00'), 'PPP', { locale: nl })}: {slots.map(s => `${s.start}-${s.end}`).join(', ')}
                                <Button variant="link" size="sm" onClick={() => setSelectedDateForOverride(new Date(dateKey + 'T00:00:00'))} className="ml-2 p-0 h-auto text-xs">
                                    (Bewerk)
                                </Button>
                            </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-muted-foreground">Nog geen datums met specifieke tijden ingesteld.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-8">
        <Button onClick={handleSaveAvailability} size="lg">
          <Save className="mr-2 h-4 w-4" />
          Alle Wijzigingen Opslaan
        </Button>
      </div>
    </div>
  );
}
