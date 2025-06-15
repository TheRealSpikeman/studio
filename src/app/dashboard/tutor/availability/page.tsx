// src/app/dashboard/tutor/availability/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Clock, Euro, Save, XCircle, PlusCircle, Trash2, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { format, isEqual, startOfDay, addDays, startOfWeek, getDay } from 'date-fns';
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
const dayKeys = Object.keys(dayLabels) as Array<keyof WeeklyAvailability>;


export default function TutorAvailabilityPage() {
  const { toast } = useToast();
  const [hourlyRate, setHourlyRate] = useState<number | string>(25);
  const [weeklyAvailability, setWeeklyAvailability] = useState<WeeklyAvailability>(initialWeeklyAvailability);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [isClient, setIsClient] = useState(false);

  // State for specific date overrides
  const [specificDateAvailability, setSpecificDateAvailability] = useState<SpecificDateAvailability>({});
  const [selectedDateForWeekEditing, setSelectedDateForWeekEditing] = useState<Date | undefined>(undefined);
  const [currentEditingWeekMonday, setCurrentEditingWeekMonday] = useState<Date | null>(null);
  const [activeTabDateKey, setActiveTabDateKey] = useState<string | null>(null);
  const [slotsForActiveTab, setSlotsForActiveTab] = useState<TimeSlot[]>([]);


  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (selectedDateForWeekEditing) {
      const monday = startOfWeek(selectedDateForWeekEditing, { weekStartsOn: 1 });
      setCurrentEditingWeekMonday(monday);
      // Set the initial active tab to the selected day, or Monday if not directly applicable
      const dayIndex = (getDay(selectedDateForWeekEditing) + 6) % 7; // Monday is 0
      const initialTabDate = addDays(monday, dayIndex);
      setActiveTabDateKey(format(initialTabDate, 'yyyy-MM-dd'));
    } else {
      setCurrentEditingWeekMonday(null);
      setActiveTabDateKey(null);
    }
  }, [selectedDateForWeekEditing]);

  useEffect(() => {
    if (activeTabDateKey) {
      setSlotsForActiveTab(specificDateAvailability[activeTabDateKey]?.map(slot => ({...slot, id: slot.id || Date.now().toString() + Math.random()})) || []);
    } else {
      setSlotsForActiveTab([]);
    }
  }, [activeTabDateKey, specificDateAvailability]);


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

  // Functions for specific date overrides (now per tab/day)
  const handleSpecificSlotChangeForTab = (index: number, field: 'start' | 'end', value: string) => {
    setSlotsForActiveTab(prev => {
      const newSlots = [...prev];
      newSlots[index] = { ...newSlots[index], [field]: value };
      return newSlots;
    });
  };

  const addSpecificSlotForTab = () => {
    setSlotsForActiveTab(prev => [...prev, { id: Date.now().toString(), start: '09:00', end: '17:00' }]);
  };

  const removeSpecificSlotForTab = (index: number) => {
    setSlotsForActiveTab(prev => prev.filter((_, i) => i !== index));
  };

  const saveSlotsForActiveTab = () => {
    if (activeTabDateKey) {
      const validSlots = slotsForActiveTab.filter(slot => slot.start && slot.end);
      setSpecificDateAvailability(prev => ({
        ...prev,
        [activeTabDateKey as string]: validSlots,
      }));
      toast({
        title: "Specifieke tijden opgeslagen",
        description: `Beschikbaarheid voor ${format(new Date(activeTabDateKey as string), 'PPP', { locale: nl })} is bijgewerkt.`,
      });
    }
  };
  
  const clearSlotsForActiveTab = () => {
    if (activeTabDateKey) {
        setSpecificDateAvailability(prev => {
            const newState = {...prev};
            delete newState[activeTabDateKey as string];
            return newState;
        });
        setSlotsForActiveTab([]); // Clear UI for current tab
        toast({
            title: "Specifieke tijden gewist",
            description: `Alle afwijkende tijden voor ${format(new Date(activeTabDateKey as string), 'PPP', { locale: nl })} zijn verwijderd.`,
        });
    }
  };

  const handleSaveAvailability = () => {
    console.log("Saving availability:", { hourlyRate, weeklyAvailability, unavailableDates, specificDateAvailability });
    toast({
      title: "Beschikbaarheid Opgeslagen",
      description: "Je uurtarief, wekelijkse beschikbaarheid en specifieke datum aanpassingen zijn bijgewerkt (simulatie).",
    });
  };
  
  const getDayLabelForTabIndex = (index: number) : string => {
    return dayLabels[dayKeys[index]];
  }

  const getDateForTabIndex = (index: number): Date | null => {
    if (!currentEditingWeekMonday) return null;
    return addDays(currentEditingWeekMonday, index);
  }
  
  const getDefaultActiveTabKey = (): string | undefined => {
    if (!selectedDateForWeekEditing || !currentEditingWeekMonday) return undefined;
    const dayIndexInWeek = (getDay(selectedDateForWeekEditing) + 6) % 7; // Monday = 0
    const dateForTab = addDays(currentEditingWeekMonday, dayIndexInWeek);
    return format(dateForTab, 'yyyy-MM-dd');
  }


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
          <CardTitle>Wekelijkse Standaard Beschikbaarheid</CardTitle>
          <CardDescription>Stel je reguliere wekelijkse beschikbaarheid in. Leerlingen kunnen binnen deze tijden sessies boeken.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {dayKeys.map((day) => (
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
            <CardDescription>Markeer specifieke datums waarop je de <span className="font-semibold">gehele dag niet</span> beschikbaar bent, ondanks je standaard wekelijkse schema. Deze instelling wordt overschreven als je voor diezelfde dag afwijkende tijden instelt in de sectie hieronder.</CardDescription>
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
                    className="rounded-md border self-start shadow-sm w-max" 
                    disabled={isClient ? { before: startOfDay(new Date()) } : undefined}
                    initialFocus={isClient} 
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
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Afwijkende Beschikbaarheid per Week</CardTitle>
          <CardDescription>Selecteer een datum in de kalender om de beschikbaarheid voor die specifieke week aan te passen. Deze tijden overschrijven je standaard rooster en "hele dag niet beschikbaar" voor die dagen.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="self-start flex-shrink-0"> 
              <Label>Kies een datum om de week te selecteren:</Label>
              {!isClient ? (
                <Skeleton className="h-[290px] w-[280px] rounded-md border mt-1" />
              ) : (
                <Calendar
                  mode="single"
                  selected={selectedDateForWeekEditing}
                  onSelect={setSelectedDateForWeekEditing}
                  locale={nl}
                  className="rounded-md border mt-1 shadow-sm w-max"
                  disabled={isClient ? { before: startOfDay(new Date()) } : undefined}
                  footer={selectedDateForWeekEditing ? `Geselecteerde week: ${format(startOfWeek(selectedDateForWeekEditing, { weekStartsOn: 1 }), 'PPP', { locale: nl })} - ${format(addDays(startOfWeek(selectedDateForWeekEditing, { weekStartsOn: 1 }), 6), 'PPP', { locale: nl })}` : 'Selecteer een dag om de week te zien.'}
                  initialFocus={isClient} // Only set initialFocus on client
                />
              )}
            </div>
            
            {currentEditingWeekMonday && (
              <div className="flex-1 min-w-0"> {/* Ensure this div can shrink and grow */}
                <Tabs 
                  defaultValue={getDefaultActiveTabKey()} 
                  onValueChange={setActiveTabDateKey}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-7 mb-4">
                    {dayKeys.map((dayKey, index) => {
                      const dateForTab = getDateForTabIndex(index);
                      if (!dateForTab) return null;
                      const dateKeyForTab = format(dateForTab, 'yyyy-MM-dd');
                      return (
                        <TabsTrigger key={dateKeyForTab} value={dateKeyForTab} className="text-xs px-2 sm:px-3">
                          {getDayLabelForTabIndex(index).substring(0,2)} ({format(dateForTab, 'd MMM')})
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  {dayKeys.map((dayKey, index) => {
                     const dateForTab = getDateForTabIndex(index);
                     if (!dateForTab) return null;
                     const dateKeyForTab = format(dateForTab, 'yyyy-MM-dd');
                     return (
                        <TabsContent key={dateKeyForTab} value={dateKeyForTab} className="mt-0">
                            <div className="space-y-3 p-4 border rounded-md bg-muted/30">
                            <h4 className="font-semibold">
                                Tijdslots voor {getDayLabelForTabIndex(index)} - {format(dateForTab, 'PPP', { locale: nl })}
                            </h4>
                            {slotsForActiveTab.length === 0 && activeTabDateKey === dateKeyForTab && (
                                <p className="text-sm text-muted-foreground">Geen specifieke tijden ingesteld voor deze dag. Standaard weekrooster is van toepassing.</p>
                            )}
                            {activeTabDateKey === dateKeyForTab && slotsForActiveTab.map((slot, slotIndex) => (
                                <div key={slot.id || slotIndex} className="flex items-center gap-2">
                                <Input type="time" value={slot.start} onChange={(e) => handleSpecificSlotChangeForTab(slotIndex, 'start', e.target.value)} className="w-2/5" />
                                <span>-</span>
                                <Input type="time" value={slot.end} onChange={(e) => handleSpecificSlotChangeForTab(slotIndex, 'end', e.target.value)} className="w-2/5" />
                                <Button variant="ghost" size="icon" onClick={() => removeSpecificSlotForTab(slotIndex)} aria-label="Verwijder tijdslot">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                                </div>
                            ))}
                            {activeTabDateKey === dateKeyForTab && (
                                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                    <Button variant="outline" size="sm" onClick={addSpecificSlotForTab}>
                                        <PlusCircle className="mr-2 h-4 w-4" /> Tijdslot Toevoegen
                                    </Button>
                                    <Button size="sm" onClick={saveSlotsForActiveTab} disabled={slotsForActiveTab.length === 0 && !specificDateAvailability[activeTabDateKey]}>
                                        Tijden Opslaan
                                    </Button>
                                    {specificDateAvailability[activeTabDateKey] && specificDateAvailability[activeTabDateKey]!.length > 0 && (
                                        <Button variant="link" size="sm" onClick={clearSlotsForActiveTab} className="text-destructive p-0 h-auto mt-2 sm:mt-0 sm:ml-auto">
                                            Wis specifieke tijden voor deze dag
                                        </Button>
                                    )}
                                </div>
                            )}
                            </div>
                        </TabsContent>
                     );
                  })}
                </Tabs>
              </div>
            )}
          </div>

           <div className="mt-6 pt-6 border-t">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                Overzicht: Datums met Afwijkende Beschikbaarheid
            </h4>
            {Object.keys(specificDateAvailability).filter(key => specificDateAvailability[key] && specificDateAvailability[key]!.length > 0).length > 0 ? (
                <ul className="list-disc list-inside text-sm space-y-1 bg-muted/50 p-3 rounded-md max-h-48 overflow-y-auto">
                    {Object.entries(specificDateAvailability)
                        .filter(([_, slots]) => slots && slots.length > 0)
                        .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
                        .map(([dateKey, slots]) => (
                            <li key={dateKey}>
                                <strong>{format(new Date(dateKey + 'T00:00:00'), 'PPP', { locale: nl })}:</strong> {slots!.map(s => `${s.start}-${s.end}`).join(', ')}
                                <Button variant="link" size="sm" onClick={() => setSelectedDateForWeekEditing(new Date(dateKey + 'T00:00:00'))} className="ml-2 p-0 h-auto text-xs">
                                    (Bewerk week)
                                </Button>
                            </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-muted-foreground">Nog geen datums met specifieke afwijkende tijden ingesteld.</p>
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
