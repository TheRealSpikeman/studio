// src/app/dashboard/coaching/settings/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, CalendarPlus } from '@/lib/icons'; 
import { useState } from 'react';

export default function CoachingSettingsPage() {
  const [receiveDailyEmails, setReceiveDailyEmails] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [affirmationTiming, setAffirmationTiming] = useState("08:00");
  
  const { toast } = useToast();

  const handleEmailPreferenceChange = (checked: boolean) => {
    setReceiveDailyEmails(checked);
    toast({
      title: "E-mailvoorkeur bijgewerkt",
      description: checked 
        ? "Je ontvangt nu dagelijkse coaching tips per e-mail." 
        : "Je ontvangt geen dagelijkse coaching tips meer per e-mail.",
    });
  };

  const handlePushNotificationChange = (checked: boolean) => {
    setPushNotifications(checked);
    toast({
      title: "Push Notificatie voorkeur bijgewerkt",
      description: checked
        ? "Push notificaties voor taken zijn ingeschakeld."
        : "Push notificaties voor taken zijn uitgeschakeld.",
    });
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <SettingsIcon className="h-7 w-7" />
          Coaching Instellingen
        </h1>
        <p className="text-muted-foreground">
          Beheer hier je voorkeuren voor de dagelijkse coaching.
        </p>
      </section>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Notificaties & Herinneringen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-3 rounded-md border">
            <div className="space-y-0.5">
                <Label htmlFor="daily-email-toggle" className="text-base">Dagelijkse Tips per E-mail</Label>
                <p className="text-xs text-muted-foreground">Ontvang elke dag een nieuwe coaching tip direct in je inbox.</p>
            </div>
            <Switch 
              id="daily-email-toggle" 
              checked={receiveDailyEmails}
              onCheckedChange={handleEmailPreferenceChange}
              aria-label="Ontvang dagelijkse coaching tips per e-mail"
            />
          </div>
           <div className="flex items-center justify-between p-3 rounded-md border">
            <div className="space-y-0.5">
                <Label htmlFor="push-notification-toggle" className="text-base">Push Notificaties voor Taken</Label>
                <p className="text-xs text-muted-foreground">Krijg reminders voor je dagelijkse microtaken.</p>
            </div>
            <Switch 
              id="push-notification-toggle" 
              checked={pushNotifications}
              onCheckedChange={handlePushNotificationChange}
              aria-label="Push notificaties voor taken"
            />
          </div>
          <div className="p-3 rounded-md border space-y-2">
            <Label htmlFor="affirmation-timing" className="text-base">Timing Ochtend Affirmatie</Label>
            <Select value={affirmationTiming} onValueChange={setAffirmationTiming}>
              <SelectTrigger id="affirmation-timing">
                <SelectValue placeholder="Kies een tijd" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="07:00">07:00</SelectItem>
                <SelectItem value="07:30">07:30</SelectItem>
                <SelectItem value="08:00">08:00</SelectItem>
                <SelectItem value="08:30">08:30</SelectItem>
                <SelectItem value="09:00">09:00</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Kies wanneer je je dagelijkse affirmatie wilt ontvangen.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">Integraties</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="p-3 rounded-md border space-y-2">
            <Label className="text-base">Synchroniseer Taken met Kalender</Label>
            <div className="flex gap-2">
                <Button variant="outline" disabled><CalendarPlus className="mr-2 h-4 w-4"/> Google Calendar (binnenkort)</Button>
                <Button variant="outline" disabled><CalendarPlus className="mr-2 h-4 w-4"/> Outlook Agenda (binnenkort)</Button>
            </div>
             <p className="text-xs text-muted-foreground">Voeg je coaching-taken automatisch toe aan je favoriete agenda.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
